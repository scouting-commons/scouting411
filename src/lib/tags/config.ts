import type { TagConfig } from "@/lib/tags/types";

/** the shared tag vocabulary for posts and resources */
export const tagConfigs = [
	// programs
	{
		name: "Cub Scouts",
		slug: "cub-scouts",
		description: "The Cub Scouts program",
		color: "#FCD116",
	},
	{
		name: "Scouts BSA",
		slug: "scouts-bsa",
		description: "The Scouts BSA program",
		color: "#AD9D7B",
	},
	{
		name: "Venturing",
		slug: "venturing",
		description: "The Venturing program",
	},
	{
		name: "Sea Scouts",
		slug: "sea-scouts",
		description: "The Sea Scouts program",
		color: "#003366",
	},
	{
		name: "Exploring",
		slug: "exploring",
		description: "The Exploring program",
	},
	{
		name: "Order of the Arrow",
		slug: "order-of-the-arrow",
		description: "Scouting America's national honor society",
		color: "#E31837",
	},
	// topics
	{
		name: "Advancement",
		slug: "advancement",
		description: "Ranks, merit badges, adventures, and awards",
	},
	{
		name: "Training",
		slug: "training",
		description: "Training for youth and adult leaders",
	},
	{
		name: "High Adventure",
		slug: "high-adventure",
		description:
			"The national high adventure bases: Philmont, Sea Base, Northern Tier, and the Summit",
	},
	{
		name: "International",
		slug: "international",
		description: "International Scouting and world events",
	},
	{
		name: "Alumni",
		slug: "alumni",
		description: "Scouting alumni and the National Eagle Scout Association",
		color: "#5C2D91",
	},
	{
		name: "National",
		slug: "national",
		description: "The National Council and its governance",
		color: "#003F87",
	},
	{
		name: "Membership",
		slug: "membership",
		description: "Recruiting, marketing, joining, and registration",
	},
	{
		name: "Commissioners",
		slug: "commissioners",
		description: "Commissioner service and support for units",
	},
	{
		name: "Outdoor Program",
		slug: "outdoor-program",
		description: "Camping, aquatics, outdoor ethics, and trip planning",
	},
	{
		name: "Abilities",
		slug: "abilities",
		description: "Including and supporting Scouts with disabilities",
	},
	{
		name: "Duty to God",
		slug: "duty-to-god",
		description: "Religious emblems, chaplaincy, and faith in Scouting",
	},
] as const satisfies TagConfig[];
