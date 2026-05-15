"use client";

import type { BlockInstance } from "@/lib/types";
import { getBlockSettings } from "@/lib/blocks/settings";

type S = {
  whatsapp: string;
  telegram: string;
  instagram: string;
  tiktok: string;
  website: string;
  phone: string;
  customLabel: string;
  customUrl: string;
};

export function QuickLinksEditor({
  block,
  onPatchBlock,
}: {
  block: BlockInstance;
  onPatchBlock: (id: string, p: Partial<BlockInstance>) => void;
}) {
  const s = getBlockSettings<S>(block);
  const set = (patch: Partial<S>) => onPatchBlock(block.id, { settings: { ...s, ...patch } });
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <input className="rounded-xl border border-zinc-200 px-3 py-2 text-sm" placeholder="WhatsApp" value={s.whatsapp} onChange={(e) => set({ whatsapp: e.target.value })} />
      <input className="rounded-xl border border-zinc-200 px-3 py-2 text-sm" placeholder="Telegram" value={s.telegram} onChange={(e) => set({ telegram: e.target.value })} />
      <input className="rounded-xl border border-zinc-200 px-3 py-2 text-sm" placeholder="Instagram" value={s.instagram} onChange={(e) => set({ instagram: e.target.value })} />
      <input className="rounded-xl border border-zinc-200 px-3 py-2 text-sm" placeholder="TikTok" value={s.tiktok} onChange={(e) => set({ tiktok: e.target.value })} />
      <input className="rounded-xl border border-zinc-200 px-3 py-2 text-sm sm:col-span-2" placeholder="Website" value={s.website} onChange={(e) => set({ website: e.target.value })} />
      <input className="rounded-xl border border-zinc-200 px-3 py-2 text-sm sm:col-span-2" placeholder="Coach phone" value={s.phone} onChange={(e) => set({ phone: e.target.value })} />
    </div>
  );
}
