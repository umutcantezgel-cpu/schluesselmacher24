/*
 * Partnerbewerbung „Partner werden“ (FA-PLATTFORM-01, FA-08-09 bis FA-08-15): Felder, Prüfung und
 * Übernahme in den Partnerbetrieb. Das Formular fragt Region, Leistungen, Geräte, Werkstatt, mobilen
 * Radius, Erfahrung und Kontaktdaten ab. Der Server prüft jedes Pflichtfeld selbst und baut die
 * gespeicherten Daten und die Zusammenfassung neu; was der Browser sonst mitschickt, fällt weg.
 *
 * Reine Funktionen ohne Bibliotheken, nur relative Importe: Formular (Browser), Aktion und Payload-Hook
 * laden diese Datei.
 */

import type { SummarySection } from '../types';

import { auftragsartName, istPartnerLeistung, PARTNER_LEISTUNGEN_LISTE, type PartnerLeistung } from './leistungen';

/** Größter Umkreis in Kilometern, gleich im Formular und am Partnerbetrieb (FA-07-16). */
export const MAX_RADIUS_KM = 300;
/** Höchstzahl der Geräte in einer Bewerbung. */
export const MAX_GERAETE = 20;
export const MAX_ERFAHRUNG_JAHRE = 80;

export type GeraeteArt = 'fraesmaschine' | 'programmiergeraet' | 'diagnose';

export const GERAETE_ARTEN: ReadonlyArray<{ value: GeraeteArt; label: string }> = [
  { value: 'fraesmaschine', label: 'Schlüsselfräsmaschine' },
  { value: 'programmiergeraet', label: 'Programmiergerät' },
  { value: 'diagnose', label: 'Diagnosegerät' },
];

export interface PartnerGeraet {
  art: GeraeteArt;
  /** Hersteller als freie Angabe (R12: nur sachlich). */
  hersteller: string | null;
  typ: string | null;
}

/** Geprüfte Bewerbung, wie sie im Vorgang (Art `partner`) gespeichert wird. */
export interface PartnerBewerbung {
  firma: string;
  /** Postleitzahl und Ort des Betriebs. */
  plz: string;
  ort: string;
  /** Einsatzgebiet als Postleitzahlen oder Muster wie `355*`, kommagetrennt; leer, wenn nur der Umkreis gilt. */
  einsatzPostleitzahlen: string | null;
  /** Umkreis in Kilometern vom Betrieb; Pflicht bei mobilem Einsatz. */
  einsatzradiusKm: number | null;
  mobileEinsaetze: boolean;
  werkstatt: { vorhanden: boolean; anschrift: string | null };
  leistungen: PartnerLeistung[];
  geraete: PartnerGeraet[];
  erfahrung: { jahre: number; schwerpunkte: string | null; fahrzeugabdeckung: string | null };
  qualifikationen: string | null;
  nachweisAnzahl: number;
  datenschutz: true;
  datenschutzAm: string;
}

export interface BewerbungKontakt {
  firstName?: string;
  lastName?: string;
  company?: string;
  email?: string;
  phone?: string;
  postalCode?: string;
  city?: string;
}

export const MELDUNG_NUR_FAHRZEUG =
  'Das Partnernetz betrifft nur Autoschlüssel und Fahrzeugschlüssel. Bitte wählen Sie Leistungen aus der Liste.';

/* ---------- Einzelprüfungen (auch im Browser) --------------------------- */

const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function plzGueltig(wert: string | null | undefined): boolean {
  return /^\d{5}$/.test((wert ?? '').trim());
}

/** Teile einer Postleitzahl-Liste: fünf Ziffern oder ein Muster aus 1 bis 4 Ziffern mit `*`. */
export function plzListeTeile(wert: string | null | undefined): string[] {
  return (wert ?? '').split(/[\s,;]+/).map((t) => t.trim()).filter(Boolean);
}

export function plzListeGueltig(wert: string | null | undefined): boolean {
  const teile = plzListeTeile(wert);
  return teile.length <= 200 && teile.every((t) => /^\d{5}$/.test(t) || /^\d{1,4}\*$/.test(t));
}

