import { describe, expect, it } from "vitest";
import { defaultResultsBoardSettings } from "@/lib/blocks/results-board";
import { buildPaymentsShareMessage, buildResultsShareMessage } from "@/lib/whatsapp-summaries";

describe("buildPaymentsShareMessage", () => {
  it("formats rows by month with status icons", () => {
    const message = buildPaymentsShareMessage({
      teamName: "Stars",
      rows: [
        { id: "1", label: "Anna", month: "March", status: "paid" },
        { id: "2", label: "Max", month: "March", status: "unpaid" },
      ],
    });
    expect(message).toContain("MyTeamSpace · Stars");
    expect(message).toContain("March");
    expect(message).toContain("✅ Anna");
    expect(message).toContain("❌ Max");
    expect(message).toContain("1 paid · 1 unpaid");
  });

  it("returns null when empty", () => {
    expect(buildPaymentsShareMessage({ teamName: "Stars", rows: [] })).toBeNull();
  });
});

describe("buildResultsShareMessage", () => {
  it("lists recent competitions", () => {
    const settings = {
      ...defaultResultsBoardSettings(),
      mode: "simple" as const,
      simpleResults: [
        {
          id: "1",
          competitionName: "City Open",
          date: "2026-03-10",
          athleteName: "Anna",
          place: 1,
          medal: "🥇",
        },
      ],
    };
    const message = buildResultsShareMessage({
      teamName: "Stars",
      publicUrl: "https://myteamspace.cc/stars",
      settings,
    });
    expect(message).toContain("City Open");
    expect(message).toContain("🥇 Anna");
    expect(message).toContain("https://myteamspace.cc/stars");
  });
});
