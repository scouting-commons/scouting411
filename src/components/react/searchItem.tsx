import type { ReactNode } from "react";
import { CompassIcon, ExternalLinkIcon, RssIcon } from "lucide-react";
import type { SearchItem } from "@/lib/search/types";
import { cn } from "@/util/cn";

/** how each type of search item is labelled, in display order */
export const searchItemTypes: Record<
	SearchItem["type"],
	{
		/** plural, for a group of items */
		heading: string;
		/** singular, for one item */
		label: string;
		/** shown for items that have no media of their own */
		icon?: ReactNode;
	}
> = {
	page: { heading: "Navigation", label: "Page", icon: <CompassIcon /> },
	hub: { heading: "Hubs", label: "Hub" },
	feed: { heading: "Feeds", label: "Feed", icon: <RssIcon /> },
	resource: {
		heading: "Resources",
		label: "Resource",
		icon: <ExternalLinkIcon />,
	},
	rank: { heading: "Ranks", label: "Rank" },
	meritBadge: { heading: "Merit Badges", label: "Merit Badge" },
	adventure: { heading: "Adventures", label: "Adventure" },
	award: { heading: "Awards", label: "Award" },
};

/**
 * an item's own media — its art, or its color as a swatch — or undefined if it has
 * none, so the caller can fall back to its type's icon
 */
export function searchItemMedia(
	item: Pick<SearchItem, "image" | "color">,
	className?: string,
): ReactNode {
	if (item.image) {
		return (
			<img
				src={item.image}
				alt=""
				loading="lazy"
				className={cn("size-5 object-contain", className)}
			/>
		);
	}

	if (item.color) {
		return (
			<span
				className={cn("size-2.5 shrink-0 rounded-xs", className)}
				style={{ backgroundColor: item.color }}
			/>
		);
	}

	return undefined;
}
