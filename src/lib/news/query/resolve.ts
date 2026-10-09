import { z } from "zod";
import { feedSlugs } from "@/lib/news/feeds/types";
import {
	type QueryInput,
	filterOptsSchema,
	paginateOptsSchema,
	queryInputSchema,
	sortOptsSchema,
} from "@/lib/news/query/types";

/**
 * the input schema with a default for everything the caller can leave out.
 * modules use `prefault` rather than `default` so a missing module is parsed as
 * an empty object and picks up its fields' defaults, instead of skipping them
 */
const resolvedQuerySchema = queryInputSchema.extend({
	// an empty selection is no restriction, the same as leaving it out
	feeds: queryInputSchema.shape.feeds.transform((feeds) =>
		feeds?.length ? feeds : feedSlugs,
	),
	filter: filterOptsSchema.prefault({}),
	sort: sortOptsSchema
		.extend({
			mode: sortOptsSchema.shape.mode.default("date"),
			direction: sortOptsSchema.shape.direction.default("desc"),
		})
		.prefault({}),
	paginate: z
		.union([
			z.literal(false),
			paginateOptsSchema.extend({
				page: paginateOptsSchema.shape.page.default(1),
				maxPageSize: paginateOptsSchema.shape.maxPageSize.default(20),
			}),
		])
		.prefault({}),
});

/** a query with every field filled in */
export type ResolvedQuery = z.output<typeof resolvedQuerySchema>;

/** fill in the defaults for everything the caller left out */
export function resolveQuery(input: QueryInput): ResolvedQuery {
	return resolvedQuerySchema.parse(input);
}
