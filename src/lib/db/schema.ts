// drizzle table definitions. drizzle-kit reads this file (see drizzle.config.ts) to generate migrations
import {
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	unique,
} from "drizzle-orm/pg-core";
import { feedSlugSchema } from "@/lib/news/feeds/types";

/** enum of feed slugs, built from the feeds config file */
export const feedSlugEnum = pgEnum("feed_slug", feedSlugSchema.enum);

/** every post ingested from an upstream feed */
export const posts = pgTable(
	"posts",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		feedSlug: feedSlugEnum().notNull(),
		/** the original url of the post, its identity within a feed */
		url: text().notNull(),
		title: text().notNull(),
		description: text(),
		/** external image url to use as a thumbnail */
		thumbnail: text(),
		/** when upstream says the post was published */
		publishedAt: timestamp({ withTimezone: true }).notNull(),
		/** when ingest first saw the post / when this database row was created */
		createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
		/** when this database row was last updated */
		updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		unique("posts_feed_slug_url_unique").on(table.feedSlug, table.url),
		index().on(table.publishedAt),
	],
);
