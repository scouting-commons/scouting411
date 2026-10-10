import type { Feed } from "@/lib/news/feeds/types";
import type { TagSlug } from "@/lib/tags/types";

/** a hydrated post from a feed */
export type Post = {
	url: string;
	title: string;
	description: string | null;
	date: Date;
	feed: Feed;
	/** inherited from the post's feed */
	tags: TagSlug[];
	thumbnail: string | null;
	/** external audio file url, for a podcast episode */
	audio: string | null;
};
