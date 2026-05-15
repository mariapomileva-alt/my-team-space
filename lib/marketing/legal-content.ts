import type { LegalSection } from "@/components/marketing/legal-document";

export const TERMS_SECTIONS: LegalSection[] = [
  {
    title: "Welcome to MyTeamSpace",
    paragraphs: [
      "By using MyTeamSpace, you agree to these Terms of Service.",
      "MyTeamSpace helps teams, academies, and communities manage schedules, communication, media, results, and team information.",
    ],
  },
  {
    title: "Accounts",
    paragraphs: ["Users are responsible for:"],
    list: [
      "keeping login information secure;",
      "maintaining accurate information;",
      "activity under their account.",
    ],
  },
  {
    title: "Team Content",
    paragraphs: ["Users may upload:"],
    list: ["schedules;", "photos;", "files;", "announcements;", "results;", "links;", "media."],
  },
  {
    title: "Ownership & prohibited content",
    paragraphs: ["Users keep ownership of their content.", "Users must not upload:"],
    list: [
      "illegal content;",
      "abusive content;",
      "copyrighted material without permission;",
      "malware or harmful software.",
    ],
  },
  {
    title: "Payments",
    paragraphs: [
      "Subscriptions renew automatically unless cancelled.",
      "Payments are processed securely through third-party payment providers.",
      "We do not store full payment card information.",
      "Prices may change in the future with notice provided in advance.",
    ],
  },
  {
    title: "Children & Team Safety",
    paragraphs: [
      "MyTeamSpace may be used by youth teams and communities.",
      "Coaches, parents, and organizations are responsible for obtaining permissions for photos and personal information where required by law.",
    ],
  },
  {
    title: "Limitation of Liability",
    paragraphs: [
      'MyTeamSpace is provided "as is."',
      "We are not responsible for:",
    ],
    list: ["indirect damages;", "loss of data;", "interruptions caused by third-party services."],
  },
  {
    title: "Contact",
    paragraphs: ["support@myteamspace.app"],
  },
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    title: "Introduction",
    paragraphs: [
      "MyTeamSpace respects your privacy.",
      "This Privacy Policy explains what information we collect and how we use it.",
    ],
  },
  {
    title: "Information We Collect",
    paragraphs: ["We may collect:"],
    list: [
      "names;",
      "email addresses;",
      "profile photos;",
      "uploaded media;",
      "team information;",
      "usage analytics;",
      "browser/device information.",
    ],
  },
  {
    title: "How We Use Information",
    paragraphs: ["We use information to:", "We do not sell personal information."],
    list: [
      "provide the platform;",
      "improve features;",
      "manage subscriptions;",
      "provide support;",
      "maintain security.",
    ],
  },
  {
    title: "Cookies & Analytics",
    paragraphs: [
      "We may use cookies and analytics tools to improve platform experience and performance.",
      "Users may disable cookies in browser settings.",
    ],
  },
  {
    title: "Third-Party Services",
    paragraphs: ["We may use third-party providers for:"],
    list: ["payments;", "hosting;", "analytics;", "authentication;", "media storage."],
  },
  {
    title: "User Rights",
    paragraphs: [
      "Users may request:",
      "Requests: support@myteamspace.app",
    ],
    list: ["access to their data;", "correction of their data;", "deletion of their data."],
  },
];

export const COOKIES_SECTIONS: LegalSection[] = [
  {
    title: "Cookie Policy",
    paragraphs: ["MyTeamSpace uses cookies to:"],
    list: [
      "keep users signed in;",
      "improve performance;",
      "remember preferences;",
      "analyze usage.",
    ],
  },
  {
    title: "Managing cookies",
    paragraphs: ["Users can manage cookies through browser settings."],
  },
];
