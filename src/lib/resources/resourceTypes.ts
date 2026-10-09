import { z } from "zod";

type ResourceTypeConfig = {
	name: string;
	slug: string;
	description: string;
};

/** the kinds of resource (tool, form, ...), separate from the topic tags */
const resourceTypeConfigs = [] as const satisfies ResourceTypeConfig[];

type ResourceType = ResourceTypeConfig & {
	slug: (typeof resourceTypeConfigs)[number]["slug"];
};

/** typed per element rather than as a literal tuple, so fields stay readable while the list is empty */
export const resourceTypes: readonly ResourceType[] = resourceTypeConfigs;

export const resourceTypeSlugSchema = z.enum(
	resourceTypes.map((type) => type.slug),
);
export type ResourceTypeSlug = z.infer<typeof resourceTypeSlugSchema>;

/** gets a resource type by its slug */
export function getResourceTypeBySlug(slug: ResourceTypeSlug) {
	return resourceTypes.find((type) => type.slug === slug)!;
}
