import { tagConfigs } from "@/lib/tags/config";
import type { TagSlug } from "@/lib/tags/types";

/** gets a tag by its slug */
export function getTagBySlug(slug: TagSlug) {
	return tagConfigs.find((tag) => tag.slug === slug)!;
}
