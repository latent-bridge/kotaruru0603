"use client";

import { useEffect, useState } from "react";
import { TOKENS } from "@/lib/data";

type Props = { videoId: string };

type DocWithStorageAccess = Document & {
  requestStorageAccessFor?: (origin: string) => Promise<void>;
};

/**
 * Real YouTube live chat embed.
 *
 * Modern browsers block third-party cookies inside iframes by default,
 * which prevents YouTube login state from propagating into this embed.
 *
 * Where available (Chromium-based browsers), we offer a one-click
 * `requestStorageAccessFor()` flow that surfaces the browser's native
 * permission prompt for youtube.com cookies. On success we reload the
 * iframe so the chat picks up the existing YouTube session.
 *
 * Safari / Firefox don't expose this API to top-level pages, so we
 * fall back to "open on YouTube" guidance.
 */
export function YouTubeChat({ videoId }: Props) {
  const [host, setHost] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [supportsAccessFor, setSupportsAccessFor] = useState(false);
  const [accessState, setAccessState] = useState<"idle" | "granted" | "denied">("idle");

  useEffect(() => {
    setHost(window.location.hostname);
    const doc = document as DocWithStorageAccess;
    setSupportsAccessFor(typeof doc.requestStorageAccessFor === "function");
  }, []);

  const handleEnableLogin = async () => {
    const doc = document as DocWithStorageAccess;
    if (!doc.requestStorageAccessFor) return;
    try {
      await doc.requestStorageAccessFor("https://www.youtube.com");
      setAccessState("granted");
      setReloadKey((k) => k + 1);
    } catch {
      setAccessState("denied");
    }
  };

  const src = host
    ? `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${host}&dark_theme=1`
    : null;

  const showEnableButton = supportsAccessFor && accessState !== "granted";

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
        className="flex items-center justify-between gap-2"
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
            key={reloadKey}
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
      <div
        className="flex items-center justify-between gap-2 flex-wrap"
        style={{
          padding: "8px 12px",
          borderTop: `1px solid ${TOKENS.panelBorder}`,
        }}
      >
        <div
          className="font-mono"
          style={{
            fontSize: 9,
            color: TOKENS.textFaint,
            letterSpacing: "0.14em",
            lineHeight: 1.5,
            flex: 1,
            minWidth: 0,
          }}
        >
          {accessState === "granted"
            ? "Cookie 許可済み。YouTube にログイン済みなら送信できます。"
            : showEnableButton
            ? "サイト内チャット送信を有効にできます"
            : (
                <>
                  {accessState === "denied" && "許可されませんでした。"}
                  送信は{" "}
                  <a
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: TOKENS.mint, textDecoration: "none" }}
                  >
                    YOUTUBE で開く ↗
                  </a>
                </>
              )}
        </div>
        {showEnableButton && (
          <button
            onClick={handleEnableLogin}
            className="font-mono"
            style={{
              background: "transparent",
              color: TOKENS.mint,
              border: `1px solid ${TOKENS.mintDim}`,
              borderRadius: 4,
              fontSize: 10,
              letterSpacing: "0.14em",
              padding: "5px 10px",
              cursor: "pointer",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            ログイン有効化
          </button>
        )}
      </div>
    </div>
  );
}
