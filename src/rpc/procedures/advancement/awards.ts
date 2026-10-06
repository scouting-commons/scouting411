import { ORPCError, os } from "@orpc/server";
import { openapi } from "@orpc/openapi";
import { z } from "zod";
import { getAward, listAwards } from "@/lib/advancement/awards/query";
import {
	awardDetailSchema,
	awardSchema,
	awardSlugSchema,
} from "@/lib/advancement/awards/types";

export const listAwardsProcedure = os
	.meta(
		openapi({
			summary: "List awards",
			method: "GET",
			path: "/advancement/awards",
			tags: ["Advancement"],
			description:
				"Every Scouting America award, such as knots, palms, and outdoor awards, with its program and award art. Ordered by program, then name. Sourced from the official Scouting America advancement API and refreshed daily, unfiltered, so it includes some retired and historical awards. Use an award's slug to fetch its requirements.",
		}),
	)
	.output(z.array(awardSchema))
	.handler(() => listAwards());

export const getAwardProcedure = os
	.meta(
		openapi({
			summary: "Get an award",
			method: "GET",
			path: "/advancement/awards/{slug}",
			tags: ["Advancement"],
			description:
				"An award and its newest official requirements. Many awards have no requirements listed upstream, so an empty list is normal. Requirements are a flat list in display order; `parentId` and `depth` carry the hierarchy, and `choose` marks a requirement where only that many of its children need to be completed. Requirement text is sanitized HTML.",
		}),
	)
	.input(z.object({ slug: awardSlugSchema }))
	.output(awardDetailSchema)
	.handler(async ({ input }) => {
		const award = await getAward(input.slug);

		if (!award) {
			throw new ORPCError("NOT_FOUND", {
				message: `no award with slug "${input.slug}"`,
			});
		}

		return award;
	});
