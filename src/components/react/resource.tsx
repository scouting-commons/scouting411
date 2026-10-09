import { Badge } from "@/components/ui/badge";
import type { Resource } from "@/lib/resources/types";
import { getTagBySlug } from "@/lib/tags/tag";

export function Resource({ resource }: { resource: Resource }) {
	return (
		<div className="flex flex-col justify-between gap-3 rounded-lg border p-6 md:flex-row">
			<div className="flex flex-col gap-3">
				<a
					href={resource.url}
					rel="noopener noreferrer"
					target="_blank"
					className="text-primary font-serif text-xl font-bold hover:underline"
				>
					{resource.title}
				</a>

				<p className="text-sm">{resource.description}</p>

				{resource.tags.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{resource.tags.map((slug) => (
							<Badge key={slug} variant="secondary">
								{getTagBySlug(slug).name}
							</Badge>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
