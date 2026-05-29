"use client";

import { acceptTeamAdminInvite } from "@/app/admin/team-admin-actions";
import { useState, useTransition } from "react";

export function AcceptInviteButton({ token }: { token: string }) {
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
              await acceptTeamAdminInvite(token);
            } catch (e) {
              setErr(e instanceof Error ? e.message : "Could not accept invite");
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
