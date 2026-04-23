import Link from "next/link";
import Image from "next/image";
import { PALETTE, FONTS, TONE_BG } from "@/lib/mochi";
import type { Category, Memory } from "@/lib/archive";

function cardHref(memory: Memory): string {
  return `/archive/${memory.videoId}/`;
}

// --- カテゴリ配色 -------------------------------------------------------

export const CATEGORY_COLORS: Record<Category, { color: string; bg: string }> = {
  "ポンコツだいぶ": { color: "#c25470", bg: "#fbe0e4" },
  "ポンコツさむらい": { color: "#7a6bb4", bg: "#e2dff2" },
  "ゆるげーむ": { color: "#5a8870", bg: "#d6e6d8" },
};

/** コラボ専用の色 (ゲーム category と同系統だが独立) */
export const COLLAB_COLOR = { color: "#a68248", bg: "#f6e8b0" };

export function CategoryChip({
  category,
  size = "sm",
}: {
  category: Category;
  size?: "sm" | "xs";
}) {
  const c = CATEGORY_COLORS[category];
  const pad = size === "xs" ? "2px 8px" : "3px 10px";
  const fs = size === "xs" ? 10 : 11;
  return (
    <span
      style={{
        display: "inline-block",
        padding: pad,
        background: c.bg,
        color: c.color,
        fontSize: fs,
        fontWeight: 700,
        borderRadius: 999,
        border: `1.5px solid ${c.color}`,
        fontFamily: FONTS.body,
      }}
    >
      {category}
    </span>
  );
}

export function CollabBadge({ size = "sm" }: { size?: "sm" | "xs" }) {
  const pad = size === "xs" ? "2px 8px" : "3px 10px";
  const fs = size === "xs" ? 10 : 11;
  return (
    <span
      style={{
        display: "inline-block",
        padding: pad,
        background: COLLAB_COLOR.bg,
        color: COLLAB_COLOR.color,
        fontSize: fs,
        fontWeight: 700,
        borderRadius: 999,
        border: `1.5px solid ${COLLAB_COLOR.color}`,
        fontFamily: FONTS.body,
      }}
    >
      こらぼ
    </span>
  );
}

export function CollabChip({ name }: { name: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        background: "#fff",
        color: PALETTE.ink,
        fontSize: 10,
        fontWeight: 700,
        borderRadius: 999,
        border: `1.5px solid ${PALETTE.ink}`,
        fontFamily: FONTS.body,
      }}
    >
      ♡ {name}
    </span>
  );
}

// --- サムネ (背景フォールバック付き) -----------------------------------

function ThumbnailPattern({ memory }: { memory: Memory }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `repeating-linear-gradient(135deg, ${TONE_BG[memory.tone]}, ${TONE_BG[memory.tone]} 10px, rgba(0,0,0,0.04) 10px, rgba(0,0,0,0.04) 20px)`,
      }}
    />
  );
}

function DurationBadge({ duration }: { duration: string }) {
  return (
    <span
      style={{
        position: "absolute",
        bottom: 6,
        right: 8,
        fontSize: 10,
        fontFamily: FONTS.mono,
        color: "#fff",
        background: "rgba(0,0,0,0.72)",
        padding: "2px 6px",
        borderRadius: 4,
        fontWeight: 700,
        letterSpacing: 0.5,
      }}
    >
      {duration}
    </span>
  );
}

// --- はいしんカード (16:9) ---------------------------------------------

export function ArchiveCard({ memory }: { memory: Memory }) {
  return (
    <Link
      href={cardHref(memory)}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <article
        style={{
          background: "#fff",
          borderRadius: 18,
          border: `2.5px solid ${PALETTE.ink}`,
          boxShadow: `3px 3px 0 ${PALETTE.ink}`,
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          transition: "transform 0.12s",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            aspectRatio: "16 / 9",
            borderRadius: 12,
            border: `2px solid ${PALETTE.ink}`,
            position: "relative",
            overflow: "hidden",
            background: TONE_BG[memory.tone],
          }}
        >
          <ThumbnailPattern memory={memory} />
          <Image
            src={memory.thumbnailUrl}
            alt={memory.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            unoptimized
          />
          <DurationBadge duration={memory.duration} />
          {memory.pinned && (
            <span
              style={{
                position: "absolute",
                top: 6,
                left: 6,
                fontSize: 10,
                fontFamily: FONTS.mono,
                color: "#fff",
                background: PALETTE.coral,
                padding: "2px 8px",
                borderRadius: 999,
                fontWeight: 900,
                letterSpacing: 0.5,
                border: `1.5px solid ${PALETTE.ink}`,
              }}
            >
              ★ PIN
            </span>
          )}
        </div>
        <div>
          <h3
            style={{
              fontWeight: 900,
              fontSize: 14,
              lineHeight: 1.35,
              color: PALETTE.ink,
              margin: "0 0 8px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {memory.title}
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 4,
            }}
          >
            {memory.category && <CategoryChip category={memory.category} />}
            {memory.collabWith.length > 0 && <CollabBadge />}
            {memory.episode !== null && (
              <span
                style={{
                  fontSize: 10,
                  fontFamily: FONTS.mono,
                  color: PALETTE.inkDim,
                  fontWeight: 700,
                }}
              >
                #{memory.episode}
              </span>
            )}
            {memory.collabWith.map((name) => (
              <CollabChip key={name} name={name} />
            ))}
          </div>
          <div
            style={{
              fontSize: 10,
              fontFamily: FONTS.mono,
              color: PALETTE.inkDim,
              letterSpacing: 0.5,
            }}
          >
            {memory.date} · {memory.views} views
          </div>
        </div>
      </article>
    </Link>
  );
}

// --- くりっぷカード (9:16) ---------------------------------------------

export function ClipCard({ memory }: { memory: Memory }) {
  return (
    <Link
      href={cardHref(memory)}
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
    >
      <article
        style={{
          background: "#fff",
          borderRadius: 18,
          border: `2.5px solid ${PALETTE.ink}`,
          boxShadow: `3px 3px 0 ${PALETTE.ink}`,
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            aspectRatio: "9 / 16",
            borderRadius: 12,
            border: `2px solid ${PALETTE.ink}`,
            position: "relative",
            overflow: "hidden",
            background: TONE_BG[memory.tone],
          }}
        >
          <Image
            src={memory.thumbnailUrl}
            alt={memory.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{ objectFit: "cover" }}
            unoptimized
          />
          <DurationBadge duration={memory.duration} />
        </div>
        <h3
          style={{
            fontWeight: 700,
            fontSize: 12,
            lineHeight: 1.35,
            color: PALETTE.ink,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {memory.title}
        </h3>
        <div
          style={{
            fontSize: 10,
            fontFamily: FONTS.mono,
            color: PALETTE.inkDim,
            letterSpacing: 0.5,
          }}
        >
          {memory.views} views
        </div>
      </article>
    </Link>
  );
}
