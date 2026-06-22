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
  socialLinks?: SocialLinkItem[];
  variant?: HeroLayoutVariant;
};

function HeroTitle({ teamName }: { teamName: string }) {
  return <h1 className={HERO_LAYOUT.title}>{teamName}</h1>;
}

function HeroMeta({
  tagline,
  city,
  socialLinks,
}: {
  tagline?: string | null;
  city?: string | null;
  socialLinks: SocialLinkItem[];
}) {
  const hasSocial = socialLinks.length > 0;
  return (
    <>
      {tagline?.trim() ? <p className={HERO_LAYOUT.subtitle}>{tagline.trim()}</p> : null}
      {city?.trim() ? <p className={HERO_LAYOUT.city}>📍 {city.trim()}</p> : null}
      {hasSocial ? (
        <SocialLinkButtons links={socialLinks} size="sm" tone="hero" className="hero-card__social" />
      ) : null}
    </>
  );
}

/**
 * Branded team header — Header Variants reference (6 approved layouts).
 * Cover · logo · name · optional subtitle · location · social links only.
 */
export function TeamHeroCard({
  teamName,
  logoSrc,
  tagline,
  city,
  coverSrc,
  socialLinks = [],
  variant = DEFAULT_HERO_VARIANT,
}: TeamHeroCardProps) {
  const hasCover = Boolean(coverSrc?.trim());
  const isCoverIdentity = variant === "inside_header" || variant === "circle_on_header";
  const isMinimal = variant === "minimal";
  const isInline = variant === "inline" || variant === "square";
  const showLogo = !isMinimal;

  const hasOptionalMeta = Boolean(tagline?.trim() || city?.trim() || socialLinks.length > 0);
  const essentialOnly = !hasOptionalMeta;

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

  const logo = showLogo ? (
    <MtsTeamLogo src={logoSrc} teamName={teamName} className={HERO_LAYOUT.logoFrame} />
  ) : null;

  const bodyContent = isCoverIdentity ? (
    <HeroMeta tagline={tagline} city={city} socialLinks={socialLinks} />
  ) : isMinimal ? (
    socialLinks.length > 0 ? (
      <SocialLinkButtons links={socialLinks} size="sm" tone="hero" className="hero-card__social" />
    ) : null
  ) : isInline ? (
    <>
      <HeroTitle teamName={teamName} />
      <HeroMeta tagline={tagline} city={city} socialLinks={[]} />
    </>
  ) : (
    <>
      <HeroTitle teamName={teamName} />
      <HeroMeta tagline={tagline} city={city} socialLinks={socialLinks} />
    </>
  );

  const showBody = Boolean(
    isCoverIdentity
      ? hasOptionalMeta
      : isMinimal
        ? socialLinks.length > 0
        : true,
  );

  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative">
      <div
        className={cn(
          HERO_LAYOUT.root,
          heroVariantClass(variant),
          "team-hero-brand overflow-hidden rounded-[1.25rem]",
          essentialOnly && "hero-card--essential-only",
        )}
      >
        <div className={HERO_LAYOUT.cover}>
          {hasCover ? (
            <>
              <MtsCoverBanner src={coverSrc} />
              <div
                className={cn(
                  "pointer-events-none absolute inset-0",
                  isCoverIdentity || isMinimal
                    ? "bg-gradient-to-t from-black/72 via-black/28 to-black/8"
                    : "bg-gradient-to-t from-black/48 via-black/12 to-transparent",
                )}
                aria-hidden
              />
            </>
          ) : (
            <MtsCoverBanner fallbackClassName="hero-cover__fallback" />
          )}

          <div className="absolute right-3 top-3 z-20">{liveBadge}</div>

          {isCoverIdentity ? (
            <div className={HERO_LAYOUT.coverIdentity}>
              <div className="hero-card__logo-anchor">{logo}</div>
              <div className={HERO_LAYOUT.coverTitle}>
                <HeroTitle teamName={teamName} />
              </div>
            </div>
          ) : null}

          {isMinimal ? (
            <div className={HERO_LAYOUT.overlayText}>
              <HeroTitle teamName={teamName} />
              <HeroMeta tagline={tagline} city={city} socialLinks={[]} />
            </div>
          ) : null}

          {!isCoverIdentity && !isMinimal ? (
            <div className="hero-card__logo-anchor">{logo}</div>
          ) : null}
        </div>

        {showBody ? (
          <div className={HERO_LAYOUT.body}>
            {isInline ? (
              <div className={HERO_LAYOUT.identity}>
                <div className="hero-card__logo-spacer" aria-hidden />
                <div className={HERO_LAYOUT.textZone}>{bodyContent}</div>
                {socialLinks.length > 0 ? (
                  <SocialLinkButtons
                    links={socialLinks}
                    size="sm"
                    tone="hero"
                    className="hero-card__social hero-card__social--inline-row"
                  />
                ) : null}
              </div>
            ) : (
              <div className={HERO_LAYOUT.textZone}>{bodyContent}</div>
            )}
          </div>
        ) : null}
      </div>
    </motion.section>
  );
}
