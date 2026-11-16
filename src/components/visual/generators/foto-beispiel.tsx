import type { ReactNode } from 'react';

import type { VisualProps } from '../registry';
import { motionStyle } from '../motion/motion-style';
import {
  AKZENT,
  GrafikRahmen,
  HILFSLINIE,
  KONTUR,
  LINIE,
  LINIE_STARK,
  MARKE,
  Raster,
  auswahl,
  parameter,
  pfeilspitze,
  r,
  titel,
  wert,
} from './grafik-basis';

const BREITE = 480;
const HOEHE = 300;

/**
 * Schrift in viewBox-Einheiten (FA-26-01, FA-QA-04D). Die Zeichnung steht am Upload-Feld über die
 * Breite der Formularspalte; bei 360 px Fensterbreite sind das 320 px, in einem Kasten mit `p-4`
 * 288 px: 24 × 288 / 480 = 14,4 px. Bei 1280 px (zwei Kacheln in `max-w-3xl`, je etwa 378 px)
 * rund 19 px. Ziffern und Wörter tragen dieselbe Größe.
 */
export const FOTO_SCHRIFT = 24;
/** Grundlinie einer Zeile, die mittig auf `y` stehen soll. */
const MITTE_GRUNDLINIE = r(FOTO_SCHRIFT * 0.35);
/** Seitenlänge des Kästchens um eine Feldkennung. */
const KENNUNG = 30;

/**
 * Beispielzeichnungen an den Upload-Feldern (FA-26-06): was auf dem Foto zu sehen sein muss.
 * Eine Zeichnung je Steckplatz; echte Fotos aus der Medienbibliothek ersetzen sie später (MA-05).
 */
export const FOTO_BEISPIELE = ['fahrzeugschein', 'typenschild', 'schluesselspitze', 'ersatznachweis', 'gewerbeanmeldung'] as const;
export type FotoBeispiel = (typeof FOTO_BEISPIELE)[number];

/**
 * Alternativtext je Beispiel: sagt, was auf dem Foto zu sehen sein muss. Nur Angaben, die die Seiten
 * selbst nennen (R4): Halter, Feld B (Erstzulassung) und Feld E (Fahrgestellnummer) im Fahrzeugschein,
 * Hersteller und Nummer am Typenschild, Name und Fahrzeug im Nachweis; bei der Gewerbeanmeldung nur der
 * Wortlaut der Partnerseite („Gewerbeanmeldung oder Zertifikat, vollständig und gut lesbar“).
 */
export const FOTO_BEISPIEL_TITEL: Record<FotoBeispiel, string> = {
  fahrzeugschein:
    'Beispiel Fahrzeugschein: das ganze Blatt flach aufgelegt, alle vier Ecken im Bild, Halter, Feld B (Erstzulassung) und Feld E (Fahrgestellnummer) lesbar',
  typenschild: 'Beispiel Typenschild: das ganze Schild im Bild, Hersteller und Nummer lesbar',
  schluesselspitze: 'Beispiel Schlüsselspitze: Blick von vorne auf die Spitze, das Profil im Querschnitt deutlich erkennbar',
  ersatznachweis:
    'Beispiel Nachweis: das ganze Blatt flach aufgelegt, alle vier Ecken im Bild, Ihr Name und die Angaben zum Fahrzeug lesbar',
  gewerbeanmeldung:
    'Beispiel Gewerbeanmeldung oder Zertifikat: das ganze Blatt mit allen vier Ecken im Bild, alles gut lesbar',
};

interface Kasten {
  x: number;
  y: number;
  w: number;
  h: number;
}

/* ---------- Bausteine ---------------------------------------------------- */

/** Platzhalter-Zeilen statt Text: bewusst keine lesbaren Angaben, keine Kennzeichen, keine Namen (R12). */
function zeilen(x: number, y: number, laengen: number[], abstand: number, klasse = 'stroke-border-strong') {
  const d = laengen.map((l, i) => `M${r(x)} ${r(y + i * abstand)}h${r(l)}`).join('');
  return <path className={klasse} strokeWidth={MARKE} d={d} />;
}

/** Blatt mit Kopfband. Das Papier ist Inhalt und steht sofort. */
function blatt(k: Kasten, kopfHoehe: number) {
  const kopf = `M${k.x + 6} ${k.y}H${k.x + k.w - 6}A6 6 0 0 1 ${k.x + k.w} ${k.y + 6}V${k.y + kopfHoehe}H${k.x}V${k.y + 6}A6 6 0 0 1 ${k.x + 6} ${k.y}Z`;
  return (
    <>
      <rect className="fill-surface" x={k.x} y={k.y} width={k.w} height={k.h} rx={6} />
      <path className="fill-area-muted" d={kopf} />
      <path className="stroke-foreground" strokeWidth={LINIE} d={`M${k.x} ${k.y + kopfHoehe}H${k.x + k.w}`} />
      {zeilen(k.x + 16, k.y + kopfHoehe / 2, [Math.min(110, k.w * 0.45)], 0, 'stroke-foreground-muted')}
      <rect className="stroke-foreground" strokeWidth={KONTUR} x={k.x} y={k.y} width={k.w} height={k.h} rx={6} />
    </>
  );
}