/** Ganze Zahl von 1 bis `MAX_RADIUS_KM` oder `null`. */
export function radiusAusEingabe(wert: unknown): number | null {
  const zahl = typeof wert === 'number' ? wert : typeof wert === 'string' && wert.trim() !== '' ? Number(wert.trim()) : NaN;
  return Number.isInteger(zahl) && zahl >= 1 && zahl <= MAX_RADIUS_KM ? zahl : null;
}

export function jahreAusEingabe(wert: unknown): number | null {
  const zahl = typeof wert === 'number' ? wert : typeof wert === 'string' && wert.trim() !== '' ? Number(wert.trim()) : NaN;
  return Number.isInteger(zahl) && zahl >= 0 && zahl <= MAX_ERFAHRUNG_JAHRE ? zahl : null;
}

export function emailGueltig(wert: string | null | undefined): boolean {
  return EMAIL_MUSTER.test((wert ?? '').trim());
}

export function telefonGueltig(wert: string | null | undefined): boolean {
  return (wert ?? '').replace(/\D/g, '').length >= 6;
}

/* ---------- Gesamtprüfung auf dem Server -------------------------------- */

function textOderNull(wert: unknown, max: number): string | null {
  if (typeof wert !== 'string') return null;
  const t = wert.trim().slice(0, max);
  return t ? t : null;
}

function objekt(wert: unknown): Record<string, unknown> {
  return wert && typeof wert === 'object' && !Array.isArray(wert) ? (wert as Record<string, unknown>) : {};
}

export type BewerbungErgebnis = { ok: true; bewerbung: PartnerBewerbung } | { ok: false; fehler: string[] };

/**
 * Prüft eine Bewerbung vollständig (Serverprüfung aller Pflichtfelder). Leistungen außerhalb der neun,
 * etwa eine Türöffnung, lehnt sie ab, statt sie still zu entfernen.
 */
