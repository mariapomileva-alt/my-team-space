"use client";

import type { BlockInstance } from "@/lib/types";
import { IntegrationLinkCard } from "@/components/integrations/integration-link-card";
import { IntegrationPill } from "@/components/integrations/integration-pill";
import { detectIntegrationProvider } from "@/lib/integrations/providers";
import type { IntegrationCardVariant, IntegrationLink } from "@/lib/integrations/types";
import { getBlockSettings } from "@/lib/blocks/settings";

function uid() {
  return `lnk_${Math.random().toString(36).slice(2, 9)}`;
}

type Settings = { sectionTitle?: string; links: IntegrationLink[] };

const VARIANTS: { value: IntegrationCardVariant; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "tile", label: "Grid tile" },
  { value: "compact", label: "Compact" },
];

export function EmbedEditor({
  block,
  onPatchBlock,
}: {
  block: BlockInstance;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
}) {
  const s = getBlockSettings<Settings>(block);
  const links = s.links ?? [];

  function set(patch: Partial<Settings>) {
    onPatchBlock(block.id, { settings: { ...s, ...patch } });
  }

  function updateLink(id: string, patch: Partial<IntegrationLink>) {
    set({
      links: links.map((l) => {
        if (l.id !== id) return l;
        const next = { ...l, ...patch };
        if (patch.url !== undefined) {
          const provider = detectIntegrationProvider(patch.url);
          next.providerId = provider.id;
        }
        return next;
      }),
    });
  }

  function addLink() {
    set({ links: [...links, { id: uid(), url: "", label: "" }] });
  }

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-zinc-500">
        Paste a link — we detect Garmin, Strava, YouTube, Google Calendar, Instagram, and more, then show a
        beautiful MyTeamSpace card (no ugly embeds).
      </p>
      <label className="block text-xs font-semibold text-zinc-500">Section title (optional)</label>
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        placeholder="Smart integrations"
        value={s.sectionTitle ?? ""}
        onChange={(e) => set({ sectionTitle: e.target.value })}
      />
      {links.map((link, index) => {
        const provider = detectIntegrationProvider(link.url);
        return (
          <div key={link.id} className="space-y-3 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <IntegrationPill provider={provider} />
              <label className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500">
                <input
                  type="checkbox"
                  checked={Boolean(link.featured)}
                  onChange={(e) => updateLink(link.id, { featured: e.target.checked })}
                />
                Featured
              </label>
            </div>
            <input
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              placeholder="https://…"
              value={link.url}
              onChange={(e) => updateLink(link.id, { url: e.target.value })}
            />
            <input
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              placeholder="Custom title (optional)"
              value={link.label ?? ""}
              onChange={(e) => updateLink(link.id, { label: e.target.value })}
            />
            <input
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              placeholder="Short description (optional)"
              value={link.description ?? ""}
              onChange={(e) => updateLink(link.id, { description: e.target.value })}
            />
            <div className="flex flex-wrap gap-1">
              {VARIANTS.map((v) => (
                <button
                  key={v.value}
                  type="button"
                  onClick={() => updateLink(link.id, { variant: v.value })}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    (link.variant ?? (index === 0 ? "featured" : "tile")) === v.value
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
            {link.url?.trim() ? (
              <div className="pointer-events-none max-w-md origin-top-left scale-[0.88] opacity-95">
                <IntegrationLinkCard link={link} index={index} total={links.length} />
              </div>
            ) : null}
            <button
              type="button"
              className="text-xs font-semibold text-red-600"
              onClick={() => set({ links: links.filter((l) => l.id !== link.id) })}
            >
              Remove link
            </button>
          </div>
        );
      })}
      <button
        type="button"
        onClick={addLink}
        className="rounded-full border border-dashed border-indigo-300 px-4 py-2 text-xs font-semibold text-indigo-700"
      >
        + Add integration
      </button>
    </div>
  );
}
