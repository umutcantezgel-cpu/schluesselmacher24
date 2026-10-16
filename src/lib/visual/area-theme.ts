import type { AreaKey } from '@/lib/types';

/**
 * Bereichsfarben — einzige Quelle für die Akzentfarbe je Leistungsbereich.
 *
 * Tailwind liest diese Werte in `tailwind.config.ts` und legt daraus die
 * Variablen `--area*` für `[data-area="…"]` an. Seiten, Icons und Grafiken
 * verwenden nur `text-area-strong`, `bg-area-soft`, `fill-area` usw. — nie
 * einen festen Farbwert.
 *
 * Werte als HSL-Tripel „H S% L%“ (wie die übrigen Tokens in `globals.css`).
 * - `accent`: Flächen und Linien in Grafiken (≥ 3:1 auf Weiß und `soft`)
 * - `strong`: Text, Schaltflächen, Kennzeichnungen (≥ 4,5:1 auf Weiß und `soft`)
 * - `soft`:   heller Hintergrund des Bereichs
 * - `muted`:  zarte Linien und Füllungen in Grafiken (rein dekorativ)
 *
 * Bewusst kein Gelb/Schwarz: keine Notdienstoptik. Benachbarte Bereiche liegen im
 * Farbton mindestens 30° auseinander, damit sie nebeneinander unterscheidbar bleiben
 * (Sichtabnahme E2-L-07, D-017).
 */
export interface AreaTheme {
  label: string;
  accent: string;
  strong: string;
  soft: string;
  muted: string;
}

/** Grundfarbe außerhalb der Bereiche (Startseite, Warenkorb, Kasse …). */
export const DEFAULT_AREA_THEME: AreaTheme = {
  label: 'Allgemein',
  accent: '214 86% 50%',
  strong: '214 80% 40%',
  soft: '214 100% 96.5%',
  muted: '214 90% 86%',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '222 88% 52%',
    strong: '222 76% 41%',
    soft: '222 100% 96.5%',
    muted: '222 90% 86%',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '160 78% 32%',
    strong: '160 84% 24%',
    soft: '160 62% 94.5%',
    muted: '160 58% 80%',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '252 70% 60%',
    strong: '252 54% 49%',
    soft: '252 100% 97%',
    muted: '252 88% 88%',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '20 88% 48%',
    strong: '20 84% 37%',
    soft: '20 100% 95.5%',
    muted: '20 95% 84%',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '282 62% 55%',
    strong: '282 50% 44%',
    soft: '282 100% 97%',
    muted: '282 78% 88%',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '191 90% 36%',
    strong: '191 90% 27%',
    soft: '191 88% 94.5%',
    muted: '191 74% 80%',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '125 62% 33%',
    strong: '125 66% 25%',
    soft: '125 50% 94.5%',
    muted: '125 48% 80%',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '350 78% 54%',
    strong: '350 68% 43%',
    soft: '350 100% 97%',
    muted: '350 85% 88%',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '318 64% 50%',
    strong: '318 60% 40%',
    soft: '318 100% 97%',
    muted: '318 72% 88%',
  },
};

export const AREA_KEYS_WITH_THEME = Object.keys(AREA_THEMES) as AreaKey[];

/** CSS-Variablen eines Bereichs, z. B. für `style` oder das Tailwind-Plugin. */
export function areaCssVariables(theme: AreaTheme): Record<string, string> {
  return {
    '--area': theme.accent,
    '--area-strong': theme.strong,
    '--area-soft': theme.soft,
    '--area-muted': theme.muted,
    '--area-foreground': '0 0% 100%',
  };
}

/* ---------- Kontrast (WCAG 2.2) ----------------------------------------- */

function parseHsl(value: string): [number, number, number] {
  const match = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!match) throw new Error(`Kein HSL-Tripel: "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function hslToRgb([h, s, l]: [number, number, number]): [number, number, number] {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier HSL-Tripel, z. B. `contrastRatio('0 0% 100%', theme.strong)`. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(hslToRgb(parseHsl(a)));
  const lb = relativeLuminance(hslToRgb(parseHsl(b)));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
