import type { VisualProps } from '../registry';
import { DRAW_DASHARRAY, motionStyle } from '../motion/motion-style';
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
  zahl,
} from './grafik-basis';

const FORMATE = ['breit', 'schmal'] as const;
type Format = (typeof FORMATE)[number];

/** Zwei bis fünf Schritte, je höchstens 14 Zeichen. Sonst: drei Stationen ohne Beschriftung. */
const MIN_SCHRITTE = 2;
const MAX_SCHRITTE = 5;
const MAX_ZEICHEN = 14;
const STANDARD_ANZAHL = 3;

/** Breite eines Zeichens der Monoschrift je Schriftgröße (0,6 em). */
const ZEICHEN_EM = 0.6;
/** Mindestabstand zwischen zwei Beschriftungen in einer Zeile. */
const LUECKE = 8;
/** Radius des Nummernkreises: breit zwei Rasterfelder Durchmesser, schmal 22. */
const KREIS_BREIT = 30;
const KREIS_SCHMAL = 22;
/** Rasterfeld der Zeichnung (Raster 30): Polster am Rand und Halbmaß der Hilfslinien. */
const RASTERFELD = 30;
/** Hilfslinienstrecke von der Kreisunterkante zur Bemaßungslinie (breit). */
const HILFSSTRECKE = 48;
/** Pfeilspitzen in Laufrichtung: auf Telefonen gut 8 px lang (Abnahme E4-GRAFIKER-10). */
const PFEIL_LAENGE = 12;
const PFEIL_BREITE = 9;
/** Strichmuster der Hilfslinien. */
const GESTRICHELT = '4 3';

/**
 * Maße je Format. Telefonbreite: Schriftgröße × 358 / Flächenbreite ≥ 11,5.
 * Breit: `nummer` ist die Nummernschrift im Kreis, `schrift` die Beschriftung.
 * „schmal“ steht senkrecht; seine Höhe folgt der Anzahl der Stationen (`ablaufHoehe`).
 */
export const ABLAUF_FLAECHE = {
  breit: { breite: 480, hoehe: 270, schrift: 16, nummer: 18 },
  schmal: { breite: 300, schrift: 12, rand: 20, kopf: 88, zeile: 68 },
} as const;

/* Bewegung (B-23): erst die Bemaßungslinie, dann Station für Station; Gesamtdauer unter 1,6 s. */
const LINIE_DAUER = 0.6;
const STAFFEL = 0.12;
const EINBLENDUNG = 0.4;

function verzoegerung(station: number): number {
  return LINIE_DAUER + station * STAFFEL;
}

/**
 * Bereinigte Liste der Schritte aus `schritte` („sichern|prüfen|bestellen“).
 * Leere Einträge entfallen. Liegt die Anzahl außerhalb von 2–5 oder ist ein Eintrag zu
 * lang, gilt der Standard: eine leere Liste (drei Stationen ohne Beschriftung).
 */
export function ablaufSchritte(params: unknown): string[] {
  const roh = wert(parameter(params), 'schritte');
  if (typeof roh !== 'string') return [];
  const schritte = roh
    .split('|')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  if (schritte.length < MIN_SCHRITTE || schritte.length > MAX_SCHRITTE) return [];
  if (schritte.some((t) => [...t].length > MAX_ZEICHEN)) return [];
  return schritte;
}

/** Höhe der schmalen Fassung je Anzahl der Stationen. */
export function ablaufHoehe(anzahl: number): number {
  const s = ABLAUF_FLAECHE.schmal;
  return s.kopf + (anzahl - 1) * s.zeile;
}

function textBreite(text: string, schrift: number): number {
  return [...text].length * schrift * ZEICHEN_EM;
}

function nummer(index: number): string {
  return String(index + 1).padStart(2, '0');
}

interface StationProps {
  x: number;
  cy: number;
  index: number;
  aktiv: boolean;
  radius: number;
  schrift: number;
}

/** Nummernkreis in der Bereichsfarbe mit Nummer; die Akzentstation ist zusätzlich hinterlegt. */
function Station({ x, cy, index, aktiv, radius, schrift }: StationProps) {
  return (
    <g className="sm24-pop" style={motionStyle(verzoegerung(index), EINBLENDUNG)}>
      <circle
        className={aktiv ? 'fill-area-soft stroke-area-strong' : 'fill-surface stroke-area'}
        strokeWidth={KONTUR}
        cx={x}
        cy={cy}
        r={radius}
      />
      <text
        className={aktiv ? 'font-mono fill-area-strong' : 'font-mono fill-foreground'}
        fontSize={schrift}
        fontWeight={600}
        textAnchor="middle"
        x={x}
        y={r(cy + schrift * 0.35)}
      >
        {nummer(index)}
      </text>
    </g>
  );
}

