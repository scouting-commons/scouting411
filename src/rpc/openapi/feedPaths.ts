import type { OpenAPIV3_2 } from "@orpc/openapi";
import { feedSlugs } from "@/lib/news/feeds/types";

/**
 * the re-publishing routes in `src/pages/feeds/` are plain astro routes, not
 * procedures, so the generator can't see them. they're described here by hand;
 * keep these in sync when those routes change.
 */

/** they live at the site root, not under the api prefix */
const siteRoot: OpenAPIV3_2.ServerObject[] = [{ url: "/" }];

const slugParameter: OpenAPIV3_2.ParameterObject = {
	name: "slug",
	in: "path",
	required: true,
	description: "The feed's slug.",
	schema: { type: "string", enum: feedSlugs },
};

const xml = { "text/xml": {} };

export const feedPaths: OpenAPIV3_2.PathsObject = {
	"/feeds/{slug}/rss": {
		servers: siteRoot,
		get: {
			summary: "RSS feed for one source",
			description:
				"One source's stored posts, re-published as RSS. Podcast episodes carry their audio as an enclosure.",
			tags: ["Feeds"],
			parameters: [slugParameter],
			responses: {
				200: { description: "An RSS 2.0 document.", content: xml },
				404: { description: "No feed has this slug." },
			},
		},
	},
	"/feeds/{slug}/atom": {
		servers: siteRoot,
		get: {
			summary: "Atom feed for one source",
			description:
				"One source's stored posts, re-published as Atom. Podcast episodes carry their audio as an enclosure link.",
			tags: ["Feeds"],
			parameters: [slugParameter],
			responses: {
				200: { description: "An Atom 1.0 document.", content: xml },
				404: { description: "No feed has this slug." },
			},
		},
	},
	"/feeds/all/opml": {
		servers: siteRoot,
		get: {
			summary: "OPML of every feed",
			description: "Every Scouting411 feed as an OPML subscription list.",
			tags: ["Feeds"],
			responses: {
				200: { description: "An OPML 2.0 document.", content: xml },
			},
		},
	},
};
