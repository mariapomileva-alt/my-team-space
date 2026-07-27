"use client";

import { TEAM_ACCESS_GRANTED, teamAccessCookieName } from "@/lib/team-access";
import type { TeamSpace } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

async function verifyTeamAccess(slug: string, code: string): Promise<boolean> {
  const res = await fetch(`/api/teams/${encodeURIComponent(slug)}/verify-access`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { ok?: boolean };
  return data.ok === true;
}

function readGrantedCookie(slug: string): boolean {
  const name = teamAccessCookieName(slug);
  const match = document.cookie.match(new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]+)`));
  return decodeURIComponent(match?.[1] ?? "") === TEAM_ACCESS_GRANTED;
}

export function TeamAccessGate({
  team,
  mode,
  children,
}: {
  team: TeamSpace;
  mode: "private" | "mixed";
  children: (hasAccess: boolean) => React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [granted, setGranted] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checkingInvite, setCheckingInvite] = useState(false);

  useEffect(() => {
    if (readGrantedCookie(team.slug)) {
      // Client-only: restore access from prior server-verified cookie
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount sync
      setGranted(true);
      return;
    }

    const invite = searchParams.get("invite")?.trim();
    if (!invite) return;

    let cancelled = false;
    setCheckingInvite(true);
    void verifyTeamAccess(team.slug, invite).then((ok) => {
      if (cancelled) return;
      setCheckingInvite(false);
      if (ok) setGranted(true);
    });
    return () => {
      cancelled = true;
    };
  }, [team.slug, searchParams]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await verifyTeamAccess(team.slug, code);
    if (!ok) {
      setError("That code doesn’t match. Ask your coach for the team link or code.");
      return;
    }
    setError(null);
    setGranted(true);
    router.refresh();
  }

  if (mode === "mixed") {
    return (
      <>
        {!granted ? (
          <div className="mx-auto max-w-3xl px-4 py-3">
            <form onSubmit={submit} className="flex flex-wrap items-center justify-center gap-2">
              <input
                className="min-w-[140px] flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                placeholder="Team code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={checkingInvite}
              />
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                disabled={checkingInvite}
              >
                Unlock all
              </button>
            </form>
            {error ? <p className="mt-2 text-center text-xs text-red-600">{error}</p> : null}
          </div>
        ) : null}
        {children(granted)}
      </>
    );
  }

  if (granted) return <>{children(true)}</>;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gradient-to-b from-indigo-50/60 to-white px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Private team</p>
      <h1 className="mt-3 text-2xl font-bold text-zinc-900">{team.name}</h1>
      <p className="mt-2 max-w-sm text-sm text-zinc-500">
        Enter the team code from your coach, or open the magic link they sent. No account needed.
      </p>
      <form onSubmit={submit} className="mt-8 w-full max-w-xs space-y-3">
        <input
          className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-center text-lg font-semibold tracking-wide"
          placeholder="Team code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoComplete="off"
          disabled={checkingInvite}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm"
          disabled={checkingInvite}
        >
          Enter team space
        </button>
      </form>
    </div>
  );
}
