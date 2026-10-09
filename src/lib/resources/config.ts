import type { Resource } from "@/lib/resources/types";

// eventually this could be fully searchable and filterable in the same way the feeds are

export const resources: Resource[] = [
	// marketing/landing pages
	{
		url: "https://www.scouting.org/",
		title: "Scouting America Homepage",
		type: "website",
		description: "The homepage of Scouting America",
		tags: ["national"],
	},
	{
		url: "https://oa-scouting.org",
		title: "Order of the Arrow Homepage",
		type: "website",
		description: "The homepage of Order of the Arrow",
		tags: ["order-of-the-arrow"],
	},
	{
		url: "https://www.exploring.org/",
		title: "Exploring Homepage",
		type: "website",
		description: "The homepage of the Exploring program",
		tags: ["exploring"],
	},
	{
		url: "https://nam.scouting.org/",
		title: "National Annual Meeting Homepage",
		type: "website",
		description: "The homepage for the National Annual Meeting",
		tags: ["national"],
	},
	{
		url: "https://seascout.org/",
		title: "Sea Scouts Homepage",
		type: "website",
		description: "The homepage of the Sea Scouts program",
		tags: ["sea-scouts"],
	},
	{
		url: "https://scoutingamericafoundation.org/",
		title: "Scouting America Foundation Homepage",
		type: "website",
		description: "The homepage of the Scouting America Foundation",
		tags: ["national"],
	},
	{
		url: "https://scoutingamericalegacy.org/",
		title: "Scouting America Legacy Homepage",
		type: "website",
		description: "Information about charitable gift planning",
		tags: ["national"],
	},
	{
		url: "https://nesa.org/",
		title: "National Eagle Scout Association Homepage",
		type: "website",
		description: "The homepage of the National Eagle Scout Association",
		tags: ["alumni"],
	},
	{
		url: "https://scoutingalumni.org/",
		title: "Scouting Alumni Homepage",
		type: "website",
		description: "The homepage for Scouting Alumni",
		tags: ["alumni"],
	},
	{
		url: "https://www.philmontscoutranch.org/",
		title: "Philmont Scout Ranch Homepage",
		type: "website",
		description: "The homepage of Philmont Scout Ranch",
		tags: ["high-adventure"],
	},
	{
		url: "https://seabaseha.org/",
		title: "Sea Base Homepage",
		type: "website",
		description: "The homepage of Sea Base",
		tags: ["high-adventure", "sea-scouts"],
	},
	{
		url: "https://www.summitbsa.org/",
		title: "Summit Bechtel Reserve Homepage",
		type: "website",
		description: "The homepage of Summit Bechtel Reserve",
		tags: ["high-adventure"],
	},
	{
		url: "https://www.ntier.org/",
		title: "Northern Tier Homepage",
		type: "website",
		description: "The homepage of Northern Tier",
		tags: ["high-adventure"],
	},
	{
		url: "https://jamboree.scouting.org/",
		title: "National Jamboree Homepage",
		type: "website",
		description: "The homepage of the National Jamboree",
		tags: [],
	},
	{
		url: "https://www.scouting.org/international/",
		title: "International Scouting Homepage",
		type: "website",
		description: "Scouting America's international programs and opportunities",
		tags: ["international"],
	},
	{
		url: "https://scouting-oec.org/",
		title: "Outdoor Ethics Homepage",
		type: "website",
		description: "The homepage of Scouting America's outdoor ethics program",
		tags: ["outdoor-program"],
	},
	{
		url: "https://licensingbsa.org/",
		title: "Licensing Programs Homepage",
		type: "website",
		description: "Scouting America's official licensing programs",
		tags: ["national"],
	},
	{
		url: "https://donations.scouting.org/",
		title: "Give to Scouting America Homepage",
		type: "website",
		description: "Make a donation to Scouting America",
		tags: ["national"],
	},

	// ecommerce
	{
		url: "https://www.scoutshop.org/",
		title: "Scout Shop",
		type: "store",
		description: "The official website of the Scout Shop / Supply Group",
		tags: ["national"],
	},
	{
		url: "https://store.philmontscoutranch.org/",
		title: "Tooth of Time Traders",
		type: "store",
		description: "Philmont Scout Ranch's online store",
		tags: ["high-adventure"],
	},
	// {
	// 	url: "https://store.ntier.org/",
	// 	title: "Northern Tier Trading Post",
	// 	description: "Northern Tier's online store",
	// },
	{
		url: "https://store.summitbsa.org/",
		title: "Garden Ground Outfitters",
		type: "store",
		description: "Summit Bechtel Reserve's online store",
		tags: ["high-adventure"],
	},
	{
		url: "https://tradingpost.oa-scouting.org/",
		title: "OA Trading Post",
		type: "store",
		description: "Order of the Arrow's online store",
		tags: ["order-of-the-arrow"],
	},
	{
		url: "https://store.bsaseabase.org/",
		title: "Sea Base Ship Store",
		type: "store",
		description: "Sea Base's online store",
		tags: ["high-adventure"],
	},

	// feeds
	{
		url: "https://scoutingwire.org",
		title: "Scouting Wire",
		type: "news",
		description: "The Official Blog of the Scouting Movement",
		tags: ["national"],
	},
	{
		url: "https://www.scouting.org/commissioners/newsletter-eblast/",
		title: "Commissioner Newsletter",
		type: "news",
		description:
			"A twice-monthly publication by the National Commissioner Service Team. This communication is to all registered commissioners and is intended to be their single, best resource. Content includes tips on serving units, upcoming activities for commissioners, and changes to program elements.",
		tags: ["commissioners"],
	},

	// periodicals and newsletters
	{
		url: "https://www.philmontscoutranch.org/resources/philnews/",
		title: "PhilNews",
		type: "news",
		description:
			"PhilNews is a biweekly publication of Philmont Scout Ranch produced during the summer season by the Marketing & Photography Services (MPS) Department. This magazine style publication highlights events taking place around Philmont Scout Ranch.",
		tags: ["high-adventure"],
	},
	{
		url: "https://seascout.org/program-updates/",
		title: "Sea Scouts Program Updates",
		type: "news",
		description:
			"This page includes the latest information concerning resources and developments affecting the Sea Scouts program.",
		tags: ["sea-scouts"],
	},

	{
		url: "https://www.scouting.org/training/training-updates/",
		title: "Training Updates",
		type: "news",
		description: "The latest changes to Scouting America training",
		tags: ["training"],
	},

	// reference and guidance
	{
		url: "https://scene.zeplin.io/project/59b6b6554fc4d8840a822300",
		title: "BSA Digital Design System",
		type: "reference",
		description: "Style guide for Scouting America branded websites",
		tags: ["national", "membership"],
	},
	{
		url: "https://help.scoutbook.scouting.org/",
		title: "Scoutbook Help",
		type: "reference",
		description: "Documentation and support articles for Scoutbook",
		tags: ["advancement", "national"],
	},
	{
		url: "https://ablescouts.org/toolbox/",
		title: "The Inclusion Toolbox",
		type: "reference",
		description: "Reference manual on supporting Scouts with disabilities",
		tags: ["advancement", "abilities"],
	},
	{
		url: "https://troopleader.scouting.org/",
		title: "Troop Leader Resources",
		type: "reference",
		description:
			"Online reference guide for youth and adult leaders of Scouts BSA troops",
		tags: ["scouts-bsa"],
	},
	{
		url: "https://techhub.scouting.org/",
		title: "Tech Hub",
		type: "reference",
		description:
			"Homepage and reference info for the  Scouting America National IT Team and Technology Advisory Committee",
		tags: ["national"],
	},
	{
		url: "https://www.scouting.org/resources/guide-to-advancement/",
		title: "Guide to Advancement",
		type: "reference",
		description:
			"The current edition of the Guide to Advancement is the official source for administering advancement in all Scouting America programs: Cub Scouting, Scouts BSA, Venturing, and Sea Scouts.",
		tags: ["advancement"],
	},
	{
		url: "https://www.scouting.org/resources/insignia-guide/",
		title: "Guide to Awards and Insignia",
		type: "reference",
		description: "The official guide to uniforming and insignia",
		tags: ["national"],
	},
	{
		url: "https://www.scouting.org/wp-content/uploads/2025/11/2025-Rules_Regulations_NEB-Approved-10.28.2025.pdf",
		title: "Rules and Regulation of the Boy Scouts of America",
		type: "reference",
		description: "The official bylaws of the Boy Scouts of America",
		tags: ["national"],
	},
	{
		url: "https://filestore.scouting.org/filestore/Outdoor%20Program/Aquatics/pdf/Aquatics_34346.pdf",
		title: "Aquatics Supervision",
		type: "reference",
		description: "A Leader's Guide to Youth Swimming and Boating Activities",
		tags: ["outdoor-program"],
	},

	{
		url: "https://scoutingwire.org/marketing-and-membership-hub/",
		title: "Marketing and Membership Hub",
		type: "reference",
		description: "Marketing and recruiting resources for growing membership",
		tags: ["membership"],
	},
	{
		url: "https://www.scouting.org/awards/awards-central/",
		title: "Awards Central",
		type: "reference",
		description: "Every national award available to youth and adults",
		tags: ["advancement"],
	},
	{
		url: "https://www.scouting.org/awards/scholarships/",
		title: "Scholarships",
		type: "reference",
		description: "Scholarships available to Scouts",
		tags: ["national"],
	},
	{
		url: "https://confluence.oa-scouting.org/",
		title: "OA Documentation Directory",
		type: "reference",
		description: "Documentation for Order of the Arrow programs and systems",
		tags: ["order-of-the-arrow"],
	},

	// forms
	{
		url: "https://filestore.scouting.org/filestore/pdf/34405.pdf",
		title: "Merit Badge Counselor Information",
		type: "form",
		description: "The form to add or remove Merit Badges for counselors",
		tags: ["scouts-bsa", "advancement"],
	},
	{
		url: "https://filestore.scouting.org/filestore/pdf/34427.pdf",
		title: "Unit Money Earning Application",
		type: "form",
		description: "The form to apply for holding a unit-level fundraiser",
		tags: ["national"],
	},

	// tools
	{
		url: "https://beascout.scouting.org/",
		title: "Be a Scout",
		type: "tool",
		description: "The tool for browsing Scouting units by location",
		tags: ["membership"],
	},
	{
		url: "https://joinexploring.org/",
		title: "Join Exploring",
		type: "tool",
		description: "The tool for finding Exploring units by location",
		tags: ["exploring", "membership"],
	},
	{
		url: "https://advancements.scouting.org/",
		title: "Scoutbook Plus",
		type: "tool",
		description:
			"Updated version of Scoutbook, the tool for tracking scout advancement",
		tags: ["advancement"],
	},
	{
		url: "https://my.scouting.org/",
		title: "my.Scouting",
		type: "tool",
		description: "The tool for managing Scouting units and registration",
		tags: ["national"],
	},
	{
		url: "https://scouting.webdamdb.com/",
		title: "Brand Center",
		type: "tool",
		description: "The official source for branding and promotional assets",
		tags: ["national", "membership"],
	},
	{
		url: "https://training.scouting.org/",
		title: "Learn Center",
		type: "tool",
		description: "Take your official online training courses",
		tags: ["training"],
	},
	{
		url: "https://www.scouting.org/outdoor-programs/tap/",
		title: "The Adventure Plan",
		type: "reference",
		description:
			"A step-by-step guide for planning safe and successful outdoor and high adventure trips, for units in every Scouting program",
		tags: ["high-adventure", "outdoor-program"],
	},
	{
		url: "https://discussions.scouting.org/",
		title: "Scouting Forums",
		type: "tool",
		description: "The official discussion forums of Scouting America",
		tags: ["national"],
	},
	{
		url: "https://lodgemaster.oa-scouting.org/",
		title: "LodgeMaster",
		type: "tool",
		description: "The tool for managing Order of the Arrow lodges",
		tags: ["order-of-the-arrow"],
	},
	{
		url: "https://directory.scouting.org/",
		title: "Scouting Alumni Directory",
		type: "tool",
		description:
			"The directory for finding and connecting with Scouting alumni",
		tags: ["alumni"],
	},
	{
		url: "https://status.scouting.org/",
		title: "System Status",
		type: "tool",
		description: "Uptime monitoring for Scouting America systems",
		tags: ["national"],
	},
	{
		url: "https://status.oa-scouting.org/",
		title: "Order of the Arrow System Status",
		type: "tool",
		description: "Uptime monitoring for Order of the Arrow systems",
		tags: ["order-of-the-arrow"],
	},
];
