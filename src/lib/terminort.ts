/* ==========================================================================
   Terminort (Erg. Leitfaden §1)
   Schwerpunkt Wetzlar: Online gebuchte Termine finden in unserer Werkstatt
   statt, Kundinnen und Kunden reisen an. Bedeutung von `location`:
   - `werkstatt` — in der Werkstatt; bei Leistungen am Fahrzeug mit Fahrzeug
     (`quote.requiresVehicleOnSite`),
   - `vor-ort` — beim Kunden. Nur nach individueller Prüfung von Aufwand und
     Kosten und nur vom Team gesetzt (Telefontermin), nie von der Buchung.
   Reine Funktionen, nur relative Importe: Mailvorlagen und Endpunkte im
   Backend laden diese Datei ebenfalls.
   ========================================================================== */

import { EIGENBEREICH_STANDARD, eigenbereichMuster, plzPasst } from './auftragsweg';
import { angabe, firmaVeroeffentlichbar, standort } from './rechtliches/firma';
import type { AppointmentInfo, BusinessRecord, CompanyLocation, CompanyProfile, OwnArea } from './types';

/** Außeneinsätze nur nach Prüfung — Wortlaut für Assistent, Mails und Hinweise. */
export const AUSSENEINSATZ_HINWEIS =
  'Ein Einsatz bei Ihnen ist nur nach individueller Prüfung möglich – rufen Sie uns dazu gern an.';

/**
 * Leistungen, die beim Fahrzeug des Kunden stattfinden: Ein ausgesperrtes Fahrzeug
 * lässt sich nicht in die Werkstatt bringen. Ort und Anfahrt klären wir nach der
 * Buchung telefonisch; überregional nur nach Prüfung (Erg. Leitfaden §1).
 */
const LEISTUNGEN_BEIM_KUNDEN: readonly string[] = ['fahrzeugoeffnung'];

export function terminBeimKunden(leistung: string | null | undefined): boolean {
  return Boolean(leistung && LEISTUNGEN_BEIM_KUNDEN.includes(leistung));
}

/** Ort einer online gebuchten Leistung. */
export function buchungsOrt(leistung: string | null | undefined): AppointmentInfo['location'] {
  return terminBeimKunden(leistung) ? 'vor-ort' : 'werkstatt';
}

/**
 * Hinweis für Leistungen beim Kunden — Assistent und Bestätigung. `bereich` ist die Bezeichnung des
 * regionalen Eigenbereichs aus den Einstellungen (Reiter Termine, FA-KERN-03).
 */
export function beimKundenHinweis(bereich: string = EIGENBEREICH_STANDARD.label): string {
  return 'Die Leistung findet bei Ihrem Fahrzeug statt. Ort und Anfahrt klären wir nach der Buchung telefonisch mit Ihnen; '
    + `außerhalb von ${bereich.trim() || EIGENBEREICH_STANDARD.label} nur nach individueller Prüfung von Aufwand und Kosten.`;
}

/** Hinweis mit der Standardbezeichnung des Eigenbereichs. */
export const BEIM_KUNDEN_HINWEIS = beimKundenHinweis();

/**
 * Anschrift der Werkstatt: der gepflegte Standort („Werkstatt und Abholung“),
 * sonst der Firmensitz. Nur veröffentlichte, gepflegte Angaben — solange die
 * Firmendaten Platzhalter sind, gibt es keine Anschrift.
 */
export function werkstattAnschrift(company: CompanyProfile | undefined): CompanyLocation | undefined {
  if (!company) return undefined;
  const eigener = standort(company);
  if (eigener) return eigener;
  if (!firmaVeroeffentlichbar(company)) return undefined;
  const street = angabe(company.street);
  const postalCode = angabe(company.postalCode);
  const city = angabe(company.city);
  if (!street || !postalCode || !city) return undefined;
  return { label: 'Werkstatt', street, postalCode, city };
}

/** „Langgasse 61, 35576 Wetzlar“. */
export function anschriftEinzeilig(anschrift: Pick<CompanyLocation, 'street' | 'postalCode' | 'city'>): string {
  return `${anschrift.street}, ${anschrift.postalCode} ${anschrift.city}`;
}

