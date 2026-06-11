import { MtsCoverBanner, MtsTeamLogo } from "@/components/mts/media/mts-media";
import { SocialLinkButtons, type SocialLinkItem } from "@/components/social/social-link-buttons";
import { HERO_LAYOUT } from "@/lib/blocks/hero-layout";
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
};

/**
 * Business-card team header. Logo overlaps cover/white 50/50; name sits right of logo.
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
}: TeamHeroCardProps) {
  const hasCover = Boolean(coverSrc?.trim());
  const hasDetails = Boolean(description?.trim() || motto?.trim() || socialLinks.length > 0);

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

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative">
      <div
        className={cn(
          HERO_LAYOUT.root,
          "overflow-hidden rounded-[1.35rem] border border-neutral-200/90 bg-white shadow-[0_4px_28px_-14px_rgba(15,23,42,0.12)] ring-1 ring-neutral-100/80",
        )}
      >
        <div className={HERO_LAYOUT.cover}>
          {hasCover ? (
            <>
              <MtsCoverBanner src={coverSrc} />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent"
                aria-hidden
              />
            </>
          ) : (
            <MtsCoverBanner fallbackClassName="hero-cover__fallback" />
          )}
          <div className="absolute right-3 top-3 z-20">{liveBadge}</div>

          <div className={HERO_LAYOUT.identity}>
            <div className={HERO_LAYOUT.logoZone}>
              <MtsTeamLogo src={logoSrc} teamName={teamName} className={HERO_LAYOUT.logoFrame} />
            </div>
            <div className={HERO_LAYOUT.textZone}>
              <h1 className={HERO_LAYOUT.title}>{teamName}</h1>
              {tagline?.trim() ? <p className={HERO_LAYOUT.subtitle}>{tagline.trim()}</p> : null}
              {city?.trim() ? <p className={HERO_LAYOUT.city}>📍 {city.trim()}</p> : null}
            </div>
          </div>
        </div>

        <div className={HERO_LAYOUT.body}>
          {hasDetails ? (
            <div className={HERO_LAYOUT.details}>
              {description?.trim() ? (
                <p className="text-[13px] leading-relaxed text-[color:var(--mts-muted)]">{description.trim()}</p>
              ) : null}
              {motto?.trim() ? (
                <p
                  className={cn(
                    "text-[14px] font-semibold leading-snug text-[color:var(--mts-primary)]",
                    description?.trim() ? "mt-2" : "mt-0",
                  )}
                >
                  “{motto.trim()}”
                </p>
              ) : null}
              {socialLinks.length > 0 ? <SocialLinkButtons links={socialLinks} className="mt-3" /> : null}
            </div>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}
