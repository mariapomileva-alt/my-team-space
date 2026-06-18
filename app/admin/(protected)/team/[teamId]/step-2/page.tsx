import { redirect } from "next/navigation";

type Props = { params: Promise<{ teamId: string }> };

/** Legacy builder URL → /build */
export default async function TeamStep2Redirect({ params }: Props) {
  const { teamId } = await params;
  redirect(`/admin/team/${teamId}/build`);
}
