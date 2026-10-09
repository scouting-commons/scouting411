import { hubsConfig } from "@/lib/hubs/config";
import type { Hub, HubConfig } from "@/lib/hubs/types";
import { queryPostsUrlParams } from "@/lib/news/query/urlParams";
import { queryResourcesUrlParams } from "@/lib/resources/urlParams";
import { getTagBySlug } from "@/lib/tags/tag";
import type { TagConfig } from "@/lib/tags/types";

/** the hydrated list of all hubs */
export const hubs: Hub[] = hubsConfig.map(hydrateHub);

function hydrateHub(config: HubConfig): Hub {
	const { newsSources }: TagConfig = getTagBySlug(config.tag);

	// an empty feeds query means every feed, so a hub without sources would show all news
	if (!newsSources?.length) {
		throw new Error(
			`hub "${config.slug}" uses tag "${config.tag}", which has no newsSources`,
		);
	}

	return {
		...config,
		newsSources,
		links: {
			page: `/hubs/${config.slug}`,
			browsePosts: `/news/browse?${queryPostsUrlParams.encode({
				feeds: newsSources,
			})}`,
			browseResources: `/resources?${queryResourcesUrlParams.encode({
				tags: [config.tag],
			})}`,
		},
	};
}

/** gets a hub by its slug, or undefined if there is none */
export function getHubBySlug(slug: string) {
	return hubs.find((hub) => hub.slug === slug);
}
