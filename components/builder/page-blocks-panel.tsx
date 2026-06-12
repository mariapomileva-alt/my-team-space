"use client";

import { BlockModuleCard } from "@/components/builder/block-module-card";
import { BuilderCollapsiblePanel } from "@/components/builder/builder-collapsible-panel";
import { builderBlockDisplayLabel } from "@/lib/builder/display-labels";
import { BUILDER_PANEL_SURFACE } from "@/lib/builder/layout";
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
import { useState } from "react";

const QUICK_ADD_TYPES: BlockType[] = ["gallery", "calendar", "results", "contacts"];

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
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const [activeId, setActiveId] = useState<string | null>(null);
  const enabledCount = blocks.filter((b) => b.enabled).length;
  const activeBlock = activeId ? blocks.find((b) => b.id === activeId) : undefined;

  const summaryLabel =
    enabledCount === 0
      ? "No sections yet"
      : enabledCount === 1
        ? "1 section on your page"
        : `${enabledCount} sections on your page`;

  return (
    <BuilderCollapsiblePanel
      className={BUILDER_PANEL_SURFACE}
      title="Page sections"
      description="Turn sections on, drag to reorder, and tap a card to edit content."
      summary={
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-800">
          {summaryLabel}
        </span>
      }
      defaultExpanded
    >
      {enabledCount === 0 ? (
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
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-lg" aria-hidden>
                    {meta.emoji}
                  </span>
                  {meta.title}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <nav
            className="mb-4 flex flex-wrap gap-1.5"
            aria-label="Jump to page section"
          >
            {blocks
              .filter((b) => b.enabled)
              .map((block) => (
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
            Drag the handle to reorder · tap a card to edit · toggle to show or hide on your page.
          </p>
        </>
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
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <ul className="flex w-full min-w-0 flex-col gap-3">
            {blocks.map((block, index) => (
              <BlockModuleCard
                key={block.id}
                block={block}
                team={team}
                position={index + 1}
                expanded={expanded.has(block.id)}
                canMoveUp={index > 0}
                canMoveDown={index < blocks.length - 1}
                onMoveUp={() => onMoveUp(block.id)}
                onMoveDown={() => onMoveDown(block.id)}
                onToggleExpand={() => onToggleExpand(block.id)}
                onToggleEnabled={() => onToggleEnabled(block.id)}
                onPatchBlock={onPatchBlock}
                onPatchTeam={onPatchTeam}
                onPreviewBlock={onPreviewBlock}
                isDraggingOverlay={false}
                legoLayout
              />
            ))}
          </ul>
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
    </BuilderCollapsiblePanel>
  );
}
