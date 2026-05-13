import { AdminDashboard } from "./admin-dashboard";
import { getTeamBySlug } from "@/lib/data/teams";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function AdminTeamPage({ params }: Props) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) notFound();
  return <AdminDashboard initialTeam={team} />;
}
