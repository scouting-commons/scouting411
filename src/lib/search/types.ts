import { z } from "zod";

const searchItemTypeSchema = z
	.enum([
		"page",
		"hub",
		"feed",
		"resource",
		"rank",
		"meritBadge",
		"adventure",
		"award",
	])
	.describe("What kind of thing the item is.");

/**
 * one searchable thing on the site, in a shape every search surface can share. plain
 * data only — no icons or callbacks — so it can cross the wire to islands, rest, and mcp
 */
export type SearchItem = z.infer<typeof searchItemSchema>;
export const searchItemSchema = z
	.object({
		id: z
			.string()
			.describe("Unique across every item, and stable. Usually its URL."),
		type: searchItemTypeSchema,
		name: z.string().describe("The item's display name."),
		keywords: z
			.array(z.string())
			.describe(
				'Other terms the item should match, besides its name, e.g. "Camping Merit Badge".',
			),
		description: z.string().optional().describe("A short summary."),
		url: z
			.string()
			.describe(
				"Where the item lives: a site path, or an absolute URL for external items.",
			),
		external: z
			.boolean()
			.describe("Whether the URL leaves Scouting411, so opens in a new tab."),
		image: z.url().optional().describe("Art for the item, when it has any."),
		color: z
			.string()
			.optional()
			.describe("A CSS color identifying the item, when it has one."),
	})
	.describe("A searchable item on Scouting411.");

export const searchResultSchema = searchItemSchema
	.extend({
		score: z
			.number()
			.describe("How well the item matches the query, from 0 to 1."),
	})
	.describe("A search match, with its relevance.");
