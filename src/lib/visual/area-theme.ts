import * as culori from 'culori';
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
 * Bewusst kein Gelb/Schwarz: keine Notdienstoptik.
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
  accent: '0.6 0.1 260',
  strong: '0.4 0.1 260',
  soft: '0.98 0.01 260',
  muted: '0.92 0.02 260',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.6 0.12 260',
    strong: '0.4 0.12 260',
    soft: '0.98 0.01 260',
    muted: '0.92 0.02 260',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.55 0.08 170',
    strong: '0.35 0.08 170',
    soft: '0.97 0.01 170',
    muted: '0.90 0.02 170',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.6 0.1 280',
    strong: '0.4 0.1 280',
    soft: '0.98 0.01 280',
    muted: '0.92 0.02 280',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.6 0.12 40',
    strong: '0.4 0.12 40',
    soft: '0.98 0.02 40',
    muted: '0.92 0.04 40',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.6 0.1 300',
    strong: '0.4 0.1 300',
    soft: '0.98 0.01 300',
    muted: '0.92 0.02 300',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.6 0.1 210',
    strong: '0.4 0.1 210',
    soft: '0.97 0.02 210',
    muted: '0.91 0.03 210',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.55 0.1 150',
    strong: '0.35 0.1 150',
    soft: '0.97 0.01 150',
    muted: '0.90 0.02 150',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.6 0.12 10',
    strong: '0.4 0.12 10',
    soft: '0.98 0.02 10',
    muted: '0.92 0.03 10',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.6 0.12 330',
    strong: '0.4 0.12 330',
    soft: '0.98 0.02 330',
    muted: '0.92 0.03 330',
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

function oklchToSrgb(value: string): [number, number, number] {
    const parsed = culori.parse('oklch(' + value + ')');
  if (!parsed) return [0, 0, 0];
    const rgb = culori.converter('rgb')(parsed);
  return [Math.max(0, Math.min(1, rgb.r)), Math.max(0, Math.min(1, rgb.g)), Math.max(0, Math.min(1, rgb.b))];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(oklchToSrgb(a));
  const lb = relativeLuminance(oklchToSrgb(b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