/** Vier Eckwinkel knapp außerhalb des Blatts: Alle vier Ecken gehören ins Bild. */
function ecken(k: Kasten, abstand = 9, laenge = 20) {
  const l = k.x - abstand;
  const o = k.y - abstand;
  const re = k.x + k.w + abstand;
  const u = k.y + k.h + abstand;
  const winkel = [
    `M${l} ${o + laenge}V${o}H${l + laenge}`,
    `M${re - laenge} ${o}H${re}V${o + laenge}`,
    `M${re} ${u - laenge}V${u}H${re - laenge}`,
    `M${l + laenge} ${u}H${l}V${u - laenge}`,
  ];
  return winkel.map((d, i) => (
    <path key={i} className="sm24-pop stroke-area-strong" style={motionStyle(i * 0.08, 0.32)} strokeWidth={AKZENT} d={d} />
  ));
}

/** Markierte Stelle: getönte Fläche mit gestricheltem Rand, darin Platzhalter-Striche. */
function markierung(k: Kasten, verzoegerung: number, strichLaenge?: number, einzug = 30) {
  return (
    <g className="sm24-pop" style={motionStyle(verzoegerung, 0.4)}>
      <rect className="fill-area-soft stroke-area-strong" strokeWidth={LINIE_STARK} strokeDasharray="5 5" x={k.x} y={k.y} width={k.w} height={k.h} rx={5} />
      {strichLaenge !== undefined && zeilen(k.x + einzug, k.y + k.h / 2, [strichLaenge], 0, 'stroke-foreground-muted')}
    </g>
  );
}

/** Feldkennung im Kästchen, etwa „B“ oder „E“ wie im Fahrzeugschein. */
function kennung(x: number, y: number, zeichen: string) {
  return (
    <>
      <rect className="fill-surface stroke-area-strong" strokeWidth={LINIE} x={x - KENNUNG / 2} y={y - KENNUNG / 2} width={KENNUNG} height={KENNUNG} rx={3} />
      <text className="fill-foreground font-mono font-semibold" fontSize={FOTO_SCHRIFT} textAnchor="middle" x={x} y={r(y + MITTE_GRUNDLINIE)}>
        {zeichen}
      </text>
    </>
  );
}

/** Hinweislinie von der Markierung zur Beschriftung. */
function hinweis(x1: number, y: number, x2: number, text: string) {
  return (
    <>
      <path className="stroke-foreground-muted" strokeWidth={HILFSLINIE} d={`M${x1} ${y}H${x2}`} />
      <text className="fill-foreground-muted font-mono" fontSize={FOTO_SCHRIFT} x={x2 + 6} y={r(y + MITTE_GRUNDLINIE)}>
        {text}
      </text>
    </>
  );
}

/* ---------- Szenen ------------------------------------------------------- */

function fahrzeugschein(): ReactNode {
  const k = { x: 28, y: 22, w: 296, h: 178 };
  const feldB = { x: 42, y: 64, w: 132, h: 34 };
  const feldE = { x: 42, y: 140, w: 210, h: 34 };
  /* Halter: Die Seiten nennen ihn ohne Feldkennung („Halter und Fahrzeugdaten lesbar“), daher nur beschriftet (R4). */
  const halter = { x: 190, y: 62, w: 120, h: 70 };
  /* Platzhalter-Strich in B und E rechts neben dem Kästchen der Kennung. */
  const einzug = KENNUNG + 12;
  return (
    <>
      {blatt(k, 28)}
      {markierung(halter, 0.3)}
      {/* Zwei Spalten mit Platzhalter-Zeilen; rechts oben die Angaben zum Halter. */}
      {zeilen(200, 78, [96, 72, 90], 19)}
      {zeilen(42, 119, [100], 0)}
      {zeilen(42, 189, [160, 120], 0)}
      {zeilen(264, 157, [44], 0)}
      {markierung(feldB, 0.4, 70, einzug)}
      {markierung(feldE, 0.5, 150, einzug)}
      {kennung(feldB.x + 2 + KENNUNG / 2, feldB.y + feldB.h / 2, 'B')}
      {kennung(feldE.x + 2 + KENNUNG / 2, feldE.y + feldE.h / 2, 'E')}
      {hinweis(halter.x + halter.w, halter.y + halter.h / 2, 340, 'Halter')}
      {ecken(k)}
      {/* Legende unter dem Blatt, eine Zeile je Feld: nur die Felder, die die Seiten selbst nennen. */}
      <g>
        {kennung(43, 238, 'B')}
        <text className="fill-foreground-muted font-mono" fontSize={FOTO_SCHRIFT} x={66} y={r(238 + MITTE_GRUNDLINIE)}>
          Erstzulassung
        </text>
        {kennung(43, 276, 'E')}
        <text className="fill-foreground-muted font-mono" fontSize={FOTO_SCHRIFT} x={66} y={r(276 + MITTE_GRUNDLINIE)}>
          Fahrgestellnummer
        </text>
      </g>
    </>
  );
}

