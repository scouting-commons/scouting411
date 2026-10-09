import { ExternalLinkIcon, NewspaperIcon, SearchIcon } from "lucide-react";
import { SearchForm } from "@/components/react/searchForm";
import { queryPostsUrlParams } from "@/lib/news/query/urlParams";
import relativeDate from "tiny-relative-date";
import { cn } from "@/util/cn";
import {
	searchItemMedia,
	searchItemTypes,
} from "@/components/react/searchItem";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import type { SearchItem } from "@/lib/search/types";
import type { Post } from "@/lib/news/post";
import { Icon } from "@/components/react/icon";

type SearchTab = "all" | "news";

export function Page({
	query,
	tab,
	results,
	news,
	newsTotal,
	origin,
}: {
	query: string;
	tab: SearchTab;
	results: SearchItem[];
	/** the latest news posts matching the query: a few on the all tab, a page on news */
	news: Post[];
	/** how many news posts match in all, of which `news` is the first few */
	newsTotal: number;
	/** the site's origin, to resolve internal urls for display */
	origin: string;
}) {
	return (
		<div className="flex w-full max-w-3xl flex-col gap-6 p-8">
			<SearchForm query={query} {...(tab !== "all" && { tab })} />

			<SearchTabs query={query} tab={tab} />

			{tab === "all" && results.length === 0 && news.length > 0 ? (
				// a carousel alone reads as an empty page with a widget on it, so with only
				// news to show, it's listed the way the news tab lists it
				<>
					<p className="text-muted-foreground text-sm">
						{`Nothing on the site is named “${query}”, but it shows up in ${newsTotal} news ${newsTotal === 1 ? "result" : "results"}.`}
					</p>

					<NewsList posts={news} />

					{newsTotal > news.length && (
						<a
							href={searchHref(query, "news")}
							className="text-primary w-fit text-sm font-medium hover:underline"
						>
							{`See all ${newsTotal} news results →`}
						</a>
					)}
				</>
			) : tab === "all" ? (
				<>
					<p className="text-muted-foreground text-sm">
						{results.length > 0
							? `${results.length} ${results.length === 1 ? "result" : "results"} for “${query}”`
							: `No results for “${query}”. Try a shorter or different search.`}
					</p>

					<ol className="flex flex-col gap-7">
						{news.length > 0 && (
							<NewsCarousel query={query} posts={news} total={newsTotal} />
						)}
						{results.map((result) => (
							<SearchResult key={result.id} item={result} origin={origin} />
						))}
					</ol>
				</>
			) : (
				<>
					<p className="text-muted-foreground text-sm">
						{newsTotal > 0
							? `${newsTotal} news ${newsTotal === 1 ? "result" : "results"} for “${query}”`
							: `No news results for “${query}”.`}
					</p>

					{news.length > 0 && (
						<>
							<NewsList posts={news} />

							<a
								href={newsfeedHref(query)}
								className="text-primary w-fit text-sm font-medium hover:underline"
							>
								{newsTotal > news.length
									? `See all ${newsTotal} in the newsfeed →`
									: `Browse in the newsfeed →`}
							</a>
						</>
					)}
				</>
			)}
		</div>
	);
}

/** the search page's url for a query on a tab. all is the default, so it goes unwritten */
function searchHref(query: string, tab: SearchTab) {
	return `/search?${new URLSearchParams({ q: query, ...(tab !== "all" && { tab }) })}`;
}

/** the newsfeed filtered to the query, for news posts past the ones shown here */
function newsfeedHref(query: string) {
	return `/news/browse?${queryPostsUrlParams.encode({
		filter: { keyword: query },
	})}`;
}

/** links rather than buttons, so each tab has a url and the back button works */
function SearchTabs({
	query,
	tab,
	className,
}: {
	query: string;
	tab: SearchTab;
	className?: string;
}) {
	const tabs = [
		{ key: "all", label: "All", icon: <Icon icon={SearchIcon} /> },
		{ key: "news", label: "News", icon: <Icon icon={NewspaperIcon} /> },
	] as const;

	return (
		<nav
			aria-label="Search tabs"
			className={cn("flex gap-6 border-b text-sm", className)}
		>
			{tabs.map(({ key, label, icon }) => (
				<a
					key={key}
					href={searchHref(query, key)}
					aria-current={key === tab ? "page" : undefined}
					className="text-muted-foreground hover:text-foreground aria-[current=page]:border-primary aria-[current=page]:text-foreground -mb-px flex items-center gap-1.5 border-b-2 border-transparent pb-2 font-medium"
				>
					{icon}
					{label}
				</a>
			))}
		</nav>
	);
}

/**
 * search results don't cover news, so the latest matching posts lead them in a
 * carousel, with a link to the news tab for the rest
 */