export function bewerbungPruefen(payload: Record<string, unknown>, kontakt: BewerbungKontakt, jetzt: Date = new Date()): BewerbungErgebnis {
  const fehler: string[] = [];

  // Kontakt
  const firma = textOderNull(payload.firma, 200) ?? textOderNull(kontakt.company, 200);
  if (!firma || firma.length < 2) fehler.push('Firmenname fehlt.');
  if (!textOderNull(kontakt.firstName, 120) || !textOderNull(kontakt.lastName, 120)) fehler.push('Vor- und Nachname der Ansprechperson fehlen.');
  if (!emailGueltig(kontakt.email)) fehler.push('E-Mail-Adresse fehlt oder ist ungültig.');
  if (!telefonGueltig(kontakt.phone)) fehler.push('Telefonnummer fehlt.');

  // Region
  const plz = textOderNull(payload.plz, 5) ?? '';
  const ort = textOderNull(payload.ort, 120) ?? '';
  if (!plzGueltig(plz)) fehler.push('Postleitzahl des Betriebs fehlt oder hat nicht fünf Ziffern.');
  if (ort.length < 2) fehler.push('Ort des Betriebs fehlt.');
  const einsatzPlzText = textOderNull(payload.einsatzPostleitzahlen, 2000);
  if (einsatzPlzText && !plzListeGueltig(einsatzPlzText)) fehler.push('Postleitzahlen des Einsatzgebiets: bitte fünf Ziffern oder Muster wie 355*.');
  const radiusRoh = payload.einsatzradiusKm;
  const radius = radiusAusEingabe(radiusRoh);
  if (radiusRoh !== null && radiusRoh !== undefined && radiusRoh !== '' && radius === null) {
    fehler.push(`Einsatzradius: bitte eine ganze Zahl von 1 bis ${MAX_RADIUS_KM} Kilometern.`);
  }

  // Werkstatt und mobiler Einsatz
  const mobil = payload.mobileEinsaetze;
  const werkstattRoh = objekt(payload.werkstatt);
  const werkstattVorhanden = werkstattRoh.vorhanden;
  if (typeof mobil !== 'boolean') fehler.push('Angabe zu mobilen Einsätzen fehlt.');
  if (typeof werkstattVorhanden !== 'boolean') fehler.push('Angabe zur festen Werkstatt fehlt.');
  const anschrift = textOderNull(werkstattRoh.anschrift, 300);
  if (werkstattVorhanden === true && (!anschrift || anschrift.length < 5)) fehler.push('Anschrift der Werkstatt fehlt.');
  if (werkstattVorhanden === false && mobil === false) fehler.push('Ohne Werkstatt braucht es mobile Einsätze.');
  if (mobil === true && radius === null) fehler.push('Für mobile Einsätze fehlt der Radius in Kilometern.');
  if (radius === null && !einsatzPlzText) fehler.push('Einsatzgebiet fehlt: Umkreis in Kilometern oder Postleitzahlen.');

  // Leistungen: nur die neun
  const leistungenRoh = Array.isArray(payload.leistungen) ? payload.leistungen : [];
  if (leistungenRoh.length === 0) fehler.push('Bitte mindestens eine Leistung wählen.');
  if (leistungenRoh.some((l) => !istPartnerLeistung(l))) fehler.push(MELDUNG_NUR_FAHRZEUG);
  const leistungen = PARTNER_LEISTUNGEN_LISTE.map((l) => l.value).filter((v) => leistungenRoh.includes(v));

  // Geräte
  const geraeteRoh = Array.isArray(payload.geraete) ? payload.geraete : [];
  if (geraeteRoh.length > MAX_GERAETE) fehler.push(`Höchstens ${MAX_GERAETE} Geräte.`);
  const geraete: PartnerGeraet[] = [];
  for (const roh of geraeteRoh.slice(0, MAX_GERAETE)) {
    const g = objekt(roh);
    if (!GERAETE_ARTEN.some((a) => a.value === g.art)) {
      fehler.push('Geräte: bitte die Art wählen.');
      continue;
    }
    geraete.push({ art: g.art as GeraeteArt, hersteller: textOderNull(g.hersteller, 80), typ: textOderNull(g.typ, 80) });
  }

  // Erfahrung
  const erfahrungRoh = objekt(payload.erfahrung);
  const jahre = jahreAusEingabe(erfahrungRoh.jahre);
  if (jahre === null) fehler.push(`Erfahrung: bitte die Jahre als ganze Zahl von 0 bis ${MAX_ERFAHRUNG_JAHRE}.`);

  if (payload.datenschutz !== true) fehler.push('Die Einwilligung zum Datenschutz fehlt.');

  if (fehler.length) return { ok: false, fehler: [...new Set(fehler)] };

  const am = typeof payload.datenschutzAm === 'string' && !Number.isNaN(Date.parse(payload.datenschutzAm)) ? payload.datenschutzAm : jetzt.toISOString();
  const anzahl = typeof payload.nachweisAnzahl === 'number' && Number.isInteger(payload.nachweisAnzahl) ? Math.max(0, Math.min(payload.nachweisAnzahl, 30)) : 0;

  return {
    ok: true,
    bewerbung: {
      firma: firma as string,
      plz,
      ort,
      einsatzPostleitzahlen: einsatzPlzText ? plzListeTeile(einsatzPlzText).join(', ') : null,
      einsatzradiusKm: radius,
      mobileEinsaetze: mobil as boolean,
      werkstatt: { vorhanden: werkstattVorhanden as boolean, anschrift: werkstattVorhanden ? anschrift : null },
      leistungen,
      geraete,
      erfahrung: {
        jahre: jahre as number,
        schwerpunkte: textOderNull(erfahrungRoh.schwerpunkte, 2000),
        fahrzeugabdeckung: textOderNull(erfahrungRoh.fahrzeugabdeckung, 2000),
      },
      qualifikationen: textOderNull(payload.qualifikationen, 2000),
      nachweisAnzahl: anzahl,
      datenschutz: true,
      datenschutzAm: am,
    },
  };
}

