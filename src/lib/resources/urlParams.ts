import { stringify, parse } from "qs";
import {
	type QueryResourcesInput,
	queryResourcesInputSchema,
} from "@/lib/resources/types";
import { tagSlugSchema } from "@/lib/tags/types";
import { resourceTypeSlugSchema } from "@/lib/resources/resourceTypes";

export const queryResourcesUrlParams = {
	encode,
	decode,
};

/**
 * the same options as the posts query, for the same reasons: see the header
 * comment in `@/lib/news/query/urlParams`. arrayLimit is sized to the longest list
 */
const qsOpts = {
	allowDots: true,
	arrayFormat: "brackets",
	arrayLimit: Math.max(
		tagSlugSchema.options.length,
		resourceTypeSlugSchema.options.length,
	),
} as const;

/** encode a sparse query into a URLSearchParams query */
function encode(query: QueryResourcesInput) {
	return new URLSearchParams(stringify(query, qsOpts));
}

/** decode a URLSearchParams query into a sparse query */
function decode(searchParams: URLSearchParams) {
	const queryRawJson = parse(searchParams.toString(), qsOpts);

	return queryResourcesInputSchema.safeParse(queryRawJson);
}
