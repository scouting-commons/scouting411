import type { Feed } from "@/lib/news/feeds/types";
import type { TagSlug } from "@/lib/tags/types";

/** a hydrated post from a feed */
export type Post = {
	url: string;
	title: string;
	description: string | null;
	date: Date;
	feed: Feed;
	/** the post's own topic tags. null means the post has not been tagged, empty arrary means it was tagged with no tags */
	tags: TagSlug[] | null;
	thumbnail: string | null;
	/** external audio file url, for a podcast episode */
	audio: string | null;
};
