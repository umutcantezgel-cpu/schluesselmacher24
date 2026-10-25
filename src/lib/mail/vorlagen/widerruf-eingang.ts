/**
 * Bestätigung des Zugangs einer Widerrufserklärung (Widerrufsbutton) — mit
 * Datum und Uhrzeit des Eingangs.
 *
 * Der Text der Erklärung wird nicht wiederholt: Die Empfängeradresse stammt
 * aus einem öffentlichen Formular, und frei eingegebener Text darf nicht über
 * unsere Domain an beliebige Adressen gehen.
 */

import { formatDateTime } from '../../format';
import { anrede, baueMail, type Baustein, type MailInhalt } from '../html';
import { ANTWORT_HINWEIS, type VorlagenKontext } from './gemeinsam';

/** Nur echte Vorgangsnummern (SM24-B-2026-0001) erscheinen in der Mail. */
const NUMMER = /^SM24-[A-Z]-\d{4}-\d{4,6}$/;

export interface WiderrufEingangDaten {
  vorname?: string;
  nachname?: string;
  vorgangsnummer?: string;
  /** ISO-Zeitpunkt des Eingangs. */
  eingegangenAm: string;
  kontext: VorlagenKontext;
}

export function widerrufEingang({ vorname, nachname, vorgangsnummer, eingegangenAm, kontext }: WiderrufEingangDaten): MailInhalt {
  const nummer = vorgangsnummer?.trim().toUpperCase();
  const bausteine: Baustein[] = [
    {
      art: 'absatz',
      text:
        `Ihre Widerrufserklärung ist am ${formatDateTime(eingegangenAm)} Uhr bei uns eingegangen. `
        + 'Mit dieser E-Mail bestätigen wir den Eingang.',
    },
  ];
  const zeilen: Array<[string, string]> = [['Eingegangen am', `${formatDateTime(eingegangenAm)} Uhr`]];
  if (nummer && NUMMER.test(nummer)) zeilen.unshift(['Vorgangsnummer', nummer]);
  bausteine.push(
    { art: 'felder', zeilen },
    { art: 'absatz', text: 'Wir bearbeiten Ihren Widerruf und melden uns mit den nächsten Schritten.' },
    ANTWORT_HINWEIS,
  );
  return baueMail({
    betreff: 'Eingang Ihrer Widerrufserklärung',
    anrede: anrede({ firstName: vorname, lastName: nachname }),
    bausteine,
    firma: kontext.firma,
    site: kontext.site,
  });
}

export interface BetriebWiderrufDaten {
  name: string;
  email: string;
  vorgangsnummer?: string;
  /** ISO-Zeitpunkt des Eingangs. */
  eingegangenAm: string;
  /** Vom Server zugeordnet (Nummer und E-Mail passen) oder von Hand zu prüfen. */
  zugeordnet: boolean;
  /** Freie Angaben des Kunden, falls vorhanden. */
  angaben?: string;
  /** Link auf die Erklärung im Backend. */
  adminUrl: string;
  kontext: VorlagenKontext;
}

/**
 * Meldung „Widerruf eingegangen“ an den Betrieb. Geht nur an die feste
 * Team-Adresse — deshalb darf hier stehen, was der Kunde eingegeben hat.
 */
export function betriebWiderrufEingang({
  name,
  email,
  vorgangsnummer,
  eingegangenAm,
  zugeordnet,
  angaben,
  adminUrl,
  kontext,
}: BetriebWiderrufDaten): MailInhalt {
  const nummer = vorgangsnummer?.trim().toUpperCase();
  const zeilen: Array<[string, string]> = [
    ['Eingegangen am', `${formatDateTime(eingegangenAm)} Uhr`],
    ['Name', name],
    ['E-Mail', email],
    ['Vorgangsnummer', nummer || 'nicht angegeben'],
    ['Zuordnung', zugeordnet ? 'dem Vorgang zugeordnet (Nummer und E-Mail passen)' : 'bitte von Hand prüfen'],
  ];
  const bausteine: Baustein[] = [
    {
      art: 'absatz',
      text:
        'über den Widerrufsbutton der Website ist eine Widerrufserklärung eingegangen. Sie ist mit dem Zugang '
        + 'wirksam; bitte prüfen und bearbeiten. Es wird nichts automatisch storniert oder erstattet.',
    },
    { art: 'felder', zeilen },
  ];
  if (angaben?.trim()) bausteine.push({ art: 'nachricht', titel: 'Angaben des Kunden', text: angaben.trim() });
  bausteine.push({ art: 'knopf', href: adminUrl, label: 'Im Backend öffnen' });
  return baueMail({
    betreff: `Widerruf eingegangen${nummer ? `: ${nummer}` : ''}`,
    anrede: 'Hallo Team,',
    bausteine,
    site: kontext.site,
  });
}
