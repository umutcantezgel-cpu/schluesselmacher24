import type { AreaKey } from '@/lib/types';

/**
 * Bereichsfarben — einzige Quelle für die Akzentfarbe je Leistungsbereich.
 *
 * Tailwind liest diese Werte in `tailwind.config.ts` und legt daraus die
 * Variablen `--area*` für `[data-area="…"]` an. Seiten, Icons und Grafiken
 * verwenden nur `text-area-strong`, `bg-area-soft`, `fill-area` usw. — nie
 * einen festen Farbwert.
 *
 * Werte als OKLCH-Tripel „L C H“.
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
  accent: '0.6 0.15 260',
  strong: '0.35 0.15 260',
  soft: '0.96 0.02 260',
  muted: '0.86 0.05 260',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  'autoschluessel': {
    label: 'Autoschlüssel',
    accent: '0.6 0.15 260',
    strong: '0.35 0.15 260',
    soft: '0.96 0.02 260',
    muted: '0.86 0.05 260',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.6 0.15 170',
    strong: '0.35 0.15 170',
    soft: '0.96 0.02 170',
    muted: '0.86 0.05 170',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.6 0.15 280',
    strong: '0.35 0.15 280',
    soft: '0.96 0.02 280',
    muted: '0.86 0.05 280',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.6 0.15 40',
    strong: '0.35 0.15 40',
    soft: '0.96 0.02 40',
    muted: '0.86 0.05 40',
  },
  'schliessanlagen': {
    label: 'Schließanlagen',
    accent: '0.6 0.15 300',
    strong: '0.35 0.15 300',
    soft: '0.96 0.02 300',
    muted: '0.86 0.05 300',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.6 0.15 220',
    strong: '0.35 0.15 220',
    soft: '0.96 0.02 220',
    muted: '0.86 0.05 220',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.6 0.15 150',
    strong: '0.35 0.15 150',
    soft: '0.96 0.02 150',
    muted: '0.86 0.05 150',
  },
  'sicherheitstechnik': {
    label: 'Sicherheitstechnik',
    accent: '0.6 0.15 10',
    strong: '0.35 0.15 10',
    soft: '0.96 0.02 10',
    muted: '0.86 0.05 10',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.6 0.15 330',
    strong: '0.35 0.15 330',
    soft: '0.96 0.02 330',
    muted: '0.86 0.05 330',
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
  const match = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)$/);
  if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

// Convert OKLCH to sRGB for contrast calculation
function oklchToSrgb([L, C, h]: [number, number, number]): [number, number, number] {
  const hRad = (h * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const red = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const green = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const blue = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Gamma compression
  const compress = (c: number) => {
    const abs = Math.abs(c);
    const compressed = abs <= 0.0031308 ? 12.92 * abs : 1.055 * Math.pow(abs, 1 / 2.4) - 0.055;
    return c < 0 ? -compressed : compressed;
  };

  return [compress(red), compress(green), compress(blue)];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const channel = (v: number) => {
    const cv = Math.max(0, Math.min(1, v));
    return cv <= 0.03928 ? cv / 12.92 : ((cv + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = rgb.map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier OKLCH-Tripel, z. B. `contrastRatio('1 0 0', theme.strong)`. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(oklchToSrgb(parseOklch(a)));
  const lb = relativeLuminance(oklchToSrgb(parseOklch(b)));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
