import { AdminDashboard } from "./admin-dashboard";
import { getAllTeamSlugs, getTeamBySlug } from "@/lib/data/teams";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllTeamSlugs().map((slug) => ({ slug }));
}

export default async function AdminTeamPage({ params }: Props) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) notFound();
  return <AdminDashboard initialTeam={team} />;
}
