"use client";

import { BlockModuleCard } from "@/components/builder/block-module-card";
import { BuilderLivePreview } from "@/components/builder/builder-live-preview";
import { BuilderSectionPanel } from "@/components/builder/builder-section-panel";
import { BuilderToolbar } from "@/components/builder/builder-toolbar";
import { PaymentsTrackerPanel } from "@/components/builder/payments-tracker-panel";
import { PrivacyAccessPanel } from "@/components/builder/privacy-access-panel";
import { saveTeamContent } from "@/app/admin/(protected)/team/[teamId]/server-actions";
import {
  BUILDER_EDITOR_COLUMN,
  BUILDER_PAGE_SHELL,
  BUILDER_PANEL_DESC,
  BUILDER_PANEL_SURFACE,
  BUILDER_PANEL_TITLE,
  BUILDER_PREVIEW_COLUMN,
  BUILDER_WORKSPACE_GRID,
  builderChoiceClass,
} from "@/lib/builder/layout";
import {
  BUILDER_SECTION_ORDER,
  groupBlocksBySection,
} from "@/lib/blocks/meta";
import { formatBuilderSaveLabel } from "@/lib/builder/save-status";
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
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
  const [saveTick, setSaveTick] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [focusBlockId, setFocusBlockId] = useState<string | null>(null);
  const dirtyRef = useRef(false);
  const teamRef = useRef(team);
  teamRef.current = team;

  useEffect(() => {
    setTeam(initialTeam);
  }, [initialTeam]);

  useEffect(() => {
    const id = window.setInterval(() => setSaveTick((t) => t + 1), 8000);
    return () => window.clearInterval(id);
  }, []);

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
      if (s.has(id)) {
        s.delete(id);
        setFocusBlockId((cur) => (cur === id ? null : cur));
      } else {
        s.add(id);
        setFocusBlockId(id);
      }
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

  const savedLabel = useMemo(
    () => formatBuilderSaveLabel(saveState, lastSaved),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- saveTick refreshes relative time
    [saveState, lastSaved, saveTick],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen scroll-smooth bg-gradient-to-b from-violet-50/30 via-zinc-50/80 to-white text-zinc-900"
    >
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.08),transparent)]" />

      <div className={`${BUILDER_PAGE_SHELL} pt-4`}>
        <BuilderToolbar
          teamName={team.name}
          saveLabel={savedLabel}
          saveState={saveState}
          pending={pending}
          publicUrl={publicUrl}
          onPublish={publish}
          onPreview={previewAsParent}
        />
      </div>

      {msg ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${BUILDER_PAGE_SHELL} mb-2 text-center text-xs font-medium text-emerald-700`}
        >
          {msg}
        </motion.p>
      ) : null}

      <div className={`${BUILDER_PAGE_SHELL} flex justify-center pb-4 lg:hidden`}>
        <BuilderLivePreview team={team} focusBlockId={focusBlockId} />
      </div>

      <div className={`${BUILDER_PAGE_SHELL} pb-16 pt-2`}>
        <main className="min-w-0">
          <div className={BUILDER_WORKSPACE_GRID}>
            <div className={BUILDER_EDITOR_COLUMN}>
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={BUILDER_PANEL_SURFACE}
              >
                <h2 className={BUILDER_PANEL_TITLE}>Team colors</h2>
                <p className={BUILDER_PANEL_DESC}>Pick a palette — your app updates instantly.</p>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={builderChoiceClass(team.themeId === t.id, "text-xs")}
                    >
                      <div className="flex gap-1.5">
                        <span
                          className="h-7 w-7 rounded-full border border-black/5 shadow-sm"
                          style={{ background: (t.cssVars as Record<string, string>)["--mts-primary"] }}
                        />
                        <span
                          className="h-7 w-7 rounded-full border border-black/5 shadow-sm"
                          style={{ background: (t.cssVars as Record<string, string>)["--mts-accent"] }}
                        />
                      </div>
                      <span className="mt-2.5 block font-bold text-zinc-800">{t.label}</span>
                    </button>
                  ))}
                </div>
              </motion.section>

              <PrivacyAccessPanel team={team} siteUrl={siteUrl} onPatchTeam={patchTeam} />
              <PaymentsTrackerPanel team={team} onPatchTeam={patchTeam} />

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={allPublicBlocks.map((b) => b.id)} strategy={rectSortingStrategy}>
                  <motion.div layout className="space-y-12">
                    {BUILDER_SECTION_ORDER.map((section) => {
                      const blocks = sectionGroups[section];
                      if (!blocks.length) return null;
                      return (
                        <BuilderSectionPanel key={section} section={section} blockCount={blocks.length}>
                          <ul className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
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
                        </BuilderSectionPanel>
                      );
                    })}
                  </motion.div>
                </SortableContext>
              </DndContext>
            </div>

            <aside className={BUILDER_PREVIEW_COLUMN}>
              <BuilderLivePreview team={team} focusBlockId={focusBlockId} />
            </aside>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
