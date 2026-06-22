import type { BuilderBillingContext } from "@/lib/billing/builder-context-types";
import { isBillingConfigured } from "@/lib/billing/config";

/** Coaches can build and preview for free; checkout may be required to go live. */
export function publishRequiresCheckout(billing: BuilderBillingContext | null | undefined): boolean {
  if (!billing || !isBillingConfigured()) return false;
  if (billing.billingActive) return false;
  if (billing.hasLemonSubscription) return false;
  return true;
}

export const PUBLISH_CHECKOUT_MESSAGE =
  "Subscribe to publish your page for parents. You can keep editing and previewing for free.";
