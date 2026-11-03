import type { CSSProperties } from 'react';

import { HILFSLINIE, KONTUR, LINIE, Raster } from '@/components/visual/generators/grafik-basis';

/**
 * Eingangsinszenierung der Startseite (Register B-31, G-04, G-07): Ein Autoschlüssel mit
 * glaubwürdigen Proportionen (Halm etwa viermal so lang wie hoch) fährt an den Profilzylinder,
 * der Kern dreht um 90°, dann rückt das Paar als Tür 01 in einen Schließplan, und drei weitere
 * Türen blenden ein. Gesamtdauer 1,47 s; der Ablauf ist reines CSS (`.sm24-eingang-teil`) und
 * läuft nur, solange das Startskript `sm24-start` gesetzt hat. Ohne JavaScript, bei „ruhig“ oder
 * nach dem Zeitlimit von 2 s steht sofort das Endbild. Dekorativ (`aria-hidden`).
 *
 * `band`: mobil, 320 × 56, eine Zeile. `buehne`: ab 1024 px, 480 × 300, mit Türnummern, auf
 * Zeichenpapier wie die übrigen Grafiken der Seite; das Raster läuft weit über die `viewBox` hinaus,
 * damit die Bühne die ganze rechte Spalte füllt (A-025). Die Beschriftung steht im HTML darüber.
 */
export type EingangVariante = 'band' | 'buehne';

interface Zylinder {
  x: number;
  y: number;
  r: number;
}

interface Aufbau {
  breite: number;
  hoehe: number;
  /** Spitze des Schlüssels im Endbild (berührt den Zylinder links). */
  spitze: { x: number; y: number };
  /** Maßstab des Schlüssels: 1 = Halm 60 × 14. */
  schluessel: number;
  tuer01: Zylinder;
  tueren: Zylinder[];
  nummern: boolean;
  /** Start: Weg des Schlüssels nach links und Lage des Paars vor dem Einrücken. */
  start: { schluesselX: number; paarX: number; paarGross: number };
}

export const EINGANG_AUFBAU: Record<EingangVariante, Aufbau> = {
  band: {
    breite: 320,
    hoehe: 56,
    spitze: { x: 88, y: 26 },
    schluessel: 0.6,
    tuer01: { x: 104, y: 26, r: 14 },
    tueren: [
      { x: 178, y: 26, r: 10 },
      { x: 232, y: 26, r: 10 },
      { x: 286, y: 26, r: 10 },
    ],
    nummern: false,
    start: { schluesselX: -36, paarX: 24, paarGross: 1.15 },
  },
  buehne: {
    breite: 480,
    hoehe: 300,
    spitze: { x: 180, y: 150 },
    schluessel: 1,
    tuer01: { x: 206, y: 150, r: 26 },
    tueren: [
      { x: 326, y: 86, r: 16 },
      { x: 326, y: 214, r: 16 },
      { x: 430, y: 150, r: 16 },
    ],
    nummern: true,
    start: { schluesselX: -72, paarX: 56, paarGross: 1.2 },
  },
};

/** Ablauf in Sekunden (Register B-31): Schlüssel, Kern, Einrücken, Türen gestaffelt. */
export const EINGANG_ABLAUF = {
  schluessel: { verzug: 0.1, dauer: 0.5 },
  kern: { verzug: 0.6, dauer: 0.28 },
  paar: { verzug: 0.85, dauer: 0.4 },
  tuer: { verzug: 0.95, staffel: 0.12, dauer: 0.28 },
} as const;

export function eingangGesamtdauer(): number {
  const { tuer, paar } = EINGANG_ABLAUF;
  const letzteTuer = tuer.verzug + tuer.staffel * 2 + tuer.dauer;
  return Math.round(Math.max(letzteTuer, paar.verzug + paar.dauer) * 100) / 100;
}

type Teilstil = CSSProperties & Record<`--${string}`, string>;

/** Ruhewerte jedes Teils: Alle vier Startvariablen stehen ausdrücklich da, sonst erbt ein Teil die
 *  Werte des umgebenden Teils (etwa der Kern den Weg des Paars). */
const RUHE = { x: '0px', dreh: '0deg', gross: '1', deckkraft: '1' } as const;

export function teil(verzug: number, dauer: number, start: Partial<Record<keyof typeof RUHE, string>>): Teilstil {
  const stil: Teilstil = { '--eingang-verzug': `${verzug}s`, '--eingang-dauer': `${dauer}s` };
  for (const [name, wert] of Object.entries({ ...RUHE, ...start })) stil[`--start-${name}`] = wert;
  return stil;
}

/**
 * Autoschlüssel in Seitenansicht mit dem Ursprung an der Spitze: Gehäuse 72 × 40 mit Taste,
 * Halm 60 × 14 mit drei Einschnitten (Verhältnis gut 4 : 1, G-07), Spitze schräg.
 */
