import type { ReactNode } from 'react';

import type { VisualProps } from '../registry';
import { motionStyle } from '../motion/motion-style';
import {
  GrafikRahmen,
  HILFSLINIE,
  KONTUR,
  LINIE,
  MITTELLINIE,
  Raster,
  SCHRIFT_KLEIN,
  aussenTangenten,
  auswahl,
  hash,
  kerben,
  kurztext,
  parameter,
  positionen,
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

/** Ansichten des Funkschlüssels für die Fotoplätze (`seite` ist die bisherige Seitenansicht). */
const ANSICHTEN = ['vorn', 'hinten', 'bart', 'detail'] as const;
type Ansicht = (typeof ANSICHTEN)[number];

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
  /** Rohling: Einschnittzone als gestrichelte Linie (noch nicht gefräst). */
  zone?: string;
  box: { x1: number; y1: number; x2: number; y2: number };
}

/* ---------- Glyphen auf Tasten (keine Logos) ---------- */

/**
 * Zustand des Schlosssymbols auf einer Taste. `zu`: geschlossener Bügel. `auf`: geöffnet wie in der
 * Seitenansicht. `auf-hoch`: geöffnet, Bügel angehoben, damit die Öffnung auf der Tastenseite deutlich ist.
 */
type Schloss = 'zu' | 'auf' | 'auf-hoch';

/** Schlossglyphe; `groesse` skaliert nur die Geometrie, die Strichstärke bleibt. */
function schlossGlyphe(x: number, y: number, zustand: Schloss, klasse: string, groesse = 1) {
  const g = (v: number) => v * groesse;
  let buegel: string;
  if (zustand === 'auf-hoch') {
    buegel = `M${r(x + g(3.2))} ${r(y - g(1))}V${r(y - g(6))}A${g(3.2)} ${g(3.2)} 0 0 0 ${r(x - g(3.2))} ${r(y - g(6))}V${r(y - g(4))}`;
  } else if (zustand === 'auf') {
    buegel = `M${r(x + g(3.2))} ${r(y - g(1))}V${r(y - g(5))}A${g(3.2)} ${g(3.2)} 0 0 0 ${r(x - g(3.2))} ${r(y - g(5))}V${r(y - g(3.6))}`;
  } else {
    buegel = `M${r(x - g(3.2))} ${r(y - g(1))}V${r(y - g(4))}A${g(3.2)} ${g(3.2)} 0 0 1 ${r(x + g(3.2))} ${r(y - g(4))}V${r(y - g(1))}`;
  }
  return (
    <g className={klasse} strokeWidth={LINIE}>
      <rect x={r(x - g(5))} y={r(y - g(1))} width={g(10)} height={g(8)} rx={g(1.6)} />
      <path d={buegel} />
    </g>
  );
}

function taste(x: number, y: number, radius: number, f: Farben, glyphe?: Schloss, groesse = 1) {
  return (
    <g key={`${x}-${y}`}>
      <circle className={f.knopf} strokeWidth={LINIE} cx={x} cy={y} r={radius} />
      {glyphe && schlossGlyphe(x, y - 1.5 * groesse, glyphe, f.detail, groesse)}
    </g>
  );
}

/**
 * Bewegung der Schlüsselzeichnung (B-15, B-21): erst die Körper, dann – wenn der letzte Körper
 * steht – zeichnen sich die Profile, zuletzt erscheinen Marken und Ziffern. Alles zusammen
 * höchstens 1,6 s (Sichtabnahme E4-L-23, Nachprüfung H02/H03); Test in `schluessel.test.tsx`.
 * Marken, Lineal und Ziffern beziehen sich auf den Profilbeginn (`profilBeginn`).
 */
const ZEIT = {
  koerperStaffel: 0.08,
  koerperDauer: 0.4,
  profilStaffel: 0.08,
  profilDauer: 0.6,
  markeNach: 0.35,
  markeSpanne: 0.3,
  markeDauer: 0.3,
  linealDauer: 0.6,
  zifferNach: 0.4,
  zifferStaffel: 0.03,
  zifferSpanne: 0.3,
  zifferDauer: 0.3,
} as const;

