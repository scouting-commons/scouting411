export const prerender = false;

import type { APIRoute } from "astro";
import { mcpHandler } from "@/mcp/server";

export const GET: APIRoute = ({ redirect }) =>
	redirect("/integrations#mcp-server", 301);

export const ALL: APIRoute = ({ request }) => mcpHandler.fetch(request);
