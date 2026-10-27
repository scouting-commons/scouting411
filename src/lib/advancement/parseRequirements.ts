import type { Requirement } from "@/lib/advancement/requirements";
import sanitizeHtml from "sanitize-html";

/**
 * the requirement fields every advancement type's requirements endpoint
 * shares. most send every value as a string, but adventures (and awards asked
 * for a specific version) send real numbers and nulls
 */
type UpstreamRequirement = {
	id: string | number;
	name: string;
	listNumber: UpstreamValue;
	sortOrder: UpstreamValue;
	childrenRequired: UpstreamValue;
	parentRequirementId: UpstreamValue;
	footer: UpstreamValue;
};

type UpstreamValue = string | number | null;

/** an upstream value as a string, with null as blank */
function text(value: UpstreamValue) {
	return value === null ? "" : String(value);
}

/** a requirement as parsed from upstream, before it is ordered */
type UnorderedRequirement = Omit<
	Requirement,
	"depth" | "parentId" | "choose"
> & {
	parentId: string | undefined;
	/** sorts the requirement among its siblings */
	sortOrder: number;
	/** how many of the requirement's children must be completed */
	childrenRequired: number | undefined;
};

/** an ordered requirement, keeping any fields beyond the shared ones */
type OrderedRequirement<T extends UnorderedRequirement> = Requirement &
	Omit<T, keyof UnorderedRequirement>;

/** normalize one of upstream's requirements, ready for `orderRequirements` */
export function parseRequirement(
	requirement: UpstreamRequirement,
): UnorderedRequirement {
	return {
		id: String(requirement.id),
		parentId: text(requirement.parentRequirementId) || undefined,
		// blank sorts first, alongside the other notes. siblings that are all
		// blank keep upstream's order, which is right in that case
		sortOrder: Number(requirement.sortOrder) || 0,
		label: text(requirement.listNumber) || undefined,
		html: sanitizeRequirementHtml(requirement.name),
		footerHtml: sanitizeRequirementHtml(text(requirement.footer)) || undefined,
		childrenRequired: text(requirement.childrenRequired)
			? Number(requirement.childrenRequired)
			: undefined,
	};
}

/**
 * order upstream's flat requirement list depth-first, with siblings sorted by
 * `sortOrder`. upstream's array order is not reliable, and neither is sorting
 * `sortOrder` segment by segment - it is a decimal ("1.05" comes before "1.1",
 * "3.1" after "3.09").
 *
 * fields beyond the shared ones, like a merit badge's `counselorApproval`,
 * are passed through
 */
export function orderRequirements<T extends UnorderedRequirement>(
	requirements: T[],
): OrderedRequirement<T>[] {
	const ids = new Set(requirements.map((requirement) => requirement.id));

	const childrenOf = Map.groupBy(requirements, (requirement) =>
		// an orphan is shown at the top level rather than dropped
		requirement.parentId && ids.has(requirement.parentId)
			? requirement.parentId
			: undefined,
	);

	const ordered: OrderedRequirement<T>[] = [];

	const visit = (parentId: string | undefined, depth: number) => {
		const children = (childrenOf.get(parentId) ?? []).toSorted(
			(a, b) => a.sortOrder - b.sortOrder,
		);

		for (const requirement of children) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { sortOrder, childrenRequired, ...rest } = requirement;
			const childCount = childrenOf.get(requirement.id)?.length ?? 0;

			// typescript can't follow the spread of a generic through Omit
			ordered.push({
				...rest,
				parentId,
				depth,
				choose:
					childrenRequired !== undefined && childrenRequired < childCount
						? childrenRequired
						: undefined,
			} as OrderedRequirement<T>);

			visit(requirement.id, depth + 1);
		}
	};

	visit(undefined, 0);

	return ordered;
}

/**
 * upstream requirement text is hand-written html - resource links in
 * `<details>` blocks, emphasis, the odd list, and some malformed tags. keep the
 * formatting, drop everything else, and open links in a new tab
 */
export function sanitizeRequirementHtml(html: string) {
	return (
		sanitizeHtml(html, {
			allowedTags: [
				"a",
				"br",
				"b",
				"strong",
				"i",
				"em",
				"u",
				"sup",
				"sub",
				"ul",
				"ol",
				"li",
				"details",
				"summary",
			],
			allowedAttributes: { a: ["href", "target", "rel"] },
			allowedSchemes: ["http", "https"],
			transformTags: {
				a: sanitizeHtml.simpleTransform("a", {
					target: "_blank",
					rel: "noopener noreferrer",
				}),
			},
		})
			// details is already a block, so a break before it only adds a blank line
			.replace(/(\s|<br \/>)+<details>/g, "<details>")
			.replace(/^(\s|<br \/>)+|(\s|<br \/>)+$/g, "")
			.trim()
	);
}
