"use server";

import { assertTeamEditable } from "@/lib/billing/coach-can-edit";
import { assertTeamMember } from "@/lib/team-member-access";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TeamSpace } from "@/lib/types";
import { createServerSupabase } from "@/lib/supabase/server";
import { mapTeamRowToTeamSpace, type TeamDbRow } from "@/lib/teams/map-row";
import { publicTeamCacheTag, revalidatePublicTeamPaths } from "@/lib/teams/public";
import { STALE_TEAM_VERSION } from "@/lib/teams/save-version";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

async function getCoachContext() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return { supabase, user };
}

async function assertMember(supabase: SupabaseClient, userId: string, teamId: string) {
  await assertTeamMember(supabase, userId, teamId);
}

function revalidateTeamSurfaces(teamId: string, slug: string) {
  revalidatePublicTeamPaths(slug);
  revalidateTag(publicTeamCacheTag(slug), "default");
  revalidatePath(`/admin/team/${teamId}/step-1`);
  revalidatePath(`/admin/team/${teamId}/step-2`);
}

async function loadTeamRow(supabase: SupabaseClient, teamId: string) {
  const { data: teamRow, error } = await supabase.from("teams").select("*").eq("id", teamId).single();
  if (error || !teamRow) throw new Error("Team not found");
  return teamRow as TeamDbRow;
}

export async function loadTeamForBuilder(teamId: string): Promise<TeamSpace> {
  const { supabase, user } = await getCoachContext();
  await assertMember(supabase, user.id, teamId);
  const teamRow = await loadTeamRow(supabase, teamId);
  return mapTeamRowToTeamSpace(teamRow);
}

export async function saveTeamContent(
  teamId: string,
  team: TeamSpace,
  options?: { publish?: boolean },
): Promise<{ updatedAt: string }> {
  const { supabase, user } = await getCoachContext();
  const membership = await assertTeamMember(supabase, user.id, teamId);

  if (options?.publish && membership.role !== "coach") {
    throw new Error("Only the team owner can publish the page.");
  }

  if (membership.role === "coach") {
    await assertTeamEditable(supabase, user.id, teamId);
  }

  let payload = team;
  if (!payload.updatedAt?.trim()) {
    const current = await loadTeamRow(supabase, teamId);
    if (!current.updated_at) {
      throw new Error(STALE_TEAM_VERSION);
    }
    payload = { ...payload, updatedAt: current.updated_at };
  }

  const logoUrl = payload.logoUrl?.trim().slice(0, 2048) || null;
  const pageSettings = {
    ...(payload.pageSettings ?? {}),
    logoUrl,
  };

  const blocks = payload.blocks.map((block) => {
    if (block.type !== "hero") return block;
    const settings =
      block.settings && typeof block.settings === "object"
        ? { ...block.settings }
        : {};
    if (logoUrl) settings.teamPhotoUrl = logoUrl;
    return { ...block, settings };
  });

  const patch: Record<string, unknown> = {
    name: payload.name.slice(0, 200),
    tagline: payload.tagline?.slice(0, 220) ?? null,
    logo_url: logoUrl,
    ...(logoUrl ? { logo_path: null } : {}),
    theme_id: payload.themeId,
    primary_color: payload.primaryColor.slice(0, 32),
    secondary_color: payload.secondaryColor.slice(0, 32),
    blocks: blocks as unknown as object,
    page_visibility: payload.pageVisibility ?? "public",
    access_code: payload.accessCode?.slice(0, 64) ?? null,
    invite_token: payload.inviteToken?.slice(0, 64) ?? null,
    page_settings: pageSettings as object,
  };
  if (options?.publish) {
    patch.publish_status = "published";
  }

  const lockUpdatedAt = payload.updatedAt?.trim();
  let query = supabase.from("teams").update(patch).eq("id", teamId);
  if (lockUpdatedAt) {
    query = query.eq("updated_at", lockUpdatedAt);
  }

  let { data: row, error } = await query.select("slug, updated_at").maybeSingle();

  if (error?.message?.includes("publish_status") && options?.publish) {
    const { publish_status: _removed, ...withoutPublish } = patch;
    let retry = supabase.from("teams").update(withoutPublish).eq("id", teamId);
    if (lockUpdatedAt) retry = retry.eq("updated_at", lockUpdatedAt);
    ({ data: row, error } = await retry.select("slug, updated_at").maybeSingle());
    if (!error && row) {
      throw new Error(
        "Published in app, but publish_status column is missing — run supabase/RUN_COACH_SUBSCRIPTIONS.sql in Supabase.",
      );
    }
  }

  if (error) throw new Error(error.message);
  if (!row) {
    throw new Error(STALE_TEAM_VERSION);
  }

  if (row.slug) revalidateTeamSurfaces(teamId, row.slug);
  return { updatedAt: String(row.updated_at) };
}

export async function addScheduleEvent(teamId: string, formData: FormData) {
  const { supabase, user } = await getCoachContext();
  await assertMember(supabase, user.id, teamId);
  const title = String(formData.get("title") ?? "").trim();
  const starts = String(formData.get("starts_at") ?? "");
  const location = String(formData.get("location") ?? "").trim() || null;
  if (!title || !starts) throw new Error("Missing schedule fields");
  const { error } = await supabase.from("schedule_events").insert({
    team_id: teamId,
    title: title.slice(0, 200),
    starts_at: new Date(starts).toISOString(),
    location: location?.slice(0, 200) ?? null,
  });
  if (error) throw new Error(error.message);
  const { data: row } = await supabase.from("teams").select("slug").eq("id", teamId).single();
  if (row?.slug) revalidateTeamSurfaces(teamId, row.slug);
}

export async function addTeamUpdate(teamId: string, formData: FormData) {
  const { supabase, user } = await getCoachContext();
  await assertMember(supabase, user.id, teamId);
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!title) throw new Error("Title required");
  const { error } = await supabase.from("team_updates").insert({
    team_id: teamId,
    title: title.slice(0, 200),
    body: body.slice(0, 8000),
  });
  if (error) throw new Error(error.message);
  const { data: row } = await supabase.from("teams").select("slug").eq("id", teamId).single();
  if (row?.slug) revalidateTeamSurfaces(teamId, row.slug);
}

export async function addAchievement(teamId: string, formData: FormData) {
  const { supabase, user } = await getCoachContext();
  await assertMember(supabase, user.id, teamId);
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim() || null;
  if (!title) throw new Error("Title required");
  const { error } = await supabase.from("achievements").insert({
    team_id: teamId,
    title: title.slice(0, 200),
    body: body.slice(0, 4000),
    icon: icon?.slice(0, 8) ?? null,
  });
  if (error) throw new Error(error.message);
  const { data: row } = await supabase.from("teams").select("slug").eq("id", teamId).single();
  if (row?.slug) revalidateTeamSurfaces(teamId, row.slug);
}
