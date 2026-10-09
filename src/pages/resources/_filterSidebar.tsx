import { Checkbox } from "@/components/ui/checkbox";
import { SidebarContent } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { FilterSidebarItem } from "@/components/react/filterSidebarItem";
import { tags } from "@/lib/tags/tag";
import { resourceTypes } from "@/lib/resources/resourceTypes";
import type { QueryResourcesInput } from "@/lib/resources/types";

/** holds the sparse query, so the url records only what the user touched */
export function FilterSidebar({
	query,
	setQuery,
}: {
	query: QueryResourcesInput;
	setQuery: React.Dispatch<React.SetStateAction<QueryResourcesInput>>;
}) {
	return (
		<SidebarContent className="divide-sidebar-border gap-0 divide-y">
			<CheckboxFilter
				label="Types"
				options={resourceTypes}
				selected={query.types ?? []}
				setSelected={(types) => setQuery((query) => ({ ...query, types }))}
			/>
			<CheckboxFilter
				label="Tags"
				options={tags}
				selected={query.tags ?? []}
				setSelected={(tags) => setQuery((query) => ({ ...query, tags }))}
			/>
		</SidebarContent>
	);
}

/**
 * a checklist over a fixed set of options. none checked means no filter, which
 * is passed up as undefined to keep the query sparse
 */
function CheckboxFilter<Slug extends string>({
	label,
	options,
	selected,
	setSelected,
}: {
	label: string;
	options: readonly { slug: Slug; name: string; description: string }[];
	selected: Slug[];
	setSelected: (next: Slug[] | undefined) => void;
}) {
	const set = (next: Slug[]) => setSelected(next.length ? next : undefined);

	return (
		<FilterSidebarItem
			label={`${label} (${selected.length ? `${selected.length}/${options.length}` : "all"})`}
			accessory={
				selected.length > 0 && (
					<Button
						variant="ghost"
						size="xs"
						className="text-primary"
						onClick={() => set([])}
					>
						Clear
					</Button>
				)
			}
		>
			<ul className="-mx-2 flex flex-col">
				{options.map((option) => (
					<li
						key={option.slug}
						className="group/option hover:bg-sidebar-accent flex items-center gap-2 rounded-md px-2 py-1"
					>
						<Checkbox
							id={`${label}-${option.slug}`}
							checked={selected.includes(option.slug)}
							onCheckedChange={(checked) =>
								/** rebuild from the canonical list so the order stays stable */
								set(
									options
										.filter((candidate) =>
											candidate.slug === option.slug
												? checked
												: selected.includes(candidate.slug),
										)
										.map((candidate) => candidate.slug),
								)
							}
						/>
						<label
							htmlFor={`${label}-${option.slug}`}
							className="min-w-0 flex-1 cursor-pointer truncate py-0.5 text-sm"
							title={option.description}
						>
							{option.name}
						</label>
						<Button
							variant="ghost"
							size="xs"
							className="text-primary opacity-0 group-hover/option:opacity-100 focus-visible:opacity-100"
							aria-label={`Show only ${option.name}`}
							onClick={() => set([option.slug])}
						>
							Only
						</Button>
					</li>
				))}
			</ul>
		</FilterSidebarItem>
	);
}