/** Muss das Fahrzeug zum Termin mit? Steht im Angebot des Vorgangs. */
export function mitFahrzeug(vorgang: Pick<BusinessRecord, 'quote'>): boolean {
  return vorgang.quote?.requiresVehicleOnSite === true;
}

export interface TerminOrtOptionen {
  /** Leistung am Fahrzeug: Das Fahrzeug kommt mit in die Werkstatt. */
  mitFahrzeug?: boolean;
  /** Aus `werkstattAnschrift` — ohne Anschrift steht nur „In unserer Werkstatt“. */
  werkstatt?: CompanyLocation;
}

/**
 * Ort für Kundinnen und Kunden, z. B. „In unserer Werkstatt, mit Fahrzeug
 * (Langgasse 61, 35576 Wetzlar)“ oder „Bei Ihnen vor Ort (nach Absprache)“.
 */
export function terminOrtText(termin: Pick<AppointmentInfo, 'location'>, optionen: TerminOrtOptionen = {}): string {
  if (termin.location === 'vor-ort') return 'Bei Ihnen vor Ort (nach Absprache)';
  const ort = optionen.mitFahrzeug ? 'In unserer Werkstatt, mit Fahrzeug' : 'In unserer Werkstatt';
  return optionen.werkstatt ? `${ort} (${anschriftEinzeilig(optionen.werkstatt)})` : ort;
}

/** Ort eines Vorgangs mit Termin, aus Termin, Angebot und Firmendaten. */
export function vorgangOrtText(
  vorgang: Pick<BusinessRecord, 'appointment' | 'quote'>,
  company: CompanyProfile | undefined,
): string | undefined {
  if (!vorgang.appointment) return undefined;
  return terminOrtText(vorgang.appointment, { mitFahrzeug: mitFahrzeug(vorgang), werkstatt: werkstattAnschrift(company) });
}

/**
 * Liegt die Anschrift außerhalb des regionalen Eigenbereichs der Werkstatt? Die Muster stehen in den
 * Einstellungen (Reiter Termine, FA-KERN-03); ohne Angabe gilt der Rückfall `35*`.
 * Erst mit vollständiger Postleitzahl — beim Tippen erscheint nichts.
 */
export function ausserhalbDerRegion(postleitzahl: string, land = 'Deutschland', eigenbereich?: OwnArea): boolean {
  const plz = postleitzahl.trim();
  if (!/^\d{4,5}$/.test(plz)) return false;
  if (land !== 'Deutschland') return true;
  return plz.length === 5 && !plzPasst(plz, eigenbereichMuster(eigenbereich));
}

/** Hinweis für Anfragen von außerhalb der Region. */
export function ausserhalbHinweis(stadt?: string): string {
  return `Termine finden in unserer Werkstatt${stadt ? ` in ${stadt}` : ''} statt. ${AUSSENEINSATZ_HINWEIS}`;
}

/**
 * Was zum Autoschlüssel-Termin mitzubringen ist — dieselben Angaben wie auf
 * den Seiten „Vor-Ort-Leistungen“, „Programmieren“ und „Nachmachen“.
 * `unbekannt`: Termin ohne Angebot (vom Team telefonisch eingetragen) — dann
 * das Fahrzeug nicht stillschweigend weglassen.
 */
export function mitbringliste(fahrzeug: boolean | 'unbekannt'): string[] {
  const fahrzeugPunkt =
    fahrzeug === 'unbekannt'
      ? ['Ihr Fahrzeug, falls am Fahrzeug gearbeitet wird (Anlernen, Programmieren) – wie telefonisch besprochen']
      : fahrzeug
        ? ['Ihr Fahrzeug – fahrbereit oder zumindest bei uns abstellbar, mit nutzbarer Bordspannung']
        : [];
  return [
    ...fahrzeugPunkt,
    'Zulassungsbescheinigung Teil I (Fahrzeugschein) im Original',
    'Nachweis, dass Sie über das Fahrzeug verfügen dürfen',
    'Alle vorhandenen Schlüssel zum Fahrzeug',
  ];
}
