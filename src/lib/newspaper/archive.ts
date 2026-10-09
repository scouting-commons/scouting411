import type { Post } from "@/lib/news/post";
import { compileIssue } from "@/lib/newspaper/compile";
import { issueDateFor } from "@/lib/newspaper/schedule";
import type { Issue } from "@/lib/newspaper/types";

/**
 * compiles every published issue these posts ran in. keeps the order of
 * `posts`, so newest-first posts give newest-first issues.
 */
export function getNewspaperArchive(posts: Post[]): Issue[] {
	return [...Map.groupBy(posts, (post) => issueDateFor(post.date))].flatMap(
		([date, issuePosts]) => (date ? [compileIssue(date, issuePosts)] : []),
	);
}
