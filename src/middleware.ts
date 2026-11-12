import { defineMiddleware } from "astro:middleware";

/**
 * let vercel's cdn serve repeat hits on on-demand pages. their data only changes in the
 * daily crons, so an hour-old copy is fine. the cache key includes the query string
 */
export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();

	const isHtml = response.headers.get("content-type")?.startsWith("text/html");

	if (context.request.method === "GET" && response.status === 200 && isHtml) {
		response.headers.set(
			"Vercel-CDN-Cache-Control",
			"s-maxage=3600, stale-while-revalidate=86400",
		);
	}

	return response;
});
