import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * Gemeinsame Bausteine der Grafik-Generatoren — selbst KEIN Generator und
 * nicht für die Registry bestimmt.
 *
 * Alle Leser nehmen `unknown`, weil Parameter aus Inhalten stammen und zur
 * Laufzeit beliebige Werte enthalten können. Sie werfen nie.
 */

/** Konturen (Körper, Schlüssel, Türen). */
export const KONTUR = 2.25;
/** Maßlinien, Kanten, Verbindungen. */
export const LINIE = 1.5;
/** Hilfslinien, Raster, Mittellinien. */
export const HILFSLINIE = 1;
/** Beschriftung in viewBox-Einheiten. */
export const SCHRIFT = 13;
export const SCHRIFT_KLEIN = 12;
/** Strichmuster einer Mittellinie (Strich-Punkt). */
export const MITTELLINIE = '10 3 2 3';

/** Rundet auf zwei Nachkommastellen — kurze, stabile Pfadangaben. */
export function r(wert: number): number {
  const gerundet = Math.round(wert * 100) / 100;
  return Object.is(gerundet, -0) ? 0 : gerundet;
}

export type Parameter = Record<string, unknown>;

/** Macht aus beliebigen Eingaben ein lesbares Parameterobjekt. */
export function parameter(params: unknown): Parameter {
  if (params === null || typeof params !== 'object' || Array.isArray(params)) return {};
  return params as Parameter;
}

/** Liest einen eigenen Schlüssel, ohne auf den Prototyp zuzugreifen. */
export function wert(params: Parameter, schluessel: string): unknown {
  return Object.prototype.hasOwnProperty.call(params, schluessel) ? params[schluessel] : undefined;
}

/** Einer von mehreren erlaubten Texten, sonst der Standardwert. */
export function auswahl<T extends string>(value: unknown, erlaubt: readonly T[], standard: T): T {
  if (typeof value !== 'string') return standard;
  const kandidat = value.trim().toLowerCase();
  return (erlaubt as readonly string[]).includes(kandidat) ? (kandidat as T) : standard;
}

/** Zahl (auch als Text, Dezimalkomma erlaubt), begrenzt auf `[min, max]`. */
export function zahl(
  value: unknown,
  min: number,
  max: number,
  standard: number,
  ganzzahl = false,
): number {
  let n: number;
  if (typeof value === 'number') n = value;
  else if (typeof value === 'string' && value.trim() !== '') n = Number(value.trim().replace(',', '.'));
  else return standard;
  if (!Number.isFinite(n)) return standard;
  if (ganzzahl) n = Math.round(n);
  return Math.min(max, Math.max(min, n));
}

/** Kurzer Text oder `undefined`. Zahlen werden als Text übernommen. */
export function kurztext(value: unknown, maxLaenge = 64): string | undefined {
  const roh = typeof value === 'number' && Number.isFinite(value) ? String(value) : value;
  if (typeof roh !== 'string') return undefined;
  const text = roh.trim().slice(0, maxLaenge);
  return text || undefined;
}

/**
 * Ziffernfolge 0–9 aus einem Array (Zahlen oder Ziffern als Text) oder einem
 * Text wie „35274“. Ungültige Einträge entfallen; zu kurze Folgen → `undefined`.
 */
export function ziffern(value: unknown, minLaenge: number, maxLaenge: number): number[] | undefined {
  let eintraege: unknown[];
  if (Array.isArray(value)) eintraege = value;
  else if (typeof value === 'string') eintraege = value.replace(/[^0-9]/g, '').split('');
  else return undefined;

  const folge: number[] = [];
  for (const eintrag of eintraege) {
    if (folge.length >= maxLaenge) break;
    const n =
      typeof eintrag === 'number'
        ? eintrag
        : typeof eintrag === 'string' && eintrag.trim() !== ''
          ? Number(eintrag.trim())
          : Number.NaN;
    if (!Number.isFinite(n)) continue;
    folge.push(Math.min(9, Math.max(0, Math.round(n))));
  }
  return folge.length >= minLaenge ? folge : undefined;
}

