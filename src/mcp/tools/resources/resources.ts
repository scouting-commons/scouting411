import { rpc } from "@/rpc/client";
import type { McpServer } from "@modelcontextprotocol/server";
import { queryResourcesInputSchema } from "@/lib/resources/types";

export function queryResourcesTool(server: McpServer) {
	server.registerTool(
		"query_resources",
		{
			inputSchema: queryResourcesInputSchema,
			description: `A list of all resources on Scouting411. Resources are external links to
websites, tools, reference documents, and other items of interest.`,
			annotations: {
				readOnlyHint: true,
				title: "Get Resources",
			},
		},
		async (query) => {
			const resources = await rpc.resources.query(query);

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(resources, null, "\t"),
					},
				],
			};
		},
	);
}
