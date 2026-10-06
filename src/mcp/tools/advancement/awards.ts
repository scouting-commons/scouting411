import type { McpServer } from "@modelcontextprotocol/server";
import { safe } from "@orpc/client";
import { z } from "zod";
import { rpc } from "@/rpc/client";
import { awardSlugSchema } from "@/lib/advancement/awards/types";

export function listAwardsTool(server: McpServer) {
	server.registerTool(
		"list_awards",
		{
			description: `Every Scouting America award - knots, palms, outdoor awards, and more - with its
slug, program, whether it is an adult award, and award art, ordered by program
and then by name. Sourced from the official Scouting America advancement API and
refreshed daily. The list is unfiltered, so it includes some retired and
historical awards. Call get_award with a slug for an award's requirements.`,
			annotations: {
				readOnlyHint: true,
				title: "List Awards",
			},
		},
		async () => {
			const awards = await rpc.advancement.awards.list();

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(awards, null, "\t"),
					},
				],
			};
		},
	);
}

export function getAwardTool(server: McpServer) {
	server.registerTool(
		"get_award",
		{
			inputSchema: z.object({ slug: awardSlugSchema }),
			description: `A Scouting America award and its newest official requirements, straight from the
Scouting America advancement API. Many awards have no requirements listed
upstream; an empty list means they aren't published there, not that the award
has none. Requirements are a flat list in display order; \`parentId\` and
\`depth\` carry the hierarchy, \`choose\` marks "do N of the following", and
unlabeled entries are notes rather than requirements. Get slugs from
list_awards.`,
			annotations: {
				readOnlyHint: true,
				title: "Get Award",
			},
		},
		async ({ slug }) => {
			const { error, data } = await safe(rpc.advancement.awards.get({ slug }));

			if (error) {
				return {
					isError: true,
					content: [
						{
							type: "text",
							text: `${error.message}. Call list_awards for valid slugs.`,
						},
					],
				};
			}

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(data, null, "\t"),
					},
				],
			};
		},
	);
}
