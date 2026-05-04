import Link from "next/link";
import { MOCHI, PALETTE, FONTS } from "@/lib/mochi";
import { memories } from "@/lib/archive";
import {
  MochiButton,
  EyebrowChip,
  SectionTitle,
  Onigiri,
} from "@/components/mochi-ui";
import { EntryIcon } from "@/components/EntryIcon";
import { Icon } from "@/components/Icon";
import { ArchiveCard } from "@/components/archive-ui";
import { TodayCard } from "@/components/today-card";
import { HomeStampCard } from "@/components/HomeStampCard";

export default function HomePage() {
  return (
    <main className="max-w-[1200px] mx-auto px-5 md:px-10 relative">
      <Hero />
      <HomeStampCard />
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
          transform: "rotate(-10deg)",
          zIndex: 0,
        }}
      >
        <Icon name="heart" size={26} accent={PALETTE.accent} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 480,
          left: "45%",
          transform: "rotate(8deg)",
          zIndex: 0,
        }}
      >
        <Icon name="sparkle" size={22} accent={PALETTE.accent} />
      </div>
    </main>
  );
}

function Hero() {
  const { streamer } = MOCHI;
  return (
    <section className="pt-6 md:pt-8 pb-6 md:pb-8 grid grid-cols-1 md:grid-cols-[1.25fr_1fr] gap-8 md:gap-10 items-start">
      <div>
        <EyebrowChip>
          <Icon name="cloud" size={12} /> HELLO <Icon name="cloud" size={12} />
        </EyebrowChip>
        <h1
          className="text-[40px] md:text-[60px] lg:text-[76px]"
          style={{
            fontFamily: FONTS.body,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 0.96,
            color: PALETTE.ink,
            margin: "14px 0 0",
          }}
        >
          <span
            style={{
              fontFamily: FONTS.hand,
              fontSize: "1.7em",
              fontWeight: 700,
              color: PALETTE.accent,
              letterSpacing: -1,
              marginRight: "0.08em",
              display: "inline-block",
              verticalAlign: "bottom",
              lineHeight: 0.85,
            }}
          >
            ruru
          </span>
          <span
            style={{
              display: "inline-block",
              verticalAlign: "top",
              lineHeight: 1,
              paddingTop: "0.15em",
            }}
          >
            の
          </span>
          <br />
          <span
            style={{
              background: `linear-gradient(180deg, transparent 60%, ${PALETTE.coral}80 60%)`,
              whiteSpace: "nowrap",
            }}
          >
            ぽんこつべや。
          </span>
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
          <MochiButton href="/stream">みにいく →</MochiButton>
        </div>
      </div>

      <div className="relative mt-2 md:mt-8">
        <TodayCard />
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
          おしゃべり: "/chat",
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
              <EntryIcon value={card.ic} size={26} />
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
        <SectionTitle
          eyebrow={
            <>
              <Icon name="cloud" size={12} /> THIS WEEK <Icon name="cloud" size={12} />
            </>
          }
          title="こんしゅうのよてい"
        />
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
          const isOff = s.tags.includes("おやすみ");
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
                <EntryIcon value={s.emoji} size={20} />
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
        <SectionTitle
          eyebrow={
            <>
              <Icon name="cloud" size={12} /> RECENT MEMORIES <Icon name="cloud" size={12} />
            </>
          }
          title="さいきんのおもいで"
        />
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

