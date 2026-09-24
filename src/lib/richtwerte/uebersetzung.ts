/**
 * Übersetzung des Payload-Globals `richtwerte` (Beträge in Euro, Felder oft
 * leer) in die Richtwerte der Rechner (Beträge in Cent, fehlend = `null`).
 */
import type { Richtwerte } from '@/payload-types';

import type {
  RechnerRichtwerte,
  RichtwertPosition,
  ServiceLeistung,
  Spanne,
} from './typen';

type Zeile = {
  kennung?: string | null;
  label?: string | null;
  beschreibung?: string | null;
  preisVon?: number | null;
  preisBis?: number | null;
};

/** Euro → Cent; leere, negative oder unsinnige Werte gelten als nicht gepflegt. */
export function centAusEuro(euro: number | null | undefined): number | null {
  if (typeof euro !== 'number' || !Number.isFinite(euro) || euro < 0) return null;
  return Math.round(euro * 100);
}

/** Nur eine vollständige, aufsteigende Spanne ist eine Spanne. */
export function spanneAusEuro(
  von: number | null | undefined,
  bis: number | null | undefined,
): Spanne | null {
  const vonCent = centAusEuro(von);
  const bisCent = centAusEuro(bis);
  if (vonCent === null || bisCent === null || vonCent > bisCent) return null;
  return { vonCent, bisCent };
}

const text = (value: string | null | undefined): string | null => value?.trim() || null;

/**
 * Zeilen ohne Kennung oder Bezeichnung fallen weg, doppelte Kennungen zählen
 * einmal — sonst wären Auswahl und Summe nicht eindeutig.
 */
function positionen<Z extends Zeile, P>(
  zeilen: Z[] | null | undefined,
  zuPosition: (zeile: Z, basis: RichtwertPosition) => P,
): P[] {
  const gesehen = new Set<string>();
  const ergebnis: P[] = [];
  for (const zeile of zeilen ?? []) {
    const kennung = text(zeile.kennung);
    const label = text(zeile.label);
    if (!kennung || !label || gesehen.has(kennung)) continue;
    gesehen.add(kennung);
    ergebnis.push(
      zuPosition(zeile, {
        kennung,
        label,
        beschreibung: text(zeile.beschreibung),
        spanne: spanneAusEuro(zeile.preisVon, zeile.preisBis),
      }),
    );
  }
  return ergebnis;
}

const alsPosition = (_: Zeile, basis: RichtwertPosition) => basis;

/**
 * Aufbau wie im Seed, ohne Beträge. Greift, solange das Global noch leer ist
 * (frische Datenbank) oder die Seite ohne Datenbank läuft.
 */
export const PLATZHALTER_RICHTWERTE: RechnerRichtwerte = {
  tuerAbsicherung: {
    platzhalter: true,
    hinweis: null,
    tuerarten: [
      { kennung: 'wohnungstuer', label: 'Wohnungseingangstür', beschreibung: 'Tür im Mehrfamilienhaus', spanne: null },
      { kennung: 'haustuer', label: 'Hauseingangstür', beschreibung: 'Außentür eines Hauses', spanne: null },
      { kennung: 'nebentuer', label: 'Neben- oder Kellertür', beschreibung: 'Keller, Garage, Hintereingang', spanne: null },
      { kennung: 'gewerbetuer', label: 'Tür im Gewerbe', beschreibung: 'Büro, Laden, Lager', spanne: null },
    ],
    massnahmen: [
      { kennung: 'zylinder', label: 'Profilzylinder mit Kopierschutz', beschreibung: 'Schutz gegen Aufbohren und Ziehen', spanne: null },
      { kennung: 'schutzbeschlag', label: 'Schutzbeschlag', beschreibung: 'deckt den Zylinder von außen ab', spanne: null },
      { kennung: 'zusatzschloss', label: 'Tür-Zusatzschloss', beschreibung: 'zweiter Verschlusspunkt', spanne: null },
      { kennung: 'mehrfachverriegelung', label: 'Mehrfachverriegelung', beschreibung: 'mehrere Riegel über die Türhöhe', spanne: null },
      { kennung: 'querriegel', label: 'Querriegelschloss', beschreibung: 'Riegel über die ganze Türbreite', spanne: null },
    ],
  },
  serviceEinsatz: {
    platzhalter: true,
    hinweis: null,
    leistungen: [
      { kennung: 'wartung-anlage', label: 'Wartung einer Schließanlage', einheit: 'je-tuer', beschreibung: 'Zylinder prüfen und pflegen', spanne: null },
      { kennung: 'tuerschliesser', label: 'Türschließer einstellen', einheit: 'je-tuer', beschreibung: 'Schließgeschwindigkeit und Endschlag', spanne: null },
      { kennung: 'zylindertausch', label: 'Zylinder tauschen', einheit: 'je-tuer', beschreibung: 'ohne Material', spanne: null },
      { kennung: 'beratung', label: 'Beratung vor Ort', einheit: 'pauschal', beschreibung: 'Begehung und Empfehlung', spanne: null },
    ],
    anfahrt: null,
  },
};

export function richtwerteAusPayload(doc: Richtwerte | null | undefined): RechnerRichtwerte {
  const tuerarten = positionen(doc?.tuerAbsicherung?.tuerarten, alsPosition);
  const massnahmen = positionen(doc?.tuerAbsicherung?.massnahmen, alsPosition);
  const leistungen = positionen(
    doc?.serviceEinsatz?.leistungen,
    (zeile, basis): ServiceLeistung => ({
      ...basis,
      einheit: zeile.einheit === 'je-tuer' ? 'je-tuer' : 'pauschal',
    }),
  );

  if (tuerarten.length + massnahmen.length + leistungen.length === 0) return PLATZHALTER_RICHTWERTE;

  // Nur ein ausdrücklich entfernter Haken gibt Beträge frei.
  const platzhalter = doc?.platzhalter !== false;
  const hinweis = text(doc?.hinweis);

  return {
    tuerAbsicherung: { platzhalter, hinweis, tuerarten, massnahmen },
    serviceEinsatz: {
      platzhalter,
      hinweis,
      leistungen,
      anfahrt: spanneAusEuro(doc?.serviceEinsatz?.anfahrtVon, doc?.serviceEinsatz?.anfahrtBis),
    },
  };
}
