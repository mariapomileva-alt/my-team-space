import type { NextConfig } from "next";

/** GitHub project Pages URL is /<repo>/ — set BASE_PATH=/my-team-space when building for Pages. */
const basePath = process.env.BASE_PATH?.trim() || "";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
