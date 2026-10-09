import z from "zod";

import { tagConfigs } from "@/lib/tags/config";

export type TagConfig = {
	name: string;
	slug: string;
	description: string;
};

export const tagSlugSchema = z.enum(tagConfigs.map((tag) => tag.slug));
export type TagSlug = z.infer<typeof tagSlugSchema>;
