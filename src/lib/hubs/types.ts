import type { FeedSlug } from "@/lib/news/feeds/types";
import type { TagSlug } from "@/lib/tags/types";

export type HubConfig = {
	slug: string;
	name: string;
	description: string;
	color: string;
	/** the hub lists the posts from this tag's news sources and the resources with this tag */
	tag: TagSlug;
};

export type Hub = HubConfig & {
	/** the tag's news sources */
	newsSources: FeedSlug[];
	links: {
		page: string;
		browsePosts: string;
		browseResources: string;
	};
};
