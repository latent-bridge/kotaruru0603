"use client";

import { useEffect, useRef, useState } from "react";
import { PALETTE, FONTS } from "@/lib/mochi";
import { MochiUsa } from "@/components/mochi-ui";
import { streamerConfig } from "@/config/streamer.config";
import { Icon } from "@/components/Icon";
import { ChatBody } from "@/components/chat-emoji";
import { ChatComposer } from "@/components/ChatComposer";

const STREAMER_TAG = streamerConfig.chatTag;

type Message = {
  id: string;
  author: string;
  // 4-char tag derived from the sender's user.id, present only for messages
  // that came through the fan-site (webhook). Native Discord posts have null.
  tag: string | null;
  content: string;
  timestamp: number;
};

type Status = "connecting" | "connected" | "error";

type User = {
  tag: string;
  id: string;
  display_name: string;
  avatar_url: string | null;
  has_discord: boolean;
};

type AuthState =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "authenticated"; user: User };

type Props = {
  siteId?: string;
  height?: number;
};

const API_BASE =
  process.env.NEXT_PUBLIC_CHAT_API_BASE ?? "https://chat.latent-bridge.com";

export function FanChat({ siteId = "kotaruru0603", height = 620 }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<Status>("connecting");
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const es = new EventSource(`${API_BASE}/chat/${siteId}/stream`);
    es.onopen = () => setStatus("connected");
    es.onerror = () => setStatus("error");
    es.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as Message;
        setMessages((prev) =>
          prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
        );
      } catch {
        // malformed frame, ignore
      }
    };
    return () => es.close();
  }, [siteId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/me`, { credentials: "include" });
        if (cancelled) return;
        if (res.status === 200) {
          const user = (await res.json()) as User;
          setAuth({ status: "authenticated", user });
        } else {
          setAuth({ status: "anonymous" });
        }
      } catch {
        if (!cancelled) setAuth({ status: "anonymous" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Compare on the structured tag field rather than parsing the author string.
  // Stable across display-name changes and content with arbitrary characters.
  const selfTag = auth.status === "authenticated" ? auth.user.tag : null;

  return (
    <div
      style={{
        background: "#fff",
        border: `3px solid ${PALETTE.ink}`,
        borderRadius: 22,
        boxShadow: `5px 5px 0 ${PALETTE.ink}`,
        height,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Header status={status} />
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          padding: "14px 16px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {messages.length === 0 ? (
          <EmptyState status={status} />
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              isSelf={selfTag !== null && m.tag !== null && m.tag === selfTag}
              isStreamer={m.tag === STREAMER_TAG}
            />
          ))
        )}
      </div>
      <ComposeArea auth={auth} siteId={siteId} />
    </div>
  );
}

function Header({ status }: { status: Status }) {
  return (
    <div
      style={{
        padding: "12px 16px",
        borderBottom: `2px solid ${PALETTE.inkSoft}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 900,
          color: PALETTE.ink,
        }}
      >
        <Icon name="bubble" size={18} />
        <span style={{ fontSize: 13, fontWeight: 900 }}>
          みんなの こえ
        </span>
      </div>
      <ConnectionBadge status={status} />
    </div>
  );
}

function ConnectionBadge({ status }: { status: Status }) {
  const config: Record<Status, { color: string; label: string }> = {
    connecting: { color: PALETTE.cream, label: "CONNECTING" },
    connected: { color: PALETTE.mint, label: "LIVE" },
    error: { color: PALETTE.coral, label: "RECONNECT…" },
  };
  const { color, label } = config[status];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        background: color,
        border: `2px solid ${PALETTE.ink}`,
        borderRadius: 999,
        fontSize: 10,
        fontFamily: FONTS.mono,
        fontWeight: 900,
        color: PALETTE.ink,
        letterSpacing: 0.8,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: PALETTE.ink,
        }}
      />
      {label}
    </div>
  );
}

function MessageBubble({
  message,
  isSelf,
  isStreamer,
}: {
  message: Message;
  isSelf: boolean;
  isStreamer: boolean;
}) {
  const time = new Date(message.timestamp).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
  // Visual priority: streamer > self > other. The streamer chiming in is the
  // signal everyone wants to see, so it wins over the user's own self-tint.
  const bg = isStreamer
    ? `${PALETTE.coral}33`
    : isSelf
      ? `${PALETTE.mint}55`
      : PALETTE.paper;
  const borderColor = isStreamer
    ? PALETTE.coral
    : isSelf
      ? PALETTE.mint
      : PALETTE.inkSoft;
  const nameColor = isStreamer ? "#c25470" : PALETTE.accent;
  return (
    <div
      style={{
        alignSelf: "flex-start",
        maxWidth: "90%",
        background: bg,
        border: `2px solid ${borderColor}`,
        borderRadius: 14,
        padding: "8px 12px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          marginBottom: 3,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "baseline", gap: 4 }}>
          {isStreamer && (
            <span
              aria-label="streamer"
              style={{
                display: "inline-flex",
                alignSelf: "center",
                marginRight: 2,
              }}
            >
              <MochiUsa size={20} />
            </span>
          )}
          <span style={{ fontSize: 12, fontWeight: 900, color: nameColor }}>
            {message.author}
          </span>
          {message.tag && (
            <span style={{
              fontSize: 10,
              fontFamily: FONTS.mono,
              color: PALETTE.inkDim,
              fontWeight: 500,
            }}>#{message.tag}</span>
          )}
        </span>
        <span
          style={{
            fontSize: 10,
            fontFamily: FONTS.mono,
            color: PALETTE.inkDim,
          }}
        >
          {time}
        </span>
      </div>
      <div
        style={{
          fontSize: 13,
          lineHeight: 1.6,
          color: PALETTE.ink,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        <ChatBody body={message.content} />
      </div>
    </div>
  );
}

function EmptyState({ status }: { status: Status }) {
  const label: Record<Status, string> = {
    connecting: "せつぞくちゅう…",
    connected: "まだ はつげんが ないよ",
    error: "つながらないみたい…",
  };
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        color: PALETTE.inkDim,
      }}
    >
      {label[status]}
    </div>
  );
}

function ComposeArea({ auth, siteId }: { auth: AuthState; siteId: string }) {
  if (auth.status === "loading") {
    return <ComposeShell>&nbsp;</ComposeShell>;
  }
  if (auth.status === "anonymous") {
    return (
      <ComposeShell>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 12, color: PALETTE.inkDim }}>
            ログインすると かきこめるよ <Icon name="heart" size={12} />
          </span>
          <a href="/login/" style={linkPill(true)}>
            ログイン
          </a>
        </div>
      </ComposeShell>
    );
  }
  return <ChatComposer siteId={siteId} user={auth.user} />;
}

function ComposeShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "10px 14px",
        borderTop: `2px solid ${PALETTE.inkSoft}`,
        background: PALETTE.paper,
      }}
    >
      {children}
    </div>
  );
}

function linkPill(filled: boolean): React.CSSProperties {
  return {
    padding: "5px 12px",
    borderRadius: 999,
    border: `2px solid ${PALETTE.ink}`,
    background: filled ? PALETTE.cream : "transparent",
    color: PALETTE.ink,
    fontSize: 12,
    fontWeight: 700,
    textDecoration: "none",
  };
}
