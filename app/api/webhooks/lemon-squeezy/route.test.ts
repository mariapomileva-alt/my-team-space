import { describe, expect, it } from "vitest";
import { CANONICAL_LEMON_WEBHOOK_PATH, GET, POST } from "@/app/api/webhooks/lemon-squeezy/route";

describe("legacy lemon-squeezy webhook route", () => {
  it("returns 410 and points to the canonical webhook path", async () => {
    for (const handler of [GET, POST]) {
      const res = await handler();
      expect(res.status).toBe(410);
      const body = await res.json();
      expect(body.deprecated).toBe(true);
      expect(body.canonical).toBe(CANONICAL_LEMON_WEBHOOK_PATH);
    }
  });
});
