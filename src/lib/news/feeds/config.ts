import type { FeedConfig } from "@/lib/news/feeds/types";

export const feedConfigs = [
	{
		name: "Scouting America News",
		slug: "scouting-america-news",
		defaultVisible: true,
		description:
			"General news from Scouting America, covering everything on scouting.org that is not part of another feed here.",
		coverImageSrc:
			"https://www.scouting.org/wp-content/uploads/2026/01/BSA-logo.png",
		homepageUrl: "https://www.scouting.org",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://www.scouting.org",
				// a catchall for everything that does not belong to another feed here
				categoryExcludeFilter: [
					10763, // international adventure - has its own feed
					15052, // sea scouts program updates - has its own feed
					15053, // cub scouts program updates - has its own feed
					15054, // scouts bsa program updates - has its own feed
					15546, // cub features - not articles, 301 to a landing page
					15552, // venturing features - not articles, 301 to a landing page
					15558, // scouts bsa features - not articles, 301 to a landing page
					15738, // outdoor locations - not articles, 301 to a landing page
				],
			},
		},
	},
	{
		name: "International Adventure",
		slug: "international-adventure",
		defaultVisible: true,
		description:
			"The Blog and Newsletter of the Scouting America International Committee & Department",
		coverImageSrc:
			"https://www.scouting.org/wp-content/uploads/2021/10/IC-Cover_Dark-scaled.jpg",
		homepageUrl:
			"https://www.scouting.org/international/international-adventure/",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://www.scouting.org",
				categoryFilter: 10763,
			},
		},
	},
	{
		name: "Scouts BSA Program Updates",
		slug: "scouts-bsa-program-updates",
		defaultVisible: true,
		description:
			"Information about changes and updates to the Scouts BSA program.",
		coverImageSrc:
			"https://goldengatescouting.org/wp-content/uploads/2025/01/Scouts-BSA-Logo.png",
		homepageUrl:
			"https://www.scouting.org/topics/program-updates/program-updates-scouts-bsa",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://www.scouting.org",
				categoryFilter: 15054,
			},
		},
	},
	{
		name: "Sea Scouts Program Updates",
		slug: "sea-scouts-program-updates",
		defaultVisible: true,
		description:
			"Information about changes and updates to the Sea Scouts program.",
		coverImageSrc:
			"https://www.scouting.org/wp-content/uploads/2023/05/SeaScouts_Logo.png",
		homepageUrl:
			"https://www.scouting.org/topics/program-updates/program-updates-sea-scouts",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://www.scouting.org",
				categoryFilter: 15052,
			},
		},
	},
	{
		name: "Cub Scouts Program Updates",
		slug: "cub-scouts-program-updates",
		defaultVisible: true,
		description:
			"Information about changes and updates to the Cub Scouts program.",
		coverImageSrc:
			"https://www.scouting.org/wp-content/uploads/2026/02/cubscouts.png",
		homepageUrl:
			"https://www.scouting.org/topics/program-updates/program-updates-cub-scouts",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://www.scouting.org",
				categoryFilter: 15053,
			},
		},
	},

	{
		name: "#CubChatLive",
		slug: "cubchat",
		kind: "podcast",
		defaultVisible: true,
		description: "The official video podcast of the Cub Scouts program.",
		coverImageSrc:
			"https://i0.wp.com/onscouting.org/wp-content/uploads/2022/01/cubchat-1280x720-1.png",
		homepageUrl: "https://onscouting.org/cubchatlive/",
		adapter: {
			type: "rss",
			opts: {
				feedUrl: "https://anchor.fm/s/10fd33ec4/podcast/rss",
			},
		},
	},
	// todo it says this is "on hiatus". could not locate an rss feed other than via youtube
	// {
	// 	name: "#TroopTalkLive",
	// 	slug: "trooptalk",
	// 	description: "The official video podcast of the Scouts BSA program.",
	// 	homepageUrl: "https://onscouting.org/trooptalklive/",
	// 	adapter: {
	// 		type: "rss",
	// 		opts: {
	// 			feedUrl: "",
	// 		},
	// 	},
	// },

	{
		name: "On Scouting",
		slug: "on-scouting",
		defaultVisible: true,
		description:
			"Editorial content for parents and volunteers. The adult counterpart of Scout Life magazine.",
		coverImageSrc:
			"https://onscouting.org/wp-content/uploads/2026/04/1200x901_OnScouting.jpg",
		homepageUrl: "https://onscouting.org",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://onscouting.org",
			},
		},
	},
	{
		name: "Trail to Adventure",
		slug: "trail-to-adventure",
		defaultVisible: true,
		description:
			"News and updates regarding scout camp administration. The Official Blog of the National Outdoor Programs and Properties Subcommittees.",
		coverImageSrc:
			"https://www.scouting.org/wp-content/uploads/elementor/thumbs/Frame-61@3x-1-qjjk7hopsugwy0tp9t0d62i0mwna5lp6q75bq9k9ge.png",
		homepageUrl: "https://www.scouting.org/outdoor-programs/trail-to-adventure",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://scouting.org",
				type: "tta-post",
			},
		},
	},
	{
		name: "Executive Communications",
		slug: "executive-communications",
		defaultVisible: true,
		description:
			"Hear from Scouting's Leadership: executives share thoughts on a variety of key Scouting topics.",
		coverImageSrc:
			"https://www.scouting.org/wp-content/uploads/2026/01/BSA-logo.png",
		homepageUrl: "https://www.scouting.org/about/executive-communications/",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://scouting.org",
				type: "ec-post",
			},
		},
	},
	{
		name: "Scouting Alumni",
		slug: "scouting-alumni",
		defaultVisible: true,
		description:
			"The news feed of Scouting Alumni. Primarily editorial content with occasional news.",
		coverImageSrc:
			"https://scoutingalumni.org/wp-content/uploads/2024/03/Scouting-America-Scouting-Alumni-Logo_4c-1024x236.png",
		homepageUrl: "https://scoutingalumni.org/news",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://scoutingalumni.org",
			},
		},
	},
	{
		name: "Scouting Alumni - Ask the Chair",
		slug: "scouting-alumni-chair",
		defaultVisible: true,
		description:
			"The doorway to Scouting is always open for our alumni! Scouting Alumni National Chair Andrew Miller is available to answer your questions. We look forward to hearing from you!",
		coverImageSrc:
			"https://scoutingalumni.org/wp-content/uploads/2024/03/Scouting-America-Scouting-Alumni-Logo_4c-1024x236.png",
		homepageUrl: "https://scoutingalumni.org/resources/ask-the-chair/",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://scoutingalumni.org",
				type: "ask_the_chair",
			},
		},
	},
	{
		name: "Scouting Alumni - Alumni Highlights",
		slug: "scouting-alumni-highlights",
		defaultVisible: true,
		description:
			"Miscellaneous news from Scouting Alumni, separate from their main news feed.",
		coverImageSrc:
			"https://scoutingalumni.org/wp-content/uploads/2024/03/Scouting-America-Scouting-Alumni-Logo_4c-1024x236.png",
		homepageUrl: "https://scoutingalumni.org/",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://scoutingalumni.org",
				type: "alumni-highlight",
			},
		},
	},
	{
		name: "Scout Life",
		slug: "scout-life",
		defaultVisible: false,
		description: "Editorial and entertainment content mainly for youth.",
		coverImageSrc:
			"https://scoutlife.org/wp-content/uploads/2026/06/SL-logo_white_340x72.png",
		homepageUrl: "https://scoutlife.org",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://scoutlife.org",
				categoryExcludeFilter: [
					399195616, // podask - has its own feed
				],
			},
		},
	},
	{
		name: "PodAsk",
		slug: "podask",
		kind: "podcast",
		defaultVisible: false,
		description:
			"A defunct kid-friendly podcast from Scout Life magazine, answering questions sent in by listeners.",
		coverImageSrc:
			"https://d1kn0x9vzr5n76.cloudfront.net/images/ranks/neweagle200.png",
		homepageUrl: "https://scoutlife.org/section/podask/",
		adapter: {
			type: "rss",
			opts: {
				// the category's wordpress feed, which jetpack serves as a podcast feed
				feedUrl: "https://scoutlife.org/section/podask/feed/",
			},
		},
	},
	{
		name: "Eagle Scout Project Showcase",
		slug: "eagle-project-showcase",
		defaultVisible: false,
		description:
			"Eagle Scout service projects sent in by Scout Life readers, each a short writeup with photos.",
		coverImageSrc:
			"https://eagleprojects.scoutlife.org/files/2017/05/cropped-eaglebadge.png",
		homepageUrl: "https://eagleprojects.scoutlife.org",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://eagleprojects.scoutlife.org",
			},
		},
	},

	// https://www.podchaser.com/podcasts/scoutcast-31182
	{
		name: "ScoutCast",
		slug: "scoutcast",
		kind: "podcast",
		defaultVisible: true,
		description: "A defunct podcast for Scouts BSA unit volunteers.",
		homepageUrl: "https://podcast.scouting.org/category/scoutcast",
		coverImageSrc:
			"https://cachedimages.podchaser.com/512x512/aHR0cHM6Ly9wb2RjYXN0LnNjb3V0aW5nLm9yZy9zY291dGNhc3QtbG9nby0xNTAweDE1MDAuanBn/aHR0cHM6Ly93d3cucG9kY2hhc2VyLmNvbS9pbWFnZXMvbWlzc2luZy1pbWFnZS5wbmc%3D",
		adapter: {
			type: "podcast-archive",
			opts: {
				categoryId: 2,
			},
		},
	},

	// https://www.podchaser.com/podcasts/cubcast-3834
	{
		name: "CubCast",
		slug: "cubcast",
		kind: "podcast",
		defaultVisible: true,
		description: "A defunct podcast for Cub Scouts unit volunteers.",
		homepageUrl: "https://podcast.scouting.org/category/cubcast",
		coverImageSrc:
			"https://cachedimages.podchaser.com/512x512/aHR0cHM6Ly9wb2RjYXN0LnNjb3V0aW5nLm9yZy9jdWJjYXN0LWxvZ28tMTUwMHgxNTAwLmpwZw%3D%3D/aHR0cHM6Ly93d3cucG9kY2hhc2VyLmNvbS9pbWFnZXMvbWlzc2luZy1pbWFnZS5wbmc%3D",
		adapter: {
			type: "podcast-archive",
			opts: {
				categoryId: 3,
			},
		},
	},

	// todo it looks like this is about to be shut down. I downloaded the rss and and all the episodes. set up an archived version later
	{
		name: "The Lookout",
		slug: "the-lookout",
		kind: "podcast",
		defaultVisible: true,
		description:
			"The Lookout: Sea Scout Podcast Network. Features both news and interviews.",
		coverImageSrc:
			"https://storage.buzzsprout.com/ht40z07k1bkolyeg988x8e6izud9?.jpg",
		homepageUrl: "https://seascout.org/the-lookout-sea-scout-podcast-network/",
		adapter: {
			type: "rss",
			opts: {
				feedUrl: "https://feeds.buzzsprout.com/983503.rss",
			},
		},
	},

	{
		name: "Hike On",
		slug: "hike-on",
		kind: "podcast",
		defaultVisible: true,
		description:
			"The (defunct) official Philmont Scout Ranch podcast, exploring the characters, culture, and history of Philmont.",
		coverImageSrc:
			"https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo/19109614/19109614-1636474771074-82b17660497c.jpg",
		homepageUrl: "https://creators.spotify.com/pod/profile/hike-on/",
		adapter: {
			type: "rss",
			opts: {
				feedUrl: "https://anchor.fm/s/727f8b78/podcast/rss",
			},
		},
	},

	{
		name: "Scouting Wire",
		slug: "scouting-wire",
		defaultVisible: true,
		description:
			"Billed as 'The Official Blog of the Scouting Movement'. General news and updates for professionals, volunteers, and parents.",
		coverImageSrc:
			"https://scoutingwire.org/wp-content/themes/scoutwire/img/scouting-wire-logo.png",
		homepageUrl: "https://scoutingwire.org",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://scoutingwire.org",
				//todo split by categories / tags?
			},
		},
	},
	{
		name: "Scouting Newsroom",
		slug: "scouting-newsroom",
		defaultVisible: true,
		description:
			"Provides updates and news press releases the national Scouting administration.",
		coverImageSrc:
			"https://www.scoutingnewsroom.org/wp-content/uploads/2026/07/cropped-bsa-original-270x270.webp",
		homepageUrl: "https://scoutingnewsroom.org",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://scoutingnewsroom.org",
				type: "press-releases",
			},
		},
	},
	{
		name: "Abilities Digest",
		slug: "abilities-digest",
		defaultVisible: true,
		description:
			"Provides updates and news about special needs scouting. A publication of the National Special Needs and Disabilities Committee.",
		homepageUrl: "https://ablescouts.org",
		coverImageSrc:
			"https://ablescouts.org/wp-content/uploads/2022/04/cropped-sn-logo-only.png",
		// ablescouts.org is wordpress.com-hosted, so /wp-json is 404 on its own
		// domain - the same wp/v2 routes are served through the public proxy
		// instead, which exposes the regular wordpress api
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://public-api.wordpress.com",
				apiPath: "/wp/v2/sites/ablescouts.org",
			},
		},
	},
	{
		name: "Summit Blog",
		slug: "summit-blog",
		defaultVisible: true,
		description: "News and updates about the Summit Bechtel Reserve.",
		coverImageSrc:
			"https://www.summitbsa.org/wp-content/uploads/2018/01/cropped-SBR-BlackBearPaw_Combo_-Logo-1-1-192x192.png",
		homepageUrl: "https://www.summitbsa.org/blog",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://summitbsa.org",
			},
		},
	},
	{
		name: "NESA News and Articles",
		slug: "nesa",
		defaultVisible: true,
		description:
			"The news feed of the National Eagle Scout Association. A mixture of editorial content and news.",
		coverImageSrc:
			"https://nesa.org/wp-content/uploads/2023/01/NESA-Logo-4k-300x300-1.png",
		homepageUrl: "https://nesa.org/news",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://nesa.org",
			},
		},
	},
	{
		name: "NESA Events",
		slug: "nesa-events",
		defaultVisible: true,
		description:
			"A feed of events run by the National Eagle Scout Association.",
		coverImageSrc:
			"https://nesa.org/wp-content/uploads/2023/01/NESA-Logo-4k-300x300-1.png",
		homepageUrl: "https://nesa.org/news",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://nesa.org",
				type: "events",
			},
		},
	},
	{
		name: "Scouting America Foundation",
		slug: "scouting-america-foundation",
		defaultVisible: true,
		description:
			"The news feed of the Scouting America Foundation. Mostly entertainment and editorial content.",
		coverImageSrc:
			"https://scoutingamericafoundation.org/wp-content/uploads/2026/06/Fleur-de-lis-2024-logo-4c-BC-906x1024.webp",
		homepageUrl: "https://scoutingamericafoundation.org/foundation-news",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://scoutingamericafoundation.org",
			},
		},
	},
	{
		name: "OA News",
		slug: "oa-news",
		defaultVisible: true,
		description:
			"News and updates about the Order of the Arrow on the national level.",
		coverImageSrc:
			"https://confluence.oa-scouting.org/download/attachments/655365/OALMLC",
		homepageUrl: "https://oa-scouting.org/news",
		adapter: { type: "oa-news" },
	},
	{
		name: "OA System Maintenance",
		slug: "oa-system-maintenance",
		defaultVisible: true,
		description:
			"Updates on Order of the Arrow's digital infrastructure maintenance and outages.",
		coverImageSrc:
			"https://confluence.oa-scouting.org/download/attachments/655365/OALMLC",
		homepageUrl: "https://status.oa-scouting.org/",
		adapter: {
			type: "atlassian-statuspage-api",
			opts: {
				baseUrl: "https://status.oa-scouting.org",
			},
		},
	},
	{
		name: "OA LodgeMaster Blog",
		slug: "oa-lodgemaster",
		defaultVisible: true,
		description:
			"The OA LodgeMaster Support Center blog. Contains changelog and news about the LodgeMaster program.",
		coverImageSrc:
			"https://confluence.oa-scouting.org/download/attachments/655365/OALMLC",
		homepageUrl:
			"https://confluence.oa-scouting.org/pages/viewrecentblogposts.action?key=OALMLC",
		adapter: {
			type: "rss",
			opts: {
				feedUrl:
					"https://confluence.oa-scouting.org/spaces/createrssfeed.action?types=blogpost&spaces=OALMLC&sort=created&maxResults=1000&timeSpan=3650&showContent=true&publicFeed=true&rssType=rss2&title=OA+LodgeMaster+Support+Center+Blog",
				// atom feed also available
			},
		},
	},
	{
		name: "Sea Scouts News",
		slug: "sea-scouts-news",
		defaultVisible: true,
		description: "News and updates about the Sea Scouts program.",
		coverImageSrc:
			"https://www.scouting.org/wp-content/uploads/2023/05/SeaScouts_Logo.png",
		homepageUrl: "https://seascout.org/latest-news",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://seascout.org",
			},
		},
	},
	{
		name: "Troop Leader Resource Updates",
		slug: "troop-leader-resource-updates",
		defaultVisible: true,
		description: "Updates and news about the Troop Leader Resource Hub.",
		coverImageSrc:
			"https://www.scouting.org/wp-content/uploads/2025/05/Scouting-America-Prepared-For-Life-Logo-stacked-4c-BC.png",
		homepageUrl: "https://troopleader.scouting.org/updates-blog",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://troopleader.scouting.org",
			},
		},
	},
	{
		name: "Duty to God BSA",
		slug: "duty-to-god",
		defaultVisible: true,
		description:
			"The blog of the National Religious Relationships Committee, covering religious emblems, chaplaincy, and Duty to God resources.",
		coverImageSrc:
			"https://dutytogodbsa.org/wp-content/uploads/2019/02/duty-to-god-coin.png",
		homepageUrl: "https://dutytogodbsa.org/blog-2/",
		adapter: {
			type: "wordpress-api",
			opts: {
				baseUrl: "https://dutytogodbsa.org",
				// posts live in the jetpack portfolio custom post type, not "posts" -
				// the regular posts endpoint and the site's advertised rss feed are both
				// empty. https://dutytogodbsa.org/portfolio/feed/ carries the same
				// content, but only 10 items per page (?paged=n for the rest), so the
				// api is preferable - it returns all of them in one request.
				type: "jetpack-portfolio",
			},
		},
	},
	{
		name: "my.Scouting Announcements",
		slug: "my-scouting-announcements",
		defaultVisible: true,
		description: "Announcements from the my.Scouting homepage.",
		coverImageSrc:
			"https://www.scouting.org/wp-content/uploads/2026/01/BSA-logo.png",
		homepageUrl: "https://my.scouting.org",
		adapter: { type: "my-scouting-announcements" },
	},
] as const satisfies FeedConfig[];
