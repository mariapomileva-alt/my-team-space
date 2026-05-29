"use client";

import { ImageUploadField } from "@/components/builder/media/image-upload-field";
import { SocialIcon } from "@/components/social/social-icons";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { getBlockSettings, type SocialKey } from "@/lib/blocks/settings";
import { SOCIAL_ICON_CLASS, SOCIAL_LABELS } from "@/lib/social/links";

type Settings = {
  quote: string;
  city: string;
  coverImageUrl: string;
  teamPhotoUrl: string;
  social: Partial<Record<SocialKey, string>>;
};

const SOCIAL_PLACEHOLDERS: Record<SocialKey, string> = {
  instagram: "@username or link",
  telegram: "@username or link",
  whatsapp: "+371... or link",
  tiktok: "@username or link",
  facebook: "page name or link",
  youtube: "@channel or link",
};

const SOCIALS = (Object.keys(SOCIAL_LABELS) as SocialKey[]).map((key) => ({
  key,
  label: SOCIAL_LABELS[key],
}));

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
  const logo = team.logoUrl ?? s.teamPhotoUrl ?? "";

  return (
    <div className="space-y-4">
      <ImageUploadField
        teamId={team.id}
        label="Team logo"
        folder="logos"
        aspect="square"
        hint="Round avatar on your team page."
        value={logo}
        onChange={(url) => {
          onPatchTeam({ logoUrl: url || undefined });
          set({ teamPhotoUrl: url });
        }}
      />
      <label className="block text-xs font-semibold text-zinc-500">Team name</label>
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold"
        value={team.name}
        onChange={(e) => onPatchTeam({ name: e.target.value })}
      />
      <label className="block text-xs font-semibold text-zinc-500">Team slogan</label>
      <textarea
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        rows={2}
        placeholder="One line that captures your team spirit"
        value={team.tagline ?? ""}
        onChange={(e) => onPatchTeam({ tagline: e.target.value })}
      />
      <label className="block text-xs font-semibold text-zinc-500">City / location</label>
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        value={s.city}
        onChange={(e) => set({ city: e.target.value })}
      />
      <label className="block text-xs font-semibold text-zinc-500">Team motto</label>
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm italic"
        value={s.quote}
        onChange={(e) => set({ quote: e.target.value })}
      />
      <ImageUploadField
        teamId={team.id}
        label="Cover image"
        folder="hero"
        aspect="wide"
        value={s.coverImageUrl}
        onChange={(url) => set({ coverImageUrl: url })}
      />
      <p className="text-xs font-semibold text-zinc-500">Social links (only filled icons show publicly)</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {SOCIALS.map(({ key, label }) => (
          <label key={key} className="relative block">
            <span
              className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${SOCIAL_ICON_CLASS[key]}`}
              aria-hidden
            >
              <SocialIcon network={key} className="h-4 w-4" />
            </span>
            <input
              className="w-full rounded-xl border border-zinc-200 py-2 pl-10 pr-3 text-sm"
              placeholder={SOCIAL_PLACEHOLDERS[key]}
              aria-label={label}
              value={s.social?.[key] ?? ""}
              onChange={(e) => set({ social: { ...s.social, [key]: e.target.value } })}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
