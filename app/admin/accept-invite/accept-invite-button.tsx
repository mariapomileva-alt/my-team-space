"use client";

import { acceptTeamAdminInvite } from "@/app/admin/team-admin-actions";
import { teamBuildPath } from "@/lib/admin/admin-nav";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

function formatInviteError(message: string): string {
  if (message.includes("email mismatch")) {
    return "This invite was sent to a different email address. Sign out, then sign in with the invited email and try again.";
  }
  if (message.includes("invite expired")) {
    return "This invite has expired. Ask the team owner to send a new invite link.";
  }
  if (message.includes("invite revoked")) {
    return "This invite was cancelled. Ask the team owner for a new link.";
  }
  if (message.includes("invite not found")) {
    return "Invite link is invalid or already used.";
  }
  return message;
}

export function AcceptInviteButton({ token }: { token: string }) {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-6">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            try {
              setErr(null);
              const { teamId } = await acceptTeamAdminInvite(token);
              router.push(teamBuildPath(teamId));
              router.refresh();
            } catch (e) {
              const message = e instanceof Error ? e.message : "Could not accept invite";
              setErr(formatInviteError(message));
            }
          })
        }
        className="w-full rounded-full bg-indigo-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Opening team…" : "Accept & open editor"}
      </button>
      {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
    </div>
  );
}
