import type { APIRoute } from "astro";
import { generateRssFeed } from "feedsmith";

import { getFeedBySlug } from "@/lib/news/feeds/feed";
import { rpc } from "@/rpc/client";
import { isFeedSlug } from "@/lib/news/feeds/feed";

// todo maybe this could just accept a full query as url params and return it as rss,
// allowing users to make whatever query they want into an rss feed

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

	const generated = generateRssFeed(
		{
			title: feed.name,
			link: feed.links.overview, //todo this should be an absolute url
			description: feed.description,
			image: {
				url: feed.coverImageSrc,
				title: feed.name,
				link: feed.links.overview,
			},

			generator: "scouting411",
			docs: "https://www.rssboard.org/rss-specification",
			language: "en-us",

			items: posts.map((post) => ({
				title: post.title,
				...(post.description && { description: post.description }),
				pubDate: post.date,
				link: post.url,
				categories: [
					{
						name: post.feed.name,
					},
				],
				guid: {
					isPermaLink: true,
					value: post.url,
				},

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
				{
					title: "RSS Stylesheet",
					type: "text/xsl",
					href: "/xslt/rss.xslt",
				},
			],
		},
	);

	return new Response(generated, {
		headers: {
			"Content-Type": "text/xml",
		},
	});
};
