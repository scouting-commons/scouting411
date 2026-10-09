// utc calendar days, to match the news query filter

/** a calendar day as yyyy-mm-dd. compares in date order as a string. */
export type IsoDate = `${number}-${number}-${number}`;

const dayMs = 24 * 60 * 60 * 1000;

export function toIsoDate(date: Date) {
	return date.toISOString().slice(0, 10) as IsoDate;
}

/** midnight utc of `date` */
export function toDate(date: IsoDate) {
	return new Date(`${date}T00:00:00Z`);
}

/** `value` if it's a real yyyy-mm-dd day */
export function parseIsoDate(value: string) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return undefined;
	}

	const date = new Date(`${value}T00:00:00Z`);
	return !Number.isNaN(date.getTime()) && toIsoDate(date) === value
		? (value as IsoDate)
		: undefined;
}

export function addDays(date: IsoDate, days: number) {
	return toIsoDate(new Date(toDate(date).getTime() + days * dayMs));
}

/** the sunday on or before `date` */
export function sundayOf(date: Date) {
	return addDays(toIsoDate(date), -date.getUTCDay());
}
