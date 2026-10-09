/** every blubrry media url in a post body, tracking prefixes and all */
const audioUrlPattern = /https:\/\/media\.blubrry\.com\/[^\s"'<>]+?\.mp3/g;

/**
 * blubrry chains one or more tracking prefixes onto each file, and the chained
 * slugs don't reliably match the show (cubcast urls sometimes carry a scoutcast
 * prefix). the real object always begins at the last content.blubrry.com — or,
 * for a single 2013 episode, filestore.scouting.org.
 */
const audioUrlTailPattern =
	/(?:content\.blubrry\.com|filestore\.scouting\.org)\/.*\.mp3$/;

/**
 * pulls the canonical mp3 url out of an archived post body. the dumped posts
 * have no enclosure field — the only reference to the audio is the powerpress
 * markup embedded in the rendered content.
 */
export function extractAudioUrl(html: string): string | undefined {
	const canonical = new Set<string>();

	for (const [url] of html.matchAll(audioUrlPattern)) {
		const tail = audioUrlTailPattern.exec(url);
		if (tail) canonical.add(`https://${tail[0]}`);
	}

	// every archived post resolves to exactly one file. more than one means the
	// markup changed shape, and we'd rather drop the post than link the wrong audio
	if (canonical.size !== 1) return undefined;

	return canonical.values().next().value;
}

/**
 * powerpress appends its own "Play in new window | Download | Subscribe" link
 * blocks to every post body. that's chrome from the dead site, and its link
 * targets are all gone, so it shouldn't survive into a description.
 */
const powerPressLinksPattern =
	/<p\b[^>]*\bclass="powerpress_links[^"]*"[^>]*>[\s\S]*?<\/p>/g;

/** strips the powerpress link blocks from an archived post body */
export function stripPodcastChrome(html: string): string {
	return html.replace(powerPressLinksPattern, "");
}
