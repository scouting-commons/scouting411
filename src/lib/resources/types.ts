import { z } from "zod";
import { tagSlugSchema } from "@/lib/tags/types";
import { resourceTypeSlugSchema } from "@/lib/resources/resourceTypes";

export type Resource = z.infer<typeof resourceSchema>;
export const resourceSchema = z.object({
	url: z.url(),
	title: z.string(),
	description: z.string(),
	// todo make required once every resource has a type
	type: resourceTypeSlugSchema.optional(),
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
	types: z
		.array(resourceTypeSlugSchema)
		.optional()
		.describe(
			"Include only resources of one of these types. Omit or pass an empty array to include every resource.",
		),
});
