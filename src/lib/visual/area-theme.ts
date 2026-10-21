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
 * Bewusst kein Gelb/Schwarz: keine Notdienstoptik. Benachbarte Bereiche liegen im
 * Farbton mindestens 30° auseinander, damit sie nebeneinander unterscheidbar bleiben
 * (Sichtabnahme E2-L-07, D-017). Code und Schließanlagen liegen im Blau-Violett, wo
 * 30° kaum zu sehen sind; zwischen ihnen stehen deshalb 42° (Sichtabnahme E4-L-23).
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
  accent: '0.572 0.205 258.32',
  strong: '0.485 0.161 257.63',
  soft: '0.967 0.016 255.04',
  muted: '0.871 0.059 255.22',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.544 0.227 262.18',
    strong: '0.459 0.177 262.12',
    soft: '0.963 0.017 264.49',
    muted: '0.858 0.064 264.15',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.584 0.121 163.42',
    strong: '0.485 0.102 163.15',
    soft: '0.970 0.020 173.98',
    muted: '0.890 0.066 172.20',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.544 0.207 284.80',
    strong: '0.460 0.199 282.87',
    soft: '0.961 0.021 293.67',
    muted: '0.850 0.075 292.37',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.647 0.186 43.34',
    strong: '0.531 0.146 44.58',
    soft: '0.966 0.019 52.31',
    muted: '0.881 0.068 51.60',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.617 0.227 322.07',
    strong: '0.524 0.188 322.09',
    soft: '0.969 0.025 321.66',
    muted: '0.885 0.078 321.83',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.612 0.108 217.57',
    strong: '0.497 0.087 217.10',
    soft: '0.969 0.022 211.05',
    muted: '0.884 0.066 211.35',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.521 0.124 132.34',
    strong: '0.429 0.105 132.53',
    soft: '0.966 0.020 128.69',
    muted: '0.872 0.068 129.37',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.603 0.215 20.30',
    strong: '0.512 0.183 20.30',
    soft: '0.967 0.017 8.17',
    muted: '0.875 0.060 9.41',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.590 0.218 347.28',
    strong: '0.498 0.175 346.55',
    soft: '0.969 0.021 339.17',
    muted: '0.886 0.061 340.14',
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
    '--area-foreground': '1.000 0.000 0.00',
  };
}

/* ---------- Kontrast (WCAG 2.2) ----------------------------------------- */

function parseOklch(value: string): [number, number, number] {
  const match = value.trim().match(/^([\d.]+)\s+([\d.]+)\s+([\d.]+)$/);
  if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function oklchToOklab([l, c, h]: [number, number, number]): [number, number, number] {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  return [l, a, b];
}

function oklabToLinearSrgb([L, a, b]: [number, number, number]): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return [lr, lg, lb];
}

function relativeLuminanceLinear([r, g, b]: [number, number, number]): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier OKLCH-Tripel, z. B. `contrastRatio('1.000 0.000 0.00', theme.strong)`. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminanceLinear(oklabToLinearSrgb(oklchToOklab(parseOklch(a))));
  const lb = relativeLuminanceLinear(oklabToLinearSrgb(oklchToOklab(parseOklch(b))));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
