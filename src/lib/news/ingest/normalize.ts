import type { PostData } from "@/lib/news/ingest/types";
import he from "he";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";

/** post-processor for feed adapters to validate and normalize their output */
export function normalizePostData(postData: PostData[]) {
	return z.array(postDataSchema).safeParse(postData);
}

/** clean up a string which may contain html tags and entities */
function cleanHtmlString(html: string) {
	// sanitize the html
	const stripped = sanitizeHtml(html, {
		allowedTags: [],
	});

	// decode any html entities present (e.g. &amp;)
	return he.decode(stripped);
}

/** normalize empty/whitespace strings to undefined */
function blankToUndefined(value: string | undefined) {
	const trimmed = value?.trim();
	return trimmed === "" ? undefined : trimmed;
}

/** bare z.url() allows mailto: and bare words, so pin it to the web */
const webUrl = z.url({ protocol: /^https?$/, hostname: z.regexes.domain });

/** plain text, html stripped */
const text = z.string().transform((value) => cleanHtmlString(value).trim());

/**
 * upstreams each pick their own date format, so validate that the value can be parsed
 * rather than that it matches one shape. a timezone-less datetime
 * parses as local time — an adapter meaning utc has to say so before it gets here
 */
const instant = z
	.string()
	.transform((value) => new Date(value))
	.refine((date) => !isNaN(date.getTime()), {
		error: "is not a parseable date",
	})
	.transform((date) => date.toISOString());

/** the invariants PostData claims, enforced against raw adapter output */
const postDataSchema = z.object({
	url: webUrl,
	title: text.refine((value) => value !== "", { error: "is blank" }),
	// an unusable optional field is dropped rather than failing the whole post
	description: text.optional().transform(blankToUndefined),
	date: instant,
	thumbnail: webUrl.optional().catch(undefined).transform(blankToUndefined),
}) satisfies z.ZodType<PostData>;
