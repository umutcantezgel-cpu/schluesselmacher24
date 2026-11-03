import { kerben, LINIE, positionen, r } from '@/components/visual/generators/grafik-basis';
import { InView } from '@/components/visual/motion/in-view';
import { motionStyle } from '@/components/visual/motion/motion-style';
import { cn } from '@/lib/cn';

/**
 * Code-Motiv (G-13, Register B-33): Schließcode-Ziffern ordnen sich zu der Bartlinie, die sie
 * beschreiben. Jede Ziffer steht über ihrem Einschnitt, die Tiefe folgt der Ziffer, so wie ein
 * Schlüssel nach Code gefräst wird. Erst erscheinen die Ziffern (Deckkraft, 4 px, gestaffelt),
 * dann zeichnet sich die Linie, danach Ruhe. Rein dekorativ (`aria-hidden`), höchstens einmal je
 * Ansicht; ohne Bewegung steht das Endbild.
 */
export const CODE_MOTIV_ZIFFERN = [3, 5, 2, 6, 4, 1, 4] as const;

/** Maße in Bildschirmpixeln: Das Motiv wird nicht skaliert, die Ziffern bleiben 12 px groß. */
const BREITE = 320;
const HOEHE = 56;
const RUECKEN = 30;
/** Tiefe je Codestufe in Pixeln (Stufe 1 bis 6). */
const STUFE = 2.6;

export function codeMotivPfad(ziffern: readonly number[] = CODE_MOTIV_ZIFFERN): { d: string; xs: number[] } {
  const xs = positionen(ziffern.length, 40, 272);
  const kanten = kerben(xs, ziffern.map((z) => r(z * STUFE)), 5, 3).map(([x, t]): [number, number] => [r(x), r(RUECKEN + t)]);
  const punkte: [number, number][] = [[8, RUECKEN], ...kanten, [292, RUECKEN], [312, RUECKEN + 12]];
  return { d: `M${punkte.map(([x, y]) => `${x} ${y}`).join(' L')}`, xs: xs.map(r) };
}

export function CodeMotiv({ className }: { className?: string }) {
  const { d, xs } = codeMotivPfad();
  return (
    <InView kennung="B-33" className={cn('text-foreground-subtle', className)}>
      <svg
        viewBox={`0 0 ${BREITE} ${HOEHE}`}
        width={BREITE}
        height={HOEHE}
        aria-hidden
        focusable="false"
        className="block max-w-full"
      >
        {CODE_MOTIV_ZIFFERN.map((ziffer, i) => (
          <text
            key={i}
            x={xs[i]}
            y={18}
            textAnchor="middle"
            className="sm24-ordnen fill-current font-mono text-caption tabular-nums"
            style={motionStyle(i * 0.08)}
          >
            {ziffer}
          </text>
        ))}
        <path
          d={d}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={LINIE}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sm24-draw text-primary"
          style={motionStyle(0.6, 0.9)}
        />
      </svg>
    </InView>
  );
}
