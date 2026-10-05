import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ArrowUpRightIcon, BotIcon, RssIcon, SearchIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { SearchForm } from "@/components/react/searchForm";
import { cn } from "@/util/cn";
import { rpc } from "@/rpc/client";

const quickLinks = [
	{ href: "https://my.scouting.org", label: "my.Scouting" },
	{ href: "https://advancements.scouting.org", label: "Scoutbook Plus" },
	{ href: "https://scoutbook.scouting.org", label: "Scoutbook" },
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
								<ArrowUpRightIcon className="size-3.5" />
							</a>
						</li>
					))}
				</ul>
			</div>

			<div className="grid grid-cols-1 gap-5">
				<IntegrationCard icon={<SearchIcon />} title="Browser search">
					<p>
						Add Scouting411 as a search engine: in Chrome, type scouting411.org
						and press Tab; in Firefox, use the address bar menu.
					</p>
					<p>
						Start a search with <Code>!</Code> to jump straight to the top
						result.
					</p>
				</IntegrationCard>

				<IntegrationCard icon={<RssIcon />} title="RSS feeds">
					<p>
						Every official source, re-published as RSS and Atom feeds for any
						feed reader, or all at once via OPML.
					</p>
					<a
						href="/news/subscribe"
						className="text-primary w-fit font-semibold underline"
					>
						Subscribe <FontAwesomeIcon icon={faArrowRight} />
					</a>
				</IntegrationCard>

				<IntegrationCard icon={<BotIcon />} title="MCP server">
					<p>
						Give an AI assistant first-party Scouting news, advancement, and
						resources. Add this URL as a remote MCP server:
					</p>
					<Code className="block w-fit select-all">{mcpUrl}</Code>
					<a
						href="/agents"
						className="text-primary w-fit font-semibold underline"
					>
						Setup guide <FontAwesomeIcon icon={faArrowRight} />
					</a>
				</IntegrationCard>
			</div>
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

/** the public url of the mcp server, served by `src/pages/mcp.ts` */
const mcpUrl = new URL("/mcp", import.meta.env.SITE).href;

function IntegrationCard({
	icon,
	title,
	children,
}: {
	icon: ReactNode;
	title: string;
	children: ReactNode;
}) {
	return (
		<div className="bg-card flex flex-col gap-3 rounded-lg border p-5">
			<h3 className="flex items-center gap-2 font-serif text-base font-bold">
				<span className="text-primary [&_svg]:size-4">{icon}</span>
				{title}
			</h3>
			<div className="text-muted-foreground flex flex-col gap-2 text-sm">
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
