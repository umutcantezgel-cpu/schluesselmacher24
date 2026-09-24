import type { ReactNode } from 'react';

import type { VisualProps } from '../registry';
import { motionStyle } from '../motion/motion-style';
import {
  GrafikRahmen,
  HILFSLINIE,
  KONTUR,
  LINIE,
  Raster,
  SCHRIFT_KLEIN,
  auswahl,
  hash,
  kurztext,
  parameter,
  r,
  titel,
  wert,
  zahl,
  zahlenfolge,
  ziffern,
} from './grafik-basis';

const BREITE = 480;
const HOEHE = 270;

const TYPEN = ['zylinder', 'buntbart', 'klapp', 'funk', 'smart-key', 'transponder'] as const;
type Typ = (typeof TYPEN)[number];

/** Ruhiges Standardprofil, wenn weder `einschnitte` noch `code` angegeben sind. */
const STANDARD_PROFIL = [2, 6, 3, 7, 1, 5];
/** Größter Tiefensprung zwischen Nachbarn (wie bei echten Schließungen begrenzt). */
const MAX_SPRUNG = 6;

/** Versatz jeder weiteren Kopie nach rechts oben. */
const KOPIE_DX = 18;
const KOPIE_DY = -18;

/**
 * Leitet aus einem Code deterministisch ein Einschnittprofil ab. Das ist
 * eine Darstellung, keine echte Schließung — deshalb ohne Ziffern-Beschriftung.
 */
