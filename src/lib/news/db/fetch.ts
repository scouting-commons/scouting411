import type { Feed, FeedSlug } from "@/lib/news/feeds/types";
import { readPosts } from "@/lib/news/db/ops";
import { hydratePost } from "@/lib/news/feeds/post";
import { feeds } from "@/lib/news/feeds/feed";

/** fetches a feed's posts from the database */
async function getFeedPosts(feed: Feed) {
	const postData = await readPosts(feed.slug);

	return postData.map((postData) => {
		return hydratePost(postData, feed);
	});
}

/** fetches all posts (across all feeds) from the database */
export async function getMultipleFeedsPosts(feedSlugs: FeedSlug[]) {
	const selectedFeeds = feeds.filter((feed) => feedSlugs.includes(feed.slug));

	return (
		await Promise.all(selectedFeeds.map((feed) => getFeedPosts(feed)))
	).flat();
}
