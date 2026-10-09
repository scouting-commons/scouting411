import type { APIRoute } from "astro";
import { ingestAllFeeds } from "@/lib/news/ingest/ingestAllFeeds";
import { CRON_SECRET } from "astro:env/server";
import { sendDevDebugEmail } from "@/infra/email/templates/devDebug";

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const authHeader = context.request.headers.get("authorization");

	if (authHeader !== `Bearer ${CRON_SECRET}` && import.meta.env.PROD) {
		return new Response("401 Unauthorized", { status: 401 });
	}

	const result = await ingestAllFeeds();

	if (result.errors.length > 0) {
		await sendDevDebugEmail({
			text: JSON.stringify(result.errors, null, "\t"),
			subject: "Errors updating all feeds",
		});
	}

	return new Response(JSON.stringify(result), {
		headers: {
			"Content-Type": "application/json",
		},
		status: result.errors.length === 0 ? 200 : 500,
	});
};
