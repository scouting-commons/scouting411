import { useEffect, useState } from "react";
import { CardFeed } from "@/components/react/cardFeed";
import { Resource } from "@/components/react/resource";
import {
	SecondarySidebar,
	SecondarySidebarTrigger,
} from "@/components/layout/sidebar/secondarySidebar";
import { FilterSidebar } from "@/pages/resources/_filterSidebar";
import { queryResources } from "@/lib/resources/query";
import type { QueryResourcesInput } from "@/lib/resources/types";
import { queryResourcesUrlParams } from "@/lib/resources/urlParams";

/**
 * resources are static config, so the island queries them locally rather than
 * through rpc, and needs none of the browse page's stale-response handling
 */
export function Page({ initialQuery }: { initialQuery: QueryResourcesInput }) {
	const [query, setQuery] = useState(initialQuery);
	const resources = queryResources(query);

	/** push the query to the page url */
	useEffect(() => {
		const url = new URL(document.location.href);
		url.search = queryResourcesUrlParams.encode(query).toString();

		history.replaceState(null, "", url);
	}, [query]);

	return (
		<SecondarySidebar
			label="Filters"
			sidebar={<FilterSidebar query={query} setQuery={setQuery} />}
		>
			<div className="flex flex-1 flex-col gap-5 p-8">
				<div className="flex items-center justify-between gap-4">
					<p className="text-muted-foreground text-sm">
						{`${resources.length} results`}
					</p>
					<SecondarySidebarTrigger />
				</div>

				{resources.length === 0 ? (
					<div className="flex flex-col items-center gap-4 p-8">
						<div className="text-xl">
							No resources found matching your filters.
						</div>
						<div className="text-muted-foreground text-sm">
							Try selecting different filters.
						</div>
					</div>
				) : (
					<CardFeed>
						{resources.map((resource) => (
							<Resource resource={resource} key={resource.url} />
						))}
					</CardFeed>
				)}
			</div>
		</SecondarySidebar>
	);
}
