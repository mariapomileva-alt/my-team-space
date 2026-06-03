import { resolveCoachCanEditTeam } from "@/lib/billing/coach-can-edit";
import {
  defaultBuilderBillingContext,
  type BuilderBillingContext,
} from "@/lib/billing/builder-context-types";
import { ensureCoachTeamEditAccess } from "@/lib/billing/ensure-team-access";
import { loadCoachEntitlements } from "@/lib/billing/coach-subscription";
import type { SupabaseClient } from "@supabase/supabase-js";

export type { BuilderBillingContext, BuilderLockReason } from "@/lib/billing/builder-context-types";

export async function loadBuilderBillingContext(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  team: {
    plan_edit_locked?: boolean | null;
    publish_status?: string | null;
  },
): Promise<BuilderBillingContext> {
  const publishStatus = team.publish_status === "published" ? "published" : "draft";

  try {
    const ent = await loadCoachEntitlements(supabase, userId);
    const planType = ent.subscription?.planType ?? "single_team";
    const isAcademy = planType === "academy";

    if (!isAcademy) {
      await ensureCoachTeamEditAccess(supabase, teamId);
    }

    const edit = await resolveCoachCanEditTeam(supabase, userId, teamId);
    const canEdit = edit.allowed;
    const billingActive = ent.billingActive;

    let lockReason: BuilderBillingContext["lockReason"] = "none";
    if (!canEdit) {
      if (edit.reason === "subscription_inactive" || !billingActive) {
        lockReason = "subscription_inactive";
      } else if (team.plan_edit_locked || edit.reason === "plan_locked") {
        lockReason = "team_plan_locked";
      } else {
        lockReason = "not_active_team";
      }
    }

    const showUpgradeCta = !isAcademy && ent.teamsUsed > 1;

    const { data: subRow, error: subErr } = await supabase
      .from("coach_subscriptions")
      .select("lemon_subscription_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (subErr) {
      console.error("[loadBuilderBillingContext] coach_subscriptions:", subErr.message);
    }

    const hasLemonSubscription = Boolean(
      (subRow?.lemon_subscription_id as string | undefined)?.trim(),
    );

    return {
      planLabel: ent.planLabel,
      teamsUsed: ent.teamsUsed,
      teamLimit: ent.teamLimit,
      billingActive,
      hasLemonSubscription,
      canEdit,
      lockReason,
      showUpgradeCta,
      publishStatus,
    };
  } catch (e) {
    console.error("[loadBuilderBillingContext]", e);
    return defaultBuilderBillingContext(publishStatus);
  }
}
