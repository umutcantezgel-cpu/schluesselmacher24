import type { VisualProps } from '../registry';
import { motionStyle } from '../motion/motion-style';
import {
  GrafikRahmen,
  HILFSLINIE,
  KONTUR,
  LINIE,
  MITTELLINIE,
  Raster,
  SCHRIFT,
  SCHRIFT_KLEIN,
  auswahl,
  parameter,
  pfeilspitze,
  r,
  titel,
  wert,
  zahl,
} from './grafik-basis';

const BREITE = 480;
const HOEHE = 270;

const BAUFORMEN = ['profil-doppel', 'profil-halb', 'knauf'] as const;
const KNAUFSEITEN = ['innen', 'aussen'] as const;

/* Euro-Profil (DIN 18252), Maße in mm ab Oberkante bzw. Mitte Stulpschraube. */
const PROFIL_HOEHE = 33;
const ACHSE = 8.5;
const STEG_KANTE = 15.4;
const SPALT = 5;
const SPALT_TIEFE = 21;
const LOCH_Y = 27.5;
const LOCH_R = 2.6;
const HALB_STUMPF = 10;
const KNAUF_HALS = 4;
const KNAUF_LAENGE = 13;
const KNAUF_RADIUS = 14;
const HALS_RADIUS = 5;

/** Platz links und rechts für „außen“/„innen“. */
const SEITENRAND = 66;
const MAX_SKALA = 4;

/** 30 → „30“, 32.5 → „32,5“. */
function mass(wert: number): string {
  const gerundet = Math.round(wert * 10) / 10;
  return Number.isInteger(gerundet) ? String(gerundet) : gerundet.toFixed(1).replace('.', ',');
}

/**
 * Technische Maßzeichnung eines Schließzylinders (Seitenansicht, maßstäblich).
 *
 * params:
 * - `bauform`: `profil-doppel` (Standard) | `profil-halb` | `knauf`
 * - `aussen`: Maß A in mm, 25–100 (Standard 30)
 * - `innen`: Maß I in mm, 25–100 (Standard 30; bei `profil-halb` ohne Wirkung)
 * - `knaufseite`: `innen` (Standard) | `aussen` — nur bei `knauf`
 *
 * Gemessen wird von der Mitte der Stulpschraube bis zum Zylinderende.
 */
