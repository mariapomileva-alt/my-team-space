"use client";

import type { BlockInstance, TeamSpace } from "@/lib/types";
import { getBlockSettings, type SocialKey } from "@/lib/blocks/settings";

type Settings = {
  quote: string;
  city: string;
  coverImageUrl: string;
  teamPhotoUrl: string;
  social: Partial<Record<SocialKey, string>>;
};

const SOCIALS: { key: SocialKey; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "telegram", label: "Telegram" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "tiktok", label: "TikTok" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
];

export function HeroIdentityEditor({
  block,
  team,
  onPatchBlock,
  onPatchTeam,
}: {
  block: BlockInstance;
  team: TeamSpace;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
  onPatchTeam: (patch: Partial<TeamSpace>) => void;
}) {
  const s = getBlockSettings<Settings>(block);
  function set(patch: Partial<Settings>) {
    onPatchBlock(block.id, { settings: { ...s, ...patch } });
  }
  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500">Logo uploads via Storage coming soon — paste image URLs for now.</p>
      <label className="block text-xs font-semibold text-zinc-500">Team name</label>
      <input className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold" value={team.name} onChange={(e) => onPatchTeam({ name: e.target.value })} />
      <label className="block text-xs font-semibold text-zinc-500">Short description</label>
      <textarea className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" rows={2} value={team.tagline ?? ""} onChange={(e) => onPatchTeam({ tagline: e.target.value })} />
      <label className="block text-xs font-semibold text-zinc-500">City / location</label>
      <input className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" value={s.city} onChange={(e) => set({ city: e.target.value })} />
      <label className="block text-xs font-semibold text-zinc-500">Team motto</label>
      <input className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm italic" value={s.quote} onChange={(e) => set({ quote: e.target.value })} />
      <label className="block text-xs font-semibold text-zinc-500">Cover image URL</label>
      <input className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" value={s.coverImageUrl} onChange={(e) => set({ coverImageUrl: e.target.value })} placeholder="https://..." />
      <p className="text-xs font-semibold text-zinc-500">Social links (only filled icons show publicly)</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {SOCIALS.map(({ key, label }) => (
          <input key={key} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm" placeholder={label} value={s.social?.[key] ?? ""} onChange={(e) => set({ social: { ...s.social, [key]: e.target.value } })} />
        ))}
      </div>
    </div>
  );
}
