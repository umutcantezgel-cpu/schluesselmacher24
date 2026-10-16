import type { AreaKey } from '@/lib/types';

/**
 * Bereichsfarben — einzige Quelle für die Akzentfarbe je Leistungsbereich.
 *
 * Tailwind liest diese Werte in `tailwind.config.ts` und legt daraus die
 * Variablen `--area*` für `[data-area="…"]` an. Seiten, Icons und Grafiken
 * verwenden nur `text-area-strong`, `bg-area-soft`, `fill-area` usw. — nie
 * einen festen Farbwert.
 *
 * Werte als OKLCH-Tripel „H S% L%“ (wie die übrigen Tokens in `globals.css`).
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
  accent: '0.522 0.205 258.319',
  strong: '0.435 0.161 257.634',
  soft: '0.967 0.016 255.038',
  muted: '0.871 0.059 255.221',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.522 0.216 260.276',
    strong: '0.434 0.17 259.975',
    soft: '0.967 0.016 255.038',
    muted: '0.864 0.061 259.874',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.563 0.107 180.522',
    strong: '0.457 0.088 183.682',
    soft: '0.971 0.019 182.631',
    muted: '0.895 0.063 183.458',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.495 0.219 280.007',
    strong: '0.402 0.217 276.985',
    soft: '0.96 0.02 289.843',
    muted: '0.845 0.076 288.466',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.588 0.192 40.905',
    strong: '0.466 0.155 39.717',
    soft: '0.967 0.019 56.158',
    muted: '0.881 0.068 51.602',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.529 0.213 299.594',
    strong: '0.439 0.19 299.055',
    soft: '0.964 0.021 305.444',
    muted: '0.866 0.07 304.655',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.539 0.115 229.337',
    strong: '0.427 0.094 230.924',
    soft: '0.969 0.023 211.047',
    muted: '0.879 0.065 214.909',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.524 0.125 157.394',
    strong: '0.419 0.101 158.143',
    soft: '0.968 0.02 162.917',
    muted: '0.881 0.063 163.095',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.554 0.215 18.358',
    strong: '0.463 0.183 18.354',
    soft: '0.967 0.017 5.898',
    muted: '0.876 0.06 7.198',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.552 0.217 351.248',
    strong: '0.455 0.178 350.879',
    soft: '0.969 0.02 342.294',
    muted: '0.885 0.062 343.4',
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

function parseOklch(value: string): [number, number, number] {
  const match = value.trim().match(/^([\d.]+)\s+([\d.]+)\s+([\d.]+)$/);
  if (!match) throw new Error(`Kein OKLCH-Tripel: "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function relativeLuminanceOklch([l, c, h]: [number, number, number]): number {
  const hRad = h * Math.PI / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const L3 = l_ * l_ * l_;
  const M3 = m_ * m_ * m_;
  const S3 = s_ * s_ * s_;

  const r =  4.0767416621 * L3 - 3.3077115913 * M3 + 0.2309699292 * S3;
  const g = -1.2684380046 * L3 + 2.6097574011 * M3 - 0.3413193965 * S3;
  const bl = -0.0041960863 * L3 - 0.7034186147 * M3 + 1.7076147010 * S3;

  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
}

/** Kontrastverhaeltnis zweier OKLCH-Tripel. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminanceOklch(parseOklch(a));
  const lb = relativeLuminanceOklch(parseOklch(b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
