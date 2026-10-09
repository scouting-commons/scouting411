import { tagConfigs } from "@/lib/tags/config";
import type { TagSlug } from "@/lib/tags/types";

/** the list of all tags, alphabetized */
export const tags = tagConfigs.toSorted((a, b) => a.name.localeCompare(b.name));

/** gets a tag by its slug */
export function getTagBySlug(slug: TagSlug) {
	return tagConfigs.find((tag) => tag.slug === slug)!;
}
