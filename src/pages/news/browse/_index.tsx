import { CardFeed } from "@/components/react/cardFeed";
import { PostComponent } from "@/components/react/post";
import type { Post } from "@/lib/news/feeds/post";
import type { QueryInput } from "@/lib/news/query/types";
import {
	SecondarySidebar,
	SecondarySidebarTrigger,
} from "@/components/layout/sidebar/secondarySidebar";
import { useState, useEffect, useRef } from "react";
import { safe } from "@orpc/client";
import { rpc } from "@/rpc/client";
import { FilterSidebar } from "@/pages/news/browse/_filterSidebar";
import { PaginationControl } from "@/components/react/paginate";
import { postsQueryParamsEncoder } from "@/lib/news/query/queryParams";
import type { PaginatedResults } from "@/util/paginateArray";

export function Page({ initialQuery }: { initialQuery: QueryInput }) {
	const [query, setQuery] = useState(initialQuery);
	const [results, setResults] = useState<PaginatedResults<Post> | undefined>(
		undefined,
	);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		/**
		 * a narrower query resolves faster than a broader one (one database read per
		 * selected feed), so without this an in-flight broad query can land after a
		 * narrow one and overwrite it. only the latest query may set posts.
		 */
		let stale = false;

		/** push the new query values to the page url */
		updateUrlQuery(query);

		(async () => {
			const { error, data } = await safe(rpc.news.posts.query(query));

			if (stale) return;

			if (error) {
				alert(error);
				return;
			}

			setResults(data);
			// new results replace the whole list, so start reading from the top
			contentRef.current?.scrollTo({ top: 0 });
			// on mobile the window scrolls instead of the content
			window.scrollTo({ top: 0 });
		})();

		return () => {
			stale = true;
		};
	}, [query]);

	return (
		<SecondarySidebar
			label="Filters"
			contentRef={contentRef}
			sidebar={
				<FilterSidebar query={query} setQuery={setQuery} results={results} />
			}
		>
			<div className="flex flex-1 flex-col gap-5 p-8">
				<div className="flex items-center justify-between gap-4">
					<p className="text-muted-foreground text-sm">
						{results &&
							`${Intl.NumberFormat("en-us").format(results.pagination.totalItems)} results`}
					</p>
					<SecondarySidebarTrigger />
				</div>

				{results?.posts.length === 0 && (
					<div className="flex flex-col items-center gap-4 p-8">
						<div className="text-xl">No posts found matching your search.</div>
						<div className="text-muted-foreground text-sm">
							Try adjusting your filters or searching for a different keyword.
						</div>
					</div>
				)}

				{results === undefined && (
					<div className="flex flex-col items-center gap-4 p-8">
						<div className="shimmer text-xl">Loading posts...</div>
					</div>
				)}

				{results && results.posts.length > 0 && (
					<CardFeed>
						{results.posts.map((post) => (
							<PostComponent post={post} key={post.url} />
						))}
					</CardFeed>
				)}

				{/*
				 * on mobile the sidebar's pager is hidden in the sheet. the sheet's form
				 * remounts from the query each time it opens, so setting the query
				 * directly here can't leave it stale
				 */}
				{results && results.pagination.totalPages > 1 && (
					<div className="md:hidden">
						<PaginationControl
							page={results.pagination.page}
							maxPage={results.pagination.totalPages}
							onPageChange={(page) => {
								if (Number.isInteger(page) && page >= 1) {
									setQuery((query) => ({
										...query,
										paginate: { ...query.paginate, page },
									}));
								}
							}}
						/>
					</div>
				)}
			</div>
		</SecondarySidebar>
	);
}

function updateUrlQuery(query: QueryInput) {
	const queryString = postsQueryParamsEncoder.encode(query);

	const url = new URL(document.location.href);
	url.search = queryString.toString();

	history.replaceState(null, "", url);
}
