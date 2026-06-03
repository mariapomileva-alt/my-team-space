"use client";

import { AdvancedSettingsPanel } from "@/components/builder/advanced-settings-panel";
import { TeamIdentityPanel } from "@/components/builder/team-identity-panel";
import { PageBlocksPanel } from "@/components/builder/page-blocks-panel";
import { BuilderLivePreview } from "@/components/builder/builder-live-preview";
import { BuilderBillingStatus } from "@/components/builder/builder-billing-status";
import { BuilderToolbar } from "@/components/builder/builder-toolbar";
import { PaymentsTrackerPanel } from "@/components/builder/payments-tracker-panel";
import { saveTeamContent } from "@/app/admin/(protected)/team/[teamId]/server-actions";
import {
  BUILDER_EDITOR_COLUMN,
  BUILDER_PAGE_SHELL,
  BUILDER_PREVIEW_COLUMN,
  BUILDER_WORKSPACE_GRID,
} from "@/lib/builder/layout";
import { BuilderProgress, type BuilderProgressTarget } from "@/components/builder/builder-progress";
import { getCompletionGuidance } from "@/lib/builder/page-completion";
import { applyBlockOrder, builderSortBlocks } from "@/lib/blocks/meta";
import { formatBuilderSaveLabel, humanizeSaveError } from "@/lib/builder/save-status";
import { saveTeamPreviewLocal } from "@/lib/preview-storage";
import { magicInviteUrl } from "@/lib/team-access";
import { THEMES } from "@/lib/themes";
import type { BuilderBillingContext } from "@/lib/billing/builder-context";
import type { TeamMemberRole } from "@/lib/team-admin";
import type { BlockInstance, BlockType, TeamSpace, ThemeId } from "@/lib/types";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const AUTOSAVE_MS = 2500;
const PAGE_BLOCK_TYPES = new Set<BlockType>(["hero"]);

