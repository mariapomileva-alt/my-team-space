"use server";

import { startCheckoutForPlan } from "@/app/admin/lemon-actions";
import type { PlanType } from "@/lib/billing/types";

/** Form action: <input type="hidden" name="plan" value="single_team|academy" /> */
export async function startCheckoutFormAction(formData: FormData) {
  const plan = String(formData.get("plan") ?? "").trim();
  if (plan !== "single_team" && plan !== "academy") {
    throw new Error("Invalid plan");
  }
  await startCheckoutForPlan(plan as PlanType);
}
