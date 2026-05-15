"use client";

import { BlockModuleCard } from "@/components/builder/block-module-card";
import { BuilderLivePreview } from "@/components/builder/builder-live-preview";
import { PaymentsTrackerPanel } from "@/components/builder/payments-tracker-panel";
import { PrivacyAccessPanel } from "@/components/builder/privacy-access-panel";
import { saveTeamContent } from "@/app/admin/(protected)/team/[teamId]/server-actions";
import {
  BUILDER_SECTION_LABELS,
  BUILDER_SECTION_ORDER,
  groupBlocksBySection,
} from "@/lib/blocks/meta";
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
  const siteUrl = publicUrl.replace(/\/team\/[^/]+$/, "");
  const router = useRouter();
  const [team, setTeam] = useState<TeamSpace>(initialTeam);
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    return new Set(initialTeam.blocks.filter((b) => b.enabled).map((b) => b.id));
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

  const sectionGroups = useMemo(() => groupBlocksBySection(team.blocks), [team.blocks]);
  const allPublicBlocks = useMemo(
    () => BUILDER_SECTION_ORDER.flatMap((s) => sectionGroups[s]),
    [sectionGroups],
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
    const oldIndex = allPublicBlocks.findIndex((b) => b.id === active.id);
    const newIndex = allPublicBlocks.findIndex((b) => b.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(allPublicBlocks, oldIndex, newIndex);
    const orderMap = new Map(next.map((b, i) => [b.id, i]));
    dirtyRef.current = true;
    setTeam((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => ({
        ...b,
        order: orderMap.has(b.id) ? orderMap.get(b.id)! : b.order,
      })),
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
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
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
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700"
            >
              Open page
            </Link>
          </div>
        </div>
        {msg ? <p className="mx-auto mt-2 max-w-6xl text-center text-xs text-emerald-700">{msg}</p> : null}
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_340px] sm:px-8">
        <main className="min-w-0 space-y-8">
          <section className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold">Color theme</h2>
            <p className="mt-1 text-sm text-zinc-500">Soft team colors — Apple-simple.</p>
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

          <PrivacyAccessPanel team={team} siteUrl={siteUrl} onPatchTeam={patchTeam} />

          <PaymentsTrackerPanel team={team} onPatchTeam={patchTeam} />

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={allPublicBlocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              {BUILDER_SECTION_ORDER.map((section) => {
                const blocks = sectionGroups[section];
                if (!blocks.length) return null;
                const meta = BUILDER_SECTION_LABELS[section];
                return (
                  <section key={section}>
                    <h2 className="text-base font-bold">{meta.title}</h2>
                    <p className="mt-1 text-sm text-zinc-500">{meta.hint}</p>
                    <ul className="mt-4 space-y-3">
                      {blocks.map((block) => (
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
                  </section>
                );
              })}
            </SortableContext>
          </DndContext>
        </main>

        <aside className="hidden lg:block">
          <BuilderLivePreview team={team} />
        </aside>
      </div>
    </div>
  );
}
