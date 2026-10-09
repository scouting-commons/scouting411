import { Redis } from "@upstash/redis";

import {
	UPSTASH_REDIS_REST_URL,
	UPSTASH_REDIS_REST_TOKEN,
} from "astro:env/server";

export const redis = new Redis({
	url: UPSTASH_REDIS_REST_URL,
	token: UPSTASH_REDIS_REST_TOKEN,
});
