import type { Post } from "@/lib/news/post";
/** the fields of a post that content quality is measured against */
type QualityInput = Pick<Post, "description" | "thumbnail">;

/** metrics and content quality measurements for a set of posts */
export type FeedMetrics = {
	posts: {
		/** how many posts are in the set */
		count: number;

		//todo add dates for newest and oldest posts
	};

	description: {
		/** how many posts have a non-empty description */
		count: number;
		/** percent of posts with a non-empty description */
		coverage: number | undefined;
	};

	thumbnail: {
		/** how many posts have a thumbnail */
		count: number;
		/** percent of posts with a thumbnail */
		coverage: number | undefined;

		/** number of unique thumbnails */
		unique: number;
		/** percent of posts whose thumbnail is unique within the set */
		uniqueCoverage: number | undefined;
	};
};

/** whether a post's description holds anything once whitespace is discounted */
function hasDescription(post: QualityInput) {
	return post.description !== null && post.description.trim() !== "";
}

/** the raw tallies every metric is derived from */
type MetricCounts = {
	posts: number;
	descriptions: number;
	thumbnails: number;
	uniqueThumbnails: number;
};

/**
 * derive the coverage percentages from a set of counts
 *
 * the single place the denominators live, so a set of counts measured directly
 * and the same counts arrived at by summing feeds can never disagree. a set
 * with no posts has nothing to measure, so its coverages are undefined rather
 * than zero
 */
function buildMetrics(counts: MetricCounts): FeedMetrics {
	const { posts, descriptions, thumbnails, uniqueThumbnails } = counts;

	return {
		posts: {
			count: posts,
		},

		description: {
			count: descriptions,
			coverage: posts === 0 ? undefined : descriptions / posts,
		},

		thumbnail: {
			count: thumbnails,
			coverage: posts === 0 ? undefined : thumbnails / posts,
			unique: uniqueThumbnails,
			uniqueCoverage: posts === 0 ? undefined : uniqueThumbnails / posts,
		},
	};
}

/** measure the stats about a feed's post data */
export function getFeedMetrics(posts: QualityInput[]): FeedMetrics {
	const thumbnails = posts
		.map((post) => post.thumbnail)
		.filter((thumbnail) => thumbnail !== null);

	return buildMetrics({
		posts: posts.length,
		descriptions: posts.filter(hasDescription).length,
		thumbnails: thumbnails.length,
		uniqueThumbnails: new Set(thumbnails).size,
	});
}

/**
 * combine per-feed metrics into a single set covering all of them
 *
 * coverages are recomputed from the summed counts rather than averaged
 *
 * note that `thumbnail.unique` is the sum of each feed's own unique count — a
 * thumbnail url used by two different feeds counts once per feed, since the
 * per-feed metrics no longer carry the urls needed to tell that apart
 */
export function getAggregatedFeedMetrics(metrics: FeedMetrics[]): FeedMetrics {
	const postCount = metrics.reduce((sum, { posts }) => sum + posts.count, 0);

	const descriptionCount = metrics.reduce(
		(sum, { description }) => sum + description.count,
		0,
	);

	const thumbnailCount = metrics.reduce(
		(sum, { thumbnail }) => sum + thumbnail.count,
		0,
	);

	const uniqueThumbnailCount = metrics.reduce(
		(sum, { thumbnail }) => sum + thumbnail.unique,
		0,
	);

	return buildMetrics({
		posts: postCount,
		descriptions: descriptionCount,
		thumbnails: thumbnailCount,
		uniqueThumbnails: uniqueThumbnailCount,
	});
}

/** render a percentage as a string. 100 and 0/undefined show check or x mark, otherwise renders the percentage */
export function formatPercentage(percent: number | undefined) {
	if (percent === undefined || percent === 0) return "❌";

	if (percent === 1) return "✔️";

	return Intl.NumberFormat("en-us", {
		style: "percent",
		maximumFractionDigits: 2,
	}).format(percent);
}
