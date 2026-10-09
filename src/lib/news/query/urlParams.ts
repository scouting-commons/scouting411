import { stringify, parse } from "qs";
import { type QueryInput, queryInputSchema } from "@/lib/news/query/types";
import { feedSlugs } from "@/lib/news/feeds/types";

export const queryPostsUrlParams = {
	encode,
	decode,
};

/**
 * arrayFormat is `brackets` rather than the prettier `comma` because comma
 * arrays don't survive a round trip: qs only splits on a literal comma, but
 * URLSearchParams percent-encodes it to %2C, so `feeds=a%2Cb` parses back as
 * the string "a,b" and fails the schema. brackets need no parse-side option —
 * arrayFormat is stringify-only, and qs reads `feeds[]=` as an array natively.
 *
 * arrayLimit is parse-only and defaults to 20: past that, qs silently turns the
 * array into an index-keyed object and the schema rejects it. stringify has no
 * such cap, so selecting more than 20 feeds wrote urls we couldn't read back.
 * size it to the feed list so selecting every feed always fits.
 *
 * an empty `feeds` array needs no special handling: qs drops the key, and an
 * absent `feeds` means every feed, the same as an empty one.
 */
const qsOpts = {
	allowDots: true,
	arrayFormat: "brackets",
	arrayLimit: feedSlugs.length,
} as const;

/** encode a sparse query into a URLSearchParams query */
function encode(query: QueryInput) {
	const queryString = stringify(query, qsOpts);

	return new URLSearchParams(queryString);
}

/** decode a URLSearchParams query into a sparse query */
function decode(searchParams: URLSearchParams) {
	const queryString = searchParams.toString();

	const queryRawJson = parse(queryString, qsOpts);

	return queryInputSchema.safeParse(queryRawJson);
}
