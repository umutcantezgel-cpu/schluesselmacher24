import type { ReactNode } from 'react';

import type { VisualProps } from '../registry';
import { motionStyle } from '../motion/motion-style';
import {
  AKZENT,
  GrafikRahmen,
  HILFSLINIE,
  KONTUR,
  LINIE,
  LINIE_STARK,
  MARKE,
  Raster,
  SCHRIFT,
  aussenTangenten,
  auswahl,
  kerben,
  parameter,
  positionen,
  r,
  titel,
  wert,
} from './grafik-basis';

const BREITE = 480;
const HOEHE = 270;

const ORTE = ['schluesselkopf', 'sicherungskarte', 'zylinderstirn'] as const;
type Ort = (typeof ORTE)[number];

interface Kreis {
  x: number;
  y: number;
  r: number;
}

interface Fundstelle {
  /** Schlüssel, Karte oder Zylinderfront. */
  objekt: ReactNode;
  /** Kreis um die Fundstelle. */
  marke: Kreis;
  /** Lupe mit vergrößertem Ausschnitt. */
  lupe: Kreis;
  /** Hintergrund des vergrößerten Ausschnitts. */
  lupenGrund: string;
  /** Inhalt der Lupe in lokalen Koordinaten um (0, 0). */
  lupenInhalt: (verzoegerung: number) => ReactNode;
  /** Hinweislinie und Beschriftung, nur mit `beschriftung` (Schlüsselkopf). */
  hinweis?: { pfad: string; x: number; y: number };
}

/**
 * Oberkante des Barts nach den Einschnitt-Regeln des Profilschnitts: feste Tiefen,
 * Steigung 1,1, keine sichtbaren Ziffern. Punkte `[r(x), r(146 + t)]`.
 */
const BART_KANTE = kerben(positionen(4, 212, 262), [6, 11, 4, 9], 3, 1.1)
  .map(([x, t]) => `L${r(x)} ${r(146 + t)}`)
  .join('');

/**
 * Neutrale Platzhalter-Striche statt einer Nummer — bewusst keine Ziffern,
 * damit keine echte Schließungsnummer vorgetäuscht wird. Die Strichdicke steuert
 * zugleich die Lage der Striche; sie steht deshalb als Zahl (Ausnahme nach D-010).
 */
function striche(
  cx: number,
  cy: number,
  anzahl: number,
  breite: number,
  abstand: number,
  dicke: number,
  klasse: string,
  verzoegerung?: number,
) {
  const gesamt = anzahl * breite + (anzahl - 1) * abstand;
  const start = cx - gesamt / 2;
  return Array.from({ length: anzahl }, (_, i) => {
    const x1 = start + i * (breite + abstand) + dicke / 2;
    const x2 = x1 + breite - dicke;
    const animiert = verzoegerung !== undefined;
    return (
      <path
        key={i}
        className={animiert ? `sm24-draw ${klasse}` : klasse}
        pathLength={animiert ? 1 : undefined}
        style={animiert ? motionStyle(verzoegerung + i * 0.06, 0.28) : undefined}
        strokeWidth={dicke}
        d={`M${r(x1)} ${r(cy)}H${r(x2)}`}
      />
    );
  });
}

