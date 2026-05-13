import { TeamPublicPage } from "@/components/mts/team-public-page";
import { getAllTeamSlugs, getTeamBySlug } from "@/lib/data/teams";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllTeamSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) return { title: "Team not found" };
  return {
    title: `${team.name} · MyTeamSpace`,
    description: team.tagline ?? team.name,
  };
}

export default async function TeamSpacePage({ params }: Props) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) notFound();

  return <TeamPublicPage initialTeam={team} />;
}
