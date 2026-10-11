import { TypeSafeClient } from "@typesafe-ai/sdk";
import { TYPESAFE_API_KEY } from "astro:env/server";

export const jev = new TypeSafeClient({
	apiKey: TYPESAFE_API_KEY,
	// pinned: the `jev-latest` alias moves on each release, which can change answers
	defaultModel: "jev-1.13.0",
});
