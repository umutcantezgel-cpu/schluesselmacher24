/*
 * Ortsseiten am Ortsstamm (FA-PLATTFORM-03B, A-051): Lage je Ortsseite (Gemeinde, Kreis, Postleitzahlen, Werkstatt,
 * Partner, Verfügbarkeit, Priorität), Prüfung auf Substanz, Reihenfolge nach der Priorität des Inhabers, Kontaktweg
 * und die Zählung der Vorgänge je Gemeinde für die Ansicht „Prioritätsorte“.
 *
 * Reine Funktionen: Stamm, Werkstatt und Partner kommen von außen (auf dem Server: stamm.ts). Aus dem Stamm entsteht
 * keine Seite; berechnet wird nur für Ortsseiten, die der Betreiber angelegt hat.
 */

import { AUFTRAGSART_SAMMELWERT } from '../partner/leistungen';
import { deckendePartner, type PartnerFuerRegion } from '../partner/region';
import { angabe, firmaVeroeffentlichbar, standort } from '../rechtliches/firma';
import { ortsseiteGruende, verfuegbarkeitEingetragen } from '../rechtliches/indexierung';
import type { CityPage, CompanyLocation, CompanyProfile, OrtsseitenLage } from '../types';

import { landName, normalisierePostleitzahl, type OrtsstammIndex } from './index-stamm';

export interface LageKontext {
  stamm: OrtsstammIndex;
  /** Postleitzahl der Werkstatt (Einstellungen: Werkstattadresse, sonst Firmensitz). */
  werkstattPlz: string | null | undefined;
  /** Freigeschaltete Partnerbetriebe mit Postleitzahlen-Mustern (nie Namen). */
  partner: readonly PartnerFuerRegion[];
}

/** Gemeindeschlüssel in der Schreibweise des Stamms (acht Ziffern) oder null. */
export function normalisiereGemeindeschluessel(eingabe: string | null | undefined): string | null {
  const wert = (eingabe ?? '').replace(/\s+/g, '');
  return /^\d{8}$/.test(wert) ? wert : null;
}

/** Platz in Anhang A (Rang innerhalb des Landes) für einen Gemeindeschlüssel, sonst null. */
export function anhangARang(stamm: Pick<OrtsstammIndex, 'prioritaet'>, schluessel: string | null | undefined): number | null {
  if (!schluessel) return null;
  return stamm.prioritaet.find((eintrag) => eintrag.schluessel === schluessel)?.rang ?? null;
}

/** Lage einer Ortsseite ohne Gründe (die brauchen alle Ortsseiten, siehe `ortsseitenMitLage`). */
function lageOhneGruende(city: CityPage, kontext: LageKontext): Omit<OrtsseitenLage, 'gruende'> {
  const { stamm } = kontext;
  const ags = normalisiereGemeindeschluessel(city.gemeindeschluessel);
  const gemeinde = ags ? stamm.gemeinde(ags) : undefined;
  const kreis = gemeinde ? stamm.kreis(gemeinde.kreis) : undefined;
  const postleitzahlen = gemeinde ? stamm.postleitzahlenDerGemeinde(gemeinde.schluessel) : [];

  // Werkstatt: über die Postleitzahl ihrer Anschrift; Gemeinden und Kreise, die diese Postleitzahl berührt.
  const werkstattPlz = normalisierePostleitzahl(kontext.werkstattPlz);
  const werkstattEintrag = werkstattPlz ? stamm.postleitzahl(werkstattPlz) : undefined;
  const werkstattKreise = new Set(werkstattEintrag?.kreise ?? []);
  for (const schluessel of werkstattEintrag?.gemeinden ?? []) {
    const g = stamm.gemeinde(schluessel);
    if (g) werkstattKreise.add(g.kreis);
  }
  const werkstatt: OrtsseitenLage['werkstatt'] = !gemeinde
    ? null
    : werkstattEintrag?.gemeinden.includes(gemeinde.schluessel)
      ? 'ort'
      : werkstattKreise.has(gemeinde.kreis)
        ? 'kreis'
        : null;

  const partnerDeckt = postleitzahlen.some((plz) => deckendePartner(plz, AUFTRAGSART_SAMMELWERT, kontext.partner).length > 0);
  const gepflegt = typeof city.prioritaet === 'number' && Number.isFinite(city.prioritaet) ? city.prioritaet : null;

  return {
    gemeinde: gemeinde ? { schluessel: gemeinde.schluessel, name: gemeinde.name } : null,
    kreis: kreis ? { schluessel: kreis.schluessel, name: kreis.name, art: kreis.art } : null,
    land: gemeinde ? (landName(gemeinde.land) ?? null) : null,
    postleitzahlen,
    koordinaten: gemeinde && gemeinde.breite !== null && gemeinde.laenge !== null ? { breite: gemeinde.breite, laenge: gemeinde.laenge } : null,
    werkstatt,
    partnerDeckt,
    verfuegbarkeit: verfuegbarkeitEingetragen(city.verfuegbarkeit),
    prioritaet: gepflegt ?? anhangARang(stamm, gemeinde?.schluessel),
  };
}

