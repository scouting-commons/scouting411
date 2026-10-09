import { inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";
import type { PostData } from "@/lib/news/ingest/types";
import type { FeedSlug } from "@/lib/news/feeds/types";
import { feeds } from "@/lib/news/feeds/feed";
import { hydratePost, type Post } from "@/lib/news/feeds/post";

/** read the stored posts of the given feeds, each hydrated with its feed */
export async function readPosts(feedSlugs: FeedSlug[]): Promise<Post[]> {
	const rows = await db
		.select()
		.from(posts)
		.where(inArray(posts.feedSlug, feedSlugs));

	return rows.map((row) =>
		hydratePost(
			row,
			feeds.find((feed) => feed.slug === row.feedSlug)!,
		),
	);
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
