import "@/app/globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  variable: "--font-mts",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MyTeamSpace — конструктор веб-страницы команды для тренера",
  description:
    "Не приложение: одна страница в браузере для родителей и учеников. Блоки, цвета, расписание и новости — как лёгкий конструктор сайта для спортивных команд.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full font-[family-name:var(--font-mts)]">{children}</body>
    </html>
  );
}
