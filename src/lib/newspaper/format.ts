import { toDate, type IsoDate } from "@/lib/newspaper/dates";
import type { Issue } from "@/lib/newspaper/types";

const formatDay = (date: IsoDate) =>
	formatDate(date, { month: "long", day: "numeric" });

const count = (n: number, singular: string, plural: string) =>
	`${n} ${n === 1 ? singular : plural}`;

export function formatDate(date: IsoDate, options: Intl.DateTimeFormatOptions) {
	return toDate(date).toLocaleDateString("en-US", {
		...options,
		timeZone: "UTC",
	});
}

/** "September 27 - October 3" */
export function formatWeek({ week }: Issue) {
	return `${formatDay(week.from)} - ${formatDay(week.to)}`;
}

/** "3 stories" */
export function formatStoryCount(n: number) {
	return count(n, "story", "stories");
}

/** "13 stories from 5 sources" */
export function formatCounts({ storyCount, sourceCount }: Issue) {
	return `${count(storyCount, "story", "stories")} from ${count(sourceCount, "source", "sources")}`;
}
