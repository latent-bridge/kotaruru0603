"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getStreamState,
  relatedMemories,
  type Memory,
  type StreamState,
} from "@/lib/archive";
import { PALETTE, FONTS, TONE_BG } from "@/lib/mochi";
import { EyebrowChip, Kumo, Onigiri } from "@/components/mochi-ui";
import {
  ArchiveCard,
  CategoryChip,
  CollabChip,
} from "@/components/archive-ui";
import { StreamPlayer, StreamChat } from "@/components/stream-ui";

function cleanTitle(title: string): string {
  return title.replace(/\s*(?:#\S+\s*)+$/u, "").trim() || title;
}

export default function StreamPage() {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const state = useMemo<StreamState>(() => getStreamState(now), [now]);

  return (
    <main
      className="max-w-[1200px] mx-auto px-5 md:px-8 relative"
      style={{ paddingBottom: 60 }}
    >
      <Kumo
        size={60}
        style={{
          position: "absolute",
          top: 40,
          right: 20,
          opacity: 0.55,
          transform: "rotate(-6deg)",
          zIndex: 0,
        }}
      />
      <Onigiri
        size={48}
        style={{
          position: "absolute",
          top: 180,
          left: 8,
          transform: "rotate(12deg)",
          opacity: 0.6,
          zIndex: 0,
        }}
      />

      {state.kind === "live" && <LiveView state={state} />}
      {state.kind === "upcoming" && <UpcomingView state={state} now={now} />}
      {state.kind === "none" && <NoStreamView />}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// LiveView
// ═══════════════════════════════════════════════════════════════════════

function LiveView({
  state,
}: {
  state: Extract<StreamState, { kind: "live" }>;
}) {
  const { memory, videoId } = state;
  const related = relatedMemories(memory, 6);
  const displayTitle = cleanTitle(memory.title);

  return (
    <>
      <header style={{ padding: "18px 0 14px" }}>
        <EyebrowChip bg={PALETTE.coral}>
          <span style={{ color: "#fff" }}>🔴 LIVE NOW ♡</span>
        </EyebrowChip>
        <h1
          style={{
            fontFamily: FONTS.body,
            fontWeight: 900,
            fontSize: "clamp(22px, 3.5vw, 30px)",
            lineHeight: 1.3,
            letterSpacing: -0.3,
            color: PALETTE.ink,
            margin: "10px 0 12px",
          }}
        >
          {displayTitle}
        </h1>
        <MetaRow memory={memory} videoId={videoId} />
      </header>

      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 md:gap-5"
        style={{ position: "relative", zIndex: 1 }}
      >
        <StreamPlayer videoId={videoId} title={memory.title} />
        <StreamChat videoId={videoId} />
      </div>

      {related.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <EyebrowChip>☁ こんなのも ☁</EyebrowChip>
            <span
              style={{
                fontSize: 11,
                fontFamily: FONTS.mono,
                color: PALETTE.inkDim,
              }}
            >
              おなじげーむの かこはいしん ♡
            </span>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: 16 }}
          >
            {related.map((m) => (
              <ArchiveCard key={m.videoId} memory={m} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function MetaRow({ memory, videoId }: { memory: Memory; videoId: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 10,
      }}
    >
      {memory.category && <CategoryChip category={memory.category} />}
      {memory.game && (
        <span
          style={{
            display: "inline-block",
            padding: "3px 10px",
            background: "#fff",
            color: PALETTE.ink,
            fontSize: 11,
            fontWeight: 700,
            borderRadius: 999,
            border: `1.5px solid ${PALETTE.ink}`,
            fontFamily: FONTS.mono,
          }}
        >
          🎮 {memory.game}
        </span>
      )}
      {memory.collabWith.map((name) => (
        <CollabChip key={name} name={name} />
      ))}
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginLeft: "auto",
          fontSize: 11,
          fontFamily: FONTS.body,
          fontWeight: 900,
          color: PALETTE.ink,
          textDecoration: "none",
          background: PALETTE.cream,
          border: `2px solid ${PALETTE.ink}`,
          borderRadius: 999,
          padding: "5px 12px",
          boxShadow: `2px 2px 0 ${PALETTE.inkSoft}`,
        }}
      >
        YouTube で ひらく ↗
      </a>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// UpcomingView
// ═══════════════════════════════════════════════════════════════════════

function UpcomingView({
  state,
  now,
}: {
  state: Extract<StreamState, { kind: "upcoming" }>;
  now: Date;
}) {
  const { memory, scheduledAt, videoId } = state;
  const countdown = formatCountdown(scheduledAt.getTime() - now.getTime());
  const title = memory ? cleanTitle(memory.title) : "きょうの はいしん";
  const date = formatDateJa(scheduledAt);
  const time = formatTimeJa(scheduledAt);

  return (
    <section
      style={{
        padding: "28px 0",
        position: "relative",
        zIndex: 1,
      }}
    >
      <EyebrowChip>☁ NEXT STREAM ☁</EyebrowChip>
      <h1
        style={{
          fontFamily: FONTS.body,
          fontWeight: 900,
          fontSize: "clamp(28px, 5vw, 44px)",
          lineHeight: 1.15,
          letterSpacing: -0.5,
          color: PALETTE.ink,
          margin: "12px 0 18px",
        }}
      >
        <span
          style={{
            background: `linear-gradient(180deg, transparent 60%, ${PALETTE.cream}cc 60%)`,
          }}
        >
          はじまるまで
        </span>
      </h1>

      <div
        className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-5 md:gap-7 items-start"
      >
        <div
          style={{
            background: "#fff",
            border: `3px solid ${PALETTE.ink}`,
            borderRadius: 22,
            boxShadow: `5px 5px 0 ${PALETTE.ink}`,
            padding: 18,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 48,
              fontWeight: 900,
              letterSpacing: 2,
              color: PALETTE.accent,
              lineHeight: 1.1,
              textAlign: "center",
              padding: "12px 0",
            }}
          >
            {countdown}
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: 11,
              fontFamily: FONTS.mono,
              color: PALETTE.inkDim,
              letterSpacing: 1,
            }}
          >
            COUNTDOWN
          </div>
        </div>

        <div
          style={{
            background: PALETTE.paper,
            border: `2.5px dashed ${PALETTE.inkSoft}`,
            borderRadius: 18,
            padding: "18px 20px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontFamily: FONTS.mono,
              color: PALETTE.inkDim,
              letterSpacing: 1,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            📅 {date}{"  "}·{"  "}{time} 〜
          </div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: PALETTE.ink,
              lineHeight: 1.3,
              margin: "4px 0 12px",
            }}
          >
            {title}
          </h2>
          {memory && (
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              {memory.category && <CategoryChip category={memory.category} />}
              {memory.game && (
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    background: "#fff",
                    color: PALETTE.ink,
                    fontSize: 11,
                    fontWeight: 700,
                    borderRadius: 999,
                    border: `1.5px solid ${PALETTE.ink}`,
                    fontFamily: FONTS.mono,
                  }}
                >
                  🎮 {memory.game}
                </span>
              )}
              {memory.collabWith.map((name) => (
                <CollabChip key={name} name={name} />
              ))}
            </div>
          )}
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              fontSize: 13,
              fontFamily: FONTS.body,
              fontWeight: 900,
              color: "#fff",
              textDecoration: "none",
              background: PALETTE.coral,
              border: `2.5px solid ${PALETTE.ink}`,
              borderRadius: 14,
              padding: "10px 20px",
              boxShadow: `3px 3px 0 ${PALETTE.ink}`,
            }}
          >
            YouTube で おしらせうけとる ↗
          </a>
        </div>
      </div>

      {memory && (
        <div style={{ marginTop: 24 }}>
          <UpcomingThumbnail memory={memory} />
        </div>
      )}
    </section>
  );
}

