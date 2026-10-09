import { feeds } from "@/lib/news/feeds/feed";
import { hubs } from "@/lib/hubs/hub";
import { queryResources } from "@/lib/resources/query";
import { getTagBySlug } from "@/lib/tags/tag";
import { listRanks } from "@/lib/advancement/ranks/query";
import { listMeritBadges } from "@/lib/advancement/meritBadges/query";
import { listAdventures } from "@/lib/advancement/adventures/query";
import { listAwards } from "@/lib/advancement/awards/query";
import { rankPath } from "@/lib/advancement/ranks/types";
import { meritBadgePath } from "@/lib/advancement/meritBadges/types";
import { adventurePath } from "@/lib/advancement/adventures/types";
import { awardPath } from "@/lib/advancement/awards/types";
import type { SearchItem } from "@/lib/search/types";

/*
 * server only: the advancement sources read redis. browser code gets these items over
 * rpc and runs `searchItems` on them itself, so never import this from an island
 */

/** site navigation pages */
const navigation = [
	{ href: "/", label: "Home" },
	{ href: "/newspaper", label: "Newspaper" },
	{ href: "/news/browse", label: "Posts Archive" },
	{ href: "/news/sources", label: "Sources" },
	{ href: "/news/stats", label: "Stats" },
	{ href: "/advancement/ranks", label: "Ranks" },
	{ href: "/advancement/merit-badges", label: "Merit Badges" },
	{ href: "/advancement/adventures", label: "Adventures" },
	{ href: "/advancement/awards", label: "Awards" },
	{ href: "/resources", label: "Resources" },
	{ href: "/integrations", label: "Integrations" },
	{ href: "/developers", label: "Developers" },
];

/**
 * every source of searchable items, in the order ties are broken. register a new kind
 * of item here
 */
const sources: (() => SearchItem[] | Promise<SearchItem[]>)[] = [
	() =>
		navigation.map((page) => ({
			id: page.href,
			type: "page",
			name: page.label,
			keywords: [],
			url: page.href,
			external: false,
		})),
	() =>
		hubs.map((hub) => ({
			id: hub.links.page,
			type: "hub",
			name: hub.name,
			keywords: [`${hub.name} Hub`],
			description: hub.description,
			url: hub.links.page,
			external: false,
			color: hub.color,
		})),
	() =>
		feeds.map((feed) => ({
			id: feed.links.overview,
			type: "feed",
			name: feed.name,
			keywords: [],
			description: feed.description,
			url: feed.links.overview,
			external: false,
		})),
	() =>
		queryResources().map((resource) => ({
			id: resource.url,
			type: "resource",
			name: resource.title,
			keywords: resource.tags.map((slug) => getTagBySlug(slug).name),
			description: resource.description,
			url: resource.url,
			external: true,
		})),
	async () =>
		(await listRanks()).map((rank) => ({
			id: rankPath(rank.slug),
			type: "rank",
			name: rank.name,
			keywords: [`${rank.name} Rank`, rank.program],
			url: rankPath(rank.slug),
			external: false,
			image: rank.images.medium,
		})),
	async () =>
		(await listMeritBadges()).map((badge) => ({
			id: meritBadgePath(badge.slug),
			type: "meritBadge",
			name: `${badge.name} Merit Badge`,
			keywords: badge.categories.map((category) => category.name),
			url: meritBadgePath(badge.slug),
			external: false,
			image: badge.images.small,
		})),
	async () =>
		(await listAdventures()).map((adventure) => ({
			id: adventurePath(adventure.slug),
			type: "adventure",
			name: adventure.name,
			keywords: [`${adventure.name} Adventure`, adventure.rank.name],
			url: adventurePath(adventure.slug),
			external: false,
			image: adventure.images.small,
		})),
	async () =>
		(await listAwards()).map((award) => ({
			id: awardPath(award.slug),
			type: "award",
			name: award.name,
			keywords: [award.program],
			url: awardPath(award.slug),
			external: false,
			image: award.images?.small,
		})),
];

/**
 * every searchable item on the site. a source that fails is logged and left out, so
 * one bad redis read doesn't empty the whole search
 */
export async function loadSearchItems(): Promise<SearchItem[]> {
	const results = await Promise.allSettled(
		sources.map(async (source) => source()),
	);

	return results.flatMap((result) => {
		if (result.status === "fulfilled") return result.value;

		console.error("search source failed", result.reason);
		return [];
	});
}
