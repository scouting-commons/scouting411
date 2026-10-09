import { redis } from "@/server/redis";
import type {
	MeritBadge,
	MeritBadgeDetail,
} from "@/lib/advancement/meritBadges/types";

/**
 * the list and each badge's requirements are stored separately, so the list
 * page doesn't pull every badge's requirements
 */
const listKey = "advancement:meritBadges";
const detailKey = (slug: string) => `advancement:meritBadges:${slug}`;

/** read the cached list of merit badges */
export async function readMeritBadges() {
	const data: MeritBadge[] | null = await redis.json.get(listKey);

	return data ?? [];
}

/** write the list of merit badges to the cache */
export async function writeMeritBadges(meritBadges: MeritBadge[]) {
	await redis.json.set(listKey, "$", meritBadges);
}

/** read a merit badge's cached requirements */
export async function readMeritBadgeDetail(slug: string) {
	const data: MeritBadgeDetail | null = await redis.json.get(detailKey(slug));

	return data ?? undefined;
}

/** write a merit badge's requirements to the cache */
export async function writeMeritBadgeDetail(detail: MeritBadgeDetail) {
	await redis.json.set(detailKey(detail.slug), "$", detail);
}
