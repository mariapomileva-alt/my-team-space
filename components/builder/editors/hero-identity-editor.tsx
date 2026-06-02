"use client";

import { ImageUploadField } from "@/components/builder/media/image-upload-field";
import { SocialIcon } from "@/components/social/social-icons";
import { BUILDER_FIELD_INPUT } from "@/lib/builder/layout";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { getBlockSettings, type SocialKey } from "@/lib/blocks/settings";
import { SOCIAL_ICON_CLASS, SOCIAL_LABELS } from "@/lib/social/links";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

type Settings = {
  quote: string;
  description?: string;
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

function hasOptionalIdentityFields(team: TeamSpace, s: Settings) {
  return Boolean(
    team.tagline?.trim() ||
      s.city?.trim() ||
      s.quote?.trim() ||
      s.description?.trim() ||
      s.coverImageUrl?.trim() ||
      Object.values(s.social ?? {}).some((v) => v?.trim()),
  );
}

const fieldLabel = "block text-xs font-semibold text-zinc-500";

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
  const [moreOpen, setMoreOpen] = useState(() => hasOptionalIdentityFields(team, s));

  const optionalFilled = useMemo(() => hasOptionalIdentityFields(team, s), [team, s]);

  function set(patch: Partial<Settings>) {
    onPatchBlock(block.id, { settings: { ...s, ...patch } });
  }

  const logo = team.logoUrl ?? s.teamPhotoUrl ?? "";

  return (
    <div className="space-y-5">
      <p className="text-sm text-zinc-500">
        Logo and name are all you need — optional details can wait.
      </p>

      <ImageUploadField
        teamId={team.id}
        label="Team logo"
        folder="logos"
        aspect="square"
        hint="Shows on your team page header."
        value={logo}
        onChange={(url) => {
          onPatchTeam({ logoUrl: url || undefined });
          set({ teamPhotoUrl: url });
        }}
      />

      <div>
        <label className={fieldLabel}>Team name</label>
        <input
          className={cn(BUILDER_FIELD_INPUT, "mt-1.5 text-base font-semibold")}
          placeholder="e.g. North Stars FC"
          value={team.name}
          onChange={(e) => onPatchTeam({ name: e.target.value })}
        />
      </div>

      <div className="border-t border-zinc-100 pt-1">
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 rounded-xl py-2 text-left transition hover:bg-zinc-50/80"
          aria-expanded={moreOpen}
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
            <span className="text-base" aria-hidden>
              ➕
            </span>
            More details
            {optionalFilled && !moreOpen ? (
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                Filled
              </span>
            ) : null}
          </span>
          <motion.span
            animate={{ rotate: moreOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 text-sm text-zinc-400"
            aria-hidden
          >
            ▾
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {moreOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pb-1 pt-2">
                <div>
                  <label className={fieldLabel}>Team slogan</label>
                  <input
                    className={cn(BUILDER_FIELD_INPUT, "mt-1.5")}
                    placeholder="Short line under your team name"
                    value={team.tagline ?? ""}
                    onChange={(e) => onPatchTeam({ tagline: e.target.value || undefined })}
                  />
                </div>

                <div>
                  <label className={fieldLabel}>City / location</label>
                  <input
                    className={cn(BUILDER_FIELD_INPUT, "mt-1.5")}
                    placeholder="e.g. Riga, Latvia"
                    value={s.city}
                    onChange={(e) => set({ city: e.target.value })}
                  />
                </div>

                <div>
                  <label className={fieldLabel}>Team motto</label>
                  <input
                    className={cn(BUILDER_FIELD_INPUT, "mt-1.5 italic")}
                    placeholder="A quote your team lives by"
                    value={s.quote}
                    onChange={(e) => set({ quote: e.target.value })}
                  />
                </div>

                <div>
                  <label className={fieldLabel}>Team description</label>
                  <textarea
                    className={cn(BUILDER_FIELD_INPUT, "mt-1.5")}
                    rows={3}
                    placeholder="A few sentences about your team — only shown if you fill this in"
                    value={s.description ?? ""}
                    onChange={(e) => set({ description: e.target.value })}
                  />
                </div>

                <div className="border-t border-zinc-100 pt-4">
                  <ImageUploadField
                    teamId={team.id}
                    label="Cover image"
                    folder="hero"
                    aspect="wide"
                    hint="Optional banner at the top of your page."
                    value={s.coverImageUrl}
                    onChange={(url) => set({ coverImageUrl: url })}
                  />
                </div>

                <div>
                  <p className={fieldLabel}>Social links</p>
                  <p className="mt-0.5 text-[11px] text-zinc-400">Only filled icons appear on your page.</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {SOCIALS.map(({ key, label }) => (
                      <label key={key} className="relative block">
                        <span
                          className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${SOCIAL_ICON_CLASS[key]}`}
                          aria-hidden
                        >
                          <SocialIcon network={key} className="h-4 w-4" />
                        </span>
                        <input
                          className={cn(BUILDER_FIELD_INPUT, "py-2 pl-10 pr-3")}
                          placeholder={SOCIAL_PLACEHOLDERS[key]}
                          aria-label={label}
                          value={s.social?.[key] ?? ""}
                          onChange={(e) => set({ social: { ...s.social, [key]: e.target.value } })}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
