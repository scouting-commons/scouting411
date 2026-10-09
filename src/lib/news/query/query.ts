import { readPosts } from "@/lib/news/query/read";
import type { PaginatedResults, QueryInput } from "@/lib/news/query/types";
import { resolveQuery } from "@/lib/news/query/resolve";

export async function queryPosts(input: QueryInput): Promise<PaginatedResults> {
	const query = resolveQuery(input);

	const { posts, totalItems } = await readPosts(query);

	// unpaginated, every match is one page sized to fit
	const { page, maxPageSize } =
		query.paginate === false
			? { page: 1, maxPageSize: Math.max(totalItems, 1) }
			: query.paginate;

	const firstItemIndex = (page - 1) * maxPageSize;

	return {
		posts,
		pagination: {
			page,
			maxPageSize,
			pageSize: posts.length,
			firstItemIndex,
			lastItemIndex: Math.min(firstItemIndex + maxPageSize, totalItems) - 1,
			totalItems,
			totalPages: Math.ceil(totalItems / maxPageSize),
		},
	};
}
