import { scoutingClient } from "@/infra/scoutingApi";
import { plainText, slugify } from "@/lib/advancement/upstream";
import {
	orderRequirements,
	parseRequirement,
} from "@/lib/advancement/parseRequirements";
import type { Award, AwardDetail } from "@/lib/advancement/awards/types";

/**
 * fetch the list of awards, ordered by program and then name. left out are
 * awards upstream flags `SBLHide` in `adminNotes` - one-off historical items
 * like "#1 Most Connected Council 2012" - and retired awards, which upstream
 * leaves `expiredDate` blank on but whose every version has expired
 */
export async function fetchAwards(): Promise<Award[]> {
	const { data, error } = await scoutingClient.api.advancement.listAwards();

	if (error) throw new Error(`failed to fetch awards - ${error.message}`);

	const today = new Date().toISOString().slice(0, 10);

	return data.awards
		.filter((award) => !award.adminNotes.includes("SBLHide"))
		.filter((award) =>
			award.versions.some(
				(version) =>
					!version.versionExpiryDt || version.versionExpiryDt > today,
			),
		)
		.map((award) => ({
			id: award.id,
			slug: slugify(plainText(award.name)),
			name: plainText(award.name),
			program: plainText(award.program),
			adult: award.adultAward === "True",
			images:
				award.imageUrl100 && award.imageUrl200 && award.imageUrl400
					? {
							small: award.imageUrl100,
							medium: award.imageUrl200,
							large: award.imageUrl400,
						}
					: undefined,
		}))
		.toSorted(
			(a, b) =>
				a.program.localeCompare(b.program) || a.name.localeCompare(b.name),
		);
}

/** fetch the newest requirements for an award */
export async function fetchAwardDetail(award: Award): Promise<AwardDetail> {
	const { data, error } =
		await scoutingClient.api.advancement.getAwardRequirements({
			awardId: Number(award.id),
		});

	if (error) {
		throw new Error(
			`failed to fetch requirements for award ${award.id} - ${error.message}`,
		);
	}

	return {
		...award,
		version: data.version || undefined,
		versionEffective: data.versionEffectiveDt || undefined,
		requirements: orderRequirements(data.requirements.map(parseRequirement)),
	};
}
