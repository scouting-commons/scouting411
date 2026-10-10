import { db } from "@/infra/db/client";
import { posts } from "@/infra/db/schema";
import type { PostData } from "@/lib/news/ingest/types";
import type { FeedSlug } from "@/lib/news/feeds/types";
import { eq } from "drizzle-orm";

/** the url of every post stored for a feed */
export async function getStoredUrls(feedSlug: FeedSlug) {
	const rows = await db
		.select({ url: posts.url })
		.from(posts)
		.where(eq(posts.feedSlug, feedSlug));

	return new Set(rows.map((row) => row.url));
}

/** delete every post stored for a feed, returning how many were deleted */
export async function deletePosts(feedSlug: FeedSlug) {
	const rows = await db
		.delete(posts)
		.where(eq(posts.feedSlug, feedSlug))
		.returning({ id: posts.id });

	return rows.length;
}

/** store a feed's post data, skipping posts already stored (matched by feed and url) */
export async function insertPosts({
	feedSlug,
	postData,
}: {
	feedSlug: FeedSlug;
	postData: PostData[];
}) {
	// drizzle rejects an insert with no rows
	if (postData.length === 0) return;

	await db
		.insert(posts)
		.values(
			postData.map((post) => ({
				feedSlug,
				url: post.url,
				title: post.title,
				description: post.description,
				thumbnail: post.thumbnail,
				audio: post.audio,
				publishedAt: new Date(post.date),
			})),
		)
		.onConflictDoNothing();
}
