import { SidebarContent } from "@/components/ui/sidebar";
import { CheckboxFilter } from "@/components/react/checkboxFilter";
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
