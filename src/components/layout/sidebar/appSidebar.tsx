import { NavLink } from "@/components/layout/sidebar/navLink";
import { NavGroup } from "@/components/layout/sidebar/navGroup";
import { Badge } from "@/components/ui/badge";
import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarFooter,
} from "@/components/ui/sidebar";
import {
	faBookBookmark,
	faBullhorn,
	faHouseChimney,
	faMagnifyingGlassChart,
	faNewspaper,
	faRssSquare,
	faArrowsRotate,
	faAward,
	faMedal,
	faCompass,
	faRibbon,
	faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { DarkModeControl } from "@/components/react/darkModeControl";
import { TooltipProvider } from "@/components/ui/tooltip";

import { CommandPaletteTrigger } from "@/components/react/commandPalette";
import { hubs } from "@/lib/hubs/hub";

export function AppSidebar({ url }: { url: URL }) {
	return (
		<Sidebar
			className="border-sidebar-border border-r"
			aria-label="Main sidebar"
		>
			<SidebarHeader className="border-sidebar-border h-header flex shrink-0 flex-row items-center justify-between gap-2 border-b px-4">
				<a
					href="/"
					className="font-display text-sidebar-primary text-lg font-extrabold"
				>
					Scouting411
				</a>
				<Badge
					variant="secondary"
					className="text-sidebar-foreground/70 font-mono"
				>
					alpha
				</Badge>
			</SidebarHeader>

			<SidebarContent className="flex h-full flex-col gap-4 overflow-auto py-3">
				<div className="flex flex-col px-3">
					<CommandPaletteTrigger />
				</div>

				<div className="flex flex-col gap-6">
					<NavGroup>
						<NavLink
							href="/"
							label="Home"
							currentUrl={url}
							icon={faHouseChimney}
						/>
						<NavLink
							href="/agents"
							label="Agent setup"
							currentUrl={url}
							icon={faRobot}
						/>
					</NavGroup>

					<NavGroup label="hubs">
						{hubs.map((hub) => (
							<NavLink
								key={hub.slug}
								href={hub.links.page}
								label={hub.name}
								currentUrl={url}
								color={hub.color}
							/>
						))}
					</NavGroup>

					<NavGroup label="news">
						<NavLink
							href="/news/browse"
							label="Newsfeed"
							currentUrl={url}
							icon={faNewspaper}
						/>
						<NavLink
							href="/news/sources"
							label="Sources"
							currentUrl={url}
							icon={faBullhorn}
						/>
						<NavLink
							href="/news/subscribe"
							label="Subscribe"
							currentUrl={url}
							icon={faRssSquare}
						/>
						<NavLink
							href="/news/stats"
							label="Stats"
							currentUrl={url}
							icon={faMagnifyingGlassChart}
						/>
						{import.meta.env.DEV && (
							<NavLink
								href="/api/updateAllFeeds"
								label="Ingest news"
								currentUrl={url}
								icon={faArrowsRotate}
								newTab
							/>
						)}
					</NavGroup>

					<NavGroup label="advancement">
						<NavLink
							href="/advancement/ranks"
							label="Ranks"
							currentUrl={url}
							icon={faMedal}
						/>
						<NavLink
							href="/advancement/merit-badges"
							label="Merit Badges"
							currentUrl={url}
							icon={faAward}
						/>
						<NavLink
							href="/advancement/adventures"
							label="Adventures"
							currentUrl={url}
							icon={faCompass}
						/>
						<NavLink
							href="/advancement/awards"
							label="Awards"
							currentUrl={url}
							icon={faRibbon}
						/>
						{import.meta.env.DEV && (
							<NavLink
								href="/api/updateAdvancement"
								label="Ingest advancement"
								currentUrl={url}
								icon={faArrowsRotate}
								newTab
							/>
						)}
					</NavGroup>

					<NavGroup label="resources">
						<NavLink
							href="/resources"
							label="Resources"
							currentUrl={url}
							icon={faBookBookmark}
						/>
					</NavGroup>
				</div>
			</SidebarContent>

			<SidebarFooter className="border-sidebar-border gap-3 border-t px-4 py-4">
				<div className="flex items-center justify-between gap-2">
					<nav
						aria-label="Site"
						className="text-sidebar-foreground/70 flex gap-3 text-xs"
					>
						<a href="/about" className="hover:text-sidebar-foreground">
							About
						</a>
						<a
							href="https://github.com/scouting-commons/scouting411/issues/new/choose"
							className="hover:text-sidebar-foreground"
						>
							Feedback
						</a>
						<a href="/developers" className="hover:text-sidebar-foreground">
							Developers
						</a>
					</nav>
					<TooltipProvider>
						<DarkModeControl />
					</TooltipProvider>
				</div>
				<div className="text-sidebar-foreground/50 flex flex-col gap-0.5 text-xs">
					<span>
						A project by{" "}
						<a
							href="https://scoutingcommons.org"
							rel="noopener noreferrer"
							target="_blank"
							className="hover:text-sidebar-foreground underline underline-offset-2"
						>
							Scouting Commons
						</a>
						.
					</span>
					<span>Not affiliated with Scouting America.</span>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
