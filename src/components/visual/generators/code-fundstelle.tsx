import type { ReactNode } from 'react';

import type { VisualProps } from '../registry';
import { motionStyle } from '../motion/motion-style';
import {
  GrafikRahmen,
  HILFSLINIE,
  KONTUR,
  LINIE,
  Raster,
  aussenTangenten,
  auswahl,
  parameter,
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
}

/**
 * Neutrale Platzhalter-Striche statt einer Nummer — bewusst keine Ziffern,
 * damit keine echte Schließungsnummer vorgetäuscht wird.
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
        style={animiert ? motionStyle(verzoegerung + i * 0.08, 0.35) : undefined}
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
  const bart =
    'M162 138H198V146L206 146L212 156L218 146L230 146L236 158L242 146L256 146L262 154L268 146H278L294 158V176L288 182H198V188H162Z';
  return {
    objekt: (
      <>
        <path className="fill-surface stroke-foreground" strokeWidth={KONTUR} d={bart} />
        <path className="stroke-foreground-muted" strokeWidth={HILFSLINIE} d="M204 170H286" />
        <path
          className="fill-area-muted stroke-foreground"
          strokeWidth={KONTUR}
          fillRule="evenodd"
          d={kopf}
        />
        {striche(128, 160, 5, 7, 3, 3, 'stroke-foreground-muted')}
      </>
    ),
    marke: { x: 128, y: 160, r: 30 },
    lupe: { x: 372, y: 102, r: 64 },
    lupenGrund: 'fill-area-muted',
    lupenInhalt: (v) => striche(0, 0, 5, 16, 6, 6, 'stroke-foreground-muted', v),
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
        <g className="stroke-area-strong" strokeWidth={LINIE + 0.25}>
          <circle cx={58} cy={82} r={5} />
          <path d="M63 82H75M70.5 82v4M74 82v4" />
        </g>
        <path className="stroke-foreground-muted" strokeWidth={4} d="M88 82H158" />
        <path className="stroke-border-strong" strokeWidth={4} d="M56 120H176M56 136H140M56 170H120" />
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
        {striche(cx, stempelY, 4, 7, 3, 3, 'stroke-foreground-muted')}
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
 * Zeigt, wo die Schlüsselnummer steht: Fundstelle eingekreist, daneben eine
 * Lupe mit vergrößertem Ausschnitt. Die Nummer erscheint nur als neutrale
 * Platzhalter-Striche.
 *
 * params:
 * - `ort`: `schluesselkopf` (Standard) | `sicherungskarte` | `zylinderstirn`
 */
export function CodeFundstelleGrafik({ params, title, className }: VisualProps) {
  const p = parameter(params);
  const ort = auswahl(wert(p, 'ort'), ORTE, 'schluesselkopf');
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

      <g className="sm24-reveal" style={motionStyle(0)}>
        {f.objekt}
      </g>

      {/* Verbindung Fundstelle → Lupe (äußere Tangenten, wie ein Detailausschnitt) */}
      {tangenten.map(([x1, y1, x2, y2], i) => (
        <path
          key={i}
          className="sm24-draw stroke-area"
          pathLength={1}
          style={motionStyle(0.7 + i * 0.1, 0.6)}
          strokeWidth={HILFSLINIE}
          d={`M${x1} ${y1}L${x2} ${y2}`}
        />
      ))}

      <circle
        className="sm24-pop stroke-area-strong"
        style={motionStyle(0.5)}
        strokeWidth={LINIE + 0.5}
        strokeDasharray="5 5"
        cx={marke.x}
        cy={marke.y}
        r={marke.r}
      />

      <g className="sm24-pop" style={motionStyle(0.95)}>
        <path className="stroke-foreground" strokeWidth={13} d={griffPfad} />
        <path className="stroke-area" strokeWidth={8} d={griffPfad} />
        <circle className={f.lupenGrund} cx={lupe.x} cy={lupe.y} r={lupe.r} />
        <g transform={`translate(${lupe.x} ${lupe.y})`}>{f.lupenInhalt(1.25)}</g>
        <circle className="stroke-foreground" strokeWidth={9} cx={lupe.x} cy={lupe.y} r={lupe.r} />
        <circle className="stroke-area" strokeWidth={4.5} cx={lupe.x} cy={lupe.y} r={lupe.r} />
      </g>
    </GrafikRahmen>
  );
}
