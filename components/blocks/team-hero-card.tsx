import { MtsCoverBanner, MtsTeamLogo } from "@/components/mts/media/mts-media";
import { SocialLinkButtons, type SocialLinkItem } from "@/components/social/social-link-buttons";
import {
  DEFAULT_HERO_VARIANT,
  HERO_LAYOUT,
  heroVariantClass,
  type HeroLayoutVariant,
} from "@/lib/blocks/hero-layout";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

export type TeamHeroCardProps = {
  teamName: string;
  logoSrc?: string | null;
  tagline?: string | null;
  city?: string | null;
  coverSrc?: string | null;
  description?: string | null;
  motto?: string | null;
  socialLinks?: SocialLinkItem[];
  /** Logo + name composition chosen in the builder. Defaults to `stack`. */
  variant?: HeroLayoutVariant;
};

/**
 * Team header card. One card, four logo + name compositions (variant).
 * Content is identical across variants — only placement changes.
 * Layout tokens: lib/blocks/hero-layout.ts · styles: app/globals.css (.hero-card*)
 */
export function TeamHeroCard({
  teamName,
  logoSrc,
  tagline,
  city,
  coverSrc,
  description,
  motto,
  socialLinks = [],
  variant = DEFAULT_HERO_VARIANT,
}: TeamHeroCardProps) {
  const hasCover = Boolean(coverSrc?.trim());
  const isOverlay = variant === "overlay";
  const hasSocial = socialLinks.length > 0;
  const hasNarrative = Boolean(description?.trim() || motto?.trim());

  const liveBadge = (
    <span
      className={cn(
        "relative z-20 flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1",
        hasCover
          ? "bg-white/95 text-emerald-700 ring-white/80 shadow-sm backdrop-blur-sm"
          : "bg-emerald-50 text-emerald-700 ring-emerald-100",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
      Live
    </span>
  );

  const titleGroup = (
    <>
      <h1 className={HERO_LAYOUT.title}>{teamName}</h1>
      {tagline?.trim() ? <p className={HERO_LAYOUT.subtitle}>{tagline.trim()}</p> : null}
      {city?.trim() ? <p className={HERO_LAYOUT.city}>📍 {city.trim()}</p> : null}
    </>
  );

  const social = hasSocial ? (
    <SocialLinkButtons links={socialLinks} size="sm" tone="hero" className="hero-card__social" />
  ) : null;

  const narrative = hasNarrative ? (
    <div className={HERO_LAYOUT.details}>
      {description?.trim() ? (
        <p className="hero-card__description text-[13px] leading-relaxed text-[color:var(--mts-muted)]">
          {description.trim()}
        </p>
      ) : null}
      {motto?.trim() ? (
        <p className={cn("team-identity-motto", description?.trim() ? "mt-1.5" : "mt-0")}>
          “{motto.trim()}”
        </p>
      ) : null}
    </div>
  ) : null;

  const logo = <MtsTeamLogo src={logoSrc} teamName={teamName} className={HERO_LAYOUT.logoFrame} />;

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative">
      <div
        className={cn(
          HERO_LAYOUT.root,
          heroVariantClass(variant),
          "team-identity-card overflow-hidden",
        )}
      >
        <div className={HERO_LAYOUT.cover}>
          {hasCover ? (
            <>
              <MtsCoverBanner src={coverSrc} />
              <div
                className={cn(
                  "pointer-events-none absolute inset-0",
                  isOverlay
                    ? "bg-gradient-to-t from-black/70 via-black/25 to-black/5"
                    : "bg-gradient-to-t from-black/45 via-black/10 to-transparent",
                )}
                aria-hidden
              />
            </>
          ) : (
            <MtsCoverBanner fallbackClassName="hero-cover__fallback" />
          )}

          <div className="absolute right-3 top-3 z-20">{liveBadge}</div>

          <div className="hero-card__logo-anchor">{logo}</div>

          {isOverlay ? <div className={HERO_LAYOUT.overlayText}>{titleGroup}</div> : null}
        </div>

        {isOverlay ? (
          hasSocial || hasNarrative ? (
            <div className={HERO_LAYOUT.body}>
              {social}
              {narrative}
            </div>
          ) : null
        ) : (
          <div className={HERO_LAYOUT.body}>
            <div className={HERO_LAYOUT.identity}>
              {variant === "inline" ? <div className="hero-card__logo-spacer" aria-hidden /> : null}
              <div className={HERO_LAYOUT.textZone}>
                {titleGroup}
                {social}
              </div>
            </div>
            {narrative}
          </div>
        )}
      </div>
    </motion.section>
  );
}
