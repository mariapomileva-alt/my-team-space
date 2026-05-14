import { HomeLanding } from "@/components/landing/home-landing";
import { redirect } from "next/navigation";

function firstString(v: string | string[] | undefined): string | undefined {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v[0]) return v[0];
  return undefined;
}

export default async function MarketingHome({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const oidcError = firstString(sp.error);
  const errorCode = firstString(sp.error_code);

  if (oidcError) {
    if (errorCode === "otp_expired" || oidcError === "access_denied") {
      redirect("/admin/login?error=link_expired");
    }
    redirect("/admin/login?error=auth_denied");
  }

  return <HomeLanding />;
}
