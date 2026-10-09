import type { FeedSlug } from "@/lib/news/feeds/types";
import { feedConfigs } from "@/lib/news/feeds/config";
import type { PostData } from "@/lib/news/ingest/types";
import { normalizePostData } from "@/lib/news/ingest/upstream/normalize";

/** fetch and normalize one feed's post data. throws if the adapter fails or returns no posts */
export async function ingestFeed(slug: FeedSlug): Promise<PostData[]> {
	//todo access the Feed instead of the FeedConfig?
	const feedConfig = feedConfigs.find((feed) => feed.slug === slug)!;

	const postData = await feedConfig.adapter.execute();

	if (postData.length === 0) {
		throw new Error("zero posts returned from feed adapter");
	}

	const { data, error } = normalizePostData(postData);

	if (error) throw error;

	return data;
}
