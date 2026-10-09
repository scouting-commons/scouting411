import type { FeedAdapter } from "@/lib/news/ingest/types";
import type { PostData } from "@/lib/news/ingest/types";
import {
	extractAudioUrl,
	stripPodcastChrome,
} from "@/lib/news/ingest/adapters/podcast-archive/extractors";
import data from "./data.json";
import { z } from "zod";

type PodcastArchiveAdapterOpts = {
	categoryId: number;
};

export function PodcastArchiveAdapter(
	opts: PodcastArchiveAdapterOpts,
): FeedAdapter {
	return {
		type: {
			id: "podcast-archive",
			human: "Podcast Archive",
		},
		execute: async () => {
			const raw = archivedPostsSchema.parse(data);

			const postData: PostData[] = raw.flatMap((item) => {
				if (!item.categories.includes(opts.categoryId)) {
					return [];
				}

				const url = extractAudioUrl(item.content.rendered);
				if (!url)
					throw new Error(`no audio url found for ${item.title.rendered}`);

				return {
					// date_gmt is gmt but carries no timezone designator, so it parses as local time without one
					date: `${item.date_gmt}Z`,
					description: stripPodcastChrome(item.excerpt.rendered),
					title: item.title.rendered,
					url,
					thumbnail: undefined,
				};
			});

			return postData;
		},
	};
}

const archivedPostsSchema = z.array(
	z.object({
		date_gmt: z.string(),
		content: z.object({
			rendered: z.string(),
		}),
		excerpt: z.object({
			rendered: z.string(),
		}),
		title: z.object({
			rendered: z.string(),
		}),
		categories: z.array(z.number()),
	}),
);
