import { scoutingClient } from "@/infra/scoutingApi";
import { plainText, slugify } from "@/lib/advancement/upstream";
import {
	orderRequirements,
	parseRequirement,
} from "@/lib/advancement/parseRequirements";
import { fetchMeritBadgePages } from "@/lib/advancement/meritBadges/scoutingOrg";
import type {
	MeritBadge,
	MeritBadgeDetail,
} from "@/lib/advancement/meritBadges/types";

/** fetch the list of all merit badges */
export async function fetchMeritBadges(): Promise<MeritBadge[]> {
	const { data, error } =
		await scoutingClient.api.advancement.listMeritBadges();

	if (error) throw new Error(`failed to fetch merit badges - ${error.message}`);

	const named = data.meritBadges.map((badge) => {
		const name = plainText(badge.name);

		return { badge, name, slug: slugify(name) };
	});

	const pages = await fetchMeritBadgePages(named.map(({ slug }) => slug));

	return named.map(({ badge, name, slug }) => {
		const page = pages.get(slug)!;

		return {
			id: badge.id,
			slug,
			name,
			categories: mergeCategories([plainText(badge.category), ...page.groups]),
			eagleRequired: badge.eagleRequired === "True",
			url: page.url,
			images: {
				small: badge.imageUrl50,
				medium: badge.imageUrl100,
				large: badge.imageUrl200,
			},
		};
	});
}

/**
 * the api's category and scouting.org's topic groups overlap ("Sports" is
 * both), so names that slugify alike are kept once, first one wins
 */
function mergeCategories(names: string[]) {
	const bySlug = new Map<string, string>();

	for (const name of names) {
		const slug = slugify(name);

		if (!bySlug.has(slug)) bySlug.set(slug, name);
	}

	return [...bySlug].map(([slug, name]) => ({ slug, name }));
}

/** fetch the current requirements for a merit badge */
export async function fetchMeritBadgeDetail(
	badge: MeritBadge,
): Promise<MeritBadgeDetail> {
	const { data, error } =
		await scoutingClient.api.advancement.getMeritBadgeRequirements({
			meritBadgeId: Number(badge.id),
		});

	if (error) {
		throw new Error(
			`failed to fetch requirements for merit badge ${badge.id} - ${error.message}`,
		);
	}

	return {
		...badge,
		version: data.version,
		versionEffective: data.versionEffectiveDt || undefined,
		requirements: orderRequirements(
			data.requirements.map((requirement) => ({
				...parseRequirement(requirement),
				counselorApproval: requirement.counselorApproval === "True",
			})),
		),
	};
}
