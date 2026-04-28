// Mascot family — 7 SVG characters sharing the same vocabulary as MochiUsa.
// All 80×80 viewBox, 2px ink stroke, swappable 1:1.
//
// The shared <Face> engine paints eyes / mouth / cheeks / decorations on top
// of any character, driven by face-anchor presets. Expressions: smile (default),
// excited, sleepy, surprised, sad, shy, angry, cry.

import { PALETTE } from "@/lib/mochi";

const INK = PALETTE.ink;

export type Expression =
  | "smile"
  | "excited"
  | "sleepy"
  | "surprised"
  | "sad"
  | "shy"
  | "angry"
  | "cry";

type FaceAnchors = {
  eyeL: [number, number];
  eyeR: [number, number];
  cheekL: [number, number];
  cheekR: [number, number];
  mouth: [number, number];
  noseTop: number;
};

const FACE_DEFAULT: FaceAnchors = {
  eyeL: [32, 44], eyeR: [48, 44],
  cheekL: [26, 52], cheekR: [54, 52],
  mouth: [40, 53],
  noseTop: 50,
};

const FACE_BEAR: FaceAnchors = {
  eyeL: [32, 42], eyeR: [48, 42],
  cheekL: [24, 52], cheekR: [56, 52],
  mouth: [40, 54],
  noseTop: 50,
};

const FACE_HAMU: FaceAnchors = {
  eyeL: [32, 46], eyeR: [48, 46],
  cheekL: [20, 56], cheekR: [60, 56],
  mouth: [40, 53],
  noseTop: 51,
};

const FACE_PEN: FaceAnchors = {
  eyeL: [33, 36], eyeR: [47, 36],
  cheekL: [26, 44], cheekR: [54, 44],
  mouth: [40, 50],
  noseTop: 42,
};

// ───── Eye renderers ─────
function EyeDot({ cx, cy, rx = 2, ry = 3, onDark = false }: {
  cx: number; cy: number; rx?: number; ry?: number; onDark?: boolean;
}) {
  const fill = onDark ? "#fff" : INK;
  const hi = onDark ? INK : "#fff";
  return (
    <>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} />
      <circle cx={cx + 0.5} cy={cy - 1} r={0.8} fill={hi} />
    </>
  );
}

function EyeSparkle({ cx, cy, rx = 2.6, ry = 3.4, onDark = false }: {
  cx: number; cy: number; rx?: number; ry?: number; onDark?: boolean;
}) {
  const fill = onDark ? "#fff" : INK;
  return (
    <>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} />
      <circle cx={cx + 0.6} cy={cy - 1.1} r={1} fill="#fff" />
      <circle cx={cx - 0.8} cy={cy + 1} r={0.5} fill="#fff" />
    </>
  );
}

function EyeArc({ cx, cy }: { cx: number; cy: number }) {
  const d = `M ${cx - 3} ${cy} Q ${cx} ${cy + 2.4} ${cx + 3} ${cy}`;
  return <path d={d} fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />;
}

function EyeBig({ cx, cy, onDark = false }: { cx: number; cy: number; onDark?: boolean }) {
  const ring = "#fff";
  const stroke = onDark ? "#fff" : INK;
  return (
    <>
      <circle cx={cx} cy={cy} r={3.4} fill={ring} stroke={stroke} strokeWidth="1.4" />
      <circle cx={cx} cy={cy} r={1.4} fill={INK} />
    </>
  );
}

function EyeSad({ cx, cy, onDark = false }: { cx: number; cy: number; onDark?: boolean }) {
  const fill = onDark ? "#fff" : INK;
  const isLeft = cx < 40;
  const brow = isLeft
    ? `M ${cx - 4} ${cy - 2} L ${cx + 3} ${cy - 4.5}`
    : `M ${cx - 3} ${cy - 4.5} L ${cx + 4} ${cy - 2}`;
  return (
    <>
      <path d={brow} stroke={INK} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <ellipse cx={cx} cy={cy + 0.6} rx={2} ry={2.4} fill={fill} />
    </>
  );
}

