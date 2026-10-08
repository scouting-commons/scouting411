import {
	ArrowUpRightIcon,
	BlocksIcon,
	BookMarkedIcon,
	CalendarDaysIcon,
	NewspaperIcon,
	SearchIcon,
	ArrowRightIcon,
	type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { SearchForm } from "@/components/react/searchForm";
import { cn } from "@/util/cn";
import { rpc } from "@/rpc/client";
import { Icon } from "@/components/react/icon";

const quickLinks = [
	{ href: "https://my.scouting.org", label: "my.Scouting" },
	{ href: "https://advancements.scouting.org", label: "Scoutbook Plus" },
	{
		href: "https://status.scouting.org",
		label: "System Status",
		indicator: <SystemStatusDot />,
	},
];

export function Page() {
	return (
		<div className="flex w-full flex-col items-center gap-20 p-8 pt-24 pb-20">
			<div className="flex w-full flex-col items-center py-8">
				<h1 className="text-primary font-display mb-3.5 text-center text-3xl font-extrabold min-[380px]:text-4xl">
					Scouting411
				</h1>
				<h2 className="text-muted-foreground mb-6 text-center font-serif text-lg">
					The unofficial front page of Scouting America
				</h2>

				<SearchForm autoFocus className="mb-3 max-w-lg" />

				<ul className="mt-3 flex flex-wrap justify-center gap-2">
					{quickLinks.map((link) => (
						<li key={link.href}>
							<a
								href={link.href}
								rel="noopener noreferrer"
								target="_blank"
								className="hover:border-primary hover:text-primary bg-card flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
							>
								{link.indicator}
								{link.label}
								<Icon icon={ArrowUpRightIcon} />
							</a>
						</li>
					))}
				</ul>
			</div>

			<div className="flex w-full max-w-5xl flex-col gap-4">
				<p className="text-muted-foreground mx-auto mb-4 max-w-2xl text-center font-serif">
					Official Scouting America news and resources are scattered across
					dozens of blogs, podcasts, newsrooms, websites, and PDF libraries.
					Scouting411 gathers it all into one place and serves it up in every
					format you want: a newsletter, a search engine, an AI plugin, and
					more.
				</p>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<Card icon={CalendarDaysIcon} title="This Week in Scouting">
						<p>
							Last week's news from official sources, gathered into one edition
							every Sunday.
						</p>
						<a
							href="/this-week"
							className="text-primary mt-auto w-fit font-medium hover:underline"
						>
							Read this week <Icon icon={ArrowRightIcon} />
						</a>
					</Card>

					<Card icon={NewspaperIcon} title="News">
						<p>
							Every post from every official source in one place, filterable by
							source and date.
						</p>
						<a
							href="/news/browse"
							className="text-primary mt-auto w-fit font-medium hover:underline"
						>
							Browse news <Icon icon={ArrowRightIcon} />
						</a>
					</Card>

					<Card icon={BookMarkedIcon} title="Resources">
						<p>
							A directory of official national publications, guides, and tools
							from Scouting America.
						</p>
						<a
							href="/resources"
							className="text-primary mt-auto w-fit font-medium hover:underline"
						>
							Browse resources <Icon icon={ArrowRightIcon} />
						</a>
					</Card>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Card icon={SearchIcon} title="Search engine">
						<p>
							One search across ranks, merit badges, adventures, news sources,
							resources, and pages. Add it to your browser as a search engine,
							too.
						</p>
						<p>
							Start a search with <Code>!</Code> to jump straight to the top
							result.
						</p>
					</Card>

					<Card icon={BlocksIcon} title="Integrations">
						<p>
							Connect Scouting411 to your AI assistant via MCP, your feed reader
							via RSS/Atom, and more.
						</p>
						<a
							href="/integrations"
							className="text-primary mt-auto w-fit font-medium hover:underline"
						>
							All integrations <Icon icon={ArrowRightIcon} />
						</a>
					</Card>
				</div>
			</div>

			<footer className="text-muted-foreground flex max-w-2xl flex-col gap-2 border-t pt-8 text-center text-sm">
				<p>
					Scouting411 is part of the{" "}
					<a
						href="https://scoutingcommons.org"
						rel="noopener noreferrer"
						target="_blank"
						className="text-primary hover:underline"
					>
						Scouting Commons
					</a>
					, a home for free, community-built tools and open data, built in the
					open by Scouts and Scouters. The code is open source on{" "}
					<a
						href="https://github.com/scouting-commons/scouting411"
						rel="noopener noreferrer"
						target="_blank"
						className="text-primary hover:underline"
					>
						GitHub
					</a>
					.
				</p>
				<p className="text-xs">
					Not affiliated with, endorsed by, or sponsored by Scouting America.
				</p>
			</footer>
		</div>
	);
}

/**
 * green if every monitor on status.scouting.org is up, red if any is down. fetched after
 * the page loads, so a slow status page can't hold up the homepage; gray until then, or
 * if the check fails
 */
function SystemStatusDot() {
	const [operational, setOperational] = useState<boolean>();

	useEffect(() => {
		rpc.status
			.get()
			.then((status) => setOperational(status.operational))
			.catch(console.error);
	}, []);

	return (
		<span
			role="img"
			aria-label={
				operational === undefined
					? "Status unknown"
					: operational
						? "All systems operational"
						: "Some systems are down"
			}
			className={cn(
				"size-2 shrink-0 rounded-full",
				operational === undefined && "bg-muted-foreground/40",
				operational === true && "bg-success",
				operational === false && "bg-destructive",
			)}
		/>
	);
}

function Card({
	icon,
	title,
	children,
}: {
	icon: LucideIcon;
	title: string;
	children: ReactNode;
}) {
	return (
		<div className="border-border/60 flex flex-col gap-3 rounded-xl border p-5">
			<h3 className="flex items-center gap-2 font-serif text-base font-bold">
				<Icon icon={icon} className="text-muted-foreground" />
				{title}
			</h3>
			<div className="text-muted-foreground flex flex-1 flex-col gap-2 text-sm">
				{children}
			</div>
		</div>
	);
}

function Code({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) {
	return (
		<code
			className={cn(
				"bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs",
				className,
			)}
		>
			{children}
		</code>
	);
}
