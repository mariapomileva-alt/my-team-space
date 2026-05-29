import { Resend } from "resend";

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendTeamAdminInviteEmail(params: {
  to: string;
  inviteUrl: string;
  teamName: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    return { sent: false, reason: "not_configured" };
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ?? "MyTeamSpace <onboarding@resend.dev>";
  const resend = new Resend(key);
  const teamName = escapeHtml(params.teamName);
  const inviteUrl = escapeHtml(params.inviteUrl);

  const { error } = await resend.emails.send({
    from,
    to: [params.to],
    subject: `You're invited to edit ${params.teamName} on MyTeamSpace`,
    html: `
      <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#18181b;max-width:32rem">
        <p style="font-size:1.125rem;font-weight:700;margin:0 0 0.75rem">You're invited as a page admin</p>
        <p style="margin:0 0 1rem">
          You've been invited to help edit <strong>${teamName}</strong> on MyTeamSpace — same editor as the coach,
          without billing access.
        </p>
        <p style="margin:0 0 1.25rem">
          <a href="${inviteUrl}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:0.65rem 1.25rem;border-radius:9999px;font-weight:600">
            Accept invite &amp; open editor
          </a>
        </p>
        <p style="margin:0;font-size:0.875rem;color:#52525b">
          Or copy this link:<br />
          <a href="${inviteUrl}" style="color:#4f46e5;word-break:break-all">${inviteUrl}</a>
        </p>
        <p style="margin:1.25rem 0 0;font-size:0.75rem;color:#71717a">
          Sign in with this email address (${escapeHtml(params.to)}) when you open the link. Link expires in 14 days.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("[myteamspace] admin invite email failed:", error);
    return { sent: false, reason: error.message };
  }

  return { sent: true };
}
