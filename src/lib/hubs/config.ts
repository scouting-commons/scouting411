import type { HubConfig } from "@/lib/hubs/types";

export const hubsConfig: HubConfig[] = [
	{
		slug: "national",
		name: "National",
		description:
			"Official announcements, leadership communications, and governance from Scouting America's national organization.",
		color: "#003F87",
		tag: "national",
	},
	{
		slug: "scouts-bsa",
		name: "Scouts BSA",
		description: "Scouting's troop program for ages 11 through 17.",
		color: "#AD9D7B",
		tag: "scouts-bsa",
	},
	{
		slug: "cub-scouts",
		name: "Cub Scouts",
		description: "Scouting's program for kindergarten through fifth grade.",
		color: "#FCD116",
		tag: "cub-scouts",
	},
	{
		slug: "order-of-the-arrow",
		name: "Order of the Arrow",
		description: "Scouting's national honor society.",
		color: "#E31837",
		tag: "order-of-the-arrow",
	},
	{
		slug: "sea-scouts",
		name: "Sea Scouts",
		description: "Scouting's high-adventure program on the water.",
		color: "#003366",
		tag: "sea-scouts",
	},
	{
		slug: "alumni",
		name: "Alumni & NESA",
		description:
			"Scouting's alumni network and the National Eagle Scout Association.",
		color: "#5C2D91",
		tag: "alumni",
	},
];
