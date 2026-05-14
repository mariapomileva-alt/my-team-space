"use client";

import type { TeamSpace, ThemeId, BlockInstance } from "@/lib/types";
import { THEMES } from "@/lib/themes";
import { ADMIN_BLOCK_LABELS } from "@/lib/mts/admin-block-labels";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { saveTeamContent } from "./server-actions";

function SortableRow({ block, onToggle }: { block: BlockInstance; onToggle: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      layout
      className={`flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-3 py-3 shadow-sm ${
        isDragging ? "z-10 opacity-90 shadow-lg ring-2 ring-indigo-400" : ""
      }`}
    >
      <button
        type="button"
        className="touch-manipulation cursor-grab px-1 text-zinc-400 active:cursor-grabbing"
        aria-label="Reorder"
        {...attributes}
        {...listeners}
      >
        ⋮⋮
      </button>
      <label className="flex flex-1 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={block.enabled}
          onChange={() => onToggle(block.id)}
          className="h-5 w-5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="font-medium text-zinc-900">{ADMIN_BLOCK_LABELS[block.type]}</span>
      </label>
      <span className="hidden text-xs uppercase tracking-wider text-zinc-400 sm:inline">{block.type}</span>
    </motion.li>
  );
}

export function TeamStep2Client({
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
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    setTeam(initialTeam);
  }, [initialTeam]);
  const [pending, startTransition] = useTransition();

  const blocksSorted = useMemo(() => [...team.blocks].sort((a, b) => a.order - b.order), [team.blocks]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

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

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocksSorted.findIndex((b) => b.id === active.id);
    const newIndex = blocksSorted.findIndex((b) => b.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const nextOrder = arrayMove(blocksSorted, oldIndex, newIndex);
    setTeam((prev) => ({
      ...prev,
      blocks: nextOrder.map((b, i) => ({ ...b, order: i })),
    }));
  }

  function saveCloud() {
    setMsg(null);
    startTransition(async () => {
      try {
        await saveTeamContent(teamId, team);
        setMsg("Saved to cloud.");
        router.refresh();
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <nav className="flex flex-wrap items-center gap-2 text-sm" aria-label="Editor steps">
              <Link href={`/admin/team/${teamId}/step-1`} className="text-zinc-500 hover:text-zinc-800">
                1 · Basics
              </Link>
              <span className="text-zinc-300">→</span>
              <span className="font-semibold text-indigo-700">2 · Layout & content</span>
            </nav>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Page editor</p>
            <p className="mt-1 truncate text-lg font-bold text-zinc-900">{team.name}</p>
            <p className="mt-1 text-xs text-zinc-500">Reorder blocks, tweak theme again if needed, then save.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={saveCloud}
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save to cloud"}
            </button>
            <button
              type="button"
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700"
              onClick={() => {
                void navigator.clipboard.writeText(publicUrl);
                setMsg("Public link copied.");
              }}
            >
              Copy public link
            </button>
            <Link
              href={`/team/${team.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              Preview public page
            </Link>
            <Link href="/admin" className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold">
              All teams
            </Link>
          </div>
        </div>
        {msg ? <p className="mx-auto mt-3 max-w-3xl text-center text-xs text-zinc-600">{msg}</p> : null}
      </header>

      <main className="mx-auto max-w-3xl space-y-10 px-4 py-8 sm:px-8">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Color theme</h2>
          <p className="mt-1 text-sm text-zinc-600">Optional tweaks — same palettes as step 1.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  team.themeId === t.id ? "border-sky-500 ring-2 ring-sky-200" : "border-zinc-200 hover:border-zinc-300"
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
          <h2 className="text-lg font-bold">Page blocks</h2>
          <p className="mt-1 text-sm text-zinc-600">Drag to reorder, toggle visibility, then save to cloud.</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={blocksSorted.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <ul className="mt-6 space-y-2">
                {blocksSorted.map((block) => (
                  <SortableRow key={block.id} block={block} onToggle={toggleBlock} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </section>
      </main>
    </div>
  );
}
