import { rgb, type Rgb, type Oklch } from 'culori';
import type { AreaKey } from '@/lib/types';

/**
 * Bereichsfarben — einzige Quelle für die Akzentfarbe je Leistungsbereich.
 *
 * Tailwind liest diese Werte in `tailwind.config.ts` und legt daraus die
 * Variablen `--area*` für `[data-area="…"]` an. Seiten, Icons und Grafiken
 * verwenden nur `text-area-strong`, `bg-area-soft`, `fill-area` usw. — nie
 * einen festen Farbwert.
 *
 * Werte als OKLCH-Tripel „L C H“ (wie die übrigen Tokens in `globals.css`).
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
  accent: '0.5720 0.2047 258.3190',
  strong: '0.4852 0.1611 257.6336',
  soft: '0.9669 0.0159 255.0378',
  muted: '0.8708 0.0589 255.2214',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.5723 0.2162 260.2763',
    strong: '0.4836 0.1703 259.9749',
    soft: '0.9669 0.0159 255.0378',
    muted: '0.8642 0.0614 259.8744',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.6128 0.1070 180.5222',
    strong: '0.5073 0.0877 183.6825',
    soft: '0.9707 0.0194 182.6315',
    muted: '0.8946 0.0634 183.4578',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.5449 0.2189 280.0066',
    strong: '0.4521 0.2166 276.9854',
    soft: '0.9597 0.0204 289.8430',
    muted: '0.8452 0.0764 288.4658',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.6382 0.1915 40.9051',
    strong: '0.5165 0.1547 39.7171',
    soft: '0.9672 0.0193 56.1582',
    muted: '0.8806 0.0677 51.6021',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.5786 0.2128 299.5943',
    strong: '0.4895 0.1899 299.0547',
    soft: '0.9638 0.0214 305.4435',
    muted: '0.8658 0.0704 304.6552',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.5893 0.1147 229.3374',
    strong: '0.4769 0.0939 230.9239',
    soft: '0.9691 0.0228 211.0474',
    muted: '0.8793 0.0653 214.9087',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.5744 0.1253 157.3936',
    strong: '0.4687 0.1013 158.1426',
    soft: '0.9677 0.0199 162.9170',
    muted: '0.8809 0.0632 163.0950',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.6038 0.2153 18.3576',
    strong: '0.5127 0.1828 18.3540',
    soft: '0.9670 0.0168 5.8976',
    muted: '0.8759 0.0602 7.1984',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.6016 0.2166 351.2477',
    strong: '0.5052 0.1782 350.8792',
    soft: '0.9687 0.0199 342.2942',
    muted: '0.8846 0.0616 343.4004',
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
    '--area-foreground': '1.0000 0.0000 0.0000',
  };
}

/* ---------- Kontrast (WCAG 2.2) ----------------------------------------- */


function parseColor(value: string) {
  const match = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)$/);
  if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return { mode: 'oklch', l: Number(match[1]), c: Number(match[2]), h: Number(match[3]) } as Oklch;
}

export function oklchToSrgb(color: string | Oklch): [number, number, number] {
  const converted = rgb(color) as Rgb;
  return [converted.r, converted.g, converted.b];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier HSL-Tripel, z. B. `contrastRatio('0 0% 100%', theme.strong)`. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(oklchToSrgb(parseColor(a)));
  const lb = relativeLuminance(oklchToSrgb(parseColor(b)));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
