import {
	addDays,
	parseIsoDate,
	sundayOf,
	toDate,
	type IsoDate,
} from "@/lib/newspaper/dates";

// which issues exist: one each sunday, up to the latest

export function latestIssueDate() {
	return sundayOf(new Date());
}

const isPublished = (date: IsoDate) => date <= latestIssueDate();

// the latest issue lives at /newspaper, so its link never goes stale
const issueHref = (date: IsoDate) =>
	date === latestIssueDate() ? "/newspaper" : `/newspaper/${date}`;

/** `value` (yyyy-mm-dd) if an issue came out that day */
export function findIssueDate(value: string) {
	const date = parseIsoDate(value);
	return date && toDate(date).getUTCDay() === 0 && isPublished(date)
		? date
		: undefined;
}

/** the issue a story posted at `date` runs in, once it's come out */
export function issueDateFor(date: Date) {
	const issueDate = addDays(sundayOf(date), 7);
	return isPublished(issueDate) ? issueDate : undefined;
}

/** the sunday-to-saturday week before the issue on `date` */
export function weekOf(date: IsoDate) {
	return { from: addDays(date, -7), to: addDays(date, -1) };
}

/**
 * links for the issue on `date`. these change as new issues come out, so
 * they aren't part of the issue.
 */
export function issueLinks(date: IsoDate) {
	const next = addDays(date, 7);

	return {
		self: issueHref(date),
		previous: issueHref(addDays(date, -7)),
		next: isPublished(next) ? issueHref(next) : undefined,
	};
}
