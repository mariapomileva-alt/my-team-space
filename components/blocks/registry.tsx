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
  BlockResults,
  BlockSchedule,
  BlockSponsors,
  BlockTeamFeed,
  BlockWeather,
} from "./all-blocks";

export type RenderBlockOptions = { hideChildNames?: boolean };

export function renderBlock(team: TeamSpace, block: BlockInstance, _options?: RenderBlockOptions) {
  switch (block.type) {
    case "hero":
      return <BlockHero team={team} block={block} />;
    case "announcement_bar":
      return <BlockAnnouncementBar team={team} block={block} />;
    case "calendar":
      return <BlockCalendar team={team} block={block} />;
    case "schedule":
      return <BlockSchedule team={team} block={block} />;
    case "results":
      return <BlockResults team={team} block={block} />;
    case "achievements":
      return <BlockAchievements team={team} block={block} />;
    case "team_feed":
      return <BlockTeamFeed team={team} block={block} />;
    case "attendance":
      return <BlockAttendance team={team} block={block} />;
    case "camp_trip":
      return <BlockCampTrip team={team} block={block} />;
    case "contacts":
      return <BlockContacts team={team} block={block} />;
    case "documents":
      return <BlockDocuments team={team} block={block} />;
    case "polls":
      return <BlockPolls team={team} block={block} />;
    case "gallery":
      return <BlockGallery team={team} block={block} />;
    case "sponsors":
      return <BlockSponsors team={team} block={block} />;
    case "weather":
      return <BlockWeather team={team} block={block} />;
    case "countdown":
      return <BlockCountdown team={team} block={block} />;
    case "birthdays":
      return <BlockBirthdays team={team} block={block} />;
    case "quick_links":
      return <BlockQuickLinks team={team} block={block} />;
    default:
      return null;
  }
}
