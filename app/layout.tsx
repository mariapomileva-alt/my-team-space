import "@/app/globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  variable: "--font-mts",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MyTeamSpace — team webpage builder for coaches",
  description:
    "Not an app: one browser page for parents and athletes. Blocks, colors, schedule, and news — a lightweight site builder for sports teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full font-[family-name:var(--font-mts)]">{children}</body>
    </html>
  );
}
