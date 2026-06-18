import { ShowcaseTeamGallery } from "@/components/showcase/showcase-team-gallery";
import { SHOWCASE_TEAMS } from "@/lib/showcase/demo-teams";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team previews — MyTeamSpace constructor",
  description: "Six sport team page previews built with the real MyTeamSpace builder components.",
};

export default function ShowcaseTeamsPage() {
  return <ShowcaseTeamGallery teams={SHOWCASE_TEAMS} />;
}