function EyeAngry({ cx, cy, onDark = false }: { cx: number; cy: number; onDark?: boolean }) {
  const fill = onDark ? "#fff" : INK;
  const isLeft = cx < 40;
  const brow = isLeft
    ? `M ${cx - 4} ${cy - 4.5} L ${cx + 3} ${cy - 2}`
    : `M ${cx - 3} ${cy - 2}  L ${cx + 4} ${cy - 4.5}`;
  return (
    <>
      <path d={brow} stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <ellipse cx={cx} cy={cy + 0.6} rx={1.6} ry={2} fill={fill} />
    </>
  );
}

function EyeCry({ cx, cy }: { cx: number; cy: number }) {
  const isLeft = cx < 40;
  const brow = isLeft
    ? `M ${cx - 4} ${cy - 2.5} L ${cx + 3} ${cy - 5}`
    : `M ${cx - 3} ${cy - 5}   L ${cx + 4} ${cy - 2.5}`;
  return (
    <>
      <path d={brow} stroke={INK} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <ellipse cx={cx} cy={cy + 0.8} rx={2} ry={2.4} fill={INK} />
      <path
        d={`M ${cx - 0.5} ${cy + 3.5} Q ${cx - 2.4} ${cy + 8} ${cx - 0.5} ${cy + 11} Q ${cx + 1.4} ${cy + 8} ${cx - 0.5} ${cy + 3.5} Z`}
        fill="#7ab8e0" stroke={INK} strokeWidth="0.7" opacity="0.9"
      />
    </>
  );
}

function EyeShy({ cx, cy, onDark = false }: { cx: number; cy: number; onDark?: boolean }) {
  const fill = onDark ? "#fff" : INK;
  const off = cx < 40 ? 0.6 : -0.6;
  return (
    <>
      <ellipse cx={cx} cy={cy} rx={2} ry={2.6} fill={fill} />
      <circle cx={cx + off} cy={cy + 0.6} r={0.8} fill={onDark ? INK : "#fff"} />
    </>
  );
}

// ───── Mouth renderers ─────
function MouthSmile({ cx, cy }: { cx: number; cy: number }) {
  return <path d={`M ${cx - 4} ${cy - 1} Q ${cx} ${cy + 2} ${cx + 4} ${cy - 1}`}
               fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />;
}

function MouthExcited({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <path d={`M ${cx - 5} ${cy - 1.5} Q ${cx} ${cy + 5} ${cx + 5} ${cy - 1.5} Q ${cx} ${cy - 0.5} ${cx - 5} ${cy - 1.5} Z`}
            fill={INK} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      <ellipse cx={cx + 0.6} cy={cy + 1.6} rx={1.3} ry={0.9} fill="#e8788a" />
    </>
  );
}

function MouthSleepy({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx} cy={cy} r={1.2} fill="none" stroke={INK} strokeWidth="1.4" />;
}

function MouthSurprised({ cx, cy }: { cx: number; cy: number }) {
  return <ellipse cx={cx} cy={cy + 0.6} rx={2.2} ry={2.6} fill={INK} />;
}

function MouthSad({ cx, cy }: { cx: number; cy: number }) {
  return <path d={`M ${cx - 4} ${cy + 1.5} Q ${cx} ${cy - 1.5} ${cx + 4} ${cy + 1.5}`}
               fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />;
}

function MouthShy({ cx, cy }: { cx: number; cy: number }) {
  return (
    <path d={`M ${cx - 4} ${cy} Q ${cx - 2} ${cy - 2} ${cx} ${cy} Q ${cx + 2} ${cy + 2} ${cx + 4} ${cy}`}
          fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" />
  );
}

function MouthAngry({ cx, cy }: { cx: number; cy: number }) {
  return (
    <path d={`M ${cx - 3.5} ${cy + 1.2} Q ${cx - 1.5} ${cy - 1.2} ${cx} ${cy + 0.6} Q ${cx + 1.5} ${cy - 1.2} ${cx + 3.5} ${cy + 1.2}`}
          fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
  );
}

function MouthCry({ cx, cy }: { cx: number; cy: number }) {
  return (
    <path d={`M ${cx - 4.5} ${cy - 1} Q ${cx - 4} ${cy + 4} ${cx} ${cy + 4.5} Q ${cx + 4} ${cy + 4} ${cx + 4.5} ${cy - 1} Q ${cx + 2} ${cy} ${cx} ${cy - 0.5} Q ${cx - 2} ${cy} ${cx - 4.5} ${cy - 1} Z`}
          fill={INK} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
  );
}

