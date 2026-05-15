import { LegalDocument } from "@/components/marketing/legal-document";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { TERMS_SECTIONS } from "@/lib/marketing/legal-content";

export const metadata = {
  title: "Terms of Service — MyTeamSpace",
};

export default function TermsRoute() {
  return (
    <MarketingLayout>
      <LegalDocument title="Terms of Service" sections={TERMS_SECTIONS} />
    </MarketingLayout>
  );
}
