import type { TeamSpace } from "@/lib/types";
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

export function renderBlock(team: TeamSpace, type: TeamSpace["blocks"][0]["type"]) {
  switch (type) {
    case "hero":
      return <BlockHero team={team} />;
    case "announcement_bar":
      return <BlockAnnouncementBar />;
    case "calendar":
      return <BlockCalendar />;
    case "schedule":
      return <BlockSchedule />;
    case "results":
      return <BlockResults />;
    case "achievements":
      return <BlockAchievements />;
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
      return <BlockGallery />;
    case "sponsors":
      return <BlockSponsors />;
    case "weather":
      return <BlockWeather />;
    case "countdown":
      return <BlockCountdown />;
    case "birthdays":
      return <BlockBirthdays />;
    case "quick_links":
      return <BlockQuickLinks />;
    default:
      return null;
  }
}
