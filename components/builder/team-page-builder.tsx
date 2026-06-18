"use client";

import { TeamIdentityPanel } from "@/components/builder/team-identity-panel";
import { TeamDesignPanel } from "@/components/builder/team-design-panel";
import { PageBlocksPanel } from "@/components/builder/page-blocks-panel";
import { BuilderFullPreviewModal } from "@/components/builder/builder-full-preview-modal";
import { BuilderLivePreview } from "@/components/builder/builder-live-preview";
import { BuilderBillingStatus } from "@/components/builder/builder-billing-status";
import { BuilderEditAccessBanner } from "@/components/builder/builder-edit-access-banner";
import { BuilderMobileNav, type BuilderMobileTab } from "@/components/builder/builder-mobile-nav";
import { BuilderToolbar } from "@/components/builder/builder-toolbar";
import { PaymentsTrackerPanel } from "@/components/builder/payments-tracker-panel";
import { loadTeamForBuilder, saveTeamContent } from "@/app/admin/(protected)/team/[teamId]/server-actions";
import { STALE_TEAM_VERSION } from "@/lib/teams/save-version";
import {
  BUILDER_EDITOR_COLUMN,
  BUILDER_PAGE_SHELL,
  BUILDER_PREVIEW_CHROME,
  BUILDER_PREVIEW_COLUMN,
  BUILDER_WORKSPACE_GRID,
} from "@/lib/builder/layout";
import type { BuilderProgressTarget } from "@/components/builder/builder-progress";
import { BuilderSuggestionsCard } from "@/components/builder/builder-suggestions-card";
import { SetupProgressCenter } from "@/components/builder/setup-progress-center";
import { builderToolbarStatusLabel, getCompletionGuidance } from "@/lib/builder/page-completion";
import { applyBlockOrder, builderSortBlocks, partitionBlocksByEnabled } from "@/lib/blocks/meta";
import {
  readStoredPreviewMode,
  storePreviewMode,
  type BuilderPreviewMode,
} from "@/lib/builder/preview";
import { formatBuilderSaveLabel, humanizeSaveError } from "@/lib/builder/save-status";
import { clearTeamPreviewLocal, purgeStaleTeamPreview } from "@/lib/preview-storage";
import { publicTeamPath, siteOriginFromPublicTeamUrl } from "@/lib/teams/public-url";
import { shouldReplaceLocalWithServer } from "@/lib/teams/sync-policy";
import { magicInviteUrl } from "@/lib/team-access";
import { THEMES } from "@/lib/themes";
import type { BuilderBillingContext } from "@/lib/billing/builder-context-types";
import type { TeamMemberRole } from "@/lib/team-admin";
import type { BlockInstance, BlockType, TeamSpace, ThemeId } from "@/lib/types";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const AUTOSAVE_MS = 2500;
const PAGE_BLOCK_TYPES = new Set<BlockType>(["hero"]);

type WorkspaceSection = "header" | "sections" | "design" | "payments";

