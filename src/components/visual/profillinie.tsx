import { cn } from '@/lib/cn';

import { hash, kerben, positionen, r, zahlenfolge } from './generators/grafik-basis';
import { DRAW_DASHARRAY, motionStyle } from './motion/motion-style';

/**
 * Leitelement der Erzählansichten (KERN K-008, Register B-02): eine gestufte
 * Linie nach dem Vorbild eines Schlüsselbarts – Rücken, Einschnitte, Spitze.
 * Das Profil wird aus `text` abgeleitet; gleicher Text ergibt dieselbe Linie.
 *
 * Mit `voll` läuft danach eine Haarlinie bis zum Rand des Elternelements.
 * Farbe über `currentColor` (z. B. `text-area` oder `text-primary`).
 * Dekorativ, deshalb `aria-hidden`. Die Linie zeichnet sich einmal (`sm24-draw`),
 * sobald ein Vorfahr `InView` den Bereich sichtbar meldet; ohne JavaScript oder
 * bei „Bewegung reduzieren“ steht sie sofort vollständig da.
 */
export interface ProfillinieProps {
  /** Text, aus dem das Profil entsteht (etwa die Überschrift). */
  text: string;
  /** Zahl der Einschnitte, 3–8 (Standard 5). */
  einschnitte?: number;
  /** `klein` unter Augenbrauen-Zeilen, `gross` als Trenner oder im Hero. */
  groesse?: 'klein' | 'gross';
  /** Haarlinie bis zum Rand anschließen. */
  voll?: boolean;
  /** Verzögerung der Zeichnung in Sekunden. */
  delay?: number;
  /** Ohne Einstiegsbewegung (etwa in Arbeitsansichten). */
  ruhig?: boolean;
  className?: string;
}

/** Haarlinie der Bemaßung in Pixeln (entspricht `--strich` in globals.css). */
const STRICH = 1.5;

const MASSE = {
  /* Abstand deutlich größer als die Kerbe, damit flache Stücke zwischen den Einschnitten
     stehen – sonst liest sich die Linie als Welle statt als Schlüsselbart. */
  klein: { hoehe: 10, abstand: 14, flach: 3, steigung: 2.2, tiefe: 5.5, rand: 1.5 },
  gross: { hoehe: 16, abstand: 20, flach: 4, steigung: 2, tiefe: 9, rand: 2 },
} as const;

/** Punkte des Profils: Rücken links, Einschnitte, Spitze rechts (y wächst nach unten). */
export function profillinienPunkte(
  text: string,
  einschnitte = 5,
  groesse: 'klein' | 'gross' = 'klein',
): { punkte: [number, number][]; breite: number; hoehe: number } {
  const m = MASSE[groesse];
  const anzahl = Math.min(8, Math.max(3, Math.round(Number.isFinite(einschnitte) ? einschnitte : 5)));
  const naechste = zahlenfolge(hash(text.trim().toLowerCase() || 'sm24'));
  const tiefen = Array.from({ length: anzahl }, () => r(m.tiefe * (0.35 + 0.65 * naechste())));
  const start = m.abstand * 0.9;
  const pos = positionen(anzahl, start, start + (anzahl - 1) * m.abstand);
  const ende = pos[anzahl - 1] + m.abstand * 0.9;
  const breite = r(ende + m.hoehe * 0.6);
  const oben = m.rand;
  const kanten = kerben(pos, tiefen, m.flach, m.steigung).map(([x, t]): [number, number] => [r(x), r(oben + t)]);
  const punkte: [number, number][] = [
    [0, oben],
    ...kanten,
    [r(ende), oben],
    /* Spitze: schräg nach unten wie am Schlüsselbart */
    [breite, r(m.hoehe - m.rand)],
  ];
  return { punkte, breite, hoehe: m.hoehe };
}

export function Profillinie({
  text,
  einschnitte = 5,
  groesse = 'klein',
  voll = false,
  delay = 0,
  ruhig = false,
  className,
}: ProfillinieProps) {
  const { punkte, breite, hoehe } = profillinienPunkte(text, einschnitte, groesse);
  const d = `M${punkte.map(([x, y]) => `${x} ${y}`).join('L')}`;
  const zeichnen = !ruhig;

  return (
    <span aria-hidden className={cn('flex items-start', voll ? 'w-full' : 'w-max', className)}>
      <svg
        viewBox={`0 0 ${breite} ${hoehe}`}
        width={breite}
        height={hoehe}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
        className="shrink-0 overflow-visible"
      >
        <path
          className={cn('stroke-current', zeichnen && 'sm24-draw')}
          pathLength={zeichnen ? 1 : undefined}
          strokeWidth={STRICH}
          style={zeichnen ? motionStyle(delay, 0.6, { strokeDasharray: DRAW_DASHARRAY }) : undefined}
          d={d}
        />
      </svg>
      {voll && (
        <svg
          viewBox={`0 0 100 ${hoehe}`}
          preserveAspectRatio="none"
          height={hoehe}
          fill="none"
          strokeLinecap="round"
          focusable="false"
          className="min-w-0 flex-1 overflow-visible"
        >
          <path
            className={cn('stroke-current', zeichnen && 'sm24-draw')}
            pathLength={zeichnen ? 1 : undefined}
            strokeWidth={STRICH}
            vectorEffect="non-scaling-stroke"
            style={zeichnen ? motionStyle(delay + 0.45, 0.6, { strokeDasharray: DRAW_DASHARRAY }) : undefined}
            d={`M0 ${r(hoehe - MASSE[groesse].rand)}H100`}
          />
        </svg>
      )}
    </span>
  );
}
