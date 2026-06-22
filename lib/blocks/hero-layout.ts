/**
 * Team hero — approved Header Variants reference (6 layouts).
 * Content is identical across variants — only logo + name placement changes.
 * Container queries on `.hero-card` — not viewport @media.
 */

/** Approved hero layouts — see Header Variants reference. */
export type HeroLayoutVariant =
  | "inside_header"
  | "overlap_large"
  | "circle_on_header"
  | "inline"
  | "square"
  | "minimal";

export const HERO_LAYOUT_VARIANTS: readonly HeroLayoutVariant[] = [
  "inside_header",
  "overlap_large",
  "circle_on_header",
  "inline",
  "square",
  "minimal",
] as const;

export const DEFAULT_HERO_VARIANT: HeroLayoutVariant = "overlap_large";

const LEGACY_VARIANT_MAP: Record<string, HeroLayoutVariant> = {
  stack: "overlap_large",
  center: "overlap_large",
  overlay: "inside_header",
};

export function resolveHeroVariant(value: unknown): HeroLayoutVariant {
  if (HERO_LAYOUT_VARIANTS.includes(value as HeroLayoutVariant)) {
    return value as HeroLayoutVariant;
  }
  if (typeof value === "string" && value in LEGACY_VARIANT_MAP) {
    return LEGACY_VARIANT_MAP[value]!;
  }
  return DEFAULT_HERO_VARIANT;
}

export const HERO_VARIANT_META: Record<
  HeroLayoutVariant,
  { label: string; hint: string; number: number }
> = {
  inside_header: {
    number: 1,
    label: "Logo inside header",
    hint: "Logo and team name live on the cover photo.",
  },
  overlap_large: {
    number: 2,
    label: "Logo overlapping header",
    hint: "Large logo centered on the cover edge, name below.",
  },
  circle_on_header: {
    number: 3,
    label: "Circular logo on header",
    hint: "Logo in a soft circle on the photo, name beside it.",
  },
  inline: {
    number: 4,
    label: "Logo left, text right",
    hint: "Compact club card — logo overlaps, name sits to the right.",
  },
  square: {
    number: 5,
    label: "Square logo layout",
    hint: "Square logo frame for complex marks, text to the right.",
  },
  minimal: {
    number: 6,
    label: "Minimal text-focused",
    hint: "Name on the photo — maximum air, no logo block.",
  },
};

export function heroVariantClass(variant: HeroLayoutVariant): string {
  return `hero-card--${variant}`;
}

export type HeroAutoInput = {
  teamName: string;
  logoSrc?: string;
  tagline?: string;
  city?: string;
};

/** Pick a header layout from logo + name — no manual design decision during setup. */
export function pickHeroVariant(input: HeroAutoInput): HeroLayoutVariant {
  const name = input.teamName.trim();
  const nameLen = name.length;
  const hasLogo = Boolean(input.logoSrc?.trim());
  const hasSecondary = Boolean(input.tagline?.trim() || input.city?.trim());

  if (!hasLogo) return "minimal";
  if (nameLen > 26) return "inline";
  if (nameLen > 16 && hasSecondary) return "inline";
  if (nameLen > 16) return "circle_on_header";
  if (!hasSecondary && nameLen <= 12) return "overlap_large";
  return hasSecondary ? "circle_on_header" : "overlap_large";
}

export function resolveHeroVariantForTeam(
  stored: unknown,
  team: { name: string; tagline?: string; logoUrl?: string },
  hero: { heroLayout?: unknown; teamPhotoUrl?: string; city?: string },
): HeroLayoutVariant {
  if (stored != null && stored !== "") {
    const resolved = resolveHeroVariant(stored);
    if (HERO_LAYOUT_VARIANTS.includes(resolved)) return resolved;
  }
  const logoSrc = team.logoUrl?.trim() || hero.teamPhotoUrl?.trim();
  return pickHeroVariant({
    teamName: team.name,
    logoSrc,
    tagline: team.tagline,
    city: hero.city,
  });
}

export const HERO_LAYOUT = {
  logoOverlapRatio: 0.5,
  identityGapMobile: "0.8125rem",
  identityGapDesktop: "0.9375rem",
  logoSizeMobile: "4.75rem",
  logoSizeDesktop: "6rem",
  logoSizeDesktopLg: "6.25rem",
  logoRadius: "9999px",
  coverHeightMobile: "10.5rem",
  coverHeightMax: "11.25rem",
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
  coverIdentity: "hero-card__cover-identity",
  coverTitle: "hero-card__cover-title",
  overlayText: "hero-card__overlay-text",
  logoFrame: "mts-media-frame--logo-hero-card",
} as const;
