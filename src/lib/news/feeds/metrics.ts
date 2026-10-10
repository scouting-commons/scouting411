import { count, countDistinct, max, min } from "drizzle-orm";
import { db } from "@/infra/db/client";
import { posts } from "@/infra/db/schema";
import { feeds } from "@/lib/news/feeds/feed";

/** metrics and content quality measurements for a set of posts */
export type FeedMetrics = {
	posts: {
		/** how many posts are in the set */
		count: number;
		/** publish date of the most recent post */
		newest: Date | undefined;
		/** publish date of the earliest post */
		oldest: Date | undefined;
	};

	description: {
		/** how many posts have a description */
		count: number;
		/** percent of posts with a description */
		coverage: number | undefined;
	};

	content: {
		/** how many posts have a stored body */
		count: number;
		/** percent of posts with a stored body */
		coverage: number | undefined;
	};

	thumbnail: {
		/** how many posts have a thumbnail */
		count: number;
		/** percent of posts with a thumbnail */
		coverage: number | undefined;

		/** number of unique thumbnails */
		unique: number;
		/** unique thumbnails as a percent of posts */
		uniqueCoverage: number | undefined;
	};
};

/**
 * the raw tallies every metric is derived from. ingest stores a blank field as
 * null, so counting a column counts the posts that have it
 */
const metricColumns = {
	posts: count(),
	newestPost: max(posts.publishedAt),
	oldestPost: min(posts.publishedAt),
	descriptions: count(posts.description),
	contents: count(posts.content),
	thumbnails: count(posts.thumbnail),
	uniqueThumbnails: countDistinct(posts.thumbnail),
};

type MetricCounts = {
	[K in keyof typeof metricColumns]: (typeof metricColumns)[K]["_"]["type"];
};

const noPosts: MetricCounts = {
	posts: 0,
	newestPost: null,
	oldestPost: null,
	descriptions: 0,
	contents: 0,
	thumbnails: 0,
	uniqueThumbnails: 0,
};

/**
 * derive the coverage percentages from a set of counts
 *
 * a set with no posts has nothing to measure, so its coverages and dates are
 * undefined
 */
function buildMetrics(counts: MetricCounts): FeedMetrics {
	const { posts, descriptions, contents, thumbnails, uniqueThumbnails } =
		counts;

	return {
		posts: {
			count: posts,
			newest: counts.newestPost ?? undefined,
			oldest: counts.oldestPost ?? undefined,
		},

		description: {
			count: descriptions,
			coverage: posts === 0 ? undefined : descriptions / posts,
		},

		content: {
			count: contents,
			coverage: posts === 0 ? undefined : contents / posts,
		},

		thumbnail: {
			count: thumbnails,
			coverage: posts === 0 ? undefined : thumbnails / posts,
			unique: uniqueThumbnails,
			uniqueCoverage: posts === 0 ? undefined : uniqueThumbnails / posts,
		},
	};
}

/**
 * measure the stored posts of every feed, and of all feeds together
 *
 * the totals are measured over the whole table rather than summed from the
 * feeds, so a thumbnail shared by two feeds counts once
 */
export async function getFeedMetrics() {
	const [feedRows, [totals]] = await Promise.all([
		db
			.select({ feedSlug: posts.feedSlug, ...metricColumns })
			.from(posts)
			.groupBy(posts.feedSlug),
		db.select(metricColumns).from(posts),
	]);

	const countsByFeedSlug = new Map(
		feedRows.map(({ feedSlug, ...counts }) => [feedSlug, counts]),
	);

	return {
		feeds: feeds.map((feed) => ({
			feed,
			// a feed with no stored posts has no row in the grouped query
			metrics: buildMetrics(countsByFeedSlug.get(feed.slug) ?? noPosts),
		})),
		totals: buildMetrics(totals!),
	};
}
