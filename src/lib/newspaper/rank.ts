import { score } from "@typesafe-ai/sdk";
import { jev } from "@/infra/jev";
import type { Post } from "@/lib/news/post";

/**
 * rates how much a story is worth a volunteer's time. usefulness counts, not
 * just being news. levels run from 0, the lowest
 */
const value = score(
	"How valuable is this post for an adult Scouting America volunteer to read?",
	[
		"Entertainment or filler with nothing to use: a celebrity interview, a feel-good or donor profile, a commemorative feature, recipes, or a promotion for other content",
		"A real but minor or narrow item: a routine deadline or nomination reminder, an event listing, one unit's achievement, a publicity visit, a fundraising appeal, an activity written for youth, or a small change that matters to only one group",
		"Practical value a volunteer can apply: advice, lessons, or ideas for running a unit, a how-to, a policy explainer, a safety reference, or a modest new tool or resource",
		"A major national development: a significant change to the program, a new merit badge, a large new initiative, website, or funding commitment, or a new official resource for every unit in a program",
	],
);

/** a story with its score on the levels above, from 0 (filler) to 3 (major news) */
export type RatedStory = { story: Post; score: number };

/**
 * `stories` with jev's rating of each, most valuable first. each story is
 * scored on its own, and ties keep the order they came in
 */
export async function rateByValue(stories: Post[]) {
	const rated = await Promise.all(
		stories.map(async (story) => {
			const { answers } = await jev.systemOne({
				state: {
					title: story.title,
					description: story.description,
					source: story.feed.name,
				},
				questions: { value },
			});

			return {
				story,
				score: answers.value.score,
				confidence: answers.value.confidence,
			};
		}),
	);

	return rated.toSorted((a, b) => b.score - a.score);
}

/**
 * `stories`, given newest first, with the newest one that has its own photo
 * moved to the front. needs no model call, so every story gets the same
 * middling score
 */
export function rateByRecency(stories: Post[]): RatedStory[] {
	const first = stories.find((story) => story.thumbnail);
	const ordered = first
		? [first, ...stories.filter((story) => story !== first)]
		: stories;

	return ordered.map((story) => ({ story, score: 1 }));
}
