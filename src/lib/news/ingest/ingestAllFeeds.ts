import { feedConfigs } from "@/lib/news/feeds/config";
import { ingestFeed } from "@/lib/news/ingest/ingestFeed";
import type { IngestError } from "@/lib/news/ingest/types";

/** fetches the upstream post data for all feeds and stores any new posts */
export async function ingestAllFeeds() {
	const results = await Promise.allSettled(
		feedConfigs.map((feedConfigEntry) => ingestFeed(feedConfigEntry)),
	);

	const errors: IngestError[] = results.flatMap((result, i) =>
		result.status === "rejected"
			? [
					{
						feed: feedConfigs[i]!.slug,
						reason:
							result.reason instanceof Error
								? result.reason.message
								: String(result.reason),
					},
				]
			: [],
	);

	return {
		errors,
		succeeded: feedConfigs.length - errors.length,
		total: feedConfigs.length,
	};
}
