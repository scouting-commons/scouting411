import {
	Command,
	CommandDialog,
	CommandInput,
	CommandList,
	CommandGroup,
	CommandItem,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { SearchIcon, SunMoonIcon, ZapIcon } from "lucide-react";

import { atom } from "nanostores";
import { useStore } from "@nanostores/react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useIsMobile } from "@/util/hooks/use-mobile";
import {
	Fragment,
	type ReactNode,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useTheme } from "@/components/react/darkModeControl";
import { searchItems } from "@/lib/search/search";
import type { SearchItem } from "@/lib/search/types";
import {
	searchItemMedia,
	searchItemTypes,
} from "@/components/react/searchItem";
import { rpc } from "@/rpc/client";
import { Icon } from "@/components/react/icon";

/** global store for whether the command palette is open */
const $commandPaletteOpen = atom(false);

/** hook for the command palette open/closed state */
function useCommandPalette() {
	const open = useStore($commandPaletteOpen);
	const setOpen = $commandPaletteOpen.set;
	return { open, setOpen };
}

/**
 * mount this component to wire up the command palette and hotkeys.
 * doesn't render anything until the command palette is actually open.
 * */
export function CommandPalette() {
	const { open, setOpen } = useCommandPalette();
	const isMobile = useIsMobile();

	useHotkey("/", () => setOpen(true));
	useHotkey("Mod+K", () => setOpen(true));

	// start fetching the items as soon as the page loads, so they're ready by the time
	// the palette opens
	useEffect(() => {
		loadSearchItems().catch(console.error);
	}, []);

	return (
		<>
			<CommandDialog open={open && !isMobile} onOpenChange={setOpen}>
				<CommandPaletteContent />
			</CommandDialog>

			<Sheet open={open && isMobile} onOpenChange={setOpen}>
				<SheetContent side="top" showCloseButton={false}>
					<CommandPaletteContent />
				</SheetContent>
			</Sheet>
		</>
	);
}

/** the trigger button used in the site header */
export function CommandPaletteTrigger() {
	const { setOpen } = useCommandPalette();

	return (
		<Button
			variant="outline"
			onClick={() => setOpen(true)}
			aria-label="Launch"
			// pl matches the nav links' px-2.5, less the 1px border, so icons and labels line up
			className="justify-between gap-2 pr-1.5 pl-[calc(--spacing(2.5)-1px)] font-normal"
		>
			<span className="flex items-center gap-2">
				<Icon icon={ZapIcon} className="text-muted-foreground size-4" />
				<span className="text-muted-foreground">Launch...</span>
			</span>
			<KbdGroup className="inline-flex">
				<Kbd>Ctrl K</Kbd>
			</KbdGroup>
		</Button>
	);
}

function CommandPaletteContent() {
	const { setTheme } = useTheme();
	const items = useSearchItems();
	// the input stays uncontrolled; only the query lives in state. searching renders at
	// most `resultLimit` items, and the full grouped list is memoized, so a keystroke
	// never re-renders every entry
	const [search, setSearch] = useState("");
	const listRef = useRef<HTMLDivElement>(null);

	function handleSearchChange(value: string) {
		setSearch(value);
		// results reorder on every keystroke, so start each new search from the top. wait a
		// frame: cmdk scrolls its previously selected item into view after this renders, and
		// clearing the search moves that item deep into the grouped list
		requestAnimationFrame(() => {
			listRef.current?.scrollTo({ top: 0 });
		});
	}

	// built once per data load rather than per render, so switching between the grouped
	// and flat layouts doesn't rebuild every entry
	const sections = useMemo<Section[]>(
		() => [
			...Object.entries(searchItemTypes).map(([type, section]) => ({
				...section,
				entries: items
					.filter((item) => item.type === type)
					.map((item) => ({
						id: item.id,
						type: item.type,
						name: item.name,
						keywords: item.keywords,
						description: item.description,
						icon: searchItemMedia(item),
						color: item.color,
						onSelect: handleSelection({
							url: item.url,
							newTab: item.external,
						}),
					})),
			})),
			{
				heading: "Site Theme",
				label: "Theme",
				icon: <Icon icon={SunMoonIcon} />,
				entries: [
					{
						id: "theme:dark",
						name: "Enable dark mode",
						keywords: ["light mode", "system theme"],
						onSelect: handleSelection(() => setTheme("dark")),
					},
					{
						id: "theme:light",
						name: "Enable light mode",
						keywords: ["dark mode", "system theme"],
						onSelect: handleSelection(() => setTheme("light")),
					},
					{
						id: "theme:system",
						name: "Use system theme",
						keywords: ["dark mode", "light mode"],
						onSelect: handleSelection(() => setTheme("system")),
					},
				],
			},
		],
		[items, setTheme],
	);

	// every entry paired with its section, for ranking in one flat list
	const entries = useMemo(
		() =>
			sections.flatMap((section) =>
				section.entries.map((entry) => ({ ...entry, section })),
			),
		[sections],
	);

	const results = useMemo(
		() => searchItems(entries, search, { limit: resultLimit }),
		[entries, search],
	);

	// the same element across renders, so react skips re-rendering it while typing
	const groupedList = useMemo(
		() =>
			sections.map((section, i) => (
				<Fragment key={section.heading}>
					{i > 0 && <CommandSeparator />}
					<CommandGroup heading={section.heading}>
						{section.entries.map((entry) => (
							<PaletteItem key={entry.id} entry={entry} section={section} />
						))}
					</CommandGroup>
				</Fragment>
			)),
		[sections],
	);

	return (
		// search.ts ranks the results, so cmdk only renders and navigates them
		<Command shouldFilter={false}>
			<CommandInput
				placeholder="Launch..."
				icon={ZapIcon}
				onValueChange={handleSearchChange}
			/>
			{/* search results have no group heading under the input, so space them off it */}
			<CommandList ref={listRef} className={search.trim() ? "pt-1" : undefined}>
				{search.trim() ? (
					// while searching, drop the groups and list every match by rank; each
					// item labels its own type instead. the search page link always shows, so
					// the list is never empty and needs no empty state
					// they sit in headingless groups for the same padding as the grouped layout
					<>
						{results.length > 0 && (
							<>
								<CommandGroup>
									{results.map((result) => (
										<PaletteItem
											key={result.id}
											entry={result}
											section={result.section}
											showType
										/>
									))}
								</CommandGroup>
								{/* cmdk hides separators while there's a search unless told otherwise */}
								<CommandSeparator alwaysRender />
							</>
						)}
						<CommandGroup>
							<CommandItem
								value="search:all"
								onSelect={handleSelection({
									url: `/search?${new URLSearchParams({ q: search.trim() })}`,
								})}
							>
								<span className="text-muted-foreground flex size-5 shrink-0 items-center justify-center">
									<Icon icon={SearchIcon} />
								</span>
								See all results for “{search.trim()}”
							</CommandItem>
						</CommandGroup>
					</>
				) : (
					groupedList
				)}
			</CommandList>
		</Command>
	);
}

/** the most results shown while searching */
const resultLimit = 50;

/** one palette entry, grouped under a heading or, while searching, ranked in a flat list */
type Entry = {
	/** unique across the whole palette; cmdk uses it as the item's identity */
	id: string;
	name: string;
	/** matched against the search after the name */
	keywords: string[];
	description?: string | undefined;
	icon?: ReactNode;
	/** the section icon's color, muted if unset */
	color?: string | undefined;
	onSelect: () => void;
};

type Section = {
	heading: string;
	/** singular label shown on each entry in the flat search results */
	label: string;
	/** shown on every entry that has no media of its own */
	icon?: ReactNode;
	entries: Entry[];
};

function PaletteItem({
	entry,
	section,
	showType = false,
}: {
	entry: Entry;
	section: Section;
	showType?: boolean;
}) {
	return (
		<CommandItem
			value={entry.id}
			onSelect={entry.onSelect}
			// the icon keeps its own color when selected, rather than turning foreground
			className="data-selected:**:[svg]:text-inherit"
		>
			{entry.icon ?? (
				// same footprint as the size-5 images, so names line up across types
				<span
					className="text-muted-foreground flex size-5 shrink-0 items-center justify-center"
					style={{ color: entry.color }}
				>
					{section.icon}
				</span>
			)}
			{entry.name}
			{showType && (
				<CommandShortcut className="shrink-0 tracking-normal">
					{section.label}
				</CommandShortcut>
			)}
		</CommandItem>
	);
}

/**
 * the palette's items, fetched once per page load when the palette mounts and kept for
 * every open. every group but the theme is empty until they arrive
 */
let loadedItems: SearchItem[] | undefined;
let itemsRequest: Promise<SearchItem[]> | undefined;

/** fetch the items, or join the fetch already in flight */
function loadSearchItems() {
	itemsRequest ??= rpc.search.items().then(
		(data) => (loadedItems = data),
		(error: unknown) => {
			// let the next open try again
			itemsRequest = undefined;
			throw error;
		},
	);

	return itemsRequest;
}

function useSearchItems() {
	const [items, setItems] = useState<SearchItem[]>(() => loadedItems ?? []);

	useEffect(() => {
		if (loadedItems) return;
		let stale = false;

		loadSearchItems()
			.then((data) => {
				if (!stale) setItems(data);
			})
			.catch(console.error);

		return () => {
			stale = true;
		};
	}, []);

	return items;
}

/** run when a command palette item is selected */
function handleSelection(
	opts: { url: string; newTab?: boolean } | (() => void),
) {
	return () => {
		$commandPaletteOpen.set(false);

		if (typeof opts === "function") {
			opts();
			return;
		}

		if (opts.newTab) {
			window.open(opts.url, "_blank", "noopener,noreferrer");
		} else {
			window.location.href = opts.url;
		}
	};
}
