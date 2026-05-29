"use server";

import { sendTeamAdminInviteEmail } from "@/lib/email/admin-invite";
import { requireAuth } from "@/lib/auth/require-auth";
import { adminInviteUrl, parseTeamStaffPayload, type TeamStaffPayload } from "@/lib/team-admin";
import { revalidatePath } from "next/cache";

function appOriginFromEnv(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (url) return url.replace(/\/$/, "");
  return "http://localhost:3000";
}

export async function getTeamStaff(teamId: string): Promise<TeamStaffPayload | null> {
  const { supabase } = await requireAuth();
  const { data, error } = await supabase.rpc("list_team_staff", { p_team_id: teamId });
  if (error) {
    if (error.message.includes("forbidden")) return null;
    throw new Error(error.message);
  }
  return parseTeamStaffPayload(data);
}

export async function createTeamAdminInvite(teamId: string, email: string, siteOrigin?: string) {
  const { supabase } = await requireAuth();
  const { data, error } = await supabase.rpc("create_team_admin_invite", {
    p_team_id: teamId,
    p_email: email.trim(),
  });
  if (error) throw new Error(error.message);

  const row = data as { token?: string; email?: string } | null;
  const token = row?.token;
  if (!token) throw new Error("Invite could not be created");

  const origin = siteOrigin?.trim() || appOriginFromEnv();
  const inviteUrl = adminInviteUrl(origin, token);
  const inviteEmail = row.email ?? email.trim().toLowerCase();

  const { data: teamRow } = await supabase.from("teams").select("name").eq("id", teamId).maybeSingle();
  const mail = await sendTeamAdminInviteEmail({
    to: inviteEmail,
    inviteUrl,
    teamName: (teamRow?.name as string | undefined) ?? "your team",
  });

  revalidatePath(`/admin/team/${teamId}/step-2`);
  return {
    inviteUrl,
    email: inviteEmail,
    emailSent: mail.sent,
    emailError: mail.sent ? undefined : mail.reason,
  };
}

export async function revokeTeamAdminInvite(teamId: string, inviteId: string) {
  const { supabase } = await requireAuth();
  const { error } = await supabase.rpc("revoke_team_admin_invite", { p_invite_id: inviteId });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/team/${teamId}/step-2`);
}

export async function removeTeamAdmin(teamId: string, userId: string) {
  const { supabase } = await requireAuth();
  const { error } = await supabase.rpc("remove_team_staff", {
    p_team_id: teamId,
    p_user_id: userId,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/team/${teamId}/step-2`);
  revalidatePath("/admin");
}

export async function acceptTeamAdminInvite(token: string): Promise<{ teamId: string }> {
  const { supabase } = await requireAuth();
  const { data, error } = await supabase.rpc("accept_team_admin_invite", { p_token: token.trim() });
  if (error) throw new Error(error.message);

  const row = data as { team_id?: string } | null;
  const teamId = row?.team_id;
  if (!teamId) throw new Error("Invite accepted but team id missing");

  revalidatePath("/admin");
  revalidatePath(`/admin/team/${teamId}/step-2`);
  return { teamId };
}
