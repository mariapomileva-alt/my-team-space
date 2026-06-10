/**
 * Team hero — business-card layout (single source of truth).
 *
 * Structure:
 *   [cover photo + Live badge]
 *   [logo 50/50 overlap] [team name + subtitle + city]
 *   [description, motto, social]
 *
 * Logo center sits on the cover bottom edge. Do not center logo and text separately.
 */

export const HERO_LAYOUT = {
  /** Logo straddles cover/white boundary: half on each. */
  logoOverlapRatio: 0.5,

  /** Gap between logo and text (12–16px). */
  identityGapMobile: "0.875rem",
  identityGapDesktop: "1rem",

  /** Logo square — mobile 96px, desktop 128–140px. */
  logoSizeMobile: "6rem",
  logoSizeDesktop: "8rem",
  logoSizeDesktopLg: "8.75rem",

  /** Cover height — mobile ~160px, desktop ~250–280px. */
  coverHeightMobile: "10rem",
  coverHeightDesktop: "15.625rem",
  coverHeightDesktopLg: "17.5rem",

  /** Content width split. */
  logoZonePercent: "27%",
  textZonePercent: "73%",

  /** Text starts in middle-lower half of logo (not flush to bottom). */
  textOffsetRatio: 0.42,

  /** Title/subtitle clamps. */
  titleMaxLines: 2,
  subtitleMaxLines: 1,

  /** CSS class names — use these, do not invent parallel hero layouts. */
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
