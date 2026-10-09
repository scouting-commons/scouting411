import { redis } from "@/lib/redis/client";
import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";
import type { PostData } from "@/lib/news/ingest/types";
import type { FeedSlug } from "@/lib/news/feeds/types";

/** read a feed's cached post data from redis */
export async function readPosts(feedSlug: FeedSlug) {
	const data: PostData[] | null = await redis.json.get("posts:" + feedSlug);

	return data ?? [];
}

/** store a feed's post data, skipping posts already stored (matched by feed and url) */
export async function insertPosts({
	feedSlug,
	postData,
}: {
	feedSlug: FeedSlug;
	postData: PostData[];
}) {
	await db.insert(posts).values(
		postData.map((post) => ({
			feedSlug,
			url: post.url,
			title: post.title,
			description: post.description,
			thumbnail: post.thumbnail,
			publishedAt: new Date(post.date),
		})),
	);
}
