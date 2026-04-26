"use client";

import { useEffect, useState } from "react";
import {
  claimStamp,
  deriveCardLayout,
  type StampClaimResult,
} from "@/lib/stamp";
import { PALETTE, FONTS } from "@/lib/mochi";
import { MochiUsa } from "@/components/mochi-ui";

type Phase =
  | "loading"
  | "entering"
  | "opening"
  | "stamping"
  | "holding"
  | "celebrating"
  | "closing"
  | "exiting"
  | "done";

const T = {
  entering: 600,
  opening: 700,
  stampDrop: 600,
  holding: 1100,
  celebrating: 2600,
  closing: 700,
  exiting: 400,
};

export const CARD_W = 320;
// Panel height has to fit two rows of 36px stamps + footer + padding while
// keeping the cover and stamp panels the same dimension (the fold animation
// hinges on this — bottom panel rotates 180° onto cover when closed).
export const PANEL_H = 148;

export function StampCardOverlay() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [result, setResult] = useState<StampClaimResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await claimStamp();
      if (cancelled) return;
      if (!r || !r.granted) {
        setPhase("done");
        return;
      }
      // Notify other widgets (HomeStampCard etc.) so they can refresh without
      // having to fire their own /stamp/me. AuthPill uses the same lb: event
      // namespace.
      window.dispatchEvent(
        new CustomEvent("lb:stamp-updated", { detail: r }),
      );
      setResult(r);
      setPhase("entering");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (phase === "loading" || phase === "done") return;
    const transitions: Partial<Record<Phase, [Phase, number]>> = {
      entering: ["opening", T.entering],
      opening: ["stamping", T.opening],
      stamping: ["holding", T.stampDrop],
      holding: [
        result?.completed_card ? "celebrating" : "closing",
        T.holding,
      ],
      celebrating: ["closing", T.celebrating],
      closing: ["exiting", T.closing],
      exiting: ["done", T.exiting],
    };
    const step = transitions[phase];
    if (!step) return;
    const timer = setTimeout(() => setPhase(step[0]), step[1]);
    return () => clearTimeout(timer);
  }, [phase, result?.completed_card]);

  if (phase === "loading" || phase === "done" || !result) return null;

  const layout = deriveCardLayout(result.total_stamps, result.card_size);
  const cardEntering = phase === "entering";
  const cardOpen =
    phase === "opening" ||
    phase === "stamping" ||
    phase === "holding" ||
    phase === "celebrating";
  const stampVisible =
    phase === "stamping" ||
    phase === "holding" ||
    phase === "celebrating" ||
    phase === "closing" ||
    phase === "exiting";
  const stampLanded =
    phase === "holding" ||
    phase === "celebrating" ||
    phase === "closing" ||
    phase === "exiting";
  const backdropVisible = phase !== "exiting";

  // Tap anywhere skips ahead. Avoid skipping past `closing` so the card still
  // animates back together rather than vanishing mid-air.
  function dismiss() {
    if (phase === "closing" || phase === "exiting") return;
    setPhase("closing");
  }

  return (
    <div
      role="dialog"
      aria-label="きょうの すたんぷ"
      aria-live="polite"
      onClick={dismiss}
      onKeyDown={(e) => {
        if (e.key === "Escape" || e.key === "Enter") dismiss();
      }}
      tabIndex={-1}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: backdropVisible
          ? "rgba(58,46,42,0.45)"
          : "rgba(58,46,42,0)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        transition: "background 400ms ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        padding: 16,
      }}
    >
      <FoldingCard
        cardEntering={cardEntering}
        cardOpen={cardOpen}
        cardSize={result.card_size}
        alreadyFilled={layout.alreadyFilled}
        slotIndex={layout.slotIndex}
        cardIndex={layout.cardIndex}
        stampVisible={stampVisible}
        stampLanded={stampLanded}
      />
      {phase === "celebrating" && (
        <CompletedBanner cardCount={layout.cardIndex + 1} />
      )}
    </div>
  );
}

