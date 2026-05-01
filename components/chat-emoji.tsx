// Inline emoji renderer for chat. Scans message body for `emoji:NAME`
// markers and renders matched names as <Icon> SVGs. See chat-inline-emoji.md.

import React from "react";
import { ICON_MAP, Icon } from "./Icon";

const MARKER_RE = /\bemoji:([a-z_]+)\b/g;

export function ChatBody({
  body,
  size = 18,
}: {
  body: string;
  size?: number;
}) {
  const parts: React.ReactNode[] = [];
  let last = 0;

  for (const m of body.matchAll(MARKER_RE)) {
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
