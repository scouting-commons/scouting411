import type { Feed } from "@/lib/news/feeds/types";

/** a hydrated post from a feed */
export type Post = {
	url: string;
	title: string;
	description: string | null;
	date: Date;
	feed: Feed;
	thumbnail: string | null;
	/** external audio file url, for a podcast episode */
	audio: string | null;
};