/** Reihenfolge nach der Priorität des Inhabers: aufsteigend, ohne Priorität hinten, dann nach dem Namen. */
export function ortsseitenOrdnen<T extends Pick<CityPage, 'city'> & { lage?: Pick<OrtsseitenLage, 'prioritaet'> }>(orte: readonly T[]): T[] {
  const rang = (ort: T) => ort.lage?.prioritaet ?? Number.POSITIVE_INFINITY;
  return [...orte].sort((a, b) => rang(a) - rang(b) || a.city.localeCompare(b.city, 'de'));
}

/**
 * Alle veröffentlichten Ortsseiten mit Lage und Gründen, geordnet nach Priorität. Die Prüfung auf Textgleichheit
 * läuft über alle übergebenen Ortsseiten.
 */
export function ortsseitenMitLage(cities: readonly CityPage[], kontext: LageKontext): CityPage[] {
  const mitLage = cities.map((city) => {
    const lage = lageOhneGruende(city, kontext);
    return { ...city, lage: { ...lage, gruende: ortsseiteGruende(city, cities, lage) } };
  });
  return ortsseitenOrdnen(mitLage);
}

/** Ohne lesbaren Stamm: Lage leer, Grund genannt; die Seiten bleiben erreichbar, aber noindex. */
export function ortsseitenOhneStamm(cities: readonly CityPage[]): CityPage[] {
  return cities.map((city) => ({
    ...city,
    lage: {
      gemeinde: null,
      kreis: null,
      land: null,
      postleitzahlen: [],
      koordinaten: null,
      werkstatt: null,
      partnerDeckt: false,
      verfuegbarkeit: verfuegbarkeitEingetragen(city.verfuegbarkeit),
      prioritaet: typeof city.prioritaet === 'number' ? city.prioritaet : null,
      gruende: ['Ortsstamm nicht lesbar: Landkreis, Postleitzahlen und Leistungsweg sind nicht belegt.'],
    },
  }));
}

/* ---------- Anzeige auf der Ortsseite ---------------------------------- */

const KREIS_ART: Readonly<Record<string, string>> = {
  landkreis: 'Landkreis',
  kreis: 'Kreis',
  'kreisfreie-stadt': 'Kreisfreie Stadt',
  stadtkreis: 'Stadtkreis',
  regionalverband: 'Regionalverband',
};

/** Kreis für die Anzeige: Bezeichnung und Name ohne den Zusatz nach dem Komma („Flensburg, Stadt“ → „Flensburg“). */
export function kreisAnzeige(kreis: OrtsseitenLage['kreis']): { bezeichnung: string; name: string } | null {
  if (!kreis) return null;
  return { bezeichnung: KREIS_ART[kreis.art] ?? 'Kreis', name: kreis.name.split(',')[0].trim() };
}

export type KontaktwegArt = 'werkstatt' | 'partner' | 'anfrage';

export interface Kontaktweg {
  art: KontaktwegArt;
  href: string;
  label: string;
}

/**
 * Anschrift der Werkstatt für die Ortsseite: die gepflegte Werkstattadresse, sonst der Firmensitz (dort ist die
 * Werkstatt, solange keine eigene Adresse gepflegt ist). Ohne veröffentlichbare Firmendaten keine Anschrift.
 */
