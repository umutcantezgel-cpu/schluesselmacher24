import type { AreaKey } from '@/lib/types';

/**
 * Bereichsfarben — einzige Quelle für die Akzentfarbe je Leistungsbereich.
 *
 * Tailwind liest diese Werte in `tailwind.config.ts` und legt daraus die
 * Variablen `--area*` für `[data-area="…"]` an. Seiten, Icons und Grafiken
 * verwenden nur `text-area-strong`, `bg-area-soft`, `fill-area` usw. — nie
 * einen festen Farbwert.
 *
 * Werte als OKLCH-Tripel „L C H“ (wie alle Tokens in `globals.css`, KERN 2.0).
 * Abstufungsregel (ABSTUFUNG): Jede Familie hat einen Farbton H und vier feste
 * Helligkeiten; die Buntheit C ist gedeckelt und bleibt im sRGB-Farbraum.
 * - `accent` L 0,605: Flächen und Linien in Grafiken (≥ 3:1 auf Weiß und `soft`)
 * - `strong` L 0,485 (accent minus 0,12, so hell wie das Markenblau `--primary`):
 *   Text, Schaltflächen, Kennzeichnungen (≥ 4,5:1 auf Weiß und `soft`)
 * - `soft`   L 0,96: heller Hintergrund des Bereichs
 * - `muted`  L 0,90: zarte Linien und Füllungen in Grafiken (rein dekorativ)
 *
 * Gleiche Helligkeit heißt in OKLCH gleiche Wirkung: Kein Bereich drängt sich vor.
 * Kein Lila und kein Indigo (Anti-Slop S2): kein Farbton zwischen 270° und 335°
 * (OKLCH), und auch umgerechnet kein HSL-Ton zwischen 230° und 330° (A-005).
 * Kein Signalgelb und kein Schwarz: keine Notdienstoptik; Messing (Code) ist ein
 * gedecktes Ocker. Benachbarte Bereiche liegen im Farbton mindestens 30°
 * auseinander (Sichtabnahme E2-L-07, D-017), Code und Schließanlagen mindestens
 * 40° (E4-L-23). Die Töne folgen der Werkstatt: Messing für Code, Kupfer für
 * Zylinder, Stahlblau für Schließanlagen, Signalrot für Sicherheitstechnik.
 */
export interface AreaTheme {
  label: string;
  accent: string;
  strong: string;
  soft: string;
  muted: string;
}

/** Abstufungsregel: Helligkeit L je Stufe und Obergrenze der Buntheit C (KERN 2.0). */
export const ABSTUFUNG = {
  accent: { L: 0.605, cHoechstens: 0.162 },
  strong: { L: 0.485, cHoechstens: 0.162 },
  soft: { L: 0.96, cHoechstens: 0.022 },
  muted: { L: 0.9, cHoechstens: 0.06 },
} as const;

/** Grundfarbe außerhalb der Bereiche (Startseite, Warenkorb, Kasse …): das Markenblau. */
export const DEFAULT_AREA_THEME: AreaTheme = {
  label: 'Allgemein',
  accent: '0.605 0.162 257.63',
  /* = --primary (Wortmarke, G9): genau der bisherige Wert, innerhalb der Regel */
  strong: '0.4852 0.1611 257.63',
  soft: '0.96 0.018 257.63',
  muted: '0.9 0.047 257.63',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.605 0.162 262',
    strong: '0.485 0.162 262',
    soft: '0.96 0.018 262',
    muted: '0.9 0.047 262',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.605 0.127 163',
    strong: '0.485 0.102 163',
    soft: '0.96 0.022 163',
    muted: '0.9 0.060 163',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.605 0.121 97',
    strong: '0.485 0.097 97',
    soft: '0.96 0.022 97',
    muted: '0.9 0.060 97',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.605 0.132 65',
    strong: '0.485 0.106 65',
    soft: '0.96 0.022 65',
    muted: '0.9 0.060 65',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.605 0.116 229',
    strong: '0.485 0.093 229',
    soft: '0.96 0.022 229',
    muted: '0.9 0.060 229',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.605 0.100 196',
    strong: '0.485 0.080 196',
    soft: '0.96 0.022 196',
    muted: '0.9 0.060 196',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.605 0.158 130',
    strong: '0.485 0.127 130',
    soft: '0.96 0.022 130',
    muted: '0.9 0.060 130',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.605 0.162 33',
    strong: '0.485 0.162 33',
    soft: '0.96 0.019 33',
    muted: '0.9 0.051 33',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.605 0.162 2',
    strong: '0.485 0.162 2',
    soft: '0.96 0.020 2',
    muted: '0.9 0.054 2',
  },
};

