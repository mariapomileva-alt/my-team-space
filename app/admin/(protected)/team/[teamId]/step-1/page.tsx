import { redirect } from "next/navigation";

type Props = { params: Promise<{ teamId: string }> };

/** Step 1 merged into the modular page builder (step 2). */
export default async function TeamStep1Page({ params }: Props) {
  const { teamId } = await params;
  redirect(`/admin/team/${teamId}/step-2`);
}
