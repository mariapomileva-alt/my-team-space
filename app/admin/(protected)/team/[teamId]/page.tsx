import { redirect } from "next/navigation";

type Props = { params: Promise<{ teamId: string }> };

/** Default team editor entry → step 1 (name, colors, block picker). */
export default async function AdminTeamIndexPage({ params }: Props) {
  const { teamId } = await params;
  redirect(`/admin/team/${teamId}/step-1`);
}
