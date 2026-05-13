"use client";

import type { TeamSpace, ThemeId, BlockInstance } from "@/lib/types";
import { THEMES } from "@/lib/themes";
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
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { saveTeamPreviewLocal, clearTeamPreviewLocal } from "@/lib/preview-storage";

const BLOCK_LABELS: Record<BlockInstance["type"], string> = {
  hero: "Шапка страницы",
  announcement_bar: "Бегущая строка / объявления",
  calendar: "Календарь",
  schedule: "Расписание на неделю",
  results: "Результаты и доска",
  achievements: "Награды и серии",
  team_feed: "Лента команды",
  attendance: "Посещаемость",
  camp_trip: "Сбор / поездка",
  contacts: "Контакты",
  documents: "Документы",
  polls: "Опросы",
  gallery: "Фотогалерея",
  sponsors: "Партнёры",
  weather: "Погода",
  countdown: "Обратный отсчёт",
  birthdays: "Дни рождения",
  quick_links: "Быстрые ссылки",
};

function SortableRow({
  block,
  onToggle,
}: {
  block: BlockInstance;
  onToggle: (id: string) => void;
}) {
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
        isDragging ? "z-10 opacity-90 shadow-lg ring-2 ring-sky-400" : ""
      }`}
    >
      <button
        type="button"
        className="touch-manipulation cursor-grab px-1 text-zinc-400 active:cursor-grabbing"
        aria-label="Перетащить"
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
          className="h-5 w-5 rounded border-zinc-300 text-sky-600 focus:ring-sky-500"
        />
        <span className="font-medium text-zinc-900">{BLOCK_LABELS[block.type]}</span>
      </label>
      <span className="hidden text-xs uppercase tracking-wider text-zinc-400 sm:inline">
        {block.type}
      </span>
    </motion.li>
  );
}

export function AdminDashboard({ initialTeam }: { initialTeam: TeamSpace }) {
  const [team, setTeam] = useState(initialTeam);
  const blocksSorted = useMemo(
    () => [...team.blocks].sort((a, b) => a.order - b.order),
    [team.blocks]
  );

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

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Конструктор страницы
            </p>
            <h1 className="text-xl font-bold">{team.name}</h1>
            <p className="mt-1 max-w-xl text-sm text-zinc-600">
              Это не приложение из стора — одна веб-страница по ссылке. Соберите её блоками и
              отправьте родителям обычный URL.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                saveTeamPreviewLocal(team);
              }}
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              Сохранить черновик (этот браузер)
            </button>
            <button
              type="button"
              onClick={() => clearTeamPreviewLocal(team.slug)}
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700"
            >
              Сбросить черновик
            </button>
            <Link
              href={`/${team.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              Открыть страницу команды
            </Link>
            <Link href="/" className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold">
              На главную
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-10 px-4 py-8 sm:px-8">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Цветовая тема страницы</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Готовые палитры: можно сменить внешний вид всей веб-страницы одним выбором.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  team.themeId === t.id
                    ? "border-sky-500 ring-2 ring-sky-200"
                    : "border-zinc-200 hover:border-zinc-300"
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
          <h2 className="text-lg font-bold">Блоки на странице</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Перетащите порядок, включайте и выключайте блоки. Нажмите{" "}
            <strong>Сохранить черновик</strong> и откройте страницу команды — увидите правки в этом
            браузере. Позже всё будет сохраняться в облаке (Supabase).
          </p>
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

        <p className="text-center text-xs text-zinc-500">
          Черновик хранится в браузере (localStorage). В продакшене — таблица команд и RLS в
          Supabase.
        </p>
      </main>
    </div>
  );
}
