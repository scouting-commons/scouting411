import { createScoutingClient } from "scouting-api";
import { createSdk as createAuthSdk } from "scouting-api/auth.scouting.org";
import { MY_SCOUTING_USERNAME, MY_SCOUTING_PASSWORD } from "astro:env/server";

const { data, error } = await createAuthSdk().authentication.authenticate({
	username: MY_SCOUTING_USERNAME,
	password: MY_SCOUTING_PASSWORD,
});

if (error)
	throw new Error(`failed to sign in to my.scouting - ${error.message}`);

/** my.scouting bearer token for api.scouting.org, valid for 8 hours from sign-in */
export const scoutingApiToken = data.token;

/** api.scouting.org, signed in as the my.scouting user in the env */
export const scoutingClient = createScoutingClient({
	auth: { token: data.token },
});
