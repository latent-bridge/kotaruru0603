"use client";

import { useEffect, useState } from "react";
import { TOKENS } from "@/lib/data";

export function Countdown({ target = "21:00" }: { target?: string }) {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const [h, m] = target.split(":").map(Number);
      const end = new Date();
      end.setHours(h, m, 0, 0);
      if (end < now) end.setDate(end.getDate() + 1);
      const diff = end.getTime() - now.getTime();
      const hh = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const mm = String(Math.floor(diff / 60000) % 60).padStart(2, "0");
      const ss = String(Math.floor(diff / 1000) % 60).padStart(2, "0");
      setT(`${hh}:${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return (
    <div
      className="font-mono"
      style={{
        fontSize: 18,
        fontWeight: 700,
        color: TOKENS.mint,
        letterSpacing: "0.1em",
        padding: "6px 10px",
        border: `1px solid ${TOKENS.mintDim}`,
        borderRadius: 4,
        background: "rgba(163,255,214,0.04)",
      }}
    >
      T— {t}
    </div>
  );
}
