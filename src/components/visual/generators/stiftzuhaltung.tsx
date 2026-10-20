import { Fragment, type CSSProperties } from 'react';

import { cn } from '@/lib/cn';
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
  kerben,
  parameter,
  pfeilspitze,
  r,
  titel,
  wert,
  ziffern,
} from './grafik-basis';

const BREITE = 480;
const HOEHE = 270;

const ZUSTAENDE = ['passt', 'passt-nicht', 'abgebrochen'] as const;
type Zustand = (typeof ZUSTAENDE)[number];

const TITEL: Record<Zustand, string> = {
  passt: 'Stiftzuhaltung: Der Schlüssel passt',
  'passt-nicht': 'Stiftzuhaltung: Der Schlüssel passt nicht',
  abgebrochen: 'Abgebrochener Schlüssel im Zylinder',
};

/* Gehäuse und Kern (Maße in viewBox-Einheiten). */
const GEHAEUSE = { x: 150, y: 40, b: 280, h: 176, radius: 8 };
const KERN_OBEN = 118;
const KERN_UNTEN = 204;
/** Trennlinie ragt je 14 Einheiten über das Gehäuse hinaus. */
const TRENNLINIE = { von: 136, bis: 444, strich: 14, luecke: 7 };
const BOHRUNGEN = [200, 245, 290, 335, 380] as const;
const BOHRUNG_HALB = 9;
/** Stifte sind etwas schmaler als die Bohrung. */
const STIFT_HALB = 8;
const FEDER_OBEN = 46;
const FEDER_AMPLITUDE = 4;
const GEHAEUSESTIFT_LAENGE = 30;
const SPITZE_HOEHE = 12;
/** Unterste Stiftspitze, wenn kein Schlüssel trägt (knapp über dem Kernboden). */
const STIFT_BODEN = 200;
const VERSATZ_DX = 13;

/* Schlüssel: Reide links, Halm im Kern. */
const HALM_OBEN = 150;
const HALM_UNTEN = 198;
const HALM_ENDE = 412;
const SPITZE = { x: 424, y: 174 };
const REIDE = { x: 36, y: 135, b: 90, h: 72, radius: 14 };
/** Beim abgebrochenen Schlüssel ist die Reide um diesen Betrag nach links abgesetzt. */
const REIDE_ABSETZUNG = 30;
const BRUCH_X = 272;
const BRUCH_HUB = 7;
/** Die ersten zwei Bohrungen tragen den abgebrochenen Halm. */
const TRAGENDE_BOHRUNGEN_ABGEBROCHEN = 2;
const FLACH = 8;
const STEIGUNG = 2.2;
/** Tiefe in viewBox-Einheiten: Grund plus eine Stufe je Ziffer. */
const TIEFE_GRUND = 2;
const TIEFE_STUFE = 4;
/** Versatz je Bohrung, damit falsche Schlüssel die Fugen verschieben. */
const VERSATZ_STUFEN = [3, 7, 4, 0, 5] as const;
const STANDARD_EINSCHNITTE = [3, 6, 2, 7, 4] as const;

/**
 * Szene `scroll` (B-25): Der Schlüssel beginnt so weit links, dass seine Spitze
 * 20 Einheiten vor der Mitte der ersten Bohrung steht; die Reide liegt dann außerhalb.
 */
const SCHLUESSEL_EINFAHRT = -(SPITZE.x - BOHRUNGEN[0]) - 20;
/** Szene `scroll`: Stiftweg in der Ausgangslage, begrenzt auf diese Spanne (Einheiten). */
const SZENE_WEG = { min: 8, max: 30 } as const;

/** Eine Bohrung mit Stift, Fuge und den Werten der Szene `scroll`. */
type Bohrungsdaten = {
  x: number;
  i: number;
  traegt: boolean;
  spitze: number;
  fuge: number;
  richtig: boolean;
  /** Stiftweg der Ausgangslage (nur Szene): Abstand zur Endlage, positiv = tiefer. */
  weg: number;
  /** Federfaktor der Ausgangslage (nur Szene): Länge Ausgangslage / Länge Endlage. */
  federVon: number;
};

