import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MyTeamSpace",
    short_name: "MyTeamSpace",
    description: "Everything your team needs. In one space.",
    start_url: "/",
    display: "standalone",
    background_color: "#F2F4F7",
    theme_color: "#6C5CE7",
    orientation: "portrait",
    icons: [
      {
        src: "/brand/app-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/brand/app-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
