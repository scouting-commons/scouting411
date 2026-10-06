import { queryPostsTool } from "@/mcp/tools/news/posts";
import { getFeedsTool } from "@/mcp/tools/news/feeds";
import { queryResourcesTool } from "@/mcp/tools/resources/resources";
import {
	getMeritBadgeTool,
	listMeritBadgesTool,
} from "@/mcp/tools/advancement/meritBadges";
import { getRankTool, listRanksTool } from "@/mcp/tools/advancement/ranks";
import {
	getAdventureTool,
	listAdventuresTool,
} from "@/mcp/tools/advancement/adventures";
import { getAwardTool, listAwardsTool } from "@/mcp/tools/advancement/awards";
import { searchTool } from "@/mcp/tools/search/search";
import { getSystemStatusTool } from "@/mcp/tools/status/status";

export const tools = [
	searchTool,
	queryPostsTool,
	getFeedsTool,
	queryResourcesTool,
	listMeritBadgesTool,
	getMeritBadgeTool,
	listRanksTool,
	getRankTool,
	listAdventuresTool,
	getAdventureTool,
	listAwardsTool,
	getAwardTool,
	getSystemStatusTool,
];
