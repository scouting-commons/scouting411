import type { FeedConfigEntry, Feed } from "@/lib/news/feeds/types";
import { queryPostsUrlParams } from "@/lib/news/query/urlParams";
import { feedConfigs } from "@/lib/news/feeds/config";
import { type FeedSlug, feedSlugSchema } from "@/lib/news/feeds/types";

/** the list of all feeds, hydrated and alphabetized */
export const feeds = feedConfigs
	.map(hydrateFeed)
	.sort((a, b) => a.name.localeCompare(b.name));

/** create a hydrated feed object from a config */
function hydrateFeed(opts: FeedConfigEntry): Feed {
	return {
		name: opts.name,
		slug: opts.slug,
		description: opts.description,
		coverImageSrc: opts.coverImageSrc,
		links: {
			overview: `/news/sources/${opts.slug}`,
			browsePosts: `/news/browse?${queryPostsUrlParams.encode({
				feeds: [opts.slug],
			})}`,
			rss: `/feeds/${opts.slug}/rss`,
			atom: `/feeds/${opts.slug}/atom`,
			homepage: opts.homepageUrl,
		},
		adapter: opts.adapter.type,
	};
}

/** type guard to check if a string is a feed slug */
export function isFeedSlug(value: string): value is FeedSlug {
	return feedSlugSchema.safeParse(value).success;
}

/** gets a feed by its slug */
export function getFeedBySlug(slug: FeedSlug) {
	return feeds.find((feed) => feed.slug === slug)!;
}
