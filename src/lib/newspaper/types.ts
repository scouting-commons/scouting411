import type { Post } from "@/lib/news/post";
import type { IsoDate } from "@/lib/newspaper/dates";
import type { Tag } from "@/lib/tags/types";

type IssueSection = {
	/** undefined for the section of stories whose feed has no tags */
	tag: Tag | undefined;
	/** newest first */
	posts: Post[];
};

/**
 * one week's newspaper, compiled once its week is over. it comes out on a
 * sunday and covers the sunday-to-saturday week before it.
 */
export type Issue = {
	/** the sunday it came out, which identifies it */
	date: IsoDate;
	/** the days it covers, shaped as a news query filter */
	week: { from: IsoDate; to: IsoDate };
	/** the newest story with its own photo, or else the newest story. podcast episodes never lead */
	lead: Post | undefined;
	/** the newest few stories after the lead, teased beside it. they also run in their sections */
	headlines: Post[];
	/** the rest of the stories, by their first tag, biggest section first */
	sections: IssueSection[];
	/** posts from podcast feeds, kept out of the stories above, newest first */
	episodes: Post[];
	storyCount: number;
	sourceCount: number;
};
