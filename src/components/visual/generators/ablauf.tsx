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

/** Zwei bis vier Schritte, je höchstens 14 Zeichen. Sonst: drei Stationen ohne Beschriftung. */
const MIN_SCHRITTE = 2;
const MAX_SCHRITTE = 4;
const MAX_ZEICHEN = 14;
const STANDARD_ANZAHL = 3;

/** Breite eines Zeichens der Monoschrift je Schriftgröße (0,6 em). */
const ZEICHEN_EM = 0.6;
/** Mindestabstand zwischen zwei Beschriftungen in einer Zeile. */
const LUECKE = 8;
/** Radius des Nummernkreises (beide Formate). */
const KREIS = 22;
/** Pfeilspitzen in Laufrichtung: auf Telefonen gut 8 px lang (Abnahme E4-GRAFIKER-10). */
const PFEIL_LAENGE = 12;
const PFEIL_BREITE = 9;
/** Strichmuster der Hilfslinien. */
const GESTRICHELT = '4 3';

/**
 * Maße je Format. Telefonbreite: Schriftgröße × 358 / Flächenbreite ≥ 11,5.
 * „schmal“ steht senkrecht; seine Höhe folgt der Anzahl der Stationen (`ablaufHoehe`).
 */
export const ABLAUF_FLAECHE = {
  breit: { breite: 480, hoehe: 270, schrift: 16, rand: 20 },
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
 * Leere Einträge entfallen. Liegt die Anzahl außerhalb von 2–4 oder ist ein Eintrag zu
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
  schrift: number;
}

/** Nummernkreis in der Bereichsfarbe mit Nummer; die Akzentstation ist zusätzlich hinterlegt. */
function Station({ x, cy, index, aktiv, schrift }: StationProps) {
  return (
    <g className="sm24-pop" style={motionStyle(verzoegerung(index), EINBLENDUNG)}>
      <circle
        className={aktiv ? 'fill-area-soft stroke-area-strong' : 'fill-surface stroke-area'}
        strokeWidth={KONTUR}
        cx={x}
        cy={cy}
        r={KREIS}
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
  /** Akzentstation (1–4), 0 für keine. */
  aktiv: number;
  title: string;
  className?: string;
}

/**
 * Breit (480 × 270): Bemaßungslinie waagerecht, Stationen darüber mit gestrichelter
 * Hilfslinie, Beschriftung darunter. Passen die Beschriftungen nicht nebeneinander,
 * stehen die geraden Stationen tiefer in einer zweiten Reihe.
 */
function BreitGrafik({ anzahl, beschriftungen, aktiv, title, className }: ZeichnungProps) {
  const f = ABLAUF_FLAECHE.breit;
  const mitBeschriftung = beschriftungen.length > 0;
  const breiten = beschriftungen.map((t) => textBreite(t, f.schrift));
  const wMax = Math.max(0, ...breiten);
  const rand = Math.max(KREIS + 24, wMax / 2 + LUECKE);
  const abstand = (f.breite - 2 * rand) / (anzahl - 1);
  const xs = Array.from({ length: anzahl }, (_, i) => r(rand + i * abstand));
  const versetzt = breiten.some((b, i) => i > 0 && abstand < (breiten[i - 1] + b) / 2 + LUECKE);
  /* Inhaltshöhe unter der Linie: Beschriftung eine Zeile bzw. zwei Zeilen; vertikal mittig. */
  const unten = !mitBeschriftung ? 8 : versetzt ? 56 : 32;
  const LY = r((f.hoehe - (70 + unten)) / 2 + 70);
  const cy = LY - 26 - KREIS;
  const x0 = f.rand;
  const x1 = f.breite - f.rand;

  return (
    <GrafikRahmen breite={f.breite} hoehe={f.hoehe} title={title} className={className}>
      <Raster breite={f.breite} hoehe={f.hoehe} />

      <path
        className="sm24-draw stroke-border-strong"
        pathLength={1}
        style={motionStyle(0, LINIE_DAUER, { strokeDasharray: DRAW_DASHARRAY })}
        strokeWidth={LINIE}
        d={`M${x0} ${LY - 6}V${LY + 6}M${x0} ${LY}H${x1}M${x1} ${LY - 6}V${LY + 6}`}
      />

      {xs.slice(0, -1).map((x, i) => (
        <path
          key={`pfeil-${i}`}
          className="sm24-fade fill-area"
          style={motionStyle(verzoegerung(i + 1), EINBLENDUNG)}
          d={pfeilspitze(r((x + xs[i + 1]) / 2), LY, 0, PFEIL_LAENGE, PFEIL_BREITE)}
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
              d={`M${x} ${LY}V${cy + KREIS}`}
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
              schrift={f.schrift}
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
 */
function SchmalGrafik({ anzahl, beschriftungen, aktiv, title, className }: ZeichnungProps) {
  const f = ABLAUF_FLAECHE.schmal;
  const hoehe = ablaufHoehe(anzahl);
  const lx = f.rand;
  const kreisX = lx + 24 + KREIS;
  const textX = kreisX + KREIS + 10;
  const cyOf = (i: number) => f.kopf / 2 + i * f.zeile;
  const yOben = cyOf(0) - 28;
  const yUnten = cyOf(anzahl - 1) + 28;

  return (
    <GrafikRahmen breite={f.breite} hoehe={hoehe} title={title} className={className}>
      <Raster breite={f.breite} hoehe={hoehe} />

      <path
        className="sm24-draw stroke-border-strong"
        pathLength={1}
        style={motionStyle(0, LINIE_DAUER, { strokeDasharray: DRAW_DASHARRAY })}
        strokeWidth={LINIE}
        d={`M${lx - 6} ${yOben}H${lx + 6}M${lx} ${yOben}V${yUnten}M${lx - 6} ${yUnten}H${lx + 6}`}
      />

      {Array.from({ length: anzahl - 1 }, (_, i) => (
        <path
          key={`pfeil-${i}`}
          className="sm24-fade fill-area"
          style={motionStyle(verzoegerung(i + 1), EINBLENDUNG)}
          d={pfeilspitze(lx, r((cyOf(i) + cyOf(i + 1)) / 2), 90, PFEIL_LAENGE, PFEIL_BREITE)}
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
              d={`M${lx} ${cy}H${kreisX - KREIS}`}
            />
            <Station x={kreisX} cy={cy} index={i} aktiv={aktiv === i + 1} schrift={f.schrift} />
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
 * Ablaufgrafik: zwei bis vier nummerierte Stationen auf einer Bemaßungslinie, je mit
 * kurzer Mono-Beschriftung. Zeigt nur die übergebenen Wörter und Nummern.
 *
 * params:
 * - `schritte`: Text, Schritte durch `|` getrennt (2–4 Einträge, je höchstens 14 Zeichen);
 *   ohne gültige Angabe drei Stationen nur mit Nummern
 * - `aktiv`: 0 (keine, Standard) oder 1–4 – diese Station wird hervorgehoben
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
