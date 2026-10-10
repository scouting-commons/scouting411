import type { Post } from "@/lib/news/post";
import type { IsoDate } from "@/lib/newspaper/dates";
import { weekOf } from "@/lib/newspaper/schedule";
import type { Issue } from "@/lib/newspaper/types";
import { getTagBySlug } from "@/lib/tags/tag";

/** lays out the issue on `date` from its week's posts, newest first */
export function compileIssue(date: IsoDate, posts: Post[]): Issue {
	const isEpisode = (post: Post) => post.feed.kind === "podcast";
	const stories = posts.filter((post) => !isEpisode(post));
	const lead = stories.find((post) => post.thumbnail) ?? stories[0];

	const rest = stories.filter((post) => post !== lead);

	const sections = [...Map.groupBy(rest, (post) => post.tags[0])]
		.map(([slug, sectionPosts]) => ({
			tag: slug && getTagBySlug(slug),
			posts: sectionPosts,
		}))
		.toSorted((a, b) => b.posts.length - a.posts.length);

	return {
		date,
		week: weekOf(date),
		lead,
		headlines: rest.slice(0, 5),
		sections,
		episodes: posts.filter(isEpisode),
		storyCount: posts.length,
		sourceCount: new Set(posts.map((post) => post.feed.slug)).size,
	};
}
