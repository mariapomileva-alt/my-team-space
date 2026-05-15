"use client";

import { TEAM_ACCESS_COOKIE, codesMatch, normalizeAccessCode } from "@/lib/team-access";
import type { TeamSpace } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const invite = searchParams.get("invite")?.trim();
    if (invite && codesMatch(team, invite)) {
      document.cookie = `${TEAM_ACCESS_COOKIE}_${team.slug}=${normalizeAccessCode(invite)}; path=/; max-age=${60 * 60 * 24 * 90}; samesite=lax`;
      setGranted(true);
      return;
    }
    const match = document.cookie.match(new RegExp(`${TEAM_ACCESS_COOKIE}_${team.slug}=([^;]+)`));
    if (match?.[1] && codesMatch(team, decodeURIComponent(match[1]))) {
      setGranted(true);
    }
  }, [team, searchParams]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!codesMatch(team, code)) {
      setError("That code doesn’t match. Ask your coach for the team link or code.");
      return;
    }
    document.cookie = `${TEAM_ACCESS_COOKIE}_${team.slug}=${normalizeAccessCode(code)}; path=/; max-age=${60 * 60 * 24 * 90}; samesite=lax`;
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
              />
              <button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
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
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm"
        >
          Enter team space
        </button>
      </form>
    </div>
  );
}
