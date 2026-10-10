import { TagIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTagBySlug } from "@/lib/tags/tag";
import type { TagSlug } from "@/lib/tags/types";
import { cn } from "@/util/cn";

/** a row of badges linking to each tag's hub. renders nothing without tags */
export function TagBadges({ tags }: { tags: TagSlug[] }) {
	if (tags.length === 0) return null;

	return (
		<div className="flex flex-wrap gap-1.5">
			{tags.map(getTagBySlug).map((tag) => (
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
	);
}
