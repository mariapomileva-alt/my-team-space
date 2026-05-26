import type { BlockInstance } from "@/lib/types";

export const ADMIN_BLOCK_LABELS: Record<BlockInstance["type"], string> = {
  hero: "Hero header",
  announcement_bar: "Announcement bar",
  calendar: "Calendar",
  schedule: "Weekly schedule",
  results: "Results & board",
  achievements: "Achievements & streaks",
  team_feed: "Team feed",
  attendance: "Attendance",
  camp_trip: "Camp & trip",
  contacts: "Contacts",
  documents: "Documents",
  polls: "Polls",
  gallery: "Photo gallery",
  sponsors: "Partners",
  weather: "Weather",
  countdown: "Countdown",
  birthdays: "Birthdays",
  quick_links: "Quick links",
  integrations: "Smart integrations",
  resources: "Team resources",
};
