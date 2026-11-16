import type { CollectionBeforeValidateHook } from 'payload';

import { partnerbetriebAusBewerbung, type PartnerbetriebAusBewerbung } from '../../lib/partner/bewerbungsformular';
import { auftragsartName, nichtMehrWaehlbar, nichtMehrWaehlbarFuerAuftrag } from '../../lib/partner/leistungen';

/*
 * Partnerbetrieb und Bewerbung (FA-PLATTFORM-01): Verknüpft das Team einen Partnerbetrieb mit der
 * Bewerbung (Vorgang der Art „partner“), füllt der Server die Felder, die das Formular abfragt: Kontakt,
 * Region, Leistungen, Geräte, Werkstatt und Erfahrung. Er füllt nur, was noch leer ist; Eingaben des
 * Teams bleiben. Leistungen außerhalb der neun gehen nicht in die Auftragsarten, sondern als Hinweis in
 * die interne Notiz.
 */

type Daten = Record<string, unknown>;

function leer(wert: unknown): boolean {
  if (wert === null || wert === undefined || wert === '') return true;
  return Array.isArray(wert) && wert.length === 0;
}

function gruppe(wert: unknown): Daten {
  return wert && typeof wert === 'object' && !Array.isArray(wert) ? (wert as Daten) : {};
}

function relationsId(wert: unknown): string | null {
  if (wert === null || wert === undefined || wert === '') return null;
  if (typeof wert === 'object') {
    const id = (wert as { id?: unknown }).id;
    return id === null || id === undefined ? null : String(id);
  }
  return String(wert);
}

export interface BewerbungKontaktFelder {
  ansprechpartner?: string;
  email?: string;
  telefon?: string;
}

export const HINWEIS_FRUEHERE_LEISTUNGEN = 'Aus der Bewerbung, nicht Teil des Partnernetzes:';

/**
 * Setzt die Angaben der Bewerbung in die Daten eines Partnerbetriebs ein, ohne Vorhandenes zu
 * überschreiben. Gruppen werden vollständig zurückgegeben (Bestand plus Ergänzung), damit ein
 * Teilupdate keine Unterfelder leert. Reine Funktion.
 */
export function bewerbungEinsetzen(
  data: Daten,
  bestand: Daten | undefined,
  aus: PartnerbetriebAusBewerbung,
  kontakt: BewerbungKontaktFelder = {},
): Daten {
  const alt = bestand ?? {};
  const neu: Daten = { ...data };
  const istLeer = (feld: string) => leer(neu[feld]) && leer(alt[feld]);

  const einfach: Record<string, unknown> = {
    firma: aus.firma,
    ansprechpartner: kontakt.ansprechpartner,
    email: kontakt.email,
    telefon: kontakt.telefon,
    plz: aus.plz,
    ort: aus.ort,
  };
  for (const [feld, wert] of Object.entries(einfach)) {
    if (!leer(wert) && istLeer(feld)) neu[feld] = wert;
  }
  if (aus.auftragsarten?.length && istLeer('auftragsarten')) neu.auftragsarten = aus.auftragsarten;
  if (aus.geraete?.length && istLeer('geraete')) neu.geraete = aus.geraete;

  for (const name of ['einsatzgebiet', 'werkstatt', 'erfahrung'] as const) {
    const quelle = gruppe(aus[name]);
    if (!Object.keys(quelle).length) continue;
    const zusammen: Daten = { ...gruppe(alt[name]), ...gruppe(neu[name]) };
    let geaendert = false;
    for (const [feld, wert] of Object.entries(quelle)) {
      // Ein Haken „nein“ (false) gilt als nicht ausgefüllt, solange das Team nichts gesetzt hat.
      // Das Admin-Formular schickt die ganze Gruppe mit, also auch den Grundwert false der Checkbox; nur ein
      // gespeichertes true gilt als Entscheidung des Teams.
      const vorhanden = zusammen[feld];
      if (!leer(wert) && (leer(vorhanden) || (vorhanden === false && gruppe(alt[name])[feld] !== true))) {
        zusammen[feld] = wert;
        geaendert = true;
      }
    }
    if (geaendert) neu[name] = zusammen;
  }

  if (aus.fruehereLeistungen?.length) {
    const notiz = typeof neu.notiz === 'string' ? neu.notiz : typeof alt.notiz === 'string' ? alt.notiz : '';
    if (!notiz.includes(HINWEIS_FRUEHERE_LEISTUNGEN)) {
      const zeile = `${HINWEIS_FRUEHERE_LEISTUNGEN} ${aus.fruehereLeistungen.join(', ')}.`;
      neu.notiz = notiz ? `${notiz}\n${zeile}` : zeile;
    }
  }
  return neu;
}