/* ---------- Anzeige ----------------------------------------------------- */

export function geraetText(g: Pick<PartnerGeraet, 'art' | 'hersteller' | 'typ'>): string {
  const art = GERAETE_ARTEN.find((a) => a.value === g.art)?.label ?? g.art;
  const naeher = [g.hersteller, g.typ].filter(Boolean).join(' ');
  return naeher ? `${art}: ${naeher}` : art;
}

/** Zusammenfassung für Vorgang, Mail und Bestätigung; vom Server aus der geprüften Bewerbung gebaut. */
export function bewerbungZusammenfassung(b: PartnerBewerbung, kontakt: BewerbungKontakt & { salutation?: string }, nachweise: string[] = []): SummarySection[] {
  const ja = (w: boolean) => (w ? 'ja' : 'nein');
  return [
    {
      title: 'Betrieb',
      rows: [
        { label: 'Firma', value: b.firma },
        { label: 'Ansprechpartner', value: [kontakt.salutation, kontakt.firstName, kontakt.lastName].filter(Boolean).join(' ') || '—' },
        { label: 'E-Mail', value: kontakt.email?.trim() || '—' },
        { label: 'Telefon', value: kontakt.phone?.trim() || '—' },
      ],
    },
    {
      title: 'Region und Einsatz',
      rows: [
        { label: 'PLZ und Ort', value: `${b.plz} ${b.ort}` },
        { label: 'Einsatzgebiet (Postleitzahlen)', value: b.einsatzPostleitzahlen ?? 'keine Angabe' },
        { label: 'Einsatzradius', value: b.einsatzradiusKm ? `${b.einsatzradiusKm} km` : 'keine Angabe' },
        { label: 'Mobile Einsätze', value: ja(b.mobileEinsaetze) },
        { label: 'Feste Werkstatt', value: b.werkstatt.vorhanden ? `ja, ${b.werkstatt.anschrift ?? ''}`.replace(/, $/, '') : 'nein' },
      ],
    },
    {
      title: 'Leistungen und Ausstattung',
      rows: [
        { label: 'Leistungen', value: b.leistungen.map(auftragsartName).join(', ') },
        { label: 'Geräte', value: b.geraete.length ? b.geraete.map(geraetText).join('; ') : 'keine Angabe' },
      ],
    },
    {
      title: 'Erfahrung',
      rows: [
        { label: 'Jahre mit Autoschlüsseln', value: String(b.erfahrung.jahre) },
        { label: 'Schwerpunkte', value: b.erfahrung.schwerpunkte ?? 'keine Angabe' },
        { label: 'Fahrzeugabdeckung', value: b.erfahrung.fahrzeugabdeckung ?? 'keine Angabe' },
        { label: 'Qualifikationen', value: b.qualifikationen ?? 'keine Angabe' },
        { label: 'Nachweise', value: nachweise.length ? nachweise.join(', ') : 'keine beigefügt' },
      ],
    },
  ];
}

/* ---------- Übernahme in den Partnerbetrieb ----------------------------- */

/** Felder des Partnerbetriebs, die eine Bewerbung füllt (Sammlung `partnerbetriebe`). */
export interface PartnerbetriebAusBewerbung {
  firma?: string;
  plz?: string;
  ort?: string;
  einsatzgebiet?: { postleitzahlen?: string; radiusKm?: number };
  auftragsarten?: PartnerLeistung[];
  geraete?: Array<{ art: GeraeteArt; hersteller?: string; typ?: string }>;
  werkstatt?: { vorhanden?: 'ja' | 'nein'; anschrift?: string; mobil?: boolean };
  erfahrung?: { jahre?: number; schwerpunkte?: string; fahrzeugabdeckung?: string };
  /** Leistungen aus dem früheren Formular, die nicht mehr zum Netz gehören (nur als Hinweis). */
  fruehereLeistungen?: string[];
}

