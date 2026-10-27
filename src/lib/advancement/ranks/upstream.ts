import { scoutingClient } from "@/infra/scoutingApi";
import { plainText, slugify } from "@/lib/advancement/upstream";
import {
	orderRequirements,
	parseRequirement,
	sanitizeRequirementHtml,
} from "@/lib/advancement/parseRequirements";
import type { Rank, RankDetail } from "@/lib/advancement/ranks/types";

/** a rank, and the upstream ids of the requirement versions it has in use */
type UpstreamRank = { rank: Rank; versionIds: string[] };

/**
 * fetch the list of all ranks, in program and level order. upstream lists a
 * rank once per version in use, so its entries are merged by id
 */
export async function fetchRanks(): Promise<UpstreamRank[]> {
	const { data, error } = await scoutingClient.api.advancement.listRanks();

	if (error) throw new Error(`failed to fetch ranks - ${error.message}`);

	// sorted so each rank's newest version comes first
	const entries = data.ranks
		.filter((entry) => entry.active === "True")
		.toSorted(
			(a, b) =>
				Number(a.programId) - Number(b.programId) ||
				Number(a.level) - Number(b.level) ||
				Number(b.version) - Number(a.version),
		);

	return [...Map.groupBy(entries, (entry) => entry.id).values()].map(
		(versions) => {
			// groupBy never makes an empty group
			const newest = versions[0]!;
			const name = plainText(newest.name);

			return {
				rank: {
					id: newest.id,
					slug: slugify(name),
					name,
					program: plainText(newest.program),
					level: Number(newest.level),
					images: {
						small: newest.imageUrl50,
						medium: newest.imageUrl100,
						large: newest.imageUrl200,
					},
				},
				versionIds: versions.map((version) => version.versionId),
			};
		},
	);
}

/** fetch the requirements for every version of a rank that is in use */
export async function fetchRankDetail({
	rank,
	versionIds,
}: UpstreamRank): Promise<RankDetail> {
	const versions = await Promise.all(
		versionIds.map(async (versionId) => {
			const { data, error } =
				await scoutingClient.api.advancement.getRankRequirements({
					rankId: Number(rank.id),
					versionId: Number(versionId),
				});

			if (error) {
				throw new Error(
					`failed to fetch requirements for rank ${rank.id} version ${versionId} - ${error.message}`,
				);
			}

			const { rankInformation, requirements } = data;

			return {
				version: rankInformation.version,
				headerHtml:
					sanitizeRequirementHtml(rankInformation.header) || undefined,
				footerHtml:
					sanitizeRequirementHtml(rankInformation.footer) || undefined,
				requirements: orderRequirements(requirements.map(parseRequirement)),
			};
		}),
	);

	return { ...rank, versions };
}
