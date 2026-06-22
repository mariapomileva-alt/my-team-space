import { describe, expect, it } from "vitest";
import {
  getUpcomingScheduleEventsFromTeam,
  nextOccurrenceForManualEvent,
} from "./block-schedule-events";
import type { ManualScheduleEvent } from "@/lib/blocks/settings";
import type { TeamSpace } from "@/lib/types";

function manualEvent(partial: Partial<ManualScheduleEvent> & Pick<ManualScheduleEvent, "id">): ManualScheduleEvent {
  return {
    title: "Training",
    eventType: "training",
    dayOfWeek: 2,
    time: "18:00",
    location: "",
    repeat: "weekly",
    ends: "never",
    ...partial,
  };
}

function teamWithSchedule(events: ManualScheduleEvent[], mode: "manual" | "external" = "manual"): TeamSpace {
  return {
    id: "team-1",
    slug: "demo",
    name: "Demo",
    primaryColor: "#000",
    secondaryColor: "#fff",
    themeId: "ocean_aqua",
    blocks: [
      {
        id: "sched-1",
        type: "schedule",
        enabled: true,
        order: 0,
        settings: { mode, events, externalUrl: "" },
      },
    ],
    pageVisibility: "public",
    plan: "free",
    publishStatus: "published",
    updatedAt: new Date().toISOString(),
  };
}

describe("nextOccurrenceForManualEvent", () => {
  it("returns the next matching weekday at the configured time", () => {
    const ev = manualEvent({ id: "e1", dayOfWeek: 3, time: "10:30" });
    const now = new Date("2026-06-10T12:00:00.000Z"); // Wed
    const next = nextOccurrenceForManualEvent(ev, now);
    expect(next).not.toBeNull();
    expect(next!.getDay()).toBe(3);
    expect(next!.getHours()).toBe(10);
    expect(next!.getMinutes()).toBe(30);
    expect(next!.getTime()).toBeGreaterThan(now.getTime());
  });

  it("returns null when the event end date has passed", () => {
    const ev = manualEvent({ id: "e2", ends: "date", endDate: "2026-01-01" });
    const next = nextOccurrenceForManualEvent(ev, new Date("2026-06-10T12:00:00.000Z"));
    expect(next).toBeNull();
  });
});

describe("getUpcomingScheduleEventsFromTeam", () => {
  it("reads manual events from the enabled schedule block", () => {
    const team = teamWithSchedule([
      manualEvent({ id: "a", title: "Morning run", dayOfWeek: 1, time: "07:00" }),
      manualEvent({ id: "b", title: "Team practice", dayOfWeek: 4, time: "19:00" }),
    ]);
    const rows = getUpcomingScheduleEventsFromTeam(team, {
      limit: 4,
      now: new Date("2026-06-10T12:00:00.000Z"),
    });
    expect(rows).toHaveLength(2);
    expect(rows.map((r) => r.title).sort()).toEqual(["Morning run", "Team practice"]);
    expect(rows[0]!.starts_at <= rows[1]!.starts_at).toBe(true);
  });

  it("returns no rows for external calendar mode", () => {
    const team = teamWithSchedule([], "external");
    expect(getUpcomingScheduleEventsFromTeam(team)).toEqual([]);
  });

  it("ignores disabled schedule blocks", () => {
    const team = teamWithSchedule([manualEvent({ id: "x", title: "Hidden" })]);
    team.blocks[0]!.enabled = false;
    expect(getUpcomingScheduleEventsFromTeam(team)).toEqual([]);
  });
});
