import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { rpc } from "@/rpc/client";

export function searchTool(server: McpServer) {
	server.registerTool(
		"search",
		{
			inputSchema: z.object({
				q: z
					.string()
					.min(1)
					.describe('What to look for, by name, e.g. "camping" or "eagle".'),
				limit: z
					.number()
					.int()
					.min(1)
					.optional()
					.describe(
						"Return at most this many results. Omit to return every match.",
					),
			}),
			description: `Find things on Scouting411 by name: ranks, merit badges, Cub Scout
adventures, awards, official resources (handbooks, tools, reference sites), news sources,
hubs, and site pages. Use it when you know roughly what you're after but not which
list it's in, or to turn a name into a link. Matching is fuzzy on names and short
descriptions, best match first, each result with its type and URL. Results
don't include news posts.`,
			annotations: {
				readOnlyHint: true,
				title: "Search",
			},
		},
		async (input) => {
			const results = await rpc.search.query(input);

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(results, null, "\t"),
					},
				],
			};
		},
	);
}
