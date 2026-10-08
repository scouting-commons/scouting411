import type { ReactNode } from "react";
import {
	CompassIcon,
	ExternalLinkIcon,
	RssIcon,
	SquareIcon,
} from "lucide-react";
import type { SearchItem } from "@/lib/search/types";
import { cn } from "@/util/cn";
import { Icon } from "@/components/react/icon";

/** how each type of search item is labelled, in display order */
export const searchItemTypes: Record<
	SearchItem["type"],
	{
		/** plural, for a group of items */
		heading: string;
		/** singular, for one item */
		label: string;
		/** shown for items that have no art of their own, in the item's color if it has one */
		icon?: ReactNode;
	}
> = {
	page: {
		heading: "Navigation",
		label: "Page",
		icon: <Icon icon={CompassIcon} />,
	},
	hub: {
		heading: "Hubs",
		label: "Hub",
		icon: <Icon icon={SquareIcon} className="fill-current" />,
	},
	feed: { heading: "Feeds", label: "Feed", icon: <Icon icon={RssIcon} /> },
	resource: {
		heading: "Resources",
		label: "Resource",
		icon: <Icon icon={ExternalLinkIcon} />,
	},
	rank: { heading: "Ranks", label: "Rank" },
	meritBadge: { heading: "Merit Badges", label: "Merit Badge" },
	adventure: { heading: "Adventures", label: "Adventure" },
	award: { heading: "Awards", label: "Award" },
};

/** an item's art, or undefined if it has none, so the caller can fall back to its type's icon */
export function searchItemMedia(
	item: Pick<SearchItem, "image">,
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

	return undefined;
}
