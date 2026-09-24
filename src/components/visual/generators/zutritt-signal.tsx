import type { ReactNode } from 'react';

import type { VisualProps } from '../registry';
import { motionStyle } from '../motion/motion-style';
import {
  GrafikRahmen,
  HILFSLINIE,
  KONTUR,
  LINIE,
  Raster,
  auswahl,
  parameter,
  pfeilspitze,
  r,
  titel,
  wert,
} from './grafik-basis';

const BREITE = 480;
const HOEHE = 270;

const MEDIEN = ['transponder', 'karte', 'smartphone'] as const;
type Medium = (typeof MEDIEN)[number];

/** Höhe, auf der Medium, Funk und Leser liegen. */
const ACHSE = 124;
/** Waagerechte Mitte des Mediums. */
const MEDIUM_X = 102;

/* Tür mit Zarge, Blatt und elektronischem Beschlag (Schloss links, Bänder rechts). */
const ZARGE = { x: 304, y: 28, w: 132, h: 212 };
const BLATT = { x: 314, y: 38, w: 112, h: 202 };
const BODEN = ZARGE.y + ZARGE.h;
const SCHILD = { x: 322, y: 98, w: 26, h: 100 };
const LESER = { x: SCHILD.x + SCHILD.w / 2, y: ACHSE };
const ROSETTE = { x: LESER.x, y: 166 };
/** Statusanzeige sitzt wie ein Hinweispunkt an der oberen Ecke des Beschlags. */
const STATUS = { x: SCHILD.x + SCHILD.w + 3, y: SCHILD.y + 1, r: 12 };
/** Füllung des Türblatts beginnt rechts neben der Statusanzeige. */
const FUELLUNG = { x: 368, y: BLATT.y + 18, w: 44, h: BLATT.h - 36 };

/** Funkbögen: Radius und halber Öffnungswinkel (Grad). */
const BOEGEN = [
  { radius: 16, winkel: 36 },
  { radius: 31, winkel: 31 },
  { radius: 46, winkel: 27 },
];

interface Darstellung {
  form: ReactNode;
  /** Rechte Kante des Mediums — dort beginnen die Funkbögen. */
  rechts: number;
}

/** Schlüsselanhänger mit Spule; die Spule liegt auf der Signalachse. */
function transponder(): Darstellung {
  const cx = MEDIUM_X;
  const oben = ACHSE - 58;
  const loch = { y: oben + 14, r: 6 };
  const ring = 15;
  const koerper =
    `M${cx} ${oben}C${cx + 26} ${oben} ${cx + 38} ${ACHSE - 30} ${cx + 38} ${ACHSE - 2}` +
    `A38 38 0 0 1 ${cx - 38} ${ACHSE - 2}C${cx - 38} ${ACHSE - 30} ${cx - 26} ${oben} ${cx} ${oben}Z` +
    `M${cx + loch.r} ${loch.y}A${loch.r} ${loch.r} 0 1 0 ${cx - loch.r} ${loch.y}A${loch.r} ${loch.r} 0 1 0 ${cx + loch.r} ${loch.y}Z`;
  return {
    form: (
      <>
        {/* Schlüsselring endet knapp über dem Loch hinter dem Anhänger — im Loch
            gezeigt, läse er sich klein wie ein Minuszeichen. */}
        <circle
          className="stroke-foreground-muted"
          strokeWidth={LINIE + 0.5}
          cx={cx}
          cy={loch.y - loch.r - 2 - ring}
          r={ring}
        />
        <path
          className="fill-area-muted stroke-foreground"
          strokeWidth={KONTUR}
          fillRule="evenodd"
          d={koerper}
        />
        <g className="stroke-area-strong" strokeWidth={LINIE}>
          <circle cx={cx} cy={ACHSE} r={17} />
          <circle cx={cx} cy={ACHSE} r={11} />
        </g>
        <circle className="fill-area" cx={cx} cy={ACHSE} r={4} />
      </>
    ),
    rechts: cx + 38,
  };
}

