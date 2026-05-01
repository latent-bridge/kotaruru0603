// Inline-emoji picker for chat input. Self-contained: trigger button +
// floating panel with category tabs. On tap, calls `onPick(name)` so the
// parent can insert `emoji:NAME ` at the textarea cursor. See
// chat-inline-emoji.md.

"use client";

import { useEffect, useRef, useState } from "react";
import { ICON_CATEGORIES, Icon } from "./Icon";
import { PALETTE, FONTS } from "@/lib/mochi";

export function ChatEmojiPicker({ onPick }: { onPick: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Click outside the picker root closes it (lets users tap back into the
  // textarea or send button without leaving the panel hanging open).
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
        aria-label="えもじ"
        style={{
          width: 36,
          height: 36,
          padding: 0,
          border: `2px solid ${PALETTE.ink}`,
          borderRadius: 12,
          background: open ? PALETTE.cream : "#fff",
          color: PALETTE.ink,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon name="sparkle" size={18} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: 0,
            width: "min(340px, calc(100vw - 32px))",
            maxHeight: 280,
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
              flex: 1,
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
        </div>
      )}
    </div>
  );
}
