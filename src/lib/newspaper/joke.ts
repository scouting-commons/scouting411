import * as he from "he";
import { z } from "zod";
import { toDate, type IsoDate } from "@/lib/newspaper/dates";

/** the jokes category on jokes.scoutlife.org. the site's other posts are comics */
const jokesCategoryId = 2;

const jokesSchema = z.array(
	z.object({
		link: z.string(),
		content: z.object({ rendered: z.string() }),
	}),
);

/**
 * the newest scout life joke posted before the issue on `date` came out, so
 * later jokes never change the pick. fetched live from the site's wordpress
 * api rather than stored: one joke a week isn't worth ingesting them all
 */
export async function latestJoke(date: IsoDate) {
	const params = new URLSearchParams({
		categories: String(jokesCategoryId),
		before: toDate(date).toISOString(),
		per_page: "1",
		_fields: "link,content",
	});
	const url = `https://jokes.scoutlife.org/wp-json/wp/v2/posts?${params.toString()}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(
			`failed to fetch joke from ${url} - status code ${response.status}`,
		);
	}

	const [joke] = jokesSchema.parse(await response.json());

	return joke && { url: joke.link, text: toText(joke.content.rendered) };
}

/**
 * a joke's html as plain text, one line per speaker. tags are dropped rather
 * than sanitized, so the text is safe to render without `set:html`
 */
function toText(html: string) {
	const lines = html
		.replace(/\s+/g, " ")
		.replace(/<br\s*\/?>|<\/p>/g, "\n")
		.replace(/<[^>]*>/g, "");

	return he
		.decode(lines)
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.join("\n");
}
