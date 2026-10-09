import type { FeedAdapter } from "@/lib/news/ingest/upstream/types";
import type { PostData } from "@/lib/news/ingest/types";
import { parseRssFeed } from "feedsmith";

export function RssAdapter(opts: RssAdapterOpts): FeedAdapter {
	const execute = async () => {
		console.log(`fetching rss feed ${opts.feedUrl}`);

		const response = await fetch(opts.feedUrl);

		if (response.status !== 200) {
			throw new Error(
				`failed to fetch rss feed ${opts.feedUrl}: status code ${response.status}`,
			);
		}

		const xml = await response.text();

		const feed = parseRssFeed(xml);

		if (!feed.items) {
			throw new Error(
				`failed to parse rss feed ${opts.feedUrl}: no "items" property`,
			);
		}

		const postData: PostData[] = feed.items.map((item) => {
			if (!item.link && !item.enclosures?.[0]?.url) {
				throw new Error(
					`failed to parse rss feed ${opts.feedUrl}: no link or enclosure`,
				);
			}

			if (!item.title) {
				throw new Error(`failed to parse rss feed ${opts.feedUrl}: no title`);
			}

			if (!item.pubDate) {
				throw new Error(`failed to parse rss feed ${opts.feedUrl}: no pubDate`);
			}

			return {
				url: item.link ?? item.enclosures![0]!.url!,
				title: item.title,
				description: item.description,
				date: item.pubDate,
				thumbnail: item.itunes?.image,
			};
		});

		console.log(
			`fetched ${postData.length} posts from rss feed ${opts.feedUrl}`,
		);

		return postData;
	};

	return {
		type: {
			id: "rss",
			human: "RSS",
		},
		execute,
	};
}

type RssAdapterOpts = {
	feedUrl: string;
};
