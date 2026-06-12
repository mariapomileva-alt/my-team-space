import { normalizeTeamSlug, publicTeamPath } from "@/lib/teams/public-url";
import { permanentRedirect } from "next/navigation";

type Props = { params: Promise<{ teamSlug: string }> };

/** Old shared links: /team/{slug} → /{slug} */
export default async function LegacyTeamPathRedirect({ params }: Props) {
  const { teamSlug } = await params;
  permanentRedirect(publicTeamPath(normalizeTeamSlug(teamSlug)));
}
