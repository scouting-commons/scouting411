import { resend } from "@/infra/email/client";
import { DEVELOPER_DEBUG_EMAIL } from "astro:env/server";

export async function sendDevDebugEmail({
	text,
	subject,
}: {
	text: string;
	subject: string;
}) {
	await resend.emails.send({
		from: "scouting411@scouting411.org",
		to: DEVELOPER_DEBUG_EMAIL,
		subject: "[DEV] scouting411: " + subject,
		text,
	});
}
