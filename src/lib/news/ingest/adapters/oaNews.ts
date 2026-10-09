import type { FeedAdapter } from "@/lib/news/ingest/upstream/types";
import type { PostData } from "@/lib/news/ingest/types";
import { parse, type HTMLElement } from "node-html-parser";
import { sleep } from "@/util/sleep";

/** the news listing, a server-rendered drupal view */
const newsUrl = "https://oa-scouting.org/news";

/** the number of milliseconds to wait between requests */
const requestInterval = 500;

/**
 * scrapes the order of the arrow's news listing page by page. the site is
 * drupal 11 with no json:api or rest module exposed, and /rss.xml is core's
 * stock frontpage feed, hard capped at 10 items and ignoring
 * page/items_per_page. sitemap.xml is no help either: its index points at the
 * noac subdomain and carries no titles or publish dates.
 *
 * pages are walked with drupal's zero-indexed `?page=` pager (~142 pages of 9),
 * and the last page number is read from the pager's "last" link. rows are read
 * as the bootstrap cards the oa theme renders: a linked `h4` title, a teaser
 * `p`, a `time[datetime]` and an optional image.
 */
export function OaNewsAdapter(): FeedAdapter {
	const execute = async () => {
		const firstPage = await fetchPage(0);

		const remainingPages = Array.from(
			{ length: firstPage.lastPage },
			(_, i) => i + 1,
		);

		const remainingPagesPosts = await Promise.all(
			remainingPages.map(async (page, i) => {
				await sleep(requestInterval * i);
				return (await fetchPage(page)).posts;
			}),
		);

		const posts = [firstPage.posts, ...remainingPagesPosts].flat();

		// a post published mid-crawl shifts every row down one, so the row at
		// a page boundary can be read twice
		const unique = [...new Map(posts.map((post) => [post.url, post])).values()];

		console.log(`fetched ${unique.length} posts from ${newsUrl}`);

		return unique;
	};

	return {
		type: {
			id: "oa-news",
			human: "OA News",
		},
		execute,
	};
}

/** retrieve and parse one page of the listing */
async function fetchPage(page: number) {
	const url = new URL(newsUrl);
	url.searchParams.set("page", String(page));

	console.log(`fetch page ${page} from ${newsUrl}`);

	const response = await fetch(url);

	if (response.status !== 200) {
		throw new Error(
			`failed to fetch oa news page ${url}: status code ${response.status}`,
		);
	}

	const root = parse(await response.text());

	// scoped to the view's own container, so sidebar blocks (themselves views
	// with rows) aren't read as posts
	const posts = root
		.querySelectorAll(".view > .view-content > .views-row")
		.filter((row) => row.querySelector(".card"))
		.map((row) => parseRow(row, url));

	const lastHref = root
		.querySelector(".pager__item--last a")
		?.getAttribute("href");
	const lastPage = lastHref
		? Number(new URL(lastHref, url).searchParams.get("page"))
		: page;

	if (!Number.isInteger(lastPage)) {
		throw new Error(`failed to parse oa news page ${url}: bad pager link`);
	}

	return { posts, lastPage };
}

/** read one card into post data. relative urls resolve against the page */
function parseRow(row: HTMLElement, pageUrl: URL): PostData {
	const link = row.querySelector(".card-body h4 a");
	const href = link?.getAttribute("href");
	if (!link || !href) {
		throw new Error(`failed to parse oa news page ${pageUrl}: no title link`);
	}

	const date = row.querySelector("time")?.getAttribute("datetime");
	if (!date) {
		throw new Error(`failed to parse oa news page ${pageUrl}: no datetime`);
	}

	const img = row.querySelector(".card-image img")?.getAttribute("src");
	// drupal fills an empty image field with the field's default image, which
	// is a "no image" placeholder rather than the post's own art
	const src = img?.includes("/default_images/") ? undefined : img;

	return {
		url: new URL(href, pageUrl).toString(),
		// raw text, so normalize decodes the entities
		title: link.rawText,
		description: row.querySelector(".card-body p")?.rawText,
		date,
		thumbnail: src ? new URL(src, pageUrl).toString() : undefined,
	};
}
