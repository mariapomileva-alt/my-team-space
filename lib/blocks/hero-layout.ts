/**
 * Team hero — business-card layout (single source of truth).
 *
 * Structure:
 *   [cover photo + Live badge]
 *   [logo 50/50 overlap] [team name + subtitle + city]
 *   [description, motto, social]
 *
 * Do not center logo and text separately. They are one identity block.
 */

export const HERO_LAYOUT = {
  /** Logo straddles cover/white boundary: half on each. */
  logoOverlapRatio: 0.5,

  /** Gap between logo and text (12–16px). */
  identityGapMobile: "0.75rem",
  identityGapDesktop: "0.875rem",

  /** Logo square size — mobile ~56px, tablet ~68px, desktop ~76px. */
  logoSizeMobile: "3.5rem",
  logoSizeTablet: "4.25rem",
  logoSizeDesktop: "4.75rem",

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