/**
 * Liest eine gespeicherte Bewerbung, auch aus dem früheren Formular, und liefert die Felder für den
 * Partnerbetrieb. Leistungen außerhalb der neun gehen nicht in die Auftragsarten, sondern in
 * `fruehereLeistungen`.
 */
export function partnerbetriebAusBewerbung(payload: Record<string, unknown> | null | undefined, kontakt?: BewerbungKontakt): PartnerbetriebAusBewerbung {
  const p = payload ?? {};
  const aus: PartnerbetriebAusBewerbung = {};
  const firma = textOderNull(p.firma, 200) ?? textOderNull(kontakt?.company, 200);
  if (firma) aus.firma = firma;
  const plz = textOderNull(p.plz, 5) ?? textOderNull(kontakt?.postalCode, 5);
  if (plz && plzGueltig(plz)) aus.plz = plz;
  const ort = textOderNull(p.ort, 120) ?? textOderNull(kontakt?.city, 120);
  if (ort) aus.ort = ort;

  const einsatz: NonNullable<PartnerbetriebAusBewerbung['einsatzgebiet']> = {};
  const liste = textOderNull(p.einsatzPostleitzahlen, 2000);
  if (liste && plzListeGueltig(liste)) einsatz.postleitzahlen = plzListeTeile(liste).join(', ');
  const radius = radiusAusEingabe(p.einsatzradiusKm);
  if (radius !== null) einsatz.radiusKm = radius;
  if (Object.keys(einsatz).length) aus.einsatzgebiet = einsatz;

  const leistungen = Array.isArray(p.leistungen) ? p.leistungen.filter((l): l is string => typeof l === 'string') : [];
  const neun = PARTNER_LEISTUNGEN_LISTE.map((l) => l.value).filter((v) => leistungen.includes(v));
  if (neun.length) aus.auftragsarten = neun;
  const frueher = leistungen.filter((l) => !istPartnerLeistung(l)).map(auftragsartName);
  if (frueher.length) aus.fruehereLeistungen = frueher;

  if (Array.isArray(p.geraete)) {
    const geraete = p.geraete
      .map(objekt)
      .filter((g) => GERAETE_ARTEN.some((a) => a.value === g.art))
      .slice(0, MAX_GERAETE)
      .map((g) => ({
        art: g.art as GeraeteArt,
        ...(textOderNull(g.hersteller, 80) ? { hersteller: textOderNull(g.hersteller, 80) as string } : {}),
        ...(textOderNull(g.typ, 80) ? { typ: textOderNull(g.typ, 80) as string } : {}),
      }));
    if (geraete.length) aus.geraete = geraete;
  }

  const w = objekt(p.werkstatt);
  const werkstatt: NonNullable<PartnerbetriebAusBewerbung['werkstatt']> = {};
  if (typeof w.vorhanden === 'boolean') werkstatt.vorhanden = w.vorhanden ? 'ja' : 'nein';
  const anschrift = textOderNull(w.anschrift, 300);
  if (anschrift) werkstatt.anschrift = anschrift;
  if (typeof p.mobileEinsaetze === 'boolean') werkstatt.mobil = p.mobileEinsaetze;
  if (Object.keys(werkstatt).length) aus.werkstatt = werkstatt;

  const e = objekt(p.erfahrung);
  const erfahrung: NonNullable<PartnerbetriebAusBewerbung['erfahrung']> = {};
  const jahre = jahreAusEingabe(e.jahre);
  if (jahre !== null) erfahrung.jahre = jahre;
  const schwerpunkte = textOderNull(e.schwerpunkte, 2000);
  if (schwerpunkte) erfahrung.schwerpunkte = schwerpunkte;
  // Früheres Formular: „Autohersteller und Systeme“ als Fahrzeugabdeckung lesen.
  const abdeckung = textOderNull(e.fahrzeugabdeckung, 2000) ?? textOderNull(p.systeme, 2000);
  if (abdeckung) erfahrung.fahrzeugabdeckung = abdeckung;
  if (Object.keys(erfahrung).length) aus.erfahrung = erfahrung;

  return aus;
}
