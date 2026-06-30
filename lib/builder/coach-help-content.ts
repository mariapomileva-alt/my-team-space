/**
 * Coach-facing copy for the builder guide. Keep in sync with docs/BUILDER_GUIDELINE.md
 */

import {
  BLOCK_META,
  BUILDER_SECTION_LABELS,
  BUILDER_SECTION_ORDER,
  type BuilderSection,
} from "@/lib/blocks/meta";
import type { BlockType } from "@/lib/types";

export type CoachHelpItem = {
  id: string;
  emoji: string;
  title: string;
  summary: string;
};

export type CoachHelpBlockGuide = CoachHelpItem & {
  howItWorks: string;
};

export type CoachHelpSection = {
  id: string;
  emoji: string;
  title: string;
  bullets: string[];
};

/** Extra coach copy beyond BLOCK_META.description */
const BLOCK_HOW_IT_WORKS: Partial<Record<BlockType, string>> = {
  announcement_bar:
    "Pin urgent news at the top — bus changes, cancelled practice, fee deadlines. Updates as soon as you save.",
  hero:
    "Your logo, cover, team name, motto, and social links. Add WhatsApp here so parents can message you in one tap.",
  calendar:
    "Paste a public Google Calendar embed URL — families see the full calendar without leaving your page.",
  schedule:
    "Add weekly sessions in the builder, or link an external Google Calendar / iCal feed. One event is enough to go live.",
  contacts:
    "List coaches and club phones or emails. Empty contacts stay hidden until you add at least one person.",
  quick_links:
    "Big tap targets for WhatsApp group, Telegram, Instagram, or your website — great for parent chats.",
  quick_actions:
    "Custom buttons: registration form, Google Maps, signup link, or highlight video — any URL works.",
  integrations:
    "Paste Strava, Garmin, YouTube, Notion, or other links — we detect the service and show a branded card.",
  team_shop:
    "Show merch with photo and price; each item links to Shopify, a form, or WhatsApp to order.",
  gallery:
    "Upload photos or paste image URLs. Parents scroll a grid — no separate photo app.",
  polls:
    "Ask “Who’s coming Saturday?” Parents vote with a name; you see answers here and can share a WhatsApp summary.",
  achievements:
    "Trophies and highlights tied to your roster — kids love seeing wins on the team page.",
  results:
    "Medals, points, and competition results. Use Share in WhatsApp to send a formatted summary to parent chats.",
  team_feed:
    "A simple news stream — short posts and photos in one timeline on your page.",
  payments:
    "One public payment link (Revolut, bank, Stripe, etc.) for fees, camp, or membership.",
  attendance:
    "Build your athlete roster here — it also powers birthdays, achievements, and attendance marks.",
  camp_trip:
    "Trip details, bus times, packing checklists, and confirmations for parents in one block.",
  documents:
    "Link PDFs — waivers, handbooks, permission slips. Parents download without email attachments.",
  resources:
    "Training plans, music, travel notes, or any files your families need in one library.",
  birthdays:
    "Shows upcoming birthdays from your roster — turn on Attendance first to add athlete dates.",
  sponsors:
    "Partner logos with optional links — thank sponsors on the same page families already use.",
  weather:
    "Quick field or pool conditions for your city so outdoor sessions are easier to plan.",
  countdown:
    "Days until the next match, showcase, or camp — builds excitement on the page.",
};

const TOOL_GUIDES: CoachHelpBlockGuide[] = [
  {
    id: "publish",
    emoji: "🚀",
    title: "Publish & share",
    summary: "Go live for parents",
    howItWorks:
      "Add team name + logo, then Publish. Share the link or QR — parents need no account. Edits appear instantly after save.",
  },
  {
    id: "design",
    emoji: "🎨",
    title: "Team design",
    summary: "Colors and mood",
    howItWorks:
      "Pick a theme preset in Design — your page, buttons, and blocks match your club colors automatically.",
  },
  {
    id: "payments-tracker",
    emoji: "📒",
    title: "Payments tracker",
    summary: "Coach-only · Optional tools",
    howItWorks:
      "Track who paid, pending, or unpaid. Parents don’t see this — share a WhatsApp summary when you need to nudge the group.",
  },
  {
    id: "members",
    emoji: "👥",
    title: "Members",
    summary: "Invite assistants",
    howItWorks:
      "Invite another coach or page admin by email. They can edit the page; only you publish and manage billing.",
  },
  {
    id: "schedule-tool",
    emoji: "📅",
    title: "Schedule (team tools)",
    summary: "Extended calendar view",
    howItWorks:
      "Manage events in a fuller calendar view — same data as the Schedule block on your public page.",
  },
  {
    id: "results-tool",
    emoji: "🏁",
    title: "Results (team tools)",
    summary: "Full results editor",
    howItWorks:
      "Add competitions and medals in detail, then share formatted results to WhatsApp from the editor.",
  },
];

const OVERVIEW_SECTIONS: CoachHelpSection[] = [
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
    id: "whatsapp",
    emoji: "💬",
    title: "WhatsApp fits your routine",
    bullets: [
      "Header → WhatsApp for parents: one tap to message you.",
      "Share results, poll summaries, or payment status — pre-filled text, you pick the chat and tap Send (free).",
      "After a poll vote, parents can notify you via WhatsApp — no Twilio required.",
    ],
  },
];

const ACADEMY_SECTION: CoachHelpSection = {
  id: "academy",
  emoji: "🏫",
  title: "Academy plan — many teams",
  bullets: [
    "Your dashboard lists every team with members, events, and page readiness.",
    "Each team has its own page and builder — switch via Edit or ← All teams.",
    "Up to 20 teams; invite assistants per team from Members.",
  ],
};

function blockGuide(type: BlockType): CoachHelpBlockGuide {
  const meta = BLOCK_META[type];
  return {
    id: type,
    emoji: meta.emoji,
    title: meta.title,
    summary: meta.description,
    howItWorks: BLOCK_HOW_IT_WORKS[type] ?? meta.description,
  };
}

export function getCoachHelpBlocksBySection(): Record<BuilderSection, CoachHelpBlockGuide[]> {
  const groups: Record<BuilderSection, CoachHelpBlockGuide[]> = {
    essential: [],
    engagement: [],
    advanced: [],
  };
  for (const type of Object.keys(BLOCK_META) as BlockType[]) {
    const section = BLOCK_META[type].section;
    groups[section].push(blockGuide(type));
  }
  for (const section of BUILDER_SECTION_ORDER) {
    groups[section].sort((a, b) => BLOCK_META[a.id as BlockType].priority - BLOCK_META[b.id as BlockType].priority);
  }
  return groups;
}

export function getCoachHelpTools(): CoachHelpBlockGuide[] {
  return TOOL_GUIDES;
}

export function getCoachHelpOverview(): CoachHelpSection[] {
  return OVERVIEW_SECTIONS;
}

export function getCoachHelpSections(options?: { isAcademy?: boolean }): CoachHelpSection[] {
  const sections = [...OVERVIEW_SECTIONS];
  if (options?.isAcademy) sections.push(ACADEMY_SECTION);
  return sections;
}

export { BUILDER_SECTION_LABELS, BUILDER_SECTION_ORDER };
