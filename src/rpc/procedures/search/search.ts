import { os } from "@orpc/server";
import { openapi } from "@orpc/openapi";
import { z } from "zod";
import { loadSearchItems } from "@/lib/search/sources";
import { searchItems } from "@/lib/search/search";
import { searchItemSchema, searchResultSchema } from "@/lib/search/types";

export const listSearchItemsProcedure = os
	.meta(
		openapi({
			summary: "List search items",
			method: "GET",
			path: "/search/items",
			tags: ["Search"],
			description:
				"Every searchable item on Scouting411: site pages, hubs, news sources, resources, ranks, merit badges, Cub Scout adventures, and awards, each with its URL. Use it to search locally; to have the server rank matches, use the search endpoint instead. News posts are not included; query them separately.",
		}),
	)
	.output(z.array(searchItemSchema))
	.handler(() => loadSearchItems());

export const searchProcedure = os
	.meta(
		openapi({
			summary: "Search",
			method: "GET",
			path: "/search",
			tags: ["Search"],
			description:
				"Search Scouting411's site pages, hubs, news sources, resources, ranks, merit badges, Cub Scout adventures, and awards by name, best match first. Fuzzy, so partial words and abbreviations match. News posts are not included; query them separately.",
		}),
	)
	.input(
		z.object({
			q: z.string().min(1).describe('The search query, e.g. "camping".'),
			limit: z.coerce
				.number()
				.int()
				.min(1)
				.optional()
				.describe(
					"Return at most this many results. Omit to return every match.",
				),
		}),
	)
	.output(z.array(searchResultSchema))
	.handler(async ({ input }) =>
		searchItems(await loadSearchItems(), input.q, { limit: input.limit }),
	);
