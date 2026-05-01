// <Icon name="..." size={...} accent={...} /> — explicit, named SVG icons
// for direct use in JSX. Decoupled from unicode emoji entirely: callers
// pick a site icon by *name* rather than relying on emoji-replacement
// shortcuts (the latter is what `Emo` does and is intentionally separate).
//
// Naming: snake_case-ish lowercase derived from the underlying component
// (e.g. `IconController` -> `controller`, `MascotUsa` -> `usa`).

import { PALETTE } from "@/lib/mochi";
import {
  IconController,
  IconArcade,
  IconDisc,
  IconVHS,
  IconTV,
  IconMic,
  IconHeadphone,
  IconPlay,
  IconLive,
  IconTrophy,
  IconBubble,
  IconLetter,
  IconHeart,
  IconStar,
  IconBell,
  IconPin,
  IconTag,
  IconCamera,
  IconLink,
  IconShare,
  IconHouse,
  IconMug,
  IconBook,
  IconPencil,
  IconCalendar,
  IconClock,
  IconKey,
  IconGift,
  IconBag,
  IconOnigiri,
  IconCake,
  IconRamen,
  IconCandy,
  IconIcecream,
  IconCloud,
  IconSun,
  IconMoon,
  IconRain,
  IconFlower,
  IconLeaf,
  IconSparkle,
  IconCrown,
  IconRibbon,
  IconBalloon,
  IconHandshake,
  IconFish,
  IconBow,
  IconKatana,
  IconCastle,
  IconKabuto,
  IconShuriken,
  IconSensu,
  IconMon,
  IconYumi,
  IconHinawa,
  IconTaiko,
  IconNobori,
  IconTank,
  IconJet,
  IconMissile,
  IconHelmet,
  IconGasmask,
  IconGrenade,
  IconBoom,
  IconBarbed,
  IconRadio,
  IconMG,
  IconSearch,
} from "./icons-full";
import { MascotUsa } from "./mascots";

type IconComp = React.ComponentType<{ size?: number; accent?: string }>;

export const ICON_MAP: Record<string, IconComp> = {
  // streaming / media
  controller: IconController,
  arcade: IconArcade,
  disc: IconDisc,
  vhs: IconVHS,
  tv: IconTV,
  mic: IconMic,
  headphone: IconHeadphone,
  play: IconPlay,
  live: IconLive,
  trophy: IconTrophy,

  // communication / decoration
  bubble: IconBubble,
  letter: IconLetter,
  heart: IconHeart,
  star: IconStar,
  bell: IconBell,
  pin: IconPin,
  tag: IconTag,
  camera: IconCamera,
  link: IconLink,
  share: IconShare,

  // house / daily
  house: IconHouse,
  mug: IconMug,
  book: IconBook,
  pencil: IconPencil,
  calendar: IconCalendar,
  clock: IconClock,
  key: IconKey,
  gift: IconGift,
  bag: IconBag,

  // food
  onigiri: IconOnigiri,
  cake: IconCake,
  ramen: IconRamen,
  candy: IconCandy,
  icecream: IconIcecream,

  // weather / nature
  cloud: IconCloud,
  sun: IconSun,
  moon: IconMoon,
  rain: IconRain,
  flower: IconFlower,
  leaf: IconLeaf,
  sparkle: IconSparkle,

  // ui / decorative
  crown: IconCrown,
  ribbon: IconRibbon,
  balloon: IconBalloon,

  // people / gestures / animals
  handshake: IconHandshake,
  fish: IconFish,
  bow: IconBow,
  usa: MascotUsa,

  // samurai / war set
  katana: IconKatana,
  castle: IconCastle,
  kabuto: IconKabuto,
  shuriken: IconShuriken,
  sensu: IconSensu,
  mon: IconMon,
  yumi: IconYumi,
  hinawa: IconHinawa,
  taiko: IconTaiko,
  nobori: IconNobori,
  tank: IconTank,
  jet: IconJet,
  missile: IconMissile,
  helmet: IconHelmet,
  gasmask: IconGasmask,
  grenade: IconGrenade,
  boom: IconBoom,
  barbed: IconBarbed,
  radio: IconRadio,
  mg: IconMG,

  // status / ui glyphs
  search: IconSearch,
};