export function werkstattAnschrift(company: CompanyProfile): CompanyLocation | undefined {
  const eigene = standort(company);
  if (eigene) return eigene;
  if (!firmaVeroeffentlichbar(company)) return undefined;
  const street = angabe(company.street);
  const postalCode = angabe(company.postalCode);
  const city = angabe(company.city);
  return street && postalCode && city ? { label: 'Werkstatt', street, postalCode, city } : undefined;
}

/**
 * Kontaktweg je Lage: Termin in der Werkstatt (Werkstatt im Ort oder Landkreis, Autoschlüssel angeboten), sonst der
 * Partnerweg (nur mit Schalter `PARTNERMODELL_B` und abdeckendem Partner), sonst die allgemeine Anfrage. Der Knopf zur
 * Werkstatt nennt ihren Ort, wenn er bekannt ist; die Anschrift steht im Kopf der Seite.
 */
export function kontaktweg(city: Pick<CityPage, 'servicesOffered' | 'lage'>, partnerwegAktiv: boolean, werkstattOrt?: string | null): Kontaktweg {
  const autoschluessel = city.servicesOffered.includes('autoschluessel');
  if (autoschluessel && city.lage?.werkstatt) {
    const label = werkstattOrt ? `Termin in unserer Werkstatt in ${werkstattOrt}` : 'Termin in unserer Werkstatt';
    return { art: 'werkstatt', href: '/autoschluessel/anfrage', label };
  }
  if (autoschluessel && partnerwegAktiv && city.lage?.partnerDeckt) {
    return { art: 'partner', href: '/autoschluessel/anfrage', label: 'Termin bei einem Partner anfragen' };
  }
  return { art: 'anfrage', href: '/service-und-termin/anfrage', label: 'Anfrage stellen' };
}

