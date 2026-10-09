import type { Feed } from "@/lib/news/feeds/types";
import type { posts } from "@/lib/db/schema";

/** a hydrated post from a feed */
export type Post = {
	url: string;
	title: string;
	description: string | null;
	date: Date;
	feed: Feed;
	thumbnail: string | null;
};

/** create a hydrated post from a stored post row */
export function hydratePost(row: typeof posts.$inferSelect, feed: Feed): Post {
	return {
		url: row.url,
		title: row.title,
		description: row.description,
		date: row.publishedAt,
		feed,
		thumbnail: row.thumbnail,
	};
}
