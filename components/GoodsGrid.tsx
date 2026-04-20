"use client";

import { useState } from "react";
import { GOODS, TOKENS } from "@/lib/data";

const panel = {
  background: TOKENS.panelBg,
  border: `1px solid ${TOKENS.panelBorder}`,
  borderRadius: 10,
};

type GoodsItem = (typeof GOODS)[number];

export function GoodsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {GOODS.map((g) => (
        <Card key={g.id} g={g} />
      ))}
    </div>
  );
}

function Card({ g }: { g: GoodsItem }) {
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
        transform: hover ? "translateY(-3px)" : "none",
        borderColor: hover ? g.accent + "55" : TOKENS.panelBorder,
      }}
    >
      <div
        style={{
          aspectRatio: "1",
          position: "relative",
          background: `linear-gradient(135deg, ${g.color}, #0a0a0f)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `repeating-linear-gradient(45deg, ${g.accent}08 0 10px, transparent 10px 20px)`,
          }}
        />
        <div
          className="font-mono"
          style={{
            position: "absolute",
            left: 10,
            top: 10,
            fontSize: 9,
            letterSpacing: "0.18em",
            color: g.accent,
          }}
        >
          [{g.kind}]
        </div>
        <div
          className="font-mono"
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            fontSize: 9,
            color: TOKENS.textFaint,
          }}
        >
          PRODUCT SHOT
        </div>
        <div
          className="font-mono"
          style={{
            position: "absolute",
            inset: "25%",
            border: `1px solid ${g.accent}55`,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            color: g.accent + "aa",
            letterSpacing: "0.2em",
          }}
        >
          PLACEHOLDER
        </div>
      </div>
      <div
        className="flex justify-between items-end gap-2"
        style={{ padding: 12 }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
          {g.name}
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: 13,
            color: g.accent,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          ¥{g.price.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
