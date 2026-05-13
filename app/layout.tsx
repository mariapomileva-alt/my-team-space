import "@/app/globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  variable: "--font-mts",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MyTeamSpace — one beautiful link for your whole team",
  description:
    "A team space for sports clubs, schools, and kids communities. Schedules, announcements, results, trips, achievements — no app download. Transparent for parents, fun for kids, easy for coaches.",
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