/** Alternativtext — leere oder fehlerhafte Titel ersetzt der Standardtext. */
export function titel(title: unknown, standard: string): string {
  return typeof title === 'string' && title.trim() ? title.trim() : standard;
}

/** FNV-1a (32 Bit) — kleiner, stabiler Hash für Texte. */
export function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Deterministische Zahlenfolge (mulberry32) aus einem Startwert. */
export function zahlenfolge(start: number): () => number {
  let zustand = start >>> 0;
  return () => {
    zustand = (zustand + 0x6d2b79f5) >>> 0;
    let t = zustand;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Gefüllte Pfeilspitze als eigener Pfad (statt `<marker>`), Spitze in
 * `(x, y)`, zeigt in Richtung `winkel` (Grad, 0 = nach rechts).
 */
export function pfeilspitze(x: number, y: number, winkel: number, laenge = 8, breite = 6): string {
  const a = (winkel * Math.PI) / 180;
  const bx = x - Math.cos(a) * laenge;
  const by = y - Math.sin(a) * laenge;
  const nx = (-Math.sin(a) * breite) / 2;
  const ny = (Math.cos(a) * breite) / 2;
  return `M${r(x)} ${r(y)}L${r(bx + nx)} ${r(by + ny)}L${r(bx - nx)} ${r(by - ny)}Z`;
}

/** Äußere Tangenten zweier Kreise — für Detail- und Lupenverbindungen. */
export function aussenTangenten(
  a: { x: number; y: number; r: number },
  b: { x: number; y: number; r: number },
): [number, number, number, number][] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const abstand = Math.hypot(dx, dy);
  if (abstand <= Math.abs(a.r - b.r) + 0.001) return [];
  const basis = Math.atan2(dy, dx);
  const versatz = Math.acos((a.r - b.r) / abstand);
  return [basis + versatz, basis - versatz].map((w) => [
    r(a.x + a.r * Math.cos(w)),
    r(a.y + a.r * Math.sin(w)),
    r(b.x + b.r * Math.cos(w)),
    r(b.y + b.r * Math.sin(w)),
  ]);
}

/** Überstand des Rasters, damit Randflächen in 4:3, 1:1 oder 21:9 nahtlos bleiben. */
const RASTER_UEBERSTAND = 150;

/**
 * Zartes Linienraster als ein einziger Pfad (technisches Zeichenpapier).
 * Es reicht über die `viewBox` hinaus: Bei `xMidYMid meet` in einer Fläche
 * mit anderem Seitenverhältnis läuft das Raster bis an den Rand weiter.
 */
export function Raster({
  breite,
  hoehe,
  abstand = 30,
  className,
}: {
  breite: number;
  hoehe: number;
  abstand?: number;
  className?: string;
}) {
  const teile: string[] = [];
  const rand = RASTER_UEBERSTAND;
  const startX = ((breite % abstand) / 2 || abstand / 2) - Math.ceil(rand / abstand) * abstand;
  const startY = ((hoehe % abstand) / 2 || abstand / 2) - Math.ceil(rand / abstand) * abstand;
  for (let x = startX; x < breite + rand; x += abstand) {
    teile.push(`M${r(x)} ${-rand}V${hoehe + rand}`);
  }
  for (let y = startY; y < hoehe + rand; y += abstand) {
    teile.push(`M${-rand} ${r(y)}H${breite + rand}`);
  }
  return (
    <path
      className={cn('stroke-area-muted/40', className)}
      strokeWidth={HILFSLINIE}
      d={teile.join('')}
    />
  );
}

export interface GrafikRahmenProps {
  breite: number;
  hoehe: number;
  title: string;
  className?: string;
  children: ReactNode;
}

/**
 * SVG-Rahmen aller Generatoren: feste `viewBox`, `role="img"`, `<title>` als
 * erstes Kind, runde Enden, keine Füllung ohne Klasse.
 */
export function GrafikRahmen({ breite, hoehe, title, className, children }: GrafikRahmenProps) {
  return (
    <svg
      viewBox={`0 0 ${breite} ${hoehe}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={title}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('block h-auto w-full', className)}
    >
      <title>{title}</title>
      {children}
    </svg>
  );
}