// ───── Nose ─────
type NoseKind = "none" | "cat" | "bear" | "fox" | "panda" | "hamu";
function Nose({ kind, face }: { kind: NoseKind; face: FaceAnchors }) {
  const mx = face.mouth[0];
  const ny = face.noseTop;
  if (kind === "cat") {
    return (
      <path d={`M ${mx - 1.5} ${ny - 0.5} L ${mx + 1.5} ${ny - 0.5} L ${mx} ${ny + 1.5} Z`}
            fill="#f0a0ae" stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
    );
  }
  if (kind === "bear") return <ellipse cx={mx} cy={ny} rx={2.5} ry={1.8} fill={INK} />;
  if (kind === "fox") return <ellipse cx={mx} cy={ny + 1} rx={1.8} ry={1.3} fill={INK} />;
  if (kind === "panda") return <ellipse cx={mx} cy={ny + 1} rx={1.8} ry={1.3} fill={INK} />;
  if (kind === "hamu") return <ellipse cx={mx} cy={ny} rx={1.5} ry={1} fill={INK} />;
  return null;
}

// ───── Cheeks ─────
function Cheeks({ face, accent, size = 4, opacity = 0.55 }: {
  face: FaceAnchors; accent: string; size?: number; opacity?: number;
}) {
  return (
    <>
      <circle cx={face.cheekL[0]} cy={face.cheekL[1]} r={size} fill={accent} opacity={opacity} />
      <circle cx={face.cheekR[0]} cy={face.cheekR[1]} r={size} fill={accent} opacity={opacity} />
    </>
  );
}

// ───── Decorations ─────
function DecoSleepy({ face }: { face: FaceAnchors }) {
  const x = face.cheekR[0] + 4;
  const y = face.cheekR[1] - 14;
  return (
    <g fontFamily="'Zen Maru Gothic', sans-serif" fontWeight="900" fill={INK}>
      <text x={x} y={y} fontSize="7">z</text>
      <text x={x + 4} y={y - 3.5} fontSize="5">z</text>
    </g>
  );
}

function DecoShy({ face, accent }: { face: FaceAnchors; accent: string }) {
  return (
    <>
      <ellipse cx={face.cheekL[0]} cy={face.cheekL[1]} rx={6} ry={3.5} fill={accent} opacity="0.45" />
      <ellipse cx={face.cheekR[0]} cy={face.cheekR[1]} rx={6} ry={3.5} fill={accent} opacity="0.45" />
      <path d={`M ${face.cheekL[0] - 4} ${face.cheekL[1] - 1.5} l 2 -1.4 M ${face.cheekL[0]}     ${face.cheekL[1] - 2}   l 2 -1.4 M ${face.cheekR[0] - 2} ${face.cheekR[1] - 2}   l 2 -1.4 M ${face.cheekR[0] + 2} ${face.cheekR[1] - 1.5} l 2 -1.4`}
            stroke={INK} strokeWidth="0.9" strokeLinecap="round" />
    </>
  );
}

function DecoSurprised({ face }: { face: FaceAnchors }) {
  return (
    <text x={face.eyeR[0] + 6} y={face.eyeR[1] - 12}
          fontFamily="'Zen Maru Gothic', sans-serif" fontWeight="900"
          fontSize="10" fill={INK}>!</text>
  );
}

function DecoAngry({ face }: { face: FaceAnchors }) {
  const x = face.eyeR[0] + 8;
  const y = face.eyeR[1] - 8;
  return (
    <g stroke={INK} strokeWidth="1.4" strokeLinecap="round" fill="none">
      <path d={`M ${x - 3} ${y - 1} L ${x + 3} ${y - 1}`} />
      <path d={`M ${x - 3} ${y + 2} L ${x + 3} ${y + 2}`} />
      <path d={`M ${x - 1.5} ${y - 3} L ${x - 2.5} ${y + 4}`} />
      <path d={`M ${x + 1.5} ${y - 3} L ${x + 0.5} ${y + 4}`} />
    </g>
  );
}

