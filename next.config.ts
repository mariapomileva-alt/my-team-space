import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin Turbopack root when multiple lockfiles exist in parent folders (monorepo-style workspace).
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
