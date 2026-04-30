// Renders the per-entry icon stored in admin-managed data (`entry.emoji`,
// `memory.emoji`, etc).
//
// Resolution rule:
//   1. If `value` is a known icon name (snake_case key in ICON_MAP), render the
//      site's original SVG via <Icon />.
//   2. Otherwise render the raw string as plain text.
//
// We intentionally do NOT fall back to the unicode→SVG auto-replacement that
// `Emo` performs. New saves go through the admin IconPicker which only writes
// icon names; legacy DB rows (saved before the migration) still containing raw
// unicode emoji simply render as text until they are re-selected from the
// admin. Any future inline-emoji syntax (e.g. `{{icon:NAME}}`) belongs in a
// separate parser, not here.
import { ICON_MAP, Icon } from "@/components/Icon";

export function EntryIcon({
  value,
  size = 18,
  accent,
  inline = true,
  style,
}: {
  value: string | null | undefined;
  size?: number;
  accent?: string;
  inline?: boolean;
  style?: React.CSSProperties;
}) {
  if (!value) return null;
  if (ICON_MAP[value]) {
    return <Icon name={value} size={size} accent={accent} inline={inline} style={style} />;
  }
  return <span style={style}>{value}</span>;
}
