import {
	faSquareUpRight,
	faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SparklesIcon } from "lucide-react";

export function Page() {
	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-8">
			<section className="flex flex-col gap-3">
				<p className="text-sm">
					Scouting411 exposes its aggregated news index as a public JSON API. No
					authentication, no API key, no rate limit. Posts are served from our
					cache, which is refreshed once a day, so responses may be stale by up
					to 24 hours.
				</p>

				<p className="text-sm">
					The API reference lists every endpoint with its parameters and
					responses, and lets you try requests from the browser. It also covers
					the RSS, Atom, and OPML feeds, which re-publish each source's cached
					posts for any feed reader.
				</p>

				<a
					href="/api"
					className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 self-start rounded-md px-4 py-2 text-sm font-semibold"
				>
					API Reference
					<FontAwesomeIcon icon={faSquareUpRight} />
				</a>

				<div className="border-primary/30 bg-primary/5 flex gap-3 rounded-lg border p-4 text-sm">
					<FontAwesomeIcon
						icon={faTriangleExclamation}
						className="mt-1 shrink-0"
					/>
					<span>
						The API is not versioned and is still subject to major breaking
						changes. Pin nothing you can't fix quickly, and please open an issue
						if you're depending on it — we'd love to know.
					</span>
				</div>
			</section>

			<Section title="MCP server">
				<p className="text-sm">
					The same data is available to AI assistants through a remote MCP
					server: search, news, advancement requirements, and resources.
				</p>
				<a
					href="/agents"
					className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 self-start rounded-md px-4 py-2 text-sm font-semibold"
				>
					<SparklesIcon className="size-4" />
					MCP Setup
				</a>
			</Section>

			<Section title="Open source">
				<p className="text-sm">
					Scouting411 is free and open source software, licensed under the
					AGPLv3. Stars, issues, and pull requests are all very appreciated!
				</p>
				<a
					href="https://github.com/scouting-commons/scouting411"
					rel="noopener noreferrer"
					target="_blank"
					className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 self-start rounded-md px-4 py-2 text-sm font-semibold"
				>
					<FontAwesomeIcon icon={faGithub} />
					GitHub Repo
				</a>
			</Section>
		</div>
	);
}

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col gap-4">
			<h2 className="font-serif text-xl font-bold">{title}</h2>
			{children}
		</section>
	);
}
