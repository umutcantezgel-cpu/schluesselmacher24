/*
 * Postleitzahl-Abfrage (FA-PLATTFORM-03, A-051 Nr. 7): Postleitzahl → Ort, Kreis, Land, Eigenbereich ja oder nein,
 * Partner vorhanden ja oder nein. Für Assistent und Partnerzuordnung. Die Antwort nennt keinen Partner, nur ob
 * einer abdeckt (Partnernamen erfährt der Kunde vor der Buchung nicht).
 *
 * Reiner Kern: Stamm, Eigenbereich und Partnerliste kommen von außen (auf dem Server: stamm.ts). Die Abdeckung
 * prüft `deckendePartner` aus src/lib/partner/region.ts (freigeschaltet, Leistung, Postleitzahlen-Muster).
 */

import { imEigenbereich } from '../auftragsweg';
import { AUFTRAGSART_SAMMELWERT } from '../partner/leistungen';
import { deckendePartner, type PartnerFuerRegion } from '../partner/region';
import type { OwnArea } from '../types';

import { landName, normalisierePostleitzahl, type OrtsstammIndex } from './index-stamm';

export interface PostleitzahlAuskunft {
  plz: string;
  /** Postleitzahl steht im Stamm. */
  bekannt: boolean;
  /** Ortsnamen laut GeoNames (auch Ortsteile). */
  orte: string[];
  /** Gemeinden mit eindeutiger Zuordnung. */
  gemeinden: Array<{ schluessel: string; name: string; slug: string }>;
  /** Kreise, die die Postleitzahl berührt. */
  kreise: Array<{ schluessel: string; name: string }>;
  /** Land; bei einer Postleitzahl über eine Landesgrenze das des ersten Kreises. */
  land: string | null;
  /** Im regionalen Eigenbereich der Werkstatt (Einstellungen, sonst Rückfall `35*`). */
  eigenbereich: boolean;
  /** Ein freigeschalteter Partner deckt die Postleitzahl ab (für die Leistung, sonst für Autoschlüssel allgemein). */
  partnerVorhanden: boolean;
}

export interface AbfrageKontext {
  eigenbereich?: OwnArea;
  partner?: readonly PartnerFuerRegion[];
  /** Leistung für die Partnerabdeckung; ohne Angabe der Sammelwert für Autoschlüssel. */
  leistung?: string;
}

/** Auskunft zu einer Postleitzahl; null bei einer Eingabe, die keine fünfstellige Postleitzahl ist. */
export function postleitzahlAuskunft(eingabe: string, stamm: OrtsstammIndex, kontext: AbfrageKontext = {}): PostleitzahlAuskunft | null {
  const plz = normalisierePostleitzahl(eingabe);
  if (!plz) return null;
  const eintrag = stamm.postleitzahl(plz);
  const gemeinden = (eintrag?.gemeinden ?? [])
    .map((s) => stamm.gemeinde(s))
    .filter((g) => g !== undefined)
    .map((g) => ({ schluessel: g.schluessel, name: g.name, slug: g.slug }));
  const kreise = (eintrag?.kreise ?? [])
    .map((s) => stamm.kreis(s))
    .filter((k) => k !== undefined)
    .map((k) => ({ schluessel: k.schluessel, name: k.name }));
  const landSchluessel = eintrag?.kreise[0]?.slice(0, 2) ?? gemeinden[0]?.schluessel.slice(0, 2);
  const leistung = kontext.leistung || AUFTRAGSART_SAMMELWERT;
  return {
    plz,
    bekannt: Boolean(eintrag),
    orte: [...(eintrag?.orte ?? [])],
    gemeinden,
    kreise,
    land: (landSchluessel && landName(landSchluessel)) || null,
    eigenbereich: imEigenbereich(plz, 'Deutschland', kontext.eigenbereich),
    partnerVorhanden: deckendePartner(plz, leistung, kontext.partner ?? []).length > 0,
  };
}
