import { TeamStep2Client } from "../team-step2-client";
import { loadBuilderBillingContext } from "@/lib/billing/load-builder-billing";
import type { BuilderBillingContext } from "@/lib/billing/builder-context-types";
import { requireAuth } from "@/lib/auth/require-auth";
import { mapTeamRowToTeamSpace, type TeamDbRow } from "@/lib/teams/map-row";
import { publicTeamUrl } from "@/lib/teams/public-url";
import type { TeamSpace } from "@/lib/types";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ teamId: string }> };

export const dynamic = "force-dynamic";

export default async function TeamStep2Page({ params }: Props) {
  const { teamId } = await params;

  try {
    const { supabase, user } = await requireAuth();

    const { data: mem, error: memErr } = await supabase
      .from("team_members")
      .select("team_id, role")
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (memErr) {
      console.error("[TeamStep2Page] team_members:", memErr.message);
      return <Step2LoadError message="Could not verify team access. Try signing in again." />;
    }
    if (!mem) notFound();

    const memberRole = (mem.role === "assistant" ? "assistant" : "coach") as "coach" | "assistant";

    const { data: teamRow, error: teamErr } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

    if (teamErr) {
      console.error("[TeamStep2Page] teams:", teamErr.message);
      if (teamErr.code === "PGRST116") notFound();
      return (
        <Step2LoadError message="Could not load this team. If you just deployed billing changes, run supabase/RUN_COACH_SUBSCRIPTIONS.sql in Supabase." />
      );
    }
    if (!teamRow) notFound();

    const team = teamRow as TeamDbRow;
    let teamSpace: TeamSpace;
    try {
      teamSpace = mapTeamRowToTeamSpace(team);
    } catch (e) {
      console.error("[TeamStep2Page] mapTeamRowToTeamSpace:", e);
      return (
        <Step2LoadError message="Team page data looks invalid. Contact support or try again from the dashboard." />
      );
    }

    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const proto = h.get("x-forwarded-proto") ?? "http";
    const publicUrl = publicTeamUrl(`${proto}://${host}`, team.slug as string);

    let billing: BuilderBillingContext | null = null;
    if (memberRole === "coach") {
      billing = await loadBuilderBillingContext(supabase, user.id, teamId, team);
    }

    return (
      <TeamStep2Client
        teamId={teamId}
        initialTeam={teamSpace}
        publicUrl={publicUrl}
        memberRole={memberRole}
        billing={billing}
      />
    );
  } catch (e) {
    console.error("[TeamStep2Page]", e);
    const message =
      e instanceof Error && e.message.includes("Supabase")
        ? "App configuration error. Check Supabase env vars on the server."
        : "Something went wrong loading the team builder.";
    return <Step2LoadError message={message} />;
  }
}

function Step2LoadError({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-16 text-center text-zinc-900">
      <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Team builder</p>
      <h1 className="mt-3 max-w-md text-xl font-bold tracking-tight">This page couldn&apos;t load</h1>
      <p className="mt-2 max-w-sm text-sm text-zinc-600">{message}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/admin"
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Back to dashboard
        </Link>
        <a
          href="/admin"
          className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
        >
          Reload
        </a>
      </div>
    </div>
  );
}
