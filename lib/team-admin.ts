export type TeamMemberRole = "coach" | "assistant";

export type TeamStaffMember = {
  user_id: string;
  role: TeamMemberRole;
  email: string | null;
  created_at: string;
};

export type TeamPendingInvite = {
  id: string;
  email: string;
  token: string;
  created_at: string;
  expires_at: string;
};

export type TeamStaffPayload = {
  members: TeamStaffMember[];
  pending_invites: TeamPendingInvite[];
};

export function adminInviteUrl(siteOrigin: string, token: string): string {
  const base = siteOrigin.replace(/\/$/, "");
  return `${base}/admin/accept-invite?token=${encodeURIComponent(token)}`;
}

export function roleLabel(role: TeamMemberRole): string {
  return role === "coach" ? "Owner" : "Admin";
}

export function parseTeamStaffPayload(raw: unknown): TeamStaffPayload {
  if (!raw || typeof raw !== "object") {
    return { members: [], pending_invites: [] };
  }
  const o = raw as { members?: unknown; pending_invites?: unknown };
  const members = Array.isArray(o.members)
    ? o.members.filter((m): m is TeamStaffMember => Boolean(m && typeof m === "object" && "user_id" in m))
    : [];
  const pending_invites = Array.isArray(o.pending_invites)
    ? o.pending_invites.filter((m): m is TeamPendingInvite => Boolean(m && typeof m === "object" && "id" in m))
    : [];
  return { members, pending_invites };
}
