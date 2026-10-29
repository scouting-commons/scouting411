import * as he from "he";

/** decode upstream's html entities in a plain-text field */
export function plainText(value: string) {
	return he.decode(value).trim();
}

/** "Signs, Signals, and Codes" -> "signs-signals-and-codes" */
export function slugify(name: string) {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}