interface ZeichnungProps {
  anzahl: number;
  beschriftungen: string[];
  /** Akzentstation (1–5), 0 für keine. */
  aktiv: number;
  title: string;
  className?: string;
}

/**
 * Breit (480 × 270): Bemaßungslinie waagerecht von der ersten bis zur letzten Station,
 * Stationen darüber mit gestrichelter Hilfslinie, Beschriftung darunter. Passen die
 * Beschriftungen nicht nebeneinander, stehen die geraden Stationen tiefer in einer zweiten Reihe.
 */
function BreitGrafik({ anzahl, beschriftungen, aktiv, title, className }: ZeichnungProps) {
  const f = ABLAUF_FLAECHE.breit;
  const mitBeschriftung = beschriftungen.length > 0;
  const breiten = beschriftungen.map((t) => textBreite(t, f.schrift));
  const wMax = Math.max(0, ...breiten);
  /* Polster: mindestens ein Rasterfeld neben Kreis und Beschriftung. */
  const rand = Math.max(KREIS_BREIT + RASTERFELD, wMax / 2 + RASTERFELD);
  const abstand = (f.breite - 2 * rand) / (anzahl - 1);
  const xs = Array.from({ length: anzahl }, (_, i) => r(rand + i * abstand));
  const versetzt = breiten.some((b, i) => i > 0 && abstand < (breiten[i - 1] + b) / 2 + LUECKE);
  /* Vertikal: oben Kreis (zwei Rasterfelder) und Hilfslinie, unten eine oder zwei Zeilen Beschriftung. */
  const oben = HILFSSTRECKE + 2 * RASTERFELD;
  const unten = !mitBeschriftung ? 8 : versetzt ? 56 : 32;
  const LY = r((f.hoehe - (oben + unten)) / 2 + oben);
  const cy = LY - HILFSSTRECKE - KREIS_BREIT;

  return (
    <GrafikRahmen breite={f.breite} hoehe={f.hoehe} title={title} className={className}>
      <Raster breite={f.breite} hoehe={f.hoehe} />

      <path
        className="sm24-draw stroke-foreground-muted"
        pathLength={1}
        style={motionStyle(0, LINIE_DAUER, { strokeDasharray: DRAW_DASHARRAY })}
        strokeWidth={LINIE}
        d={`M${xs[0]} ${LY - 6}V${LY + 6}M${xs[0]} ${LY}H${xs[anzahl - 1]}`}
      />

      {xs.slice(0, -1).map((_, i) => (
        <path
          key={`pfeil-${i}`}
          className="sm24-fade fill-foreground-muted"
          style={motionStyle(verzoegerung(i + 1), EINBLENDUNG)}
          d={pfeilspitze(xs[i + 1], LY, 0, PFEIL_LAENGE, PFEIL_BREITE)}
        />
      ))}

      {xs.map((x, i) => {
        const tief = versetzt && i % 2 === 1;
        const beschriftungY = LY + 28 + (tief ? 24 : 0);
        return (
          <g key={`station-${i}`}>
            <path
              className="sm24-fade stroke-foreground-muted"
              style={motionStyle(verzoegerung(i), EINBLENDUNG)}
              strokeWidth={HILFSLINIE}
              strokeDasharray={GESTRICHELT}
              d={`M${x} ${LY + 6}V${cy + KREIS_BREIT}`}
            />
            {tief && (
              <path
                className="sm24-fade stroke-foreground-muted"
                style={motionStyle(verzoegerung(i), EINBLENDUNG)}
                strokeWidth={HILFSLINIE}
                strokeDasharray={GESTRICHELT}
                d={`M${x} ${LY + 4}V${LY + 39}`}
              />
            )}
            <Station
              x={x}
              cy={cy}
              index={i}
              aktiv={aktiv === i + 1}
              radius={KREIS_BREIT}
              schrift={f.nummer}
            />
            {i < beschriftungen.length && (
              <text
                className="sm24-fade fill-foreground-muted font-mono"
                style={motionStyle(verzoegerung(i), EINBLENDUNG)}
                fontSize={f.schrift}
                textAnchor="middle"
                x={x}
                y={beschriftungY}
              >
                {beschriftungen[i]}
              </text>
            )}
          </g>
        );
      })}
    </GrafikRahmen>
  );
}

/**
 * Schmal (300 × Höhe nach Anzahl): dieselben Elemente senkrecht. Bemaßungslinie links,
 * Stationen untereinander, Beschriftung rechts neben dem Kreis, Pfeilspitzen nach unten.
 * Der Inhalt steht waagerecht mittig in der Breite.
 */
