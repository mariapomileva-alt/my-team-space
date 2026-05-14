import { TeamPublicPage } from "@/components/mts/team-public-page";
import { TeamSaaSExtras } from "@/components/mts/team-saas-extras";
import { getTeamBySlug } from "@/lib/data/teams";
import { bundleToTeamSpace, loadPublicTeamBySlug } from "@/lib/teams/public";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ teamSlug: string }> };

/** Public reads are cached (see `loadPublicTeamBySlug`); coaches call `revalidatePath` / `revalidateTag` on writes. */
export const revalidate = 120;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { teamSlug } = await params;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const team = getTeamBySlug(teamSlug);
    if (!team) return { title: "Team not found" };
    return { title: `${team.name} · MyTeamSpace`, description: team.tagline ?? team.name };
  }
  const bundle = await loadPublicTeamBySlug(teamSlug);
  if (!bundle) return { title: "Team not found" };
  return {
    title: `${bundle.team.name} · MyTeamSpace`,
    description: bundle.team.tagline ?? bundle.team.name,
  };
}

function InactiveTeamPage({ name }: { name: string }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-neutral-50 px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">MyTeamSpace</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900">{name}</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
        This team page is paused while the subscription is inactive. Check back soon, or contact the coach if you need
        access.
      </p>
      <Link href="/" className="mt-8 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white">
        Back to home
      </Link>
    </div>
  );
}

export default async function TeamPublicRoute({ params }: Props) {
  const { teamSlug } = await params;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const team = getTeamBySlug(teamSlug);
    if (!team) notFound();
    return <TeamPublicPage initialTeam={team} enableLocalPreview />;
  }

  const bundle = await loadPublicTeamBySlug(teamSlug);
  if (!bundle) notFound();

  const status = bundle.team.subscription_status;
  if (status !== "active" && status !== "trialing") {
    return <InactiveTeamPage name={bundle.team.name} />;
  }

  const teamSpace = bundleToTeamSpace(bundle);
  return (
    <TeamPublicPage
      initialTeam={teamSpace}
      enableLocalPreview={false}
      saasExtras={
        <TeamSaaSExtras schedule={bundle.schedule} updates={bundle.updates} achievements={bundle.achievements} />
      }
    />
  );
}
