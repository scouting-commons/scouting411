import type { UrlShaped } from "@/util/utilTypes";
import type { FeedAdapter } from "@/lib/news/ingest/types";
import z from "zod";

import { feedConfigs } from "@/lib/news/feeds/config";

export type FeedConfig = {
	name: string;
	slug: string;
	description: string;
	defaultVisible: boolean;
	coverImageSrc: string;
	homepageUrl: UrlShaped;
	adapter: FeedAdapter;
};

export type FeedConfigEntry = (typeof feedConfigs)[number];

export const feedSlugs = feedConfigs.map((feed) => feed.slug);
export const defaultVisibleFeedSlugs = feedConfigs
	.filter((feed) => feed.defaultVisible)
	.map((feed) => feed.slug);
export const feedSlugSchema = z.enum(feedSlugs);
export type FeedSlug = z.infer<typeof feedSlugSchema>;

/** a hydrated feed object */
export type Feed = {
	name: string;
	slug: FeedSlug;
	description: string;
	coverImageSrc: string;
	links: {
		/** relative href to the detail page for this feed */
		overview: string;
		/** go to the post browser page and select just this feed */
		browsePosts: string;
		/** relative href to the generated rss feed */
		rss: string;
		/** relative href to the generated atom feed */
		atom: string;
		/** upstream's html homepage */
		homepage: string;
	};
	type: FeedAdapter["type"];
};