function FoldingCard(props: {
  cardEntering: boolean;
  cardOpen: boolean;
  cardSize: number;
  alreadyFilled: number;
  slotIndex: number;
  cardIndex: number;
  stampVisible: boolean;
  stampLanded: boolean;
}) {
  const {
    cardEntering,
    cardOpen,
    cardSize,
    alreadyFilled,
    slotIndex,
    cardIndex,
    stampVisible,
    stampLanded,
  } = props;

  return (
    <div
      style={{
        perspective: 1400,
        // The flying-in transform is on this wrapper so it composes cleanly
        // with the inner 3D fold.
        transform: cardEntering
          ? "translateY(40vh) scale(0.55) rotate(-6deg)"
          : "translateY(0) scale(1) rotate(0)",
        transition:
          "transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: CARD_W,
          height: PANEL_H,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Top panel (cover). Always visible; bottom panel fold lives below. */}
        <CoverPanel cardIndex={cardIndex} />

        {/* Bottom panel — stamp grid. Hinged on the top edge so it folds
            up behind the cover when closed, swings down flat when open. */}
        <div
          style={{
            position: "absolute",
            top: PANEL_H,
            left: 0,
            width: CARD_W,
            height: PANEL_H,
            transformOrigin: "top center",
            transform: cardOpen ? "rotateX(0deg)" : "rotateX(-180deg)",
            transition: "transform 700ms cubic-bezier(0.5, 1.3, 0.5, 1)",
            transformStyle: "preserve-3d",
          }}
        >
          <StampPanel
            cardSize={cardSize}
            alreadyFilled={alreadyFilled}
            slotIndex={slotIndex}
            stampVisible={stampVisible}
            stampLanded={stampLanded}
          />
        </div>
      </div>
    </div>
  );
}

export function CoverPanel({ cardIndex }: { cardIndex: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: CARD_W,
        height: PANEL_H,
        background: PALETTE.paper,
        border: `2px solid ${PALETTE.ink}`,
        borderRadius: "16px 16px 4px 4px",
        boxShadow: `4px 4px 0 ${PALETTE.ink}`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
      }}
    >
      {/* Decorative dot pattern */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${PALETTE.coral}40 1.5px, transparent 1.5px)`,
          backgroundSize: "16px 16px",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 11,
            color: PALETTE.inkDim,
            letterSpacing: 1.5,
            fontWeight: 700,
          }}
        >
          PONKOTSU STAMP
        </div>
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 22,
            color: PALETTE.ink,
            fontWeight: 900,
            lineHeight: 1.1,
            marginTop: 2,
          }}
        >
          ぽんこつすたんぷ
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 10,
            color: PALETTE.inkDim,
            marginTop: 6,
            letterSpacing: 1,
          }}
        >
          CARD #{String(cardIndex + 1).padStart(3, "0")}
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <MochiUsa size={70} />
      </div>
    </div>
  );
}

function StampPanel(props: {
  cardSize: number;
  alreadyFilled: number;
  slotIndex: number;
  stampVisible: boolean;
  stampLanded: boolean;
}) {
  const { cardSize, alreadyFilled, slotIndex, stampVisible, stampLanded } =
    props;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: CARD_W,
        height: PANEL_H,
        background: PALETTE.paper,
        border: `2px solid ${PALETTE.ink}`,
        borderTop: "none",
        borderRadius: "4px 4px 16px 16px",
        boxShadow: `4px 4px 0 ${PALETTE.ink}`,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
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
          const isAlready = i < alreadyFilled;
          const isActive = i === slotIndex;
          return (
            <Slot
              key={i}
              index={i + 1}
              filled={isAlready}
              active={isActive}
              stampVisible={isActive && stampVisible}
              stampLanded={isActive && stampLanded}
            />
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
        {alreadyFilled + 1} / {cardSize}
      </div>
    </div>
  );
}

function Slot(props: {
  index: number;
  filled: boolean;
  active: boolean;
  stampVisible: boolean;
  stampLanded: boolean;
}) {
  const { index, filled, active, stampVisible, stampLanded } = props;
  return (
    <div
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
          background: "transparent",
        }}
      />
      <div
        style={{
          position: "absolute",
          fontFamily: FONTS.mono,
          fontSize: 9,
          color: PALETTE.inkDim,
          opacity: filled || active ? 0 : 0.7,
          transition: "opacity 200ms ease",
        }}
      >
        {index}
      </div>
      {filled && <Stamp variant="settled" />}
      {active && stampVisible && (
        <>
          <Stamp variant={stampLanded ? "landed" : "falling"} />
          {stampLanded && <Shockwave />}
        </>
      )}
    </div>
  );
}

export function Stamp({ variant }: { variant: "settled" | "falling" | "landed" }) {
  // settled = pre-existing stamps from earlier days (small, slight rotation)
  // falling = the new stamp mid-drop (large, high, transparent)
  // landed  = the new stamp seated in its slot (full size, low rotation)
  const transform =
    variant === "falling"
      ? "translateY(-90px) scale(2.4) rotate(22deg)"
      : variant === "landed"
        ? "translateY(0) scale(1) rotate(-6deg)"
        : "translateY(0) scale(1) rotate(-4deg)";
  const opacity = variant === "falling" ? 0 : 1;
  const transition =
    variant === "settled"
      ? "none"
      : "transform 600ms cubic-bezier(0.55, 1.7, 0.5, 1), opacity 220ms ease-out";

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width: 30,
        height: 30,
        borderRadius: "50%",
        background: PALETTE.accent,
        border: `2px solid ${PALETTE.ink}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: PALETTE.cream,
        fontFamily: FONTS.body,
        fontWeight: 900,
        fontSize: 14,
        letterSpacing: -0.5,
        transform,
        opacity,
        transition,
      }}
    >
      ru
    </div>
  );
}