/** Tiefe einer Einschnitt-Stufe in viewBox-Einheiten. */
function tiefe(stufe: number): number {
  return TIEFE_GRUND + stufe * TIEFE_STUFE;
}

/** Ziffern 0–9 aus dem Code, höchstens vier; alles andere entfällt. */
function codeAus(value: unknown): string | undefined {
  const roh = typeof value === 'number' && Number.isFinite(value) ? String(Math.trunc(value)) : value;
  if (typeof roh !== 'string') return undefined;
  const folge = roh.replace(/[^0-9]/g, '').slice(0, 4);
  return folge || undefined;
}

/** Zickzack der Bruchkante, von oben nach unten (Punkte nach dem Start oben). */
function bruchZacken(): string {
  return [1, 2, 3, 4, 5, 6]
    .map((k) => `L${k % 2 === 1 ? BRUCH_X + BRUCH_HUB : BRUCH_X} ${HALM_OBEN + k * 8}`)
    .join('');
}

/** Umriss des Halms; mit `bruch` endet er an der gezackten Bruchkante. */
function halmPfad(start: number, pos: number[], tiefen: number[], bruch: boolean): string {
  const kerbPunkte = kerben(pos, tiefen, FLACH, STEIGUNG)
    .map(([x, t]) => `L${r(x)} ${r(HALM_OBEN + t)}`)
    .join('');
  if (bruch) {
    return `M${start} ${HALM_UNTEN}V${HALM_OBEN}${kerbPunkte}L${BRUCH_X} ${HALM_OBEN}${bruchZacken()}Z`;
  }
  return `M${start} ${HALM_UNTEN}V${HALM_OBEN}${kerbPunkte}L${HALM_ENDE} ${HALM_OBEN}L${SPITZE.x} ${SPITZE.y}L${HALM_ENDE} ${HALM_UNTEN}Z`;
}

/** Feder als Zickzack zwischen Gehäusedach und Gehäusestift. */
function federPfad(x: number, bis: number): string {
  const segmente = 6;
  const punkte = Array.from({ length: segmente + 1 }, (_, k) => {
    const y = FEDER_OBEN + ((bis - FEDER_OBEN) * k) / segmente;
    const dx = k === 0 || k === segmente ? 0 : k % 2 === 1 ? FEDER_AMPLITUDE : -FEDER_AMPLITUDE;
    return `${r(x + dx)} ${r(y)}`;
  });
  return `M${punkte.join('L')}`;
}

/** Kernstift mit spitzem Ende; die Spitze liegt auf `tip`. */
function kernstiftPfad(x: number, fuge: number, tip: number): string {
  const schulter = r(tip - SPITZE_HOEHE);
  return `M${x - STIFT_HALB} ${r(fuge)}H${x + STIFT_HALB}V${schulter}L${x} ${r(tip)}L${x - STIFT_HALB} ${schulter}Z`;
}

/** Gehäusestift einer Bohrung: Unterkante liegt auf der Fuge. */
function gehaeusestift(b: Bohrungsdaten) {
  return (
    <rect
      className="fill-area-muted stroke-foreground"
      strokeWidth={LINIE}
      x={b.x - STIFT_HALB}
      y={b.fuge - GEHAEUSESTIFT_LAENGE}
      width={STIFT_HALB * 2}
      height={GEHAEUSESTIFT_LAENGE}
    />
  );
}

/** Kernstift einer Bohrung, Spitze auf `spitze`. */
function kernstift(b: Bohrungsdaten) {
  return (
    <path
      className="fill-surface stroke-area-strong"
      strokeWidth={LINIE}
      d={kernstiftPfad(b.x, b.fuge, b.spitze)}
    />
  );
}

