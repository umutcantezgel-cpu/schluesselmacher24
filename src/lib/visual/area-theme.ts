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
  accent: '0.55 0.12 260',
  strong: '0.45 0.12 260',
  soft: '0.96 0.01 260',
  muted: '0.96 0.01 260',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '0.55 0.12 260',
    strong: '0.45 0.12 260',
    soft: '0.96 0.01 260',
    muted: '0.96 0.01 260',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '0.55 0.12 260',
    strong: '0.45 0.12 260',
    soft: '0.96 0.01 260',
    muted: '0.96 0.01 260',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '0.55 0.12 260',
    strong: '0.45 0.12 260',
    soft: '0.96 0.01 260',
    muted: '0.96 0.01 260',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '0.55 0.12 260',
    strong: '0.45 0.12 260',
    soft: '0.96 0.01 260',
    muted: '0.96 0.01 260',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '0.55 0.12 260',
    strong: '0.45 0.12 260',
    soft: '0.96 0.01 260',
    muted: '0.96 0.01 260',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '0.55 0.12 260',
    strong: '0.45 0.12 260',
    soft: '0.96 0.01 260',
    muted: '0.96 0.01 260',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '0.55 0.12 260',
    strong: '0.45 0.12 260',
    soft: '0.96 0.01 260',
    muted: '0.96 0.01 260',
  },
  sicherheitstechnik: {
    label: 'Sicherheitstechnik',
    accent: '0.55 0.12 260',
    strong: '0.45 0.12 260',
    soft: '0.96 0.01 260',
    muted: '0.96 0.01 260',
  },
  'service-und-termin': {
    label: 'Service und Termin',
    accent: '0.55 0.12 260',
    strong: '0.45 0.12 260',
    soft: '0.96 0.01 260',
    muted: '0.96 0.01 260',
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





import { wcagContrast } from 'culori';

export function contrastRatio(a: string, b: string): number {
  try {
    const colorA = `oklch(${a})`;
    const colorB = `oklch(${b})`;
    return wcagContrast(colorA, colorB) || 1;
  } catch {
    return 1;
  }
}
