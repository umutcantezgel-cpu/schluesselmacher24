import type { CSSProperties } from 'react';

/** CSS-Variablen der Einstiegsbewegungen aus `globals.css`. */
export interface MotionVariables {
  '--sm24-delay'?: string;
  '--sm24-duration'?: string;
}

/** `style`-Objekt mit den Bewegungsvariablen — ohne `as string`-Umwege. */
export type MotionStyle = CSSProperties & MotionVariables;

/**
 * Strichmuster für `.sm24-draw` (mit `pathLength={1}`): Lücke länger als der
 * Pfad. Beim Standardmuster aus `globals.css` (`1` = Strich 1, Lücke 1)
 * beginnt im Wartezustand (Versatz 1) genau am Pfadende ein Strich der
 * Länge 0 — mit runden Enden ein sichtbarer Punkt, bei Kreisen oben am Start.
 */
export const DRAW_DASHARRAY = '1 2';

function sekunden(wert: number): string | undefined {
  if (typeof wert !== 'number' || !Number.isFinite(wert)) return undefined;
  return `${Math.round(Math.max(0, wert) * 1000) / 1000}s`;
}

/**
 * Verzögerung und optionale Dauer (Sekunden) für `.sm24-draw`, `.sm24-reveal`,
 * `.sm24-pop` … als typsicheres `style`-Objekt. Ungültige Werte entfallen.
 *
 * ```tsx
 * <path className="sm24-draw" pathLength={1} style={motionStyle(0.2)} d="…" />
 * ```
 */
export function motionStyle(delay = 0, duration?: number, base?: CSSProperties): MotionStyle {
  const style: MotionStyle = { ...base };
  const verzoegerung = sekunden(delay);
  if (verzoegerung) style['--sm24-delay'] = verzoegerung;
  if (duration !== undefined && duration > 0) {
    const dauer = sekunden(duration);
    if (dauer) style['--sm24-duration'] = dauer;
  }
  return style;
}
