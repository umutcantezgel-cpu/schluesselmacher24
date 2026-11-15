import type { AreaKey } from '@/lib/types';

/**
 * Bereichsfarben — einzige Quelle für die Akzentfarbe je Leistungsbereich.
 *
 * Tailwind liest diese Werte in `tailwind.config.ts` und legt daraus die
 * Variablen `--area*` für `[data-area="…"]` an. Seiten, Icons und Grafiken
 * verwenden nur `text-area-strong`, `bg-area-soft`, `fill-area` usw. — nie
 * einen festen Farbwert.
 *
 * Seit der Arbeitsanweisung des Inhabers vom 11.11.2026 (FA-04, A-043) gibt es
 * eine einzige Akzentfarbe: das Markenorange. Schaltflächen, aktive Zustände,
 * Icons und Handlungsaufrufe tragen überall dasselbe Orange; die dunklen und
 * hellen neutralen Flächen bleiben. Die Tabelle je Bereich bleibt als Quelle
 * bestehen, damit ein Bereich später wieder einen eigenen Ton bekommen kann,
 * ohne dass eine Seite angefasst wird.
 *
 * Werte als OKLCH-Tripel „L C H“ (wie alle Tokens in `globals.css`).
 * Abstufungsregel (ABSTUFUNG): ein Farbton H und vier feste Helligkeiten; die
 * Buntheit C ist gedeckelt und bleibt im sRGB-Farbraum.
 * - `accent` L 0,62: Flächen und Linien in Grafiken, Fokusring (≥ 3:1 auf Weiß und `soft`)
 * - `strong` L 0,555 (= `--primary`): Text, Schaltflächen mit weißer Schrift,
 *   Kennzeichnungen (≥ 4,5:1 auf Weiß und `soft`)
 * - `soft`   L 0,96: heller Hintergrund
 * - `muted`  L 0,90: zarte Linien und Füllungen in Grafiken (rein dekorativ)
 *
 * Kein Lila und kein Indigo (Anti-Slop S2). Kein Signalgelb auf Schwarz: keine
 * Notdienstoptik. Statusfarben (Erfolg, Warnung, Fehler) stehen in `globals.css`
 * und sind nie Markenfläche.
 */
export interface AreaTheme {
  label: string;
  accent: string;
  strong: string;
  soft: string;
  muted: string;
}

/** Abstufungsregel: Helligkeit L je Stufe und Obergrenze der Buntheit C. */
export const ABSTUFUNG = {
  accent: { L: 0.62, cHoechstens: 0.185 },
  strong: { L: 0.555, cHoechstens: 0.168 },
  soft: { L: 0.96, cHoechstens: 0.022 },
  muted: { L: 0.9, cHoechstens: 0.06 },
} as const;

/** Farbton des Markenorange in Grad (OKLCH). */
export const MARKEN_FARBTON = 41;

/** Das Markenorange in vier Stufen: #dd530f, #c04606, #fdeee9, #fbd4c7. */
const MARKENORANGE = {
  accent: '0.62 0.185 41',
  /* = --primary: Wortmarke „24“, Links, Schaltflächen */
  strong: '0.555 0.168 41',
  soft: '0.96 0.018 41',
  muted: '0.9 0.047 41',
} as const;

/** Grundfarbe außerhalb der Bereiche (Startseite, Warenkorb, Kasse …): das Markenorange. */
export const DEFAULT_AREA_THEME: AreaTheme = { label: 'Allgemein', ...MARKENORANGE };

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: { label: 'Autoschlüssel', ...MARKENORANGE },
  'schluessel-nach-vorlage': { label: 'Schlüssel nach Vorlage', ...MARKENORANGE },
  'schluessel-nach-code': { label: 'Schlüssel nach Code', ...MARKENORANGE },
  'gleichschliessende-zylinder': { label: 'Gleichschließende Zylinder', ...MARKENORANGE },
  schliessanlagen: { label: 'Schließanlagen', ...MARKENORANGE },
  'elektronische-zutrittsloesungen': { label: 'Elektronische Zutrittslösungen', ...MARKENORANGE },
  'tuer-und-schliesstechnik': { label: 'Tür- und Schließtechnik', ...MARKENORANGE },
  sicherheitstechnik: { label: 'Sicherheitstechnik', ...MARKENORANGE },
  'service-und-termin': { label: 'Service und Termin', ...MARKENORANGE },
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
