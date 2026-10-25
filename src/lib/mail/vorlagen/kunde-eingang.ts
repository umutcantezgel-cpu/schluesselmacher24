/**
 * Eingangsbestätigung an den Kunden (§ 312i Abs. 1 Nr. 3 BGB) — für
 * Bestellung, Termin, Anfrage und Projekt.
 *
 * Bewusst nur die Bestätigung des Eingangs, keine Annahme des Vertrags. Die
 * Vertragsbestätigung mit AGB und Widerrufsbelehrung kommt als eigene Vorlage
 * (`vertragsbestaetigung`) nach Zahlung bzw. Vertragsschluss hinzu.
 * Kein Freitext aus dem Formular außer dem streng geprüften Namen.
 */

import { formatDateTime } from '../../format';
import type { BusinessRecord } from '../../types';
import { anrede, baueMail, type Baustein, type MailInhalt } from '../html';
import {
  ANTWORT_HINWEIS,
  ART_LABEL,
  nummerBaustein,
  positionsZeilen,
  terminZeilen,
  vorgangsLink,
  zahlungsZeilen,
  type VorlagenKontext,
} from './gemeinsam';

export interface KundeEingangDaten {
  vorgang: BusinessRecord;
  /** Geheimer Link-Schlüssel für die private Vorgangsseite. */
  token: string;
  /** Wird online bezahlt (Stripe angebunden)? */
  onlineZahlung: boolean;
  kontext: VorlagenKontext;
}

const BETREFF: Record<BusinessRecord['kind'], string> = {
  bestellung: 'Ihre Bestellung {nr} ist eingegangen',
  termin: 'Ihre Terminbuchung {nr} ist eingegangen',
  anfrage: 'Ihre Anfrage {nr} ist eingegangen',
  projekt: 'Ihre Projektanfrage {nr} ist eingegangen',
  partner: 'Ihre Bewerbung als Partnerbetrieb {nr} ist eingegangen',
};

const EINLEITUNG: Record<BusinessRecord['kind'], string> = {
  bestellung:
    'vielen Dank für Ihre Bestellung. Mit dieser E-Mail bestätigen wir, dass sie bei uns eingegangen ist. '
    + 'Wir prüfen Ihre Angaben und melden uns, falls etwas fehlt. Diese Eingangsbestätigung ist noch keine '
    + 'Annahme Ihrer Bestellung.',
  termin:
    'vielen Dank für Ihre Terminbuchung. Mit dieser E-Mail bestätigen wir, dass sie bei uns eingegangen ist.',
  anfrage: 'vielen Dank für Ihre Anfrage. Wir sichten Ihre Angaben und melden uns mit dem nächsten Schritt.',
  projekt:
    'vielen Dank für Ihre Projektanfrage. Wir sichten Ihre Angaben und Unterlagen und melden uns mit dem '
    + 'nächsten Schritt.',
  partner:
    'vielen Dank für Ihre Bewerbung als Partnerbetrieb. Wir prüfen Ihre Angaben und melden uns mit dem '
    + 'nächsten Schritt.',
};

function zahlungsHinweis(vorgang: BusinessRecord, onlineZahlung: boolean): Baustein | null {
  const zahlung = vorgang.payment;
  if (!zahlung || zahlung.status !== 'offen') return null;
  if (!onlineZahlung) {
    return {
      art: 'hinweis',
      titel: 'Zahlung noch offen',
      text: 'Die Zahlungsinformationen erhalten Sie von uns zu Ihrer Vorgangsnummer.',
    };
  }
  if (vorgang.kind === 'termin') {
    const bis = zahlung.expiresAt ? ` bis ${formatDateTime(zahlung.expiresAt)} Uhr` : '';
    return {
      art: 'hinweis',
      titel: 'Anzahlung noch offen',
      text:
        `Ihr Termin ist${bis} für Sie reserviert. Geht die Anzahlung bis dahin nicht ein, geben wir das `
        + 'Zeitfenster wieder frei.',
    };
  }
  return {
    art: 'hinweis',
    titel: 'Zahlung noch offen',
    text:
      'Bitte schließen Sie die Zahlung ab. Über den Link unten können Sie sie jederzeit fortsetzen; '
      + 'gefertigt wird erst nach Zahlungseingang.',
  };
}

export function kundeEingang({ vorgang, token, onlineZahlung, kontext }: KundeEingangDaten): MailInhalt {
  const art = vorgang.kind;
  const betreff = BETREFF[art].replace('{nr}', vorgang.reference);
  const bausteine: Baustein[] = [{ art: 'absatz', text: EINLEITUNG[art] }, nummerBaustein(vorgang)];

  const felder: Array<[string, string]> = [['Art', ART_LABEL[art]], ...terminZeilen(vorgang)];
  if (art === 'bestellung' && vorgang.lines?.length) {
    bausteine.push({ art: 'felder', zeilen: felder });
    bausteine.push({ art: 'ueberschrift', text: 'Ihre Bestellung' }, { art: 'felder', zeilen: positionsZeilen(vorgang) });
  } else {
    bausteine.push({ art: 'felder', zeilen: [...felder, ...zahlungsZeilen(vorgang)] });
  }
  if (art === 'termin' && vorgang.quote?.mode === 'pruefung') {
    bausteine.push({
      art: 'absatz',
      text: 'Verbindlich wird der Termin, sobald wir Ihre Unterlagen geprüft und Ihnen den Preis genannt haben.',
    });
  }

  const hinweis = zahlungsHinweis(vorgang, onlineZahlung);
  if (hinweis) bausteine.push(hinweis);

  bausteine.push(
    { art: 'knopf', href: vorgangsLink(kontext.site, vorgang.id, token), label: 'Vorgang ansehen' },
    {
      art: 'absatz',
      text: 'Über diesen persönlichen Link sehen Sie jederzeit Ihre Angaben und den Stand. Bitte geben Sie ihn nicht weiter.',
    },
    ANTWORT_HINWEIS,
  );

  return baueMail({
    betreff,
    vorschau: `${ART_LABEL[art]} ${vorgang.reference} ist bei uns eingegangen.`,
    anrede: anrede(vorgang.contact),
    bausteine,
    firma: kontext.firma,
    site: kontext.site,
  });
}
