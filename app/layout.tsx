import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";

const poppins = Poppins({
  variable: "--font-brand",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-mts",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "MyTeamSpace — Everything your team needs. In one space.",
  description:
    "A beautiful digital home for youth teams: schedules, announcements, achievements, trips — one link in the browser, no app for parents.",
  applicationName: "MyTeamSpace",
  appleWebApp: {
    capable: true,
    title: "MyTeamSpace",
    statusBarStyle: "default",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#6C5CE7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans text-[#1A1C23]">{children}</body>
    </html>
  );
}
