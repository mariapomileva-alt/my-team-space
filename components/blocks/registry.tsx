import type { BlockInstance, TeamSpace } from "@/lib/types";
import {
  BlockAchievements,
  BlockAnnouncementBar,
  BlockAttendance,
  BlockBirthdays,
  BlockCalendar,
  BlockCampTrip,
  BlockContacts,
  BlockCountdown,
  BlockDocuments,
  BlockGallery,
  BlockHero,
  BlockPolls,
  BlockQuickLinks,
  BlockPayments,
  BlockQuickActions,
  BlockIntegrations,
  BlockResources,
  BlockResults,
  BlockSchedule,
  BlockSponsors,
  BlockTeamFeed,
  BlockWeather,
} from "./all-blocks";

export type RenderBlockOptions = { hideChildNames?: boolean; embedded?: boolean };

export function renderBlock(team: TeamSpace, block: BlockInstance, options?: RenderBlockOptions) {
  const embedded = options?.embedded;
  switch (block.type) {
    case "hero":
      return <BlockHero team={team} block={block} embedded={embedded} />;
    case "announcement_bar":
      return <BlockAnnouncementBar team={team} block={block} embedded={embedded} />;
    case "calendar":
      return <BlockCalendar team={team} block={block} embedded={embedded} />;
    case "schedule":
      return <BlockSchedule team={team} block={block} embedded={embedded} />;
    case "results":
      return <BlockResults team={team} block={block} embedded={embedded} />;
    case "achievements":
      return <BlockAchievements team={team} block={block} embedded={embedded} />;
    case "team_feed":
      return <BlockTeamFeed team={team} block={block} embedded={embedded} />;
    case "attendance":
      return <BlockAttendance team={team} block={block} embedded={embedded} />;
    case "camp_trip":
      return <BlockCampTrip team={team} block={block} embedded={embedded} />;
    case "contacts":
      return <BlockContacts team={team} block={block} embedded={embedded} />;
    case "documents":
      return <BlockDocuments team={team} block={block} embedded={embedded} />;
    case "polls":
      return <BlockPolls team={team} block={block} embedded={embedded} />;
    case "gallery":
      return <BlockGallery team={team} block={block} embedded={embedded} />;
    case "sponsors":
      return <BlockSponsors team={team} block={block} embedded={embedded} />;
    case "weather":
      return <BlockWeather team={team} block={block} embedded={embedded} />;
    case "countdown":
      return <BlockCountdown team={team} block={block} embedded={embedded} />;
    case "birthdays":
      return <BlockBirthdays team={team} block={block} embedded={embedded} />;
    case "quick_links":
      return <BlockQuickLinks team={team} block={block} embedded={embedded} />;
    case "payments":
      return <BlockPayments team={team} block={block} embedded={embedded} />;
    case "quick_actions":
      return <BlockQuickActions team={team} block={block} embedded={embedded} />;
    case "integrations":
      return <BlockIntegrations team={team} block={block} embedded={embedded} />;
    case "resources":
      return <BlockResources team={team} block={block} embedded={embedded} />;
    default:
      return null;
  }
}
