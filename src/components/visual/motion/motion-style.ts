import type { CSSProperties } from 'react';

/** CSS-Variablen der Einstiegsbewegungen aus `globals.css`. */
export interface MotionVariables {
  '--sm24-delay'?: string;
  '--sm24-duration'?: string;
}

/** `style`-Objekt mit den Bewegungsvariablen — ohne `as string`-Umwege. */
export type MotionStyle = CSSProperties & MotionVariables;

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
