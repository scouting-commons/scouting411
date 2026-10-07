import { arrayHasDupes } from "@/util/arrayDupeCheck";
import { tryCatch } from "@/util/tryCatch";
import z from "zod";
import normalize from "normalize-url";
import { resources } from "@/lib/resources/config";

// get all the resource urls
const urls = resources.map((link) => link.url);

// check that all urls are valid and normalized
for (const url of urls) {
	validateUrl(url);
}
console.log("All URLs are valid and normalized.");

// check that all urls are different
if (arrayHasDupes(urls)) {
	throw new Error("Duplicate URLs found.");
}
console.log("All URLs are unique.");

// check that all the urls are online
const failures = (
	await Promise.all(resources.map((config) => checkUrlStatus(config.url)))
).filter((failure) => failure !== undefined);
if (failures.length > 0) {
	throw new Error(
		`${failures.length} URL(s) failed the status check:\n${failures.join("\n")}`,
	);
}
console.log("All URLs are online.");

/** fetch a url and return a failure message if it fails, redirects, or returns a non-200 response code */
async function checkUrlStatus(url: string) {
	const { data, error } = await tryCatch(fetch(url));

	if (error) {
		return `Failed to fetch url "${url}". Error: ${error.message}`;
	}

	// cloudflare blocks node's fetch on some sites no matter the headers, but a block means the site is up
	const isCloudflareBlock =
		data.status === 403 && data.headers.get("server") === "cloudflare";

	if (data.status !== 200 && !isCloudflareBlock) {
		return `Failed to fetch url "${url}". Status code: ${data.status}`;
	}

	if (data.redirected) {
		return `URL "${url}" redirects to "${data.url}".`;
	}

	return undefined;
}

/**
 * given a string, check that it's a valid, normalized url. throw if not.
 * @throws
 */
function validateUrl(url: string) {
	if (z.url(url).safeParse(url).error) {
		throw new Error(`URL failed Zod validation: "${url}".`);
	}

	const normalized = normalizeUrl(url);
	//check if the link passes normalization rules
	if (normalized !== url) {
		throw new Error(
			`URL failed normalization rules: "${url}". Normalized to "${normalized}".`,
		);
	}
}

/** return the normalized version of the url passed */
function normalizeUrl(url: string) {
	return normalize(url, {
		defaultProtocol: "https",
		forceHttps: true,
		stripHash: true,
		removeQueryParameters: true,
		removeDirectoryIndex: true,
		removeExplicitPort: true,
		stripWWW: false,
		removeTrailingSlash: false,
		removeSingleSlash: false,
	});
}
