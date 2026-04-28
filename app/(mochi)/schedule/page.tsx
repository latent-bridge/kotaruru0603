import { MOCHI, PALETTE, FONTS, isOffEntry } from "@/lib/mochi";
import {
  MochiButton,
  TagList,
  EyebrowChip,
  Fusen,
  Kumo,
  Onigiri,
} from "@/components/mochi-ui";
import { NotifyButton } from "@/components/NotifyButton";

export default function SchedulePage() {
  return (
    <main className="max-w-[1040px] mx-auto px-5 md:px-10 relative">
      <header className="pt-6 md:pt-8 pb-6 md:pb-8">
        <EyebrowChip>☁ THIS WEEK ☁</EyebrowChip>
        <h1
          className="text-[40px] md:text-[56px]"
          style={{
            fontFamily: FONTS.body,
            fontWeight: 900,
            letterSpacing: -1,
            lineHeight: 1,
            color: PALETTE.ink,
            margin: "10px 0 0",
          }}
        >
          こんしゅうの<br />
          <span
            style={{
              background: `linear-gradient(180deg, transparent 60%, ${PALETTE.mint}aa 60%)`,
            }}
          >
            よていひょう。
          </span>
        </h1>
        <p
          className="text-[13px] md:text-[14px] mt-4 md:mt-5 max-w-[520px]"
          style={{ color: PALETTE.inkDim, lineHeight: 1.9 }}
        >
          はいしんの よていは、かわることが あるかも。<br />
          だいじな おしらせは X でも つぶやくので、あわせて みてね ♡
        </p>
      </header>

      <Kumo
        size={70}
        style={{
          position: "absolute",
          top: 60,
          right: -10,
          opacity: 0.7,
          transform: "rotate(6deg)",
          zIndex: 0,
        }}
      />

      <div className="flex flex-col gap-3 md:gap-4 relative z-10">
        {MOCHI.schedule.map((s, i) => (
          <ScheduleDay key={s.day} entry={s} index={i} />
        ))}
      </div>

      <div className="mt-10 flex gap-3 items-center flex-wrap">
        <MochiButton href="/">おうちに もどる →</MochiButton>
        <MochiButton variant="outline" href="/archive">
          おもいでを みる
        </MochiButton>
      </div>

      <Onigiri
        size={60}
        style={{
          position: "absolute",
          bottom: 40,
          right: 20,
          transform: "rotate(-8deg)",
          opacity: 0.85,
          zIndex: 0,
        }}
      />
    </main>
  );
}

function ScheduleDay({
  entry,
  index,
}: {
  entry: (typeof MOCHI.schedule)[number];
  index: number;
}) {
  const isOff = isOffEntry(entry);

  return (
    <article
      className="grid grid-cols-[60px_1fr] md:grid-cols-[100px_1fr_auto] gap-3 md:gap-5 items-start px-4 md:px-6 py-4 md:py-5 relative"
      style={{
        background: isOff ? "rgba(255,255,255,0.5)" : "#fff",
        borderRadius: 18,
        border: `2.5px solid ${PALETTE.ink}`,
        boxShadow: isOff
          ? `2px 2px 0 ${PALETTE.inkSoft}`
          : `3px 3px 0 ${PALETTE.ink}`,
        opacity: isOff ? 0.75 : 1,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: PALETTE.accent,
            lineHeight: 1,
          }}
        >
          {entry.weekday}
        </div>
        <div
          style={{
            fontSize: 11,
            color: PALETTE.inkDim,
            fontFamily: FONTS.mono,
            marginTop: 4,
            letterSpacing: 0.5,
          }}
        >
          {entry.dateLabel}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span style={{ fontSize: 22 }}>{entry.emoji}</span>
          <h2
            className="text-[18px] md:text-[22px]"
            style={{
              fontWeight: 900,
              margin: 0,
              color: PALETTE.ink,
              textDecoration: isOff ? "line-through" : "none",
            }}
          >
            {entry.title}
          </h2>
          {!isOff && <TagList tags={entry.tags} />}
        </div>
        <div
          style={{
            fontSize: 12,
            color: PALETTE.inkDim,
            fontFamily: FONTS.mono,
            letterSpacing: 0.5,
            marginBottom: 8,
          }}
        >
          {entry.time}
        </div>
        <p
          style={{
            fontSize: 13,
            color: PALETTE.inkDim,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          “{entry.note}”
        </p>
      </div>

      <div
        className="hidden md:flex items-center"
        style={{
          fontSize: 11,
          fontFamily: FONTS.mono,
          color: PALETTE.inkDim,
          letterSpacing: 1,
        }}
      >
        {!isOff && <NotifyButton size="sm" />}
      </div>

      {index === 0 && !isOff && (
        <div
          style={{
            position: "absolute",
            top: -14,
            right: -10,
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <Fusen color={PALETTE.cream} rotate={6} style={{ fontSize: 11 }}>
            ♡ まってるね
          </Fusen>
        </div>
      )}
    </article>
  );
}