function DecoSad({ face }: { face: FaceAnchors }) {
  const x = face.cheekL[0] + 1;
  const y = face.cheekL[1] - 2;
  return (
    <path d={`M ${x} ${y} Q ${x - 1.5} ${y + 3.5} ${x} ${y + 5.5} Q ${x + 1.5} ${y + 3.5} ${x} ${y} Z`}
          fill="#7ab8e0" stroke={INK} strokeWidth="0.7" />
  );
}

function DecoExcited({ face }: { face: FaceAnchors }) {
  const dot = (cx: number, cy: number, r: number) =>
    <path d={`M ${cx} ${cy - r} L ${cx + r * 0.4} ${cy - r * 0.4} L ${cx + r} ${cy} L ${cx + r * 0.4} ${cy + r * 0.4} L ${cx} ${cy + r} L ${cx - r * 0.4} ${cy + r * 0.4} L ${cx - r} ${cy} L ${cx - r * 0.4} ${cy - r * 0.4} Z`}
          fill="#f0d88a" stroke={INK} strokeWidth="0.6" strokeLinejoin="round" />;
  return (
    <>
      {dot(12, face.eyeL[1] - 8, 2.2)}
      {dot(70, face.eyeR[1] - 10, 2.6)}
      {dot(68, face.eyeR[1] + 6, 1.6)}
    </>
  );
}

// ───── Master Face ─────
function Face({
  expr = "smile",
  face,
  accent = PALETTE.coral,
  nose = "none",
  eyeOnDark = false,
  eyeRx,
  eyeRy,
  cheekSize = 4,
  mouthHidden = false,
}: {
  expr?: Expression;
  face: FaceAnchors;
  accent?: string;
  nose?: NoseKind;
  eyeOnDark?: boolean;
  eyeRx?: number;
  eyeRy?: number;
  cheekSize?: number;
  mouthHidden?: boolean;
}) {
  const [exL, eyL] = face.eyeL;
  const [exR, eyR] = face.eyeR;
  const [mx, my] = face.mouth;

  let eyes: React.ReactNode;
  switch (expr) {
    case "excited":
      eyes = (<><EyeSparkle cx={exL} cy={eyL} rx={eyeRx ?? 2.6} ry={eyeRy ?? 3.4} onDark={eyeOnDark} />
              <EyeSparkle cx={exR} cy={eyR} rx={eyeRx ?? 2.6} ry={eyeRy ?? 3.4} onDark={eyeOnDark} /></>);
      break;
    case "sleepy":
      eyes = (<><EyeArc cx={exL} cy={eyL} /><EyeArc cx={exR} cy={eyR} /></>);
      break;
    case "surprised":
      eyes = (<><EyeBig cx={exL} cy={eyL} onDark={eyeOnDark} /><EyeBig cx={exR} cy={eyR} onDark={eyeOnDark} /></>);
      break;
    case "sad":
      eyes = (<><EyeSad cx={exL} cy={eyL} onDark={eyeOnDark} /><EyeSad cx={exR} cy={eyR} onDark={eyeOnDark} /></>);
      break;
    case "shy":
      eyes = (<><EyeShy cx={exL} cy={eyL} onDark={eyeOnDark} /><EyeShy cx={exR} cy={eyR} onDark={eyeOnDark} /></>);
      break;
    case "angry":
      eyes = (<><EyeAngry cx={exL} cy={eyL} onDark={eyeOnDark} /><EyeAngry cx={exR} cy={eyR} onDark={eyeOnDark} /></>);
      break;
    case "cry":
      eyes = (<><EyeCry cx={exL} cy={eyL} /><EyeCry cx={exR} cy={eyR} /></>);
      break;
    default:
      eyes = (<><EyeDot cx={exL} cy={eyL} rx={eyeRx ?? 2} ry={eyeRy ?? 3} onDark={eyeOnDark} />
              <EyeDot cx={exR} cy={eyR} rx={eyeRx ?? 2} ry={eyeRy ?? 3} onDark={eyeOnDark} /></>);
  }

  let mouth: React.ReactNode = null;
  if (!mouthHidden) {
    switch (expr) {
      case "excited": mouth = <MouthExcited cx={mx} cy={my} />; break;
      case "sleepy": mouth = <MouthSleepy cx={mx} cy={my} />; break;
      case "surprised": mouth = <MouthSurprised cx={mx} cy={my} />; break;
      case "sad": mouth = <MouthSad cx={mx} cy={my} />; break;
      case "shy": mouth = <MouthShy cx={mx} cy={my} />; break;
      case "angry": mouth = <MouthAngry cx={mx} cy={my} />; break;
      case "cry": mouth = <MouthCry cx={mx} cy={my} />; break;
      default: mouth = <MouthSmile cx={mx} cy={my} />;
    }
  }

  let deco: React.ReactNode = null;
  switch (expr) {
    case "sleepy": deco = <DecoSleepy face={face} />; break;
    case "shy": deco = <DecoShy face={face} accent={accent} />; break;
    case "surprised": deco = <DecoSurprised face={face} />; break;
    case "angry": deco = <DecoAngry face={face} />; break;
    case "sad": deco = <DecoSad face={face} />; break;
    case "excited": deco = <DecoExcited face={face} />; break;
  }

  return (
    <>
      <Cheeks face={face} accent={accent} size={cheekSize} />
      <Nose kind={nose} face={face} />
      {eyes}
      {mouth}
      {deco}
    </>
  );
}

