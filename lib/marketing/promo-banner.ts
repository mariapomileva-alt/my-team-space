/**
 * Optional seasonal promo banner — edit here to enable campaigns sitewide.
 * Do not hardcode discount amounts; apply discounts in Lemon Squeezy checkout.
 */

export const PROMO_BANNER = {
  /** Set to true to show the banner across marketing pages. */
  enabled: false,
  emoji: "☀️",
  title: "Summer 2026 Offer",
  promoCode: "SUMMER2026",
  /** Shown after the promo code. Keep vague — no fixed discount amounts on the site. */
  messageAfterCode: "and get a special discount on your first year.",
} as const;

export function promoBannerMessage(config: typeof PROMO_BANNER = PROMO_BANNER): string {
  return `Use promo code ${config.promoCode} ${config.messageAfterCode}`;
}

export function isPromoBannerEnabled(config: typeof PROMO_BANNER = PROMO_BANNER): boolean {
  return config.enabled && Boolean(config.title.trim()) && Boolean(config.promoCode.trim());
}
