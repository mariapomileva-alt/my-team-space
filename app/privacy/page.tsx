import { LegalDocument } from "@/components/marketing/legal-document";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { PRIVACY_SECTIONS } from "@/lib/marketing/legal-content";

export const metadata = {
  title: "Privacy Policy — MyTeamSpace",
};

export default function PrivacyRoute() {
  return (
    <MarketingLayout>
      <LegalDocument title="Privacy Policy" sections={PRIVACY_SECTIONS} />
    </MarketingLayout>
  );
}
