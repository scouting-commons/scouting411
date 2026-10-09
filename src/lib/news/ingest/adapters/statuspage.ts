import type { FeedAdapter } from "@/lib/news/ingest/upstream/types";
import type { PostData } from "@/lib/news/ingest/types";
import { z } from "zod";

type StatuspageAdapterOpts = {
	/** the base url of the atlassian statuspage site */
	baseUrl: string;
};

/**
 * the two halves of a status page's history. the `history.rss` feed blends both
 * into one stream but caps it at 25 items with no pagination, so we read the
 * public api instead - it needs no auth and reaches back to the page's first
 * entry. neither endpoint paginates: statuspage serves the 50 most recent of
 * each and ignores page/per_page, so a page busy enough to exceed that would
 * have to fall back to crawling `history.json` three months at a time.
 */
const endpoints = [
	{ path: "/api/v2/incidents.json", key: "incidents" },
	{
		path: "/api/v2/scheduled-maintenances.json",
		key: "scheduled_maintenances",
	},
] as const;

export function StatuspageAdapter(opts: StatuspageAdapterOpts): FeedAdapter {
	const execute = async () => {
		const results = await Promise.all(
			endpoints.map((endpoint) => fetchEndpoint(endpoint, opts)),
		);

		// an incident and a maintenance are distinct objects with distinct ids, so
		// the two responses can't overlap and the union needs no deduping
		return results.flat();
	};

	return {
		type: {
			id: "atlassian-statuspage-api",
			human: "Statuspage",
		},
		execute,
	};
}

/** retrieve and map one of the history endpoints */
async function fetchEndpoint(
	{ path, key }: (typeof endpoints)[number],
	{ baseUrl }: StatuspageAdapterOpts,
) {
	const url = new URL(path, baseUrl).toString();

	console.log(`fetching statuspage history from ${url}`);

	const response = await fetch(url);

	if (response.status !== 200) {
		throw new Error(
			`failed to fetch posts from ${url} - status code ${response.status}`,
		);
	}

	const rawData = statuspageResponseSchema.parse(await response.json());

	const postData: PostData[] = rawData[key].map((item) => ({
		// don't use the shortlink property returned by the api, because it just redirects to this
		url: new URL("/incidents/" + item.id, baseUrl).toString(),
		title: item.name,
		// updates come back newest first, and last entry in the array is the first one (describing the initial incident / planned maintenance rather than a generic "this is resolved" message)
		description: item.incident_updates[item.incident_updates.length - 1]?.body,
		// when the entry was announced, which is when it became news. a maintenance
		// also carries the window it was scheduled for, which may be far later
		date: item.created_at,
		// status pages have no post imagery
		thumbnail: undefined,
	}));

	console.log(`fetched ${postData.length} posts from ${url}`);

	return postData;
}

/** the shape of data returned by the statuspage api */
const entrySchema = z.array(
	z.object({
		name: z.string(),
		id: z.string(),
		created_at: z.string(),
		incident_updates: z.array(z.object({ body: z.string() })),
	}),
);

const statuspageResponseSchema = z.object({
	incidents: entrySchema.optional().default([]),
	scheduled_maintenances: entrySchema.optional().default([]),
});
