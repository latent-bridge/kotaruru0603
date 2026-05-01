// Compose-action picker for chat input: a "+" trigger that opens a
// tabbed panel with `えもじ` (live) and `スタンプ` (placeholder until the
// mascot-based stamp feature lands; see chat-stamps.md). On emoji tap,
// calls `onPick(name)` so the parent inserts at the editor caret. See
// chat-inline-emoji.md.

"use client";

import { useEffect, useRef, useState } from "react";
import { ICON_CATEGORIES, Icon } from "./Icon";
import { PALETTE, FONTS } from "@/lib/mochi";

type Mode = "emoji" | "stamp";

export function ChatEmojiPicker({ onPick }: { onPick: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("emoji");
  const [tab, setTab] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Click outside the picker root closes it.
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const cat = ICON_CATEGORIES[tab];

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="メニュー"
        style={{
          width: 36,
          height: 36,
          padding: 0,
          border: `2px solid ${PALETTE.ink}`,
          borderRadius: 12,
          background: open ? PALETTE.cream : "#fff",
          color: PALETTE.ink,
          fontSize: 20,
          fontWeight: 900,
          fontFamily: FONTS.body,
          lineHeight: 1,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        +
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            right: 0,
            width: "min(340px, calc(100vw - 32px))",
            background: "#fff",
            border: `2px solid ${PALETTE.ink}`,
            borderRadius: 14,
            boxShadow: `3px 3px 0 ${PALETTE.ink}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              background: PALETTE.paper,
              borderBottom: `2px solid ${PALETTE.inkSoft}`,
              flexShrink: 0,
            }}
          >
            {(["emoji", "stamp"] as const).map((m) => {
              const active = m === mode;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    border: "none",
                    background: active ? "#fff" : "transparent",
                    color: PALETTE.ink,
                    fontSize: 12,
                    fontFamily: FONTS.body,
                    fontWeight: 900,
                    cursor: "pointer",
                    borderBottom: active
                      ? `2px solid ${PALETTE.accent}`
                      : "2px solid transparent",
                    marginBottom: -2,
                  }}
                >
                  {m === "emoji" ? "えもじ" : "スタンプ"}
                </button>
              );
            })}
          </div>

          {mode === "emoji" ? (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  padding: "6px 8px",
                  borderBottom: `1.5px dashed ${PALETTE.inkSoft}`,
                  background: PALETTE.paper,
                  overflowX: "auto",
                  flexShrink: 0,
                }}
              >
                {ICON_CATEGORIES.map((c, i) => (
                  <button
                    type="button"
                    key={c.label}
                    onClick={() => setTab(i)}
                    style={{
                      padding: "4px 10px",
                      border: `1.5px solid ${i === tab ? PALETTE.ink : "transparent"}`,
                      borderRadius: 999,
                      background: i === tab ? "#fff" : "transparent",
                      color: PALETTE.ink,
                      fontSize: 11,
                      fontFamily: FONTS.body,
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div
                style={{
                  maxHeight: 220,
                  overflowY: "auto",
                  padding: "8px 6px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
                  gap: 4,
                }}
              >
                {cat.names.map((name) => (
                  <button
                    type="button"
                    key={name}
                    onClick={() => onPick(name)}
                    aria-label={name}
                    style={{
                      width: 40,
                      height: 40,
                      padding: 0,
                      border: "none",
                      borderRadius: 8,
                      background: "transparent",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = PALETTE.paper;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Icon name={name} size={22} />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div
              style={{
                minHeight: 220,
                padding: "32px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: PALETTE.inkDim,
                fontSize: 12,
                fontFamily: FONTS.body,
                lineHeight: 1.6,
              }}
            >
              スタンプは じゅんびちゅう…
            </div>
          )}
        </div>
      )}
    </div>
  );
}
