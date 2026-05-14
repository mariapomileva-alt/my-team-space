"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { TeamSpace } from "@/lib/types";
import { createServerSupabase } from "@/lib/supabase/server";
import { publicTeamCacheTag } from "@/lib/teams/public";
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

async function assertCoach(supabase: SupabaseClient, userId: string, teamId: string) {
  const { data, error } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("team_id", teamId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden");
}

function revalidatePublicTeamBySlug(slug: string) {
  revalidatePath(`/team/${slug}`);
  revalidateTag(publicTeamCacheTag(slug), "default");
}

export async function saveTeamContent(teamId: string, team: TeamSpace) {
  const { supabase, user } = await getCoachContext();
  await assertCoach(supabase, user.id, teamId);
  const { error } = await supabase
    .from("teams")
    .update({
      name: team.name.slice(0, 200),
      tagline: team.tagline?.slice(0, 220) ?? null,
      theme_id: team.themeId,
      primary_color: team.primaryColor.slice(0, 32),
      secondary_color: team.secondaryColor.slice(0, 32),
      blocks: team.blocks as unknown as object,
    })
    .eq("id", teamId);
  if (error) throw new Error(error.message);
  const { data: row } = await supabase.from("teams").select("slug").eq("id", teamId).single();
  if (row?.slug) revalidatePublicTeamBySlug(row.slug);
}

export async function addScheduleEvent(teamId: string, formData: FormData) {
  const { supabase, user } = await getCoachContext();
  await assertCoach(supabase, user.id, teamId);
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
  if (row?.slug) revalidatePublicTeamBySlug(row.slug);
}

export async function addTeamUpdate(teamId: string, formData: FormData) {
  const { supabase, user } = await getCoachContext();
  await assertCoach(supabase, user.id, teamId);
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
  if (row?.slug) revalidatePublicTeamBySlug(row.slug);
}

export async function addAchievement(teamId: string, formData: FormData) {
  const { supabase, user } = await getCoachContext();
  await assertCoach(supabase, user.id, teamId);
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
  if (row?.slug) revalidatePublicTeamBySlug(row.slug);
}