/** Die Profile beginnen, wenn der letzte (vorderste) Körper ganz erschienen ist. */
function profilBeginn(anzahl: number): number {
  return ZEIT.koerperStaffel * (anzahl - 1) + ZEIT.koerperDauer;
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
        style={motionStyle(0.3, 1 + i * 0.1)}
        strokeWidth={LINIE}
        d={d}
      />
    );
  });
}

/* ---------- Schlüsseltypen (lokale Koordinaten, Achse des Barts bei y = 0) ---------- */

function zylinder(tiefenZiffern: number[], f: Farben, rohling = false): Zeichnung {
  const oben = -22;
  const unten = 26;
  const spitze = 372;
  const pos = positionen(tiefenZiffern.length, 176, 326);
  const tiefen = tiefenZiffern.map((d) => 4 + d * 2.6);
  /* Rohling: gerader Halm ohne Einschnitte; die Einschnittzone zeigt die Zeichnung gestrichelt. */
  const kante = rohling ? [] : kerben(pos, tiefen, 4.5, 1.2).map(([x, t]): [number, number] => [x, oben + t]);
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
    profile: rohling ? [] : [`M150 ${oben}${linie(kante)}L${spitze - 20} ${oben}`],
    zone: rohling ? `M${pos[0] - 8} ${oben + 4}H${pos[pos.length - 1] + 8}` : undefined,
    marken: rohling ? [] : pos.map((x, i) => ({ x, y: oben + tiefen[i] })),
    linealY: unten + 18,
    box: { x1: 0, y1: -54, x2: spitze, y2: 54 },
  };
}

/** Maße eines beidseitigen Bartes: halbe Höhe, Tiefe je Ziffer, halbe Breite der Spitze. */
interface BartMass {
  halb: number;
  tiefe: number;
  spitze: number;
}

const BART_STANDARD: BartMass = { halb: 22, tiefe: 1.35, spitze: 8 };
/** Großer Bart für die Nahansicht: dieselben Verhältnisse, mehr Platz für die Fräsungen. */
const BART_NAH: BartMass = { halb: 34, tiefe: 2.2, spitze: 12 };

