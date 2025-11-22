import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import "@/site/styles/globals/normalize.scss";
import "@/site/styles/globals/colors.scss";
import "@/site/styles/globals/variables.scss";
import "@/site/styles/globals/globals.scss";

const nunitoFont = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Сайт йоу",
  description: "Сайт йоу",
};

export default function SiteRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={nunitoFont.variable}>{children}</body>
    </html>
  );
}
