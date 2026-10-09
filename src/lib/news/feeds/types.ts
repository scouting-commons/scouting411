import type { adapters } from "@/lib/news/ingest/adapters";
import z from "zod";

import { feedConfigs } from "@/lib/news/feeds/config";

export type FeedConfig = {
	name: string;
	slug: string;
	description: string;
	defaultVisible: boolean;
	coverImageSrc: string;
	homepageUrl: string;
	/** set when the feed is a podcast, whose posts are episodes */
	kind?: "podcast";
	adapter: AdapterConfig;
};

type Adapters = typeof adapters;

/**
 * which adapter ingests a feed, and its options. plain data, so the config
 * stays safe to bundle into islands while the adapters stay server only
 */
export type AdapterConfig = {
	[K in keyof Adapters]: Parameters<Adapters[K]>[0] extends undefined
		? { type: K }
		: { type: K; opts: Parameters<Adapters[K]>[0] };
}[keyof Adapters];

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
	kind: FeedConfig["kind"];
	/** slug of the adapter that ingests this feed */
	adapter: AdapterConfig["type"];
};
