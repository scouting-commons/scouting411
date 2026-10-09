import { z } from "zod";
import { tagSlugSchema } from "@/lib/tags/types";

export type Resource = z.infer<typeof resourceSchema>;
export const resourceSchema = z.object({
	url: z.url(),
	title: z.string(),
	description: z.string(),
	tags: z.array(tagSlugSchema),
});
