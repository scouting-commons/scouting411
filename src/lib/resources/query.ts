import { resources } from "@/lib/resources/config";
import type { QueryResourcesInput } from "@/lib/resources/types";

/**
 * query resources, alphabetized. absent and empty `tags` or `types` both mean
 * no filter on that field
 */
export function queryResources({
	tags = [],
	types = [],
}: QueryResourcesInput = {}) {
	return resources
		.filter(
			(resource) =>
				tags.length === 0 || resource.tags.some((tag) => tags.includes(tag)),
		)
		.filter(
			(resource) =>
				types.length === 0 ||
				(resource.type !== undefined && types.includes(resource.type)),
		)
		.toSorted((a, b) => a.title.localeCompare(b.title));
}
