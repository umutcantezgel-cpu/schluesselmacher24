import type { VisualProps } from '../registry';
import { DRAW_DASHARRAY, motionStyle } from '../motion/motion-style';
import {
  GrafikRahmen,
  HILFSLINIE,
  KONTUR,
  LINIE,
  Raster,
  SCHRIFT,
  SCHRIFT_KLEIN,
  auswahl,
  parameter,
  titel,
  wert,
} from './grafik-basis';

const BREITE = 480;
const HOEHE = 300;

/*
 * Bauteile in Nummernfolge: 1–5 von oben nach unten, damit sich die
 * Führungslinien nicht kreuzen. `mx`/`my` ist die Mitte der Marke, sitzt also
 * auf dem Bauteil; `row` ist die Mitte der Legendenzeile.
 */
const BAUTEILE = [
  { key: 'zusatzschloss', name: 'Zusatzschloss', mx: 189, my: 62, row: 62 },
  { key: 'beschlag', name: 'Schutzbeschlag', mx: 201, my: 112, row: 106 },
  { key: 'zylinder', name: 'Schließzylinder', mx: 217, my: 150, row: 150 },
  { key: 'schliessblech', name: 'Schließblech', mx: 226, my: 168, row: 194 },
  { key: 'bandseite', name: 'Bandseite', mx: 55, my: 210, row: 238 },
] as const;

type Bauteil = (typeof BAUTEILE)[number]['key'];

const FOKUS = [
  'alle',
  'zylinder',
  'beschlag',
  'schliessblech',
  'zusatzschloss',
  'bandseite',
] as const;
type Fokus = (typeof FOKUS)[number];

/* Tür von innen: Zarge außen, Blatt darin, Bänder links, Schlossseite rechts. */
const ZARGE = { x: 48, y: 26, w: 184, h: 246 };
const BLATT = { x: 62, y: 40, w: 156, h: 228 };
const BODEN = ZARGE.y + ZARGE.h;
/** Bandmitten links am Blatt; der Bolzen sitzt dazwischen. */
const BAND_Y = [112, 246];
const BAND = { x: 52, w: 14, h: 22 };
const BOLZEN = { x: 40, y: 204, w: 30, h: 12 };

/* Zusatzschloss oberhalb des Beschlags, Riegel in die Zarge. */
const ZUSATZ = { x: 168, y: 48, w: 42, h: 28 };
const RIEGEL = { x: 210, y: 67, w: 20, h: 8 };

/* Schutzbeschlag: Langschild, Drücker oben, Zylinderrosette darunter. */
const SCHILD = { x: 188, y: 84, w: 26, h: 110 };
const DRUECKER_Y = 98;
const ROSETTE = { x: 199, y: 150, r: 10 };
const ZYLINDER = { x: 199, y: 150, r: 6 };

/* Schließblech auf dem Zargenrand, auf Höhe der Falle. */
const SCHLIESSBLECH = { x: 221, y: 154, w: 10, h: 28 };

/* Marken und Legende. */
const MARKE_R = 9;
const KNICK_X = 280;
const LINIE_ENDE = 296;
const LEGENDE_X = 300;
const NAME_X = 320;

/**
 * Ausschnitt für Telefonbreiten (`ImagePlaceholder`, Prop `ausschnitt`): Tür und
 * Legende ohne Rand. Im Ausschnitt setzt globals.css die Legende auf 16 Einheiten
 * (`data-legende`); der Ausschnitt ist dafür bemessen, sie wird so rund 12 px groß.
 */
export const TUER_SCHUTZ_AUSSCHNITT = {
  x: 26,
  y: 20,
  breite: 444,
  hoehe: 258,
  vollBreite: BREITE,
  vollHoehe: HOEHE,
} as const;

const HERVOR = 'fill-area-soft stroke-area-strong';

/** Ein Schalter aus Wahrheitswert oder Text; sonst der Standardwert. */
function schalter(value: unknown, standard: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const kandidat = value.trim().toLowerCase();
    if (['false', 'nein', '0', 'aus'].includes(kandidat)) return false;
    if (['true', 'ja', '1', 'an'].includes(kandidat)) return true;
  }
  return standard;
}

