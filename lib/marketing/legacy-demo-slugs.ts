/** Old local mock team URLs — redirect to the portfolio examples page in production. */
export const LEGACY_DEMO_SLUGS = ["city-juniors", "riga-swim", "dance-kids"] as const;

export type LegacyDemoSlug = (typeof LEGACY_DEMO_SLUGS)[number];

export function isLegacyDemoSlug(slug: string): slug is LegacyDemoSlug {
  return (LEGACY_DEMO_SLUGS as readonly string[]).includes(slug.trim().toLowerCase());
}