// Per-icon natural accent. Only listed when the icon has an obvious real-world
// color that pink wouldn't read as. Anything not in this map falls back to
// PALETTE.coral (the site's default warm pink). Callers can still override by
// passing an explicit `accent` prop — that always wins.
const ICON_ACCENTS: Record<string, string> = {
  // water / sky
  fish: PALETTE.sky,
  rain: PALETTE.sky,
  cloud: PALETTE.sky,

  // plants
  leaf: PALETTE.mint,

  // sky bodies
  sun: PALETTE.cream,
  moon: PALETTE.lilac,
  sparkle: PALETTE.lilac,
  star: PALETTE.cream,

  // gold / shiny
  crown: PALETTE.cream,
  trophy: PALETTE.cream,
  key: PALETTE.cream,
  bell: PALETTE.cream,

  // signal / status
  check: PALETTE.mint,
  heart: PALETTE.accent,
  live: PALETTE.accent,
  letter: PALETTE.accent,

  // food
  ramen: PALETTE.cream,
  candy: PALETTE.lilac,
  onigiri: PALETTE.ink,

  // dark equipment / glyph readability
  pencil: PALETTE.ink,
  camera: PALETTE.ink,
  search: PALETTE.ink,
  settings: PALETTE.ink,
  arrow: PALETTE.ink,
  user: PALETTE.ink,

  // samurai (steel / dark)
  katana: PALETTE.ink,
  kabuto: PALETTE.ink,
  shuriken: PALETTE.ink,
  hinawa: PALETTE.ink,
  mon: PALETTE.ink,
  yumi: PALETTE.ink,
  taiko: PALETTE.accent,
  nobori: PALETTE.accent,

  // military
  tank: PALETTE.ink,
  jet: PALETTE.ink,
  missile: PALETTE.ink,
  helmet: PALETTE.ink,
  gasmask: PALETTE.ink,
  grenade: PALETTE.ink,
  barbed: PALETTE.ink,
  radio: PALETTE.ink,
  mg: PALETTE.ink,
  boom: PALETTE.cream,
};

export function iconAccent(name: string): string {
  return ICON_ACCENTS[name] ?? PALETTE.coral;
}

// Tab-friendly grouping for the chat emoji picker (chat-inline-emoji.md).
// Mirrors the comment-based sections in ICON_MAP above. Keep in sync with
// ICON_MAP when adding new icons.
export const ICON_CATEGORIES: { label: string; names: string[] }[] = [
  { label: "はいしん", names: ["controller", "arcade", "disc", "vhs", "tv", "mic", "headphone", "play", "live", "trophy"] },
  { label: "やりとり", names: ["bubble", "letter", "heart", "star", "bell", "pin", "tag", "camera", "link", "share"] },
  { label: "くらし", names: ["house", "mug", "book", "pencil", "calendar", "clock", "key", "gift", "bag"] },
  { label: "たべもの", names: ["onigiri", "cake", "ramen", "candy", "icecream"] },
  { label: "てんき", names: ["cloud", "sun", "moon", "rain", "flower", "leaf", "sparkle"] },
  { label: "かざり", names: ["crown", "ribbon", "balloon"] },
  { label: "みんな", names: ["handshake", "fish", "bow", "usa"] },
  { label: "さむらい", names: ["katana", "castle", "kabuto", "shuriken", "sensu", "mon", "yumi", "hinawa", "taiko", "nobori", "tank", "jet", "missile", "helmet", "gasmask", "grenade", "boom", "barbed", "radio", "mg"] },
  { label: "そのた", names: ["search"] },
];

export function Icon({
  name,
  size = 16,
  accent,
  inline = true,
  style,
}: {
  name: string;
  size?: number;
  accent?: string;
  inline?: boolean;
  style?: React.CSSProperties;
}) {
  const Comp = ICON_MAP[name];
  if (!Comp) return null;
  const wrap: React.CSSProperties = inline
    ? {
        display: "inline-flex",
        verticalAlign: "middle",
        lineHeight: 0,
        ...style,
      }
    : { display: "inline-flex", lineHeight: 0, ...style };
  return (
    <span style={wrap}>
      <Comp size={size} accent={accent ?? iconAccent(name)} />
    </span>
  );
}
