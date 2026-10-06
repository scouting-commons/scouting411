import {
	fetchAwardDetail,
	fetchAwards,
} from "@/lib/advancement/awards/upstream";
import { writeAwardDetail, writeAwards } from "@/lib/advancement/awards/cache";
import { arrayHasDupes } from "@/util/arrayDupeCheck";
import { sleep } from "@/util/sleep";
import { tryCatch } from "@/util/tryCatch";

/** the number of milliseconds to wait between requirements requests */
const requestInterval = 100;

/**
 * fetches every award and its requirements and updates the cache. failures
 * are isolated per award - an award whose requirements fail to fetch keeps
 * its previously cached requirements
 */
export async function ingestAwards() {
	const { data: awards, error } = await tryCatch(fetchAwards());

	if (error) {
		return { errors: [{ reason: String(error) }], succeeded: 0, total: 0 };
	}

	if (awards.length === 0) {
		return {
			errors: [{ reason: "upstream returned no awards" }],
			succeeded: 0,
			total: 0,
		};
	}

	if (arrayHasDupes(awards.map((award) => award.slug))) {
		return {
			errors: [{ reason: "two awards share a slug" }],
			succeeded: 0,
			total: awards.length,
		};
	}

	const errors: { award?: string; reason: string }[] = [];

	await Promise.all(
		awards.map(async (award, i) => {
			await sleep(requestInterval * i);

			const { data: detail, error } = await tryCatch(fetchAwardDetail(award));

			if (error) {
				errors.push({ award: award.slug, reason: String(error) });
				return;
			}

			await writeAwardDetail(detail);
		}),
	);

	await writeAwards(awards);

	return {
		errors,
		succeeded: awards.length - errors.length,
		total: awards.length,
	};
}
