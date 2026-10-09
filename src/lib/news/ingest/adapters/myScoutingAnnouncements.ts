import type { FeedAdapter, PostData } from "@/lib/news/ingest/types";
import { authenticate } from "@scouting-commons/scouting-api/auth.scouting.org";
import { z } from "zod";

/** the announcements behind the my.scouting.org homepage, which has no other public source */
const announcementsUrl =
	"https://api.scouting.org/events/communications/organizations";

/**
 * reads the announcements shown on the my.scouting.org homepage from the
 * scouting api. the endpoint needs a signed-in user, and the token expires
 * after 8 hours, so each run signs in fresh with the my.scouting credentials
 * in the env.
 *
 * the homepage queries a one-minute window around now with `status=active`,
 * which only returns what's live. widening the window and passing any other
 * status disables both filters, so one request returns the full history. that
 * history includes deleted items, mostly dupes and corrected reposts, which
 * are dropped here. `everyChildOrganization` adds the national council's
 * announcements to those of "Information Delivery 5002", which posts the
 * recent ones.
 */
export const myScoutingAnnouncementsAdapter: FeedAdapter = async () => {
	const token = await signIn();

	const url = new URL(announcementsUrl);
	url.search = new URLSearchParams({
		communicationType: "Announcement",
		organizationGuid: "3008EA8A-9822-454E-8F62-0DF19DF8100F",
		everyChildOrganization: "true",
		status: "all",
		fromDate: "2000-01-01T00:00:00",
		toDate: "2100-01-01T00:00:00",
		// the whole history fits in one page (153 items as of 2026-10-02)
		perPage: "1000",
		page: "1",
	}).toString();

	console.log(`fetching my.scouting announcements from ${url}`);

	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (response.status !== 200) {
		throw new Error(
			`failed to fetch posts from ${url} - status code ${response.status}`,
		);
	}

	const { events } = announcementsResponseSchema.parse(await response.json());

	const postData: PostData[] = events
		.filter((event) => event.deleted === "false")
		.map((event) => ({
			// announcements have no page of their own, so the fragment only
			// keeps each url unique
			url: `https://my.scouting.org/#announcement-${event.eventGuid}`,
			title: event.announcementTitle,
			description: event.announcementMessage,
			// when it went live on the homepage. upstream sends no timezone; the
			// homepage builds its query window from the utc clock, so read it as utc
			date: `${event.startDateTime.replace(" ", "T")}Z`,
			thumbnail: undefined,
		}));

	console.log(`fetched ${postData.length} posts from ${url}`);

	return postData;
};

/** sign in to my.scouting and return a bearer token for api.scouting.org */
async function signIn() {
	// feed configs reach island bundles, which can't load server env
	if (!import.meta.env.SSR) {
		throw new Error("my.scouting sign-in is server only");
	}

	const { MY_SCOUTING_USERNAME, MY_SCOUTING_PASSWORD } =
		await import("astro:env/server");

	const { data, error } = await authenticate({
		path: { username: MY_SCOUTING_USERNAME },
		body: { password: MY_SCOUTING_PASSWORD },
	});

	if (error)
		throw new Error(`failed to sign in to my.scouting - ${error.message}`);

	return data.token;
}

/** the fields used from the announcements endpoint */
const announcementsResponseSchema = z.object({
	events: z.array(
		z.object({
			eventGuid: z.string(),
			announcementTitle: z.string(),
			announcementMessage: z.string(),
			startDateTime: z.string(),
			deleted: z.enum(["true", "false"]),
		}),
	),
});
