import { describe, expect, it } from "vitest";
import { shouldReplaceLocalWithServer } from "./sync-policy";

const older = "2026-06-12T10:00:00.000Z";
const newer = "2026-06-12T11:00:00.000Z";

describe("shouldReplaceLocalWithServer", () => {
  it("replaces dirty local state when server is newer", () => {
    expect(
      shouldReplaceLocalWithServer({ updatedAt: older, dirty: true }, { updatedAt: newer }),
    ).toBe(true);
  });

  it("keeps dirty local state when server is not newer", () => {
    expect(
      shouldReplaceLocalWithServer({ updatedAt: newer, dirty: true }, { updatedAt: older }),
    ).toBe(false);
  });

  it("replaces clean local state even when timestamps match", () => {
    expect(
      shouldReplaceLocalWithServer({ updatedAt: older, dirty: false }, { updatedAt: older }),
    ).toBe(true);
  });
});
