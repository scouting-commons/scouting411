import { tagConfigs } from "@/lib/tags/config";
import { feedConfigs } from "@/lib/news/feeds/config";
import type { FeedConfig } from "@/lib/news/feeds/types";
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
	const newsSources = feedConfigs
		.filter((feed: FeedConfig) => feed.tags.includes(config.slug))
		.map((feed) => feed.slug);

	return {
		name,
		slug: config.slug,
		description,
		color,
		newsSources,
		links: {
			page: `/hubs/${config.slug}`,
			browseResources: `/resources?${queryResourcesUrlParams.encode({
				tags: [config.slug],
			})}`,
			// an empty feeds query means every feed, so a tag without sources gets no link
			browsePosts: newsSources.length
				? `/news/browse?${queryPostsUrlParams.encode({ feeds: newsSources })}`
				: undefined,
		},
	};
}

/** gets a tag by its slug */
export function getTagBySlug(slug: TagSlug) {
	return tags.find((tag) => tag.slug === slug)!;
}
