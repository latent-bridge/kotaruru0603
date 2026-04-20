"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, STREAMER, TOKENS } from "@/lib/data";
import { LiveBadge } from "./LiveBadge";

export function Topbar() {
  const pathname = usePathname();
  const currentKey =
    NAV.find((n) => (n.path === "/" ? pathname === "/" : pathname.startsWith(n.path)))?.key ??
    "home";

  return (
    <div
      className="sticky top-0 z-10 backdrop-blur"
      style={{
        background: "rgba(6,7,10,0.7)",
        borderBottom: `1px solid ${TOKENS.panelBorder}`,
      }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Moon />
          <div>
            <div
              className="font-mono"
              style={{ fontSize: 10, color: TOKENS.mint, letterSpacing: "0.22em" }}
            >
              RURU—OPS
            </div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>
              ruru{" "}
              <span
                className="font-mono"
                style={{ color: TOKENS.textMuted, fontSize: 10 }}
              >
                {STREAMER.handle}
              </span>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <LiveBadge liveOn />
          <span
            className="font-mono hidden md:inline"
            style={{ fontSize: 10, color: TOKENS.textFaint, letterSpacing: "0.2em" }}
          >
            MISSION&nbsp;CTRL&nbsp;//&nbsp;{currentKey.toUpperCase()}
          </span>
        </div>
      </div>
      {/* nav row */}
      <nav
        className="flex gap-1 overflow-x-auto px-4 sm:px-6 pb-2 scrollbar-thin"
        style={{ borderTop: `1px solid ${TOKENS.panelBorder}` }}
      >
        {NAV.map((n) => {
          const active = n.key === currentKey;
          return (
            <Link
              key={n.key}
              href={n.path}
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                padding: "8px 12px",
                marginTop: 6,
                borderRadius: 4,
                border: `1px solid ${active ? TOKENS.mint : "rgba(255,255,255,0.08)"}`,
                background: active ? "rgba(163,255,214,0.08)" : "transparent",
                color: active ? TOKENS.mint : TOKENS.textMuted,
                whiteSpace: "nowrap",
              }}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function Moon() {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 35% 35%, #eef, #98a 70%, #334 100%)",
        boxShadow: `0 0 18px ${TOKENS.mint}55`,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          boxShadow: "inset -6px -4px 0 -2px rgba(0,0,0,0.6)",
        }}
      />
    </div>
  );
}
