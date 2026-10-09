import { feeds } from "@/lib/news/feeds/feed";
import type { Feed } from "@/lib/news/feeds/types";
import {
	getAggregatedFeedMetrics,
	getFeedMetrics,
} from "@/lib/news/feeds/metrics";
import { queryPosts } from "@/lib/news/query/query";

const site = import.meta.env.SITE;

/**
 * a feed's links, with the site-relative ones resolved against the site origin
 *
 * api consumers are off-site, so relative hrefs are not useful to them.
 * `homepage` is already absolute and upstream's, so it is passed through
 * untouched rather than round-tripped through `URL` (which would append a
 * trailing slash to bare origins).
 */
function absolutizeLinks(links: Feed["links"]) {
	const absolute = (href: string) => new URL(href, site).toString();

	return {
		overview: absolute(links.overview),
		browsePosts: absolute(links.browsePosts),
		rss: absolute(links.rss),
		atom: absolute(links.atom),
		homepage: links.homepage,
	};
}

export async function getFeedConsumerOutput() {
	const entries = await Promise.all(
		feeds.map(async (feed) => {
			const { posts } = await queryPosts({
				feeds: [feed.slug],
				paginate: false,
			});

			return {
				name: feed.name,
				slug: feed.slug,
				description: feed.description,
				coverImageSrc: feed.coverImageSrc,
				type: feed.type,
				links: absolutizeLinks(feed.links),
				metrics: getFeedMetrics(posts),
			};
		}),
	);

	const body = {
		feeds: entries,
		summary: {
			feedCount: entries.length,
			metrics: getAggregatedFeedMetrics(entries.map(({ metrics }) => metrics)),
		},
	};

	return body;
}
