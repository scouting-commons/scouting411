import type { TagConfig } from "@/lib/tags/types";

/** the shared tag vocabulary for posts and resources */
export const tagConfigs = [
	// programs
	{
		name: "Cub Scouts",
		slug: "cub-scouts",
		description: "The Cub Scouts program",
	},
	{
		name: "Scouts BSA",
		slug: "scouts-bsa",
		description: "The Scouts BSA program",
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
	},
	{
		name: "National",
		slug: "national",
		description: "The National Council and its governance",
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
] as const satisfies TagConfig[];
