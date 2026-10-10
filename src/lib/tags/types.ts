import z from "zod";
import { tagConfigs } from "@/lib/tags/config";

export type TagConfig = {
	name: string;
	slug: string;
	description: string;
	/** a CSS color identifying the tag */
	color?: string;
};

export const tagSlugSchema = z.enum(tagConfigs.map((tag) => tag.slug));
export type TagSlug = z.infer<typeof tagSlugSchema>;

export type TagConfigEntry = (typeof tagConfigs)[number];

/** a hydrated tag object */
export type Tag = {
	name: string;
	slug: TagSlug;
	description: string;
	color: string | undefined;
	links: {
		/** the tag's hub page */
		page: string;
		/** the resources page, filtered to this tag */
		browseResources: string;
		/** the post browser, filtered to this tag */
		browsePosts: string;
	};
};