export function TeamPageBuilder({
  teamId,
  initialTeam,
  publicUrl,
  memberRole = "coach",
  billing = null,
  embedded = false,
}: {
  teamId: string;
  initialTeam: TeamSpace;
  publicUrl: string;
  memberRole?: TeamMemberRole;
  billing?: BuilderBillingContext | null;
  embedded?: boolean;
}) {
  /** One team on Single Team plan is always editable in the builder. */
  const canEdit =
    billing == null ? true : billing.canEdit || billing.teamsUsed <= 1;
  const editLocked = billing != null && !canEdit;
  const siteUrl = siteOriginFromPublicTeamUrl(publicUrl);
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const syncingRef = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);
  const designRef = useRef<HTMLDivElement>(null);
  const paymentsRef = useRef<HTMLDivElement>(null);
  const previewColumnRef = useRef<HTMLElement>(null);
  const [openSection, setOpenSection] = useState<WorkspaceSection | null>("header");
  const [mobileTab, setMobileTab] = useState<BuilderMobileTab>("edit");
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<BuilderPreviewMode>("mobile");

  useEffect(() => {
    setPreviewMode(readStoredPreviewMode());
  }, []);

  const applyServerTeam = useCallback((fresh: TeamSpace) => {
    dirtyRef.current = false;
    setTeam(fresh);
  }, []);

  useEffect(() => {
    if (dirtyRef.current) return;
    applyServerTeam(initialTeam);
  }, [initialTeam, applyServerTeam]);

  useEffect(() => {
    purgeStaleTeamPreview(initialTeam.slug, initialTeam.updatedAt);
    void (async () => {
      try {
        const fresh = await loadTeamForBuilder(teamId);
        purgeStaleTeamPreview(fresh.slug, fresh.updatedAt);
        applyServerTeam(fresh);
      } catch {
        applyServerTeam(initialTeam);
      }
    })();
    // Always pull cloud truth when opening the builder for this team.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per teamId
  }, [teamId]);

  const syncFromServer = useCallback(async () => {
    if (syncingRef.current) return;
    syncingRef.current = true;
    try {
      const fresh = await loadTeamForBuilder(teamId);
      const local = teamRef.current;
      const shouldReplace = shouldReplaceLocalWithServer(
        { updatedAt: local.updatedAt, dirty: dirtyRef.current },
        { updatedAt: fresh.updatedAt },
      );
      if (shouldReplace) {
        if (dirtyRef.current && fresh.updatedAt && local.updatedAt && fresh.updatedAt > local.updatedAt) {
          setMsg("Loaded the latest saved version from the cloud.");
        }
        purgeStaleTeamPreview(fresh.slug, fresh.updatedAt);
        applyServerTeam(fresh);
      }
    } catch {
      /* background sync — ignore */
    } finally {
      syncingRef.current = false;
    }
  }, [teamId, applyServerTeam]);

  useEffect(() => {
    function onFocus() {
      void syncFromServer();
    }
    function onVisible() {
      if (document.visibilityState === "visible") void syncFromServer();
    }
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [syncFromServer]);

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
  const pageBlocks = useMemo(() => {
    const filtered = orderedBlocks.filter((b) => !PAGE_BLOCK_TYPES.has(b.type));
    return partitionBlocksByEnabled(filtered);
  }, [orderedBlocks]);

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
      let payload = teamRef.current;
      if (!payload.updatedAt?.trim()) {
        const fresh = await loadTeamForBuilder(teamId);
        payload = { ...payload, updatedAt: fresh.updatedAt };
      }
      const { updatedAt } = await saveTeamContent(teamId, payload, options);
      dirtyRef.current = false;
      clearTeamPreviewLocal(teamRef.current.slug);
      setTeam((prev) => ({ ...prev, updatedAt }));
      setLastSaved(new Date());
      setSaveState("saved");
      setSaveError(null);
      if (!silent || options?.publish) {
        router.refresh();
      }
      return true;
    } catch (e) {
      const detail = e instanceof Error ? e.message : "Save failed";
      if (detail === STALE_TEAM_VERSION) {
        try {
          const fresh = await loadTeamForBuilder(teamId);
          applyServerTeam(fresh);
          setLastSaved(new Date());
          setSaveState("saved");
          setSaveError(null);
          setMsg(humanizeSaveError(STALE_TEAM_VERSION));
          router.refresh();
        } catch {
          setSaveState("error");
          setSaveError(humanizeSaveError(STALE_TEAM_VERSION));
        }
        return false;
      }
      dirtyRef.current = true;
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
    [teamId, router, canEdit, applyServerTeam],
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

    if (PAGE_BLOCK_TYPES.has(block.type)) {
      patchBlock(id, { enabled: next });
      return;
    }

    const updatedBlock = { ...block, enabled: next };
    const without = pageBlocks.filter((b) => b.id !== id);
    const reordered = partitionBlocksByEnabled([...without, updatedBlock]);

    dirtyRef.current = true;
    const hero = orderedBlocks.filter((b) => PAGE_BLOCK_TYPES.has(b.type));
    setTeam((prev) => ({
      ...prev,
      blocks: applyBlockOrder(
        prev.blocks.map((b) => (b.id === id ? { ...b, enabled: next } : b)),
        [...hero, ...reordered],
      ),
    }));
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
    const enabled = pageBlocks.filter((b) => b.enabled);
    const hidden = pageBlocks.filter((b) => !b.enabled);
    const i = enabled.findIndex((b) => b.id === id);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= enabled.length) return;
    setBlocksOrder([...arrayMove(enabled, i, j), ...hidden]);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const enabled = pageBlocks.filter((b) => b.enabled);
    const hidden = pageBlocks.filter((b) => !b.enabled);
    const oldIndex = enabled.findIndex((b) => b.id === active.id);
    const newIndex = enabled.findIndex((b) => b.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    setBlocksOrder([...arrayMove(enabled, oldIndex, newIndex), ...hidden]);
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
    window.open(publicTeamPath(team.slug), "_blank", "noopener,noreferrer");
  }

  const autosaveLabel = useMemo(
    () => formatBuilderSaveLabel(saveState, lastSaved),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- saveTick refreshes relative time
    [saveState, lastSaved, saveTick],
  );

  const toolbarStatusLabel = useMemo(
    () =>
      builderToolbarStatusLabel(team, {
        editLocked,
        billing,
        autosaveLabel,
      }),
    [team, editLocked, billing, autosaveLabel],
  );

  function scrollTo(el: HTMLElement | null) {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const setWorkspaceExpanded = useCallback((section: WorkspaceSection, open: boolean) => {
    if (open) setOpenSection(section);
    else setOpenSection((cur) => (cur === section ? null : cur));
  }, []);

  function focusWorkspaceSection(section: WorkspaceSection) {
    setOpenSection(section);
    const ref =
      section === "header"
        ? identityRef
        : section === "sections"
          ? blocksRef
          : section === "design"
            ? designRef
            : paymentsRef;
    scrollTo(ref.current);
  }

  useEffect(() => {
    const focus = searchParams.get("focus");
    if (!focus) return;
    if (focus === "settings") {
      router.replace(`/admin/team/${teamId}/settings`);
      return;
    }
    const map: Record<string, WorkspaceSection> = {
      header: "header",
      sections: "sections",
      design: "design",
      payments: "payments",
    };
    const section = map[focus];
    if (!section) return;
    const id = window.setTimeout(() => focusWorkspaceSection(section), 150);
    return () => window.clearTimeout(id);
    // Deep-link from dashboard quick actions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, teamId, router]);

  function changePreviewMode(next: BuilderPreviewMode) {
    setPreviewMode(next);
    storePreviewMode(next);
  }

  function closeFullPreview() {
    setFullPreviewOpen(false);
    setMobileTab((cur) => (cur === "preview" ? "edit" : cur));
  }

  function onMobileTab(tab: BuilderMobileTab) {
    if (tab === "preview") {
      setMobileTab("preview");
      setFullPreviewOpen(true);
      return;
    }

    setFullPreviewOpen(false);
    setMobileTab(tab);

    if (tab === "edit") {
      focusWorkspaceSection("header");
      return;
    }
    if (tab === "sections") {
      focusWorkspaceSection("sections");
      return;
    }
    if (tab === "publish") {
      if (memberRole !== "coach") {
        setMsg("Only the team owner can publish.");
        scrollTo(topRef.current);
        return;
      }
      if (editLocked) {
        setMsg("Update billing in the dashboard to publish your team page.");
        scrollTo(topRef.current);
        return;
      }
      publish();
      scrollTo(topRef.current);
    }
  }

  function jumpTo(target: BuilderProgressTarget) {
    if (target === "identity" || target === "cover" || target === "social") {
      focusWorkspaceSection("header");
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
    setOpenSection("sections");
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

  const shellClass = embedded ? "w-full max-w-none px-0" : BUILDER_PAGE_SHELL;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={embedded ? "builder-page text-zinc-900" : "builder-page min-h-screen scroll-smooth bg-[#f7f7f8] text-zinc-900"}
    >
      {!embedded ? (
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_90%_60%_at_50%_-30%,rgba(139,92,246,0.06),transparent)]" />
      ) : null}

      <div ref={topRef} className={`${shellClass} scroll-mt-4 ${embedded ? "pt-0" : "pt-4"}`}>
        {memberRole === "assistant" ? (
          <p className="mb-3 rounded-xl border border-violet-200/60 bg-violet-50/40 px-3 py-2 text-[11px] text-violet-950">
            You&apos;re editing as a <strong>page admin</strong>. Changes save automatically. Only the team owner can
            publish.
          </p>
        ) : null}
        {billing && memberRole === "coach" ? (
          <BuilderEditAccessBanner teamId={teamId} billing={billing} />
        ) : null}
        <BuilderToolbar
          team={team}
          saveLabel={toolbarStatusLabel}
          saveState={editLocked ? "idle" : saveState}
          saveError={saveError}
          pending={pending}
          publicUrl={publicUrl}
          parentShareUrl={parentShareUrl}
          shareHint={shareHint}
          progress={<SetupProgressCenter team={team} onJump={jumpTo} />}
          billingStatus={billing ? <BuilderBillingStatus billing={billing} /> : null}
          editLocked={editLocked}
          canPublish={memberRole === "coach"}
          onPublish={publish}
          onPreview={() => {
            if (typeof window !== "undefined" && window.innerWidth < 1280) {
              setFullPreviewOpen(true);
              return;
            }
            previewAsParent();
          }}
        />
      </div>

      {msg ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${shellClass} mb-2 text-center text-xs font-medium text-emerald-700`}
        >
          {msg}
        </motion.p>
      ) : null}

      <div className={`${shellClass} ${embedded ? "pb-24 pt-2" : "pb-24 pt-1"} lg:pb-10`}>
        <div className={BUILDER_WORKSPACE_GRID}>
          <div
            className={`${BUILDER_EDITOR_COLUMN}${editLocked ? " pointer-events-none select-none opacity-[0.72]" : ""}`}
            aria-disabled={editLocked}
          >
            <div ref={identityRef} id="builder-team-identity" className="scroll-mt-6">
              <TeamIdentityPanel
                team={team}
                heroBlock={heroBlock}
                onPatchTeam={patchTeam}
                onPatchBlock={patchBlock}
                expanded={openSection === "header"}
                onExpandedChange={(open) => setWorkspaceExpanded("header", open)}
              />
            </div>

            <BuilderSuggestionsCard team={team} onJump={jumpTo} />

            <div ref={blocksRef} id="builder-page-blocks" className="scroll-mt-6">
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
                workspaceExpanded={openSection === "sections"}
                onWorkspaceExpandedChange={(open) => setWorkspaceExpanded("sections", open)}
              />
            </div>

            <div ref={designRef} id="builder-design" className="scroll-mt-6">
              <TeamDesignPanel
                team={team}
                onSelectTheme={setTheme}
                expanded={openSection === "design"}
                onExpandedChange={(open) => setWorkspaceExpanded("design", open)}
              />
            </div>

            <div ref={paymentsRef} id="builder-payments" className="scroll-mt-6">
              <PaymentsTrackerPanel
                team={team}
                onPatchTeam={patchTeam}
                expanded={openSection === "payments"}
                onExpandedChange={(open) => setWorkspaceExpanded("payments", open)}
              />
            </div>
          </div>

          <aside ref={previewColumnRef} className={BUILDER_PREVIEW_COLUMN}>
            <div className={BUILDER_PREVIEW_CHROME}>
              <div className="mb-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600/80">
                    Live preview
                  </p>
                  <span className="rounded-full bg-emerald-50/80 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-100/80">
                    Visible to visitors
                  </span>
                </div>
                <p className="mt-1.5 text-[12px] leading-snug text-zinc-500">
                  This is exactly what parents and athletes will see.
                </p>
              </div>
              <BuilderLivePreview
                team={team}
                focusBlockId={focusBlockId}
                onOpenInTab={previewAsParent}
                fullPreviewOpen={fullPreviewOpen}
                onFullPreviewOpenChange={setFullPreviewOpen}
                hideFullPreviewModal
                previewMode={previewMode}
                onPreviewModeChange={changePreviewMode}
              />
            </div>
          </aside>
        </div>
      </div>

      <BuilderFullPreviewModal
        open={fullPreviewOpen}
        onClose={closeFullPreview}
        team={team}
        mode={previewMode}
        onModeChange={changePreviewMode}
        focusBlockId={focusBlockId}
        onOpenInTab={previewAsParent}
      />

      {!embedded ? (
        <BuilderMobileNav
          active={mobileTab}
          onTab={onMobileTab}
          publishDisabled={pending || memberRole !== "coach"}
          publishLocked={editLocked}
        />
      ) : null}
    </motion.div>
  );
}
