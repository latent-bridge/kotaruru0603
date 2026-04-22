"use client";

import { useEffect, useState } from "react";
import { PALETTE, FONTS } from "@/lib/mochi";

// --- プレイヤー -------------------------------------------------------

export function StreamPlayer({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0`;
  return (
    <div
      style={{
        position: "relative",
        background: "#fff",
        borderRadius: 22,
        border: `3px solid ${PALETTE.ink}`,
        boxShadow: `5px 5px 0 ${PALETTE.ink}`,
        padding: 10,
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          borderRadius: 14,
          overflow: "hidden",
          background: PALETTE.ink,
        }}
      >
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
      </div>
    </div>
  );
}

// --- チャット ---------------------------------------------------------

type DocWithStorageAccess = Document & {
  requestStorageAccessFor?: (origin: string) => Promise<void>;
};

/**
 * YouTube live chat embed. モダンブラウザはデフォルトで 3rd-party cookie を
 * ブロックするため iframe 内に YouTube のログイン状態が伝わらず、チャット送信
 * ができない。Chromium 系は `requestStorageAccessFor` で明示許可を取れる。
 * Safari / Firefox はサポートなし → 「YouTube で開く」導線を出す。
 */
export function StreamChat({ videoId }: { videoId: string }) {
  const [host, setHost] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [supportsAccessFor, setSupportsAccessFor] = useState(false);
  const [accessState, setAccessState] = useState<"idle" | "granted" | "denied">(
    "idle",
  );

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
    ? `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${host}`
    : null;

  const showEnableButton = supportsAccessFor && accessState !== "granted";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        border: `2.5px solid ${PALETTE.ink}`,
        boxShadow: `3px 3px 0 ${PALETTE.ink}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: 560,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderBottom: `2px dashed ${PALETTE.inkSoft}`,
          background: PALETTE.paper,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontFamily: FONTS.mono,
            color: PALETTE.inkDim,
            letterSpacing: 1.5,
            fontWeight: 700,
          }}
        >
          💬 CHAT
        </span>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 10,
            fontFamily: FONTS.mono,
            color: PALETTE.accent,
            letterSpacing: 1,
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          YouTube で ひらく ↗
        </a>
      </div>

      <div style={{ flex: 1, position: "relative", background: "#fff" }}>
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
            style={{
              padding: 14,
              fontSize: 11,
              color: PALETTE.inkDim,
              fontFamily: FONTS.mono,
              letterSpacing: 1,
            }}
          >
            LOADING CHAT...
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderTop: `2px dashed ${PALETTE.inkSoft}`,
          background: PALETTE.paper,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 10,
            fontFamily: FONTS.body,
            color: PALETTE.inkDim,
            lineHeight: 1.5,
          }}
        >
          {accessState === "granted" ? (
            <>Cookie きょかずみ。YouTube に ログインずみなら ここから おくれるよ ♡</>
          ) : showEnableButton ? (
            <>サイトの なかから おくれるように するには →</>
          ) : (
            <>
              {accessState === "denied" && "きょかされなかったよ。 "}
              おくるなら{" "}
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: PALETTE.accent, fontWeight: 700 }}
              >
                YouTube で ひらく ↗
              </a>
            </>
          )}
        </div>
        {showEnableButton && (
          <button
            onClick={handleEnableLogin}
            style={{
              background: PALETTE.coral,
              color: "#fff",
              border: `2px solid ${PALETTE.ink}`,
              borderRadius: 10,
              fontSize: 11,
              fontFamily: FONTS.body,
              padding: "6px 10px",
              cursor: "pointer",
              fontWeight: 900,
              boxShadow: `2px 2px 0 ${PALETTE.ink}`,
              whiteSpace: "nowrap",
            }}
          >
            ログインゆうこう
          </button>
        )}
      </div>
    </div>
  );
}