function profilAusCode(code: string): number[] {
  const naechste = zahlenfolge(hash(code.toUpperCase().replace(/\s+/g, '')));
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

/** Gleichmäßig verteilte Positionen zwischen `von` und `bis`. */
function positionen(anzahl: number, von: number, bis: number): number[] {
  if (anzahl <= 1) return [(von + bis) / 2];
  const schritt = (bis - von) / (anzahl - 1);
  return Array.from({ length: anzahl }, (_, i) => von + i * schritt);
}

/**
 * Kantenverlauf mit V-Einschnitten (flacher Grund, schräge Flanken) als
 * Punkte `[x, tiefe]`; Tiefe 0 liegt auf der unberührten Kante.
 */
function kerben(pos: number[], tiefen: number[], flach: number, steigung: number): [number, number][] {
  const punkte: [number, number][] = [];
  const n = pos.length;
  punkte.push([pos[0] - flach / 2 - tiefen[0] / steigung, 0]);
  for (let i = 0; i < n; i += 1) {
    punkte.push([pos[i] - flach / 2, tiefen[i]]);
    punkte.push([pos[i] + flach / 2, tiefen[i]]);
    if (i < n - 1) {
      const a = pos[i] + flach / 2;
      const b = pos[i + 1] - flach / 2;
      const linksOben = a + tiefen[i] / steigung;
      const rechtsOben = b - tiefen[i + 1] / steigung;
      if (linksOben <= rechtsOben) {
        punkte.push([linksOben, 0], [rechtsOben, 0]);
      } else {
        const x = Math.min(b, Math.max(a, (tiefen[i] - tiefen[i + 1]) / (2 * steigung) + (a + b) / 2));
        const t = Math.max(tiefen[i] - (x - a) * steigung, tiefen[i + 1] - (b - x) * steigung, 0);
        punkte.push([x, t]);
      }
    }
  }
  punkte.push([pos[n - 1] + flach / 2 + tiefen[n - 1] / steigung, 0]);
  return punkte;
}

function linie(punkte: [number, number][]): string {
  return punkte.map(([x, y]) => `L${r(x)} ${r(y)}`).join('');
}

interface Farben {
  metall: string;
  kopf: string;
  detail: string;
  flaeche: string;
  knopf: string;
  akzent: string;
  spur: string;
}

const VORN: Farben = {
  metall: 'fill-surface stroke-foreground',
  kopf: 'fill-area-muted stroke-foreground',
  detail: 'stroke-foreground-muted',
  flaeche: 'fill-area-muted',
  knopf: 'fill-surface stroke-foreground',
  akzent: 'fill-area',
  spur: 'stroke-area-muted',
};

const HINTEN: Farben = {
  metall: 'fill-surface stroke-border-strong',
  kopf: 'fill-area-soft stroke-border-strong',
  detail: 'stroke-border-strong',
  flaeche: 'fill-area-soft',
  knopf: 'fill-surface stroke-border-strong',
  akzent: 'fill-area-muted',
  spur: 'stroke-area-soft',
};

interface Zeichnung {
  koerper: ReactNode;
  /** Kanten mit Einschnitten, die sich nachzeichnen (nur vorne). */
  profile: string[];
  /** Grund der Einschnitte. */
  marken: { x: number; y: number }[];
  /** Lineal unter dem Bart: y-Lage. */
  linealY?: number;
  /** Nur vorne: Funkbögen, Klapppfeil. */
  zusatz?: ReactNode;
  box: { x1: number; y1: number; x2: number; y2: number };
}

/* ---------- Glyphen auf Tasten (keine Logos) ---------- */

function schlossGlyphe(x: number, y: number, offen: boolean, klasse: string) {
  const buegel = offen
    ? `M${r(x + 3.2)} ${r(y - 1)}V${r(y - 5)}A3.2 3.2 0 0 0 ${r(x - 3.2)} ${r(y - 5)}V${r(y - 3.6)}`
    : `M${r(x - 3.2)} ${r(y - 1)}V${r(y - 4)}A3.2 3.2 0 0 1 ${r(x + 3.2)} ${r(y - 4)}V${r(y - 1)}`;
  return (
    <g className={klasse} strokeWidth={LINIE}>
      <rect x={r(x - 5)} y={r(y - 1)} width={10} height={8} rx={1.6} />
      <path d={buegel} />
    </g>
  );
}

function taste(x: number, y: number, radius: number, f: Farben, glyphe?: 'zu' | 'auf') {
  return (
    <g key={`${x}-${y}`}>
      <circle className={f.knopf} strokeWidth={LINIE} cx={x} cy={y} r={radius} />
      {glyphe && schlossGlyphe(x, y - 1.5, glyphe === 'auf', f.detail)}
    </g>
  );
}

function funkboegen(x: number, y: number, von: number, bis: number, radien: number[]) {
  return radien.map((radius, i) => {
    const a1 = (von * Math.PI) / 180;
    const a2 = (bis * Math.PI) / 180;
    const d = `M${r(x + radius * Math.cos(a1))} ${r(y + radius * Math.sin(a1))}A${radius} ${radius} 0 0 1 ${r(x + radius * Math.cos(a2))} ${r(y + radius * Math.sin(a2))}`;
    return (
      <path
        key={radius}
        className="sm24-dash stroke-area"
        style={motionStyle(0, 1.6 + i * 0.2)}
        strokeWidth={LINIE}
        d={d}
      />
    );
  });
}

/* ---------- Schlüsseltypen (lokale Koordinaten, Achse des Barts bei y = 0) ---------- */

function zylinder(tiefenZiffern: number[], f: Farben): Zeichnung {
  const oben = -22;
  const unten = 26;
  const spitze = 372;
  const pos = positionen(tiefenZiffern.length, 176, 326);
  const tiefen = tiefenZiffern.map((d) => 4 + d * 2.6);
  const kante = kerben(pos, tiefen, 4.5, 1.2).map(([x, t]): [number, number] => [x, oben + t]);
  const umriss = `M108 -30H150V${oben}${linie(kante)}L${spitze - 20} ${oben}L${spitze} -6V20L${spitze - 6} ${unten}H150V30H108Z`;
  const kopf =
    'M40 -54H76A40 40 0 0 1 116 -14V14A40 40 0 0 1 76 54H40A40 40 0 0 1 0 14V-14A40 40 0 0 1 40 -54Z' +
    'M46 0A12 12 0 1 0 22 0A12 12 0 1 0 46 0Z';
  return {
    koerper: (
      <>
        <path className={f.metall} strokeWidth={KONTUR} d={umriss} />
        <rect className={f.flaeche} x={156} y={9} width={spitze - 168} height={5} rx={2.5} />
        <path className={f.detail} strokeWidth={HILFSLINIE} d={`M156 19.5H${spitze - 8}`} />
        <path className={f.kopf} strokeWidth={KONTUR} fillRule="evenodd" d={kopf} />
      </>
    ),
    profile: [`M150 ${oben}${linie(kante)}L${spitze - 20} ${oben}`],
    marken: pos.map((x, i) => ({ x, y: oben + tiefen[i] })),
    linealY: unten + 18,
    box: { x1: 0, y1: -54, x2: spitze, y2: 54 },
  };
}

function beidseitigerBart(tiefenZiffern: number[], start: number, spitze: number) {
  const oben = -22;
  const unten = 22;
  const pos = positionen(tiefenZiffern.length, start + 24, spitze - 46);
  const tiefen = tiefenZiffern.map((d) => 3 + d * 1.35);
  const roh = kerben(pos, tiefen, 4, 1.1);
  const kanteOben = roh.map(([x, t]): [number, number] => [x, oben + t]);
  const kanteUnten = roh.map(([x, t]): [number, number] => [x, unten - t]).reverse();
  const umriss = `M${start} ${oben}${linie(kanteOben)}L${spitze - 16} ${oben}L${spitze} -8V8L${spitze - 16} ${unten}${linie(kanteUnten)}L${start} ${unten}Z`;
  return {
    umriss,
    profile: [
      `M${start} ${oben}${linie(kanteOben)}L${spitze - 16} ${oben}`,
      `M${start} ${unten}${linie([...kanteUnten].reverse())}L${spitze - 16} ${unten}`,
    ],
    marken: pos.flatMap((x, i) => [
      { x, y: oben + tiefen[i] },
      { x, y: unten - tiefen[i] },
    ]),
    linealY: unten + 18,
  };
}

function transponder(tiefenZiffern: number[], f: Farben): Zeichnung {
  const spitze = 376;
  const bart = beidseitigerBart(tiefenZiffern, 162, spitze);
  const kopf =
    'M34 -58H96C122 -58 140 -46 146 -34L152 -28V28L146 34C140 46 122 58 96 58H34A34 34 0 0 1 0 24V-24A34 34 0 0 1 34 -58Z' +
    'M30 0A8 8 0 1 0 14 0A8 8 0 1 0 30 0Z';
  const pins = [-8, 0, 8]
    .flatMap((v) => [
      `M${66 - 6} ${v}H66`,
      `M98 ${v}H${98 + 6}`,
      `M${82 + v} -22V-16`,
      `M${82 + v} 16V22`,
    ])
    .join('');
  return {
    koerper: (
      <>
        <path className={f.metall} strokeWidth={KONTUR} d={bart.umriss} />
        <path className={f.detail} strokeWidth={HILFSLINIE} d={`M168 0H${spitze - 22}`} />
        <rect className={f.metall} strokeWidth={KONTUR} x={148} y={-28} width={14} height={56} rx={3} />
        <path className={f.kopf} strokeWidth={KONTUR} fillRule="evenodd" d={kopf} />
        <path className={f.detail} strokeWidth={LINIE} d={pins} />
        <rect className={f.metall} strokeWidth={LINIE} x={66} y={-16} width={32} height={32} rx={4} />
        <rect className={f.akzent} x={75} y={-7} width={14} height={14} rx={2} />
      </>
    ),
    profile: bart.profile,
    marken: bart.marken,
    linealY: bart.linealY,
    box: { x1: 0, y1: -58, x2: spitze, y2: 58 },
  };
}

function funk(tiefenZiffern: number[], f: Farben): Zeichnung {
  const spitze = 372;
  const bart = beidseitigerBart(tiefenZiffern, 160, spitze);
  const gehaeuse =
    'M44 -62H104C132 -62 150 -44 150 -20V20C150 44 132 62 104 62H44A44 44 0 0 1 0 18V-18A44 44 0 0 1 44 -62Z';
  return {
    koerper: (
      <>
        <path className={f.metall} strokeWidth={KONTUR} d={bart.umriss} />
        <path className={f.detail} strokeWidth={HILFSLINIE} d={`M166 0H${spitze - 22}`} />
        <rect className={f.metall} strokeWidth={KONTUR} x={146} y={-26} width={14} height={52} rx={3} />
        <path className={f.kopf} strokeWidth={KONTUR} d={gehaeuse} />
        {taste(72, -24, 16, f, 'zu')}
        {taste(72, 24, 16, f, 'auf')}
        <circle className={f.akzent} cx={118} cy={-38} r={3.5} />
      </>
    ),
    profile: bart.profile,
    marken: bart.marken,
    linealY: bart.linealY,
    zusatz: funkboegen(-6, 0, 150, 210, [18, 31, 44]),
    box: { x1: -50, y1: -62, x2: spitze, y2: 62 },
  };
}

function klapp(tiefenZiffern: number[], f: Farben): Zeichnung {
  const spitze = 380;
  const oben = -17;
  const unten = 17;
  const drehpunkt = { x: 166, y: 0 };
  const pos = positionen(tiefenZiffern.length, 204, 348);
  const spur = tiefenZiffern.map((d) => (d - 4.5) * 2.2);
  const spurPunkte: [number, number][] = [[184, 0]];
  pos.forEach((x, i) => {
    spurPunkte.push([x - 5, spur[i]], [x + 5, spur[i]]);
  });
  spurPunkte.push([spitze - 14, spur[spur.length - 1]]);
  const spurPfad = `M${spurPunkte.map(([x, y]) => `${r(x)} ${r(y)}`).join('L')}`;
  const gehaeuse =
    'M40 -46H136A24 24 0 0 1 160 -22V22A24 24 0 0 1 136 46H40A40 40 0 0 1 0 6V-6A40 40 0 0 1 40 -46Z';
  const bogenR = 36;
  const bogenStart = -12;
  const bogenEnde = -96;
  const punkt = (winkel: number): [number, number] => [
    drehpunkt.x + bogenR * Math.cos((winkel * Math.PI) / 180),
    drehpunkt.y + bogenR * Math.sin((winkel * Math.PI) / 180),
  ];
  const [sx, sy] = punkt(bogenStart);
  const [ex, ey] = punkt(bogenEnde);
  const tangente = bogenEnde - 90;
  const spitzeLaenge = 7;
  const pfeil = `M${r(ex)} ${r(ey)}L${r(ex - Math.cos(((tangente + 25) * Math.PI) / 180) * spitzeLaenge)} ${r(ey - Math.sin(((tangente + 25) * Math.PI) / 180) * spitzeLaenge)}M${r(ex)} ${r(ey)}L${r(ex - Math.cos(((tangente - 25) * Math.PI) / 180) * spitzeLaenge)} ${r(ey - Math.sin(((tangente - 25) * Math.PI) / 180) * spitzeLaenge)}`;
  return {
    koerper: (
      <>
        <path
          className={f.metall}
          strokeWidth={KONTUR}
          d={`M176 ${oben}H${spitze - 10}L${spitze} -8V8L${spitze - 10} ${unten}H176Z`}
        />
        <path
          className={f.spur}
          strokeWidth={10}
          strokeLinejoin="round"
          strokeLinecap="round"
          d={spurPfad}
        />
        <path className={f.kopf} strokeWidth={KONTUR} d={gehaeuse} />
        <rect className={f.metall} strokeWidth={KONTUR} x={154} y={-20} width={24} height={40} rx={5} />
        <circle className={f.knopf} strokeWidth={LINIE} cx={drehpunkt.x} cy={drehpunkt.y} r={5} />
        {taste(44, 0, 15, f, 'zu')}
        {taste(86, 0, 15, f, 'auf')}
        <circle className={`${f.akzent} ${f.detail}`} strokeWidth={LINIE} cx={128} cy={0} r={9} />
      </>
    ),
    profile: [spurPfad],
    marken: pos.map((x, i) => ({ x, y: spur[i] })),
    linealY: unten + 18,
    zusatz: (
      <path
        className="sm24-draw stroke-area-strong"
        pathLength={1}
        style={motionStyle(1.2, 0.8)}
        strokeWidth={LINIE}
        d={`M${r(sx)} ${r(sy)}A${bogenR} ${bogenR} 0 0 0 ${r(ex)} ${r(ey)}${pfeil}`}
      />
    ),
    box: { x1: 0, y1: -46, x2: spitze, y2: 46 },
  };
}

function smartKey(f: Farben): Zeichnung {
  const fob =
    'M48 -86H76A48 48 0 0 1 124 -38V38A48 48 0 0 1 76 86H48A48 48 0 0 1 0 38V-38A48 48 0 0 1 48 -86Z' +
    'M50 -74H74A4 4 0 0 1 74 -66H50A4 4 0 0 1 50 -74Z';
  return {
    koerper: (
      <>
        <path className={f.kopf} strokeWidth={KONTUR} fillRule="evenodd" d={fob} />
        <path className={f.detail} strokeWidth={HILFSLINIE} d="M9 64H115" />
        {taste(62, -30, 15, f, 'zu')}
        {taste(62, 10, 15, f, 'auf')}
        <circle className={f.knopf} strokeWidth={LINIE} cx={62} cy={44} r={8} />
      </>
    ),
    profile: [],
    marken: [],
    zusatz: funkboegen(132, -8, -35, 35, [20, 34, 48]),
    box: { x1: 0, y1: -86, x2: 184, y2: 86 },
  };
}

function buntbart(tiefenZiffern: number[], f: Farben): Zeichnung {
  const n = tiefenZiffern.length;
  const breite = 13;
  const rechts = 336;
  const links = rechts - n * breite;
  const grund = 72;
  const stufen = tiefenZiffern.map((d) => grund - d * 3.6);
  let bartKante = '';
  for (let j = n - 1; j >= 0; j -= 1) {
    bartKante += `V${r(stufen[j])}H${r(links + j * breite)}`;
  }
  const umriss = `M102 -8H${rechts}A8 8 0 0 1 ${rechts} 8${bartKante}V8H102Z`;
  let profil = `M${rechts} 8`;
  for (let j = n - 1; j >= 0; j -= 1) profil += `V${r(stufen[j])}H${r(links + j * breite)}`;
  profil += 'V8';
  const reide = 'M94 0A46 46 0 1 0 2 0A46 46 0 1 0 94 0ZM75 0A27 27 0 1 0 21 0A27 27 0 1 0 75 0Z';
  return {
    koerper: (
      <>
        <path className={f.metall} strokeWidth={KONTUR} d={umriss} />
        <path className={f.flaeche} d={`M108 -3.5H${rechts - 6}V-1H108Z`} />
        <rect className={f.metall} strokeWidth={KONTUR} x={88} y={-14} width={16} height={28} rx={5} />
        <path className={f.kopf} strokeWidth={KONTUR} fillRule="evenodd" d={reide} />
      </>
    ),
    profile: [profil],
    marken: tiefenZiffern.map((_, j) => ({ x: links + (j + 0.5) * breite, y: stufen[j] })),
    linealY: grund + 16,
    box: { x1: 2, y1: -46, x2: rechts + 8, y2: grund },
  };
}

function zeichnung(typ: Typ, tiefen: number[], f: Farben): Zeichnung {
  switch (typ) {
    case 'buntbart':
      return buntbart(tiefen, f);
    case 'klapp':
      return klapp(tiefen, f);
    case 'funk':
      return funk(tiefen, f);
    case 'smart-key':
      return smartKey(f);
    case 'transponder':
      return transponder(tiefen, f);
    default:
      return zylinder(tiefen, f);
  }
}

const TITEL: Record<Typ, string> = {
  zylinder: 'Zylinderschlüssel, Seitenansicht',
  buntbart: 'Buntbartschlüssel, Seitenansicht',
  klapp: 'Klappschlüssel mit Funktasten',
  funk: 'Funkschlüssel mit festem Bart',
  'smart-key': 'Smart-Key',
  transponder: 'Schlüssel mit Transponder im Kopf',
};

/**
 * Schlüssel in Seitenansicht — Reide, Halsstück, Bart mit Einschnitten.
 *
 * params:
 * - `typ`: `zylinder` (Standard) | `buntbart` | `klapp` | `funk` | `smart-key` | `transponder`
 * - `einschnitte`: 4–8 Ziffern 0–9, Vorrang vor `code`; werden unter dem Bart beschriftet
 * - `code`: Text — ergibt deterministisch ein Einschnittprofil (ohne Beschriftung)
 * - `anzahl`: 1–3 (Standard 1), weitere Schlüssel versetzt dahinter, z. B. für „Kopie“
 */
export function SchluesselGrafik({ params, title, className }: VisualProps) {
  const p = parameter(params);
  const typ = auswahl(wert(p, 'typ'), TYPEN, 'zylinder');
  const explizit = ziffern(wert(p, 'einschnitte'), 4, 8);
  const code = kurztext(wert(p, 'code'), 40);
  const tiefen = explizit ?? (code ? profilAusCode(code) : STANDARD_PROFIL);
  const anzahl = zahl(wert(p, 'anzahl'), 1, 3, 1, true);

  const vorn = zeichnung(typ, tiefen, VORN);
  const hinten = anzahl > 1 ? zeichnung(typ, tiefen, HINTEN) : undefined;

  const linealY = vorn.linealY;
  const teilung = [...new Set(vorn.marken.map((m) => r(m.x)))];
  const lineal =
    linealY !== undefined && teilung.length > 0
      ? `M${teilung[0]} ${linealY}H${teilung[teilung.length - 1]}` +
        teilung.map((x) => `M${x} ${linealY - 4}V${linealY + 4}`).join('')
      : undefined;
  const beschriften = lineal !== undefined && explizit !== undefined;

  const x1 = vorn.box.x1;
  const x2 = vorn.box.x2 + (anzahl - 1) * KOPIE_DX;
  const y1 = vorn.box.y1 + (anzahl - 1) * KOPIE_DY;
  const y2 =
    lineal !== undefined && linealY !== undefined
      ? Math.max(vorn.box.y2, linealY + (beschriften ? 24 : 6))
      : vorn.box.y2;
  const skala = Math.min(1, (BREITE - 56) / (x2 - x1), (HOEHE - 40) / (y2 - y1));
  const tx = r(BREITE / 2 - (skala * (x1 + x2)) / 2);
  const ty = r(HOEHE / 2 - (skala * (y1 + y2)) / 2);
  const schrift = r(SCHRIFT_KLEIN / skala);

  return (
    <GrafikRahmen
      breite={BREITE}
      hoehe={HOEHE}
      title={titel(title, TITEL[typ])}
      className={className}
    >
      <Raster breite={BREITE} hoehe={HOEHE} />
      <g transform={`translate(${tx} ${ty}) scale(${r(skala * 1000) / 1000})`}>
        {hinten &&
          Array.from({ length: anzahl - 1 }, (_, i) => anzahl - 1 - i).map((stelle) => (
            <g
              key={stelle}
              transform={`translate(${stelle * KOPIE_DX} ${stelle * KOPIE_DY})`}
            >
              <g className="sm24-reveal" style={motionStyle(0.1 * (anzahl - 1 - stelle))}>
                {hinten.koerper}
              </g>
            </g>
          ))}

        <g className="sm24-reveal" style={motionStyle(0.1 * (anzahl - 1))}>
          {vorn.koerper}
        </g>

        {vorn.zusatz}

        {vorn.profile.map((d, i) => (
          <path
            key={d}
            className="sm24-draw stroke-area"
            pathLength={1}
            style={motionStyle(0.45 + i * 0.1, 1.2)}
            strokeWidth={2.5}
            d={d}
          />
        ))}

        {vorn.marken.map((m, i) => (
          <circle
            key={`${r(m.x)}-${r(m.y)}`}
            className="sm24-pop fill-area-strong"
            style={motionStyle(0.9 + i * 0.06)}
            cx={r(m.x)}
            cy={r(m.y)}
            r={2.6}
          />
        ))}

        {lineal && (
          <path
            className="sm24-draw stroke-foreground-muted"
            pathLength={1}
            style={motionStyle(0.6, 1)}
            strokeWidth={HILFSLINIE}
            d={lineal}
          />
        )}

        {beschriften &&
          linealY !== undefined &&
          teilung.map((x, i) => (
            <text
              key={x}
              className="sm24-reveal fill-foreground-muted font-mono"
              style={motionStyle(1.1 + i * 0.05)}
              fontSize={schrift}
              textAnchor="middle"
              x={x}
              y={r(linealY + 20)}
            >
              {tiefen[i]}
            </text>
          ))}
      </g>
    </GrafikRahmen>
  );
}
