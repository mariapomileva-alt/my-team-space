"use client";

import {
  getBlockSettings,
  newQuickActionItem,
  type QuickActionsSettings,
} from "@/lib/blocks/settings";
import { QUICK_ACTION_ICON_OPTIONS } from "@/lib/quick-actions/icons";
import type { BlockInstance } from "@/lib/types";

const fieldClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100";

function fieldLabel(text: string) {
  return <p className="mb-1 text-xs font-semibold text-zinc-600">{text}</p>;
}

export function QuickActionsEditor({
  block,
  onPatchBlock,
}: {
  block: BlockInstance;
  onPatchBlock: (id: string, p: Partial<BlockInstance>) => void;
}) {
  const s = getBlockSettings<QuickActionsSettings>(block);
  const actions = s.actions ?? [];

  const set = (patch: Partial<QuickActionsSettings>) =>
    onPatchBlock(block.id, { settings: { ...s, ...patch } });

  const updateAction = (id: string, patch: Partial<(typeof actions)[0]>) => {
    set({
      actions: actions.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    });
  };

  const removeAction = (id: string) => {
    set({ actions: actions.filter((a) => a.id !== id) });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">
        Create buttons for payments, merch, registration, photos, chat groups, and more — any link
        works.
      </p>
      <div>
        {fieldLabel("Section title (optional)")}
        <input
          className={fieldClass}
          placeholder="Quick actions"
          value={s.sectionTitle ?? ""}
          onChange={(e) => set({ sectionTitle: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <div
            key={action.id}
            className="rounded-2xl border border-violet-100 bg-gradient-to-b from-violet-50/40 to-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-violet-700/80">
                Button {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeAction(action.id)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                Remove
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                {fieldLabel("Icon")}
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_ACTION_ICON_OPTIONS.map((opt) => {
                    const selected = action.icon === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        title={opt.label}
                        onClick={() => updateAction(action.id, { icon: opt.id })}
                        className={`flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl border px-2 text-lg transition ${
                          selected
                            ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200"
                            : "border-zinc-200 bg-white hover:border-zinc-300"
                        }`}
                      >
                        {opt.emoji}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="sm:col-span-2">
                {fieldLabel("Button title")}
                <input
                  className={fieldClass}
                  placeholder="Pay Membership"
                  value={action.title}
                  onChange={(e) => updateAction(action.id, { title: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                {fieldLabel("URL")}
                <input
                  className={fieldClass}
                  type="url"
                  placeholder="https://..."
                  value={action.url}
                  onChange={(e) => updateAction(action.id, { url: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => set({ actions: [...actions, newQuickActionItem()] })}
        className="w-full rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
      >
        + Add action button
      </button>
    </div>
  );
}
