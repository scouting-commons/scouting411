import { Checkbox } from "@/components/ui/checkbox";
import { SidebarContent } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { FilterSidebarItem } from "@/components/react/filterSidebarItem";
import { tags } from "@/lib/tags/tag";
import type { QueryResourcesInput } from "@/lib/resources/types";
import type { TagSlug } from "@/lib/tags/types";

/** holds the sparse query, so the url records only what the user touched */
export function FilterSidebar({
	query,
	setQuery,
}: {
	query: QueryResourcesInput;
	setQuery: React.Dispatch<React.SetStateAction<QueryResourcesInput>>;
}) {
	/** only explicitly selected tags are checked. none checked means every resource */
	const selected = query.tags ?? [];

	/** keep the query sparse: no selection is the default */
	const setTags = (next: TagSlug[]) =>
		setQuery((query) => ({ ...query, tags: next.length ? next : undefined }));

	return (
		<SidebarContent className="divide-sidebar-border gap-0 divide-y">
			<FilterSidebarItem
				label={`Tags (${selected.length ? `${selected.length}/${tags.length}` : "all"})`}
				accessory={
					selected.length > 0 && (
						<Button
							variant="ghost"
							size="xs"
							className="text-primary"
							onClick={() => setTags([])}
						>
							Clear
						</Button>
					)
				}
			>
				<ul className="-mx-2 flex flex-col">
					{tags.map((tag) => (
						<li
							key={tag.slug}
							className="group/tag hover:bg-sidebar-accent flex items-center gap-2 rounded-md px-2 py-1"
						>
							<Checkbox
								id={`tag-${tag.slug}`}
								checked={selected.includes(tag.slug)}
								onCheckedChange={(checked) =>
									/** rebuild from the canonical tag list so the order stays stable */
									setTags(
										tags
											.filter((candidate) =>
												candidate.slug === tag.slug
													? checked
													: selected.includes(candidate.slug),
											)
											.map((candidate) => candidate.slug),
									)
								}
							/>
							<label
								htmlFor={`tag-${tag.slug}`}
								className="min-w-0 flex-1 cursor-pointer truncate py-0.5 text-sm"
								title={tag.description}
							>
								{tag.name}
							</label>
							<Button
								variant="ghost"
								size="xs"
								className="text-primary opacity-0 group-hover/tag:opacity-100 focus-visible:opacity-100"
								aria-label={`Show only ${tag.name}`}
								onClick={() => setTags([tag.slug])}
							>
								Only
							</Button>
						</li>
					))}
				</ul>
			</FilterSidebarItem>
		</SidebarContent>
	);
}
