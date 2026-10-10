import type { Resource } from "@/lib/resources/types";
import { TagBadges } from "@/components/react/tagBadges";
import { getResourceTypeBySlug } from "@/lib/resources/resourceTypes";

export function Resource({ resource }: { resource: Resource }) {
	return (
		<div className="flex flex-col justify-between gap-3 rounded-lg border p-6 md:flex-row">
			<div className="flex flex-col gap-3">
				<p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
					{getResourceTypeBySlug(resource.type).name}
				</p>
				<a
					href={resource.url}
					rel="noopener noreferrer"
					target="_blank"
					className="text-primary font-serif text-xl font-bold hover:underline"
				>
					{resource.title}
				</a>

				<p className="text-sm">{resource.description}</p>

				<TagBadges tags={resource.tags} />
			</div>
		</div>
	);
}
