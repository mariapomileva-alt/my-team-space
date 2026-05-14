import { addAchievement, addScheduleEvent, addTeamUpdate } from "./server-actions";
import { TeamAdminClient } from "./team-admin-client";
import { requireAuth } from "@/lib/auth/require-auth";
import { mapTeamRowToTeamSpace, publicLogoUrlFromPath, type TeamDbRow } from "@/lib/teams/map-row";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ teamId: string }> };

export const dynamic = "force-dynamic";

export default async function AdminTeamEditorPage({ params }: Props) {
  const { teamId } = await params;
  const { supabase, user } = await requireAuth();

  const { data: mem } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!mem) notFound();

  const { data: teamRow } = await supabase.from("teams").select("*").eq("id", teamId).single();
  if (!teamRow) notFound();

  const team = teamRow as TeamDbRow;
  const teamSpace = mapTeamRowToTeamSpace(team, publicLogoUrlFromPath(team.logo_path));

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const publicUrl = `${proto}://${host}/team/${team.slug}`;

  const [{ data: schedule }, { data: updates }, { data: achievements }] = await Promise.all([
    supabase.from("schedule_events").select("id, title, starts_at, location").eq("team_id", teamId).order("starts_at", { ascending: true }).limit(20),
    supabase.from("team_updates").select("id, title, body, published_at").eq("team_id", teamId).order("published_at", { ascending: false }).limit(20),
    supabase.from("achievements").select("id, title, body, icon, created_at").eq("team_id", teamId).order("created_at", { ascending: false }).limit(20),
  ]);

  return (
    <>
      <TeamAdminClient teamId={teamId} initialTeam={teamSpace} publicUrl={publicUrl} />

      <div className="mx-auto max-w-3xl space-y-8 px-4 pb-20 sm:px-8">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Schedule</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            {(schedule ?? []).map((s) => (
              <li key={s.id}>
                {s.title} — {new Date(s.starts_at).toLocaleString()}
              </li>
            ))}
          </ul>
          <form action={addScheduleEvent.bind(null, teamId)} className="mt-4 grid gap-2 sm:grid-cols-2">
            <input name="title" placeholder="Training" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm" required />
            <input name="starts_at" type="datetime-local" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm" required />
            <input name="location" placeholder="Field A" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm sm:col-span-2" />
            <button type="submit" className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white sm:col-span-2">
              Add event
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Updates</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {(updates ?? []).map((u) => (
              <li key={u.id} className="rounded-xl bg-zinc-50 px-3 py-2">
                <span className="font-semibold">{u.title}</span>
                <p className="text-zinc-600">{u.body}</p>
              </li>
            ))}
          </ul>
          <form action={addTeamUpdate.bind(null, teamId)} className="mt-4 space-y-2">
            <input name="title" placeholder="Title" className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" required />
            <textarea name="body" placeholder="Message for parents" className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" rows={3} />
            <button type="submit" className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
              Post update
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Achievements</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {(achievements ?? []).map((a) => (
              <li key={a.id} className="rounded-xl bg-zinc-50 px-3 py-2">
                {a.icon ? <span className="mr-2">{a.icon}</span> : null}
                <span className="font-semibold">{a.title}</span>
                <p className="text-zinc-600">{a.body}</p>
              </li>
            ))}
          </ul>
          <form action={addAchievement.bind(null, teamId)} className="mt-4 grid gap-2 sm:grid-cols-3">
            <input name="title" placeholder="Title" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm sm:col-span-2" required />
            <input name="icon" placeholder="⭐" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm" />
            <textarea name="body" placeholder="Details" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm sm:col-span-3" rows={2} />
            <button type="submit" className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white sm:col-span-3">
              Add achievement
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
