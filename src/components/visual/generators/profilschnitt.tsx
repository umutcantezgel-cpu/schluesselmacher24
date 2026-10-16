import type { VisualProps } from '../registry';
import { DRAW_DASHARRAY, motionStyle } from '../motion/motion-style';
import {
  AKZENT,
  GrafikRahmen,
  HILFSLINIE,
  KONTUR,
  LINIE,
  LINIE_STARK,
  Raster,
  SCHRIFT_KLEIN,
  hash,
  kerben,
  kurztext,
  parameter,
  pfeilspitze,
  positionen,
  r,
  titel,
  wert,
  zahlenfolge,
  ziffern,
} from './grafik-basis';

const BREITE = 480;
const HOEHE = 360;

/* Schlüssel in Seitenansicht: Reide links, Halm nach rechts. */
const REIDE = { x: 24, y: 138, w: 100, h: 104, radius: 20 };
const LOCH = { x: 52, y: 190, r: 10 };
/** Oberkante des Rohlings (unberührte Kante) und Unterkante des Halms. */
const OBEN = 168;
const UNTEN = 214;
const SCHULTER = { x: 134, oben: 158, unten: 222 };
const HALM_START = 140;
const HALM_ENDE = 426;
const SPITZE = { x: 456, y: 198 };
/** Bereich der Einschnitte auf dem Halm. */
const EINSCHNITT_VON = 178;
const EINSCHNITT_BIS = 394;
const FLACH = 8;
const STEIGUNG = 1.1;
/** Tiefe in viewBox-Einheiten je Stufe 0–9. */
const TIEFE_GRUND = 3;
const TIEFE_STUFE = 2.4;
const FRAESER_R = 14;
const STANDARD_PROFIL = [2, 6, 3, 7, 1, 5];
/** Größter Sprung zwischen Nachbarn, wie bei echten Schließungen begrenzt. */
const MAX_SPRUNG = 6;

/** Zeitplan des großen Moments B-01 (Sekunden). */
export const FRAESBAHN = { verzoegerung: 0.3, dauer: 1.1 } as const;

/**
 * Nach dem letzten Einschnitt hebt der Fräser vom Werkstück ab (viewBox-Einheiten).
 * Die Ruhelage ist schon gehoben, damit er auch ohne Bewegung frei von der Spitze steht.
 */
export const FRAESER_ABHEBEN = { x: 12, y: -16 } as const;

/** Volle Zeichenfläche und schmaler Ausschnitt (Halm mit Einschnitten) für kleine Breiten. */
export const PROFILSCHNITT_GROESSE = { breite: BREITE, hoehe: HOEHE } as const;
export const PROFILSCHNITT_AUSSCHNITT = { x: 140, y: 98, breite: 320, hoehe: 140 } as const;

function profilAusText(text: string): number[] {
  const naechste = zahlenfolge(hash(text.toUpperCase().replace(/\s+/g, '')));
  const folge: number[] = [];
  for (let i = 0; i < 6; i += 1) {
    let tiefe = Math.floor(naechste() * 10);
    const vorher = folge[i - 1];
    if (vorher !== undefined && Math.abs(tiefe - vorher) > MAX_SPRUNG) {
      tiefe = vorher + Math.sign(tiefe - vorher) * MAX_SPRUNG;
    }
    folge.push(tiefe);
  }
  return folge;
}

/** Profilkante als Punkte in viewBox-Koordinaten, von der Schulter bis zum Halmende. */
function profilPunkte(stufen: number[]): [number, number][] {
  const pos = positionen(stufen.length, EINSCHNITT_VON, EINSCHNITT_BIS);
  const tiefen = stufen.map((s) => TIEFE_GRUND + s * TIEFE_STUFE);
  const kanten = kerben(pos, tiefen, FLACH, STEIGUNG).map(([x, t]): [number, number] => [r(x), r(OBEN + t)]);
  return [[HALM_START, OBEN], ...kanten, [HALM_ENDE, OBEN]];
}

const pfad = (punkte: [number, number][]) => `M${punkte.map(([x, y]) => `${x} ${y}`).join('L')}`;

/** Fräsbahn: Mittelpunkt des Fräsers, der mit dem Rand über der Profilkante läuft. */
function fraesbahn(punkte: [number, number][]): string {
  return punkte.map(([x, y]) => `${x},${r(y - FRAESER_R - 1)}`).join(' ');
}

