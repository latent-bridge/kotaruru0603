"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PALETTE } from "@/lib/mochi";
import { Icon } from "@/components/Icon";

const API_BASE =
  process.env.NEXT_PUBLIC_CHAT_API_BASE ?? "https://chat.latent-bridge.com";
const SITE_ID = "kotaruru0603";

type LiveStateResponse = {
  status: "live" | "offline";
  video_id: string | null;
};

export function LiveBadge() {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/public/live/${SITE_ID}`)
      .then((r) => (r.ok ? (r.json() as Promise<LiveStateResponse>) : null))
      .then((data) => {
        if (!cancelled && data) setIsLive(data.status === "live");
      })
      .catch(() => {
        /* network down → leave pill hidden */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isLive) return null;

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
      らいぶちゅう <Icon name="heart" size={11} accent="#fff" />
    </Link>
  );
}
