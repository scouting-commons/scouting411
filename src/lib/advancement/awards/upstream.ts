import { z } from "zod";
import {
	getAwardRequirements,
	listAwards,
} from "@scouting-commons/scouting-api/api.scouting.org";
import { plainText, slugify } from "@/lib/advancement/upstream";
import {
	orderRequirements,
	parseRequirement,
	upstreamRequirementSchema,
} from "@/lib/advancement/parseRequirements";
import type { Award, AwardDetail } from "@/lib/advancement/awards/types";

/** fetch the list of every award, ordered by program and then name */
export async function fetchAwards(): Promise<Award[]> {
	const { data, error } = await listAwards();

	if (error) throw new Error(`failed to fetch awards - ${error.message}`);

	return data.awards
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
	const { data, error } = await getAwardRequirements({
		path: { awardId: Number(award.id) },
	});

	if (error) {
		throw new Error(
			`failed to fetch requirements for award ${award.id} - ${error.message}`,
		);
	}

	// without `versionId`, upstream returns every value as a string
	const { version, versionEffectiveDt, requirements } =
		upstreamRequirementsSchema.parse(data);

	return {
		...award,
		version: version || undefined,
		versionEffective: versionEffectiveDt || undefined,
		requirements: orderRequirements(requirements.map(parseRequirement)),
	};
}

/** the fields used from https://api.scouting.org/advancements/awards/{id}/requirements */
const upstreamRequirementsSchema = z.object({
	version: z.string(),
	versionEffectiveDt: z.union([z.iso.date(), z.literal("")]),
	requirements: z.array(upstreamRequirementSchema),
});
