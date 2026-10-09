import {
	and,
	asc,
	count,
	desc,
	gte,
	ilike,
	inArray,
	lt,
	or,
} from "drizzle-orm";
import { db } from "@/infra/db/client";
import { posts } from "@/infra/db/schema";
import { feeds } from "@/lib/news/feeds/feed";
import type { Post } from "@/lib/news/post";
import type { ResolvedQuery } from "@/lib/news/query/resolve";

const feedsBySlug = new Map(feeds.map((feed) => [feed.slug, feed]));

/** the column each sort mode orders by */
const sortColumns = {
	date: posts.publishedAt,
} satisfies Record<ResolvedQuery["sort"]["mode"], unknown>;

/**
 * read one page of matching posts, each hydrated with its feed, plus the
 * number of posts that match across every page
 */
export async function readPosts({
	feeds: feedSlugs,
	filter,
	sort,
	paginate,
}: ResolvedQuery): Promise<{ posts: Post[]; totalItems: number }> {
	const where = and(
		inArray(posts.feedSlug, feedSlugs),
		...filterConditions(filter),
	);
	const direction = sort.direction === "asc" ? asc : desc;

	const pageQuery = db
		.select()
		.from(posts)
		.where(where)
		// id breaks ties, so a post can't move between pages
		.orderBy(direction(sortColumns[sort.mode]), direction(posts.id));

	if (paginate === false) {
		const rows = await pageQuery;
		return { posts: rows.map(hydratePost), totalItems: rows.length };
	}

	const [rows, [total]] = await Promise.all([
		pageQuery
			.limit(paginate.maxPageSize)
			.offset((paginate.page - 1) * paginate.maxPageSize),
		db.select({ count: count() }).from(posts).where(where),
	]);

	return { posts: rows.map(hydratePost), totalItems: total!.count };
}

/** the sql conditions for each filter the query sets */
function filterConditions({ keyword, from, to }: ResolvedQuery["filter"]) {
	return [
		keyword === undefined ? undefined : keywordCondition(keyword),
		// a date-only iso string parses as utc midnight
		from === undefined ? undefined : gte(posts.publishedAt, new Date(from)),
		// inclusive of the whole day, so stop at the start of the next one
		to === undefined ? undefined : lt(posts.publishedAt, nextDay(to)),
	];
}

/** case-insensitive substring match on title or description */
function keywordCondition(keyword: string) {
	const pattern = `%${escapeLike(keyword)}%`;
	return or(ilike(posts.title, pattern), ilike(posts.description, pattern));
}

/** escape the characters `ilike` treats as wildcards, so a keyword matches literally */
function escapeLike(value: string) {
	return value.replace(/[\\%_]/g, "\\$&");
}

function nextDay(date: string) {
	const next = new Date(date);
	next.setUTCDate(next.getUTCDate() + 1);
	return next;
}

/** create a hydrated post from a stored post row */
function hydratePost(row: typeof posts.$inferSelect): Post {
	return {
		url: row.url,
		title: row.title,
		description: row.description,
		date: row.publishedAt,
		feed: feedsBySlug.get(row.feedSlug)!,
		thumbnail: row.thumbnail,
	};
}