function SchmalGrafik({ anzahl, beschriftungen, aktiv, title, className }: ZeichnungProps) {
  const f = ABLAUF_FLAECHE.schmal;
  const hoehe = ablaufHoehe(anzahl);
  const wMax = Math.max(0, ...beschriftungen.map((t) => textBreite(t, f.schrift)));
  /* Inhaltsbreite: Anfangsstrich, Kreis, Hilfslinie, Abstand und längste Beschriftung. */
  const inhalt = 6 + 24 + 2 * KREIS_SCHMAL + (wMax > 0 ? 10 + wMax : 0);
  const lx = r(Math.max(f.rand, (f.breite - inhalt) / 2 + 6));
  const kreisX = lx + 24 + KREIS_SCHMAL;
  const textX = kreisX + KREIS_SCHMAL + 10;
  const cyOf = (i: number) => f.kopf / 2 + i * f.zeile;

  return (
    <GrafikRahmen breite={f.breite} hoehe={hoehe} title={title} className={className}>
      <Raster breite={f.breite} hoehe={hoehe} />

      <path
        className="sm24-draw stroke-foreground-muted"
        pathLength={1}
        style={motionStyle(0, LINIE_DAUER, { strokeDasharray: DRAW_DASHARRAY })}
        strokeWidth={LINIE}
        d={`M${lx - 6} ${cyOf(0)}H${lx + 6}M${lx} ${cyOf(0)}V${cyOf(anzahl - 1)}`}
      />

      {Array.from({ length: anzahl - 1 }, (_, i) => (
        <path
          key={`pfeil-${i}`}
          className="sm24-fade fill-foreground-muted"
          style={motionStyle(verzoegerung(i + 1), EINBLENDUNG)}
          d={pfeilspitze(lx, cyOf(i + 1), 90, PFEIL_LAENGE, PFEIL_BREITE)}
        />
      ))}

      {Array.from({ length: anzahl }, (_, i) => {
        const cy = cyOf(i);
        return (
          <g key={`station-${i}`}>
            <path
              className="sm24-fade stroke-foreground-muted"
              style={motionStyle(verzoegerung(i), EINBLENDUNG)}
              strokeWidth={HILFSLINIE}
              strokeDasharray={GESTRICHELT}
              d={`M${lx - 6} ${cy}H${kreisX - KREIS_SCHMAL}`}
            />
            <Station
              x={kreisX}
              cy={cy}
              index={i}
              aktiv={aktiv === i + 1}
              radius={KREIS_SCHMAL}
              schrift={f.schrift}
            />
            {i < beschriftungen.length && (
              <text
                className="sm24-fade fill-foreground-muted font-mono"
                style={motionStyle(verzoegerung(i), EINBLENDUNG)}
                fontSize={f.schrift}
                textAnchor="start"
                x={textX}
                y={r(cy + f.schrift * 0.35)}
              >
                {beschriftungen[i]}
              </text>
            )}
          </g>
        );
      })}
    </GrafikRahmen>
  );
}

/**
 * Ablaufgrafik: zwei bis fünf nummerierte Stationen auf einer Bemaßungslinie, je mit
 * kurzer Mono-Beschriftung. Zeigt nur die übergebenen Wörter und Nummern.
 *
 * params:
 * - `schritte`: Text, Schritte durch `|` getrennt (2–5 Einträge, je höchstens 14 Zeichen);
 *   ohne gültige Angabe drei Stationen nur mit Nummern
 * - `aktiv`: 0 (keine, Standard) oder 1–5 – diese Station wird hervorgehoben
 * - `format`: `breit` (Standard, 480 × 270) | `schmal` (300 breit, für Telefone)
 */
export function AblaufGrafik({ params, title, className }: VisualProps) {
  const p = parameter(params);
  const format: Format = auswahl(wert(p, 'format'), FORMATE, 'breit');
  const beschriftungen = ablaufSchritte(p);
  const anzahl = beschriftungen.length > 0 ? beschriftungen.length : STANDARD_ANZAHL;
  const aktiv = zahl(wert(p, 'aktiv'), 0, MAX_SCHRITTE, 0, true);
  const text = titel(title, 'Ablauf in Schritten');

  if (format === 'schmal') {
    return (
      <SchmalGrafik
        anzahl={anzahl}
        beschriftungen={beschriftungen}
        aktiv={aktiv}
        title={text}
        className={className}
      />
    );
  }
  return (
    <BreitGrafik
      anzahl={anzahl}
      beschriftungen={beschriftungen}
      aktiv={aktiv}
      title={text}
      className={className}
    />
  );
}
