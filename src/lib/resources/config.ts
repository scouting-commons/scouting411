import type { Resource } from "@/lib/resources/types";

// todo
// I think eventually it will make sense to store these in a database
// there should be dimensions for the type of resource, as well as topic tags

// eventually this could be fully searchable and filterable in the same way the feeds are

export const resources: Resource[] = [
	// marketing/landing pages
	{
		url: "https://scouting.org",
		title: "Scouting America Homepage",
		description: "The homepage of Scouting America",
	},
	{
		url: "https://oa-scouting.org",
		title: "Order of the Arrow Homepage",
		description: "The homepage of Order of the Arrow",
	},
	{
		url: "https://www.exploring.org/",
		title: "Exploring",
		description: "The homepage of the Exploring program",
	},
	{
		url: "https://nam.scouting.org/",
		title: "National Annual Meeting",
		description: "The homepage for the National Annual Meeting",
	},
	{
		url: "https://seascout.org/",
		title: "Sea Scouts",
		description: "The homepage of the Sea Scouts program",
	},
	{
		url: "https://scoutingamericafoundation.org/",
		title: "Scouting America Foundation",
		description: "The homepage of the Scouting America Foundation",
	},
	{
		url: "https://scoutingamericalegacy.org/",
		title: "Scouting America Legacy",
		description: "Information about charitable gift planning",
	},
	{
		url: "https://nesa.org/",
		title: "National Eagle Scout Association",
		description: "The homepage of the National Eagle Scout Association",
	},
	{
		url: "https://scoutingalumni.org/",
		title: "Scouting Alumni",
		description: "The homepage for Scouting Alumni",
	},
	{
		url: "https://www.philmontscoutranch.org/",
		title: "Philmont Scout Ranch",
		description: "The homepage of Philmont Scout Ranch",
	},
	{
		url: "https://seabaseha.org/",
		title: "Sea Base",
		description: "The homepage of Sea Base",
	},
	{
		url: "https://www.summitbsa.org/",
		title: "Summit Bechtel Reserve",
		description: "The homepage of Summit Bechtel Reserve",
	},

	{
		url: "https://www.ntier.org/",
		title: "Northern Tier",
		description: "The homepage of Northern Tier",
	},
	{
		url: "https://jamboree.scouting.org/",
		title: "National Jamboree",
		description: "The homepage of the National Jamboree",
	},
	{
		url: "https://www.scouting.org/international/",
		title: "International Scouting",
		description: "Scouting America's international programs and opportunities",
	},
	{
		url: "https://scouting-oec.org/",
		title: "Outdoor Ethics",
		description: "The homepage of Scouting America's outdoor ethics program",
	},
	{
		url: "https://licensingbsa.org/",
		title: "Licensing Programs",
		description: "Scouting America's official licensing programs",
	},
	{
		url: "https://donations.scouting.org/",
		title: "Give to Scouting America",
		description: "Make a donation to Scouting America",
	},

	// ecommerce
	{
		url: "https://www.scoutshop.org/",
		title: "Scout Shop",
		description: "The official website of the Scout Shop / Supply Group",
	},
	{
		url: "https://store.philmontscoutranch.org/",
		title: "Tooth of Time Traders",
		description: "Philmont Scout Ranch's online store",
	},
	{
		url: "https://store.ntier.org/",
		title: "Northern Tier Trading Post",
		description: "Northern Tier's online store",
	},
	{
		url: "https://store.summitbsa.org/",
		title: "Garden Ground Outfitters",
		description: "Summit Bechtel Reserve's online store",
	},
	{
		url: "https://tradingpost.oa-scouting.org/",
		title: "OA Trading Post",
		description: "Order of the Arrow's online store",
	},
	{
		url: "https://store.bsaseabase.org/",
		title: "Sea Base Ship Store",
		description: "Sea Base's online store",
	},

	// feeds
	{
		url: "https://scoutingwire.org",
		title: "Scouting Wire",
		description: "The Official Blog of the Scouting Movement",
	},
	{
		url: "https://www.scouting.org/commissioners/newsletter-eblast/",
		title: "Commissioner Newsletter",
		description:
			"A twice-monthly publication by the National Commissioner Service Team. This communication is to all registered commissioners and is intended to be their single, best resource. Content includes tips on serving units, upcoming activities for commissioners, and changes to program elements.",
	},

	// periodicals and newsletters
	{
		url: "https://www.philmontscoutranch.org/resources/philnews/",
		title: "PhilNews",
		description:
			"PhilNews is a biweekly publication of Philmont Scout Ranch produced during the summer season by the Marketing & Photography Services (MPS) Department. This magazine style publication highlights events taking place around Philmont Scout Ranch.",
	},
	{
		url: "https://seascout.org/program-updates/",
		title: "Sea Scouts Program Updates",
		description:
			"This page includes the latest information concerning resources and developments affecting the Sea Scouts program.",
	},

	{
		url: "https://www.scouting.org/commissioners/news-for-commissioners/",
		title: "News for Commissioners",
		description: "News and updates for commissioners",
	},
	{
		url: "https://www.scouting.org/training/training-updates/",
		title: "Training Updates",
		description: "The latest changes to Scouting America training",
	},

	// reference and guidance
	{
		url: "https://scene.zeplin.io/project/59b6b6554fc4d8840a822300",
		title: "BSA Digital Design System",
		description: "Style guide for Scouting America branded websites",
	},
	{
		url: "https://help.scoutbook.scouting.org/",
		title: "Scoutbook Help",
		description: "Documentation and support articles for Scoutbook",
	},
	{
		url: "https://ablescouts.org/toolbox/",
		title: "The Inclusion Toolbox",
		description: "Reference manual on supporting Scouts with disabilities",
	},
	{
		url: "https://troopleader.scouting.org/",
		title: "Troop Leader Resources",
		description:
			"Online reference guide for youth and adult leaders of Scouts BSA troops",
	},
	{
		url: "https://techhub.scouting.org/",
		title: "Tech Hub",
		description:
			"Homepage and reference info for the  Scouting America National IT Team and Technology Advisory Committee",
	},
	{
		url: "https://www.scouting.org/resources/guide-to-advancement/",
		title: "Guide to Advancement",
		description:
			"The current edition of the Guide to Advancement is the official source for administering advancement in all Scouting America programs: Cub Scouting, Scouts BSA, Venturing, and Sea Scouts.",
	},
	{
		url: "https://www.scouting.org/resources/insignia-guide/",
		title: "Guide to Awards and Insignia",
		description: "The official guide to uniforming and insignia",
	},
	{
		url: "https://www.scouting.org/wp-content/uploads/2025/11/2025-Rules_Regulations_NEB-Approved-10.28.2025.pdf",
		title: "Rules and Regulation of the Boy Scouts of America",
		description: "The official bylaws of the Boy Scouts of America",
	},
	{
		url: "https://filestore.scouting.org/filestore/Outdoor%20Program/Aquatics/pdf/Aquatics_34346.pdf",
		title: "Aquatics Supervision",
		description: "A Leader's Guide to Youth Swimming and Boating Activities",
	},

	{
		url: "https://scoutingwire.org/marketing-and-membership-hub/",
		title: "Marketing and Membership Hub",
		description: "Marketing and recruiting resources for growing membership",
	},
	{
		url: "https://www.scouting.org/awards/awards-central/",
		title: "Awards Central",
		description: "Every national award available to youth and adults",
	},
	{
		url: "https://www.scouting.org/awards/scholarships/",
		title: "Scholarships",
		description: "Scholarships available to Scouts",
	},
	{
		url: "https://confluence.oa-scouting.org/",
		title: "OA Documentation Directory",
		description: "Documentation for Order of the Arrow programs and systems",
	},

	// forms
	{
		url: "https://filestore.scouting.org/filestore/pdf/34405.pdf",
		title: "Merit Badge Counselor Information",
		description: "The form to add or remove Merit Badges for counselors",
	},
	{
		url: "https://filestore.scouting.org/filestore/pdf/34427.pdf",
		title: "Unit Money Earning Application",
		description: "The form to apply for holding a unit-level fundraiser",
	},

	// tools
	{
		url: "https://beascout.scouting.org/",
		title: "Be a Scout",
		description: "The tool for browsing Scouting units by location",
	},
	{
		url: "https://joinexploring.org/",
		title: "Join Exploring",
		description: "The tool for finding Exploring units by location",
	},
	{
		url: "https://scoutbook.scouting.org/",
		title: "Scoutbook (legacy)",
		description:
			"The legacy version of Scoutbook, the tool for tracking scout advancement",
	},
	{
		url: "https://advancements.scouting.org/",
		title: "Scoutbook Plus",
		description:
			"Updated version of Scoutbook, the tool for tracking scout advancement",
	},
	{
		url: "https://my.scouting.org/",
		title: "my.Scouting",
		description: "The tool for managing Scouting units and registration",
	},
	{
		url: "https://scouting.webdamdb.com/",
		title: "Brand Center",
		description: "The official source for branding and promotional assets",
	},
	{
		url: "https://training.scouting.org/",
		title: "Learn Center",
		description: "Take your official online training courses",
	},
	{
		url: "https://scouting.org/outdoor-programs/tap",
		title: "The Adventure Plan",
		description:
			"A step-by-step tool for planning safe and successful outdoor and high adventure trips, for units in every Scouting program",
	},
	{
		url: "https://discussions.scouting.org/",
		title: "Scouting Forums",
		description: "The official discussion forums of Scouting America",
	},
	{
		url: "https://lodgemaster.oa-scouting.org/",
		title: "LodgeMaster",
		description: "The tool for managing Order of the Arrow lodges",
	},
	{
		url: "https://status.scouting.org/",
		title: "System Status",
		description: "Uptime monitoring for Scouting America systems",
	},
	{
		url: "https://status.oa-scouting.org/",
		title: "Order of the Arrow System Status",
		description: "Uptime monitoring for Order of the Arrow systems",
	},
];