function Autoschluessel() {
  const halm =
    'M-60 -7 L-52 -7 L-48 -3 L-43 -3 L-39 -7 L-32 -7 L-28 -2 L-23 -2 L-19 -7 L-16 -7 L-14 -4 L-11 -4 L-9 -7 L-8 -7 L0 0 L-8 7 L-60 7 Z';
  return (
    <g>
      <rect x={-132} y={-20} width={72} height={40} rx={12} className="fill-surface" stroke="currentColor" strokeWidth={KONTUR} />
      <circle cx={-104} cy={0} r={7} className="fill-primary-soft" stroke="currentColor" strokeWidth={LINIE} />
      <path d={halm} className="fill-surface" stroke="currentColor" strokeWidth={LINIE} strokeLinejoin="round" />
    </g>
  );
}

/** Profilzylinder von vorn (Europrofil): Kreis, Steg, Kern mit Schlüsselkanal (im Endbild quer). */
function ProfilZylinder({ z, kern }: { z: Zylinder; kern?: Teilstil }) {
  const steg = z.r * 0.88;
  const kernR = z.r * 0.62;
  return (
    <g>
      <rect x={z.x - steg / 2} y={z.y} width={steg} height={z.r * 1.6} rx={z.r * 0.3} className="fill-surface" stroke="currentColor" strokeWidth={LINIE} />
      <circle cx={z.x} cy={z.y} r={z.r} className="fill-surface" stroke="currentColor" strokeWidth={LINIE} />
      <g className={kern ? 'sm24-eingang-teil sm24-eingang-kern' : undefined} style={kern}>
        <circle cx={z.x} cy={z.y} r={kernR} className="fill-primary-soft" stroke="currentColor" strokeWidth={HILFSLINIE} />
        <rect x={z.x - kernR * 0.7} y={z.y - z.r * 0.08} width={kernR * 1.4} height={z.r * 0.16} rx={z.r * 0.06} className="fill-current" />
      </g>
    </g>
  );
}

export function EingangSzene({ variante, className }: { variante: EingangVariante; className?: string }) {
  const a = EINGANG_AUFBAU[variante];
  const { schluessel, kern, paar, tuer } = EINGANG_ABLAUF;
  const nummerY = (z: Zylinder) => z.y + z.r * 1.6 + 16;
  return (
    <svg
      viewBox={`0 0 ${a.breite} ${a.hoehe}`}
      aria-hidden
      focusable="false"
      data-eingang={variante}
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      {/* Zeichenpapier: eine dreifach hohe Fläche um die Mitte, damit es auch die hohe Spalte füllt */}
      {variante === 'buehne' && (
        <g transform={`translate(0 ${-a.hoehe})`}>
          <Raster breite={a.breite} hoehe={a.hoehe * 3} />
        </g>
      )}
      {/* Plan: Linien und Türen 02 bis 04 blenden gestaffelt ein */}
      {a.tueren.map((z, i) => (
        <g
          key={i}
          className="sm24-eingang-teil text-primary"
          style={teil(tuer.verzug + i * tuer.staffel, tuer.dauer, { deckkraft: '0', gross: '0.85' })}
        >
          <line
            x1={a.tuer01.x + a.tuer01.r}
            y1={a.tuer01.y}
            x2={z.x - z.r}
            y2={z.y}
            stroke="currentColor"
            strokeWidth={HILFSLINIE}
            strokeDasharray="3 4"
            strokeLinecap="round"
          />
          <ProfilZylinder z={z} />
          {a.nummern && (
            <text x={z.x} y={nummerY(z)} textAnchor="middle" className="fill-foreground-muted font-mono text-caption">
              {String(i + 2).padStart(2, '0')}
            </text>
          )}
        </g>
      ))}

      {/* Paar aus Schlüssel und Tür 01: rückt zuletzt aus der Mitte in den Plan */}
      <g className="sm24-eingang-teil text-primary" style={teil(paar.verzug, paar.dauer, { x: `${a.start.paarX}px`, gross: String(a.start.paarGross) })}>
        <ProfilZylinder z={a.tuer01} kern={teil(kern.verzug, kern.dauer, { dreh: '-90deg' })} />
        <g transform={`translate(${a.spitze.x} ${a.spitze.y}) scale(${a.schluessel})`}>
          <g className="sm24-eingang-teil sm24-eingang-schluessel" style={teil(schluessel.verzug, schluessel.dauer, { x: `${a.start.schluesselX / a.schluessel}px` })}>
            <Autoschluessel />
          </g>
        </g>
        {a.nummern && (
          <text x={a.tuer01.x} y={nummerY(a.tuer01)} textAnchor="middle" className="fill-foreground-muted font-mono text-caption">
            01
          </text>
        )}
      </g>
    </svg>
  );
}