// ═══ Mascot characters ═══

type MascotProps = { size?: number; accent?: string; expression?: Expression };

export function MascotUsa({ size = 60, accent = PALETTE.coral, expression = "smile" }: MascotProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: "block" }}>
      <ellipse cx="28" cy="14" rx="6" ry="12" fill="#fff" stroke={INK} strokeWidth="2" />
      <ellipse cx="52" cy="14" rx="6" ry="12" fill="#fff" stroke={INK} strokeWidth="2" />
      <ellipse cx="28" cy="15" rx="2.5" ry="7" fill={accent} />
      <ellipse cx="52" cy="15" rx="2.5" ry="7" fill={accent} />
      <circle cx="40" cy="46" r="26" fill="#fff" stroke={INK} strokeWidth="2" />
      <Face expr={expression} face={FACE_DEFAULT} accent={accent} />
    </svg>
  );
}

export function Neko({ size = 60, accent = PALETTE.coral, expression = "smile" }: MascotProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: "block" }}>
      <path d="M 18 28 L 22 10 L 32 22 Z" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M 62 28 L 58 10 L 48 22 Z" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M 22 22 L 24 14 L 28 22 Z" fill={accent} />
      <path d="M 58 22 L 56 14 L 52 22 Z" fill={accent} />
      <circle cx="40" cy="46" r="26" fill="#fff" stroke={INK} strokeWidth="2" />
      <path d="M 14 47 L 24 48 M 14 51 L 24 50" stroke={INK} strokeWidth="1" strokeLinecap="round" />
      <path d="M 66 47 L 56 48 M 66 51 L 56 50" stroke={INK} strokeWidth="1" strokeLinecap="round" />
      <Face expr={expression} face={FACE_DEFAULT} accent={accent} nose="cat" />
    </svg>
  );
}

export function Kuma({ size = 60, accent = PALETTE.coral, expression = "smile" }: MascotProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: "block" }}>
      <circle cx="20" cy="22" r="9" fill="#fff" stroke={INK} strokeWidth="2" />
      <circle cx="60" cy="22" r="9" fill="#fff" stroke={INK} strokeWidth="2" />
      <circle cx="20" cy="22" r="4.5" fill={accent} opacity="0.55" />
      <circle cx="60" cy="22" r="4.5" fill={accent} opacity="0.55" />
      <circle cx="40" cy="46" r="26" fill="#fff" stroke={INK} strokeWidth="2" />
      <ellipse cx="40" cy="52" rx="11" ry="8" fill="#fff8e0" stroke={INK} strokeWidth="1.5" />
      <Face expr={expression} face={FACE_BEAR} accent={accent} nose="bear" />
    </svg>
  );
}

export function Panda({ size = 60, accent = PALETTE.coral, expression = "smile" }: MascotProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: "block" }}>
      <circle cx="22" cy="22" r="8.5" fill={INK} />
      <circle cx="58" cy="22" r="8.5" fill={INK} />
      <circle cx="40" cy="46" r="26" fill="#fff" stroke={INK} strokeWidth="2" />
      <ellipse cx="32" cy="45" rx="4" ry="6" fill={INK} transform="rotate(18 32 45)" />
      <ellipse cx="48" cy="45" rx="4" ry="6" fill={INK} transform="rotate(-18 48 45)" />
      <Face expr={expression} face={FACE_DEFAULT} accent={accent} nose="panda" />
    </svg>
  );
}

