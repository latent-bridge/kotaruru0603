"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PALETTE, FONTS } from "@/lib/mochi";
import { Icon } from "@/components/Icon";

// ═══════════════════════════════════════════════════════════════════════
// アーカイブ詳細ページ: プレイヤー + チャットリプレイトグル
// ═══════════════════════════════════════════════════════════════════════

/**
 * `hasChatReplay === true` の時だけトグルを出す。トグルを開くと、
 * `public/chats/{videoId}.json` を fetch して自前 UI で描画する。
 * YouTube のチャット iframe は外部 embed だとタイムスタンプ同期が取れず
 * メッセージが永遠に流れないので使わない。
 */
export function ArchivePlayerWithChatToggle({
  videoId,
  title,
  hasChatReplay,
}: {
  videoId: string;
  title: string;
  hasChatReplay: boolean;
}) {
  if (!hasChatReplay) {
    return <StreamPlayer videoId={videoId} title={title} />;
  }
  // hasChatReplay のときは、iframe を常時マウントしたまま chat だけ
  // 表示/非表示を切り替える。トグルで iframe を再作成すると動画が 0 秒
  // に巻き戻ってしまうため、別コンポーネントへ分岐はしない。
  return <PlayerWithOptionalChat videoId={videoId} title={title} />;
}

// ═══════════════════════════════════════════════════════════════════════
// Player + chat 連動
// ═══════════════════════════════════════════════════════════════════════

/** build 時に basePath が埋め込まれる */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

type Msg = {
  t: number;
  a: string;
  m: string;
  p: string;
  b?: string[];
  s?: number;
  sa?: string;
  c?: string;
};

/**
 * プレイヤー iframe を常時マウントしたまま、チャットトグルで右カラムの
 * 表示/非表示だけ切り替える。postMessage の `listening` + infoDelivery
 * はチャット開閉に関係なく走り続ける(コストほぼ 0)。
 */
function PlayerWithOptionalChat({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const { iframeRef, currentTime } = useYouTubeTime(videoId);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 8,
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            background: open ? PALETTE.ink : "#fff",
            color: open ? "#fff" : PALETTE.ink,
            border: `2px solid ${PALETTE.ink}`,
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 900,
            cursor: "pointer",
            fontFamily: FONTS.body,
            boxShadow: open ? "none" : `2px 2px 0 ${PALETTE.inkSoft}`,
          }}
        >
          <Icon name="bubble" size={14} /> {open ? "チャットを とじる" : "チャットリプレイを ひらく"}
        </button>
      </div>

      <div
        className={
          open
            ? "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 md:gap-5"
            : ""
        }
      >
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
              ref={iframeRef}
              src={buildPlayerSrc(videoId)}
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

        {open && <ChatReplay videoId={videoId} currentTime={currentTime} />}
      </div>
    </div>
  );
}

function buildPlayerSrc(videoId: string): string {
  const params = new URLSearchParams({
    modestbranding: "1",
    rel: "0",
    enablejsapi: "1",
  });
  if (typeof window !== "undefined") {
    params.set("origin", window.location.origin);
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

// ═══════════════════════════════════════════════════════════════════════
// YouTube player 時刻購読フック
// ═══════════════════════════════════════════════════════════════════════

/**
 * embed player に "listening" ハンドシェイクを送り、`infoDelivery` イベント
 * を通して currentTime を受け取る。YouTube IFrame Player API のスクリプト
 * (youtube.com/iframe_api) は読み込まず、直接 postMessage でやり取りする。
 */
function useYouTubeTime(videoId: string) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      // youtube-nocookie.com / youtube.com 由来のみ
      if (!/^https:\/\/(www\.)?(youtube-nocookie|youtube)\.com$/.test(e.origin)) {
        return;
      }
      let data: unknown = e.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      const d = data as { event?: string; info?: { currentTime?: number } };
      if (d?.event === "infoDelivery" && typeof d.info?.currentTime === "number") {
        setCurrentTime(d.info.currentTime);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [videoId]);

  // マウント後、player iframe に "listening" を送って infoDelivery を購読
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const send = () => {
      const msg = JSON.stringify({
        event: "listening",
        id: videoId,
        channel: "widget",
      });
      iframe.contentWindow?.postMessage(msg, "*");
    };
    const poll = setInterval(send, 500); // iframe のロード完了タイミングが読めないので数回送る
    const stop = setTimeout(() => clearInterval(poll), 5000);
    return () => {
      clearInterval(poll);
      clearTimeout(stop);
    };
  }, [videoId]);

  return { iframeRef, currentTime };
}

