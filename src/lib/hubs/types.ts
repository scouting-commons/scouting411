import type { FeedSlug } from "@/lib/news/feeds/types";
import type { TagSlug } from "@/lib/tags/types";

export type HubConfig = {
	slug: string;
	name: string;
	description: string;
	color: string;
	newsSources: FeedSlug[];
	/** the hub lists the resources with this tag */
	resourceTag: TagSlug;
};

export type Hub = HubConfig & {
	links: {
		page: string;
		browsePosts: string;
		browseResources: string;
	};
};