export function TeamPageBuilder({
  teamId,
  initialTeam,
  publicUrl,
  memberRole = "coach",
  billing = null,
}: {
  teamId: string;
  initialTeam: TeamSpace;
  publicUrl: string;
  memberRole?: TeamMemberRole;
  billing?: BuilderBillingContext | null;
}) {
  const canEdit = billing?.canEdit ?? true;
  const editLocked = Boolean(billing && !billing.canEdit);
  const siteUrl = publicUrl.replace(/\/team\/[^/]+$/, "");
  const router = useRouter();
  const [team, setTeam] = useState<TeamSpace>(initialTeam);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveTick, setSaveTick] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [focusBlockId, setFocusBlockId] = useState<string | null>(null);
  const dirtyRef = useRef(false);
  const teamRef = useRef(team);
  teamRef.current = team;
  const identityRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dirtyRef.current) return;
    setTeam(initialTeam);
  }, [initialTeam]);

  useEffect(() => {
    const id = window.setInterval(() => setSaveTick((t) => t + 1), 8000);
    return () => window.clearInterval(id);
  }, []);

  const heroBlock = useMemo(() => team.blocks.find((b) => b.type === "hero"), [team.blocks]);

  const parentShareUrl = useMemo(() => {
    const visibility = team.pageVisibility ?? "public";
    if (visibility !== "public" && team.inviteToken) {
      return magicInviteUrl(siteUrl, team.slug, team.inviteToken);
    }
    return publicUrl;
  }, [team.pageVisibility, team.inviteToken, team.slug, siteUrl, publicUrl]);

  const shareHint = useMemo(() => {
    const visibility = team.pageVisibility ?? "public";
    if (visibility === "public") return undefined;
    if (team.inviteToken) {
      return "Private team — this magic invite link opens the page without typing a code.";
    }
    return "Private team — generate a magic link under Advanced settings, or parents can use your team code.";
  }, [team.pageVisibility, team.inviteToken]);

  const orderedBlocks = useMemo(() => builderSortBlocks(team.blocks), [team.blocks]);
  const pageBlocks = useMemo(
    () => orderedBlocks.filter((b) => !PAGE_BLOCK_TYPES.has(b.type)),
    [orderedBlocks],
  );

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

  const persist = useCallback(
    async (silent: boolean, options?: { publish?: boolean }): Promise<boolean> => {
    if (!canEdit) {
      if (!silent) {
        setSaveState("error");
        setSaveError(
          "Editing is locked. Update billing or choose your active team in the dashboard.",
        );
      }
      return false;
    }
    setSaveState("saving");
    if (!silent) setMsg(null);
    try {
      await saveTeamContent(teamId, teamRef.current, options);
      dirtyRef.current = false;
      setLastSaved(new Date());
      setSaveState("saved");
      setSaveError(null);
      router.refresh();
      return true;
    } catch (e) {
      dirtyRef.current = true;
      const detail = e instanceof Error ? e.message : "Save failed";
      setSaveState("error");
      setSaveError(humanizeSaveError(detail));
      if (silent) {
        setMsg(null);
      } else {
        setMsg(detail);
      }
      return false;
    }
    },
    [teamId, router, canEdit],
  );

  useEffect(() => {
    if (!canEdit || !dirtyRef.current) return;
    const t = window.setTimeout(() => {
      void persist(true);
    }, AUTOSAVE_MS);
    return () => window.clearTimeout(t);
  }, [team, persist, canEdit]);

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
    if (!next) {
      setExpanded((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
      setFocusBlockId((cur) => (cur === id ? null : cur));
    } else {
      setFocusBlockId(id);
    }
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

  function quickAddBlock(type: BlockType) {
    const block = team.blocks.find((b) => b.type === type);
    if (!block) return;
    patchBlock(block.id, { enabled: true });
    setExpanded((prev) => new Set(prev).add(block.id));
    setFocusBlockId(block.id);
  }

  function setBlocksOrder(nextOrdered: BlockInstance[]) {
    dirtyRef.current = true;
    const hero = orderedBlocks.filter((b) => PAGE_BLOCK_TYPES.has(b.type));
    const merged = [...hero, ...nextOrdered];
    setTeam((prev) => ({
      ...prev,
      blocks: applyBlockOrder(prev.blocks, merged),
    }));
  }

  function moveBlock(id: string, dir: -1 | 1) {
    const i = pageBlocks.findIndex((b) => b.id === id);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= pageBlocks.length) return;
    setBlocksOrder(arrayMove(pageBlocks, i, j));
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = pageBlocks.findIndex((b) => b.id === active.id);
    const newIndex = pageBlocks.findIndex((b) => b.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    setBlocksOrder(arrayMove(pageBlocks, oldIndex, newIndex));
  }

  function publish() {
    startTransition(async () => {
      const guidance = getCompletionGuidance(teamRef.current);
      const ok = await persist(false, { publish: true });
      if (ok) {
        if (guidance.isFullyReady) {
          setMsg("Published! Your team page is fully ready — families can see it now.");
        } else if (!guidance.canPublish) {
          setMsg("Published — add your team name and logo when you can so parents recognize you.");
        } else {
          setMsg("Published! Families see your latest changes.");
        }
      }
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

  function scrollTo(el: HTMLElement | null) {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function jumpTo(target: BuilderProgressTarget) {
    if (target === "identity" || target === "cover" || target === "social") {
      scrollTo(identityRef.current);
      return;
    }

    const typeToBlock: Partial<Record<BuilderProgressTarget, BlockType[]>> = {
      schedule: ["schedule", "calendar"],
      contacts: ["contacts"],
      gallery: ["gallery"],
      results: ["results"],
    };
    const types = typeToBlock[target] ?? [];
    const block = teamRef.current.blocks.find((b) => types.includes(b.type));
    if (!block) {
      scrollTo(blocksRef.current);
      return;
    }
    setExpanded((prev) => new Set(prev).add(block.id));
    setFocusBlockId(block.id);
    scrollTo(
      document.querySelector(`[data-builder-block-id="${block.id}"]`) as HTMLElement | null,
    );
  }

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
          saveLabel={editLocked ? "Editing locked — changes won't save" : savedLabel}
          saveState={editLocked ? "idle" : saveState}
          saveError={saveError}
          pending={pending}
          publicUrl={publicUrl}
          parentShareUrl={parentShareUrl}
          shareHint={shareHint}
          progress={<BuilderProgress team={team} onJump={jumpTo} />}
          billingStatus={billing ? <BuilderBillingStatus billing={billing} /> : null}
          editLocked={editLocked}
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

      <div className={`${BUILDER_PAGE_SHELL} pb-4 lg:hidden`}>
        <BuilderLivePreview team={team} focusBlockId={focusBlockId} onOpenInTab={previewAsParent} />
      </div>

      <div className={`${BUILDER_PAGE_SHELL} pb-16 pt-1`}>
        <main className="min-w-0">
          <div className={BUILDER_WORKSPACE_GRID}>
            <div
              className={`${BUILDER_EDITOR_COLUMN}${editLocked ? " pointer-events-none select-none opacity-[0.72]" : ""}`}
              aria-disabled={editLocked}
            >
              <div ref={identityRef} id="builder-team-identity" className="scroll-mt-28">
                <TeamIdentityPanel
                  team={team}
                  heroBlock={heroBlock}
                  onPatchTeam={patchTeam}
                  onPatchBlock={patchBlock}
                  onSelectTheme={setTheme}
                />
              </div>

              <div ref={blocksRef} id="builder-page-blocks" className="scroll-mt-28">
                <PageBlocksPanel
                  blocks={pageBlocks}
                  team={team}
                  expanded={expanded}
                  onToggleExpand={toggleExpand}
                  onToggleEnabled={toggleBlock}
                  onPatchBlock={patchBlock}
                  onPatchTeam={patchTeam}
                  onPreviewBlock={setFocusBlockId}
                  onMoveUp={(id) => moveBlock(id, -1)}
                  onMoveDown={(id) => moveBlock(id, 1)}
                  onDragEnd={onDragEnd}
                  onQuickAdd={quickAddBlock}
                />
              </div>

              <AdvancedSettingsPanel
                team={team}
                teamId={teamId}
                siteUrl={siteUrl}
                memberRole={memberRole}
                onPatchTeam={patchTeam}
              />

              <PaymentsTrackerPanel team={team} onPatchTeam={patchTeam} />
            </div>

            <aside className={BUILDER_PREVIEW_COLUMN}>
              <div className="rounded-2xl border border-zinc-200/70 bg-zinc-50/50 p-3 shadow-sm backdrop-blur-sm">
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Preview</p>
                <BuilderLivePreview team={team} focusBlockId={focusBlockId} onOpenInTab={previewAsParent} />
              </div>
            </aside>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
