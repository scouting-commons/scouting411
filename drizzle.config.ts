import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside astro, so astro:env isn't available; drizzle-kit loads .env itself.
// no throw here: knip loads this config in CI, where DATABASE_URL is unset
export default defineConfig({
	dialect: "postgresql",
	casing: "snake_case",
	schema: "./src/infra/db/schema.ts",
	out: "./drizzle",
	dbCredentials: { url: process.env["DATABASE_URL"] ?? "" },
});
