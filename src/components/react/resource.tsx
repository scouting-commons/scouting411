import { TagIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Resource } from "@/lib/resources/types";
import { getTagBySlug } from "@/lib/tags/tag";
import { cn } from "@/util/cn";

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
						{resource.tags.map(getTagBySlug).map((tag) => (
							<Badge
								key={tag.slug}
								variant="outline"
								render={<a href={tag.links.page} />}
							>
								<TagIcon
									data-icon="inline-start"
									className={cn(!tag.color && "text-muted-foreground")}
									style={{ color: tag.color }}
								/>
								{tag.name}
							</Badge>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
