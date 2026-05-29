"use client";

import { BlockModuleCard } from "@/components/builder/block-module-card";
import { BuilderCollapsiblePanel } from "@/components/builder/builder-collapsible-panel";
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
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
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

  return (
    <BuilderCollapsiblePanel
      className={`${BUILDER_PANEL_SURFACE} border-violet-200/40`}
      title="Step 2 — Page blocks"
      description="Turn sections on, drag to reorder — like building a Notion page."
      summary={
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-800">
          {enabledCount} live · {blocks.length} total
        </span>
      }
      defaultExpanded
    >
      {enabledCount === 0 ? (
        <div className="mb-5 rounded-2xl border border-dashed border-violet-200 bg-gradient-to-br from-violet-50/80 to-indigo-50/40 px-5 py-8 text-center">
          <p className="text-base font-bold text-zinc-900">Start building your team page</p>
          <p className="mt-1 text-sm text-zinc-500">Add a block — preview updates right away.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {QUICK_ADD_TYPES.map((type) => {
              const meta = BLOCK_META[type];
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onQuickAdd(type)}
                  className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-900 shadow-sm transition hover:border-violet-300 hover:shadow-md active:scale-[0.98]"
                >
                  <span aria-hidden>{meta.emoji}</span>
                  {meta.title}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

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
        <SortableContext items={blocks.map((b) => b.id)} strategy={rectSortingStrategy}>
          <ul className="grid w-full min-w-0 grid-cols-1 gap-2.5">
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
              />
            ))}
          </ul>
        </SortableContext>

        <DragOverlay dropAnimation={{ duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}>
          {activeBlock ? (
            <div className="rotate-[1.5deg] scale-[1.02] opacity-95 shadow-2xl">
              <BlockModuleCard
                block={activeBlock}
                team={team}
                expanded={false}
                onToggleExpand={() => {}}
                onToggleEnabled={() => {}}
                onPatchBlock={() => {}}
                onPatchTeam={() => {}}
                isDraggingOverlay
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </BuilderCollapsiblePanel>
  );
}
