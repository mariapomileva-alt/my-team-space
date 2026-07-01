import { TeamPublicPage } from "@/components/mts/team-public-page";
import { TeamSaaSExtras } from "@/components/mts/team-saas-extras";
import { getTeamBySlug } from "@/lib/data/teams";
import { isCurrentUserTeamCoach } from "@/lib/teams/is-team-coach";
import { bundleToTeamSpace, loadPublicTeamBySlug } from "@/lib/teams/public";
import { isReservedTeamSlug, normalizeTeamSlug } from "@/lib/teams/public-url";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

/** Public reads are cached (see `loadPublicTeamBySlug`); coaches call `revalidatePath` / `revalidateTag` on writes. */
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const teamSlug = normalizeTeamSlug(slug);
  if (isReservedTeamSlug(teamSlug)) return { title: "Not found" };

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

function CoachPreviewBanner({ notLive }: { notLive?: boolean }) {
  return (
    <div
      className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950"
      role="status"
    >
      <span className="font-semibold">Coach preview</span>
      <span className="text-amber-900/80">
        {notLive
          ? " — parents cannot see this until you publish."
          : " — subscribe to keep this page live for everyone."}
      </span>
      <Link href="/admin" className="ml-2 font-semibold underline underline-offset-2">
        Open builder
      </Link>
    </div>
  );
}

function NotLiveTeamPage({ name }: { name: string }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-neutral-50 px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">MyTeamSpace</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900">{name}</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
        This team page is not live yet. The coach is still setting things up — check back soon.
      </p>
      <Link href="/" className="mt-8 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white">
        Back to home
      </Link>
    </div>
  );
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
  const { slug } = await params;
  const teamSlug = normalizeTeamSlug(slug);
  if (isReservedTeamSlug(teamSlug)) notFound();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const team = getTeamBySlug(teamSlug);
    if (!team) notFound();
    return <TeamPublicPage initialTeam={team} enableLocalPreview />;
  }

  const bundle = await loadPublicTeamBySlug(teamSlug);
  if (!bundle) notFound();

  const status = bundle.team.subscription_status;
  const isPublished = bundle.team.publish_status === "published";
  const isPublic = status === "active" || status === "trialing";
  const isCoach = await isCurrentUserTeamCoach(bundle.team.id);

  if (!isPublished) {
    if (isCoach) {
      const teamSpace = bundleToTeamSpace(bundle);
      const enabledTypes = new Set(teamSpace.blocks.filter((b) => b.enabled).map((b) => b.type));
      const showDbSchedule = !enabledTypes.has("schedule") && !enabledTypes.has("calendar");
      const showDbUpdates = !enabledTypes.has("team_feed");
      const showDbAchievements = !enabledTypes.has("achievements");
      return (
        <>
          <CoachPreviewBanner notLive />
          <TeamPublicPage
            initialTeam={teamSpace}
            enableLocalPreview={false}
            saasExtras={
              <TeamSaaSExtras
                team={teamSpace}
                schedule={showDbSchedule ? bundle.schedule : []}
                updates={showDbUpdates ? bundle.updates : []}
                achievements={showDbAchievements ? bundle.achievements : []}
              />
            }
          />
        </>
      );
    }
    return <NotLiveTeamPage name={bundle.team.name} />;
  }

  const coachPreview = !isPublic && isCoach;

  if (!isPublic && !coachPreview) {
    return <InactiveTeamPage name={bundle.team.name} />;
  }

  const teamSpace = bundleToTeamSpace(bundle);
  const enabledTypes = new Set(teamSpace.blocks.filter((b) => b.enabled).map((b) => b.type));
  const showDbSchedule = !enabledTypes.has("schedule") && !enabledTypes.has("calendar");
  const showDbUpdates = !enabledTypes.has("team_feed");
  const showDbAchievements = !enabledTypes.has("achievements");
  return (
    <>
      {coachPreview ? <CoachPreviewBanner /> : null}
      <TeamPublicPage
        initialTeam={teamSpace}
        enableLocalPreview={false}
        saasExtras={
          <TeamSaaSExtras
            team={teamSpace}
            schedule={showDbSchedule ? bundle.schedule : []}
            updates={showDbUpdates ? bundle.updates : []}
            achievements={showDbAchievements ? bundle.achievements : []}
          />
        }
      />
    </>
  );
}
