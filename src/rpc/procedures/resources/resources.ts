import { os } from "@orpc/server";
import { queryResources } from "@/lib/resources/query";
import { openapi } from "@orpc/openapi";
import {
	queryResourcesInputSchema,
	resourceSchema,
} from "@/lib/resources/types";
import { z } from "zod";

export const queryResourcesProcedure = os
	.meta(
		openapi({
			summary: "Query resources",
			tags: ["Resources"],
			path: "/resources",
			description:
				"A list of all resources on Scouting411. Resources are external links to websites, tools, reference documents, and other items of interest.",
		}),
	)
	.input(queryResourcesInputSchema.optional())
	.output(z.array(resourceSchema))
	.handler(({ input }) => queryResources(input));
