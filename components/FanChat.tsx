"use client";

import { useEffect, useRef, useState } from "react";
import { PALETTE, FONTS } from "@/lib/mochi";

type Message = {
  id: string;
  author: string;
  content: string;
  timestamp: number;
};

type Status = "connecting" | "connected" | "error";

type Props = {
  siteId?: string;
  height?: number;
};

const API_BASE =
  process.env.NEXT_PUBLIC_CHAT_API_BASE ?? "https://chat.latent-bridge.com";

export function FanChat({ siteId = "kotaruru0603", height = 620 }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<Status>("connecting");
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
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

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
          messages.map((m) => <MessageBubble key={m.id} message={m} />)
        )}
      </div>
      <Footer />
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
        <span style={{ fontSize: 18 }}>💬</span>
        <span style={{ fontSize: 12, letterSpacing: 1, fontFamily: FONTS.mono }}>
          LIVE CHAT
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

function MessageBubble({ message }: { message: Message }) {
  const time = new Date(message.timestamp).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div
      style={{
        background: PALETTE.paper,
        border: `2px solid ${PALETTE.inkSoft}`,
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
        <span style={{ fontSize: 12, fontWeight: 900, color: PALETTE.accent }}>
          {message.author}
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
        {message.content}
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

function Footer() {
  return (
    <div
      style={{
        padding: "10px 16px",
        borderTop: `2px solid ${PALETTE.inkSoft}`,
        fontSize: 10,
        fontFamily: FONTS.mono,
        color: PALETTE.inkDim,
        textAlign: "center",
        letterSpacing: 1,
      }}
    >
      DISCORD → LIVE FEED · READ ONLY
    </div>
  );
}
