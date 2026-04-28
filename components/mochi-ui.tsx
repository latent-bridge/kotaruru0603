import Link from "next/link";
import {
  PALETTE,
  FONTS,
  CATEGORY_COLOR,
  TONE_BG,
  tagColor,
  type Category,
  type Memory,
} from "@/lib/mochi";

// ═══ SVG キャラクター ═══

export function MochiUsa({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: "block" }}>
      <ellipse cx="28" cy="14" rx="6" ry="12" fill="#fff" stroke={PALETTE.ink} strokeWidth="2" />
      <ellipse cx="52" cy="14" rx="6" ry="12" fill="#fff" stroke={PALETTE.ink} strokeWidth="2" />
      <ellipse cx="28" cy="15" rx="2.5" ry="7" fill={PALETTE.coral} />
      <ellipse cx="52" cy="15" rx="2.5" ry="7" fill={PALETTE.coral} />
      <circle cx="40" cy="46" r="26" fill="#fff" stroke={PALETTE.ink} strokeWidth="2" />
      <circle cx="26" cy="52" r="4" fill={PALETTE.coral} opacity="0.55" />
      <circle cx="54" cy="52" r="4" fill={PALETTE.coral} opacity="0.55" />
      <ellipse cx="32" cy="44" rx="2" ry="3" fill={PALETTE.ink} />
      <ellipse cx="48" cy="44" rx="2" ry="3" fill={PALETTE.ink} />
      <circle cx="32.5" cy="43" r="0.8" fill="#fff" />
      <circle cx="48.5" cy="43" r="0.8" fill="#fff" />
      <path d="M 36 52 Q 40 55 44 52" fill="none" stroke={PALETTE.ink} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Kumo({
  size = 50,
  style,
}: {
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 80 52"
      style={style}
      aria-hidden
    >
      <path
        d="M 15 32 Q 6 32 6 22 Q 6 12 18 14 Q 20 4 32 6 Q 38 -2 50 4 Q 66 2 68 16 Q 78 18 74 30 Q 72 40 60 38 L 22 38 Q 14 40 15 32 Z"
        fill="#fff"
        stroke={PALETTE.ink}
        strokeWidth="2"
      />
    </svg>
  );
}

export function Onigiri({
  size = 44,
  style,
}: {
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={style} aria-hidden>
      <path
        d="M 30 8 L 52 48 Q 54 54 48 54 L 12 54 Q 6 54 8 48 Z"
        fill="#fff8e0"
        stroke={PALETTE.ink}
        strokeWidth="2.5"
      />
      <rect x="20" y="36" width="20" height="12" fill={PALETTE.ink} />
      <circle cx="22" cy="30" r="1.5" fill={PALETTE.ink} />
      <circle cx="38" cy="32" r="1.5" fill={PALETTE.ink} />
      <path
        d="M 26 38 Q 28 40 30 38"
        stroke={PALETTE.coral}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ═══ UI プリミティブ ═══

export function Fusen({
  children,
  color = "#fff8a0",
  rotate = -2,
  style,
}: {
  children: React.ReactNode;
  color?: string;
  rotate?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: color,
        padding: "10px 14px",
        fontSize: 13,
        fontFamily: FONTS.hand,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "2px 3px 6px rgba(0,0,0,0.1)",
        position: "relative",
        color: PALETTE.ink,
        lineHeight: 1.4,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function MochiButton({
  children,
  variant = "filled",
  href,
  size = "md",
}: {
  children: React.ReactNode;
  variant?: "filled" | "outline" | "cream";
  href?: string;
  size?: "sm" | "md";
}) {
  const sizing =
    size === "sm"
      ? { padX: 16, padY: 9, fontSize: 12, shadow: "2px 2px 0" }
      : { padX: 22, padY: 12, fontSize: 14, shadow: "3px 3px 0" };

  const bg =
    variant === "filled" ? PALETTE.coral : variant === "cream" ? PALETTE.cream : "#fff";
  const color = variant === "filled" ? "#fff" : PALETTE.ink;

  const style = {
    display: "inline-block",
    padding: `${sizing.padY}px ${sizing.padX}px`,
    background: bg,
    color,
    fontSize: sizing.fontSize,
    fontWeight: 900,
    borderRadius: 14,
    border: `2.5px solid ${PALETTE.ink}`,
    boxShadow: `${sizing.shadow} ${PALETTE.ink}`,
    textDecoration: "none",
    cursor: "pointer",
    fontFamily: FONTS.body,
    letterSpacing: 0.3,
  } as const;

  if (href) {
    return (
      <Link href={href} style={style}>
        {children}
      </Link>
    );
  }
  return <span style={style}>{children}</span>;
}

export function CategoryTag({ category }: { category: Category }) {
  const c = CATEGORY_COLOR[category];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        background: c.bg,
        color: c.color,
        fontSize: 11,
        fontWeight: 700,
        borderRadius: 999,
        border: `1.5px solid ${c.color === "rgba(58,46,42,0.4)" ? PALETTE.inkSoft : c.color}`,
      }}
    >
      {category}
    </span>
  );
}

// Schedule tag chip with #-prefix display matching the original MIDNIGHT OPS
// design. Preset tags use CATEGORY_COLOR; free-form tags fall through to the
// default neutral tone via tagColor().
export function TagChip({ tag }: { tag: string }) {
  const c = tagColor(tag);
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 9px",
        background: c.bg,
        color: c.color,
        fontSize: 11,
        fontWeight: 700,
        borderRadius: 999,
        border: `1.5px solid ${c.color}`,
      }}
    >
      #{tag}
    </span>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 4 }}>
      {tags.map((t) => <TagChip key={t} tag={t} />)}
    </span>
  );
}

