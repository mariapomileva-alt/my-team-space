/** Coach-facing copy for the in-builder “How it works” guide. Keep in sync with docs/BUILDER_GUIDELINE.md */

export type CoachHelpSection = {
  id: string;
  emoji: string;
  title: string;
  bullets: string[];
};

const CORE_SECTIONS: CoachHelpSection[] = [
  {
    id: "one-link",
    emoji: "🔗",
    title: "One calm link for parents",
    bullets: [
      "Build your page here — parents open one URL, no app to install.",
      "Every save updates what they see instantly.",
      "Publish when name + logo are ready, then share the link or QR.",
    ],
  },
  {
    id: "blocks",
    emoji: "🧩",
    title: "Turn blocks on like Lego",
    bullets: [
      "Schedule, gallery, results, polls — enable only what your team needs.",
      "Empty sections stay hidden on the public page.",
      "Use the left checklist (% Ready) for the fastest path to a polished page.",
    ],
  },
  {
    id: "whatsapp",
    emoji: "💬",
    title: "WhatsApp fits your routine",
    bullets: [
      "Header → WhatsApp for parents: one tap to message you.",
      "Quick links & polls can use the same number.",
      "Share results, poll summaries, or payment status — text is pre-filled; you pick the chat and tap Send (free).",
      "After a poll vote, parents can open WhatsApp to notify you — no extra app for them.",
    ],
  },
  {
    id: "data",
    emoji: "📋",
    title: "Simple data collection",
    bullets: [
      "Polls — parents vote with a name; answers are listed in the builder; share a summary to WhatsApp.",
      "Roster (Attendance block) — athlete list powers birthdays, achievements, and attendance.",
      "Payments tracker (optional, coach-only) — track paid / pending / unpaid; share status to your parent chat.",
    ],
  },
  {
    id: "integrations",
    emoji: "🔌",
    title: "Connect tools you already use",
    bullets: [
      "Schedule: add sessions manually or paste a Google Calendar / iCal link.",
      "Smart integrations: Strava, Garmin, YouTube, Instagram, Telegram, Notion — paste a link, we show a nice card.",
      "These are links and embeds — not automatic two-way sync. You still edit in MyTeamSpace or at the source.",
    ],
  },
];

const ACADEMY_SECTION: CoachHelpSection = {
  id: "academy",
  emoji: "🏫",
  title: "Academy plan — many teams",
  bullets: [
    "Your dashboard (/admin) lists every team with members, events, and page readiness.",
    "Each team has its own public page, link, and builder — switch via Edit or ← All teams.",
    "Up to 20 teams on Academy; invite assistants per team from Members.",
    "Billing and plan limits apply per coach account — not per parent.",
  ],
};

export function getCoachHelpSections(options?: { isAcademy?: boolean }): CoachHelpSection[] {
  const sections = [...CORE_SECTIONS];
  if (options?.isAcademy) sections.push(ACADEMY_SECTION);
  return sections;
}