function schluesselkopf(): Fundstelle {
  const kopf =
    'M82 96H124A46 46 0 0 1 170 142V178A46 46 0 0 1 124 224H82A46 46 0 0 1 36 178V142A46 46 0 0 1 82 96Z' +
    'M87 160A13 13 0 1 0 61 160A13 13 0 1 0 87 160Z';
  const bart = `M162 138H198V146${BART_KANTE}L278 146L294 158V176L288 182H198V188H162Z`;
  return {
    objekt: (
      <>
        <path className="fill-surface stroke-foreground" strokeWidth={KONTUR} d={bart} />
        <path className="stroke-foreground-muted" strokeWidth={HILFSLINIE} d="M204 170H286" />
        {/* Kopf auf Papier mit Konturlinie, wie der Bart; die Fundstelle trägt eine
            statische Fläche unter den Strichen, damit diese lesbar bleiben (E6-BEFUND2-H05). */}
        <path
          className="fill-surface stroke-foreground"
          strokeWidth={KONTUR}
          fillRule="evenodd"
          d={kopf}
        />
        <circle className="fill-area-soft" cx={128} cy={160} r={30} />
        {striche(128, 160, 5, 7, 3, AKZENT, 'stroke-foreground-muted')}
      </>
    ),
    marke: { x: 128, y: 160, r: 30 },
    lupe: { x: 372, y: 102, r: 64 },
    lupenGrund: 'fill-area-soft',
    lupenInhalt: (v) => striche(0, 0, 5, 16, 6, 6, 'stroke-foreground-muted', v),
    hinweis: { pfad: 'M128 190V238', x: 128, y: 256 },
  };
}

function sicherungskarte(): Fundstelle {
  const kopfband = 'M48 66H240A12 12 0 0 1 252 78V98H36V78A12 12 0 0 1 48 66Z';
  const feld = { x: 150, y: 156, w: 84, h: 30 };
  return {
    objekt: (
      <>
        <rect
          className="fill-surface stroke-foreground"
          strokeWidth={KONTUR}
          x={36}
          y={66}
          width={216}
          height={136}
          rx={12}
        />
        <path className="fill-area-muted" d={kopfband} />
        <path className="stroke-foreground" strokeWidth={KONTUR} d="M36 98H252" />
        <rect
          className="stroke-foreground"
          strokeWidth={KONTUR}
          x={36}
          y={66}
          width={216}
          height={136}
          rx={12}
        />
        <g className="stroke-area-strong" strokeWidth={LINIE_STARK}>
          <circle cx={58} cy={82} r={5} />
          <path d="M63 82H75M70.5 82v4M74 82v4" />
        </g>
        <path className="stroke-foreground-muted" strokeWidth={MARKE} d="M88 82H158" />
        <path className="stroke-border-strong" strokeWidth={MARKE} d="M56 120H176M56 136H140M56 170H120" />
        <rect
          className="fill-area-soft stroke-area-strong"
          strokeWidth={LINIE}
          x={feld.x}
          y={feld.y}
          width={feld.w}
          height={feld.h}
          rx={6}
        />
        {striche(feld.x + feld.w / 2, feld.y + feld.h / 2, 5, 11, 3, 3.5, 'stroke-foreground-muted')}
      </>
    ),
    marke: { x: feld.x + feld.w / 2, y: feld.y + feld.h / 2, r: 50 },
    lupe: { x: 372, y: 102, r: 64 },
    lupenGrund: 'fill-surface',
    lupenInhalt: (v) => (
      <>
        <rect
          className="fill-area-soft stroke-area-strong"
          strokeWidth={LINIE}
          x={-52}
          y={-19}
          width={104}
          height={38}
          rx={8}
        />
        {striche(0, 0, 5, 14, 4, 5, 'stroke-foreground-muted', v)}
      </>
    ),
  };
}

