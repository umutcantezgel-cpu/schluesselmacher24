import { wcagContrast } from 'culori';
import type { AreaKey } from '@/lib/types';

/**
 * Bereichsfarben — einzige Quelle für die Akzentfarbe je Leistungsbereich.
 *
 * Tailwind liest diese Werte in `tailwind.config.ts` und legt daraus die
 * Variablen `--area*` für `[data-area="…"]` an. Seiten, Icons und Grafiken
 * verwenden nur `text-area-strong`, `bg-area-soft`, `fill-area` usw. — nie
 * einen festen Farbwert.
 *
 * Werte als OKLCH-Tripel „l c h“ (wie die übrigen Tokens in `globals.css`).
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
  accent: '0.572 0.205 258',
  strong: '0.485 0.161 258',
  soft: '0.967 0.016 255',
  muted: '0.871 0.059 255',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.572 0.216 260',
    strong: '0.484 0.170 260',
    soft: '0.967 0.016 255',
    muted: '0.864 0.061 260',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.613 0.107 181',
    strong: '0.507 0.088 184',
    soft: '0.971 0.019 183',
    muted: '0.895 0.063 183',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.545 0.219 280',
    strong: '0.452 0.217 277',
    soft: '0.960 0.020 290',
    muted: '0.845 0.076 288',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.638 0.192 41',
    strong: '0.516 0.155 40',
    soft: '0.967 0.019 56',
    muted: '0.881 0.068 52',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.579 0.213 300',
    strong: '0.489 0.190 299',
    soft: '0.964 0.021 305',
    muted: '0.866 0.070 305',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.589 0.115 229',
    strong: '0.477 0.094 231',
    soft: '0.969 0.023 211',
    muted: '0.879 0.065 215',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.574 0.125 157',
    strong: '0.469 0.101 158',
    soft: '0.968 0.020 163',
    muted: '0.881 0.063 163',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.604 0.215 18',
    strong: '0.513 0.183 18',
    soft: '0.967 0.017 6',
    muted: '0.876 0.060 7',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.602 0.217 351',
    strong: '0.505 0.178 351',
    soft: '0.969 0.020 342',
    muted: '0.885 0.062 343',
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

/** Kontrastverhältnis zweier OKLCH-Tripel (als String, z.B. '0.572 0.205 258') */
export function contrastRatio(a: string, b: string): number {
  function parse(val: string) {
    if (val === '1.000 0.000 0') return { mode: 'oklch' as const, l: 1, c: 0, h: 0 };
    if (val === '0.000 0.000 0') return { mode: 'oklch' as const, l: 0, c: 0, h: 0 };
    const parts = val.trim().split(/\s+/);
    return {
      mode: 'oklch' as const,
      l: parseFloat(parts[0]),
      c: parseFloat(parts[1]),
      h: parseFloat(parts[2])
    };
  }
  return wcagContrast(parse(a), parse(b));
}
