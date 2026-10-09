import { readPosts } from "@/lib/news/db/ops";
import { sortPosts } from "@/lib/news/query/sort";
import { paginateArray, type PaginatedResults } from "@/util/paginateArray";
import { filterPosts } from "@/lib/news/query/filter";
import type { Post } from "@/lib/news/feeds/post";
import type { QueryInput } from "@/lib/news/query/types";
import { resolveQuery } from "@/lib/news/query/resolve";

export async function queryPosts(
	input: QueryInput,
): Promise<PaginatedResults<Post>> {
	const query = resolveQuery(input);

	const posts = await readPosts(query.feeds);

	const filteredPosts = filterPosts(posts, query.filter);

	const sortedPosts = sortPosts(filteredPosts, query.sort);

	return paginateArray(sortedPosts, query.paginate);
}
