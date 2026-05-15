import type { NextConfig } from "next";

/**
 * SaaS mode: full Next.js (SSR, API routes, Supabase auth, Lemon Squeezy webhooks).
 * Multi-tenant: one deployment, one Supabase project; team data keyed by team_id; public `/team/[slug]` uses ISR + tags.
 * For legacy static GitHub Pages export, use BASE_PATH + `output: "export"` in a branch or script — not compatible with this stack.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Bake public Supabase vars at build from either NEXT_PUBLIC_* or SUPABASE_* (Vercel Production).
  env: {
    NEXT_PUBLIC_SUPABASE_URL: (() => {
      const raw =
        process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || process.env.SUPABASE_URL?.trim() || "";
      try {
        return raw ? new URL(raw).origin : "";
      } catch {
        return raw;
      }
    })(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || process.env.SUPABASE_ANON_KEY?.trim() || "",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      /* External video posters / embed thumbs — never store video files in Supabase Storage */
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/**" },
      { protocol: "https", hostname: "img.youtube.com", pathname: "/**" },
      { protocol: "https", hostname: "i.vimeocdn.com", pathname: "/**" },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
