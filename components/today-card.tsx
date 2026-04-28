"use client";

import { useEffect, useState } from "react";
import { MOCHI, PALETTE, FONTS, isOffEntry, type ScheduleEntry } from "@/lib/mochi";
import { MochiButton, TagList } from "@/components/mochi-ui";
import { NotifyButton } from "@/components/NotifyButton";

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function findTodaysEntry(now: Date): ScheduleEntry | null {
  const key = DAY_KEYS[now.getDay()];
  return MOCHI.schedule.find((s) => s.day === key) ?? null;
}

function formatDateLabel(now: Date): string {
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const wd = DAY_KEYS[now.getDay()];
  return `${m} / ${d} (${wd})`;
}

/**
 * Hero 右の「きょうのよてい」カード。
 * クライアント側で `new Date()` を元に MOCHI.schedule から今日のエントリーを
 * 引いて描画する。SSR 時点では skeleton を出し、マウント後に差し替え。
 */
export function TodayCard() {
  const [entry, setEntry] = useState<ScheduleEntry | null>(null);
  const [dateLabel, setDateLabel] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const now = new Date();
    setEntry(findTodaysEntry(now));
    setDateLabel(formatDateLabel(now));
    setMounted(true);
  }, []);

  const isOff = !!entry && isOffEntry(entry);

  return (
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
          background: isOff ? PALETTE.cream : PALETTE.mint,
          color: PALETTE.ink,
          padding: "3px 12px",
          borderRadius: 10,
          border: `2px solid ${PALETTE.ink}`,
          fontSize: 11,
          fontWeight: 900,
        }}
      >
        {isOff ? "☁ きょうの ようす" : "☀ きょうのよてい"}
      </div>

      <div
        style={{
          fontSize: 13,
          marginTop: 8,
          color: PALETTE.inkDim,
          fontFamily: FONTS.mono,
          minHeight: 18,
        }}
      >
        {mounted ? dateLabel : "..."}
      </div>

      {!mounted ? (
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            marginTop: 6,
            lineHeight: 1.25,
            color: PALETTE.inkDim,
          }}
        >
          よみこみちゅう…
        </div>
      ) : !entry ? (
        <>
          <div
            style={{
              fontSize: 22,
              fontWeight: 900,
              marginTop: 6,
              lineHeight: 1.25,
            }}
          >
            よていは まだ きまってないよ ♡
          </div>
          <p
            style={{
              fontSize: 13,
              color: PALETTE.inkDim,
              lineHeight: 1.7,
              marginTop: 6,
            }}
          >
            X で つぶやくので、あわせて みてね
          </p>
          <div className="mt-4 flex gap-2">
            <MochiButton size="sm" href="/schedule">
              よていぜんぶ
            </MochiButton>
          </div>
        </>
      ) : isOff ? (
        <>
          <div
            style={{
              fontSize: 24,
              fontWeight: 900,
              marginTop: 6,
              lineHeight: 1.25,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>{entry.emoji}</span>
            <span>おやすみ</span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: PALETTE.inkDim,
              lineHeight: 1.7,
              marginTop: 8,
            }}
          >
            “{entry.note}”
          </p>
          <div className="mt-4 flex gap-2">
            <MochiButton size="sm" variant="outline" href="/schedule">
              よていぜんぶ
            </MochiButton>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              fontSize: 22,
              fontWeight: 900,
              marginTop: 6,
              lineHeight: 1.25,
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span>{entry.emoji}</span>
            <span style={{ flex: 1, minWidth: 0 }}>{entry.title}</span>
          </div>
          <div
            style={{
              fontSize: 13,
              color: PALETTE.inkDim,
              marginTop: 4,
              fontFamily: FONTS.mono,
            }}
          >
            {entry.time}
          </div>

          <div className="flex gap-1.5 mt-3 flex-wrap">
            <TagList tags={entry.tags} />
          </div>

          {entry.note && (
            <p
              style={{
                fontSize: 12,
                color: PALETTE.inkDim,
                lineHeight: 1.7,
                marginTop: 10,
              }}
            >
              “{entry.note}”
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <NotifyButton size="sm" defaultVariant="filled" />
            <MochiButton size="sm" variant="outline" href="/schedule">
              よていぜんぶ
            </MochiButton>
          </div>
        </>
      )}
    </div>
  );
}
