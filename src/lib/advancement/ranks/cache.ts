import { redis } from "@/infra/redis";
import type { Rank, RankDetail } from "@/lib/advancement/ranks/types";

/**
 * the list and each rank's requirements are stored separately, so the list
 * page doesn't pull every rank's requirements
 */
const listKey = "advancement:ranks";
const detailKey = (slug: string) => `advancement:ranks:${slug}`;

/** read the cached list of ranks */
export async function readRanks() {
	const data: Rank[] | null = await redis.json.get(listKey);

	return data ?? [];
}

/** write the list of ranks to the cache */
export async function writeRanks(ranks: Rank[]) {
	await redis.json.set(listKey, "$", ranks);
}

/** read a rank's cached requirements */
export async function readRankDetail(slug: string) {
	const data: RankDetail | null = await redis.json.get(detailKey(slug));

	return data ?? undefined;
}

/** write a rank's requirements to the cache */
export async function writeRankDetail(detail: RankDetail) {
	await redis.json.set(detailKey(detail.slug), "$", detail);
}
