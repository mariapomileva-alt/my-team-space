import type { PlanType } from "@/lib/billing/types";

export type LemonCheckoutRequestInput = {
  plan: PlanType;
  userId: string;
  email?: string | null;
  storeId: string;
  variantId: string;
  appUrl: string;
};

/** Pure Lemon checkout payload — no network, no auth. */
export function buildLemonCheckoutRequestBody(input: LemonCheckoutRequestInput) {
  const checkout_data: Record<string, unknown> = {
    custom: {
      user_id: input.userId,
      plan_type: input.plan,
    },
  };
  if (input.email?.trim()) {
    checkout_data.email = input.email.trim();
  }

  return {
    data: {
      type: "checkouts",
      attributes: {
        product_options: {
          redirect_url: `${input.appUrl.replace(/\/$/, "")}/admin?checkout=success&plan=${input.plan}`,
        },
        checkout_data,
      },
      relationships: {
        store: { data: { type: "stores", id: String(input.storeId) } },
        variant: { data: { type: "variants", id: String(input.variantId) } },
      },
    },
  };
}

export function readCheckoutVariantId(body: ReturnType<typeof buildLemonCheckoutRequestBody>): string {
  return body.data.relationships.variant.data.id;
}

export function readCheckoutPlanType(body: ReturnType<typeof buildLemonCheckoutRequestBody>): PlanType {
  const custom = body.data.attributes.checkout_data.custom as { plan_type?: unknown };
  const raw = custom.plan_type;
  if (raw !== "single_team" && raw !== "academy") {
    throw new Error(`Unexpected checkout plan_type: ${String(raw)}`);
  }
  return raw;
}
