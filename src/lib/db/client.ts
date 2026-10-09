import { drizzle } from "drizzle-orm/neon-http";

import { DATABASE_URL } from "astro:env/server";

export const db = drizzle(DATABASE_URL);
