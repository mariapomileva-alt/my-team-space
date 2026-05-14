import { permanentRedirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

/** Legacy URLs: /{slug} → /team/{slug} */
export default async function LegacySlugRedirect({ params }: Props) {
  const { slug } = await params;
  permanentRedirect(`/team/${slug}`);
}
