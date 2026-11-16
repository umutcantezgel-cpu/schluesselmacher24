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
/** Breit: höchstens drei Reihen Beschriftung (Station 1 und 4 oben, 2 und 5 darunter, 3 unten). */
const MAX_REIHEN = 3;
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
 * Seitliche Luft zwischen einer tiefen Führungslinie und einer Beschriftung einer höheren Reihe:
 * Wie in einer technischen Zeichnung berührt die Linie die Schrift nicht, sie lässt sichtbar
 * Platz. Liegt sie näher, endet sie über dieser Beschriftung (Z-09).
 */
const LUFT = 10;
/** Lücke zwischen dem Ende einer gekürzten Führungslinie und der Schrift. */
const SCHRIFT_LUECKE = 2;

/**
 * Maße je Format. Breit: `nummer` ist die Nummernschrift im Kreis, `schrift` die Beschriftung,
 * `erste` die Grundlinie der ersten Reihe unter der Bemaßungslinie, `reihe` der Abstand der Reihen.
 * „schmal“ steht senkrecht; seine Höhe folgt der Anzahl der Stationen (`ablaufHoehe`).
 *
 * Schrift auf dem Bildschirm (FA-26-01, FA-QA-04D) = Schrift × Darstellungsbreite / Flächenbreite.
 * Schmal steht unter 640 px in einem Kasten mit `p-4` (Seitenkopf `/service-und-termin`,
 * Partnerseiten), bei 360 px Fensterbreite also 288 px breit: 16 × 288 / 300 ≈ 15,4 px. Auf
 * `ratgeber/[slug]` steht es frei in einer 4:3-Fläche (320 × 240 px); bei vier Stationen begrenzt
 * die Höhe: 16 × 240 / ablaufHoehe(4) = 16 × 240 / 256 = 15 px.
 * Breit steht ab 1024 px in 5 von 12 Spalten, schmalste Stelle bei 1024 px mit `p-6` (etwa
 * 335 px): 20,5 × 335 / 480 ≈ 14,3 px; die Nummern 22 × 335 / 480 ≈ 15,4 px.
 */
export const ABLAUF_FLAECHE = {
  breit: { breite: 480, hoehe: 270, schrift: 20.5, nummer: 22, erste: 31, reihe: 26 },
  schmal: { breite: 300, schrift: 16, rand: 20, kopf: 76, zeile: 60 },
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

/**
 * Pfade einer tiefen Führungslinie bei `x` zur eigenen Beschriftung mit der Grundlinie `ziel`.
 * Kommt eine Beschriftung einer höheren Reihe (`hindernisse`: Mitte, geschätzte Breite,
 * Grundlinie) der Linie näher als `LUFT`, endet die Linie über der obersten solchen Beschriftung;
 * sonst führt sie durchgehend bis knapp über die eigene Beschriftung.
 */
export function tiefeFuehrung(
  x: number,
  LY: number,
  ziel: number,
  schrift: number,
  hindernisse: { x: number; breite: number; grundlinie: number }[],
): string[] {
  const nah = hindernisse
    .filter((n) => n.breite / 2 + LUFT > Math.abs(n.x - x))
    .sort((a, b) => a.grundlinie - b.grundlinie);
  if (nah.length === 0) return [`M${x} ${LY + 4}V${r(ziel - schrift * 0.75 - SCHRIFT_LUECKE)}`];
  // Unter der Zeile bliebe nur ein Reststück von wenigen Einheiten – es wirkte wie ein verirrter
  // Strich. Die tiefe Reihe steht ohnehin mittig unter ihrer Station.
  return [`M${x} ${LY + 4}V${r(nah[0].grundlinie - schrift - SCHRIFT_LUECKE)}`];
}

/**
 * Zahl der Reihen für die Beschriftung im breiten Format: so wenige wie möglich. In `k` Reihen
 * stehen Station i und i + k nebeneinander; sie brauchen den Mindestabstand `LUECKE`.
 */
export function ablaufReihen(breiten: number[], abstand: number): number {
  for (let k = 1; k < MAX_REIHEN; k += 1) {
    if (breiten.every((b, i) => i + k >= breiten.length || k * abstand >= (b + breiten[i + k]) / 2 + LUECKE)) {
      return k;
    }
  }
  return MAX_REIHEN;
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
 * Beschriftungen nicht nebeneinander, stehen sie reihum in zwei oder drei Reihen (`ablaufReihen`).
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
  const reihen = mitBeschriftung ? ablaufReihen(breiten, abstand) : 1;
  /* Vertikal: oben Kreis (zwei Rasterfelder) und Hilfslinie, unten eine bis drei Reihen Beschriftung. */
  const oben = HILFSSTRECKE + 2 * RASTERFELD;
  const unten = !mitBeschriftung ? 8 : f.erste + (reihen - 1) * f.reihe + 6;
  const LY = r((f.hoehe - (oben + unten)) / 2 + oben);
  const cy = LY - HILFSSTRECKE - KREIS_BREIT;
  const reiheVon = (i: number) => i % reihen;
  const grundlinie = (i: number) => LY + f.erste + reiheVon(i) * f.reihe;

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
        const tief = i < beschriftungen.length && reiheVon(i) > 0;
        const beschriftungY = grundlinie(i);
        const hindernisse = beschriftungen
          .map((_, j) => j)
          .filter((j) => reiheVon(j) < reiheVon(i))
          .map((j) => ({ x: xs[j], breite: breiten[j], grundlinie: grundlinie(j) }));
        const fuehrung = tief ? tiefeFuehrung(x, LY, beschriftungY, f.schrift, hindernisse) : [];
        return (
          <g key={`station-${i}`}>
            <path
              className="sm24-fade stroke-foreground-muted"
              style={motionStyle(verzoegerung(i), EINBLENDUNG)}
              strokeWidth={HILFSLINIE}
              strokeDasharray={GESTRICHELT}
              d={`M${x} ${LY + 6}V${cy + KREIS_BREIT}`}
            />
            {fuehrung.map((d, k) => (
              <path
                key={`fuehrung-${k}`}
                className="sm24-fade stroke-foreground-muted"
                style={motionStyle(verzoegerung(i), EINBLENDUNG)}
                strokeWidth={HILFSLINIE}
                strokeDasharray={GESTRICHELT}
                d={d}
              />
            ))}
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
