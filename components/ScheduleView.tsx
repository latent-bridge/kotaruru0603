"use client";

import { useState } from "react";
import { SCHEDULE, TOKENS } from "@/lib/data";

const panel = {
  background: TOKENS.panelBg,
  border: `1px solid ${TOKENS.panelBorder}`,
  borderRadius: 10,
};

export function ScheduleModeSwitch({
  mode,
  setMode,
}: {
  mode: "week" | "month";
  setMode: (m: "week" | "month") => void;
}) {
  return (
    <div className="flex gap-1">
      {(["week", "month"] as const).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.16em",
            padding: "6px 10px",
            borderRadius: 4,
            cursor: "pointer",
            border: `1px solid ${mode === m ? TOKENS.mint : "rgba(255,255,255,0.1)"}`,
            background: mode === m ? "rgba(163,255,214,0.08)" : "transparent",
            color: mode === m ? TOKENS.mint : TOKENS.textMuted,
          }}
        >
          {m === "week" ? "WEEK" : "MONTH"}
        </button>
      ))}
    </div>
  );
}

export function ScheduleView() {
  const [mode, setMode] = useState<"week" | "month">("week");
  return (
    <div>
      <div className="flex justify-end mb-3">
        <ScheduleModeSwitch mode={mode} setMode={setMode} />
      </div>
      {mode === "week" ? <WeekView /> : <MonthView />}
    </div>
  );
}

function WeekView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
      {SCHEDULE.map((d) => (
        <div
          key={d.day}
          style={{
            ...panel,
            padding: 10,
            borderColor:
              d.tag === "OFF" ? "rgba(255,255,255,0.04)" : TOKENS.panelBorder,
            opacity: d.tag === "OFF" ? 0.6 : 1,
          }}
        >
          <div
            style={{
              borderBottom: `1px solid ${TOKENS.panelBorder}`,
              paddingBottom: 6,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            <div
              className="font-mono"
              style={{
                fontSize: 9,
                color: TOKENS.textMuted,
                letterSpacing: "0.22em",
              }}
            >
              {d.day}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>
              {d.date}
            </div>
          </div>
          <div style={{ minHeight: 80 }}>
            {d.tag !== "OFF" ? (
              <>
                <div
                  className="font-mono"
                  style={{
                    fontSize: 9,
                    color: TOKENS.mint,
                    letterSpacing: "0.14em",
                  }}
                >
                  {d.tag}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    marginTop: 2,
                    lineHeight: 1.3,
                  }}
                >
                  {d.title}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: TOKENS.textMuted,
                    marginTop: 4,
                  }}
                >
                  {d.time}
                </div>
              </>
            ) : (
              <div
                className="font-mono"
                style={{
                  fontSize: 10,
                  color: TOKENS.textFaint,
                  marginTop: 8,
                }}
              >
                — OFF —
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function MonthView() {
  const days: number[] = [];
  for (let i = 1; i <= 30; i++) days.push(i);
  const marks: Record<number, string> = {
    4: "FPS", 6: "FPS", 7: "CHILL", 8: "FPS", 9: "COLLAB", 10: "CHILL",
    11: "FPS", 13: "FPS", 14: "CHILL", 16: "FPS", 18: "FPS", 20: "CHILL",
  };
  const color: Record<string, string> = {
    FPS: TOKENS.mint,
    CHILL: TOKENS.pink,
    COLLAB: "#ffe486",
  };
  return (
    <div>
      <div
        className="grid grid-cols-7"
        style={{ gap: 4, marginBottom: 4 }}
      >
        {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
          <div
            key={d}
            className="font-mono"
            style={{
              fontSize: 10,
              color: TOKENS.textFaint,
              textAlign: "center",
              padding: 6,
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7" style={{ gap: 4 }}>
        {days.map((d) => (
          <div
            key={d}
            style={{
              ...panel,
              padding: 6,
              aspectRatio: "1.3",
              borderColor: marks[d] ? TOKENS.mintDim : "rgba(255,255,255,0.04)",
              position: "relative",
            }}
          >
            <div
              className="font-mono"
              style={{ fontSize: 10, color: "#cad3cf" }}
            >
              {d}
            </div>
            {marks[d] && (
              <div
                className="font-mono"
                style={{
                  position: "absolute",
                  bottom: 4,
                  left: 6,
                  right: 6,
                  fontSize: 8,
                  letterSpacing: "0.1em",
                  color: color[marks[d]],
                }}
              >
                ● {marks[d]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
