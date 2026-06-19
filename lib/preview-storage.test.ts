import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TeamSpace } from "@/lib/types";
import {
  mergeStoredPreview,
  previewStorageKey,
  purgeStaleTeamPreview,
  saveTeamPreviewLocal,
} from "./preview-storage";

const baseTeam = (): TeamSpace => ({
  id: "team-1",
  slug: "dance-stars",
  name: "Dance Stars",
  primaryColor: "#000",
  secondaryColor: "#fff",
  themeId: "dark_athletic",
  plan: "pro",
  blocks: [],
  updatedAt: "2026-06-12T12:00:00.000Z",
  logoUrl: "https://cdn.example/new-logo.png",
});

function mockStorage() {
  const data = new Map<string, string>();
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
    clear: () => data.clear(),
    get length() {
      return data.size;
    },
    key: () => null,
  };
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("window", { localStorage: storage });
  return data;
}

describe("preview-storage (cloud mode)", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    mockStorage();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("never merges localStorage over server data", () => {
    const server = baseTeam();
    localStorage.setItem(
      previewStorageKey(server.slug),
      JSON.stringify({
        ...server,
        name: "OLD NAME",
        updatedAt: "2099-01-01T00:00:00.000Z",
      }),
    );

    const merged = mergeStoredPreview(server);
    expect(merged.name).toBe("Dance Stars");
    expect(merged.logoUrl).toBe("https://cdn.example/new-logo.png");
  });

  it("does not write local drafts", () => {
    saveTeamPreviewLocal(baseTeam());
    expect(localStorage.getItem(previewStorageKey("dance-stars"))).toBeNull();
  });

  it("purges browser drafts on open", () => {
    const key = previewStorageKey("dance-stars");
    localStorage.setItem(key, JSON.stringify({ slug: "dance-stars", name: "Stale" }));
    purgeStaleTeamPreview("dance-stars", "2026-06-12T12:00:00.000Z");
    expect(localStorage.getItem(key)).toBeNull();
  });
});
