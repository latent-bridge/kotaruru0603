"use client";

import { useEffect, useRef, useState } from "react";
import { CHAT_SAMPLES, TOKENS } from "@/lib/data";

type Msg = { user: string; msg: string; c: string; id?: number };

export function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>(() =>
    CHAT_SAMPLES.slice(0, 7).map((m, i) => ({ ...m, id: i }))
  );
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 7;
    const id = setInterval(() => {
      const next = CHAT_SAMPLES[i % CHAT_SAMPLES.length];
      i += 1;
      setMsgs((prev) =>
        [...prev, { ...next, id: Date.now() + Math.random() }].slice(-20)
      );
    }, 2200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  const send = () => {
    if (!draft.trim()) return;
    setMsgs((m) => [
      ...m,
      { user: "あなた", msg: draft, c: TOKENS.mint, id: Date.now() },
    ]);
    setDraft("");
  };

  return (
    <div
      className="flex flex-col"
      style={{
        background: TOKENS.panelBg,
        border: `1px solid ${TOKENS.panelBorder}`,
        borderRadius: 10,
        height: 520,
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
          LIVE CHAT
        </div>
        <div
          className="font-mono"
          style={{ fontSize: 9, color: TOKENS.textFaint }}
        >
          {msgs.length} msgs
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex flex-col gap-2 scrollbar-thin"
        style={{ flex: 1, overflow: "auto", padding: "10px 12px" }}
      >
        {msgs.map((m, i) => (
          <div key={m.id ?? i} style={{ fontSize: 12, lineHeight: 1.4 }}>
            <span
              className="font-mono"
              style={{ color: m.c, fontWeight: 700, fontSize: 11 }}
            >
              {m.user}
            </span>
            <span style={{ color: "#cad3cf", marginLeft: 8 }}>{m.msg}</span>
          </div>
        ))}
      </div>
      <div
        className="flex gap-1.5"
        style={{ padding: 8, borderTop: `1px solid ${TOKENS.panelBorder}` }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="メッセージを送信..."
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: TOKENS.textPrimary,
            padding: "8px 10px",
            borderRadius: 4,
            fontSize: 12,
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        <button
          onClick={send}
          className="font-mono"
          style={{
            background: TOKENS.mint,
            color: "#06070a",
            border: 0,
            fontSize: 10,
            padding: "0 12px",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: 700,
            letterSpacing: "0.14em",
          }}
        >
          SEND
        </button>
      </div>
    </div>
  );
}
