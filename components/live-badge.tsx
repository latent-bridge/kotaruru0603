"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStreamState, type StreamState } from "@/lib/archive";
import { PALETTE } from "@/lib/mochi";

const TICK_MS = 30_000;

export function LiveBadge() {
  const [state, setState] = useState<StreamState>(() =>
    getStreamState(new Date()),
  );

  useEffect(() => {
    const tick = () => setState(getStreamState(new Date()));
    const t = setInterval(tick, TICK_MS);
    return () => clearInterval(t);
  }, []);

  if (state.kind !== "live") return null;

  return (
    <Link
      href="/stream/"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 999,
        background: PALETTE.coral,
        color: "#fff",
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: 1,
        border: `2px solid ${PALETTE.ink}`,
        boxShadow: `2px 2px 0 ${PALETTE.ink}`,
        textDecoration: "none",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#fff",
          animation: "pulse 1.2s ease-in-out infinite",
        }}
      />
      らいぶちゅう ♡
    </Link>
  );
}
