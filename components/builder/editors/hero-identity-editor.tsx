"use client";

import { HeroLayoutPicker } from "@/components/builder/editors/hero-layout-picker";
import { ImageUploadField } from "@/components/builder/media/image-upload-field";
import { SocialIcon } from "@/components/social/social-icons";
import {
  pickHeroVariant,
  resolveHeroVariant,
  resolveHeroVariantForTeam,
  HERO_VARIANT_META,
  type HeroLayoutVariant,
} from "@/lib/blocks/hero-layout";
import { BUILDER_FIELD_INPUT } from "@/lib/builder/layout";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { getBlockSettings, type SocialKey } from "@/lib/blocks/settings";
import { SOCIAL_ICON_CLASS, SOCIAL_LABELS } from "@/lib/social/links";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type Settings = {
  heroLayout?: HeroLayoutVariant;
  quote: string;
  description?: string;
  city: string;
  coverImageUrl: string;
  teamPhotoUrl: string;
  social: Partial<Record<SocialKey, string>>;
};

const HERO_SOCIAL_ORDER: SocialKey[] = [
  "whatsapp",
  "instagram",
  "telegram",
  "tiktok",
  "facebook",
  "youtube",
];

const HERO_SOCIAL_FIELDS = HERO_SOCIAL_ORDER.map((key) => ({
  key,
  label: SOCIAL_LABELS[key],
}));

const SOCIAL_PLACEHOLDERS: Record<SocialKey, string> = {
  instagram: "@username or link",
  telegram: "@username or link",
  whatsapp: "+371... or wa.me link",
  tiktok: "@username or link",
  facebook: "page name or link",
  youtube: "@channel or link",
};

function hasMoreDetailsFields(team: TeamSpace, s: Settings) {
  return Boolean(
    team.tagline?.trim() ||
      s.city?.trim() ||
      s.quote?.trim() ||
      s.description?.trim() ||
      HERO_SOCIAL_FIELDS.some(({ key }) => s.social?.[key]?.trim()),
  );
}

const fieldLabel = "block text-xs font-semibold text-zinc-500";

