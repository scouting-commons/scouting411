import { z } from "zod";
import type { Post } from "@/lib/news/post";
import type { Predicate } from "@/util/utilTypes";

export function filterPosts(
	posts: Post[],
	opts: z.infer<typeof filterOptsSchema>,
) {
	const predicates = buildPredicates(opts);

	return posts.filter((post) =>
		predicates.every((predicate) => predicate(post)),
	);
}

/** turn a filter config into an array of predicates */
function buildPredicates(filter: FilterOpts): Predicate<Post>[] {
	const predicates: Predicate<Post>[] = [];

	for (const [key, value] of Object.entries(filter) as [
		keyof FilterOpts,
		FilterOpts[keyof FilterOpts],
	][]) {
		if (value !== undefined) {
			const factory = predicateFactories[key];
			predicates.push(factory(value as NonNullable<typeof value>));
		}
	}

	return predicates;
}

const predicateFactories: PredicateFactories<FilterOpts, Post> = {
	keyword: (value: string): Predicate<Post> => {
		return (post) => {
			const titleMatch = post.title.toUpperCase().includes(value.toUpperCase());
			const descriptionMatch = !!post.description
				?.toUpperCase()
				.includes(value.toUpperCase());

			return titleMatch || descriptionMatch;
		};
	},
	from: (value: string): Predicate<Post> => {
		// a date-only iso string parses as utc midnight
		const start = new Date(value);

		return (post) => post.date >= start;
	},
	to: (value: string): Predicate<Post> => {
		// inclusive of the whole day, so stop at the start of the next one
		const end = new Date(value);
		end.setUTCDate(end.getUTCDate() + 1);

		return (post) => post.date < end;
	},
};
type PredicateFactories<F, T> = {
	[K in keyof F]-?: (value: NonNullable<F[K]>) => Predicate<T>;
};

type FilterOpts = z.infer<typeof filterOptsSchema>;
export const filterOptsSchema = z
	.object({
		keyword: z
			.string()
			.optional()
			.describe(
				"Get only posts that contain this string in their title or description. Case insensitive.",
			),
		from: z.iso
			.date()
			.optional()
			.describe(
				"Get only posts published on or after this date (YYYY-MM-DD, UTC).",
			),
		to: z.iso
			.date()
			.optional()
			.describe(
				"Get only posts published on or before this date (YYYY-MM-DD, UTC).",
			),
	})
	.strict();