function typenschild(): ReactNode {
  const k = { x: 40, y: 50, w: 250, h: 160 };
  const nieten = [
    [k.x + 16, k.y + 16],
    [k.x + k.w - 16, k.y + 16],
    [k.x + k.w - 16, k.y + k.h - 16],
    [k.x + 16, k.y + k.h - 16],
  ];
  const hersteller = { x: k.x + 26, y: k.y + 30, w: 150, h: 28 };
  const nummer = { x: k.x + 26, y: k.y + 108, w: 196, h: 28 };
  return (
    <>
      {/* Bauteil, an dem das Schild sitzt: nur als ruhige Fläche angedeutet. */}
      <rect className="fill-surface-muted stroke-border-strong" strokeWidth={LINIE} x={14} y={24} width={296} height={212} rx={14} />
      <rect className="fill-surface stroke-foreground" strokeWidth={KONTUR} x={k.x} y={k.y} width={k.w} height={k.h} rx={10} />
      <rect className="stroke-foreground-muted" strokeWidth={HILFSLINIE} x={k.x + 7} y={k.y + 7} width={k.w - 14} height={k.h - 14} rx={6} />
      {nieten.map(([x, y], i) => (
        <circle key={i} className="fill-area-muted stroke-foreground" strokeWidth={LINIE} cx={x} cy={y} r={5} />
      ))}
      {zeilen(k.x + 26, k.y + 76, [170, 120], 16)}
      {markierung(hersteller, 0.3, 90)}
      {markierung(nummer, 0.45, 150)}
      {hinweis(hersteller.x + hersteller.w, hersteller.y + hersteller.h / 2, 320, 'Hersteller')}
      {hinweis(nummer.x + nummer.w, nummer.y + nummer.h / 2, 320, 'Nummer')}
      {ecken(k, 7, 18)}
    </>
  );
}

/**
 * Profil im Querschnitt, von vorne auf die Spitze gesehen: Rücken oben, Längsnuten links und rechts
 * versetzt. Eine allgemeine Form, kein Profil eines Herstellers (R12).
 */
const PROFIL: [number, number][] = [
  [-12, -70],
  [-12, -48],
  [-5, -40],
  [-5, -24],
  [-14, -14],
  [-14, 6],
  [-7, 14],
  [-7, 30],
  [-14, 40],
  [-14, 60],
  [-9, 70],
  [9, 70],
  [14, 60],
  [14, 44],
  [7, 36],
  [7, 18],
  [14, 8],
  [14, -12],
  [5, -22],
  [5, -38],
  [14, -48],
  [14, -62],
  [9, -70],
];

