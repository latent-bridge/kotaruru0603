import type { Metadata } from "next";
import "./globals.css";
import { STREAMER } from "@/lib/data";
import { Topbar } from "@/components/Topbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: `ruruのポンコツ部屋 — ${STREAMER.handle}`,
  description: STREAMER.bio,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">
        <Topbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
