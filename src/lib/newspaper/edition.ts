import type { Post } from "@/lib/news/feeds/post";

// an edition comes out each sunday and covers the sunday-to-saturday week
// before it. dates are utc to match the news query filter.

const dayMs = 24 * 60 * 60 * 1000;

const isoDate = (time: number) => new Date(time).toISOString().slice(0, 10);

/** midnight utc of the sunday on or before `time` */
const sundayOf = (time: number) => {
	const day = Math.floor(time / dayMs) * dayMs;
	return day - new Date(day).getUTCDay() * dayMs;
};

const latestEdition = () => sundayOf(Date.now());

// the latest edition lives at /newspaper, so its link never goes stale
const editionHref = (time: number) =>
	time === latestEdition() ? "/newspaper" : `/newspaper/${isoDate(time)}`;

const buildEdition = (time: number) => {
	const date = new Date(time);
	const previous = time - 7 * dayMs;
	const next = time + 7 * dayMs;

	return {
		date,
		href: editionHref(time),
		start: new Date(previous),
		end: new Date(time - dayMs),
		/** a news query filter for the week this edition covers */
		filter: { from: isoDate(previous), to: isoDate(time - dayMs) },
		previousHref: editionHref(previous),
		nextHref: next <= latestEdition() ? editionHref(next) : undefined,
	};
};

/**
 * the edition published on `date` (yyyy-mm-dd), or the latest one when
 * omitted. undefined when no edition came out that day.
 */
export const getEdition = (date?: string) => {
	if (date === undefined) {
		return buildEdition(latestEdition());
	}

	const time = Date.parse(`${date}T00:00:00Z`);
	const published =
		/^\d{4}-\d{2}-\d{2}$/.test(date) &&
		sundayOf(time) === time &&
		time <= latestEdition();

	return published ? buildEdition(time) : undefined;
};

/** the story that leads an edition: the newest one with its own photo */
export const leadPost = (posts: Post[]) =>
	posts.find((post) => post.thumbnail) ?? posts[0];

/**
 * the published editions these posts ran in, each with its posts. keeps the
 * order of `posts`, so newest-first posts give newest-first editions.
 */
export const editionsOf = (posts: Post[]) =>
	[...Map.groupBy(posts, (post) => sundayOf(post.date.getTime()) + 7 * dayMs)]
		.filter(([time]) => time <= latestEdition())
		.map(([time, editionPosts]) => ({
			...buildEdition(time),
			posts: editionPosts,
		}));
