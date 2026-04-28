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
    // iOS handles SVG apple-touch-icon inconsistently across versions —
    // some build images paint transparent areas with black. PNG is the
    // reliable format here, so we ship a 180x180 PNG specifically for iOS.
    apple: `${BASE_PATH}/icons/usa-180.png`,
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
        {/* iOS standalone PWA mode. Required for iOS to apply the splash
            screen — without this meta the apple-touch-startup-image links
            below are ignored. Next.js' appleWebApp.capable was supposed to
            emit this, but the rendered HTML didn't include it, so we set it
            explicitly. */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* iOS splash screens. iOS ignores manifest.background_color and only
            shows a non-default splash when an apple-touch-startup-image with a
            matching device media query is registered. Without these, iOS PWAs
            show a black/white default during launch. */}
        <link
          rel="apple-touch-startup-image"
          href={`${BASE_PATH}/icons/splash-iphone-pmax.png`}
          media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href={`${BASE_PATH}/icons/splash-iphone-pro.png`}
          media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href={`${BASE_PATH}/icons/splash-iphone-std.png`}
          media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href={`${BASE_PATH}/icons/splash-iphone-x.png`}
          media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href={`${BASE_PATH}/icons/splash-iphone-xsmax.png`}
          media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href={`${BASE_PATH}/icons/splash-iphone-xr.png`}
          media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href={`${BASE_PATH}/icons/splash-iphone-8plus.png`}
          media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href={`${BASE_PATH}/icons/splash-iphone-se.png`}
          media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
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