export const AREA_KEYS_WITH_THEME = Object.keys(AREA_THEMES) as AreaKey[];

/** Weiß als OKLCH-Tripel (Schrift auf `strong`). */
export const WEISS = '1 0 0';

/** CSS-Variablen eines Bereichs, z. B. für `style` oder das Tailwind-Plugin. */
export function areaCssVariables(theme: AreaTheme): Record<string, string> {
  return {
    '--area': theme.accent,
    '--area-strong': theme.strong,
    '--area-soft': theme.soft,
    '--area-muted': theme.muted,
    '--area-foreground': WEISS,
  };
}

/* ---------- Umrechnung OKLCH → sRGB (Björn Ottosson, CSS Color 4) ----------- */

/** Liest ein OKLCH-Tripel „L C H“ (L 0 bis 1, H in Grad). */
export function parseOklch(value: string): [number, number, number] {
  const match = value.trim().match(/^([\d.]+)\s+([\d.]+)\s+(-?[\d.]+)$/);
  if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/** Farbton H eines OKLCH-Tripels in Grad. */
export function farbton(value: string): number {
  return parseOklch(value)[2];
}

/** Lineares sRGB (ungeklemmt, 0 bis 1 heißt im Farbraum). */
export function oklchZuLinearRgb(value: string): [number, number, number] {
  const [l, c, h] = parseOklch(value);
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l1 = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m1 = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s1 = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l1 - 3.3077115913 * m1 + 0.2309699292 * s1,
    -1.2684380046 * l1 + 2.6097574011 * m1 - 0.3413193965 * s1,
    -0.0041960863 * l1 - 0.7034186147 * m1 + 1.707614701 * s1,
  ];
}

/** Liegt die Farbe im sRGB-Farbraum (kleine Rundungstoleranz)? */
export function imSrgb(value: string): boolean {
  return oklchZuLinearRgb(value).every((kanal) => kanal >= -1e-4 && kanal <= 1 + 1e-4);
}

const klemmen = (v: number) => Math.min(1, Math.max(0, v));
const gamma = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

/** sRGB-Kanäle 0 bis 1 (geklemmt, mit Gammakurve). */
export function oklchZuSrgb(value: string): [number, number, number] {
  return oklchZuLinearRgb(value).map((kanal) => klemmen(gamma(klemmen(kanal)))) as [number, number, number];
}

/** Hex-Wert für Stellen ohne OKLCH (Manifest, Vorschaubild). */
export function oklchZuHex(value: string): string {
  return `#${oklchZuSrgb(value).map((kanal) => Math.round(kanal * 255).toString(16).padStart(2, '0')).join('')}`;
}

/** HSL-Farbton und -Sättigung des sRGB-Werts (für die Lila-Prüfung nach A-005). */
export function hslTonUndSaettigung(value: string): { ton: number; saettigung: number } {
  const [r, g, b] = oklchZuSrgb(value);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return { ton: 0, saettigung: 0 };
  const l = (max + min) / 2;
  const saettigung = d / (1 - Math.abs(2 * l - 1));
  let ton: number;
  if (max === r) ton = ((g - b) / d + 6) % 6;
  else if (max === g) ton = (b - r) / d + 2;
  else ton = (r - g) / d + 4;
  return { ton: ton * 60, saettigung };
}

/**
 * Lila oder Indigo nach Anti-Slop S2: bunter Farbton (C über 0,05) zwischen 270° und 335° in
 * OKLCH, oder umgerechnet ein HSL-Ton zwischen 230° und 330° bei Sättigung über 0,25 (A-005).
 */
export function istLilaOderIndigo(value: string): boolean {
  const [, c, h] = parseOklch(value);
  if (c > 0.05 && h >= 270 && h <= 335) return true;
  const { ton, saettigung } = hslTonUndSaettigung(value);
  return c > 0.02 && saettigung > 0.25 && ton >= 230 && ton <= 330;
}

/* ---------- Kontrast (WCAG 2.2) ----------------------------------------- */

function relativeLuminance(value: string): number {
  const [r, g, b] = oklchZuLinearRgb(value).map(klemmen) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier OKLCH-Tripel, z. B. `contrastRatio(WEISS, theme.strong)`. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
