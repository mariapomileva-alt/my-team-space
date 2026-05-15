"use client";

import { BlockModuleCard } from "@/components/builder/block-module-card";
import { saveTeamContent } from "@/app/admin/(protected)/team/[teamId]/server-actions";
import { builderSortBlocks } from "@/lib/blocks/meta";
import { saveTeamPreviewLocal } from "@/lib/preview-storage";
import { THEMES } from "@/lib/themes";
import type { BlockInstance, TeamSpace, ThemeId } from "@/lib/types";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const AUTOSAVE_MS = 2500;

export function TeamPageBuilder({
  teamId,
  initialTeam,
  publicUrl,
}: {
  teamId: string;
  initialTeam: TeamSpace;
  publicUrl: string;
}) {
  const router = useRouter();
  const [team, setTeam] = useState<TeamSpace>(initialTeam);
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const on = new Set(
      initialTeam.blocks.filter((b) => b.enabled).map((b) => b.id),
    );
    return on;
  });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const dirtyRef = useRef(false);
  const teamRef = useRef(team);
  teamRef.current = team;

  useEffect(() => {
    setTeam(initialTeam);
  }, [initialTeam]);

  const blocksSorted = useMemo(
    () => builderSortBlocks([...team.blocks].sort((a, b) => a.order - b.order)),
    [team.blocks],
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const patchTeam = useCallback((patch: Partial<TeamSpace>) => {
    dirtyRef.current = true;
    setTeam((prev) => ({ ...prev, ...patch }));
  }, []);

  const patchBlock = useCallback((id: string, patch: Partial<BlockInstance>) => {
    dirtyRef.current = true;
    setTeam((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));
  }, []);

  const persist = useCallback(async (silent: boolean) => {
    setSaveState("saving");
    if (!silent) setMsg(null);
    try {
      await saveTeamContent(teamId, teamRef.current);
      setLastSaved(new Date());
      setSaveState("saved");
      router.refresh();
    } catch (e) {
      setSaveState("error");
      if (!silent) setMsg(e instanceof Error ? e.message : "Save failed");
    }
  }, [teamId, router]);

  useEffect(() => {
    if (!dirtyRef.current) return;
    const t = window.setTimeout(() => {
      dirtyRef.current = false;
      void persist(true);
    }, AUTOSAVE_MS);
    return () => window.clearTimeout(t);
  }, [team, persist]);

  function setTheme(themeId: ThemeId) {
    const th = THEMES.find((t) => t.id === themeId);
    const vars = th?.cssVars as Record<string, string> | undefined;
    patchTeam({
      themeId,
      primaryColor: vars?.["--mts-primary"] ?? team.primaryColor,
      secondaryColor: vars?.["--mts-accent"] ?? team.secondaryColor,
    });
  }

  function toggleBlock(id: string) {
    const block = team.blocks.find((b) => b.id === id);
    if (!block) return;
    const next = !block.enabled;
    patchBlock(id, { enabled: next });
    setExpanded((prev) => {
      const s = new Set(prev);
      if (next) s.add(id);
      else s.delete(id);
      return s;
    });
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocksSorted.findIndex((b) => b.id === active.id);
    const newIndex = blocksSorted.findIndex((b) => b.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(blocksSorted, oldIndex, newIndex);
    dirtyRef.current = true;
    setTeam((prev) => ({
      ...prev,
      blocks: next.map((b, i) => ({ ...b, order: i })),
    }));
  }

  function publish() {
    startTransition(async () => {
      await persist(false);
      setMsg("Published! Families see your latest changes.");
    });
  }

  function previewAsParent() {
    saveTeamPreviewLocal(team);
    window.open(`/team/${team.slug}`, "_blank", "noopener,noreferrer");
  }

  const savedLabel =
    saveState === "saving"
      ? "Saving…"
      : lastSaved
        ? `Last saved ${lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        : "Draft — edits autosave";

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/40 via-zinc-50 to-white text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 px-4 py-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Page builder</p>
            <h1 className="truncate text-xl font-bold">{team.name}</h1>
            <p className="text-xs text-zinc-500">{savedLabel}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={publish}
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
            >
              {pending ? "Publishing…" : "Publish"}
            </button>
            <button
              type="button"
              onClick={previewAsParent}
              className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800"
            >
              Preview as parent
            </button>
            <Link
              href={`/team/${team.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700"
            >
              Open public page
            </Link>
            <Link href="/admin" className="rounded-full border border-zinc-200 px-3 py-2 text-sm font-semibold">
              Teams
            </Link>
          </div>
        </div>
        {msg ? <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-emerald-700">{msg}</p> : null}
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-8">
        <section className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold">Color theme</h2>
          <p className="mt-1 text-sm text-zinc-500">Blocks pick up these colors automatically.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`rounded-2xl border p-3 text-left text-xs transition ${
                  team.themeId === t.id ? "border-indigo-500 ring-2 ring-indigo-100" : "border-zinc-200"
                }`}
              >
                <div className="flex gap-1">
                  <span
                    className="h-6 w-6 rounded-full border border-black/10"
                    style={{ background: (t.cssVars as Record<string, string>)["--mts-primary"] }}
                  />
                  <span
                    className="h-6 w-6 rounded-full border border-black/10"
                    style={{ background: (t.cssVars as Record<string, string>)["--mts-accent"] }}
                  />
                </div>
                <span className="mt-2 block font-semibold">{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold">Your page blocks</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Turn a block on — it opens. Drag to reorder. Like LEGO, not a spreadsheet.
          </p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={blocksSorted.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <ul className="mt-4 space-y-3">
                {blocksSorted.map((block) => (
                  <BlockModuleCard
                    key={block.id}
                    block={block}
                    team={team}
                    expanded={expanded.has(block.id)}
                    onToggleExpand={() => toggleExpand(block.id)}
                    onToggleEnabled={() => toggleBlock(block.id)}
                    onPatchBlock={patchBlock}
                    onPatchTeam={patchTeam}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </section>
      </main>
    </div>
  );
}
