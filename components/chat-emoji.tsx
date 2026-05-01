// Message body renderer for chat. Two-stage:
//   1. Whole-message stamp (chat-stamps.md) — atomic large mascot
//   2. Inline emoji substring (chat-inline-emoji.md) — emoji:NAME → <Icon>

import React from "react";
import { ICON_MAP, Icon } from "./Icon";
import { parseStampBody, Stamp } from "./chat-stamp";

const EMOJI_RE = /\bemoji:([a-z_]+)\b/g;

export function ChatBody({
  body,
  size = 18,
  stampSize = 96,
}: {
  body: string;
  size?: number;
  stampSize?: number;
}) {
  const stamp = parseStampBody(body);
  if (stamp) {
    return (
      <Stamp
        mascot={stamp.mascot}
        expression={stamp.expression}
        size={stampSize}
      />
    );
  }

  const parts: React.ReactNode[] = [];
  let last = 0;

  for (const m of body.matchAll(EMOJI_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) parts.push(body.slice(last, idx));
    const name = m[1];
    if (ICON_MAP[name]) {
      parts.push(
        <Icon key={`${idx}-${name}`} name={name} size={size} />,
      );
    } else {
      // Unknown name — leave as plain text so the body is non-destructive.
      parts.push(m[0]);
    }
    last = idx + m[0].length;
  }
  if (last < body.length) parts.push(body.slice(last));

  return <>{parts}</>;
}
