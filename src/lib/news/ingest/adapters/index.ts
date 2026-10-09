import type { AdapterConfig } from "@/lib/news/feeds/types";
import type { FeedAdapter, PostData } from "@/lib/news/ingest/types";
import { wordpressAdapter } from "@/lib/news/ingest/adapters/wordpress";
import { rssAdapter } from "@/lib/news/ingest/adapters/rss";
import { podcastArchiveAdapter } from "@/lib/news/ingest/adapters/podcast-archive";
import { statuspageAdapter } from "@/lib/news/ingest/adapters/statuspage";
import { oaNewsAdapter } from "@/lib/news/ingest/adapters/oaNews";
import { myScoutingAnnouncementsAdapter } from "@/lib/news/ingest/adapters/myScoutingAnnouncements";

/** every adapter, keyed by the `type` a feed config names it with. server only */
export const adapters = {
	"wordpress-api": wordpressAdapter,
	rss: rssAdapter,
	"podcast-archive": podcastArchiveAdapter,
	"atlassian-statuspage-api": statuspageAdapter,
	"oa-news": oaNewsAdapter,
	"my-scouting-announcements": myScoutingAnnouncementsAdapter,
};

/** run the adapter a feed config names, with its options */
export function runAdapter(config: AdapterConfig): AsyncGenerator<PostData[]> {
	// AdapterConfig pairs each type with its own opts, which ts can't follow through the lookup
	const adapter = adapters[config.type] as FeedAdapter<unknown>;
	return adapter("opts" in config ? config.opts : undefined);
}