function NewsCarousel({
	query,
	posts,
	total,
}: {
	query: string;
	posts: Post[];
	total: number;
}) {
	return (
		<li>
			<Carousel
				opts={{ align: "start", slidesToScroll: "auto" }}
				className="flex flex-col gap-3"
			>
				<div className="flex items-center justify-between gap-2">
					<h2 className="flex items-center gap-2 font-serif text-lg font-bold">
						<Icon icon={NewspaperIcon} className="text-muted-foreground" />
						Top Stories
					</h2>
					<div className="flex gap-2">
						<CarouselPrevious className="static" />
						<CarouselNext className="static" />
					</div>
				</div>

				<CarouselContent className="-ml-3">
					{posts.map((post) => (
						<CarouselItem
							key={post.url}
							className="basis-[45%] pl-3 sm:basis-1/3 md:basis-1/4"
						>
							<a
								href={post.url}
								rel="noopener noreferrer"
								target="_blank"
								className="group hover:bg-muted/40 flex h-full flex-col overflow-hidden rounded-lg border"
							>
								{/* a post without its own thumbnail falls back to its feed's cover,
								usually a logo, which is shown whole rather than cropped */}
								<img
									src={post.thumbnail ?? post.feed.coverImageSrc}
									alt=""
									loading="lazy"
									className={cn(
										"bg-muted/40 aspect-video w-full border-b",
										post.thumbnail ? "object-cover" : "object-contain p-3",
									)}
								/>
								<div className="flex flex-col gap-1 p-2.5">
									<span className="text-muted-foreground truncate text-xs">
										{post.feed.name} &middot; {relativeDate(post.date)}
									</span>
									<span className="line-clamp-3 text-sm leading-snug font-medium wrap-anywhere group-hover:underline">
										{post.title}
									</span>
								</div>
							</a>
						</CarouselItem>
					))}
				</CarouselContent>

				<a
					href={searchHref(query, "news")}
					className="text-primary w-fit text-sm font-medium hover:underline"
				>
					{total > posts.length
						? `See all ${total} news results →`
						: `More in news →`}
				</a>
			</Carousel>
		</li>
	);
}

/** news posts as full results: the news tab's list, and the all tab's when it's all news */
function NewsList({ posts }: { posts: Post[] }) {
	return (
		<ol className="flex flex-col gap-7">
			{posts.map((post) => (
				<li key={post.url} className="flex gap-4">
					<div className="flex min-w-0 flex-1 flex-col gap-0.5">
						<span className="text-muted-foreground text-xs">
							<span className="text-foreground font-medium">
								{post.feed.name}
							</span>{" "}
							&middot; {relativeDate(post.date)}
						</span>
						<a
							href={post.url}
							rel="noopener noreferrer"
							target="_blank"
							className="text-primary w-fit font-serif text-lg leading-snug font-bold wrap-anywhere hover:underline"
						>
							{post.title}
						</a>
						{post.description && (
							<p className="text-muted-foreground line-clamp-2 text-sm">
								{post.description}
							</p>
						)}
					</div>

					{post.thumbnail && (
						<img
							src={post.thumbnail}
							alt=""
							loading="lazy"
							className="mt-0.5 size-20 shrink-0 rounded-md border object-cover"
						/>
					)}
				</li>
			))}
		</ol>
	);
}

function SearchResult({ item, origin }: { item: SearchItem; origin: string }) {
	const type = searchItemTypes[item.type];

	return (
		<li className="flex gap-4">
			<div
				className="bg-muted/40 text-muted-foreground mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-md border [&_svg]:size-5"
				style={{ color: item.color }}
			>
				{searchItemMedia(item, "size-8 rounded-sm") ?? type.icon}
			</div>

			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<div className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-xs">
					<span className="text-foreground shrink-0 font-medium">
						{type.label}
					</span>
					<span aria-hidden>·</span>
					<span className="truncate">{breadcrumb(item.url, origin)}</span>
				</div>

				<a
					href={item.url}
					{...(item.external && {
						target: "_blank",
						rel: "noopener noreferrer",
					})}
					className="text-primary w-fit font-serif text-lg leading-snug font-bold hover:underline"
				>
					{item.name}
					{item.external && (
						<Icon
							icon={ExternalLinkIcon}
							small
							className="ml-1.5"
							aria-label="(opens in a new tab)"
						/>
					)}
				</a>

				{item.description && (
					<p className="text-muted-foreground line-clamp-2 text-sm">
						{item.description}
					</p>
				)}
			</div>
		</li>
	);
}

/** a url as a breadcrumb, the way search engines show one: "host › path › segments" */
function breadcrumb(url: string, origin: string) {
	const { host, pathname } = new URL(url, origin);

	return [host.replace(/^www\./, ""), ...pathname.split("/").filter(Boolean)]
		.map(decodeURIComponent)
		.join(" › ");
}
