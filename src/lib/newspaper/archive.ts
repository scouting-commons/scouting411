import type { Post } from "@/lib/news/post";
import { compileIssue } from "@/lib/newspaper/compile";
import { rateByRecency } from "@/lib/newspaper/rank";
import { issueDateFor } from "@/lib/newspaper/schedule";
import type { Issue } from "@/lib/newspaper/types";

/**
 * compiles every published issue these posts ran in. keeps the order of
 * `posts`, so newest-first posts give newest-first issues. stories are
 * ranked by recency, not by jev: scoring every story of every issue is too
 * many model calls for one page
 */
export function getNewspaperArchive(posts: Post[]): Promise<Issue[]> {
	return Promise.all(
		[...Map.groupBy(posts, (post) => issueDateFor(post.date))].flatMap(
			([date, issuePosts]) =>
				date ? [compileIssue(date, issuePosts, rateByRecency)] : [],
		),
	);
}
