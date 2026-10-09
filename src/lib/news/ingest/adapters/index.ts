import type { AdapterConfig } from "@/lib/news/feeds/types";
import type { FeedAdapter } from "@/lib/news/ingest/types";
import { WordpressAdapter } from "@/lib/news/ingest/adapters/wordpress";
import { RssAdapter } from "@/lib/news/ingest/adapters/rss";
import { PodcastArchiveAdapter } from "@/lib/news/ingest/adapters/podcast-archive";
import { StatuspageAdapter } from "@/lib/news/ingest/adapters/statuspage";
import { OaNewsAdapter } from "@/lib/news/ingest/adapters/oaNews";
import { MyScoutingAnnouncementsAdapter } from "@/lib/news/ingest/adapters/myScoutingAnnouncements";

/** every adapter, keyed by the `type` a feed config names it with. server only */
export const adapters = {
	"wordpress-api": WordpressAdapter,
	rss: RssAdapter,
	"podcast-archive": PodcastArchiveAdapter,
	"atlassian-statuspage-api": StatuspageAdapter,
	"oa-news": OaNewsAdapter,
	"my-scouting-announcements": MyScoutingAnnouncementsAdapter,
};

/** build the adapter a feed config names, with its options */
export function buildAdapter(config: AdapterConfig): FeedAdapter {
	// AdapterConfig pairs each type with its own opts, which ts can't follow through the lookup
	const build = adapters[config.type] as (opts: unknown) => FeedAdapter;
	return build("opts" in config ? config.opts : undefined);
}