// ═══════════════════════════════════════════════════════════════════════
// ChatReplay 本体
// ═══════════════════════════════════════════════════════════════════════

function ChatReplay({
  videoId,
  currentTime,
}: {
  videoId: string;
  currentTime: number;
}) {
  const [all, setAll] = useState<Msg[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [displayed, setDisplayed] = useState<Msg[]>([]);
  const pointerRef = useRef(0);
  const lastTRef = useRef(0);

  // JSON fetch
  useEffect(() => {
    setAll(null);
    setErr(null);
    fetch(`${BASE_PATH}/chats/${videoId}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: Msg[]) => {
        if (!Array.isArray(data)) throw new Error("not array");
        data.sort((a, b) => a.t - b.t);
        setAll(data);
      })
      .catch((e) => setErr(String(e)));
  }, [videoId]);

  // currentTime 変化に応じて displayed を更新
  useEffect(() => {
    if (!all) return;
    const tMs = Math.floor(currentTime * 1000);
    const lastT = lastTRef.current;
    lastTRef.current = tMs;

    // 2 秒以上の飛び = seek とみなす
    const isSeek = Math.abs(tMs - lastT) > 2000;

    if (isSeek) {
      // binary search で新ポインタ
      let lo = 0;
      let hi = all.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (all[mid].t < tMs) lo = mid + 1;
        else hi = mid;
      }
      pointerRef.current = lo;
      setDisplayed(all.slice(Math.max(0, lo - 30), lo));
      return;
    }

    // 通常進行: 経過した分を push
    if (pointerRef.current >= all.length) return;
    const add: Msg[] = [];
    while (
      pointerRef.current < all.length &&
      all[pointerRef.current].t <= tMs
    ) {
      add.push(all[pointerRef.current]);
      pointerRef.current += 1;
    }
    if (add.length > 0) {
      setDisplayed((prev) => [...prev, ...add].slice(-80));
    }
  }, [currentTime, all]);

  // 自動スクロール
  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [displayed]);

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
          <Icon name="bubble" size={14} /> CHAT REPLAY
        </span>
        {all && (
          <span
            style={{
              fontSize: 10,
              fontFamily: FONTS.mono,
              color: PALETTE.inkDim,
              letterSpacing: 0.5,
            }}
          >
            {all.length} msgs
          </span>
        )}
      </div>

      <div
        ref={listRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 10px",
          background: "#fff",
          scrollBehavior: "smooth",
        }}
      >
        {err && (
          <div style={{ fontSize: 11, color: PALETTE.inkDim, padding: 10 }}>
            チャットリプレイが 読めなかった: {err}
          </div>
        )}
        {!err && !all && (
          <div style={{ fontSize: 11, color: PALETTE.inkDim, padding: 10 }}>
            よみこみちゅう…
          </div>
        )}
        {all && displayed.length === 0 && (
          <div style={{ fontSize: 11, color: PALETTE.inkDim, padding: 10 }}>
            <Icon name="play" size={12} /> 動画を さいせいすると メッセージが ここに ながれるよ <Icon name="heart" size={12} />
          </div>
        )}
        {displayed.map((m, i) => (
          <ChatLine key={`${m.t}-${i}`} m={m} />
        ))}
      </div>

      <div
        style={{
          padding: "6px 12px",
          borderTop: `2px dashed ${PALETTE.inkSoft}`,
          background: PALETTE.paper,
          fontSize: 9,
          fontFamily: FONTS.mono,
          color: PALETTE.inkDim,
          letterSpacing: 0.5,
          lineHeight: 1.5,
        }}
      >
        <Icon name="heart" size={11} /> 当時の チャットログを そのまま ながしてるよ
      </div>
    </div>
  );
}

function ChatLine({ m }: { m: Msg }) {
  const isOwner = m.b?.includes("OWNER");
  const isMod = m.b?.includes("MODERATOR");
  const isSuper = Boolean(m.s);

  const nameColor = isOwner
    ? PALETTE.accent
    : isMod
    ? "#4c72b0"
    : PALETTE.ink;

  return (
    <div
      style={{
        display: "flex",
        gap: 7,
        padding: "6px 4px",
        alignItems: "flex-start",
        fontSize: 12,
        lineHeight: 1.4,
        borderRadius: 6,
        background: isSuper && m.c ? m.c + "22" : "transparent",
      }}
    >
      {m.p ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={m.p}
          alt=""
          width={22}
          height={22}
          loading="lazy"
          referrerPolicy="no-referrer"
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            flexShrink: 0,
            background: PALETTE.inkSoft,
          }}
        />
      ) : (
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: PALETTE.inkSoft,
            flexShrink: 0,
          }}
        />
      )}
      <div style={{ minWidth: 0, flex: 1, wordBreak: "break-word" }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: nameColor,
            marginRight: 6,
          }}
        >
          {m.a}
        </span>
        {isOwner && <Badge><Icon name="star" size={11} accent="#fff" /></Badge>}
        {isMod && <Badge>MOD</Badge>}
        {isSuper && m.sa && (
          <span
            style={{
              fontSize: 10,
              fontFamily: FONTS.mono,
              fontWeight: 900,
              color: PALETTE.accent,
              marginRight: 6,
            }}
          >
            {m.sa}
          </span>
        )}
        <span style={{ color: PALETTE.ink }}>{m.m}</span>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 9,
        padding: "0 4px",
        borderRadius: 4,
        background: PALETTE.cream,
        color: PALETTE.ink,
        marginRight: 4,
        fontWeight: 700,
        verticalAlign: "middle",
      }}
    >
      {children}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// StreamPlayer (既存): /stream ページや、チャット閉時の単独プレーヤー
// ═══════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════
// /stream ページ用の live chat (現状ライブ中のみ使用)
// ═══════════════════════════════════════════════════════════════════════

/**
 * /stream ページでライブ配信中に使うチャット iframe。コメントの「閲覧」
 * のみで、送信は YouTube 本体に誘導する。以前は Storage Access API で
 * iframe 内ログイン送信を試みていたが、不安定 + 規約面のグレーさから廃止。
 * アーカイブ (was_live) では使わず、ChatReplay を使うこと。
 */
export function StreamChat({ videoId }: { videoId: string }) {
  const [host, setHost] = useState<string | null>(null);

  useEffect(() => {
    setHost(window.location.hostname);
  }, []);

  const src = host
    ? `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${host}&dark_theme=0`
    : null;

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
          <Icon name="bubble" size={14} /> CHAT
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
          padding: "8px 12px",
          borderTop: `2px dashed ${PALETTE.inkSoft}`,
          background: PALETTE.paper,
          fontSize: 10,
          fontFamily: FONTS.body,
          color: PALETTE.inkDim,
          lineHeight: 1.6,
          textAlign: "center",
        }}
      >
        コメントを おくるなら{" "}
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: PALETTE.accent, fontWeight: 700, textDecoration: "none" }}
        >
          YouTube で ひらく ↗
        </a>
      </div>
    </div>
  );
}
