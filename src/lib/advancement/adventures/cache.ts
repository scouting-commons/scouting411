import { redis } from "@/infra/redis";
import type {
	Adventure,
	AdventureDetail,
} from "@/lib/advancement/adventures/types";

/**
 * the list and each adventure's requirements are stored separately, so the
 * list page doesn't pull every adventure's requirements
 */
const listKey = "advancement:adventures";
const detailKey = (slug: string) => `advancement:adventures:${slug}`;

/** read the cached list of adventures */
export async function readAdventures() {
	const data: Adventure[] | null = await redis.json.get(listKey);

	return data ?? [];
}

/** write the list of adventures to the cache */
export async function writeAdventures(adventures: Adventure[]) {
	await redis.json.set(listKey, "$", adventures);
}

/** read an adventure's cached requirements */
export async function readAdventureDetail(slug: string) {
	const data: AdventureDetail | null = await redis.json.get(detailKey(slug));

	return data ?? undefined;
}

/** write an adventure's requirements to the cache */
export async function writeAdventureDetail(detail: AdventureDetail) {
	await redis.json.set(detailKey(detail.slug), "$", detail);
}
