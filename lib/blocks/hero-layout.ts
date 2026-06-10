/**
 * Team hero — business-card layout (single source of truth).
 *
 * Mobile priority: readable title > correct overlap > balanced proportions.
 * Logo zone is logo-width only (~20%); text takes the rest (~80%).
 */

export const HERO_LAYOUT = {
  logoOverlapRatio: 0.5,

  identityGapMobile: "0.75rem",
  identityGapDesktop: "1rem",

  /** Mobile 76px; desktop 128–140px. */
  logoSizeMobile: "4.75rem",
  logoSizeDesktop: "8rem",
  logoSizeDesktopLg: "8.75rem",

  coverHeightMobile: "9.75rem",
  coverHeightDesktop: "15.625rem",
  coverHeightDesktopLg: "17.5rem",

  /** Wide card (container ≥540px) only — narrow cards use flex remainder. */
  logoZonePercent: "27%",
  containerBreakpointDesktop: "540px",
  containerBreakpointWide: "720px",

  textOffsetRatio: 0.42,

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
  logoFrame: "mts-media-frame--logo-hero-card",
} as const;