/** Meldung zu nicht mehr wählbaren Auftragsarten. */
export function meldungNichtMehrWaehlbar(falsch: readonly string[]): string | null {
  if (!falsch.length) return null;
  return `Das Partnernetz betrifft nur Autoschlüssel und Fahrzeugschlüssel. Nicht mehr wählbar: ${falsch.map(auftragsartName).join(', ')}.`;
}

/** Meldung, wenn eine nicht mehr wählbare Auftragsart neu gesetzt werden soll (Sammlung Partnerbetriebe). */
export function auftragsartenPruefen(neu: unknown, bisher: unknown): string | null {
  if (!Array.isArray(neu)) return null;
  return meldungNichtMehrWaehlbar(nichtMehrWaehlbar(neu as string[], Array.isArray(bisher) ? (bisher as string[]) : []));
}

function artenAus(zeilen: unknown): string[] {
  if (!Array.isArray(zeilen)) return [];
  return zeilen
    .map((z) => (z && typeof z === 'object' ? (z as { auftragsart?: unknown }).auftragsart : undefined))
    .filter((w): w is string => typeof w === 'string' && w !== '');
}

/**
 * Provisionen je Auftragsart (Partnerbetrieb): Frühere Werte lassen sich nicht neu setzen, der Sammelwert
 * bleibt wählbar, weil Aufträge ihn tragen. Bestehende Zeilen bleiben speicherbar.
 */
export function provisionenPruefen(neu: unknown, bisher: unknown): string | null {
  if (!Array.isArray(neu)) return null;
  return meldungNichtMehrWaehlbar(nichtMehrWaehlbarFuerAuftrag(artenAus(neu), artenAus(bisher)));
}

/** Auftragsart der Vermittlung am Vorgang: frühere Werte nicht neu setzen, Sammelwert bleibt. */
export function auftragsartAmVorgangPruefen(neu: unknown, bisher: unknown): string | null {
  if (typeof neu !== 'string' || neu === '') return null;
  return meldungNichtMehrWaehlbar(nichtMehrWaehlbarFuerAuftrag([neu], typeof bisher === 'string' ? [bisher] : []));
}

/** Übernimmt die Bewerbung, sobald sie am Partnerbetrieb neu verknüpft wird. */
export const bewerbungUebernehmen: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  if (!data) return data;
  const id = relationsId(data.bewerbung);
  if (!id || id === relationsId(originalDoc?.bewerbung)) return data;
  const vorgang = await req.payload.findByID({ collection: 'vorgaenge', id, depth: 0, req }).catch(() => null);
  if (!vorgang || vorgang.art !== 'partner') return data;
  const k = vorgang.kontakt;
  const kontakt: BewerbungKontaktFelder = {
    ansprechpartner: [k?.vorname, k?.nachname].filter(Boolean).join(' ') || undefined,
    email: k?.email || undefined,
    telefon: k?.telefon || undefined,
  };
  const daten = (vorgang.daten as Daten | null) ?? {};
  const aus = partnerbetriebAusBewerbung(daten, { company: k?.firma ?? undefined, postalCode: k?.plz ?? undefined, city: k?.ort ?? undefined });
  return bewerbungEinsetzen(data as Daten, originalDoc as Daten | undefined, aus, kontakt);
};
