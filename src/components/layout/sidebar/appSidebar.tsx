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
	faCommentDots,
	faHouseChimney,
	faMagnifyingGlassChart,
	faNewspaper,
	faRssSquare,
	faCode,
	faArrowsRotate,
	faCircleInfo,
	faAward,
	faMedal,
	faCompass,
	faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { SparklesIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DarkModeControl } from "@/components/react/darkModeControl";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { CommandPaletteTrigger } from "@/components/react/commandPalette";
import { hubs } from "@/lib/hubs/hub";

export function AppSidebar({ url }: { url: URL }) {
	return (
		<Sidebar
			className="border-sidebar-border border-r"
			aria-label="Main sidebar"
		>
			<SidebarHeader className="border-sidebar-border flex h-13 shrink-0 flex-row items-center justify-between gap-2 border-b px-4">
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
							href="/mcp-server"
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

			<SidebarFooter className="p-0">
				<span className="text-sidebar-foreground/70 p-3 py-1 text-xs">
					Not affiliated with Scouting America.
				</span>
				<TooltipProvider>
					<div className="border-sidebar-border flex flex-row items-center justify-between gap-2 border-t p-4">
						<Tooltip>
							<TooltipTrigger
								render={
									<a
										href="/about"
										className={buttonVariants({
											size: "icon",
											variant: "outline",
										})}
									>
										<FontAwesomeIcon icon={faCircleInfo} />
										<span className="sr-only">About</span>
									</a>
								}
							/>
							<TooltipContent>About</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger
								render={
									<a
										href="https://github.com/scouting-commons/scouting411/issues/new/choose"
										className={buttonVariants({
											size: "icon",
											variant: "outline",
										})}
									>
										<FontAwesomeIcon icon={faCommentDots} />
										<span className="sr-only">Send feedback</span>
									</a>
								}
							/>
							<TooltipContent>Send feedback</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger
								render={
									<a
										href="/developers"
										className={buttonVariants({
											size: "icon",
											variant: "outline",
										})}
									>
										<FontAwesomeIcon icon={faCode} />
										<span className="sr-only">Developers</span>
									</a>
								}
							/>
							<TooltipContent>For developers</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger
								render={
									<a
										href="/mcp-server"
										className={buttonVariants({
											size: "icon",
											variant: "outline",
										})}
									>
										<SparklesIcon />
										<span className="sr-only">Use with AI</span>
									</a>
								}
							/>
							<TooltipContent>Use with AI</TooltipContent>
						</Tooltip>
						<DarkModeControl />
					</div>
				</TooltipProvider>
			</SidebarFooter>
		</Sidebar>
	);
}