/**
 * Schnitt durch einen Schließzylinder mit fünf Stiftpaaren und eingestecktem
 * Schlüssel. Drei Zustände: passt · passt-nicht · abgebrochen.
 *
 * params:
 * - `zustand`: `passt` (Standard) · `passt-nicht` · `abgebrochen`
 * - `einschnitte`: 5 Ziffern 0–9 (Liste oder Text, z. B. `'37264'`); die Stifte sind
 *   auf diese Tiefen ausgelegt. Ohne gültige Angabe Standard `[3, 6, 2, 7, 4]`.
 * - `code`: bis 4 Ziffern (Text oder Zahl), erscheinen auf der Reide; alles andere entfällt
 * - `szene`: `scroll` (nur bei `passt`) fährt den Schlüssel ein und richtet die Stifte am
 *   Scrollen aus (B-25); die Endlage ist dasselbe Bild. Sonst ohne Wirkung.
 *
 * Die Fugen liegen bei `passt` auf der Trennlinie. Bei `passt-nicht` trägt der Schlüssel
 * andere Tiefen, und die Fugen wandern. Bei `abgebrochen` trägt nur der Halm bis zur
 * zweiten Bohrung; die übrigen Stifte fallen nach unten.
 */
export function StiftzuhaltungGrafik({ params, title, className }: VisualProps) {
  const p = parameter(params);
  const zustand = auswahl(wert(p, 'zustand'), ZUSTAENDE, 'passt');
  const stufen = ziffern(wert(p, 'einschnitte'), 5, 5) ?? [...STANDARD_EINSCHNITTE];
  const code = codeAus(wert(p, 'code'));
  const falsch = zustand === 'passt-nicht';
  const abgebrochen = zustand === 'abgebrochen';
  const szeneWunsch = wert(p, 'szene');
  const szeneAktiv =
    zustand === 'passt' && typeof szeneWunsch === 'string' && szeneWunsch.trim().toLowerCase() === 'scroll';

  /* Tiefen, die im Schlüssel stecken: bei `passt-nicht` deterministisch verschoben. */
  const schluessel = falsch ? stufen.map((s, i) => (s + (VERSATZ_STUFEN[i] ?? 0)) % 10) : stufen;
  const tragend = abgebrochen ? TRAGENDE_BOHRUNGEN_ABGEBROCHEN : BOHRUNGEN.length;

  /* Pro Bohrung: Stiftlänge (aus der Auslegung), Spitze, Fuge, Werte der Szene. */
  const bohrungen: Bohrungsdaten[] = BOHRUNGEN.map((x, i) => {
    const traegt = i < tragend;
    const spitze = traegt ? HALM_OBEN + tiefe(schluessel[i] ?? 0) : STIFT_BODEN;
    const kernLaenge = HALM_OBEN - KERN_OBEN + tiefe(stufen[i] ?? 0);
    const fuge = spitze - kernLaenge;
    const weg = Math.min(SZENE_WEG.max, Math.max(SZENE_WEG.min, STIFT_BODEN - spitze));
    const bis = fuge - GEHAEUSESTIFT_LAENGE;
    const federVon = r((bis + weg - FEDER_OBEN) / (bis - FEDER_OBEN));
    return { x, i, traegt, spitze, fuge, weg, federVon, richtig: Math.abs(fuge - KERN_OBEN) < 0.5 };
  });

  const stuetzen = bohrungen.filter((b) => b.traegt);
  const halmStart = REIDE.x + REIDE.b - (abgebrochen ? REIDE_ABSETZUNG : 0);
  const reideX = REIDE.x - (abgebrochen ? REIDE_ABSETZUNG : 0);
  const halm = halmPfad(
    halmStart,
    stuetzen.map((b) => b.x),
    stuetzen.map((b) => tiefe(schluessel[b.i] ?? 0)),
    abgebrochen,
  );

  const trennStriche: { von: number; bis: number }[] = [];
  for (let von = TRENNLINIE.von; von < TRENNLINIE.bis; von += TRENNLINIE.strich + TRENNLINIE.luecke) {
    trennStriche.push({ von, bis: Math.min(von + TRENNLINIE.strich, TRENNLINIE.bis) });
  }

  /* Schlüsselteile: Halm, Bruchkante, Reide, Reidenloch, Code. In der Szene eine Gruppe. */
  const schluesselTeile = (
    <>
      <path className="fill-surface" stroke="none" d={halm} />
      <path className="stroke-foreground" strokeWidth={KONTUR} d={halm} />
      {abgebrochen && (
        <path data-bruch="" className="stroke-foreground" strokeWidth={KONTUR} d={`M${BRUCH_X} ${HALM_OBEN}${bruchZacken()}`} />
      )}
      <rect
        className="fill-area-muted stroke-foreground"
        strokeWidth={KONTUR}
        x={reideX}
        y={REIDE.y}
        width={REIDE.b}
        height={REIDE.h}
        rx={REIDE.radius}
      />
      <circle
        className="fill-surface stroke-foreground"
        strokeWidth={LINIE}
        cx={r(reideX + REIDE.b / 2)}
        cy={REIDE.y + 22}
        r={8}
      />
      {code && (
        <text
          className="fill-foreground-muted font-mono"
          fontSize={SCHRIFT}
          fontWeight={600}
          textAnchor="middle"
          x={r(reideX + REIDE.b / 2)}
          y={REIDE.y + 58}
        >
          {code}
        </text>
      )}
    </>
  );

  /* Marken an den Fugen: in der Szene eine Gruppe, die zuletzt erscheint. */
  const marken = bohrungen.map((b) => (
    <circle
      key={`marke-${b.x}`}
      className={`sm24-pop fill-surface ${b.richtig ? 'stroke-success' : 'stroke-danger'}`}
      style={motionStyle(0.3 + b.i * 0.12)}
      strokeWidth={LINIE}
      cx={b.x}
      cy={r(b.fuge)}
      r={4}
    />
  ));

  return (
    <GrafikRahmen
      breite={BREITE}
      hoehe={HOEHE}
      title={titel(title, TITEL[zustand])}
      className={szeneAktiv ? cn(className, 'sm24-szene') : className}
    >
      <Raster breite={BREITE} hoehe={HOEHE} />

      {/* Gehäuse, Kern und Bohrungen */}
      <rect
        className="fill-surface stroke-foreground"
        strokeWidth={KONTUR}
        x={GEHAEUSE.x}
        y={GEHAEUSE.y}
        width={GEHAEUSE.b}
        height={GEHAEUSE.h}
        rx={GEHAEUSE.radius}
      />
      <rect
        className="fill-area-soft"
        stroke="none"
        x={GEHAEUSE.x}
        y={KERN_OBEN}
        width={GEHAEUSE.b}
        height={KERN_UNTEN - KERN_OBEN}
      />
      {/* Kernkontur ohne Oberkante: die gestrichelte Trennlinie ersetzt sie */}
      <path
        className="stroke-foreground"
        strokeWidth={KONTUR}
        d={`M${GEHAEUSE.x} ${KERN_OBEN}V${KERN_UNTEN}H${GEHAEUSE.x + GEHAEUSE.b}V${KERN_OBEN}`}
      />
      {bohrungen.map((b) => (
        <rect
          key={`bohrung-${b.x}`}
          data-bohrung=""
          className="fill-surface-muted stroke-border-strong"
          strokeWidth={HILFSLINIE}
          x={b.x - BOHRUNG_HALB}
          y={GEHAEUSE.y}
          width={BOHRUNG_HALB * 2}
          height={KERN_UNTEN - GEHAEUSE.y}
        />
      ))}

      {/* Federn (in der Szene je Feder ein Faktor zum Strecken) */}
      {bohrungen.map((b) => (
        <path
          key={`feder-${b.x}`}
          className={szeneAktiv ? 'stroke-foreground-muted sm24-scrub-feder' : 'stroke-foreground-muted'}
          style={szeneAktiv ? ({ '--feder-von': b.federVon, '--stift-nr': b.i } as CSSProperties) : undefined}
          strokeWidth={LINIE}
          d={federPfad(b.x, b.fuge - GEHAEUSESTIFT_LAENGE)}
        />
      ))}
      {/* Gehäusestifte: in der Szene mit dem Kernstift in einer Gruppe (siehe unten) */}
      {!szeneAktiv &&
        bohrungen.map((b) => <Fragment key={`gehaeusestift-${b.x}`}>{gehaeusestift(b)}</Fragment>)}

      {/* Schlüssel: Reide, Halm mit Einschnitten, gegebenenfalls Bruchkante */}
      {szeneAktiv ? (
        <g className="sm24-scrub-schluessel" style={{ '--schluessel-von': SCHLUESSEL_EINFAHRT } as CSSProperties}>
          {schluesselTeile}
        </g>
      ) : (
        schluesselTeile
      )}

      {/* Kernstifte über dem Halm; in der Szene je Bohrung Gehäusestift und Kernstift zusammen */}
      {szeneAktiv
        ? bohrungen.map((b) => (
            <g
              key={`stift-${b.x}`}
              className="sm24-scrub-stift"
              style={{ '--stift-von': b.weg, '--stift-nr': b.i } as CSSProperties}
            >
              {gehaeusestift(b)}
              {kernstift(b)}
            </g>
          ))
        : bohrungen.map((b) => <Fragment key={`kernstift-${b.x}`}>{kernstift(b)}</Fragment>)}

      {/* Bruchstück liegt im Kern unter den Bohrungen 3–5 und verdeckt die Stiftspitzen */}
      {abgebrochen && (
        <path
          className="fill-surface stroke-foreground"
          strokeWidth={KONTUR}
          d="M282 158H412L422 174L412 190H282L276 182L282 174L276 166Z"
        />
      )}

      {/* Trennlinie: gestrichelt, zeichnet sich in Strichen nacheinander */}
      {trennStriche.map((s, k) => (
        <path
          key={`trenn-${s.von}`}
          className="sm24-draw stroke-area-strong"
          pathLength={1}
          strokeWidth={LINIE}
          style={motionStyle(k * 0.04, undefined, { strokeDasharray: DRAW_DASHARRAY })}
          d={`M${s.von} ${KERN_OBEN}H${s.bis}`}
        />
      ))}
      <text
        className="fill-foreground-muted font-mono"
        fontSize={SCHRIFT_KLEIN}
        textAnchor="end"
        x={TRENNLINIE.von - 6}
        y={KERN_OBEN - 6}
      >
        Trennlinie
      </text>

      {/* Versatz der falschen Fugen zur Trennlinie */}
      {bohrungen
        .filter((b) => !b.richtig)
        .map((b) => {
          const unten = b.fuge > KERN_OBEN;
          const x = b.x + VERSATZ_DX;
          const ende = unten ? b.fuge - 6 : b.fuge + 6;
          return (
            <g key={`versatz-${b.x}`}>
              <path className="stroke-danger" strokeWidth={LINIE} d={`M${x} ${KERN_OBEN}V${r(ende)}`} />
              <path
                className="fill-danger-soft stroke-danger"
                strokeWidth={HILFSLINIE}
                d={pfeilspitze(x, b.fuge, unten ? 90 : 270, 6, 4.5)}
              />
            </g>
          );
        })}

      {/* Marken an den Fugen: gestaffelt, höchstens fünf */}
      {szeneAktiv ? <g className="sm24-scrub-pruefung">{marken}</g> : marken}
    </GrafikRahmen>
  );
}
