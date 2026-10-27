import { scoutingClient } from "@/infra/scoutingApi";
import { plainText, slugify } from "@/lib/advancement/upstream";
import {
	orderRequirements,
	parseRequirement,
} from "@/lib/advancement/parseRequirements";
import type {
	Adventure,
	AdventureDetail,
} from "@/lib/advancement/adventures/types";

/**
 * upstream still lists adventures from retired programs (2015 through 2021)
 * alongside the current one, and has no expiry date on them to filter by.
 * keeping only the current program's version leaves one entry per adventure
 */
const programVersion = 2024;

/** cub scout ranks in program order. adventures don't carry a rank's level */
const rankOrder = [
	"Lion",
	"Tiger",
	"Wolf",
	"Bear",
	"Webelos",
	"Arrow of Light",
];

/**
 * fetch the list of current adventures, in rank order, with each rank's
 * required adventures before its electives
 */
export async function fetchAdventures(): Promise<Adventure[]> {
	const { data, error } = await scoutingClient.api.advancement.listAdventures();

	if (error) throw new Error(`failed to fetch adventures - ${error.message}`);

	return data.adventures
		.filter((adventure) => adventure.version === programVersion)
		.toSorted(
			(a, b) =>
				rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank) ||
				Number(b.required) - Number(a.required) ||
				a.name.localeCompare(b.name),
		)
		.map((adventure) => {
			const name = plainText(adventure.name);
			const rank = plainText(adventure.rank);

			return {
				id: String(adventure.id),
				slug: slugify(name),
				name,
				rank: { slug: slugify(rank), name: rank },
				required: adventure.required,
				images: {
					small: adventure.imageUrl100,
					medium: adventure.imageUrl200,
					large: adventure.imageUrl300,
				},
			};
		});
}

/** fetch the current requirements for an adventure */
export async function fetchAdventureDetail(
	adventure: Adventure,
): Promise<AdventureDetail> {
	const { data, error } =
		await scoutingClient.api.advancement.getAdventureRequirements({
			adventureId: Number(adventure.id),
		});

	if (error) {
		throw new Error(
			`failed to fetch requirements for adventure ${adventure.id} - ${error.message}`,
		);
	}

	return {
		...adventure,
		version: String(data.version),
		versionEffective: data.versionEffectiveDt,
		requirements: orderRequirements(data.requirements.map(parseRequirement)),
	};
}