function zylinderstirn(): Fundstelle {
  const cx = 150;
  const cy = 94;
  const radius = 46;
  const steg = 27;
  const unten = 226;
  const ecke = 7;
  const anschluss = r(cy + Math.sqrt(radius * radius - steg * steg));
  const gehaeuse = [
    `M${cx - steg} ${anschluss}A${radius} ${radius} 0 1 1 ${cx + steg} ${anschluss}`,
    `V${unten - ecke}A${ecke} ${ecke} 0 0 1 ${cx + steg - ecke} ${unten}`,
    `H${cx - steg + ecke}A${ecke} ${ecke} 0 0 1 ${cx - steg} ${unten - ecke}Z`,
  ].join('');
  const kanal = [
    [-3, -26],
    [3, -26],
    [3, -15],
    [6, -8],
    [1, -1],
    [5, 7],
    [2, 15],
    [2, 26],
    [-4, 26],
    [-4, 17],
    [-1, 9],
    [-5, 1],
    [-1, -7],
    [-4, -14],
  ]
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${cx + x} ${cy + y}`)
    .join('');
  const stempelY = r((anschluss + unten) / 2 + 6);
  /* Vergrößerung in der Lupe: Stegkanten bleiben sichtbar innerhalb des Glases. */
  const zoom = 1.65;
  const kanteX = r(steg * zoom);
  return {
    objekt: (
      <>
        <path className="fill-surface stroke-foreground" strokeWidth={KONTUR} d={gehaeuse} />
        <circle
          className="stroke-foreground-muted"
          strokeWidth={HILFSLINIE}
          cx={cx}
          cy={cy}
          r={38.5}
        />
        <circle
          className="fill-area-muted stroke-foreground"
          strokeWidth={LINIE}
          cx={cx}
          cy={cy}
          r={33}
        />
        <path className="fill-foreground-muted" d={`${kanal}Z`} />
        {striche(cx, stempelY, 4, 7, 3, AKZENT, 'stroke-foreground-muted')}
      </>
    ),
    marke: { x: cx, y: stempelY, r: 26 },
    lupe: { x: 360, y: 108, r: 66 },
    lupenGrund: 'fill-surface',
    lupenInhalt: (v) => (
      <>
        <path
          className="stroke-foreground"
          strokeWidth={KONTUR}
          d={`M${-kanteX} -40V40M${kanteX} -40V40`}
        />
        {striche(0, 0, 4, 12, 5, 5, 'stroke-foreground-muted', v)}
      </>
    ),
  };
}

function fundstelle(ort: Ort): Fundstelle {
  if (ort === 'sicherungskarte') return sicherungskarte();
  if (ort === 'zylinderstirn') return zylinderstirn();
  return schluesselkopf();
}

const TITEL: Record<Ort, string> = {
  schluesselkopf: 'Schlüsselnummer auf dem Schlüsselkopf',
  sicherungskarte: 'Schlüsselnummer auf der Sicherungskarte',
  zylinderstirn: 'Schlüsselnummer auf der Stirnseite des Zylinders',
};

/**
 * Ausschnitt für Telefonbreiten (`ImagePlaceholder` bzw. `.sm24-ausschnitt`): Kopf,
 * Lupe mit Ring, Griffende und die Beschriftung „Am Schlüsselkopf“ bleiben im Fenster.
 * Im Ausschnitt setzt globals.css die Beschriftung auf 16 Einheiten (`data-legende`).
 */
export const CODE_FUNDSTELLE_AUSSCHNITT = {
  x: 20,
  y: 24,
  breite: 440,
  hoehe: 238,
  vollBreite: BREITE,
  vollHoehe: HOEHE,
} as const;

/** Beschriftung nur bei `true` oder den Texten „true“, „ja“, „1“ (getrimmt, ohne Groß/Klein). */
function beschriftungAn(value: unknown): boolean {
  if (value === true) return true;
  return typeof value === 'string' && ['true', 'ja', '1'].includes(value.trim().toLowerCase());
}

/**
 * Zeigt, wo die Schlüsselnummer steht: Fundstelle eingekreist, daneben eine
 * Lupe mit vergrößertem Ausschnitt. Die Nummer erscheint nur als neutrale
 * Platzhalter-Striche.
 *
 * Die Bewegung folgt B-22 und endet vor 1,6 s: erst der Fundkreis, dann die Linien
 * zur Lupe, dann die Lupe mit ihren Strichen.
 *
 * params:
 * - `ort`: `schluesselkopf` (Standard) | `sicherungskarte` | `zylinderstirn`
 * - `beschriftung`: Standard aus (umgekehrt zu `profilschnitt`). Nur bei `true`
 *   oder „true“, „ja“, „1“ erscheint am Schlüsselkopf die Hinweislinie mit „Am Schlüsselkopf“.
 */
export function CodeFundstelleGrafik({ params, title, className }: VisualProps) {
  const p = parameter(params);
  const ort = auswahl(wert(p, 'ort'), ORTE, 'schluesselkopf');
  const beschriftet = beschriftungAn(wert(p, 'beschriftung'));
  const f = fundstelle(ort);
  const { marke, lupe } = f;
  const tangenten = aussenTangenten(marke, lupe);
  const griffWinkel = (48 * Math.PI) / 180;
  const griff = {
    x1: r(lupe.x + (lupe.r + 3) * Math.cos(griffWinkel)),
    y1: r(lupe.y + (lupe.r + 3) * Math.sin(griffWinkel)),
    x2: r(lupe.x + (lupe.r + 50) * Math.cos(griffWinkel)),
    y2: r(lupe.y + (lupe.r + 50) * Math.sin(griffWinkel)),
  };
  const griffPfad = `M${griff.x1} ${griff.y1}L${griff.x2} ${griff.y2}`;

  return (
    <GrafikRahmen
      breite={BREITE}
      hoehe={HOEHE}
      title={titel(title, TITEL[ort])}
      className={className}
    >
      <Raster breite={BREITE} hoehe={HOEHE} />

      {/* Verbindung Fundstelle → Lupe (äußere Tangenten, wie ein Detailausschnitt). Unter dem
          Gegenstand gezeichnet: Seine Fläche deckt die Linien, sie laufen nie über Halm oder Bart. */}
      {tangenten.map(([x1, y1, x2, y2], i) => (
        <path
          key={i}
          className="sm24-draw stroke-area"
          pathLength={1}
          style={motionStyle(0.3 + i * 0.05, 0.28)}
          strokeWidth={HILFSLINIE}
          d={`M${x1} ${y1}L${x2} ${y2}`}
        />
      ))}

      {/* Der Gegenstand ist Inhalt und steht sofort. Bewegt wird in dieser Reihenfolge: Fundkreis
          (0 bis 0,4 s), Linien zur Lupe (0,3 bis 0,63 s), Lupe mit Strichen (0,6 bis 1,37 s).
          Gesamt unter 1,6 s (B-22, Sichtabnahme E6-BEFUND2-H05). */}
      <g>{f.objekt}</g>

      <circle
        className="sm24-pop stroke-area-strong"
        style={motionStyle(0, 0.4)}
        strokeWidth={LINIE_STARK}
        strokeDasharray="5 5"
        cx={marke.x}
        cy={marke.y}
        r={marke.r}
      />

      {beschriftet && f.hinweis && (
        <>
          <path className="stroke-foreground-muted" strokeWidth={HILFSLINIE} d={f.hinweis.pfad} />
          <text
            className="fill-foreground-muted font-mono"
            data-legende
            fontSize={SCHRIFT}
            textAnchor="middle"
            x={f.hinweis.x}
            y={f.hinweis.y}
          >
            Am Schlüsselkopf
          </text>
        </>
      )}

      {/* Griff und Lupe als Doppelstrich-Halo: breite Striche sind hier Flächen, keine Linien (D-010) */}
      <g className="sm24-pop" style={motionStyle(0.6, 0.4)}>
        <path className="stroke-foreground" strokeWidth={13} d={griffPfad} />
        <path className="stroke-area" strokeWidth={8} d={griffPfad} />
        <circle className={f.lupenGrund} cx={lupe.x} cy={lupe.y} r={lupe.r} />
        <g transform={`translate(${lupe.x} ${lupe.y})`}>{f.lupenInhalt(0.85)}</g>
        <circle className="stroke-foreground" strokeWidth={9} cx={lupe.x} cy={lupe.y} r={lupe.r} />
        <circle className="stroke-area" strokeWidth={4.5} cx={lupe.x} cy={lupe.y} r={lupe.r} />
      </g>
    </GrafikRahmen>
  );
}