/** Karte mit Chip, ohne Aufdruck (keine Marke, keine Nummer). */
function karte(): Darstellung {
  const x = MEDIUM_X - 58;
  const y = ACHSE - 37;
  return {
    form: (
      <>
        <rect
          className="fill-surface stroke-foreground"
          strokeWidth={KONTUR}
          x={x}
          y={y}
          width={116}
          height={74}
          rx={9}
        />
        <rect
          className="stroke-area-muted"
          strokeWidth={HILFSLINIE}
          x={x + 8}
          y={y + 8}
          width={100}
          height={58}
          rx={5}
        />
        <rect
          className="fill-area-muted stroke-area-strong"
          strokeWidth={LINIE}
          x={x + 16}
          y={y + 22}
          width={24}
          height={18}
          rx={3.5}
        />
        <path
          className="stroke-area-strong"
          strokeWidth={HILFSLINIE}
          d={`M${x + 16} ${y + 31}H${x + 40}M${x + 28} ${y + 22}V${y + 40}`}
        />
        <path
          className="stroke-border-strong"
          strokeWidth={4}
          d={`M${x + 18} ${y + 56}H${x + 70}M${x + 56} ${y + 30}H${x + 96}`}
        />
      </>
    ),
    rechts: x + 116,
  };
}

/** Smartphone mit Schlüsselsymbol auf dem Bildschirm (keine App-Oberfläche). */
function smartphone(): Darstellung {
  const x = MEDIUM_X - 33;
  const y = ACHSE - 62;
  return {
    form: (
      <>
        <rect
          className="fill-surface stroke-foreground"
          strokeWidth={KONTUR}
          x={x}
          y={y}
          width={66}
          height={124}
          rx={13}
        />
        <rect className="fill-area-soft" x={x + 6} y={y + 14} width={54} height={98} rx={6} />
        <path
          className="stroke-foreground-muted"
          strokeWidth={LINIE + 0.5}
          d={`M${x + 27} ${y + 7.5}H${x + 39}`}
        />
        <g className="stroke-area-strong" strokeWidth={LINIE + 0.5}>
          <circle cx={MEDIUM_X - 7} cy={ACHSE - 8} r={7} />
          <path
            d={`M${MEDIUM_X} ${ACHSE - 8}H${MEDIUM_X + 15}M${MEDIUM_X + 10} ${ACHSE - 8}v5M${MEDIUM_X + 15} ${ACHSE - 8}v5`}
          />
        </g>
        <path
          className="stroke-border-strong"
          strokeWidth={4}
          d={`M${x + 16} ${ACHSE + 18}H${x + 50}M${x + 22} ${ACHSE + 30}H${x + 44}`}
        />
      </>
    ),
    rechts: x + 66,
  };
}

function darstellung(medium: Medium): Darstellung {
  if (medium === 'karte') return karte();
  if (medium === 'smartphone') return smartphone();
  return transponder();
}

/** Kreisbogen um `(cx, cy)`, nach rechts geöffnet, `±winkel` Grad um die Waagerechte. */
function bogen(cx: number, cy: number, radius: number, winkel: number): string {
  const a = (winkel * Math.PI) / 180;
  const x = r(cx + radius * Math.cos(a));
  return `M${x} ${r(cy - radius * Math.sin(a))}A${radius} ${radius} 0 0 1 ${x} ${r(cy + radius * Math.sin(a))}`;
}

const TITEL: Record<Medium, string> = {
  transponder: 'Transponder öffnet eine Tür mit elektronischem Beschlag',
  karte: 'Karte öffnet eine Tür mit elektronischem Beschlag',
  smartphone: 'Smartphone öffnet eine Tür mit elektronischem Beschlag',
};

/**
 * Elektronische Zutrittslösung schematisch: Medium → Funkbögen → Leser im
 * Türbeschlag → Freigabe (Haken).
 *
 * params:
 * - `medium`: `transponder` (Standard) | `karte` | `smartphone`
 */