/** Standardtitel: der Gesamttitel oder der Name des hervorgehobenen Bauteils. */
function standardTitel(fokus: Fokus): string {
  const bauteil = BAUTEILE.find((b) => b.key === fokus);
  return bauteil ? `Schutzpunkte einer Tür – ${bauteil.name}` : 'Schutzpunkte einer Tür';
}

/**
 * Innenansicht einer einflügeligen Tür mit Zarge; nummerierte Marken sitzen auf
 * den fünf Stellen an Tür- und Schließtechnik, wahlweise eine davon hervorgehoben.
 *
 * params:
 * - `fokus`: `alle` (Standard) | `zylinder` | `beschlag` | `schliessblech` |
 *   `zusatzschloss` | `bandseite` — hebt ein Bauteil hervor, die übrigen Marken
 *   und Zeilen werden blass
 * - `nummern`: `true` (Standard) | `false` — ohne Marken und Legende, nur Tür und Bauteile
 */
export function TuerSchutzGrafik({ params, title, className }: VisualProps) {
  const p = parameter(params);
  const fokus = auswahl(wert(p, 'fokus'), FOKUS, 'alle');
  const nummern = schalter(wert(p, 'nummern'), true);

  const hervorgehoben = (bauteil: Bauteil) => fokus === bauteil;
  const gedimmt = (bauteil: Bauteil) => fokus !== 'alle' && fokus !== bauteil;
  const klasse = (bauteil: Bauteil, normal: string) => (hervorgehoben(bauteil) ? HERVOR : normal);

  return (
    <GrafikRahmen
      breite={BREITE}
      hoehe={HOEHE}
      title={titel(title, standardTitel(fokus))}
      className={className}
    >
      <Raster breite={BREITE} hoehe={HOEHE} />

      {/* Boden */}
      <path
        className="stroke-foreground-muted"
        strokeWidth={HILFSLINIE}
        d={`M${ZARGE.x - 18} ${BODEN}H${ZARGE.x + ZARGE.w + 18}`}
      />

      {/* Zarge und Blatt */}
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

      {/* Bänder an der Zarge */}
      {BAND_Y.map((y) => (
        <rect
          key={y}
          className="fill-surface stroke-foreground"
          strokeWidth={LINIE}
          x={BAND.x}
          y={y - BAND.h / 2}
          width={BAND.w}
          height={BAND.h}
          rx={2}
        />
      ))}

      {/* Bandseitensicherung: Bolzen zwischen den Bändern */}
      <rect
        className={klasse('bandseite', 'fill-area-muted stroke-foreground')}
        strokeWidth={LINIE}
        x={BOLZEN.x}
        y={BOLZEN.y}
        width={BOLZEN.w}
        height={BOLZEN.h}
        rx={2}
      />

      {/* Zusatzschloss oberhalb des Beschlags: Kasten und Riegel zur Zarge */}
      <rect
        className={klasse('zusatzschloss', 'fill-area-muted stroke-foreground')}
        strokeWidth={KONTUR}
        x={ZUSATZ.x}
        y={ZUSATZ.y}
        width={ZUSATZ.w}
        height={ZUSATZ.h}
        rx={3}
      />
      <rect
        className={klasse('zusatzschloss', 'fill-area-muted stroke-foreground')}
        strokeWidth={LINIE}
        x={RIEGEL.x}
        y={RIEGEL.y}
        width={RIEGEL.w}
        height={RIEGEL.h}
        rx={2}
      />

      {/* Schutzbeschlag: Drücker, Langschild, Rosette und Zylinder */}
      <path
        className={hervorgehoben('beschlag') ? 'stroke-area-strong' : 'stroke-foreground'}
        strokeWidth={KONTUR}
        d={`M${SCHILD.x} ${DRUECKER_Y}H${SCHILD.x - 34}`}
      />
      <rect
        className={klasse('beschlag', 'fill-area-muted stroke-foreground')}
        strokeWidth={KONTUR}
        x={SCHILD.x}
        y={SCHILD.y}
        width={SCHILD.w}
        height={SCHILD.h}
        rx={4}
      />
      <circle
        className={klasse('beschlag', 'fill-surface stroke-foreground')}
        strokeWidth={LINIE}
        cx={ROSETTE.x}
        cy={ROSETTE.y}
        r={ROSETTE.r}
      />
      <circle
        className={klasse('zylinder', 'fill-surface stroke-foreground')}
        strokeWidth={LINIE}
        cx={ZYLINDER.x}
        cy={ZYLINDER.y}
        r={ZYLINDER.r}
      />
      <path
        className="stroke-foreground"
        strokeWidth={LINIE}
        d={`M${ZYLINDER.x} ${ZYLINDER.y - 3.5}V${ZYLINDER.y + 3.5}`}
      />

      {/* Schließblech auf der Zarge */}
      <rect
        className={klasse('schliessblech', 'fill-surface stroke-foreground')}
        strokeWidth={LINIE}
        x={SCHLIESSBLECH.x}
        y={SCHLIESSBLECH.y}
        width={SCHLIESSBLECH.w}
        height={SCHLIESSBLECH.h}
      />

      {nummern && (
        <>
          {/* Führungslinien: waagerecht, ein Knick, dann waagerecht zur Legendenzeile */}
          {BAUTEILE.map((b, i) => (
            <path
              key={b.key}
              className={gedimmt(b.key) ? 'sm24-draw stroke-area opacity-30' : 'sm24-draw stroke-area'}
              pathLength={1}
              style={motionStyle(0.3 + i * 0.12, 0.8, { strokeDasharray: DRAW_DASHARRAY })}
              strokeWidth={LINIE}
              d={`M${b.mx + MARKE_R} ${b.my}H${KNICK_X}L${KNICK_X + 8} ${b.row}H${LINIE_ENDE}`}
            />
          ))}

          {/* Legende: Ziffer in Mono, Name in Mono, ohne Kreis */}
          {BAUTEILE.map((b, i) => (
            <g key={b.key} className={gedimmt(b.key) ? 'opacity-30' : undefined}>
              {/* Papierfarbener Rand um die Schrift: Rasterlinien laufen nicht durch die Legende.
                  Fläche aus breitem Strich, daher Zahl statt Strichstufe (D-010). */}
              <text
                className="fill-area-strong stroke-surface font-mono"
                data-legende
                fontSize={SCHRIFT}
                fontWeight={600}
                paintOrder="stroke"
                strokeLinejoin="round"
                strokeWidth={4}
                x={LEGENDE_X}
                y={b.row + 4.5}
              >
                {i + 1}
              </text>
              <text
                className="fill-foreground-muted stroke-surface font-mono"
                data-legende
                fontSize={SCHRIFT}
                paintOrder="stroke"
                strokeLinejoin="round"
                strokeWidth={4}
                x={NAME_X}
                y={b.row + 4.5}
              >
                {b.name}
              </text>
            </g>
          ))}

          {/* Marken auf den Bauteilen: erscheinen gestaffelt; Abdunklung liegt außen,
              weil sm24-pop die Deckkraft animiert */}
          {BAUTEILE.map((b, i) => (
            <g key={b.key} className={gedimmt(b.key) ? 'opacity-30' : undefined}>
              <g className="sm24-pop" style={motionStyle(0.3 + i * 0.12)}>
                <circle
                  className="fill-area stroke-surface"
                  strokeWidth={LINIE}
                  cx={b.mx}
                  cy={b.my}
                  r={MARKE_R}
                />
                <text
                  className="fill-surface font-mono"
                  fontSize={SCHRIFT_KLEIN}
                  fontWeight={600}
                  textAnchor="middle"
                  x={b.mx}
                  y={b.my + 4}
                >
                  {i + 1}
                </text>
              </g>
            </g>
          ))}
        </>
      )}
    </GrafikRahmen>
  );
}