/** Vergleichsform eines Ortsnamens: klein, ohne Zusatz nach dem Komma oder in Klammern. */
function ortsnameForm(name: string): string {
  return name
    .normalize('NFKC')
    .toLowerCase()
    .split(',')[0]
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/**
 * Passt der Name der Gemeinde im Stamm zum Ort der Seite? „Frankfurt“ passt zu „Frankfurt am Main“, „Halle“ zu
 * „Halle (Saale)“; ein anderer Ort nicht. Nur ein Hinweis im Admin (falscher Schlüssel), keine Regel für Suchmaschinen.
 */
export function gemeindeNamePasst(stadt: string, gemeindeName: string): boolean {
  const a = ortsnameForm(stadt);
  const b = ortsnameForm(gemeindeName);
  if (!a || !b) return false;
  return a === b || a.startsWith(`${b} `) || b.startsWith(`${a} `);
}

/** Aussage zum Partnerbezug, ohne Namen; nur wenn ein Partner den Ort abdeckt. */
export const PARTNERBEZUG_SATZ = 'In Ihrer Region arbeitet ein geprüfter Autoschlüssel-Partner.';

/** Partnerbezug der Ortsseite: der Satz ohne Namen, nur wenn ein freigeschalteter Partner den Ort abdeckt. */
export function partnerbezug(city: Pick<CityPage, 'lage'>): string | null {
  return city.lage?.partnerDeckt ? PARTNERBEZUG_SATZ : null;
}

/* ---------- Zählung für die Ansicht „Prioritätsorte“ (FA-AA-05) --------- */

export interface VorgangFuerZaehlung {
  plz?: string | null;
  createdAt: string;
}

/** Beginn des Zeitraums „letzte zwölf Monate“. */
export function zwoelfMonateVor(jetzt: Date): Date {
  const ab = new Date(jetzt);
  ab.setUTCFullYear(ab.getUTCFullYear() - 1);
  return ab;
}

/**
 * Vorgänge der letzten zwölf Monate je Gemeindeschlüssel, über die Postleitzahl des Vorgangs. Eine Postleitzahl, die
 * mehrere Gemeinden berührt, zählt bei jeder; eine unbekannte Postleitzahl zählt nirgends. Nur Anzeige.
 */
export function vorgaengeJeGemeinde(
  vorgaenge: readonly VorgangFuerZaehlung[],
  stamm: Pick<OrtsstammIndex, 'postleitzahl'>,
  jetzt: Date,
): Map<string, number> {
  const ab = zwoelfMonateVor(jetzt).getTime();
  const bis = jetzt.getTime();
  const zaehler = new Map<string, number>();
  for (const vorgang of vorgaenge) {
    const zeit = Date.parse(vorgang.createdAt);
    if (!Number.isFinite(zeit) || zeit < ab || zeit > bis) continue;
    const eintrag = stamm.postleitzahl(vorgang.plz ?? '');
    for (const ags of new Set(eintrag?.gemeinden ?? [])) zaehler.set(ags, (zaehler.get(ags) ?? 0) + 1);
  }
  return zaehler;
}

/* ---------- Ansicht „Prioritätsorte“ (FA-AA-01, FA-AA-05, FA-AA-09) ------- */

export interface OrtsseiteKurz {
  gemeindeschluessel?: string | null;
  veroeffentlicht: boolean;
}

export interface PrioritaetsortZeile {
  land: string;
  rang: number;
  name: string;
  schluessel: string | null;
  /** Zuordnung offen (Inhaber bestätigt): Kandidaten für Menschen, nichts geraten. */
  offen: { kandidaten: string[]; vorschlag: string | null } | null;
  seiteVorhanden: boolean;
  veroeffentlicht: boolean;
  partnerVorhanden: boolean;
  vorgaenge12Monate: number;
}

/**
 * Zeilen der Ansicht „Prioritätsorte“ in der Reihenfolge des Inhabers (Land wie in der Liste, Rang). Nur Anzeige:
 * Daraus entsteht keine Seite, und die Zahl der Vorgänge setzt keine Priorität.
 */
export function prioritaetsorteZeilen(
  stamm: Pick<OrtsstammIndex, 'prioritaet'>,
  seiten: readonly OrtsseiteKurz[],
  gemeindenMitPartner: ReadonlySet<string>,
  vorgaenge: ReadonlyMap<string, number>,
): PrioritaetsortZeile[] {
  const jeSchluessel = new Map<string, OrtsseiteKurz[]>();
  for (const seite of seiten) {
    const ags = normalisiereGemeindeschluessel(seite.gemeindeschluessel);
    if (ags) jeSchluessel.set(ags, [...(jeSchluessel.get(ags) ?? []), seite]);
  }
  return stamm.prioritaet.map((eintrag) => {
    const schluessel = eintrag.zuordnung === 'offen' ? null : eintrag.schluessel;
    const eigene = schluessel ? (jeSchluessel.get(schluessel) ?? []) : [];
    return {
      land: landName(eintrag.land) ?? eintrag.land,
      rang: eintrag.rang,
      name: eintrag.amtlicherName ?? eintrag.name,
      schluessel,
      offen: eintrag.zuordnung === 'offen' ? { kandidaten: [...(eintrag.kandidaten ?? [])], vorschlag: eintrag.vorschlag ?? null } : null,
      seiteVorhanden: eigene.length > 0,
      veroeffentlicht: eigene.some((seite) => seite.veroeffentlicht),
      partnerVorhanden: schluessel ? gemeindenMitPartner.has(schluessel) : false,
      vorgaenge12Monate: schluessel ? (vorgaenge.get(schluessel) ?? 0) : 0,
    };
  });
}

/** Gemeinden, deren Postleitzahlen ein freigeschalteter Partner für Autoschlüssel abdeckt. */
export function gemeindenMitPartner(
  stamm: Pick<OrtsstammIndex, 'postleitzahlenDerGemeinde'>,
  schluessel: readonly string[],
  partner: readonly PartnerFuerRegion[],
): Set<string> {
  const ergebnis = new Set<string>();
  if (partner.length === 0) return ergebnis;
  for (const ags of schluessel) {
    if (stamm.postleitzahlenDerGemeinde(ags).some((plz) => deckendePartner(plz, AUFTRAGSART_SAMMELWERT, partner).length > 0)) ergebnis.add(ags);
  }
  return ergebnis;
}
