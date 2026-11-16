/*
 * Entfernung zwischen zwei Postleitzahlen (FA-PLATTFORM-03, für den Umkreis der Partner aus FA-PLATTFORM-01B).
 * Großkreis (Haversine) zwischen den Mittelpunkten der Postleitzahlen aus content/orte/postleitzahlen.json, auf
 * eine Nachkommastelle gerundet. Luftlinie, keine Fahrstrecke. Reine Funktionen, nur relative Importe.
 */

import type { OrtsstammIndex } from './index-stamm';

/** Mittlerer Erdradius in Kilometern (IUGG). */
export const ERDRADIUS_KM = 6371.0088;

export interface Koordinate {
  breite: number;
  laenge: number;
}

const bogen = (grad: number) => (grad * Math.PI) / 180;

/** Großkreisentfernung in Kilometern, ungerundet. */
export function grosskreisKm(a: Koordinate, b: Koordinate): number {
  const dBreite = bogen(b.breite - a.breite);
  const dLaenge = bogen(b.laenge - a.laenge);
  const h = Math.sin(dBreite / 2) ** 2 + Math.cos(bogen(a.breite)) * Math.cos(bogen(b.breite)) * Math.sin(dLaenge / 2) ** 2;
  return 2 * ERDRADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Entfernung zwischen den Mittelpunkten zweier Postleitzahlen in Kilometern, auf 0,1 km gerundet. Null, wenn eine
 * der beiden im Stamm fehlt oder keine Koordinaten hat.
 */
export function entfernungZwischenPostleitzahlen(plzA: string, plzB: string, stamm: Pick<OrtsstammIndex, 'postleitzahl'>): number | null {
  const a = stamm.postleitzahl(plzA);
  const b = stamm.postleitzahl(plzB);
  if (!a || !b || a.breite === null || a.laenge === null || b.breite === null || b.laenge === null) return null;
  return Math.round(grosskreisKm({ breite: a.breite, laenge: a.laenge }, { breite: b.breite, laenge: b.laenge }) * 10) / 10;
}
