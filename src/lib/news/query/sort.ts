import { z } from "zod";
import type { Post } from "@/lib/news/post";
import type { ResolvedQuery } from "@/lib/news/query/resolve";

export function sortPosts(posts: Post[], opts: ResolvedQuery["sort"]) {
	let sortedPosts;

	switch (opts.mode) {
		case "date":
			sortedPosts = posts.toSorted(
				(a, b) => a.date.getTime() - b.date.getTime(),
			);
			break;
		default:
			return posts;
	}

	if (opts.direction === "desc") {
		sortedPosts.reverse();
	}

	return sortedPosts;
}

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
