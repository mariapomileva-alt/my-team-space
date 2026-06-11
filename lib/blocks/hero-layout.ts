/**
 * Team hero — business-card layout (single source of truth).
 * Container queries on `.hero-card` — not viewport @media.
 */

export const HERO_LAYOUT = {
  logoOverlapRatio: 0.5,
  /** Extra lift so logo center sits on cover/content boundary (~17px). */
  logoLift: "1.0625rem",

  identityGapMobile: "0.8125rem",
  identityGapDesktop: "0.9375rem",

  logoSizeMobile: "4.75rem",
  logoSizeDesktop: "7rem",
  logoSizeDesktopLg: "7.5rem",

  coverHeightMobile: "9.5rem",
  coverHeightDesktop: "14.5rem",
  coverHeightDesktopLg: "16rem",

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
  logoFrame: "mts-media-frame--logo-hero-card",
} as const;