/**
 * Großer Moment der Startseite (KERN K-007, B-01): Ein Schlüsselrohling wird
 * gefräst. Gestrichelt die unberührte Rohlingkante, farbig das gefräste Profil,
 * das sich zeichnet, darüber der Fräser. Die Bewegung des Fräsers übernimmt die
 * Client-Hülle `FraesbahnBewegung` (synchron zur Zeichnung); ohne sie ruht er am
 * Ende der Bahn. Die Grafik ist ohne jede Bewegung vollständig.
 *
 * params:
 * - `einschnitte`: 4–8 Ziffern 0–9 (Liste oder Text) – Vorrang vor `code`
 * - `code`: Text, aus dem ein Profil abgeleitet wird (ohne Ziffern-Beschriftung)
 * - `beschriftung`: `true` (Standard) · `false` – Nummern, Bemaßung und Legende
 */
export function ProfilschnittGrafik({ params, title, className }: VisualProps) {
  const p = parameter(params);
  const code = kurztext(wert(p, 'code'), 40);
  const stufen = ziffern(wert(p, 'einschnitte'), 4, 8) ?? (code ? profilAusText(code) : STANDARD_PROFIL);
  const beschriftungWert = wert(p, 'beschriftung');
  const beschriftung = !(beschriftungWert === false || (typeof beschriftungWert === 'string' && /^(false|nein|0)$/i.test(beschriftungWert.trim())));

  const punkte = profilPunkte(stufen);
  const pos = positionen(stufen.length, EINSCHNITT_VON, EINSCHNITT_BIS);
  const [endeX, endeY] = punkte[punkte.length - 1];

  /* Fläche des abgetragenen Materials zwischen Rohlingkante und Profil. */
  const material = `${pfad(punkte)}L${HALM_ENDE} ${OBEN}L${HALM_START} ${OBEN}Z`;
  /* Umriss des Schlüssels ohne Oberkante des Halms (die zeichnet das Profil). */
  const umriss =
    `M${HALM_ENDE} ${OBEN}L${SPITZE.x} ${SPITZE.y}L${HALM_ENDE} ${UNTEN}H${SCHULTER.x}V${SCHULTER.unten}H${REIDE.x + REIDE.w}` +
    `M${REIDE.x + REIDE.w} ${SCHULTER.oben}H${SCHULTER.x}V${OBEN}H${HALM_START}`;
  const koerper =
    `${pfad(punkte)}L${SPITZE.x} ${SPITZE.y}L${HALM_ENDE} ${UNTEN}H${SCHULTER.x}V${SCHULTER.unten}` +
    `H${REIDE.x + REIDE.w}V${SCHULTER.oben}H${SCHULTER.x}V${OBEN}Z`;
  const masslinieY = 274;

  return (
    <GrafikRahmen
      breite={BREITE}
      hoehe={HOEHE}
      title={titel(title, `Schlüsselprofil mit ${stufen.length} Einschnitten wird gefräst`)}
      className={className}
    >
      <Raster breite={BREITE} hoehe={HOEHE} />

      {beschriftung && (
        <text className="fill-foreground-muted font-mono" fontSize={SCHRIFT_KLEIN} letterSpacing={1.5} x={24} y={44}>
          PROFILSCHNITT
        </text>
      )}

      {/* Halm mit fertigem Profil (Fläche) und abgetragenes Material */}
      <path className="fill-surface" stroke="none" d={koerper} />
      <path className="sm24-fade fill-area-soft" stroke="none" style={motionStyle(1.15, 0.45)} d={material} />

      {/* Reide mit Loch */}
      <rect
        className="fill-area-muted stroke-foreground"
        strokeWidth={KONTUR}
        x={REIDE.x}
        y={REIDE.y}
        width={REIDE.w}
        height={REIDE.h}
        rx={REIDE.radius}
      />
      <circle className="fill-surface stroke-foreground" strokeWidth={KONTUR} cx={LOCH.x} cy={LOCH.y} r={LOCH.r} />

      {/* Umriss, Profilnut und Rohlingkante */}
      <path className="stroke-foreground" strokeWidth={KONTUR} d={umriss} />
      <path className="stroke-foreground-muted" strokeWidth={HILFSLINIE} d={`M${HALM_START + 10} 198H${HALM_ENDE - 6}`} />
      <path
        className="stroke-foreground-muted"
        strokeWidth={LINIE}
        strokeDasharray="5 5"
        d={`M${HALM_START} ${OBEN}H${HALM_ENDE}`}
      />

      {/* Gefrästes Profil zeichnet sich (B-01) */}
      <path
        className="sm24-draw stroke-area-strong"
        data-fraesprofil=""
        pathLength={1}
        strokeWidth={AKZENT}
        style={motionStyle(FRAESBAHN.verzoegerung, FRAESBAHN.dauer, { strokeDasharray: DRAW_DASHARRAY })}
        d={pfad(punkte)}
      />

      {/*
        Fräser: ruht gehoben über dem Ende der Bahn. Die Client-Hülle führt ihn die Bahn
        entlang (innere Gruppe) und lässt ihn danach abheben (äußere Gruppe). Er blendet
        während der Startverzögerung ein, damit er nicht von der Ruhelage springt.
      */}
      <g
        data-fraesabheben={`${FRAESER_ABHEBEN.x},${FRAESER_ABHEBEN.y}`}
        transform={`translate(${FRAESER_ABHEBEN.x} ${FRAESER_ABHEBEN.y})`}
      >
        <g
          className="sm24-fade"
          data-fraesbahn={fraesbahn(punkte)}
          style={motionStyle(0, FRAESBAHN.verzoegerung)}
        >
          <g data-fraesrad="" transform={`translate(${endeX} ${r(endeY - FRAESER_R - 1)})`}>
            <circle className="fill-surface stroke-foreground" strokeWidth={LINIE_STARK} r={FRAESER_R} />
            <circle className="stroke-foreground-muted" strokeWidth={LINIE} r={4} />
            <path
              className="stroke-foreground"
              strokeWidth={LINIE_STARK}
              d={[0, 45, 90, 135, 180, 225, 270, 315]
                .map((w) => {
                  const a = (w * Math.PI) / 180;
                  return `M${r(Math.cos(a) * FRAESER_R)} ${r(Math.sin(a) * FRAESER_R)}L${r(Math.cos(a) * (FRAESER_R + 3.5))} ${r(Math.sin(a) * (FRAESER_R + 3.5))}`;
                })
                .join('')}
            />
          </g>
        </g>
      </g>

      {beschriftung && (
        <>
          {/* Einschnitt-Nummern */}
          {pos.map((x, i) => (
            <g key={x}>
              <text
                className="fill-foreground-muted font-mono"
                fontSize={SCHRIFT_KLEIN}
                textAnchor="middle"
                x={r(x)}
                y={122}
              >
                {i + 1}
              </text>
              <path className="stroke-border-strong" strokeWidth={HILFSLINIE} d={`M${r(x)} 128V${OBEN - 22}`} />
            </g>
          ))}

          {/* Bemaßung des Halms (im schmalen Ausschnitt ausgeblendet) */}
          <g data-bemassung="">
            <g className="stroke-foreground-muted" strokeWidth={HILFSLINIE}>
              <path d={`M${HALM_START} ${SCHULTER.unten + 6}V${masslinieY + 8}M${SPITZE.x} ${SPITZE.y + 10}V${masslinieY + 8}`} />
            </g>
            <path className="stroke-foreground-muted" strokeWidth={LINIE} d={`M${HALM_START + 8} ${masslinieY}H${SPITZE.x - 8}`} />
            <path className="fill-foreground-muted" stroke="none" d={pfeilspitze(HALM_START, masslinieY, 180)} />
            <path className="fill-foreground-muted" stroke="none" d={pfeilspitze(SPITZE.x, masslinieY, 0)} />
            <text
              className="fill-foreground-muted font-mono"
              fontSize={SCHRIFT_KLEIN}
              textAnchor="middle"
              x={(HALM_START + SPITZE.x) / 2}
              y={masslinieY - 8}
            >
              {`Halm · ${stufen.length} Einschnitte`}
            </text>
          </g>

          {/* Legende */}
          <g transform="translate(24 318)">
            <path className="stroke-foreground-muted" strokeWidth={LINIE} strokeDasharray="5 5" d="M0 0H28" />
            <text className="fill-foreground-muted font-mono" fontSize={SCHRIFT_KLEIN} x={38} y={4}>
              Rohling
            </text>
            <path className="stroke-area-strong" strokeWidth={AKZENT} d="M120 0H148" />
            <text className="fill-foreground-muted font-mono" fontSize={SCHRIFT_KLEIN} x={158} y={4}>
              gefrästes Profil
            </text>
          </g>
        </>
      )}
    </GrafikRahmen>
  );
}