function Shockwave() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width: 30,
        height: 30,
        borderRadius: "50%",
        border: `2px solid ${PALETTE.accent}`,
        animation: "stamp-shockwave 600ms ease-out forwards",
      }}
    />
  );
}

function CompletedBanner({ cardCount }: { cardCount: number }) {
  return (
    <div
      role="status"
      style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translate(-50%, 0)",
        animation: "stamp-banner-in 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        background: PALETTE.cream,
        border: `2px solid ${PALETTE.ink}`,
        borderRadius: 18,
        boxShadow: `4px 4px 0 ${PALETTE.ink}`,
        padding: "14px 22px",
        textAlign: "center",
        fontFamily: FONTS.body,
        zIndex: 2,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: PALETTE.inkDim,
          fontWeight: 700,
          letterSpacing: 1.5,
        }}
      >
        ★ CARD COMPLETE ★
      </div>
      <div
        style={{
          fontSize: 22,
          color: PALETTE.accent,
          fontWeight: 900,
          marginTop: 2,
          lineHeight: 1.2,
        }}
      >
        カード {cardCount} まい目 かんせい！
      </div>
      <div
        style={{
          fontSize: 11,
          color: PALETTE.inkDim,
          marginTop: 4,
          letterSpacing: 0.5,
        }}
      >
        またあした、つぎのカードで ♡
      </div>
      <Sparkles />
    </div>
  );
}

function Sparkles() {
  // Six little sparkles fanning out around the banner. Pure CSS keyframe.
  const positions = [
    { left: "-10%", top: "20%", delay: 0 },
    { left: "108%", top: "10%", delay: 120 },
    { left: "5%", top: "80%", delay: 240 },
    { left: "100%", top: "75%", delay: 80 },
    { left: "50%", top: "-30%", delay: 200 },
    { left: "50%", top: "115%", delay: 320 },
  ];
  return (
    <>
      {positions.map((p, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            left: p.left,
            top: p.top,
            fontSize: 18,
            color: PALETTE.accent,
            animation: `stamp-sparkle 1400ms ease-in-out ${p.delay}ms infinite`,
          }}
        >
          ✦
        </span>
      ))}
    </>
  );
}
