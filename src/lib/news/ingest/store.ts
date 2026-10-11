import { db } from "@/infra/db/client";
import { posts } from "@/infra/db/schema";
import type { PostData } from "@/lib/news/ingest/types";
import type { FeedSlug } from "@/lib/news/feeds/types";
import type { TagSlug } from "@/lib/tags/types";
import { count, desc, eq, isNull } from "drizzle-orm";

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

/** the newest posts that have not been tagged, plus how many there are in all */
export async function getUntaggedPosts(limit: number) {
	const untagged = isNull(posts.tags);

	const [rows, [total]] = await Promise.all([
		db
			.select({
				id: posts.id,
				feedSlug: posts.feedSlug,
				url: posts.url,
				title: posts.title,
				description: posts.description,
				publishedAt: posts.publishedAt,
			})
			.from(posts)
			.where(untagged)
			.orderBy(desc(posts.publishedAt), desc(posts.id))
			.limit(limit),
		db.select({ count: count() }).from(posts).where(untagged),
	]);

	return { posts: rows, total: total!.count };
}

/** set a post's tags. an empty array records that it was tagged with none */
export async function setPostTags(id: number, tags: TagSlug[]) {
	await db
		.update(posts)
		.set({ tags, updatedAt: new Date() })
		.where(eq(posts.id, id));
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
				content: post.content,
				thumbnail: post.thumbnail,
				audio: post.audio,
				publishedAt: new Date(post.date),
			})),
		)
		.onConflictDoNothing();
}