export function HeroIdentityEditor({
  block,
  team,
  onPatchBlock,
  onPatchTeam,
  onPatchLogo,
  focusAboutKey = 0,
  onPreviewBlock,
}: {
  block: BlockInstance;
  team: TeamSpace;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
  onPatchTeam: (patch: Partial<TeamSpace>) => void;
  onPatchLogo?: (url: string) => void;
  /** Increment to expand about-team fields and scroll into view */
  focusAboutKey?: number;
  onPreviewBlock?: (id: string) => void;
}) {
  const s = getBlockSettings<Settings>(block);
  const [moreOpen, setMoreOpen] = useState(() => hasMoreDetailsFields(team, s));
  const [styleOpen, setStyleOpen] = useState(false);

  const optionalFilled = useMemo(() => hasMoreDetailsFields(team, s), [team, s]);

  useEffect(() => {
    if (focusAboutKey > 0) {
      setMoreOpen(true);
      window.setTimeout(() => {
        document.getElementById("builder-about-team")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }, [focusAboutKey]);
  const logo = team.logoUrl ?? s.teamPhotoUrl ?? "";
  const autoVariant = pickHeroVariant({
    teamName: team.name,
    logoSrc: logo,
    tagline: team.tagline,
    city: s.city,
  });
  const activeVariant = resolveHeroVariantForTeam(s.heroLayout, team, s);
  const layoutIsManual = s.heroLayout != null;

  function set(patch: Partial<Settings>) {
    onPatchBlock(block.id, { settings: { ...s, ...patch } });
  }

  return (
    <div className="space-y-5">
      <ImageUploadField
        teamId={team.id}
        label="Team logo"
        folder="logos"
        aspect="square"
        hint="Parents recognize your team instantly."
        value={logo}
        onChange={(url) => {
          if (onPatchLogo) {
            onPatchLogo(url);
            return;
          }
          onPatchTeam({ logoUrl: url || undefined });
          set({ teamPhotoUrl: url });
        }}
      />

      <div>
        <label className={fieldLabel}>Team name</label>
        <input
          className={cn(BUILDER_FIELD_INPUT, "mt-2 text-base font-semibold")}
          placeholder="e.g. Dance Stars"
          value={team.name}
          onChange={(e) => onPatchTeam({ name: e.target.value })}
        />
      </div>

      <ImageUploadField
        teamId={team.id}
        label="Cover image"
        folder="hero"
        aspect="wide"
        hint="Banner at the top of your team page."
        value={s.coverImageUrl}
        onChange={(url) => set({ coverImageUrl: url })}
      />

      <div id="builder-about-team" className="border-t border-zinc-100/90 pt-2">
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 rounded-xl py-2.5 text-left transition hover:bg-zinc-50/80"
          aria-expanded={moreOpen}
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
            More details
            {optionalFilled && !moreOpen ? (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
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
              <div className="space-y-5 pb-1 pt-3">
                <div>
                  <label className={fieldLabel}>Team slogan</label>
                  <input
                    className={cn(BUILDER_FIELD_INPUT, "mt-2")}
                    placeholder="Short line under your team name"
                    value={team.tagline ?? ""}
                    onChange={(e) => onPatchTeam({ tagline: e.target.value || undefined })}
                  />
                </div>

                <div>
                  <label className={fieldLabel}>City / location</label>
                  <input
                    className={cn(BUILDER_FIELD_INPUT, "mt-2")}
                    placeholder="e.g. Riga, Latvia"
                    value={s.city}
                    onChange={(e) => set({ city: e.target.value })}
                  />
                </div>

                <div>
                  <label className={fieldLabel}>Team motto</label>
                  <input
                    className={cn(BUILDER_FIELD_INPUT, "mt-2 italic")}
                    placeholder="A quote your team lives by"
                    value={s.quote}
                    onChange={(e) => set({ quote: e.target.value })}
                  />
                </div>

                <div>
                  <label className={fieldLabel}>About your team</label>
                  <textarea
                    className={cn(BUILDER_FIELD_INPUT, "mt-2")}
                    rows={3}
                    placeholder="Tell families what makes your team special"
                    value={s.description ?? ""}
                    onChange={(e) => set({ description: e.target.value })}
                  />
                </div>

                <div>
                  <p className={fieldLabel}>Social links</p>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    WhatsApp, Instagram, and more — only filled icons appear on your page.
                  </p>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {HERO_SOCIAL_FIELDS.map(({ key, label }) => (
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

      <div className="border-t border-zinc-100/90 pt-2">
        <button
          type="button"
          onClick={() => setStyleOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 rounded-xl py-2.5 text-left transition hover:bg-zinc-50/80"
          aria-expanded={styleOpen}
        >
          <span className="text-sm font-semibold text-zinc-800">Change header style</span>
          <span className="text-[11px] font-medium text-zinc-500">
            {layoutIsManual ? HERO_VARIANT_META[activeVariant].label : `Auto · ${HERO_VARIANT_META[autoVariant].label}`}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {styleOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pb-1 pt-3">
                <p className="text-[11px] text-zinc-400">
                  We pick the best layout from your logo and team name. Override only if you want a specific look.
                </p>
                <HeroLayoutPicker
                  value={layoutIsManual ? resolveHeroVariant(s.heroLayout) : activeVariant}
                  onChange={(heroLayout) => {
                    set({ heroLayout });
                    onPreviewBlock?.(block.id);
                  }}
                />
                {layoutIsManual ? (
                  <button
                    type="button"
                    onClick={() => set({ heroLayout: undefined })}
                    className="text-[11px] font-semibold text-violet-700 hover:text-violet-900"
                  >
                    Use automatic layout
                  </button>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
