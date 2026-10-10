import type { APIRoute } from "astro";
import { isFeedSlug } from "@/lib/news/feeds/feed";
import { deletePosts } from "@/lib/news/ingest/store";

export const prerender = false;

/**
 * deletes every stored post for the feed named in the `feed` form field, then returns
 * to the debug page. dev only: production answers 404
 */
export const POST: APIRoute = async ({ request, redirect }) => {
	if (!import.meta.env.DEV) return new Response(null, { status: 404 });

	const feed = (await request.formData()).get("feed");

	if (typeof feed !== "string" || !isFeedSlug(feed)) {
		return new Response("400 Unknown feed", { status: 400 });
	}

	const deleted = await deletePosts(feed);

	return redirect(`/news/debug?purged=${feed}&deleted=${deleted}`, 303);
};
