"use client";

import { useState } from "react";
import {
  categoryLabel,
  newCategory,
  upsertCategory,
  type ResultsBoardSettings,
  type TeamCategory,
} from "@/lib/blocks/results-board";

function inputClass() {
  return "mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
}

export function ResultsCategoryEditor({
  settings,
  onSave,
}: {
  settings: ResultsBoardSettings;
  onSave: (patch: Partial<ResultsBoardSettings>) => void;
}) {
  const categories = settings.categories;

  function setCategories(next: TeamCategory[]) {
    onSave({ categories: next });
  }

  function updateCat(id: string, label: string) {
    setCategories(categories.map((c) => (c.id === id ? { ...c, label } : c)));
  }

  function removeCat(id: string) {
    const fallback = categories.find((c) => c.id !== id)?.id ?? "";
    onSave({
      categories: categories.filter((c) => c.id !== id),
      competitions: settings.competitions.map((comp) =>
        comp.categoryId === id ? { ...comp, categoryId: fallback } : comp,
      ),
    });
  }

  function moveCat(id: string, dir: -1 | 1) {
    const i = categories.findIndex((c) => c.id === id);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= categories.length) return;
    const next = [...categories];
    [next[i], next[j]] = [next[j]!, next[i]!];
    setCategories(next);
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] leading-relaxed text-zinc-500">
        Create your own categories — Karate, Singles, Hip-Hop, Running… They become filter chips on the public board.
      </p>
      {categories.length === 0 ? (
        <p className="rounded-xl bg-zinc-50 px-3 py-2 text-[11px] text-zinc-500">No categories yet. Add your first below.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat, idx) => (
            <li
              key={cat.id}
              className="flex items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50/80 px-2 py-1.5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-zinc-400">
                {idx + 1}
              </span>
              <input
                className="min-w-0 flex-1 rounded-lg border border-transparent bg-white px-2 py-1.5 text-sm focus:border-indigo-300 focus:outline-none"
                value={cat.label}
                placeholder="Category name"
                onChange={(e) => updateCat(cat.id, e.target.value)}
              />
              <div className="flex shrink-0 gap-0.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  className="rounded-lg px-1.5 py-1 text-[10px] text-zinc-500 disabled:opacity-30"
                  onClick={() => moveCat(cat.id, -1)}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={idx === categories.length - 1}
                  className="rounded-lg px-1.5 py-1 text-[10px] text-zinc-500 disabled:opacity-30"
                  onClick={() => moveCat(cat.id, 1)}
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="rounded-lg px-1.5 py-1 text-[10px] text-red-600"
                  onClick={() => removeCat(cat.id)}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className="w-full rounded-xl border border-dashed border-indigo-300 py-2 text-xs font-semibold text-indigo-700"
        onClick={() => setCategories([...categories, newCategory("")])}
      >
        + Add category
      </button>
    </div>
  );
}

export function CategoryPicker({
  settings,
  value,
  onChange,
  onSaveCategories,
}: {
  settings: ResultsBoardSettings;
  value: string;
  onChange: (categoryId: string) => void;
  onSaveCategories: (categories: TeamCategory[]) => void;
}) {
  const categories = settings.categories.filter((c) => c.label.trim());

  return (
    <div className="space-y-2">
      <select className={inputClass()} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">General</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
      <QuickAddCategory
        onAdd={(label) => {
          const { categories: next, id } = upsertCategory(settings.categories, label);
          onSaveCategories(next);
          if (id) onChange(id);
        }}
      />
      {value ? (
        <p className="text-[10px] text-zinc-400">Selected: {categoryLabel(settings, value)}</p>
      ) : null}
    </div>
  );
}

function QuickAddCategory({ onAdd }: { onAdd: (label: string) => void }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");

  return (
    <div>
      {!open ? (
        <button type="button" className="text-[11px] font-semibold text-indigo-600" onClick={() => setOpen(true)}>
          + New category
        </button>
      ) : (
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg border border-zinc-200 px-2 py-1.5 text-sm"
            placeholder="e.g. Kumite"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-2 py-1 text-[11px] font-semibold text-white"
            onClick={() => {
              if (label.trim()) onAdd(label.trim());
              setLabel("");
              setOpen(false);
            }}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
