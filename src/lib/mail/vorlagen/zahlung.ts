/** Mails rund um die Online-Zahlung. Reine Funktionen. */

import { formatCents, formatDate } from '../../format';
import type { BusinessRecord } from '../../types';
import { anrede, baueMail, type Baustein, type MailInhalt } from '../html';
import {
  ANTWORT_HINWEIS,
  ART_LABEL,
  nummerBaustein,
  ohneSchraegstrich,
  statusLink,
  terminZeilen,
  zahlungsZeilen,
  type VorlagenKontext,
} from './gemeinsam';

interface ZahlungsDaten {
  vorgang: BusinessRecord;
  kontext: VorlagenKontext;
}

/** Zahlung eingegangen — an den Kunden. */
export function kundeBezahlt({ vorgang, kontext }: ZahlungsDaten): MailInhalt {
  const termin = vorgang.kind === 'termin' && vorgang.appointment;
  const einleitung = termin
    ? `Ihre Anzahlung ist bei uns eingegangen, vielen Dank. Ihr Termin am ${formatDate(vorgang.appointment!.date)} `
      + `um ${vorgang.appointment!.time} Uhr bleibt für Sie reserviert.`
    : 'Ihre Zahlung ist bei uns eingegangen, vielen Dank. Wir bearbeiten Ihren Vorgang jetzt weiter und '
      + 'melden uns, sobald es Neuigkeiten gibt.';
  return baueMail({
    betreff: `Zahlung erhalten – ${vorgang.reference}`,
    vorschau: 'Ihre Zahlung ist eingegangen.',
    anrede: anrede(vorgang.contact),
    bausteine: [
      { art: 'absatz', text: einleitung },
      nummerBaustein(vorgang),
      { art: 'felder', zeilen: [...terminZeilen(vorgang, kontext.firma), ...zahlungsZeilen(vorgang)] },
      { art: 'knopf', href: statusLink(kontext.site), label: 'Stand abrufen' },
      ANTWORT_HINWEIS,
    ],
    firma: kontext.firma,
    site: kontext.site,
  });
}

/** Zahlung eingegangen — an den Betrieb. */
export function betriebBezahlt({ vorgang, kontext, adminUrl }: ZahlungsDaten & { adminUrl: string }): MailInhalt {
  return baueMail({
    betreff: `Bezahlt: ${ART_LABEL[vorgang.kind]} ${vorgang.reference}`,
    anrede: 'Hallo Team,',
    bausteine: [
      { art: 'absatz', text: 'zu diesem Vorgang ist die Online-Zahlung eingegangen.' },
      {
        art: 'felder',
        zeilen: [['Vorgangsnummer', vorgang.reference], ['Art', ART_LABEL[vorgang.kind]], ...terminZeilen(vorgang, kontext.firma), ...zahlungsZeilen(vorgang)],
      },
      { art: 'knopf', href: adminUrl, label: 'Im Backend öffnen' },
    ],
    site: kontext.site,
  });
}

/**
 * Zahlung nicht abgeschlossen (abgelaufen oder von der Bank abgelehnt).
 * Beim Termin ist das Zeitfenster dann wieder frei.
 */
export function kundeNichtAbgeschlossen({
  vorgang,
  kontext,
  terminFreigegeben,
}: ZahlungsDaten & { terminFreigegeben: boolean }): MailInhalt {
  const bausteine: Baustein[] = [];
  if (vorgang.kind === 'termin') {
    bausteine.push({
      art: 'absatz',
      text: terminFreigegeben
        ? 'die Anzahlung für Ihren Termin ist nicht bei uns eingegangen. Das reservierte Zeitfenster haben wir '
          + 'deshalb wieder freigegeben. Gern können Sie einen neuen Termin buchen.'
        : 'die Anzahlung für Ihren Termin ist nicht bei uns eingegangen. Wir melden uns bei Ihnen.',
    });
    bausteine.push(nummerBaustein(vorgang), { art: 'felder', zeilen: terminZeilen(vorgang, kontext.firma) });
    if (terminFreigegeben) {
      bausteine.push({ art: 'knopf', href: `${ohneSchraegstrich(kontext.site)}/autoschluessel/anfrage`, label: 'Neuen Termin buchen' });
    }
  } else {
    bausteine.push(
      {
        art: 'absatz',
        text:
          'die Zahlung zu Ihrem Vorgang wurde nicht abgeschlossen. Ihre Angaben bleiben gespeichert. Sie können '
          + 'die Zahlung über den persönlichen Link aus Ihrer Eingangsbestätigung jederzeit fortsetzen.',
      },
      nummerBaustein(vorgang),
    );
  }
  bausteine.push(ANTWORT_HINWEIS);
  return baueMail({
    betreff: `Zahlung nicht abgeschlossen – ${vorgang.reference}`,
    anrede: anrede(vorgang.contact),
    bausteine,
    firma: kontext.firma,
    site: kontext.site,
  });
}

/** Erstattung veranlasst (ganz oder teilweise). */
export function kundeErstattet({ vorgang, kontext, betragCent }: ZahlungsDaten & { betragCent: number }): MailInhalt {
  return baueMail({
    betreff: `Erstattung veranlasst – ${vorgang.reference}`,
    anrede: anrede(vorgang.contact),
    bausteine: [
      {
        art: 'absatz',
        text:
          `wir haben eine Erstattung über ${formatCents(betragCent)} veranlasst. Je nach Zahlart dauert es einige `
          + 'Tage, bis der Betrag auf Ihrem Konto erscheint.',
      },
      nummerBaustein(vorgang),
      ANTWORT_HINWEIS,
    ],
    firma: kontext.firma,
    site: kontext.site,
  });
}
