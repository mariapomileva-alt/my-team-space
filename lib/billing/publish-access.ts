import type { BuilderBillingContext } from "@/lib/billing/builder-context-types";
import { isBillingConfigured } from "@/lib/billing/config";
import { loadBuilderBillingContext } from "@/lib/billing/load-builder-billing";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Coaches can build and preview for free; checkout may be required to go live.
 * Same rules on client (builder) and server (saveTeamContent publish).
 */
export function publishRequiresCheckout(billing: BuilderBillingContext | null | undefined): boolean {
  if (!billing || !isBillingConfigured()) return false;
  if (billing.billingActive) return false;
  if (billing.hasLemonSubscription) return false;
  return true;
}

export const PUBLISH_CHECKOUT_MESSAGE =
  "Subscribe to publish your page for parents. You can keep editing and previewing for free.";

export const PUBLISH_CHECKOUT_ERROR_CODE = "PUBLISH_REQUIRES_CHECKOUT";

/** Server-only: block publish when client billing gate would block. Autosave is unaffected. */
export async function assertCanPublishTeam(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
): Promise<void> {
  if (!isBillingConfigured()) return;

  const billing = await loadBuilderBillingContext(supabase, userId, teamId, {});
  if (publishRequiresCheckout(billing)) {
    throw new Error(`${PUBLISH_CHECKOUT_ERROR_CODE}: ${PUBLISH_CHECKOUT_MESSAGE}`);
  }
}
