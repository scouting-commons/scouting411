import { z } from "zod";
import { requirementSchema } from "@/lib/advancement/requirements";

export type Award = z.infer<typeof awardSchema>;
export const awardSchema = z
	.object({
		id: z.string().describe("Scouting America's id for the award."),
		slug: z
			.string()
			.describe(
				'A URL-safe identifier derived from the name, e.g. "national-outdoor-achievement-award-adventure". Use it to fetch the award\'s requirements.',
			),
		name: z
			.string()
			.describe(
				'The official name, e.g. "National Outdoor Achievement Award (Adventure)".',
			),
		program: z
			.string()
			.describe(
				'The program the award is for, e.g. "Scouts BSA" or "Venturing", or "All" when it is open to every program.',
			),
		adult: z.boolean().describe("Whether the award is for adults."),
		images: z
			.object({
				small: z.url().describe("100px award art."),
				medium: z.url().describe("200px award art."),
				large: z.url().describe("400px award art."),
			})
			.optional()
			.describe(
				"URLs of the official award art, as square PNGs. Absent on awards without art.",
			),
	})
	.describe("A Scouting America award.");

export type AwardDetail = z.infer<typeof awardDetailSchema>;
export const awardDetailSchema = awardSchema
	.extend({
		version: z
			.string()
			.optional()
			.describe(
				'The version of the requirements, usually the year they were issued, e.g. "2010". Absent when upstream lists no version.',
			),
		versionEffective: z.iso
			.date()
			.optional()
			.describe("The date this version of the requirements took effect."),
		requirements: z
			.array(requirementSchema)
			.describe(
				"The newest official requirements, as a flat list in display order. Empty for the many awards whose requirements aren't listed.",
			),
	})
	.describe("A Scouting America award and its requirements.");

export const awardSlugSchema = z
	.string()
	.regex(/^[a-z0-9-]+$/, { error: "is not an award slug" })
	.describe(
		'The award\'s slug, as returned by the list endpoint, e.g. "national-outdoor-achievement-award-adventure".',
	);

/** the page for an award */
export function awardPath(slug: string) {
	return `/advancement/awards/${slug}`;
}