export function ZylinderMassGrafik({ params, title, className }: VisualProps) {
  const p = parameter(params);
  const bauform = auswahl(wert(p, 'bauform'), BAUFORMEN, 'profil-doppel');
  const halb = bauform === 'profil-halb';
  const aussen = zahl(wert(p, 'aussen'), 25, 100, 30);
  const innen = zahl(wert(p, 'innen'), 25, 100, 30);
  const knaufseite =
    bauform === 'knauf' ? auswahl(wert(p, 'knaufseite'), KNAUFSEITEN, 'innen') : undefined;

  /* Waagerecht in mm: außen links (negativ), innen rechts (positiv). */
  const links = -aussen;
  const rechts = halb ? HALB_STUMPF : innen;
  const knaufMass = KNAUF_HALS + KNAUF_LAENGE;
  const minMm = links - (knaufseite === 'aussen' ? knaufMass : 0);
  const maxMm = rechts + (knaufseite === 'innen' ? knaufMass : 0);

  const s = Math.min((BREITE - 2 * SEITENRAND) / (maxMm - minMm), MAX_SKALA);
  const nullX = BREITE / 2 - ((minMm + maxMm) / 2) * s;
  const oben = (HOEHE - (PROFIL_HOEHE * s + 70)) / 2 + 42;
  const X = (mm: number) => r(nullX + mm * s);
  const Y = (mm: number) => r(oben + mm * s);

  const ecke = r(Math.min(1.5 * s, 4));
  const unten = Y(PROFIL_HOEHE);
  const massY = r(oben - 24);

  const koerper = [
    `M${r(X(links) + ecke)} ${Y(0)}`,
    `H${X(-SPALT)}V${Y(SPALT_TIEFE)}H${X(SPALT)}V${Y(0)}`,
    `H${r(X(rechts) - ecke)}A${ecke} ${ecke} 0 0 1 ${X(rechts)} ${r(Y(0) + ecke)}`,
    `V${r(unten - ecke)}A${ecke} ${ecke} 0 0 1 ${r(X(rechts) - ecke)} ${unten}`,
    `H${r(X(links) + ecke)}A${ecke} ${ecke} 0 0 1 ${X(links)} ${r(unten - ecke)}`,
    `V${r(Y(0) + ecke)}A${ecke} ${ecke} 0 0 1 ${r(X(links) + ecke)} ${Y(0)}Z`,
  ].join('');

  const steg = [
    `M${X(links)} ${Y(STEG_KANTE)}H${X(-SPALT)}V${Y(SPALT_TIEFE)}H${X(SPALT)}V${Y(STEG_KANTE)}`,
    `H${X(rechts)}V${r(unten - ecke)}A${ecke} ${ecke} 0 0 1 ${r(X(rechts) - ecke)} ${unten}`,
    `H${r(X(links) + ecke)}A${ecke} ${ecke} 0 0 1 ${X(links)} ${r(unten - ecke)}Z`,
  ].join('');

  const kanten = `M${X(links)} ${Y(STEG_KANTE)}H${X(-SPALT)}M${X(SPALT)} ${Y(STEG_KANTE)}H${X(rechts)}`;

  const bart = [
    `M${X(-4.2)} ${Y(ACHSE)}A${r(4.2 * s)} ${r(4.2 * s)} 0 0 1 ${X(4.2)} ${Y(ACHSE)}`,
    `L${X(3)} ${Y(17.5)}A${r(3 * s)} ${r(3 * s)} 0 0 1 ${X(-3)} ${Y(17.5)}Z`,
  ].join('');

  const gewindeR = r(3.3 * s);
  const gewinde = `M${r(X(0) + gewindeR)} ${Y(LOCH_Y)}A${gewindeR} ${gewindeR} 0 1 1 ${X(0)} ${r(Y(LOCH_Y) - gewindeR)}`;

  const knauf = knaufseite
    ? (() => {
        const richtung = knaufseite === 'innen' ? 1 : -1;
        const basis = knaufseite === 'innen' ? rechts : links;
        const halsA = X(basis);
        const halsB = X(basis + richtung * KNAUF_HALS);
        const kopfB = X(basis + richtung * knaufMass);
        const kopfX = Math.min(halsB, kopfB);
        const kopfBreite = r(Math.abs(kopfB - halsB));
        const riffel = [0.25, 0.5, 0.75]
          .map((anteil) => {
            const x = r(kopfX + kopfBreite * anteil);
            return `M${x} ${Y(ACHSE - 9)}V${Y(ACHSE + 9)}`;
          })
          .join('');
        return {
          hals: {
            x: Math.min(halsA, halsB),
            y: Y(ACHSE - HALS_RADIUS),
            w: r(Math.abs(halsB - halsA)),
            h: r(2 * HALS_RADIUS * s),
          },
          kopf: {
            x: kopfX,
            y: Y(ACHSE - KNAUF_RADIUS),
            w: kopfBreite,
            h: r(2 * KNAUF_RADIUS * s),
          },
          riffel,
        };
      })()
    : undefined;

  const masse: { von: number; bis: number; text: string }[] = [
    { von: links, bis: 0, text: `A ${mass(aussen)}` },
  ];
  if (!halb) masse.push({ von: 0, bis: rechts, text: `I ${mass(innen)}` });

  const beschriftungY = r(oben + (PROFIL_HOEHE * s) / 2 + 4.5);
  const mitteText = 'Mitte Stulpschraube';
  const mitteBreite = mitteText.length * SCHRIFT_KLEIN * 0.6;
  const mitteX = r(
    Math.min(BREITE - 12 - mitteBreite / 2, Math.max(12 + mitteBreite / 2, X(0))),
  );

  return (
    <GrafikRahmen
      breite={BREITE}
      hoehe={HOEHE}
      title={titel(title, 'Maßzeichnung eines Schließzylinders')}
      className={className}
    >
      <Raster breite={BREITE} hoehe={HOEHE} />

      {/* Zylinderkörper */}
      <g className="sm24-reveal" style={motionStyle(0)}>
        {knauf && (
          <>
            <rect
              className="fill-surface stroke-foreground"
              strokeWidth={KONTUR}
              x={knauf.hals.x}
              y={knauf.hals.y}
              width={knauf.hals.w}
              height={knauf.hals.h}
            />
            <rect
              className="fill-area-muted stroke-foreground"
              strokeWidth={KONTUR}
              x={knauf.kopf.x}
              y={knauf.kopf.y}
              width={knauf.kopf.w}
              height={knauf.kopf.h}
              rx={r(Math.min(3 * s, knauf.kopf.w / 2))}
            />
            <path className="stroke-area-strong" strokeWidth={HILFSLINIE} d={knauf.riffel} />
          </>
        )}
        <path className="fill-surface" d={koerper} />
        <path className="fill-area-muted/60" d={steg} />
        <path className="stroke-foreground-muted" strokeWidth={HILFSLINIE} d={kanten} />
        <path className="stroke-foreground" strokeWidth={KONTUR} d={koerper} />
        <path className="fill-area stroke-area-strong" strokeWidth={LINIE} d={bart} />
        <circle
          className="fill-surface stroke-area-strong"
          strokeWidth={LINIE}
          cx={X(0)}
          cy={Y(ACHSE)}
          r={r(1.3 * s)}
        />
        <path className="stroke-foreground-muted" strokeWidth={HILFSLINIE} d={gewinde} />
        <circle
          className="fill-surface stroke-foreground"
          strokeWidth={LINIE}
          cx={X(0)}
          cy={Y(LOCH_Y)}
          r={r(LOCH_R * s)}
        />
      </g>

      {/* Mittellinien: Kernachse und Bezug Stulpschraube */}
      <g className="sm24-reveal" style={motionStyle(0.15)}>
        <path
          className="stroke-foreground-muted"
          strokeWidth={HILFSLINIE}
          strokeDasharray={MITTELLINIE}
          d={`M${r(X(minMm) - 10)} ${Y(ACHSE)}H${r(X(maxMm) + 10)}`}
        />
        <path
          className="stroke-area-strong"
          strokeWidth={HILFSLINIE}
          strokeDasharray={MITTELLINIE}
          d={`M${X(0)} ${r(massY - 10)}V${r(unten + 12)}`}
        />
        <path
          className="stroke-area-strong"
          strokeWidth={HILFSLINIE}
          d={`M${X(-4.6)} ${Y(LOCH_Y)}H${X(4.6)}`}
        />
      </g>

      {/* Maßketten */}
      {masse.map((m, i) => {
        const aussenX = m.von === 0 ? X(m.bis) : X(m.von);
        const x1 = X(m.von);
        const x2 = X(m.bis);
        const start = 0.35 + i * 0.2;
        return (
          <g key={m.text}>
            <path
              className="sm24-draw stroke-foreground-muted"
              pathLength={1}
              style={motionStyle(start)}
              strokeWidth={HILFSLINIE}
              d={`M${aussenX} ${r(Y(0) - 5)}V${r(massY - 6)}`}
            />
            <path
              className="sm24-draw stroke-area-strong"
              pathLength={1}
              style={motionStyle(start + 0.15, 0.9)}
              strokeWidth={LINIE}
              d={`M${r(x1 + 2)} ${massY}H${r(x2 - 2)}`}
            />
            <path
              className="sm24-pop fill-area-strong"
              style={motionStyle(start + 0.8)}
              d={pfeilspitze(x1, massY, 180, 8, 5.5)}
            />
            <path
              className="sm24-pop fill-area-strong"
              style={motionStyle(start + 0.8)}
              d={pfeilspitze(x2, massY, 0, 8, 5.5)}
            />
            <text
              className="sm24-reveal fill-foreground-muted font-mono"
              style={motionStyle(start + 0.9)}
              fontSize={SCHRIFT}
              fontWeight={600}
              textAnchor="middle"
              x={r((x1 + x2) / 2)}
              y={r(massY - 8)}
            >
              {m.text}
            </text>
          </g>
        );
      })}

      {/* Seiten und Bezugspunkt */}
      <g className="sm24-reveal" style={motionStyle(1.4)}>
        <text
          className="fill-foreground-muted font-mono"
          fontSize={SCHRIFT}
          textAnchor="end"
          x={r(X(minMm) - 12)}
          y={beschriftungY}
        >
          außen
        </text>
        <text
          className="fill-foreground-muted font-mono"
          fontSize={SCHRIFT}
          textAnchor="start"
          x={r(X(maxMm) + 12)}
          y={beschriftungY}
        >
          innen
        </text>
        <text
          className="fill-foreground-muted font-mono"
          fontSize={SCHRIFT_KLEIN}
          textAnchor="middle"
          x={mitteX}
          y={r(unten + 28)}
        >
          {mitteText}
        </text>
      </g>
    </GrafikRahmen>
  );
}