export function Kitsune({ size = 60, accent = PALETTE.coral, expression = "smile" }: MascotProps) {
  const fox = "#eec178";
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: "block" }}>
      <path d="M 20 28 Q 22 11 27 11 Q 33 18 34 26 Q 27 24 20 28 Z"
            fill={fox} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M 60 28 Q 58 11 53 11 Q 47 18 46 26 Q 53 24 60 28 Z"
            fill={fox} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M 24 24 Q 25 15 27 15 Q 30 20 31 25 Q 27 23 24 24 Z" fill={accent} opacity="0.85" />
      <path d="M 56 24 Q 55 15 53 15 Q 50 20 49 25 Q 53 23 56 24 Z" fill={accent} opacity="0.85" />
      <circle cx="40" cy="46" r="26" fill={fox} stroke={INK} strokeWidth="2" />
      <Face expr={expression} face={FACE_DEFAULT} accent={accent} nose="fox" />
    </svg>
  );
}

export function Hamu({ size = 60, accent = PALETTE.coral, expression = "smile" }: MascotProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: "block" }}>
      <circle cx="22" cy="26" r="6" fill="#f8c8a0" stroke={INK} strokeWidth="2" />
      <circle cx="58" cy="26" r="6" fill="#f8c8a0" stroke={INK} strokeWidth="2" />
      <circle cx="22" cy="26" r="2.5" fill={accent} opacity="0.7" />
      <circle cx="58" cy="26" r="2.5" fill={accent} opacity="0.7" />
      <ellipse cx="40" cy="48" rx="28" ry="24" fill="#fff8e8" stroke={INK} strokeWidth="2" />
      <ellipse cx="22" cy="54" rx="8" ry="6" fill="#fff" stroke={INK} strokeWidth="1.5" />
      <ellipse cx="58" cy="54" rx="8" ry="6" fill="#fff" stroke={INK} strokeWidth="1.5" />
      <Face expr={expression} face={FACE_HAMU} accent={accent} nose="hamu"
            eyeRx={1.8} eyeRy={2.4} cheekSize={2.5} />
    </svg>
  );
}

export function Pen({ size = 60, accent = PALETTE.coral, expression = "smile" }: MascotProps) {
  const beak = "#f0b040";
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: "block" }}>
      <ellipse cx="40" cy="46" rx="26" ry="28" fill={INK} />
      <ellipse cx="40" cy="52" rx="18" ry="20" fill="#fff" />
      <path d="M 24 38 Q 28 26 40 26 Q 52 26 56 38 Q 50 44 40 44 Q 30 44 24 38 Z" fill="#fff" />
      <path d="M 36 42 L 44 42 L 40 48 Z" fill={beak} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M 14 46 Q 8 56 16 64 Q 20 60 22 54 Z" fill={INK} />
      <path d="M 66 46 Q 72 56 64 64 Q 60 60 58 54 Z" fill={INK} />
      <ellipse cx="34" cy="74" rx="4" ry="2" fill={beak} stroke={INK} strokeWidth="1" />
      <ellipse cx="46" cy="74" rx="4" ry="2" fill={beak} stroke={INK} strokeWidth="1" />
      <Face expr={expression} face={FACE_PEN} accent={accent} nose="none"
            eyeRx={1.8} eyeRy={2.4} mouthHidden />
    </svg>
  );
}

export const EXPRESSIONS: { key: Expression; label: string; sub: string }[] = [
  { key: "smile",     label: "にっこり",   sub: "標準" },
  { key: "excited",   label: "わくわく",   sub: "ライブ・期待" },
  { key: "sleepy",    label: "ねむい",     sub: "おやすみ" },
  { key: "surprised", label: "おどろき",   sub: "通知・新着" },
  { key: "shy",       label: "てれ",       sub: "ハート受信" },
  { key: "sad",       label: "しょんぼり", sub: "配信なし" },
  { key: "angry",     label: "おこ",       sub: "エラー" },
  { key: "cry",       label: "なき",       sub: "エモい" },
];
