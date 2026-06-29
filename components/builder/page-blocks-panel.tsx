"use client";

import { BuilderSectionIcon } from "@/components/builder/builder-section-icon";
import { BlockModuleCard } from "@/components/builder/block-module-card";
import { BuilderCollapsiblePanel } from "@/components/builder/builder-collapsible-panel";
import { BuilderHiddenArchive } from "@/components/builder/builder-hidden-archive";
import { builderBlockDisplayLabel } from "@/lib/builder/display-labels";
import { BUILDER_PANEL_SURFACE } from "@/lib/builder/layout";
import { structureNavIdForBlockType, type PageStructureNavId } from "@/lib/builder/page-structure";
import { BLOCK_META } from "@/lib/blocks/meta";
import type { BlockInstance, BlockType, TeamSpace } from "@/lib/types";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const QUICK_ADD_TYPES: BlockType[] = ["gallery", "schedule", "results", "contacts"];

type Props = {
  blocks: BlockInstance[];
  team: TeamSpace;
  expanded: Set<string>;
  onToggleExpand: (id: string) => void;
  onToggleEnabled: (id: string) => void;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
  onPatchTeam: (patch: Partial<TeamSpace>) => void;
  onPreviewBlock?: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onQuickAdd: (type: BlockType) => void;
  workspaceExpanded?: boolean;
  onWorkspaceExpandedChange?: (expanded: boolean) => void;
  embedded?: boolean;
  /** Sidebar mode: drag + toggle only; tap opens section in the left nav */
  reorderOnly?: boolean;
  onOpenSection?: (id: PageStructureNavId) => void;
};

