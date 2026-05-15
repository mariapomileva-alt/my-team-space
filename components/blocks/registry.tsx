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

export function renderBlock(team: TeamSpace, block: BlockInstance) {
  switch (block.type) {
    case "hero":
      return <BlockHero team={team} block={block} />;
    case "announcement_bar":
      return <BlockAnnouncementBar team={team} block={block} />;
    case "calendar":
      return <BlockCalendar />;
    case "schedule":
      return <BlockSchedule team={team} block={block} />;
    case "results":
      return <BlockResults />;
    case "achievements":
      return <BlockAchievements team={team} block={block} />;
    case "team_feed":
      return <BlockTeamFeed />;
    case "attendance":
      return <BlockAttendance />;
    case "camp_trip":
      return <BlockCampTrip />;
    case "contacts":
      return <BlockContacts />;
    case "documents":
      return <BlockDocuments />;
    case "polls":
      return <BlockPolls />;
    case "gallery":
      return <BlockGallery team={team} block={block} />;
    case "sponsors":
      return <BlockSponsors />;
    case "weather":
      return <BlockWeather />;
    case "countdown":
      return <BlockCountdown />;
    case "birthdays":
      return <BlockBirthdays />;
    case "quick_links":
      return <BlockQuickLinks team={team} block={block} />;
    default:
      return null;
  }
}
