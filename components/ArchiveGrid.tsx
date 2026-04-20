"use client";

import { useState } from "react";
import { ARCHIVES, TOKENS } from "@/lib/data";

const panel = {
  background: TOKENS.panelBg,
  border: `1px solid ${TOKENS.panelBorder}`,
  borderRadius: 10,
};

type ArchiveItem = (typeof ARCHIVES)[number];

export function ArchiveFilter({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: (f: string) => void;
}) {
  return (
    <div className="flex gap-1">
      {(["ALL", "FPS", "CHILL"] as const).map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.16em",
            padding: "6px 10px",
            borderRadius: 4,
            cursor: "pointer",
            border: `1px solid ${filter === f ? TOKENS.mint : "rgba(255,255,255,0.1)"}`,
            background: filter === f ? "rgba(163,255,214,0.08)" : "transparent",
            color: filter === f ? TOKENS.mint : TOKENS.textMuted,
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

export function ArchiveGrid() {
  const [filter, setFilter] = useState<string>("ALL");
  const items = ARCHIVES.filter((a) => filter === "ALL" || a.tag === filter);
  return (
    <div>
      <div className="flex justify-end mb-3">
        <ArchiveFilter filter={filter} setFilter={setFilter} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {items.map((a) => (
          <ArchiveCard key={a.id} a={a} />
        ))}
      </div>
    </div>
  );
}

function ArchiveCard({ a }: { a: ArchiveItem }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...panel,
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform .2s, border-color .2s",
        transform: hover ? "translateY(-3px)" : "translateY(0)",
        borderColor: hover ? TOKENS.mintDim : TOKENS.panelBorder,
      }}
    >
      <div
        style={{
          aspectRatio: "16 / 9",
          position: "relative",
          background: "linear-gradient(135deg, #1a2a2a, #070a0a)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.2,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(163,255,214,0.3) 0 1px, transparent 1px 4px)",
          }}
        />
        <div
          className="font-mono"
          style={{
            position: "absolute",
            left: 10,
            top: 10,
            fontSize: 9,
            letterSpacing: "0.16em",
            padding: "3px 6px",
            borderRadius: 2,
            background: a.tag === "FPS" ? TOKENS.mint : TOKENS.pink,
            color: "#06070a",
            fontWeight: 700,
          }}
        >
          {a.tag}
        </div>
        <div
          className="font-mono"
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
            fontSize: 10,
            padding: "3px 6px",
            borderRadius: 2,
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
          }}
        >
          {a.dur}
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hover ? 1 : 0,
            transition: "opacity .2s",
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: TOKENS.mint,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#06070a",
              fontSize: 18,
            }}
          >
            ▶
          </div>
        </div>
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>
          {a.title}
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: 10,
            color: TOKENS.textFaint,
            marginTop: 6,
            letterSpacing: "0.12em",
          }}
        >
          {a.views} views · {a.days}日前
        </div>
      </div>
    </div>
  );
}
