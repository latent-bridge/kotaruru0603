"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CARD_W,
  PANEL_H,
  CoverPanel,
  Stamp,
} from "@/components/StampCardOverlay";
import {
  fetchStampStatus,
  type StampStatus,
  type StampClaimResult,
} from "@/lib/stamp";
import { PALETTE, FONTS } from "@/lib/mochi";
import { EyebrowChip } from "@/components/mochi-ui";

// undefined = loading, null = anonymous (or fetch failed), object = authed.
type State = StampStatus | null | undefined;

export function HomeStampCard() {
  const [status, setStatus] = useState<State>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetchStampStatus().then((s) => {
      if (cancelled) return;
      // Total stamps is monotonic. If the overlay's grant event landed first
      // and bumped us to a higher total, ignore the (now stale) /stamp/me
      // result.
      setStatus((prev) => {
        if (prev && s && prev.total_stamps >= s.total_stamps) return prev;
        return s;
      });
    });

    function onUpdate(e: Event) {
      const detail = (e as CustomEvent<StampClaimResult>).detail;
      if (!detail) return;
      setStatus((prev) => {
        const baseline: StampStatus = prev ?? {
          total_stamps: 0,
          card_size: detail.card_size,
          today_claimed: false,
          today_in_jst: "",
        };
        if (baseline.total_stamps >= detail.total_stamps) return baseline;
        return {
          ...baseline,
          card_size: detail.card_size,
          total_stamps: detail.total_stamps,
          today_claimed: true,
        };
      });
    }
    window.addEventListener("lb:stamp-updated", onUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener("lb:stamp-updated", onUpdate);
    };
  }, []);

  return (
    <section
      className="py-6 md:py-8"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <EyebrowChip>☁ STAMP CARD ☁</EyebrowChip>

      {status === undefined ? (
        <Placeholder />
      ) : (
        <CardBody status={status} />
      )}

      <StatusLine status={status} />
    </section>
  );
}

function Placeholder() {
  // Reserve the slot to avoid CLS while /stamp/me is in flight.
  return (
    <div
      aria-hidden
      style={{
        width: CARD_W,
        height: PANEL_H * 2,
      }}
    />
  );
}

function CardBody({ status }: { status: StampStatus | null }) {
  const cardSize = status?.card_size ?? 7;
  const total = status?.total_stamps ?? 0;
  const { cardIndex, filledCount } = deriveDisplayState(total, cardSize);
  const dimmed = status === null;

  return (
    <div
      style={{
        position: "relative",
        width: CARD_W,
        height: PANEL_H * 2,
        transform: "rotate(-2deg)",
        transformOrigin: "center",
        opacity: dimmed ? 0.55 : 1,
        transition: "opacity 220ms ease",
      }}
    >
      <CoverPanel cardIndex={cardIndex} />
      <StaticStampPanel cardSize={cardSize} filledCount={filledCount} />
    </div>
  );
}

function StaticStampPanel({
  cardSize,
  filledCount,
}: {
  cardSize: number;
  filledCount: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: PANEL_H,
        left: 0,
        width: CARD_W,
        height: PANEL_H,
        background: PALETTE.paper,
        border: `2px solid ${PALETTE.ink}`,
        borderTop: "none",
        borderRadius: "4px 4px 16px 16px",
        boxShadow: `4px 4px 0 ${PALETTE.ink}`,
        padding: "16px 14px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "grid",
          // Fixed 7-col grid so 14-stamp cards wrap to 2 rows (week × 2).
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {Array.from({ length: cardSize }, (_, i) => {
          const filled = i < filledCount;
          return (
            <div
              key={i}
              style={{
                position: "relative",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: `1.5px dashed ${PALETTE.inkSoft}`,
                }}
              />
              {!filled && (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    fontFamily: FONTS.mono,
                    fontSize: 9,
                    color: PALETTE.inkDim,
                    opacity: 0.7,
                  }}
                >
                  {i + 1}
                </span>
              )}
              {filled && <Stamp variant="settled" />}
            </div>
          );
        })}
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 9,
          color: PALETTE.inkDim,
          letterSpacing: 1,
          textAlign: "center",
          marginTop: "auto",
        }}
      >
        {filledCount} / {cardSize}
      </div>
    </div>
  );
}

function StatusLine({ status }: { status: State }) {
  if (status === undefined) {
    // No layout space during loading either — let card placeholder hold.
    return <div style={{ height: 18 }} aria-hidden />;
  }
  if (status === null) {
    return (
      <Link
        href="/login/"
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: PALETTE.accent,
          textDecoration: "underline",
          textDecorationStyle: "dashed",
          textUnderlineOffset: 4,
        }}
      >
        ログインすると あつめられるよ →
      </Link>
    );
  }
  const text = status.today_claimed
    ? "きょうのスタンプ もらった ♡"
    : "きょうログインしたら 1 まい！";
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: PALETTE.ink,
        fontFamily: FONTS.body,
      }}
    >
      {text}
    </div>
  );
}

// total=0           → empty card 0
// total > 0, divisible by cardSize → just-completed card N-1, fully stamped
// otherwise         → active card N with `total mod cardSize` stamps
function deriveDisplayState(total: number, cardSize: number) {
  if (total <= 0) return { cardIndex: 0, filledCount: 0 };
  const remainder = total % cardSize;
  if (remainder === 0) {
    return { cardIndex: Math.floor(total / cardSize) - 1, filledCount: cardSize };
  }
  return { cardIndex: Math.floor(total / cardSize), filledCount: remainder };
}
