import { cn } from '@/lib/cn';

import { DRAW_DASHARRAY, motionStyle } from './motion-style';

export interface CheckDrawProps {
  /** Alternativtext; wird als `<title>` angesagt. Standard „Bestätigt“. */
  title?: string;
  /** Kantenlänge in Pixel, Standard 48. */
  size?: number;
  /** Verzögerung in Sekunden, bevor sich der Kreis zeichnet. */
  delay?: number;
  className?: string;
}

const STANDARD_TITEL = 'Bestätigt';
const STANDARD_GROESSE = 48;

/** Kreis als Pfad, beginnt oben und läuft im Uhrzeigersinn — so zeichnet er sich wie von Hand. */
const KREIS = 'M24 4A20 20 0 1 1 24 44A20 20 0 1 1 24 4';
const HAKEN = 'M15.5 24.5L21.5 30.5L33 18.5';

/** Zeitplan in Sekunden: Fläche, dann Kreis, dann Haken. */
const KREIS_START = 0.05;
const KREIS_DAUER = 0.6;
const HAKEN_START = 0.55;
const HAKEN_DAUER = 0.35;
/** Verhindert den Punkt am Pfadende im Wartezustand (siehe `DRAW_DASHARRAY`). */
const STRICH = { strokeDasharray: DRAW_DASHARRAY };

/**
 * Bestätigungshaken im Kreis — etwa nach dem Absenden einer Anfrage. Zuerst
 * zeichnet sich der Kreis, danach der Haken. Server-Komponente, reines CSS;
 * ohne Bewegung ist der Haken sofort vollständig. Farben aus dem
 * Bereichsakzent.
 */
export function CheckDraw({
  title = STANDARD_TITEL,
  size = STANDARD_GROESSE,
  delay = 0,
  className,
}: CheckDrawProps) {
  const kante = typeof size === 'number' && Number.isFinite(size) && size > 0 ? size : STANDARD_GROESSE;
  const text = typeof title === 'string' && title.trim() ? title.trim() : STANDARD_TITEL;
  const start = typeof delay === 'number' && Number.isFinite(delay) ? Math.max(0, delay) : 0;

  return (
    <svg
      viewBox="0 0 48 48"
      width={kante}
      height={kante}
      role="img"
      aria-label={text}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
    >
      <title>{text}</title>
      <circle className="sm24-pop fill-area-soft" style={motionStyle(start)} cx={24} cy={24} r={20} />
      <path
        className="sm24-draw stroke-area"
        pathLength={1}
        style={motionStyle(start + KREIS_START, KREIS_DAUER, STRICH)}
        strokeWidth={2}
        d={KREIS}
      />
      <path
        className="sm24-draw stroke-area-strong"
        pathLength={1}
        style={motionStyle(start + HAKEN_START, HAKEN_DAUER, STRICH)}
        strokeWidth={2.5}
        d={HAKEN}
      />
    </svg>
  );
}
