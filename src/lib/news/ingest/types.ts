import type { FeedSlug } from "@/lib/news/feeds/types";

/** a raw post data object returned by one of the feed adapters */
export type PostData = {
	/** the original url of the post */
	url: string;
	/** the title of the post */
	title: string;
	/** the description of the post */
	description: string | undefined;
	/** the date the post was published */
	date: string;
	/** external image url to use as a thumbnail */
	thumbnail: string | undefined;
};

/** an error that occurred during the upstream ingestion process */
export type IngestError = {
	feed: FeedSlug;
	reason: string;
};

/**
 * fetches one type of upstream and returns its post data. annotate each adapter
 * with this so mistakes surface in its own file
 */
export type FeedAdapter<Opts = undefined> = (opts: Opts) => Promise<PostData[]>;
