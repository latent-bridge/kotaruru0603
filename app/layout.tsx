import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { STREAMER } from "@/lib/data";

// Build-time basePath so manifest / icon refs work at both
// kotaruru0603.latent-bridge.com (root) and latent-bridge.github.io/kotaruru0603/.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: `ruruのポンコツ部屋 — ${STREAMER.handle}`,
  description: STREAMER.bio,
  manifest: `${BASE_PATH}/manifest.json`,
  icons: {
    icon: `${BASE_PATH}/icons/usa.svg`,
    apple: `${BASE_PATH}/icons/usa.svg`,
  },
  appleWebApp: {
    capable: true,
    title: "ruru",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#d06a7e",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Zen+Maru+Gothic:wght@400;500;700;900&family=M+PLUS+Rounded+1c:wght@400;500;700;900&family=Kalam:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        {children}
        <Script id="register-sw" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('${BASE_PATH}/sw.js').catch(() => {});
            });
          }`}
        </Script>
      </body>
    </html>
  );
}