export function ZutrittSignalGrafik({ params, title, className }: VisualProps) {
  const p = parameter(params);
  const medium = auswahl(wert(p, 'medium'), MEDIEN, 'transponder');
  const { form, rechts } = darstellung(medium);

  const bogenMitte = rechts + 4;
  const letzterBogen = BOEGEN[BOEGEN.length - 1];
  const flussStart = r(bogenMitte + letzterBogen.radius + 14);
  const flussEnde = ZARGE.x - 10;
  const haken = `M${STATUS.x - 5.5} ${STATUS.y + 0.5}L${STATUS.x - 1.5} ${STATUS.y + 4.5}L${STATUS.x + 5.5} ${STATUS.y - 4}`;
  const druecker = `M${ROSETTE.x} ${ROSETTE.y}H${ROSETTE.x + 48}`;

  return (
    <GrafikRahmen
      breite={BREITE}
      hoehe={HOEHE}
      title={titel(title, TITEL[medium])}
      className={className}
    >
      <Raster breite={BREITE} hoehe={HOEHE} />

      {/* Tür */}
      <g className="sm24-reveal" style={motionStyle(0)}>
        <path
          className="stroke-foreground-muted"
          strokeWidth={HILFSLINIE}
          d={`M${ZARGE.x - 26} ${BODEN}H${ZARGE.x + ZARGE.w + 26}`}
        />
        <rect
          className="fill-area-muted stroke-foreground"
          strokeWidth={KONTUR}
          x={ZARGE.x}
          y={ZARGE.y}
          width={ZARGE.w}
          height={ZARGE.h}
          rx={3}
        />
        <rect
          className="fill-surface stroke-foreground"
          strokeWidth={KONTUR}
          x={BLATT.x}
          y={BLATT.y}
          width={BLATT.w}
          height={BLATT.h}
          rx={2}
        />
        <rect
          className="stroke-border-strong"
          strokeWidth={HILFSLINIE}
          x={FUELLUNG.x}
          y={FUELLUNG.y}
          width={FUELLUNG.w}
          height={FUELLUNG.h}
          rx={4}
        />
        <rect
          className="fill-surface stroke-foreground"
          strokeWidth={KONTUR}
          x={SCHILD.x}
          y={SCHILD.y}
          width={SCHILD.w}
          height={SCHILD.h}
          rx={SCHILD.w / 2}
        />
        {/* Drücker als Doppelstrich: Kontur, darin die helle Fläche */}
        <path className="stroke-foreground" strokeWidth={11} d={druecker} />
        <path className="stroke-surface" strokeWidth={6} d={druecker} />
        <circle
          className="fill-surface stroke-foreground"
          strokeWidth={KONTUR}
          cx={ROSETTE.x}
          cy={ROSETTE.y}
          r={8}
        />
      </g>

      {/* Medium */}
      <g className="sm24-reveal" style={motionStyle(0.15)}>
        {form}
      </g>

      {/* Funk und Richtung zum Leser */}
      <g className="sm24-reveal" style={motionStyle(0.45)}>
        {BOEGEN.map(({ radius, winkel }, i) => (
          <path
            key={radius}
            className="sm24-dash stroke-area"
            style={motionStyle(0, 1.6 + i * 0.2)}
            strokeWidth={LINIE + 0.5}
            d={bogen(bogenMitte, ACHSE, radius, winkel)}
          />
        ))}
        <path
          className="sm24-dash stroke-area-muted"
          style={motionStyle(0, 2)}
          strokeWidth={LINIE + 0.5}
          d={`M${flussStart} ${ACHSE}H${r(flussEnde - 6)}`}
        />
        <path className="fill-area" d={pfeilspitze(flussEnde, ACHSE, 0, 9, 7)} />
      </g>

      {/* Leser im Beschlag */}
      <g className="sm24-pop" style={motionStyle(0.75)}>
        <circle
          className="fill-area-muted stroke-area-strong"
          strokeWidth={LINIE}
          cx={LESER.x}
          cy={LESER.y}
          r={9.5}
        />
        <circle className="fill-area" cx={LESER.x} cy={LESER.y} r={4} />
      </g>

      {/* Freigabe: Punkt mit heller Kante, darin der Haken */}
      <circle
        className="sm24-pop fill-area stroke-surface"
        style={motionStyle(1)}
        strokeWidth={3}
        cx={STATUS.x}
        cy={STATUS.y}
        r={STATUS.r}
      />
      <path
        className="sm24-draw stroke-surface"
        pathLength={1}
        style={motionStyle(1.2, 0.45)}
        strokeWidth={2.5}
        d={haken}
      />
    </GrafikRahmen>
  );
}
