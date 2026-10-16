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
  accent: '0.450 0.205 258.3',
  strong: '0.450 0.161 257.6',
  soft: '0.970 0.016 255.0',
  muted: '0.871 0.059 255.2',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.600 0.216 260.3',
    strong: '0.450 0.170 260.0',
    soft: '0.970 0.016 255.0',
    muted: '0.864 0.061 259.9',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.450 0.107 180.5',
    strong: '0.350 0.088 183.7',
    soft: '0.970 0.019 182.6',
    muted: '0.895 0.063 183.5',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.600 0.219 280.0',
    strong: '0.450 0.217 277.0',
    soft: '0.970 0.020 289.8',
    muted: '0.845 0.076 288.5',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.450 0.192 40.9',
    strong: '0.450 0.155 39.7',
    soft: '0.970 0.019 56.2',
    muted: '0.881 0.068 51.6',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.600 0.213 299.6',
    strong: '0.450 0.190 299.1',
    soft: '0.970 0.021 305.4',
    muted: '0.866 0.070 304.7',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.450 0.115 229.3',
    strong: '0.350 0.094 230.9',
    soft: '0.970 0.023 211.0',
    muted: '0.879 0.065 214.9',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.450 0.125 157.4',
    strong: '0.350 0.101 158.1',
    soft: '0.970 0.020 162.9',
    muted: '0.881 0.063 163.1',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.600 0.215 18.4',
    strong: '0.450 0.183 18.4',
    soft: '0.970 0.017 5.9',
    muted: '0.876 0.060 7.2',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.600 0.217 351.2',
    strong: '0.450 0.178 350.9',
    soft: '0.970 0.020 342.3',
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
    '--area-foreground': '0.970 0.000 0',
  };
}

/* ---------- Kontrast (WCAG 2.2) ----------------------------------------- */

import { wcagLuminance } from 'culori';

function parseColor(value: string) {
  const matchOklch = value.trim().match(/^([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (matchOklch) {
    return {
      mode: 'oklch' as const,
      l: Number(matchOklch[1]),
      c: Number(matchOklch[2]),
      h: Number(matchOklch[3])
    };
  }

  const matchHsl = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (matchHsl) {
    return {
      mode: 'hsl' as const,
      h: Number(matchHsl[1]),
      s: Number(matchHsl[2]) / 100,
      l: Number(matchHsl[3]) / 100
    };
  }

  throw new Error(`Kein OKLCH/HSL-Tripel: "${value}"`);
}

/** Kontrastverhältnis zweier OKLCH/HSL-Tripel, z. B. `contrastRatio('1.000 0.000 0', theme.strong)`. */
export function contrastRatio(a: string, b: string): number {
  const colorA = parseColor(a);
  const colorB = parseColor(b);

  const la = wcagLuminance(colorA);
  const lb = wcagLuminance(colorB);

  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
