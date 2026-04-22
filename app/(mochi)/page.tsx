import Link from "next/link";
import { MOCHI, PALETTE, FONTS } from "@/lib/mochi";
import { memories } from "@/lib/archive";
import {
  MochiButton,
  EyebrowChip,
  SectionTitle,
  Onigiri,
} from "@/components/mochi-ui";
import { ArchiveCard } from "@/components/archive-ui";

export default function HomePage() {
  return (
    <main className="max-w-[1200px] mx-auto px-5 md:px-10 relative">
      <Hero />
      <MiniCards />
      <WeekPreview />
      <LatestMemories />

      <Onigiri
        size={52}
        style={{
          position: "absolute",
          top: 600,
          right: 10,
          transform: "rotate(12deg)",
          zIndex: 0,
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 820,
          left: 40,
          fontSize: 26,
          color: PALETTE.accent,
          transform: "rotate(-10deg)",
          zIndex: 0,
        }}
      >
        ♡
      </div>
      <div
        style={{
          position: "absolute",
          top: 480,
          left: "45%",
          fontSize: 22,
          color: PALETTE.accent,
          transform: "rotate(8deg)",
          zIndex: 0,
        }}
      >
        ✦
      </div>
    </main>
  );
}

function Hero() {
  const { streamer, today } = MOCHI;
  return (
    <section className="pt-6 md:pt-8 pb-6 md:pb-8 grid grid-cols-1 md:grid-cols-[1.25fr_1fr] gap-8 md:gap-10 items-start">
      <div>
        <EyebrowChip>☁ HELLO ☁</EyebrowChip>
        <h1
          className="text-[48px] md:text-[72px] lg:text-[90px]"
          style={{
            fontFamily: FONTS.body,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 0.92,
            color: PALETTE.ink,
            margin: "14px 0 0",
          }}
        >
          きょうも、<br />
          <span
            style={{
              background: `linear-gradient(180deg, transparent 60%, ${PALETTE.coral}80 60%)`,
            }}
          >
            もちもちに
          </span>
          <br />
          おしゃべり。
        </h1>
        <p
          className="text-[13px] md:text-[15px] mt-5 md:mt-6"
          style={{
            color: PALETTE.inkDim,
            lineHeight: 1.9,
            maxWidth: 440,
            whiteSpace: "pre-line",
          }}
        >
          {streamer.tagline}
        </p>
        <div className="flex gap-3 mt-6 flex-wrap">
          <MochiButton href="/schedule">みにいく →</MochiButton>
        </div>
      </div>

      <div className="relative mt-2 md:mt-8">
        <div
          style={{
            background: "#fff",
            borderRadius: 22,
            border: `2.5px solid ${PALETTE.ink}`,
            boxShadow: `4px 4px 0 ${PALETTE.ink}`,
            padding: "20px 22px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -14,
              left: 18,
              background: PALETTE.mint,
              color: PALETTE.ink,
              padding: "3px 12px",
              borderRadius: 10,
              border: `2px solid ${PALETTE.ink}`,
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            ☀ きょうのよてい
          </div>
          <div
            style={{
              fontSize: 13,
              marginTop: 8,
              color: PALETTE.inkDim,
              fontFamily: FONTS.mono,
            }}
          >
            {today.dateLabel}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 900,
              marginTop: 6,
              lineHeight: 1.25,
            }}
          >
            {today.title}
          </div>
          <div style={{ fontSize: 13, color: PALETTE.inkDim, marginTop: 4 }}>
            {today.time}
          </div>

          <div
            className="flex items-center gap-2 mt-3"
            style={{
              background: PALETTE.cream + "80",
              padding: "9px 12px",
              borderRadius: 10,
              border: `1.5px dashed ${PALETTE.ink}`,
            }}
          >
            <span style={{ fontSize: 11, color: PALETTE.inkDim }}>
              はじまるまで
            </span>
            <span
              style={{
                fontSize: 17,
                fontWeight: 900,
                color: PALETTE.accent,
                fontFamily: FONTS.mono,
              }}
            >
              {today.countdown}
            </span>
          </div>

          <div className="flex gap-1.5 mt-3 flex-wrap">
            {today.tags.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 11,
                  padding: "4px 9px",
                  background: "#fdf3ea",
                  border: `1.5px solid ${PALETTE.ink}`,
                  borderRadius: 999,
                  fontWeight: 700,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <MochiButton size="sm" href="/schedule">
              しらせて ♡
            </MochiButton>
            <MochiButton size="sm" variant="outline" href="/schedule">
              よていぜんぶ
            </MochiButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniCards() {
  // グッズ機能は未実装のため「おとどけもの」は一旦除外
  const cards = MOCHI.bottomCards.filter((c) => c.t !== "おとどけもの");
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 py-4 md:py-6">
      {cards.map((card) => {
        const hrefMap: Record<string, string> = {
          おしゃべり: "/",
          おもいで: "/archive",
        };
        const bgMap = {
          coral: PALETTE.coral,
          lilac: PALETTE.lilac,
          mint: PALETTE.mint,
        };
        return (
          <Link
            key={card.t}
            href={hrefMap[card.t] ?? "/"}
            style={{
              background: "#fff",
              borderRadius: 18,
              border: `2.5px solid ${PALETTE.ink}`,
              boxShadow: `3px 3px 0 ${PALETTE.ink}`,
              padding: "14px 16px",
              display: "flex",
              gap: 12,
              alignItems: "center",
              position: "relative",
              textDecoration: "none",
              color: PALETTE.ink,
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 14,
                background: bgMap[card.c],
                border: `2px solid ${PALETTE.ink}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                flexShrink: 0,
              }}
            >
              {card.ic}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 900 }}>{card.t}</div>
              <div
                style={{
                  fontSize: 10,
                  color: PALETTE.inkDim,
                  fontFamily: FONTS.mono,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                / {card.jp}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: PALETTE.inkDim,
                  marginTop: 4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {card.sub}
              </div>
            </div>
            <div
              style={{
                fontSize: 18,
                color: PALETTE.accent,
                fontWeight: 900,
              }}
            >
              →
            </div>
          </Link>
        );
      })}
    </section>
  );
}

function WeekPreview() {
  return (
    <section className="py-8 md:py-12">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-5">
        <SectionTitle eyebrow="☁ THIS WEEK ☁" title="こんしゅうのよてい" />
        <Link
          href="/schedule"
          style={{
            fontSize: 13,
            color: PALETTE.accent,
            fontWeight: 900,
            textDecoration: "underline",
            textDecorationStyle: "dashed",
          }}
        >
          ぜんぶみる →
        </Link>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          border: `2.5px solid ${PALETTE.ink}`,
          boxShadow: `3px 3px 0 ${PALETTE.ink}`,
          overflow: "hidden",
        }}
      >
        {MOCHI.schedule.slice(0, 5).map((s, i) => {
          const isOff = s.category === "おやすみ";
          return (
            <div
              key={s.day}
              className="grid grid-cols-[52px_1fr_auto] md:grid-cols-[64px_64px_1fr_auto] gap-3 md:gap-4 items-center px-4 md:px-5 py-3 md:py-4"
              style={{
                borderBottom:
                  i === 4 ? "none" : `1.5px dashed ${PALETTE.inkSoft}`,
                opacity: isOff ? 0.55 : 1,
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: PALETTE.accent,
                  lineHeight: 1,
                }}
              >
                {s.weekday}
              </span>
              <span
                className="hidden md:inline-block"
                style={{
                  fontSize: 12,
                  color: PALETTE.inkDim,
                  fontFamily: FONTS.mono,
                }}
              >
                {s.dateLabel}
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <span style={{ fontSize: 18 }}>{s.emoji}</span>
                <span
                  className="text-[14px] md:text-[16px]"
                  style={{
                    fontWeight: 900,
                    color: PALETTE.ink,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.title}
                </span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: PALETTE.inkDim,
                  fontFamily: FONTS.mono,
                  whiteSpace: "nowrap",
                }}
              >
                {s.time}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LatestMemories() {
  // 最新 3 本の配信 (publishedAt desc で取得済み、クリップは除外)
  const latest = memories.filter((m) => m.kind === "stream").slice(0, 3);
  return (
    <section className="py-8 md:py-12">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-5">
        <SectionTitle eyebrow="☁ RECENT MEMORIES ☁" title="さいきんのおもいで" />
        <Link
          href="/archive"
          style={{
            fontSize: 13,
            color: PALETTE.accent,
            fontWeight: 900,
            textDecoration: "underline",
            textDecorationStyle: "dashed",
          }}
        >
          ぜんぶみる →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {latest.map((m) => (
          <ArchiveCard key={m.videoId} memory={m} />
        ))}
      </div>
    </section>
  );
}

