import { defaultFilter } from "cmdk";
import type { SearchItem } from "@/lib/search/types";

/**
 * a match on anything but the name counts for less, so an item named for the query
 * outranks one that only mentions it — "camping" finds the Camping merit badge before
 * a feed whose description says camping
 */
const secondaryWeight = 0.8;

/**
 * matches scoring below this are dropped. the scorer is fuzzy, so any item holding the
 * query's letters in order scores something — "camping" matches "Champions for Nature"
 * at 0.025 — and that long tail is noise
 */
const minScore = 0.1;

/**
 * types ranked after every other match, whatever their score. awards are numerous and
 * mostly obscure, so they'd otherwise crowd out ranks and merit badges
 */
const demotedTypes: SearchItem["type"][] = ["award"];

/** the fields `searchItems` scores. anything carrying them can be searched */
type Searchable = Pick<SearchItem, "name" | "keywords" | "description"> & {
	type?: SearchItem["type"];
};

/**
 * rank items against a query, best match first and demoted types last. weak matches are
 * dropped, and ties keep their input order. pure and safe for the browser, so the
 * palette can run it locally over the same items the server searches
 */
export function searchItems<T extends Searchable>(
	items: T[],
	query: string,
	opts: { limit?: number | undefined } = {},
): (T & { score: number })[] {
	const search = query.trim();
	if (!search) return [];

	const results = items
		.map((item) => ({ ...item, score: scoreItem(item, search) }))
		.filter((result) => result.score >= minScore)
		// sort is stable, so equal scores stay in registry order
		.sort(
			(a, b) =>
				Number(isDemoted(a)) - Number(isDemoted(b)) || b.score - a.score,
		);

	return opts.limit === undefined ? results : results.slice(0, opts.limit);
}

function isDemoted(item: Searchable) {
	return item.type !== undefined && demotedTypes.includes(item.type);
}

/** score one item using cmdk's fuzzy scorer */
function scoreItem(item: Searchable, search: string) {
	const nameScore = defaultFilter(item.name, search);
	const secondaryScore = defaultFilter(
		[...item.keywords, item.description ?? ""].join(" "),
		search,
	);

	return Math.max(nameScore, secondaryScore * secondaryWeight);
}
