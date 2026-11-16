/*
 * Nachschlagen im Ortsstamm (FA-PLATTFORM-03): Gemeinde nach Schlüssel und Adresse, Kreis, Postleitzahl und die
 * Postleitzahlen einer Gemeinde. Reine Funktionen über den Daten aus content/orte/ (gelesen in dateien.ts, auf
 * dem Server zwischengespeichert in stamm.ts). Nur relative Importe.
 */

import type { Gemeinde, Kreis, OrtsstammDaten, PostleitzahlEintrag, PrioritaetEintrag } from './typen';
import { LAENDER } from './typen';

export interface OrtsstammIndex {
  gebietsstand: string;
  gemeinden: readonly Gemeinde[];
  kreise: readonly Kreis[];
  prioritaet: readonly PrioritaetEintrag[];
  gemeinde(schluessel: string): Gemeinde | undefined;
  gemeindeNachSlug(slug: string): Gemeinde | undefined;
  kreis(schluessel: string): Kreis | undefined;
  postleitzahl(plz: string): PostleitzahlEintrag | undefined;
  /** Postleitzahlen einer Gemeinde, aufsteigend (aus der eindeutigen Zuordnung in postleitzahlen.json). */
  postleitzahlenDerGemeinde(schluessel: string): string[];
  /** Gemeinden eines Kreises in der Reihenfolge des Gemeindeverzeichnisses. */
  gemeindenDesKreises(kreisSchluessel: string): Gemeinde[];
}

/** Postleitzahl in der Schreibweise des Stamms (fünf Ziffern) oder null. */
export function normalisierePostleitzahl(eingabe: string | null | undefined): string | null {
  const plz = (eingabe ?? '').replace(/\s+/g, '');
  return /^\d{5}$/.test(plz) ? plz : null;
}

/** Name des Landes zum Landesschlüssel. */
export function landName(schluessel: string): string | undefined {
  return LAENDER[schluessel];
}

export function ortsstammIndex(daten: OrtsstammDaten): OrtsstammIndex {
  const gemeinden = daten.gemeinden.gemeinden;
  const nachSchluessel = new Map(gemeinden.map((g) => [g.schluessel, g]));
  const nachSlug = new Map(gemeinden.map((g) => [g.slug, g]));
  const kreise = new Map(daten.kreise.kreise.map((k) => [k.schluessel, k]));
  const plz = new Map(daten.postleitzahlen.postleitzahlen.map((p) => [p.plz, p]));
  const jeGemeinde = new Map<string, string[]>();
  for (const p of daten.postleitzahlen.postleitzahlen) {
    for (const ags of p.gemeinden) {
      const liste = jeGemeinde.get(ags) ?? [];
      liste.push(p.plz);
      jeGemeinde.set(ags, liste);
    }
  }
  const jeKreis = new Map<string, Gemeinde[]>();
  for (const g of gemeinden) {
    const liste = jeKreis.get(g.kreis) ?? [];
    liste.push(g);
    jeKreis.set(g.kreis, liste);
  }
  return {
    gebietsstand: daten.gemeinden.herkunft.gebietsstand ?? '',
    gemeinden,
    kreise: daten.kreise.kreise,
    prioritaet: daten.prioritaet.eintraege,
    gemeinde: (schluessel) => nachSchluessel.get(schluessel),
    gemeindeNachSlug: (slug) => nachSlug.get(slug),
    kreis: (schluessel) => kreise.get(schluessel),
    postleitzahl: (eingabe) => {
      const n = normalisierePostleitzahl(eingabe);
      return n ? plz.get(n) : undefined;
    },
    postleitzahlenDerGemeinde: (schluessel) => [...(jeGemeinde.get(schluessel) ?? [])].sort(),
    gemeindenDesKreises: (kreisSchluessel) => [...(jeKreis.get(kreisSchluessel) ?? [])],
  };
}
