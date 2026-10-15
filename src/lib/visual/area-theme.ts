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
  accent: '214 86% 50%',
  strong: '214 80% 40%',
  soft: '214 100% 96.5%',
  muted: '214 90% 86%',
};

export const AREA_THEMES: Record<AreaKey, AreaTheme> = {
  autoschluessel: {
    label: 'Autoschlüssel',
    accent: '217 91% 53%',
    strong: '217 76% 42%',
    soft: '214 100% 96.5%',
    muted: '217 90% 86%',
  },
  'schluessel-nach-vorlage': {
    label: 'Schlüssel nach Vorlage',
    accent: '172 76% 34%',
    strong: '174 84% 25%',
    soft: '168 64% 94.5%',
    muted: '170 60% 80%',
  },
  'schluessel-nach-code': {
    label: 'Schlüssel nach Code',
    accent: '245 78% 62%',
    strong: '245 58% 50%',
    soft: '245 100% 97%',
    muted: '245 90% 88%',
  },
  'gleichschliessende-zylinder': {
    label: 'Gleichschließende Zylinder',
    accent: '20 88% 48%',
    strong: '18 84% 37%',
    soft: '24 100% 95.5%',
    muted: '22 95% 84%',
  },
  schliessanlagen: {
    label: 'Schließanlagen',
    accent: '266 72% 60%',
    strong: '266 52% 48%',
    soft: '266 100% 97%',
    muted: '266 80% 88%',
  },
  'elektronische-zutrittsloesungen': {
    label: 'Elektronische Zutrittslösungen',
    accent: '195 90% 37%',
    strong: '196 90% 28%',
    soft: '190 90% 94.5%',
    muted: '192 75% 80%',
  },
  'tuer-und-schliesstechnik': {
    label: 'Tür- und Schließtechnik',
    accent: '152 64% 34%',
    strong: '153 68% 25%',
    soft: '148 56% 94.5%',
    muted: '150 50% 80%',
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
    accent: '326 68% 52%',
    strong: '326 62% 41%',
    soft: '326 100% 97%',
    muted: '326 75% 88%',
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
import { wcagContrast, parse } from 'culori';

export function contrastRatio(a: string, b: string): number {
  const parseColor = (val: string) => {
    if (val.includes('%')) {
      const match = val.trim().match(/^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
      if (match) return `hsl(${match[1]}, ${match[2]}%, ${match[3]}%)`;
    }
    const oklchMatch = val.trim().match(/^([\d.]+)\s+([\d.]+)\s+([\d.]+)$/);
    if (oklchMatch) return `oklch(${oklchMatch[1]} ${oklchMatch[2]} ${oklchMatch[3]})`;
    return val;
  };
  const ca = parse(parseColor(a));
  const cb = parse(parseColor(b));
  if (!ca || !cb) return 1;
  return wcagContrast(ca, cb);
}
