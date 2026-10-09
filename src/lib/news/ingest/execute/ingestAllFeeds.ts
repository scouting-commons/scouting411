import { feedConfigs } from "@/lib/news/feeds/config";
import { insertPosts } from "@/lib/news/db/ops";
import { ingestFeed } from "@/lib/news/ingest/upstream/ingestFeed";
import type { IngestError } from "@/lib/news/ingest/types";

/** fetches the upstream post data for all feeds and stores any new posts */
export async function ingestAllFeeds() {
	const errors: IngestError[] = [];

	await Promise.all(
		feedConfigs.map(async (feed) => {
			const { data, error } = await ingestFeed(feed.slug);

			if (error) {
				errors.push(error);
				return;
			}

			await insertPosts({ feedSlug: feed.slug, postData: data });
		}),
	);

	return {
		errors,
		succeeded: feedConfigs.length - errors.length,
		total: feedConfigs.length,
	};
}
