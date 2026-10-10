import type { APIRoute } from "astro";
import { getFeedBySlug } from "@/lib/news/feeds/feed";
import { generateAtomFeed } from "feedsmith";
import { rpc } from "@/rpc/client";
import { isFeedSlug } from "@/lib/news/feeds/feed";

export const prerender = false;

// documented by hand in the openapi spec — update `src/rpc/openapi/feedPaths.ts` when this route changes
export const GET: APIRoute = async (context) => {
	const slug = context.params.slug!;
	if (!isFeedSlug(slug)) {
		return new Response("Not found", { status: 404 });
	}

	const feed = getFeedBySlug(slug);

	const { posts } = await rpc.news.posts.query({
		feeds: [slug],
		paginate: false,
	});

	const generated = generateAtomFeed(
		{
			title: { value: feed.name },
			id: feed.links.homepage,
			icon: feed.coverImageSrc,

			updated: new Date(),
			generator: {
				text: "scouting411",
			},

			links: [
				{
					rel: "self",
					href: feed.links.atom, //todo this should be an absolute url
					type: "text/xml",
					title: feed.name,
					hreflang: "en-us",
				},
				{
					rel: "alternate",
					href: feed.links.rss,
					type: "application/rss+xml",
					title: "RSS Feed",
					hreflang: "en-us",
				},
				{
					rel: "alternate",
					href: feed.links.homepage,
					type: "text/html",
					title: "Upstream Homepage",
					hreflang: "en-us",
				},
			],
			entries: posts.map((post) => ({
				title: { value: post.title },
				id: post.url,
				updated: post.date,
				...(post.description && { summary: { value: post.description } }),
				published: post.date,

				links: [
					{
						rel: "self",
						href: post.url,
						type: "text/html",
						title: post.title,
						hreflang: "en-us",
					},
					// only the url is stored. every podcast upstream serves mp3
					...(post.audio
						? [{ rel: "enclosure", href: post.audio, type: "audio/mpeg" }]
						: []),
				],

				...(post.thumbnail && {
					media: {
						thumbnails: [
							{
								url: post.thumbnail,
							},
						],
					},
				}),
			})),
		},
		{
			strict: true,
			stylesheets: [
				// todo this stylesheet doesn't seem to play nice with atom
				// {
				// 	title: "RSS Stylesheet",
				// 	type: "text/xsl",
				// 	href: "/xslt/rss.xslt",
				// },
			],
		},
	);

	return new Response(generated, {
		headers: {
			"Content-Type": "text/xml",
		},
	});
};
