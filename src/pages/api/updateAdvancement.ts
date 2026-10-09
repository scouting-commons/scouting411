import type { APIRoute } from "astro";
import { ingestMeritBadges } from "@/lib/advancement/meritBadges/ingest";
import { ingestRanks } from "@/lib/advancement/ranks/ingest";
import { ingestAdventures } from "@/lib/advancement/adventures/ingest";
import { ingestAwards } from "@/lib/advancement/awards/ingest";
import { CRON_SECRET } from "astro:env/server";
import { sendDevDebugEmail } from "@/infra/email/templates/devDebug";

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const authHeader = context.request.headers.get("authorization");

	if (authHeader !== `Bearer ${CRON_SECRET}` && import.meta.env.PROD) {
		return new Response("401 Unauthorized", { status: 401 });
	}

	const [meritBadges, ranks, adventures, awards] = await Promise.all([
		ingestMeritBadges(),
		ingestRanks(),
		ingestAdventures(),
		ingestAwards(),
	]);
	const result = { meritBadges, ranks, adventures, awards };
	const failed =
		meritBadges.errors.length > 0 ||
		ranks.errors.length > 0 ||
		adventures.errors.length > 0 ||
		awards.errors.length > 0;

	if (failed) {
		await sendDevDebugEmail({
			text: JSON.stringify(
				{
					meritBadges: meritBadges.errors,
					ranks: ranks.errors,
					adventures: adventures.errors,
					awards: awards.errors,
				},
				null,
				"\t",
			),
			subject: "Errors updating advancement",
		});
	}

	return new Response(JSON.stringify(result), {
		headers: {
			"Content-Type": "application/json",
		},
		status: failed ? 500 : 200,
	});
};