export function EyebrowChip({
  children,
  bg = PALETTE.cream,
}: {
  children: React.ReactNode;
  bg?: string;
}) {
  return (
    <div
      style={{
        display: "inline-block",
        padding: "5px 12px",
        background: bg,
        border: `2px solid ${PALETTE.ink}`,
        borderRadius: 10,
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: 2,
        color: PALETTE.ink,
      }}
    >
      {children}
    </div>
  );
}

export function MemoryCard({ memory }: { memory: Memory }) {
  return (
    <article
      style={{
        background: "#fff",
        borderRadius: 18,
        border: `2.5px solid ${PALETTE.ink}`,
        boxShadow: `3px 3px 0 ${PALETTE.ink}`,
        padding: "14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          aspectRatio: "16 / 9",
          background: `repeating-linear-gradient(135deg, ${TONE_BG[memory.tone]}, ${TONE_BG[memory.tone]} 10px, rgba(0,0,0,0.04) 10px, rgba(0,0,0,0.04) 20px)`,
          borderRadius: 12,
          border: `2px solid ${PALETTE.ink}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
          color: PALETTE.ink,
          position: "relative",
        }}
      >
        {memory.emoji}
        <span
          style={{
            position: "absolute",
            bottom: 6,
            right: 8,
            fontSize: 10,
            fontFamily: FONTS.mono,
            color: PALETTE.ink,
            background: "rgba(255,255,255,0.8)",
            padding: "2px 6px",
            borderRadius: 4,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          {memory.duration}
        </span>
      </div>
      <div>
        <div
          style={{
            fontWeight: 900,
            fontSize: 15,
            lineHeight: 1.3,
            color: PALETTE.ink,
            marginBottom: 6,
          }}
        >
          {memory.title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <CategoryTag category={memory.category} />
          <span
            style={{
              fontSize: 11,
              fontFamily: FONTS.mono,
              color: PALETTE.inkDim,
              letterSpacing: 0.5,
            }}
          >
            {memory.date} · {memory.views}
          </span>
        </div>
      </div>
    </article>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  note,
}: {
  eyebrow: React.ReactNode;
  title: string;
  note?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <EyebrowChip>{eyebrow}</EyebrowChip>
      <h2
        style={{
          fontSize: 28,
          fontWeight: 900,
          letterSpacing: -0.8,
          color: PALETTE.ink,
          marginTop: 8,
          marginBottom: 0,
          lineHeight: 1.15,
        }}
      >
        {title}
      </h2>
      {note && (
        <p
          style={{
            fontSize: 13,
            color: PALETTE.inkDim,
            lineHeight: 1.7,
            marginTop: 6,
          }}
        >
          {note}
        </p>
      )}
    </div>
  );
}
