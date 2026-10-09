import { z } from "zod";
import { tagSlugSchema } from "@/lib/tags/types";

export type Resource = z.infer<typeof resourceSchema>;
export const resourceSchema = z.object({
	url: z.url(),
	title: z.string(),
	description: z.string(),
	tags: z.array(tagSlugSchema),
});

export type QueryResourcesInput = z.infer<typeof queryResourcesInputSchema>;
export const queryResourcesInputSchema = z.object({
	tags: z
		.array(tagSlugSchema)
		.optional()
		.describe(
			"Include only resources with at least one of these tags. Omit or pass an empty array to include every resource.",
		),
});
