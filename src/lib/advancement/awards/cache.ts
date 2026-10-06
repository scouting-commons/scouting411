import { redis } from "@/lib/redis/client";
import type { Award, AwardDetail } from "@/lib/advancement/awards/types";

/**
 * the list and each award's requirements are stored separately, so the
 * list page doesn't pull every award's requirements
 */
const listKey = "advancement:awards";
const detailKey = (slug: string) => `advancement:awards:${slug}`;

/** read the cached list of awards */
export async function readAwards() {
	const data: Award[] | null = await redis.json.get(listKey);

	return data ?? [];
}

/** write the list of awards to the cache */
export async function writeAwards(awards: Award[]) {
	await redis.json.set(listKey, "$", awards);
}

/** read an award's cached requirements */
export async function readAwardDetail(slug: string) {
	const data: AwardDetail | null = await redis.json.get(detailKey(slug));

	return data ?? undefined;
}

/** write an award's requirements to the cache */
export async function writeAwardDetail(detail: AwardDetail) {
	await redis.json.set(detailKey(detail.slug), "$", detail);
}
