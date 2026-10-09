import { z } from "zod";
import { feedSlugSchema } from "@/lib/news/feeds/types";
import type { Post } from "@/lib/news/post";

export const filterOptsSchema = z
	.object({
		keyword: z
			.string()
			.optional()
			.describe(
				"Get only posts that contain this string in their title or description. Case insensitive.",
			),
		from: z.iso
			.date()
			.optional()
			.describe(
				"Get only posts published on or after this date (YYYY-MM-DD, UTC).",
			),
		to: z.iso
			.date()
			.optional()
			.describe(
				"Get only posts published on or before this date (YYYY-MM-DD, UTC).",
			),
	})
	.strict();

export const sortOptsSchema = z.object({
	mode: z
		.enum(["date"])
		.optional()
		.describe("The sort mode. Defaults to date."),
	direction: z
		.enum(["asc", "desc"])
		.optional()
		.describe("The sort direction. Defaults to desc."),
});

export const paginateOptsSchema = z.object({
	maxPageSize: z.coerce
		.number()
		.min(1)
		.describe("The number of items per page. This value has no maximum."),
	page: z.coerce.number().min(1).describe("The page number"),
});

/**
 * a query as the caller wrote it. every field is optional and the schema fills
 * in nothing — defaults are applied by `resolveQuery`, so the input stays as
 * sparse as it was given (which is what keeps browse urls short)
 */
export type QueryInput = z.infer<typeof queryInputSchema>;
export const queryInputSchema = z.object({
	feeds: z
		.array(feedSlugSchema)
		.optional()
		.describe(
			"Include results only from these sources. Omit or pass an empty array to include every source.",
		),
	filter: filterOptsSchema.optional(),
	sort: sortOptsSchema.optional(),
	paginate: z
		.union([z.literal(false), paginateOptsSchema.partial()])
		.optional()
		.describe(
			"Page defaults to 1 and maxPageSize to 20. Pass false to return every matching post as a single page.",
		),
});

/** one page of query results */
export type PaginatedResults = {
	posts: Post[];
	pagination: {
		/** the current page number */
		page: number;
		/** the maximum number of items per page */
		maxPageSize: number;
		/** the number of items on the current page */
		pageSize: number;
		/** the start index of the items on this page */
		firstItemIndex: number;
		/** the end index of the items on this page */
		lastItemIndex: number;
		/** the total number of items */
		totalItems: number;
		/** the total number of pages */
		totalPages: number;
	};
};
