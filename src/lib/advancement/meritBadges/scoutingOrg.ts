import { z } from "zod";
import { plainText } from "@/lib/advancement/upstream";
import { arrayHasDupes } from "@/util/arrayDupeCheck";

/**
 * scouting.org's merit badge pages are a wordpress custom post type. the REST
 * index carries each page's slug, link, and topic groups, but not its content
 * - that's rendered from ACF fields the api doesn't expose
 */
const apiUrl = "https://www.scouting.org/wp-json/wp/v2";

/**
 * our slug -> scouting.org's slug, for badges whose page slug isn't derived
 * from the advancement api's name
 */
const pageSlugAliases: Record<string, string> = {
	"artificial-intelligence-ai": "artificial-intelligence",
	"fish-and-wildlife-management": "fish-wildlife-management",
	"military-service-and-veterans": "military-service-veterans",
};

type MeritBadgePage = {
	url: string;
	/** the names of the topic groups the page is filed under */
	groups: string[];
};

/**
 * look up each badge's page on scouting.org, keyed by our slug. throws if any
 * badge has no page or a page has no groups, so missing data fails the ingest
 * rather than shipping without it
 */
export async function fetchMeritBadgePages(
	slugs: string[],
): Promise<Map<string, MeritBadgePage>> {
	const [pages, groups] = await Promise.all([
		fetchAll("mb-page-template", "slug,link,mb_card_grouping", pageSchema),
		fetchAll("mb_card_grouping", "id,name", groupSchema),
	]);

	if (arrayHasDupes(pages.map((page) => page.slug))) {
		throw new Error("two scouting.org merit badge pages share a slug");
	}

	const staleAliases = Object.keys(pageSlugAliases).filter(
		(slug) => !slugs.includes(slug),
	);

	if (staleAliases.length > 0) {
		throw new Error(
			`scouting.org page aliases for merit badges that no longer exist: ${staleAliases.join(", ")}`,
		);
	}

	const groupsById = new Map(
		groups.map((group) => [group.id, plainText(group.name)]),
	);
	const pagesBySlug = new Map(pages.map((page) => [page.slug, page]));
	const result = new Map<string, MeritBadgePage>();
	const missing: string[] = [];

	for (const slug of slugs) {
		const page = pagesBySlug.get(pageSlugAliases[slug] ?? slug);

		if (!page) {
			missing.push(slug);
			continue;
		}

		if (page.mb_card_grouping.length === 0) {
			throw new Error(
				`scouting.org page for merit badge ${slug} has no groups`,
			);
		}

		result.set(slug, {
			url: page.link,
			groups: page.mb_card_grouping.map((id) => {
				const group = groupsById.get(id);

				if (!group) {
					throw new Error(
						`scouting.org page for merit badge ${slug} has unknown group ${id}`,
					);
				}

				return group;
			}),
		});
	}

	if (missing.length > 0) {
		throw new Error(
			`no scouting.org page for merit badges: ${missing.join(", ")}`,
		);
	}

	return result;
}

/** fetch every page of a REST collection */
async function fetchAll<T extends z.ZodType>(
	path: string,
	fields: string,
	itemSchema: T,
): Promise<z.infer<T>[]> {
	const firstPage = await fetchPage(path, fields, itemSchema, 1);

	const remainingPages = await Promise.all(
		Array.from({ length: firstPage.totalPages - 1 }, (_, i) =>
			fetchPage(path, fields, itemSchema, i + 2),
		),
	);

	const items = [firstPage, ...remainingPages].flatMap((page) => page.items);

	if (items.length !== firstPage.total) {
		throw new Error(
			`scouting.org ${path} reported ${firstPage.total} items but returned ${items.length}`,
		);
	}

	return items;
}

async function fetchPage<T extends z.ZodType>(
	path: string,
	fields: string,
	itemSchema: T,
	page: number,
) {
	const params = new URLSearchParams({
		page: String(page),
		per_page: "100",
		_fields: fields,
	});
	const url = `${apiUrl}/${path}?${params.toString()}`;
	const response = await fetch(url);

	if (response.status !== 200) {
		throw new Error(`failed to fetch ${url} - status code ${response.status}`);
	}

	return {
		items: z.array(itemSchema).parse(await response.json()),
		...paginationHeadersSchema.parse({
			total: response.headers.get("x-wp-total"),
			totalPages: response.headers.get("x-wp-totalpages"),
		}),
	};
}

/** the fields used from the mb-page-template index */
const pageSchema = z.object({
	slug: z.string(),
	link: z.url({ protocol: /^https$/ }),
	mb_card_grouping: z.array(z.number().int()),
});

/** the fields used from the mb_card_grouping taxonomy */
const groupSchema = z.object({
	id: z.number().int(),
	name: z.string(),
});

const paginationHeadersSchema = z.object({
	total: z.coerce.number().int().positive(),
	totalPages: z.coerce.number().int().positive(),
});
