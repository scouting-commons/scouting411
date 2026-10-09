import { drizzle } from "drizzle-orm/neon-http";

import { DATABASE_URL } from "astro:env/server";
import * as schema from "@/server/db/schema";

export const db = drizzle(DATABASE_URL, { schema, casing: "snake_case" });
