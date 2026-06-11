/**
 * Team hero — layout system (single source of truth).
 * One card, four logo + name compositions. Content never changes — only placement.
 * Container queries on `.hero-card` — not viewport @media.
 */

/** Logo + team-name composition chosen in the builder (Hero settings). */
export type HeroLayoutVariant = "stack" | "inline" | "center" | "overlay";

export const HERO_LAYOUT_VARIANTS: readonly HeroLayoutVariant[] = [
  "stack",
  "inline",
  "center",
  "overlay",
] as const;

/** Default for new teams and legacy heroes without an explicit choice. */
export const DEFAULT_HERO_VARIANT: HeroLayoutVariant = "stack";

export function resolveHeroVariant(value: unknown): HeroLayoutVariant {
  return HERO_LAYOUT_VARIANTS.includes(value as HeroLayoutVariant)
    ? (value as HeroLayoutVariant)
    : DEFAULT_HERO_VARIANT;
}

export const HERO_VARIANT_META: Record<
  HeroLayoutVariant,
  { label: string; hint: string; bestFor: string }
> = {
  stack: {
    label: "Logo left, name below",
    hint: "Facebook-style — logo overlaps the cover, name sits underneath.",
    bestFor: "Communities, clubs, academies",
  },
  inline: {
    label: "Logo left, name beside",
    hint: "Logo overlaps the cover, name and details sit to the right.",
    bestFor: "Pro teams & sports clubs",
  },
  center: {
    label: "Logo centered",
    hint: "Logo centered on the cover edge, name centered below.",
    bestFor: "Academies, schools, studios",
  },
  overlay: {
    label: "Minimal overlay",
    hint: "Logo inside the photo, name over the gradient — no white band.",
    bestFor: "Modern brands & creative teams",
  },
};

/** Root modifier class for a variant: `hero-card--stack`, etc. */
export function heroVariantClass(variant: HeroLayoutVariant): string {
  return `hero-card--${variant}`;
}

export const HERO_LAYOUT = {
  /** Logo center sits on cover bottom edge — 50% on photo, 50% on white. */
  logoOverlapRatio: 0.5,

  identityGapMobile: "0.8125rem",
  identityGapDesktop: "0.9375rem",

  logoSizeMobile: "4.75rem",
  logoSizeDesktop: "7rem",
  logoSizeDesktopLg: "7.5rem",

  coverHeightMobile: "10.5rem",
  coverHeightDesktop: "15.5rem",
  coverHeightDesktopLg: "17rem",

  logoZonePercent: "25%",
  containerBreakpointDesktop: "540px",
  containerBreakpointWide: "720px",

  titleMaxLines: 2,
  subtitleMaxLines: 1,

  root: "hero-card",
  cover: "hero-card__cover",
  body: "hero-card__body",
  identity: "hero-card__identity",
  logoZone: "hero-card__logo-zone",
  textZone: "hero-card__text-zone",
  title: "hero-card__title",
  subtitle: "hero-card__subtitle",
  city: "hero-card__city",
  details: "hero-card__details",
  /** Title group painted over the cover (overlay variant only). */
  overlayText: "hero-card__overlay-text",
  logoFrame: "mts-media-frame--logo-hero-card",
} as const;