function beidseitigerBart(tiefenZiffern: number[], start: number, spitze: number, m: BartMass = BART_STANDARD) {
  const oben = -m.halb;
  const unten = m.halb;
  const pos = positionen(tiefenZiffern.length, start + 24, spitze - 46);
  const tiefen = tiefenZiffern.map((d) => 3 + d * m.tiefe);
  const roh = kerben(pos, tiefen, 4, 1.1);
  const kanteOben = roh.map(([x, t]): [number, number] => [x, oben + t]);
  const kanteUnten = roh.map(([x, t]): [number, number] => [x, unten - t]).reverse();
  const umriss = `M${start} ${oben}${linie(kanteOben)}L${spitze - 16} ${oben}L${spitze} -${m.spitze}V${m.spitze}L${spitze - 16} ${unten}${linie(kanteUnten)}L${start} ${unten}Z`;
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
        {/* Spurband: ein breiter Strich als Fläche, keine Linie der Strichskala (D-010) */}
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
        style={motionStyle(0.8, 0.6)}
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
        {/* Notschlüssel im Gehäuse, gestrichelt wie ein verdecktes Teil (Sichtabnahme E4-L-23) */}
        <path
          className={f.detail}
          strokeWidth={HILFSLINIE}
          strokeDasharray="4 3"
          d="M14 -60H28V40L21 50L14 40Z"
        />
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

function zeichnung(typ: Typ, tiefen: number[], f: Farben, rohling = false): Zeichnung {
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
      return zylinder(tiefen, f, rohling);
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

/* ---------- Ansichten des Funkschlüssels (Fotoplätze) ---------- */

const TITEL_ANSICHT: Record<Ansicht, string> = {
  vorn: 'Funkschlüssel, Tastenseite',
  hinten: 'Funkschlüssel, Rückseite',
  bart: 'Funkschlüssel, Bart von der Seite',
  detail: 'Funkschlüssel, Prägung in Nahaufnahme',
};

/** Gehäuse von vorn: Tastenseite und Rückseite. */
const GEHAEUSE_VORN =
  'M-68 -78H68A50 50 0 0 1 118 -28V28A50 50 0 0 1 68 78H-68A50 50 0 0 1 -118 28V-28A50 50 0 0 1 -68 -78Z';
/** Gehäuse der Nahaufnahme: die Fläche, auf der die Prägung sitzt. */
const GEHAEUSE_FLAECHE =
  'M-156 -100H132A44 44 0 0 1 176 -56V56A44 44 0 0 1 132 100H-156A44 44 0 0 1 -200 56V-56A44 44 0 0 1 -156 -100Z';

/** Öse oben am Gehäuse: Bogen mit Loch. Wird vor dem Gehäuse gezeichnet, damit ihr Ansatz verschwindet. */
function oese(f: Farben): ReactNode {
  return (
    <path
      className={f.metall}
      strokeWidth={KONTUR}
      fillRule="evenodd"
      d="M-14 -76V-90A14 14 0 0 1 14 -90V-76ZM-6 -92A6 6 0 1 0 6 -92A6 6 0 1 0 -6 -92Z"
    />
  );
}

/** Tastenseite von oben: links die Taste zum Schließen, rechts die Taste zum Öffnen, darüber die Leuchte. */
function tastenseite(f: Farben): Zeichnung {
  return {
    koerper: (
      <>
        {oese(f)}
        <path className={f.kopf} strokeWidth={KONTUR} d={GEHAEUSE_VORN} />
        {taste(-56, 0, 40, f, 'zu', 2)}
        {taste(56, 0, 40, f, 'auf-hoch', 2)}
        <circle className={f.akzent} cx={0} cy={-58} r={4.5} />
      </>
    ),
    profile: [],
    marken: [],
    box: { x1: -118, y1: -104, x2: 118, y2: 78 },
  };
}

/** Rückseite: Kennzeichnungsfeld mit Aufdruck (nur Linien, kein Text) und zwei Schrauben. */
function rueckseite(f: Farben): Zeichnung {
  return {
    koerper: (
      <>
        {oese(f)}
        <path className={f.kopf} strokeWidth={KONTUR} d={GEHAEUSE_VORN} />
        <rect className={f.knopf} strokeWidth={LINIE} x={-74} y={-50} width={148} height={96} rx={10} />
        <circle className={f.knopf} strokeWidth={LINIE} cx={-98} cy={0} r={5} />
        <circle className={f.knopf} strokeWidth={LINIE} cx={98} cy={0} r={5} />
      </>
    ),
    zusatz: (
      <path
        className={`sm24-draw ${f.detail}`}
        pathLength={1}
        style={motionStyle(ZEIT.koerperDauer, ZEIT.linealDauer)}
        strokeWidth={LINIE}
        d="M-56 -26H56M-56 -6H30M-56 14H8"
      />
    ),
    profile: [],
    marken: [],
    box: { x1: -118, y1: -104, x2: 118, y2: 78 },
  };
}

/** Bart von der Seite, groß, mit Halsstück links und den Fräsungen als Profil. */
function bartNah(tiefenZiffern: number[], f: Farben): Zeichnung {
  const start = 60;
  const spitze = 440;
  const bart = beidseitigerBart(tiefenZiffern, start, spitze, BART_NAH);
  return {
    koerper: (
      <>
        <rect className={f.metall} strokeWidth={KONTUR} x={0} y={-46} width={start} height={92} rx={6} />
        <path className={f.metall} strokeWidth={KONTUR} d={bart.umriss} />
        <path
          className={f.detail}
          strokeWidth={HILFSLINIE}
          strokeDasharray={MITTELLINIE}
          d={`M${start + 16} 0H${spitze - 40}`}
        />
      </>
    ),
    profile: bart.profile,
    marken: bart.marken,
    linealY: bart.linealY,
    box: { x1: 0, y1: -46, x2: spitze, y2: 46 },
  };
}

/** Punktraster einer Prägung: 1 steht für einen gestanzten Punkt, Zeile für Zeile von oben. */
const PRAEGUNG = [
  [1, 0, 1, 1],
  [0, 1, 1, 0],
  [1, 1, 0, 1],
];
const PRAEGUNG_ABSTAND = 13;

/** Punkte des Rasters um `(cx, cy)`, vergrößert um den Faktor `m`. */
function praegePunkte(cx: number, cy: number, m: number): [number, number][] {
  return PRAEGUNG.flatMap((zeile, j) =>
    zeile.flatMap((gesetzt, i): [number, number][] =>
      gesetzt
        ? [[r(cx + m * (i - 1.5) * PRAEGUNG_ABSTAND), r(cy + m * (j - 1) * PRAEGUNG_ABSTAND)]]
        : [],
    ),
  );
}

/** Nahaufnahme: eine Prägung auf dem Gehäuse, vergrößert in einer Lupe, durch Tangenten verbunden. */
function praegung(f: Farben): Zeichnung {
  const feld = { x: -64, y: 0, r: 40 };
  const lupe = { x: 124, y: 0, r: 70 };
  const linien = aussenTangenten(feld, lupe)
    .map(([ax, ay, bx, by]) => `M${ax} ${ay}L${bx} ${by}`)
    .join('');
  return {
    koerper: (
      <>
        <path className={f.kopf} strokeWidth={KONTUR} d={GEHAEUSE_FLAECHE} />
        <circle
          className="fill-surface stroke-border-strong"
          strokeWidth={HILFSLINIE}
          strokeDasharray="4 3"
          cx={feld.x}
          cy={feld.y}
          r={feld.r}
        />
        {praegePunkte(feld.x, feld.y, 1).map(([x, y]) => (
          <circle key={`${x}-${y}`} className="fill-area-strong" cx={x} cy={y} r={2.6} />
        ))}
      </>
    ),
    zusatz: (
      <>
        <path
          className="sm24-draw stroke-border-strong"
          pathLength={1}
          style={motionStyle(ZEIT.koerperDauer, ZEIT.linealDauer)}
          strokeWidth={LINIE}
          d={linien}
        />
        <g className="sm24-fade" style={motionStyle(ZEIT.koerperDauer + ZEIT.markeNach, ZEIT.markeDauer * 2)}>
          <circle className="fill-surface stroke-foreground" strokeWidth={KONTUR} cx={lupe.x} cy={lupe.y} r={lupe.r} />
          <circle
            className="stroke-foreground-muted"
            strokeWidth={HILFSLINIE}
            cx={lupe.x}
            cy={lupe.y}
            r={lupe.r - 8}
          />
          {praegePunkte(lupe.x, lupe.y, 2).map(([x, y]) => (
            <circle key={`${x}-${y}`} className="fill-area-strong" cx={x} cy={y} r={5.2} />
          ))}
        </g>
      </>
    ),
    profile: [],
    marken: [],
    box: { x1: -200, y1: -100, x2: 194, y2: 100 },
  };
}

function ansichtBild(ansicht: Ansicht, tiefen: number[]): Zeichnung {
  if (ansicht === 'vorn') return tastenseite(VORN);
  if (ansicht === 'hinten') return rueckseite(HINTEN);
  if (ansicht === 'bart') return bartNah(tiefen, VORN);
  return praegung(VORN);
}

/** Maßstab und Lage, damit eine Zeichnung mittig in die Fläche passt (höchstens 1:1). */
function einpassung(x1: number, y1: number, x2: number, y2: number) {
  const skala = Math.min(1, (BREITE - 56) / (x2 - x1), (HOEHE - 40) / (y2 - y1));
  return {
    skala,
    tx: r(BREITE / 2 - (skala * (x1 + x2)) / 2),
    ty: r(HOEHE / 2 - (skala * (y1 + y2)) / 2),
  };
}

/** Einschnittprofil(e): zeichnen sich nacheinander, ab `beginn`. */
function Profil({ pfade, beginn }: { pfade: string[]; beginn: number }) {
  return (
    <>
      {pfade.map((d, i) => (
        <path
          key={d}
          className="sm24-draw stroke-area"
          pathLength={1}
          style={motionStyle(beginn + i * ZEIT.profilStaffel, ZEIT.profilDauer)}
          strokeWidth={KONTUR}
          d={d}
        />
      ))}
    </>
  );
}

/** Lineal über alle Einschnitte mit einem Teilstrich je Einschnitt. */
function linealPfad(teilung: number[], lage: number): string {
  return (
    `M${teilung[0]} ${lage}H${teilung[teilung.length - 1]}` +
    teilung.map((x) => `M${x} ${lage - 4}V${lage + 4}`).join('')
  );
}

interface MarkierungenProps {
  marken: { x: number; y: number }[];
  /** Lage des Lineals; nur gesetzt, wenn die Einschnitte beschriftet werden. */
  linealY?: number;
  tiefen: number[];
  beginn: number;
  schrift: number;
}

/** Marken der Einschnitte, darunter das Lineal mit den Ziffern. */
function Markierungen({ marken, linealY, tiefen, beginn, schrift }: MarkierungenProps) {
  const teilung = [...new Set(marken.map((m) => r(m.x)))];
  /* Das Lineal steht nur mit Ziffern: unbeschriftete Teilstriche behaupten ein Maß, das man
     nicht lesen kann (K-003 „Bemaßt statt behauptet“, E6-L-31). */
  const lage = linealY !== undefined && teilung.length > 0 ? linealY : undefined;
  return (
    <>
      {/* Alle Marken eines Schlüssels in einer Gruppe: eine Animation statt bis zu 30 (E7, Bildrate). */}
      {marken.length > 0 && (
        <g className="sm24-fade" style={motionStyle(beginn + ZEIT.markeNach, ZEIT.markeSpanne + ZEIT.markeDauer)}>
          {marken.map((m) => (
            <circle key={`${r(m.x)}-${r(m.y)}`} className="fill-area-strong" cx={r(m.x)} cy={r(m.y)} r={2.6} />
          ))}
        </g>
      )}
      {lage !== undefined && (
        <path
          className="sm24-draw stroke-foreground-muted"
          pathLength={1}
          style={motionStyle(beginn, ZEIT.linealDauer)}
          strokeWidth={HILFSLINIE}
          d={linealPfad(teilung, lage)}
        />
      )}
      {lage !== undefined &&
        teilung.map((x, i) => (
          <text
            key={x}
            className="sm24-reveal fill-foreground-muted font-mono"
            style={motionStyle(beginn + Math.min(ZEIT.zifferNach + i * ZEIT.zifferStaffel, ZEIT.zifferNach + ZEIT.zifferSpanne), ZEIT.zifferDauer)}
            fontSize={schrift}
            textAnchor="middle"
            x={x}
            y={r(lage + 20)}
          >
            {tiefen[i]}
          </text>
        ))}
    </>
  );
}

interface FunkAnsichtProps {
  ansicht: Ansicht;
  tiefen: number[];
  /** Einschnitte sind angegeben: Lineal und Ziffern erscheinen. */
  beschriften: boolean;
  title: string;
  className?: string;
}

/** Eine Ansicht des Funkschlüssels; Anzahl und Rohling entfallen hier. */
function FunkAnsicht({ ansicht, tiefen, beschriften, title, className }: FunkAnsichtProps) {
  const bild = ansichtBild(ansicht, tiefen);
  const linealY = beschriften ? bild.linealY : undefined;
  const unten = linealY !== undefined ? Math.max(bild.box.y2, linealY + 24) : bild.box.y2;
  const { skala, tx, ty } = einpassung(bild.box.x1, bild.box.y1, bild.box.x2, unten);
  return (
    <GrafikRahmen breite={BREITE} hoehe={HOEHE} title={titel(title, TITEL_ANSICHT[ansicht])} className={className}>
      <Raster breite={BREITE} hoehe={HOEHE} />
      <g transform={`translate(${tx} ${ty}) scale(${r(skala * 1000) / 1000})`}>
        <g className="sm24-reveal" style={motionStyle(0, ZEIT.koerperDauer)}>
          {bild.koerper}
        </g>
        {bild.zusatz}
        <Profil pfade={bild.profile} beginn={ZEIT.koerperDauer} />
        <Markierungen
          marken={bild.marken}
          linealY={linealY}
          tiefen={tiefen}
          beginn={ZEIT.koerperDauer}
          schrift={r(SCHRIFT_KLEIN / skala)}
        />
      </g>
    </GrafikRahmen>
  );
}

/**
 * Schlüssel in Seitenansicht — Reide, Halsstück, Bart mit Einschnitten.
 *
 * params:
 * - `typ`: `zylinder` (Standard) | `buntbart` | `klapp` | `funk` | `smart-key` | `transponder`
 * - `einschnitte`: 4–8 Ziffern 0–9, Vorrang vor `code`; werden unter dem Bart auf einem Lineal beschriftet
 * - `code`: Text — ergibt deterministisch ein Einschnittprofil (ohne Beschriftung und Lineal)
 * - `anzahl`: 1–3 (Standard 1), weitere Schlüssel versetzt dahinter, z. B. für „Kopie“
 * - `rohling`: `true` – nur beim Zylinderschlüssel: gerader Halm ohne Einschnitte, die
 *   Einschnittzone gestrichelt (etwa vor der Eingabe eines Codes)
 * - `ansicht`: `vorn` (Tastenseite) | `hinten` (Rückseite) | `bart` (Bart von der Seite mit Fräsungen) |
 *   `detail` (Prägung in Nahaufnahme). Ohne `typ` ist der Funkschlüssel gewählt; bei anderen Typen
 *   und bei unbekannten Werten bleibt es bei der Seitenansicht. Anzahl und Rohling entfallen bei Ansichten.
 */
export function SchluesselGrafik({ params, title, className }: VisualProps) {
  const p = parameter(params);
  const ansicht = auswahl<Ansicht | 'seite'>(wert(p, 'ansicht'), [...ANSICHTEN, 'seite'], 'seite');
  const typ = auswahl(wert(p, 'typ'), TYPEN, ansicht === 'seite' ? 'zylinder' : 'funk');
  const explizit = ziffern(wert(p, 'einschnitte'), 4, 8);
  const code = kurztext(wert(p, 'code'), 40);
  const tiefen = explizit ?? (code ? profilAusCode(code) : STANDARD_PROFIL);

  if (ansicht !== 'seite' && typ === 'funk') {
    return (
      <FunkAnsicht
        ansicht={ansicht}
        tiefen={tiefen}
        beschriften={explizit !== undefined}
        title={title}
        className={className}
      />
    );
  }

  const anzahl = zahl(wert(p, 'anzahl'), 1, 3, 1, true);
  const rohlingWert = wert(p, 'rohling');
  const rohling = rohlingWert === true || rohlingWert === 'true' || rohlingWert === 'ja';

  const vorn = zeichnung(typ, tiefen, VORN, rohling);
  const hinten = anzahl > 1 ? zeichnung(typ, tiefen, HINTEN, rohling) : undefined;
  const beginn = profilBeginn(anzahl);

  const linealY = vorn.linealY;
  const teilung = [...new Set(vorn.marken.map((m) => r(m.x)))];
  // Das Lineal steht nur mit Ziffern: unbeschriftete Teilstriche behaupten ein Maß, das man
  // nicht lesen kann (K-003 „Bemaßt statt behauptet“, E6-L-31).
  const beschriften = linealY !== undefined && teilung.length > 0 && explizit !== undefined;

  const x1 = vorn.box.x1;
  const x2 = vorn.box.x2 + (anzahl - 1) * KOPIE_DX;
  const y1 = vorn.box.y1 + (anzahl - 1) * KOPIE_DY;
  const y2 = beschriften && linealY !== undefined ? Math.max(vorn.box.y2, linealY + 24) : vorn.box.y2;
  const { skala, tx, ty } = einpassung(x1, y1, x2, y2);
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
              <g className="sm24-reveal" style={motionStyle(ZEIT.koerperStaffel * (anzahl - 1 - stelle), ZEIT.koerperDauer)}>
                {hinten.koerper}
              </g>
            </g>
          ))}

        <g className="sm24-reveal" style={motionStyle(ZEIT.koerperStaffel * (anzahl - 1), ZEIT.koerperDauer)}>
          {vorn.koerper}
        </g>

        {vorn.zusatz}

        {vorn.zone && (
          <path className="stroke-border-strong" strokeWidth={LINIE} strokeDasharray="4 3" d={vorn.zone} />
        )}

        <Profil pfade={vorn.profile} beginn={beginn} />
        <Markierungen
          marken={vorn.marken}
          linealY={beschriften ? linealY : undefined}
          tiefen={tiefen}
          beginn={beginn}
          schrift={schrift}
        />
      </g>
    </GrafikRahmen>
  );
}
