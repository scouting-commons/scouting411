import z from "zod";
import type { FeedSlug } from "@/lib/news/feeds/types";

import { tagConfigs } from "@/lib/tags/config";

export type TagConfig = {
	name: string;
	slug: string;
	description: string;
	/** a CSS color identifying the tag */
	color?: string;
	/** the feeds whose posts belong to this tag */
	newsSources?: FeedSlug[];
};

export const tagSlugSchema = z.enum(tagConfigs.map((tag) => tag.slug));
export type TagSlug = z.infer<typeof tagSlugSchema>;
