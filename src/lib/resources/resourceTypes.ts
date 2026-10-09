import { z } from "zod";

type ResourceTypeConfig = {
	name: string;
	slug: string;
	description: string;
};

/** the kinds of resource, separate from the topic tags */
export const resourceTypes = [
	{
		name: "Website",
		slug: "website",
		description:
			"The official homepage of a program, organization, base, or event",
	},
	{
		name: "Store",
		slug: "store",
		description: "An official online shop",
	},
	{
		name: "News",
		slug: "news",
		description: "Ongoing news, updates, and newsletters",
	},
	{
		name: "Reference",
		slug: "reference",
		description: "Official policy, how-to help, toolkits, and guides",
	},
	{
		name: "Form",
		slug: "form",
		description: "Applications and forms to fill out or submit",
	},
	{
		name: "Tool",
		slug: "tool",
		description: "Web apps and services you log into or use",
	},
] as const satisfies ResourceTypeConfig[];

export const resourceTypeSlugSchema = z.enum(
	resourceTypes.map((type) => type.slug),
);
export type ResourceTypeSlug = z.infer<typeof resourceTypeSlugSchema>;

/** gets a resource type by its slug */
export function getResourceTypeBySlug(slug: ResourceTypeSlug) {
	return resourceTypes.find((type) => type.slug === slug)!;
}
