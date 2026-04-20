"use client";

import { useEffect, useState } from "react";
import { TOKENS } from "@/lib/data";

type Props = { videoId: string };

/**
 * Real YouTube live chat embed. Requires `embed_domain` to match the
 * page's hostname (set on the client after mount). Iframe area is left
 * untouched; decoration lives in the surrounding panel.
 */
export function YouTubeChat({ videoId }: Props) {
  const [host, setHost] = useState<string | null>(null);

  useEffect(() => {
    setHost(window.location.hostname);
  }, []);

  const src = host
    ? `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${host}`
    : null;

  return (
    <div
      className="flex flex-col"
      style={{
        background: TOKENS.panelBg,
        border: `1px solid ${TOKENS.panelBorder}`,
        borderRadius: 10,
        height: 520,
        overflow: "hidden",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          padding: "10px 14px",
          borderBottom: `1px solid ${TOKENS.panelBorder}`,
        }}
      >
        <div
          className="font-mono"
          style={{ fontSize: 10, color: TOKENS.mint, letterSpacing: "0.22em" }}
        >
          YOUTUBE LIVE CHAT
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono"
          style={{
            fontSize: 9,
            color: TOKENS.textMuted,
            letterSpacing: "0.16em",
            textDecoration: "none",
          }}
        >
          OPEN ON YOUTUBE ↗
        </a>
      </div>
      <div style={{ flex: 1, position: "relative", background: "#0b0d10" }}>
        {src ? (
          <iframe
            src={src}
            title="YouTube live chat"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
          />
        ) : (
          <div
            className="font-mono"
            style={{
              padding: 14,
              fontSize: 10,
              color: TOKENS.textFaint,
              letterSpacing: "0.16em",
            }}
          >
            LOADING CHAT...
          </div>
        )}
      </div>
    </div>
  );
}
