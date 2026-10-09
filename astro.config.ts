import { defineConfig, fontProviders, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

import { feeds } from "./src/lib/news/feeds/feed";
import { tags } from "./src/lib/tags/tag";

const site = "https://scouting411.org";

// https://astro.build/config
export default defineConfig({
	site,
	trailingSlash: "never",

	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		sitemap({
			// xslURL: "/xslt/sitemap.xslt",
			// SSR routes can't be discovered by the integration, so list them here
			customPages: [
				...feeds.map((feed) => feed.links.overview),
				...tags.map((tag) => tag.links.page),
			].map((path) => new URL(path, site).href),
		}),
		react(),
	],
	adapter: vercel({
		maxDuration: 300,
	}),

	env: {
		schema: {
			UPSTASH_REDIS_REST_URL: envField.string({
				context: "server",
				access: "secret",
				startsWith: "https://",
			}),

			UPSTASH_REDIS_REST_TOKEN: envField.string({
				context: "server",
				access: "secret",
			}),

			/** neon postgres connection string */
			DATABASE_URL: envField.string({
				context: "server",
				access: "secret",
				startsWith: "postgres",
			}),

			// vercel.com/docs/cron-jobs/manage-cron-jobs?framework=other#securing-cron-jobs
			/** token to secure the vercel cron job that updates all the upstream feeds. */
			CRON_SECRET: envField.string({
				context: "server",
				access: "secret",
			}),

			/** my.scouting login for the announcements feed, which needs a signed-in user */
			MY_SCOUTING_USERNAME: envField.string({
				context: "server",
				access: "secret",
			}),

			MY_SCOUTING_PASSWORD: envField.string({
				context: "server",
				access: "secret",
			}),

			RESEND_API_KEY: envField.string({
				context: "server",
				access: "secret",
				startsWith: "re_",
			}),

			DEVELOPER_DEBUG_EMAIL: envField.string({
				context: "server",
				access: "secret",
				includes: "@",
			}),
		},
	},

	fonts: [
		{
			name: "Roboto Slab",
			provider: fontProviders.fontsource(),
			cssVariable: "--font-roboto-slab",
			weights: [400, 700],
			fallbacks: ["serif"],
		},
		{
			name: "Roboto",
			provider: fontProviders.fontsource(),
			cssVariable: "--font-roboto",
			weights: [100, 400, 700],
			fallbacks: ["sans-serif"],
		},
		{
			name: "Montserrat",
			provider: fontProviders.fontsource(),
			cssVariable: "--font-montserrat",
			weights: [800],
			fallbacks: ["sans-serif"],
		},
	],

	devToolbar: { enabled: false },
});
