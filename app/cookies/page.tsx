import { LegalDocument } from "@/components/marketing/legal-document";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { COOKIES_SECTIONS } from "@/lib/marketing/legal-content";

export const metadata = {
  title: "Cookie Policy — MyTeamSpace",
};

export default function CookiesRoute() {
  return (
    <MarketingLayout>
      <LegalDocument title="Cookie Policy" sections={COOKIES_SECTIONS} />
    </MarketingLayout>
  );
}
