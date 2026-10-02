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
  accent: '0.630 0.12 260',
  strong: '0.440 0.08 260',
  soft: '0.97 0.02 260',
  muted: '0.90 0.04 260',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.630 0.12 260',
    strong: '0.440 0.08 260',
    soft: '0.97 0.02 260',
    muted: '0.90 0.04 260',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.630 0.12 180',
    strong: '0.430 0.08 180',
    soft: '0.97 0.02 180',
    muted: '0.90 0.04 180',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.640 0.12 280',
    strong: '0.440 0.08 280',
    soft: '0.97 0.02 280',
    muted: '0.90 0.04 280',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.640 0.12 40',
    strong: '0.440 0.08 40',
    soft: '0.97 0.02 40',
    muted: '0.90 0.04 40',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.640 0.12 300',
    strong: '0.440 0.08 300',
    soft: '0.97 0.02 300',
    muted: '0.90 0.04 300',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.630 0.12 230',
    strong: '0.430 0.08 230',
    soft: '0.97 0.02 230',
    muted: '0.90 0.04 230',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.630 0.12 160',
    strong: '0.430 0.08 160',
    soft: '0.97 0.02 160',
    muted: '0.90 0.04 160',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.640 0.12 20',
    strong: '0.440 0.08 20',
    soft: '0.97 0.02 20',
    muted: '0.90 0.04 20',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.640 0.12 340',
    strong: '0.440 0.08 340',
    soft: '0.97 0.02 340',
    muted: '0.90 0.04 340',
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
    '--area-foreground': '1 0 0',
  };
}

/* ---------- Kontrast (WCAG 2.2) ----------------------------------------- */

function parseOklch(value: string): [number, number, number] {
  const parts = value.trim().split(/\s+/);
  if (parts.length !== 3) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return [Number(parts[0]), Number(parts[1]), Number(parts[2])];
}

function oklchToLinearRgb([l, c, h]: [number, number, number]): [number, number, number] {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l_cube = l_ ** 3;
  const m_cube = m_ ** 3;
  const s_cube = s_ ** 3;

  const r = 4.0767416621 * l_cube - 3.3077115913 * m_cube + 0.2309699292 * s_cube;
  const g = -1.2684380046 * l_cube + 2.6097574011 * m_cube - 0.3413193965 * s_cube;
  const blue = -0.0041960863 * l_cube - 0.7034186147 * m_cube + 1.7076147010 * s_cube;

  return [r, g, blue];
}

function relativeLuminance(rgb: [number, number, number]): number {
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

/** Kontrastverhältnis zweier OKLCH-Tripel. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(oklchToLinearRgb(parseOklch(a)));
  const lb = relativeLuminance(oklchToLinearRgb(parseOklch(b)));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
