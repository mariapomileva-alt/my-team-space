import { getBlockSettings, type ManualScheduleEvent } from "@/lib/blocks/settings";
import type { TeamSpace } from "@/lib/types";

export type BlockScheduleAdminEvent = {
  id: string;
  title: string;
  starts_at: string;
  location: string | null;
};

type ScheduleBlockSettings = {
  mode: "manual" | "external" | string;
  events: ManualScheduleEvent[];
  externalUrl: string;
};

function parseTime(time: string): { hours: number; minutes: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return { hours, minutes };
}

function repeatIntervalDays(repeat: ManualScheduleEvent["repeat"]): number {
  switch (repeat) {
    case "biweekly":
      return 14;
    case "monthly":
      return 28;
    case "none":
    case "weekly":
    case "custom":
    default:
      return 7;
  }
}

function eventEnded(ev: ManualScheduleEvent, at: Date): boolean {
  if (ev.ends !== "date" || !ev.endDate?.trim()) return false;
  const end = new Date(ev.endDate);
  if (Number.isNaN(end.getTime())) return false;
  end.setHours(23, 59, 59, 999);
  return at > end;
}

/** Next upcoming occurrence for a builder manual schedule row (teams.blocks source of truth). */
export function nextOccurrenceForManualEvent(ev: ManualScheduleEvent, from: Date): Date | null {
  if (eventEnded(ev, from)) return null;

  const time = parseTime(ev.time) ?? { hours: 12, minutes: 0 };
  const targetDow = ((ev.dayOfWeek % 7) + 7) % 7;
  const intervalDays = repeatIntervalDays(ev.repeat);

  const candidate = new Date(from);
  candidate.setSeconds(0, 0);

  const currentDow = candidate.getDay();
  let daysAhead = (targetDow - currentDow + 7) % 7;
  candidate.setDate(candidate.getDate() + daysAhead);
  candidate.setHours(time.hours, time.minutes, 0, 0);

  if (candidate <= from) {
    candidate.setDate(candidate.getDate() + intervalDays);
  }

  if (eventEnded(ev, candidate)) return null;
  return candidate;
}

function findScheduleBlock(team: TeamSpace) {
  return (
    team.blocks.find((b) => b.enabled !== false && b.type === "schedule") ??
    team.blocks.find((b) => b.enabled !== false && b.type === "calendar")
  );
}

/** Upcoming events for admin calendar — reads schedule block settings from teams.blocks only. */
export function getUpcomingScheduleEventsFromTeam(
  team: TeamSpace,
  options?: { limit?: number; now?: Date },
): BlockScheduleAdminEvent[] {
  const limit = options?.limit ?? 8;
  const now = options?.now ?? new Date();
  const block = findScheduleBlock(team);
  if (!block || block.type !== "schedule") return [];

  const settings = getBlockSettings<ScheduleBlockSettings>(block);
  if (settings.mode === "external") return [];

  return (settings.events ?? [])
    .filter((ev) => ev.title?.trim())
    .map((ev) => {
      const startsAt = nextOccurrenceForManualEvent(ev, now);
      if (!startsAt) return null;
      return {
        id: ev.id,
        title: ev.title.trim(),
        starts_at: startsAt.toISOString(),
        location: ev.location?.trim() || null,
      };
    })
    .filter((row): row is BlockScheduleAdminEvent => row !== null)
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    .slice(0, limit);
}
