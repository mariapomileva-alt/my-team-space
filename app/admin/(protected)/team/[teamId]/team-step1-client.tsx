"use client";

import type { TeamSpace, ThemeId } from "@/lib/types";
import { THEMES } from "@/lib/themes";
import { ADMIN_BLOCK_LABELS } from "@/lib/mts/admin-block-labels";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { saveTeamContent } from "./server-actions";

export function TeamStep1Client({
  teamId,
  initialTeam,
}: {
  teamId: string;
  initialTeam: TeamSpace;
}) {
  const router = useRouter();
  const [team, setTeam] = useState<TeamSpace>(initialTeam);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useTransition();

  useEffect(() => {
    setTeam(initialTeam);
  }, [initialTeam]);

  const blocksSorted = useMemo(() => [...team.blocks].sort((a, b) => a.order - b.order), [team.blocks]);

  function setTheme(themeId: ThemeId) {
    const th = THEMES.find((t) => t.id === themeId);
    const vars = th?.cssVars as Record<string, string> | undefined;
    setTeam((prev) => ({
      ...prev,
      themeId,
      primaryColor: vars?.["--mts-primary"] ?? prev.primaryColor,
      secondaryColor: vars?.["--mts-accent"] ?? prev.secondaryColor,
    }));
  }

  function toggleBlock(id: string) {
    setTeam((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)),
    }));
  }

  function continueToLayout() {
    setMsg(null);
    setPending(async () => {
      try {
        await saveTeamContent(teamId, team);
        router.push(`/admin/team/${teamId}/step-2`);
        router.refresh();
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <StepIndicator current={1} teamId={teamId} />
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Step 1 · Identity & look</p>
          <h1 className="mt-1 text-xl font-bold text-zinc-900">Team name, colors, and which blocks appear</h1>
          <p className="mt-2 text-sm text-zinc-600">
            On the next step you will reorder blocks and polish the public page. Everything is saved in Supabase (not only this browser).
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={continueToLayout}
              className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save & continue"}
            </button>
            <Link href="/admin" className="rounded-full border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700">
              All teams
            </Link>
          </div>
          {msg ? <p className="mt-3 text-xs text-red-600">{msg}</p> : null}
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-10 px-4 py-8 sm:px-8">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Team profile</h2>
          <p className="mt-1 text-sm text-zinc-600">Name and short line for parents — stored with your team in the database.</p>
          <label className="mt-4 block text-xs font-semibold text-zinc-500">Team name</label>
          <input
            className="mt-1 w-full max-w-lg rounded-xl border border-zinc-200 px-3 py-2.5 text-lg font-semibold outline-none focus:ring-2 focus:ring-indigo-200"
            value={team.name}
            onChange={(e) => setTeam((t) => ({ ...t, name: e.target.value }))}
          />
          <label className="mt-4 block text-xs font-semibold text-zinc-500">Tagline for families</label>
          <textarea
            className="mt-1 w-full max-w-xl resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 outline-none focus:ring-2 focus:ring-indigo-200"
            rows={2}
            placeholder="One line under the team name on the public page"
            value={team.tagline ?? ""}
            onChange={(e) => setTeam((t) => ({ ...t, tagline: e.target.value }))}
          />
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Color theme</h2>
          <p className="mt-1 text-sm text-zinc-600">Pick a palette — you can fine-tune later.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  team.themeId === t.id ? "border-indigo-500 ring-2 ring-indigo-100" : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="flex gap-2">
                  <span
                    className="h-8 w-8 rounded-full border border-black/10 shadow-inner"
                    style={{ background: (t.cssVars as Record<string, string>)["--mts-primary"] }}
                  />
                  <span
                    className="h-8 w-8 rounded-full border border-black/10 shadow-inner"
                    style={{ background: (t.cssVars as Record<string, string>)["--mts-accent"] }}
                  />
                </div>
                <p className="mt-2 font-semibold">{t.label}</p>
                <p className="text-xs text-zinc-500">{t.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">What appears on the public page</h2>
          <p className="mt-1 text-sm text-zinc-600">Turn blocks on or off. On step 2 you will drag the order.</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {blocksSorted.map((block) => (
              <li key={block.id} className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5">
                <input
                  type="checkbox"
                  id={`blk-${block.id}`}
                  checked={block.enabled}
                  onChange={() => toggleBlock(block.id)}
                  className="h-5 w-5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={`blk-${block.id}`} className="flex-1 cursor-pointer text-sm font-medium text-zinc-900">
                  {ADMIN_BLOCK_LABELS[block.type]}
                </label>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

function StepIndicator({ current, teamId }: { current: 1 | 2; teamId: string }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm" aria-label="Editor steps">
      <span className={current === 1 ? "font-semibold text-indigo-700" : "text-zinc-500"}>1 · Basics</span>
      <span className="text-zinc-300">→</span>
      {current === 1 ? (
        <span className="text-zinc-400">2 · Layout & content</span>
      ) : (
        <Link href={`/admin/team/${teamId}/step-2`} className="font-semibold text-indigo-700">
          2 · Layout & content
        </Link>
      )}
    </nav>
  );
}