function UpcomingThumbnail({ memory }: { memory: Memory }) {
  return (
    <div
      style={{
        position: "relative",
        maxWidth: 540,
        margin: "0 auto",
        aspectRatio: "16 / 9",
        borderRadius: 18,
        border: `3px solid ${PALETTE.ink}`,
        boxShadow: `4px 4px 0 ${PALETTE.ink}`,
        overflow: "hidden",
        background: TONE_BG[memory.tone],
      }}
    >
      <Image
        src={memory.thumbnailUrl}
        alt={memory.title}
        fill
        sizes="540px"
        style={{ objectFit: "cover" }}
        unoptimized
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// NoStreamView
// ═══════════════════════════════════════════════════════════════════════

function NoStreamView() {
  return (
    <section style={{ padding: "40px 0 20px", position: "relative", zIndex: 1 }}>
      <EyebrowChip>☁ OFFLINE ☁</EyebrowChip>
      <h1
        style={{
          fontFamily: FONTS.body,
          fontWeight: 900,
          fontSize: "clamp(28px, 5vw, 44px)",
          lineHeight: 1.2,
          letterSpacing: -0.5,
          color: PALETTE.ink,
          margin: "12px 0 14px",
        }}
      >
        <span
          style={{
            background: `linear-gradient(180deg, transparent 60%, ${PALETTE.cream}cc 60%)`,
          }}
        >
          いまは おやすみ
        </span>
      </h1>
      <p
        style={{
          fontSize: 14,
          color: PALETTE.inkDim,
          lineHeight: 1.9,
          maxWidth: 480,
          marginBottom: 24,
        }}
      >
        つぎの はいしんが きまったら ここに でるよ。<br />
        よていは「よてい」から、アーカイブは「おもいで」から みてね ♡
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link
          href="/schedule/"
          style={{
            display: "inline-block",
            fontSize: 13,
            fontFamily: FONTS.body,
            fontWeight: 900,
            color: PALETTE.ink,
            textDecoration: "none",
            background: PALETTE.cream,
            border: `2.5px solid ${PALETTE.ink}`,
            borderRadius: 14,
            padding: "10px 20px",
            boxShadow: `3px 3px 0 ${PALETTE.ink}`,
          }}
        >
          よていを みる →
        </Link>
        <Link
          href="/archive/"
          style={{
            display: "inline-block",
            fontSize: 13,
            fontFamily: FONTS.body,
            fontWeight: 900,
            color: PALETTE.ink,
            textDecoration: "none",
            background: "#fff",
            border: `2.5px solid ${PALETTE.ink}`,
            borderRadius: 14,
            padding: "10px 20px",
            boxShadow: `3px 3px 0 ${PALETTE.ink}`,
          }}
        >
          おもいで へ →
        </Link>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// helpers
// ═══════════════════════════════════════════════════════════════════════

function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (d > 0) {
    return `${d}d ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatDateJa(d: Date): string {
  const wd = ["にち", "げつ", "か", "すい", "もく", "きん", "ど"][d.getDay()];
  return `${d.getMonth() + 1}/${d.getDate()} (${wd})`;
}

function formatTimeJa(d: Date): string {
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const period = h < 5 ? "よる" : h < 12 ? "あさ" : h < 18 ? "ひる" : "よる";
  return `${period} ${h}:${m}`;
}