function schluesselspitze(): ReactNode {
  const mitte = { x: 356, y: 130 };
  /* Quer etwas breiter als hoch gestaucht: Die Nuten bleiben auch klein am Telefon erkennbar. */
  const quer = 1.1;
  const hoch = 0.78;
  const profil = PROFIL.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${r(mitte.x + x * quer)} ${r(mitte.y + y * hoch)}`).join('') + 'Z';
  const kopf = { x: 70, y: 130, r: 38 };
  const halm = 'M104 118H214L230 130L214 142H104Z';
  return (
    <>
      {/* Links der Schlüssel von der Seite, die Spitze zeigt nach rechts zur Kamera. */}
      <path className="fill-surface stroke-foreground" strokeWidth={KONTUR} d={halm} />
      <path className="stroke-foreground-muted" strokeWidth={HILFSLINIE} d="M118 130H214" />
      <circle className="fill-surface stroke-foreground" strokeWidth={KONTUR} cx={kopf.x} cy={kopf.y} r={kopf.r} />
      <circle className="fill-surface-muted stroke-foreground" strokeWidth={LINIE} cx={kopf.x - 14} cy={kopf.y} r={9} />

      {/* Blickrichtung: von vorne auf die Spitze */}
      <g className="sm24-pop" style={motionStyle(0.2, 0.4)}>
        <path className="stroke-area-strong" strokeWidth={LINIE_STARK} strokeDasharray="5 5" d="M284 130H246" />
        <path className="fill-area-strong" d={pfeilspitze(240, 130, 180, 10, 8)} />
      </g>

      {/* Rechts das Profil im Querschnitt, eingekreist */}
      <circle className="fill-area-soft" cx={mitte.x} cy={mitte.y} r={64} />
      <path className="fill-area-muted stroke-foreground" strokeWidth={KONTUR} d={profil} />
      <circle className="sm24-pop stroke-area-strong" style={motionStyle(0.45, 0.4)} strokeWidth={LINIE_STARK} strokeDasharray="5 5" cx={mitte.x} cy={mitte.y} r={64} />

      {/* Unter den beiden Ansichten; „Seitenansicht“ unter dem Schlüssel (Mitte von Kopf und Halm). */}
      <g>
        <text className="fill-foreground-muted font-mono" fontSize={FOTO_SCHRIFT} textAnchor="middle" x={124} y={244}>
          Seitenansicht
        </text>
        <text className="fill-foreground-muted font-mono" fontSize={FOTO_SCHRIFT} textAnchor="middle" x={mitte.x} y={244}>
          Profil von vorne
        </text>
      </g>
    </>
  );
}

function ersatznachweis(): ReactNode {
  const k = { x: 140, y: 26, w: 180, h: 248 };
  const name = { x: 156, y: 72, w: 120, h: 24 };
  const fahrzeug = { x: 156, y: 148, w: 148, h: 24 };
  return (
    <>
      {blatt(k, 30)}
      {zeilen(156, 118, [148, 120], 14)}
      {zeilen(156, 196, [148, 132, 90], 14)}
      {zeilen(232, 252, [72], 0, 'stroke-foreground-muted')}
      {markierung(name, 0.4, 70)}
      {markierung(fahrzeug, 0.5, 96)}
      {hinweis(name.x + name.w, name.y + name.h / 2, 340, 'Name')}
      {hinweis(fahrzeug.x + fahrzeug.w, fahrzeug.y + fahrzeug.h / 2, 340, 'Fahrzeug')}
      {ecken(k)}
    </>
  );
}

function gewerbeanmeldung(): ReactNode {
  const k = { x: 140, y: 26, w: 180, h: 248 };
  const angaben = { x: k.x + 10, y: 82, w: k.w - 20, h: 112 };
  return (
    <>
      {blatt(k, 44)}
      {zeilen(156, 98, [148, 120, 140, 96, 132, 110], 16)}
      {zeilen(156, 226, [100], 0)}
      {zeilen(232, 252, [72], 0, 'stroke-foreground-muted')}
      <rect className="sm24-pop stroke-area-strong" style={motionStyle(0.5, 0.4)} strokeWidth={LINIE_STARK} strokeDasharray="5 5" x={angaben.x} y={angaben.y} width={angaben.w} height={angaben.h} rx={5} />
      {hinweis(angaben.x + angaben.w, angaben.y + angaben.h / 2, 340, 'Angaben')}
      {ecken(k)}
    </>
  );
}

const SZENEN: Record<FotoBeispiel, () => ReactNode> = {
  fahrzeugschein,
  typenschild,
  schluesselspitze,
  ersatznachweis,
  gewerbeanmeldung,
};

/**
 * Beispielzeichnung am Upload-Feld: zeigt, was auf dem Foto zu sehen sein muss — ganzes Blatt mit vier
 * Ecken, markierte Stellen, beim Schlüssel das Profil von vorne. Keine echten Daten, keine Marken, keine
 * lesbaren Nummern oder Kennzeichen: Angaben stehen nur als Platzhalter-Striche (R12).
 *
 * Bewegung nach B-22, endet vor 1,6 s: erst die Eckwinkel, dann die markierten Stellen. Blatt, Schild und
 * Schlüssel sind Inhalt und stehen sofort.
 *
 * params:
 * - `motiv`: `fahrzeugschein` (Standard) | `typenschild` | `schluesselspitze` | `ersatznachweis` | `gewerbeanmeldung`
 */
export function FotoBeispielGrafik({ params, title, className }: VisualProps) {
  const p = parameter(params);
  const motiv = auswahl(wert(p, 'motiv'), FOTO_BEISPIELE, 'fahrzeugschein');
  return (
    <GrafikRahmen breite={BREITE} hoehe={HOEHE} title={titel(title, FOTO_BEISPIEL_TITEL[motiv])} className={className}>
      <Raster breite={BREITE} hoehe={HOEHE} />
      {SZENEN[motiv]()}
    </GrafikRahmen>
  );
}
