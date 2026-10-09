import type { FeedConfigEntry } from "@/lib/news/feeds/types";
import type { PostData } from "@/lib/news/ingest/types";
import { normalizePostData } from "@/lib/news/ingest/normalize";
import { runAdapter } from "@/lib/news/ingest/adapters";

/** fetch and normalize one feed's post data. throws if the adapter fails or returns no posts */
export async function ingestFeed(feed: FeedConfigEntry): Promise<PostData[]> {
	const postData = await runAdapter(feed.adapter);

	if (postData.length === 0) {
		throw new Error("zero posts returned from feed adapter");
	}

	const { data, error } = normalizePostData(postData);

	if (error) throw error;

	return data;
}