export function PageBlocksPanel({
  blocks,
  team,
  expanded,
  onToggleExpand,
  onToggleEnabled,
  onPatchBlock,
  onPatchTeam,
  onPreviewBlock,
  onMoveUp,
  onMoveDown,
  onDragEnd,
  onQuickAdd,
  workspaceExpanded,
  onWorkspaceExpandedChange,
  embedded = false,
  reorderOnly = false,
  onOpenSection,
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const prevHiddenCount = useRef(0);

  const enabledBlocks = blocks.filter((b) => b.enabled);
  const hiddenBlocks = blocks.filter((b) => !b.enabled);

  useEffect(() => {
    if (hiddenBlocks.length > prevHiddenCount.current) setArchiveOpen(true);
    prevHiddenCount.current = hiddenBlocks.length;
  }, [hiddenBlocks.length]);
  const activeBlock = activeId ? enabledBlocks.find((b) => b.id === activeId) : undefined;

  const summaryLabel =
    enabledBlocks.length === 0
      ? "No blocks enabled yet"
      : enabledBlocks.length === 1
        ? "1 block enabled"
        : `${enabledBlocks.length} blocks enabled`;

  return (
    <BuilderCollapsiblePanel
      className={BUILDER_PANEL_SURFACE}
      expanded={workspaceExpanded}
      onExpandedChange={onWorkspaceExpandedChange}
      title={embedded ? "Reorder sections" : "Sections"}
      description={
        embedded
          ? "Drag to change order, or turn sections off to hide them from your public page. Tap a row to edit that section."
          : "Manage page blocks."
      }
      summary={
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-800">
          {summaryLabel}
        </span>
      }
      defaultExpanded={workspaceExpanded === undefined ? false : undefined}
    >
      {enabledBlocks.length === 0 ? (
        <div className="mb-5 rounded-2xl border border-dashed border-violet-200 bg-gradient-to-br from-violet-50/80 to-indigo-50/40 px-5 py-8 text-center">
          <p className="text-base font-bold text-zinc-900">Pick your first sections</p>
          <p className="mt-1 text-sm text-zinc-500">Like Lego blocks — tap to add, preview updates instantly.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {QUICK_ADD_TYPES.map((type) => {
              const meta = BLOCK_META[type];
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onQuickAdd(type)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm font-semibold text-violet-900 shadow-sm transition hover:border-violet-300 hover:shadow-md active:scale-[0.98]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-800" aria-hidden>
                    <BuilderSectionIcon blockType={type} size="md" />
                  </span>
                  {meta.title}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        !reorderOnly ? (
        <>
          <nav className="mb-4 flex flex-wrap gap-1.5" aria-label="Jump to page section">
            {enabledBlocks.map((block) => (
              <button
                key={`nav-${block.id}`}
                type="button"
                onClick={() => {
                  if (!expanded.has(block.id)) onToggleExpand(block.id);
                  window.setTimeout(() => {
                    document
                      .querySelector(`[data-builder-block-id="${block.id}"]`)
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, expanded.has(block.id) ? 0 : 120);
                }}
                className="rounded-full border border-violet-200/80 bg-white px-2.5 py-1 text-[11px] font-semibold text-violet-900 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
              >
                {builderBlockDisplayLabel(block.type)}
              </button>
            ))}
          </nav>
          <p className="mb-3 text-[11px] text-zinc-500">
            Drag to reorder · tap a card to edit · turn off to move a section to the archive below.
          </p>
        </>
        ) : (
          <p className="mb-3 text-[11px] text-zinc-500">
            Drag to reorder · tap a row to open that section · turn off to hide from your public page.
          </p>
        )
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => setActiveId(String(e.active.id))}
        onDragEnd={(e) => {
          setActiveId(null);
          onDragEnd(e);
        }}
        onDragCancel={() => setActiveId(null)}
      >
        <SortableContext items={enabledBlocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <LayoutGroup>
            <ul className="flex w-full min-w-0 flex-col gap-3">
              <AnimatePresence initial={false} mode="popLayout">
                {enabledBlocks.map((block, index) => (
                  <BlockModuleCard
                    key={block.id}
                    block={block}
                    team={team}
                    position={index + 1}
                    expanded={reorderOnly ? false : expanded.has(block.id)}
                    canMoveUp={index > 0}
                    canMoveDown={index < enabledBlocks.length - 1}
                    onMoveUp={() => onMoveUp(block.id)}
                    onMoveDown={() => onMoveDown(block.id)}
                    onToggleExpand={() => {
                      if (reorderOnly && onOpenSection) {
                        const navId = structureNavIdForBlockType(block.type);
                        if (navId) onOpenSection(navId);
                        return;
                      }
                      onToggleExpand(block.id);
                    }}
                    onToggleEnabled={() => onToggleEnabled(block.id)}
                    onPatchBlock={onPatchBlock}
                    onPatchTeam={onPatchTeam}
                    onPreviewBlock={onPreviewBlock}
                    isDraggingOverlay={false}
                    legoLayout
                    reorderOnly={reorderOnly}
                  />
                ))}
              </AnimatePresence>
            </ul>
          </LayoutGroup>
        </SortableContext>

        <DragOverlay dropAnimation={{ duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}>
          {activeBlock ? (
            <div className="rotate-[1deg] scale-[1.01] opacity-95 shadow-2xl">
              <BlockModuleCard
                block={activeBlock}
                team={team}
                expanded={false}
                onToggleExpand={() => {}}
                onToggleEnabled={() => {}}
                onPatchBlock={() => {}}
                onPatchTeam={() => {}}
                legoLayout
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <BuilderHiddenArchive
        count={hiddenBlocks.length}
        open={archiveOpen}
        onToggle={() => setArchiveOpen((v) => !v)}
        hint="These sections are not on your public page. Turn one on to add it back."
      >
        <LayoutGroup>
          <ul className="flex w-full min-w-0 flex-col gap-2">
            <AnimatePresence initial={false} mode="popLayout">
              {hiddenBlocks.map((block) => (
                <BlockModuleCard
                  key={block.id}
                  block={block}
                  team={team}
                  expanded={false}
                  archived
                  onToggleExpand={() => onToggleExpand(block.id)}
                  onToggleEnabled={() => onToggleEnabled(block.id)}
                  onPatchBlock={onPatchBlock}
                  onPatchTeam={onPatchTeam}
                  onPreviewBlock={onPreviewBlock}
                  isDraggingOverlay={false}
                  legoLayout
                />
              ))}
            </AnimatePresence>
          </ul>
        </LayoutGroup>
      </BuilderHiddenArchive>
    </BuilderCollapsiblePanel>
  );
}
