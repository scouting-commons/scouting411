import type { FeedConfigEntry } from "@/lib/news/feeds/types";
import type { PostData } from "@/lib/news/ingest/types";
import { normalizePostData } from "@/lib/news/ingest/normalize";
import { runAdapter } from "@/lib/news/ingest/adapters";
import { getStoredUrls, insertPosts } from "@/lib/news/ingest/store";

/**
 * fetch one feed's pages until one holds a post already stored, then store the
 * new posts. throws if the adapter fails or returns an empty page
 */
export async function ingestFeed(feed: FeedConfigEntry) {
	const storedUrls = await getStoredUrls(feed.slug);
	const newPosts: PostData[] = [];

	let pageNumber = 0;

	for await (const page of runAdapter(feed.adapter)) {
		pageNumber++;

		if (page.length === 0) {
			throw new Error("empty page returned from feed adapter");
		}

		const { data, error } = normalizePostData(page);
		if (error) throw error;

		const unseen = data.filter((post) => !storedUrls.has(post.url));
		newPosts.push(...unseen);

		console.log(
			`[${feed.slug}] fetched page ${pageNumber}. ${data.length} posts, ${unseen.length} new`,
		);

		// pages run newest first, so the pages after this one are already stored
		if (unseen.length < data.length) break;
	}

	console.log(`[${feed.slug}] added ${newPosts.length} new posts`);

	await insertPosts({ feedSlug: feed.slug, postData: newPosts });
}
