import { tagConfigs } from "@/lib/tags/config";
import type { Tag, TagConfig, TagConfigEntry, TagSlug } from "@/lib/tags/types";
import { queryPostsUrlParams } from "@/lib/news/query/urlParams";
import { queryResourcesUrlParams } from "@/lib/resources/urlParams";

/** the list of all tags, hydrated and alphabetized */
export const tags = tagConfigs
	.map(hydrateTag)
	.sort((a, b) => a.name.localeCompare(b.name));

/** create a hydrated tag object from a config */
function hydrateTag(config: TagConfigEntry): Tag {
	// widen the literal entry so optional fields read as optional
	const { name, description, color }: TagConfig = config;

	return {
		name,
		slug: config.slug,
		description,
		color,
		links: {
			page: `/hubs/${config.slug}`,
			browseResources: `/resources?${queryResourcesUrlParams.encode({
				tags: [config.slug],
			})}`,
			browsePosts: `/news/browse?${queryPostsUrlParams.encode({
				tags: [config.slug],
			})}`,
		},
	};
}

/** gets a tag by its slug */
export function getTagBySlug(slug: TagSlug) {
	return tags.find((tag) => tag.slug === slug)!;
}
