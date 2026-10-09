import type { Post } from "@/lib/news/post";
import { toIsoDate, type IsoDate } from "@/lib/newspaper/dates";
import { weekOf } from "@/lib/newspaper/schedule";
import type { Issue } from "@/lib/newspaper/types";

/** lays out the issue on `date` from its week's posts, newest first */
export function compileIssue(date: IsoDate, posts: Post[]): Issue {
	const lead = posts.find((post) => post.thumbnail) ?? posts[0];

	const days = [
		...Map.groupBy(
			posts.filter((post) => post !== lead),
			(post) => toIsoDate(post.date),
		),
	].map(([day, dayPosts]) => ({ date: day, posts: dayPosts }));

	return {
		date,
		week: weekOf(date),
		lead,
		days,
		storyCount: posts.length,
		sourceCount: new Set(posts.map((post) => post.feed.slug)).size,
	};
}
