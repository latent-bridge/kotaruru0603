// Stamp registry + parser + atomic renderer for chat messages whose body
// matches `stamp:MASCOT_EXPRESSION` (e.g. `stamp:hamu_shy`). See
// chat-stamps.md. The wire format is plain text — chat-api / DB stay
// unaware; only the client renderer treats it specially.

import {
  MascotUsa,
  Neko,
  Kuma,
  Panda,
  Kitsune,
  Hamu,
  Pen,
  EXPRESSIONS,
  type Expression,
} from "./mascots";

type MascotComp = React.ComponentType<{
  size?: number;
  accent?: string;
  expression?: Expression;
}>;

export const MASCOT_COMPONENTS = {
  usa: MascotUsa,
  neko: Neko,
  kuma: Kuma,
  panda: Panda,
  kitsune: Kitsune,
  hamu: Hamu,
  pen: Pen,
} as const satisfies Record<string, MascotComp>;

export type MascotKey = keyof typeof MASCOT_COMPONENTS;

export const MASCOT_LIST: { key: MascotKey; label: string }[] = [
  { key: "usa", label: "うさぎ" },
  { key: "neko", label: "ねこ" },
  { key: "kuma", label: "くま" },
  { key: "panda", label: "ぱんだ" },
  { key: "kitsune", label: "きつね" },
  { key: "hamu", label: "はむ" },
  { key: "pen", label: "ぺんぎん" },
];

const EXPRESSION_KEYS = new Set<string>(EXPRESSIONS.map((e) => e.key));

// Decode `mascot_expression` → components. Returns null on any miss so the
// caller can fall back to plain-text rendering (non-destructive).
export function parseStampName(
  name: string,
): { mascot: MascotKey; expression: Expression } | null {
  const i = name.lastIndexOf("_");
  if (i <= 0) return null;
  const m = name.slice(0, i);
  const e = name.slice(i + 1);
  if (!(m in MASCOT_COMPONENTS)) return null;
  if (!EXPRESSION_KEYS.has(e)) return null;
  return { mascot: m as MascotKey, expression: e as Expression };
}

const STAMP_BODY_RE = /^stamp:([a-z_]+)$/;

// Whole-message check (matches the doc's atomic 1-message-1-stamp rule).
export function parseStampBody(
  body: string,
): { mascot: MascotKey; expression: Expression } | null {
  const m = body.trim().match(STAMP_BODY_RE);
  if (!m) return null;
  return parseStampName(m[1]);
}

export function Stamp({
  mascot,
  expression,
  size = 96,
  accent,
}: {
  mascot: MascotKey;
  expression: Expression;
  size?: number;
  accent?: string;
}) {
  const Comp = MASCOT_COMPONENTS[mascot];
  return (
    <span style={{ display: "inline-block", lineHeight: 0 }}>
      <Comp size={size} expression={expression} accent={accent} />
    </span>
  );
}
