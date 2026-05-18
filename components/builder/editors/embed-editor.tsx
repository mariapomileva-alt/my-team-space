"use client";

import type { BlockInstance } from "@/lib/types";
import { detectIntegrationProvider } from "@/lib/integrations/providers";
import { IntegrationLinkCard, type IntegrationLink } from "@/components/integrations/integration-link-card";
import { getBlockSettings } from "@/lib/blocks/settings";

function uid() {
  return `lnk_${Math.random().toString(36).slice(2, 9)}`;
}

type Settings = { sectionTitle?: string; links: IntegrationLink[] };

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
        Paste links from Garmin, Strava, YouTube, Google Calendar, Notion, and more — we detect the platform and
        show a beautiful card for parents.
      </p>
      <label className="block text-xs font-semibold text-zinc-500">Section title (optional)</label>
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        placeholder="Team tools & links"
        value={s.sectionTitle ?? ""}
        onChange={(e) => set({ sectionTitle: e.target.value })}
      />
      {links.map((link) => {
        const provider = detectIntegrationProvider(link.url);
        return (
          <div key={link.id} className="space-y-3 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">{provider.emoji}</span>
              <span className="text-xs font-bold text-indigo-700">{link.url ? provider.name : "New link"}</span>
            </div>
            <input
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              placeholder="https://…"
              value={link.url}
              onChange={(e) => updateLink(link.id, { url: e.target.value })}
            />
            <input
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              placeholder="Custom label (optional)"
              value={link.label ?? ""}
              onChange={(e) => updateLink(link.id, { label: e.target.value })}
            />
            {link.url?.trim() ? (
              <div className="pointer-events-none max-w-sm origin-top-left scale-[0.92] opacity-95">
                <IntegrationLinkCard link={{ ...link, providerId: provider.id }} compact />
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
        + Add tool or link
      </button>
    </div>
  );
}
