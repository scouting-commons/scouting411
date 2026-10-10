import type { APIRoute } from "astro";
import { isFeedSlug } from "@/lib/news/feeds/feed";
import { deletePosts } from "@/lib/news/ingest/store";

export const prerender = false;

/**
 * deletes every stored post for the feed named in the `feed` query param.
 * dev only: production answers 404
 */
export const GET: APIRoute = async ({ url }) => {
	if (!import.meta.env.DEV) return new Response(null, { status: 404 });

	const feed = url.searchParams.get("feed");

	if (feed === null || !isFeedSlug(feed)) {
		return new Response("400 Unknown feed", { status: 400 });
	}

	const deleted = await deletePosts(feed);

	return new Response(JSON.stringify({ feed, deleted }), {
		headers: {
			"Content-Type": "application/json",
		},
	});
};
