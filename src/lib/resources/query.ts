import { resources } from "@/lib/resources/config";
import type { QueryResourcesInput } from "@/lib/resources/types";

/** query resources, alphabetized. absent and empty `tags` both mean every resource */
export function queryResources({ tags = [] }: QueryResourcesInput = {}) {
	return resources
		.filter(
			(resource) =>
				tags.length === 0 || resource.tags.some((tag) => tags.includes(tag)),
		)
		.toSorted((a, b) => a.title.localeCompare(b.title));
}
