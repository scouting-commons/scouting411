import type { Post } from "@/lib/news/post";
import type { IsoDate } from "@/lib/newspaper/dates";

/**
 * one week's newspaper, compiled once its week is over. it comes out on a
 * sunday and covers the sunday-to-saturday week before it.
 */
export type Issue = {
	/** the sunday it came out, which identifies it */
	date: IsoDate;
	/** the days it covers, shaped as a news query filter */
	week: { from: IsoDate; to: IsoDate };
	/** the top story in the issue's ranking. podcast episodes never lead */
	lead: Post | undefined;
	/** every story after the lead that isn't fluff, teased below it, most important first */
	headlines: Post[];
	/** every story after the lead that scores under the fluff cutoff, most important first. empty when there's only one, which runs as a headline */
	fluff: Post[];
	/** posts from podcast feeds, kept out of the stories above, newest first */
	episodes: Post[];
	storyCount: number;
	sourceCount: number;
};
