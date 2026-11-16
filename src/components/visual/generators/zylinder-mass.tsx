import type { VisualProps } from '../registry';
import { motionStyle } from '../motion/motion-style';
import {
  GrafikRahmen,
  HILFSLINIE,
  KONTUR,
  LINIE,
  MITTELLINIE,
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

/**
 * Zeichenfläche je Format. „schmal“ ist für Telefonbreiten (unter 640 px): kleinere Fläche.
 *
 * Schrift auf dem Bildschirm (FA-26-01, FA-QA-04D) = Schrift × Darstellungsbreite / Flächenbreite.
 * Schmal ist bei 360 px Fensterbreite am schmalsten in der Karte der Startseite (Leiste mit 4/5
 * Kartenbreite und `px-6`, etwa 206 px): 21 × 206 / 300 ≈ 14,4 px; im Seitenkopf
 * `/gleichschliessende-zylinder` (16/9, durch die Höhe begrenzt, etwa 245 px) ≈ 17 px. Breit steht
 * auch auf dem Telefon, im Konfigurator für Schließanlagen (Kasten mit `p-3`, etwa 294 px):
 * 23 × 294 / 480 ≈ 14,1 px; bei 1280 px in der Karte der Startseite (etwa 522 px) ≈ 25 px.
 *
 * „außen“, „innen“, „Mitte Stulpschraube“ und „Überstand“ stehen in Zeilen unter dem Zylinder;
 * `rand` ist nur noch der Abstand des Zylinders zum Rand.
 */
const FLAECHE = {
  breit: { breite: 480, hoehe: 270, rand: 24, schrift: 23, klein: 23 },
  schmal: { breite: 300, hoehe: 220, rand: 14, schrift: 21, klein: 21 },
} as const;
export const ZYLINDER_SCHRIFT = { breit: FLAECHE.breit.schrift, schmal: FLAECHE.schmal.schrift } as const;
/** Zeilenabstand der Beschriftung unter dem Zylinder, je Schriftgröße. */
const ZEILE = 1.3;
/** Abstand der ersten Zeile unter dem Zylinder (Raum für Bezugslinie und Türblatt). */
const UNTER_ZYLINDER = 14;
/** Zusätzlicher Abstand unter der Strecke „Überstand“. */
const UNTER_STRECKE = 10;
/** Abstand der Seitenbeschriftung zur Bezugslinie der Stulpschraube. */
const SEITE_ABSTAND = 8;
/** Kleinster Abstand einer Beschriftung zum Rand der Fläche. */
const TEXT_RAND = 4;

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

const MAX_SKALA = 4;

/*
 * Schutzbeschlag, Türblatt und Überstand sind schematisch: Maße in der Zeichenfläche,
 * ohne Zahlenangabe, weil das Fachwissen keinen zulässigen Überstand nennt.
 * Maß A und B bleiben maßstäblich.
 */
const AN_AUS = ['an', 'aus'] as const;
const BESCHLAG_DICKE = 6;
const BESCHLAG_UEBERHANG = 8;
const TUER_UEBERHANG = 14;
const UEBERSTAND_LAENGE = 18;

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
 * - `innen`: Maß B (innen) in mm, 25–100 (Standard 30; bei `profil-halb` ohne Wirkung)
 * - `knaufseite`: `innen` (Standard) | `aussen` — nur bei `knauf`
 * - `format`: `breit` (Standard, 480 × 270) | `schmal` (300 × 220, größere Schrift für Telefone)
 * - `beschlag`: `aus` (Standard) | `an`. Schutzbeschlag außen mit Türblatt, schematisch; bei `knaufseite: 'aussen'` ohne Wirkung.
 * - `ueberstand`: `an` (Standard) | `aus`. Strecke „Überstand“ vom Zylinderende bis zum Beschlag, ohne Zahl; nur mit `beschlag: 'an'`.
 *
 * Gemessen wird von der Mitte der Stulpschraube bis zum Zylinderende. Das gilt auch mit Beschlag.
 */
export function ZylinderMassGrafik({ params, title, className }: VisualProps) {
  const p = parameter(params);
  const bauform = auswahl(wert(p, 'bauform'), BAUFORMEN, 'profil-doppel');
  const halb = bauform === 'profil-halb';
  const aussen = zahl(wert(p, 'aussen'), 25, 100, 30);
  const innen = zahl(wert(p, 'innen'), 25, 100, 30);
  const knaufseite =
    bauform === 'knauf' ? auswahl(wert(p, 'knaufseite'), KNAUFSEITEN, 'innen') : undefined;
  const f = FLAECHE[auswahl(wert(p, 'format'), FORMATE, 'breit')];
  /* Der Beschlag sitzt außen am Profil; mit Außenknauf entfällt er, weil der Knauf dann außen liegt. */
  const beschlag = auswahl(wert(p, 'beschlag'), AN_AUS, 'aus') === 'an' && knaufseite !== 'aussen';
  const ueberstand = beschlag && auswahl(wert(p, 'ueberstand'), AN_AUS, 'an') === 'an';

  /* Waagerecht in mm: außen links (negativ), innen rechts (positiv). */
  const links = -aussen;
  const rechts = halb ? HALB_STUMPF : innen;
  const knaufMass = KNAUF_HALS + KNAUF_LAENGE;
  const minMm = links - (knaufseite === 'aussen' ? knaufMass : 0);
  const maxMm = rechts + (knaufseite === 'innen' ? knaufMass : 0);

  /*
   * Senkrecht, von oben: Maßzahl (Oberlänge 0,75 em), Maßlinie 8 darunter, 24 bis zum Zylinder,
   * der Zylinder, darunter die Zeilen „Überstand“ (mit Strecke), „außen | innen“ und
   * „Mitte Stulpschraube“. Der Maßstab folgt der Breite und der Höhe; der Block steht mittig.
   * Für den Maßstab zählt immer der Platz aller drei Zeilen (mit Strecke „Überstand“): So bleibt
   * der Maßstab mit und ohne Schutzbeschlag gleich, und Maß A und B stehen an denselben Stellen
   * (E5-GRAFIKER-01).
   */
  const zeile = r(f.schrift * ZEILE);
  const zeilen = ueberstand ? 3 : 2;
  const massRel = f.schrift * 0.75 + 8;
  const obenRel = massRel + 24;
  const ersteRel = UNTER_ZYLINDER + f.schrift * 0.75 + (ueberstand ? UNTER_STRECKE : 0);
  const untenText = ersteRel + (zeilen - 1) * zeile + f.schrift * 0.25;
  const untenPlatz = UNTER_ZYLINDER + f.schrift * 0.75 + UNTER_STRECKE + 2 * zeile + f.schrift * 0.25;
  const sHoehe = (f.hoehe - 2 * TEXT_RAND - obenRel - untenPlatz) / PROFIL_HOEHE;
  const s = Math.min((f.breite - 2 * f.rand) / (maxMm - minMm), MAX_SKALA, sHoehe);
  const nullX = f.breite / 2 - ((minMm + maxMm) / 2) * s;
  const blockHoehe = obenRel + PROFIL_HOEHE * s + untenText;
  const oben = (f.hoehe - blockHoehe) / 2 + obenRel;
  const X = (mm: number) => r(nullX + mm * s);
  const Y = (mm: number) => r(oben + mm * s);

  const ecke = r(Math.min(1.5 * s, 4));
  const unten = Y(PROFIL_HOEHE);
  const massY = r(oben - 24);
  /* Platte am Außenende, Türblatt bis zur Innenseite; der Überstand liegt zwischen Zylinderende und Platte. */
  const beschlagX = r(X(links) + UEBERSTAND_LAENGE);
  const tuerX = r(beschlagX + BESCHLAG_DICKE);
  const ueberY = r(unten + TUER_UEBERHANG);
  /* Grundlinien der Zeilen unter dem Zylinder. */
  const ersteY = r(unten + ersteRel);
  const ueberTextY = ersteY;
  const seitenY = r(ersteY + (ueberstand ? zeile : 0));
  const mitteY = r(seitenY + zeile);

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
  if (!halb) masse.push({ von: 0, bis: rechts, text: `B ${mass(innen)}` });

  const mitteText = 'Mitte Stulpschraube';
  const mitteBreite = mitteText.length * f.klein * 0.6;
  const mitteX = r(
    Math.min(f.breite - TEXT_RAND - mitteBreite / 2, Math.max(TEXT_RAND + mitteBreite / 2, X(0))),
  );
  /* „außen“ links, „innen“ rechts der Bezugslinie; am Rand rückt das Paar nach innen. */
  const seiteBreite = 5 * f.schrift * 0.6;
  const seitenX = r(
    Math.min(
      f.breite - TEXT_RAND - SEITE_ABSTAND - seiteBreite,
      Math.max(TEXT_RAND + SEITE_ABSTAND + seiteBreite, X(0)),
    ),
  );

  return (
    <GrafikRahmen
      breite={f.breite}
      hoehe={f.hoehe}
      title={titel(title, 'Maßzeichnung eines Schließzylinders')}
      className={className}
    >
      <Raster breite={f.breite} hoehe={f.hoehe} />

      {/* Türblatt liegt hinter dem Zylinder (schematisch) */}
      {beschlag && (
        <g className="sm24-reveal" style={motionStyle(0)}>
          <rect
            className="fill-surface-muted stroke-border-strong"
            strokeWidth={HILFSLINIE}
            x={tuerX}
            y={r(oben - TUER_UEBERHANG)}
            width={r(X(rechts) - tuerX)}
            height={r(PROFIL_HOEHE * s + 2 * TUER_UEBERHANG)}
          />
        </g>
      )}

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

      {/* Schutzbeschlag liegt vor dem Zylinder auf der Außenseite der Tür (schematisch) */}
      {beschlag && (
        <g className="sm24-reveal" style={motionStyle(0)}>
          <rect
            className="fill-area-muted stroke-foreground"
            strokeWidth={LINIE}
            x={beschlagX}
            y={r(oben - BESCHLAG_UEBERHANG)}
            width={BESCHLAG_DICKE}
            height={r(PROFIL_HOEHE * s + 2 * BESCHLAG_UEBERHANG)}
          />
        </g>
      )}

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
        /* Maßzahl mittig über der Maßlinie; ist die Linie kürzer als die Zahl, rückt sie von der
           Stulpschraube nach außen (A links, B rechts), ohne die Fläche zu verlassen. */
        const zahlBreite = [...m.text].length * f.schrift * 0.6;
        const zahlMitte =
          Math.abs(x2 - x1) >= zahlBreite + 6
            ? (x1 + x2) / 2
            : m.von === 0
              ? X(0) + 4 + zahlBreite / 2
              : X(0) - 4 - zahlBreite / 2;
        const zahlX = Math.min(f.breite - TEXT_RAND - zahlBreite / 2, Math.max(TEXT_RAND + zahlBreite / 2, zahlMitte));
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
              fontSize={f.schrift}
              fontWeight={600}
              textAnchor="middle"
              x={r(zahlX)}
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
          fontSize={f.schrift}
          textAnchor="end"
          x={r(seitenX - SEITE_ABSTAND)}
          y={seitenY}
        >
          außen
        </text>
        <text
          className="fill-foreground-muted font-mono"
          fontSize={f.schrift}
          textAnchor="start"
          x={r(seitenX + SEITE_ABSTAND)}
          y={seitenY}
        >
          innen
        </text>
        <text
          className="fill-foreground-muted font-mono"
          fontSize={f.klein}
          textAnchor="middle"
          x={mitteX}
          y={mitteY}
        >
          {mitteText}
        </text>
      </g>

      {/* Überstand: Strecke vom Zylinderende bis zur Platte, ohne Zahlenangabe */}
      {ueberstand && (
        <g className="sm24-reveal" style={motionStyle(1.4)}>
          <path
            className="stroke-foreground-muted"
            strokeWidth={HILFSLINIE}
            d={`M${X(links)} ${r(unten + 4)}V${r(ueberY + 3)}M${beschlagX} ${r(unten + BESCHLAG_UEBERHANG + 2)}V${r(ueberY + 3)}`}
          />
          <path
            className="stroke-foreground-muted"
            strokeWidth={LINIE}
            d={`M${r(X(links) + 2)} ${ueberY}H${r(beschlagX - 2)}`}
          />
          <path className="fill-foreground-muted" d={pfeilspitze(X(links), ueberY, 180, 6, 4.5)} />
          <path className="fill-foreground-muted" d={pfeilspitze(beschlagX, ueberY, 0, 6, 4.5)} />
          <text
            className="fill-foreground-muted font-mono"
            fontSize={f.schrift}
            fontWeight={600}
            textAnchor="start"
            x={r(Math.max(TEXT_RAND, Math.min(X(links), f.breite - TEXT_RAND - 9 * f.schrift * 0.6)))}
            y={ueberTextY}
          >
            Überstand
          </text>
        </g>
      )}
    </GrafikRahmen>
  );
}
