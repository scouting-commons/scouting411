import { hubsConfig } from "@/lib/hubs/config";
import type { Hub } from "@/lib/hubs/types";
import { queryPostsUrlParams } from "@/lib/news/query/urlParams";

/** the hydrated list of all hubs */
export const hubs: Hub[] = hubsConfig.map((config) => ({
	...config,
	links: {
		page: `/hubs/${config.slug}`,
		browsePosts: `/news/browse?${queryPostsUrlParams.encode({
			feeds: config.newsSources,
		})}`,
	},
}));

/** gets a hub by its slug, or undefined if there is none */
export function getHubBySlug(slug: string) {
	return hubs.find((hub) => hub.slug === slug);
}
