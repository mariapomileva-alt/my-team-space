import { describe, expect, it, vi } from "vitest";
import { logoPathFallback } from "./map-row";

vi.mock("@/lib/supabase/env", () => ({
  getSupabaseUrl: () => "https://example.supabase.co",
}));

describe("logoPathFallback", () => {
  it("returns undefined when logo_url is set", () => {
    expect(
      logoPathFallback({
        logo_url: "https://cdn.example/logo.png",
        logo_path: "team-1/logos/old.png",
      }),
    ).toBeUndefined();
  });

  it("returns storage URL when only logo_path exists", () => {
    expect(
      logoPathFallback({
        logo_url: null,
        logo_path: "team-1/logos/current.png",
      }),
    ).toBe("https://example.supabase.co/storage/v1/object/public/team-assets/team-1/logos/current.png");
  });
});
