"use client";

import {
  createTeamAdminInvite,
  getTeamStaff,
  removeTeamAdmin,
  revokeTeamAdminInvite,
} from "@/app/admin/team-admin-actions";
import {
  BUILDER_FIELD_INPUT,
  BUILDER_INSET_WELL,
} from "@/lib/builder/layout";
import { adminInviteUrl, roleLabel, type TeamStaffPayload } from "@/lib/team-admin";
import { useCallback, useEffect, useState, useTransition } from "react";

export function TeamAdminsPanel({
  teamId,
  siteUrl,
  isOwner,
}: {
  teamId: string;
  siteUrl: string;
  isOwner: boolean;
}) {
  const [staff, setStaff] = useState<TeamStaffPayload | null>(null);
  const [email, setEmail] = useState("");
  const [lastInviteUrl, setLastInviteUrl] = useState("");
  const [lastInviteEmail, setLastInviteEmail] = useState("");
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback(async () => {
    if (!isOwner) return;
    try {
      const data = await getTeamStaff(teamId);
      setStaff(data);
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not load team admins");
    }
  }, [isOwner, teamId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!isOwner) {
    return (
      <div className={`mt-5 ${BUILDER_INSET_WELL}`}>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Page admins</p>
        <p className="mt-2 text-sm text-zinc-600">
          You&apos;re an <strong>admin</strong> on this team — you can edit the page. Only the team owner can invite
          or remove admins.
        </p>
      </div>
    );
  }

  function invite() {
    const trimmed = email.trim();
    if (!trimmed) return;
    startTransition(async () => {
      try {
        const result = await createTeamAdminInvite(teamId, trimmed, siteUrl);
        setLastInviteUrl(result.inviteUrl);
        setLastInviteEmail(result.email);
        setEmailSent(result.emailSent);
        setEmail("");
        setErr(null);
        await load();
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Could not create invite");
      }
    });
  }

  return (
    <div className={`mt-5 border-t border-zinc-100 pt-4 ${BUILDER_INSET_WELL}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Page admins</p>
      <p className="mt-1 text-sm text-zinc-600">
        Invite someone to help manage this page — same editor access as you, without billing controls. If email is
        configured on the server, we send the invite automatically; otherwise copy the link below.
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          className={BUILDER_FIELD_INPUT}
          placeholder="assistant@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending}
        />
        <button
          type="button"
          disabled={pending || !email.trim()}
          onClick={invite}
          className="shrink-0 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Creating…" : "Invite admin"}
        </button>
      </div>

      {lastInviteUrl ? (
        <div
          className={`mt-3 rounded-xl border px-3 py-2.5 ${
            emailSent
              ? "border-emerald-200 bg-emerald-50/80"
              : "border-indigo-100 bg-indigo-50/50"
          }`}
        >
          {emailSent ? (
            <p className="text-[11px] font-semibold text-emerald-900">
              Invite email sent to {lastInviteEmail}. Ask them to check inbox and spam.
            </p>
          ) : (
            <p className="text-[11px] font-semibold text-indigo-900">
              Automatic email is not set up — copy this link and send it to {lastInviteEmail} (WhatsApp, Telegram, or
              Gmail).
            </p>
          )}
          <p className="mt-1 break-all text-xs text-zinc-700">{lastInviteUrl}</p>
          <button
            type="button"
            className="mt-2 text-xs font-semibold text-indigo-700 underline"
            onClick={() => void navigator.clipboard.writeText(lastInviteUrl)}
          >
            Copy invite link
          </button>
        </div>
      ) : null}

      {staff?.members.length ? (
        <ul className="mt-4 space-y-2">
          {staff.members.map((m) => (
            <li
              key={m.user_id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-100 bg-white px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900">{m.email ?? "No email"}</p>
                <p className="text-[11px] text-zinc-500">{roleLabel(m.role)}</p>
              </div>
              {m.role === "assistant" ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      try {
                        await removeTeamAdmin(teamId, m.user_id);
                        await load();
                      } catch (e) {
                        setErr(e instanceof Error ? e.message : "Could not remove admin");
                      }
                    })
                  }
                  className="text-xs font-semibold text-red-600"
                >
                  Remove
                </button>
              ) : (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">You</span>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {staff?.pending_invites.length ? (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Pending invites</p>
          <ul className="mt-2 space-y-2">
            {staff.pending_invites.map((inv) => (
              <li
                key={inv.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dashed border-zinc-200 bg-white/80 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-800">{inv.email}</p>
                  <p className="text-[10px] text-zinc-400">Expires {new Date(inv.expires_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-xs font-semibold text-indigo-700 underline"
                    onClick={() =>
                      void navigator.clipboard.writeText(adminInviteUrl(siteUrl, inv.token))
                    }
                  >
                    Copy link
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    className="text-xs font-semibold text-zinc-500"
                    onClick={() =>
                      startTransition(async () => {
                        try {
                          await revokeTeamAdminInvite(teamId, inv.id);
                          await load();
                        } catch (e) {
                          setErr(e instanceof Error ? e.message : "Could not revoke invite");
                        }
                      })
                    }
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {err ? (
        <p className="mt-3 text-xs text-red-600">
          {err.includes("Could not find the function") || err.includes("schema cache")
            ? "Run the team admin migration in Supabase SQL Editor (RUN_TEAM_ADMIN_INVITES.sql), then try again."
            : err}
        </p>
      ) : null}
    </div>
  );
}
