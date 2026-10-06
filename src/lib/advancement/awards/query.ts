import { readAwardDetail, readAwards } from "@/lib/advancement/awards/cache";

/** every award, ordered by program and then name */
export async function listAwards() {
	return readAwards();
}

/** an award and its requirements, or undefined if there is none */
export async function getAward(slug: string) {
	return readAwardDetail(slug);
}
