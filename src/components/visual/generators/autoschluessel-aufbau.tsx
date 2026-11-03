import { cn } from '@/lib/cn';

import { GrafikRahmen, HILFSLINIE, KONTUR, LINIE, Raster, SCHRIFT_KLEIN, titel } from './grafik-basis';

/**
 * Aufbauzeichnung eines Funk-Klappschlüssels (A-025, E4-OPUS-07): Gehäuse und Tasten oben, darunter
 * die Platine mit Sender und die Batterie, der Transponder und unten die Schale mit dem Bart. Die
 * Teile liegen auseinandergezogen auf Montageachsen; Positionsnummern 1 bis 5 verweisen auf die
 * Leistungen daneben (`AUFBAU_TEILE`). Schematisch, nicht maßstäblich; Farben nur über
 * `currentColor` und die Bereichstokens.
 */
export const AUFBAU_GROESSE = { breite: 560, hoehe: 320 } as const;

export interface AufbauTeil {
  nr: 1 | 2 | 3 | 4 | 5;
  name: string;
}

/** Reihenfolge der Positionsnummern: vom Bart (Mechanik) zur Hülle. */
export const AUFBAU_TEILE: readonly AufbauTeil[] = [
  { nr: 1, name: 'Schlüsselbart' },
  { nr: 2, name: 'Transponder' },
  { nr: 3, name: 'Platine mit Sender' },
  { nr: 4, name: 'Batterie' },
  { nr: 5, name: 'Gehäuse und Tasten' },
];

/** Bart: 290 lang und 22 hoch, mit Spurfräsung als Wellenlinie und abgeschrägter Spitze. */
export const BART = { x: 214, y: 249, laenge: 290, hoehe: 22 } as const;

/** Positionsnummer mit Hinweislinie: Punkt am Teil, Linie, Kreis mit Ziffer. */
function Position({ nr, x, y, zuX, zuY }: { nr: number; x: number; y: number; zuX: number; zuY: number }) {
  return (
    <g data-position={nr}>
      <line x1={zuX} y1={zuY} x2={x} y2={y} stroke="currentColor" strokeWidth={HILFSLINIE} />
      <circle cx={zuX} cy={zuY} r={2.5} className="fill-current" />
      <circle cx={x} cy={y} r={11} className="fill-area" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={SCHRIFT_KLEIN} className="fill-area-foreground font-mono font-semibold">
        {nr}
      </text>
    </g>
  );
}

function Spurfraesung() {
  const { x, y, laenge, hoehe } = BART;
  const mitte = y + hoehe / 2;
  const punkte: string[] = [];
  for (let i = 0; i <= 12; i++) {
    const px = x + 18 + i * ((laenge - 60) / 12);
    const py = mitte + (i % 2 === 0 ? -4 : 4);
    punkte.push(`${i === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py}`);
  }
  return <path d={punkte.join(' ')} stroke="currentColor" strokeWidth={LINIE} />;
}

/** Ersatztitel bei leerem oder fehlendem Titel (Schnittstelle der Registry). */
export const AUFBAU_TITEL = 'Aufbau eines Funk-Klappschlüssels, schematisch';

export function AutoschluesselAufbau({ className, title }: { className?: string; title?: string }) {
  const { breite, hoehe } = AUFBAU_GROESSE;
  const { x: bx, y: by, laenge, hoehe: bh } = BART;
  const bartPfad = `M${bx} ${by} L${bx + laenge - 18} ${by} L${bx + laenge} ${by + bh / 2} L${bx + laenge - 18} ${by + bh} L${bx} ${by + bh} Z`;
  return (
    <GrafikRahmen breite={breite} hoehe={hoehe} title={titel(title, AUFBAU_TITEL)} className={cn('text-area-strong', className)}>
      <Raster breite={breite} hoehe={hoehe} />

      {/* Montageachsen: Schale, Platine und Schale liegen übereinander */}
      {[62, 188].map((ax) => (
        <line key={ax} x1={ax} y1={92} x2={ax} y2={228} stroke="currentColor" strokeWidth={HILFSLINIE} strokeDasharray="3 4" />
      ))}

      {/* 5 Gehäuse oben mit drei Tasten */}
      <rect x={40} y={28} width={170} height={64} rx={22} className="fill-surface" stroke="currentColor" strokeWidth={KONTUR} />
      {[70, 106, 142].map((tx) => (
        <rect key={tx} x={tx} y={51} width={28} height={18} rx={6} className="fill-area-soft" stroke="currentColor" strokeWidth={LINIE} />
      ))}

      {/* 3 Platine mit Tastern, Baustein und Antenne */}
      <rect x={56} y={120} width={138} height={44} rx={6} className="fill-area-muted" stroke="currentColor" strokeWidth={LINIE} />
      {[72, 100, 128].map((sx) => (
        <g key={sx}>
          <rect x={sx} y={134} width={16} height={16} rx={2} className="fill-surface" stroke="currentColor" strokeWidth={HILFSLINIE} />
          <circle cx={sx + 8} cy={142} r={4} stroke="currentColor" strokeWidth={HILFSLINIE} />
        </g>
      ))}
      <rect x={158} y={133} width={20} height={18} rx={2} className="fill-current" />
      <path d="M62 126 H188 V158" stroke="currentColor" strokeWidth={HILFSLINIE} strokeDasharray="1 3" />

      {/* 4 Batterie (Knopfzelle) */}
      <circle cx={300} cy={142} r={20} className="fill-surface" stroke="currentColor" strokeWidth={LINIE} />
      <circle cx={300} cy={142} r={14} stroke="currentColor" strokeWidth={HILFSLINIE} />
      <path d="M296 142 H304 M300 138 V146" stroke="currentColor" strokeWidth={LINIE} />

      {/* 2 Transponder als Glaskapsel mit Spule */}
      <rect x={96} y={192} width={40} height={14} rx={7} className="fill-area-soft" stroke="currentColor" strokeWidth={LINIE} />
      <path d="M104 199 l3 -4 l3 8 l3 -8 l3 8 l3 -8 l3 8 l3 -8 l3 4" stroke="currentColor" strokeWidth={HILFSLINIE} />

      {/* 1 Schale unten mit Klappgelenk und Bart */}
      <rect x={40} y={228} width={170} height={64} rx={22} className="fill-surface" stroke="currentColor" strokeWidth={KONTUR} />
      <circle cx={196} cy={260} r={8} className="fill-area-soft" stroke="currentColor" strokeWidth={LINIE} />
      <path d={bartPfad} className="fill-surface" stroke="currentColor" strokeWidth={KONTUR} strokeLinejoin="round" />
      <Spurfraesung />

      <Position nr={1} x={470} y={226} zuX={452} zuY={252} />
      <Position nr={2} x={162} y={182} zuX={136} zuY={196} />
      <Position nr={3} x={224} y={110} zuX={194} zuY={126} />
      <Position nr={4} x={340} y={112} zuX={316} zuY={128} />
      <Position nr={5} x={236} y={26} zuX={206} zuY={40} />
    </GrafikRahmen>
  );
}
