import { CardFeed } from "@/components/react/cardFeed";
import { PostComponent } from "@/components/react/post";
import type { Post } from "@/lib/news/feeds/post";
import type { QueryInput } from "@/lib/news/query/types";
import { SecondarySidebar } from "@/components/layout/sidebar/secondarySidebar";
import { useState, useEffect, useRef } from "react";
import { safe } from "@orpc/client";
import { rpc } from "@/rpc/client";
import { FilterSidebar } from "@/pages/news/browse/_filterSidebar";
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
		 * a narrower query resolves faster than a broader one (one redis read per
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
		})();

		return () => {
			stale = true;
		};
	}, [query]);

	return (
		<SecondarySidebar
			contentRef={contentRef}
			sidebar={
				<FilterSidebar query={query} setQuery={setQuery} results={results} />
			}
		>
			<div className="flex flex-1 flex-col gap-5 p-8">
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
