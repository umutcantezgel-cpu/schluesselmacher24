/**
 * Bestätigung des Zugangs einer Widerrufserklärung (Widerrufsbutton) auf
 * dauerhaftem Datenträger — mit ihrem Inhalt sowie Datum und Uhrzeit des
 * Eingangs (§ 356a BGB).
 *
 * Die Empfängeradresse stammt aus einem öffentlichen Formular. Die Mail geht
 * deshalb nur nach bestandenem Bot-Schutz und unter Ratenbegrenzung raus
 * (src/lib/actions/widerruf.ts), alle Eingaben stehen escapt und gekürzt
 * darin, und die Anrede nennt den Namen nur, wenn er wie ein Name aussieht.
 */

import { formatDateTime } from '../../format';
import { WIDERRUF_ERKLAERUNG } from '../../rechtliches/widerruf-typen';
import { anrede, baueMail, type Baustein, type MailInhalt } from '../html';
import { ANTWORT_HINWEIS, type VorlagenKontext } from './gemeinsam';

/** Freie Angaben erscheinen höchstens so lang in der Mail. */
const ANGABEN_MAX = 500;

export interface WiderrufEingangDaten {
  /** Name wie eingegeben. */
  name: string;
  /** E-Mail-Adresse wie eingegeben. */
  email: string;
  vorgangsnummer?: string;
  /** Freie Angaben des Kunden (ohne den Erklärungssatz), falls vorhanden. */
  angaben?: string;
  /** ISO-Zeitpunkt des Eingangs. */
  eingegangenAm: string;
  kontext: VorlagenKontext;
}

export function widerrufEingang({
  name,
  email,
  vorgangsnummer,
  angaben,
  eingegangenAm,
  kontext,
}: WiderrufEingangDaten): MailInhalt {
  // Nur Buchstaben, Ziffern und Bindestrich — so wird aus der Nummer kein Link.
  const nummer = (vorgangsnummer ?? '').replace(/[^A-Za-z0-9-]/g, '').slice(0, 40);
  const zusatz = angaben?.trim() ?? '';
  const eingang = `${formatDateTime(eingegangenAm)} Uhr`;
  const bausteine: Baustein[] = [
    {
      art: 'absatz',
      text:
        `Ihre Widerrufserklärung ist am ${eingang} bei uns eingegangen. `
        + 'Mit dieser E-Mail bestätigen wir den Eingang und den Inhalt Ihrer Erklärung.',
    },
    {
      art: 'felder',
      zeilen: [
        ['Erklärung', WIDERRUF_ERKLAERUNG],
        ['Name', name.trim().slice(0, 120)],
        ['E-Mail', email.trim().slice(0, 254)],
        ['Vorgangsnummer', nummer || 'nicht angegeben'],
        ['Eingegangen am', eingang],
      ],
    },
  ];
  if (zusatz) {
    bausteine.push({
      art: 'absatz',
      text: `Ihre weiteren Angaben:\n${zusatz.length > ANGABEN_MAX ? `${zusatz.slice(0, ANGABEN_MAX)} …` : zusatz}`,
    });
  }
  bausteine.push(
    { art: 'absatz', text: 'Wir bearbeiten Ihren Widerruf und melden uns mit den nächsten Schritten.' },
    ANTWORT_HINWEIS,
  );
  return baueMail({
    betreff: 'Eingang Ihrer Widerrufserklärung',
    anrede: anrede({ firstName: name }),
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
