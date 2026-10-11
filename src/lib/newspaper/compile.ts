import type { Post } from "@/lib/news/post";
import type { IsoDate } from "@/lib/newspaper/dates";
import { type RatedStory, rateByValue } from "@/lib/newspaper/rank";
import { weekOf } from "@/lib/newspaper/schedule";
import type { Issue } from "@/lib/newspaper/types";

/**
 * lays out the issue on `date` from its week's posts, newest first.
 * `rate` scores the issue's stories and orders them, most important first:
 * the first leads, and every list of stories keeps that order
 */
export async function compileIssue(
	date: IsoDate,
	posts: Post[],
	rate: (stories: Post[]) => RatedStory[] | Promise<RatedStory[]> = rateByValue,
): Promise<Issue> {
	const isEpisode = (post: Post) => post.feed.kind === "podcast";
	const [lead, ...rest] = await rate(posts.filter((post) => !isEpisode(post)));
	// below this score a story is filler, which runs as good news
	const goodNewsBelow = 0.8;
	const stories = (keep: (rated: RatedStory) => boolean) =>
		rest.filter(keep).map(({ story }) => story);

	return {
		date,
		week: weekOf(date),
		lead: lead?.story,
		headlines: stories(({ score }) => score >= goodNewsBelow),
		goodNews: stories(({ score }) => score < goodNewsBelow),
		episodes: posts.filter(isEpisode),
		storyCount: posts.length,
		sourceCount: new Set(posts.map((post) => post.feed.slug)).size,
	};
}
