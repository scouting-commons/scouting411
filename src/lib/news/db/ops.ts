import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";
import type { PostData } from "@/lib/news/ingest/types";
import type { FeedSlug } from "@/lib/news/feeds/types";

/** read a feed's stored post data */
export async function readPosts(feedSlug: FeedSlug): Promise<PostData[]> {
	const rows = await db
		.select()
		.from(posts)
		.where(eq(posts.feedSlug, feedSlug));

	return rows.map((row) => ({
		url: row.url,
		title: row.title,
		description: row.description ?? undefined,
		date: row.publishedAt.toISOString(),
		thumbnail: row.thumbnail ?? undefined,
	}));
}

/** store a feed's post data, skipping posts already stored (matched by feed and url) */
export async function insertPosts({
	feedSlug,
	postData,
}: {
	feedSlug: FeedSlug;
	postData: PostData[];
}) {
	await db
		.insert(posts)
		.values(
			postData.map((post) => ({
				feedSlug,
				url: post.url,
				title: post.title,
				description: post.description,
				thumbnail: post.thumbnail,
				publishedAt: new Date(post.date),
			})),
		)
		.onConflictDoNothing();
}
