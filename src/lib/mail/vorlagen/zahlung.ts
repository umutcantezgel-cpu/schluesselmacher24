/** Mails rund um die Online-Zahlung. Reine Funktionen. */

import { formatCents, formatDate } from '../../format';
import { istFotoanfrage } from '../../foto-freigabe';
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
  // Auftrag erteilt nur bei einer freigegebenen Fotoanfrage (Status danach „In Fertigung“);
  // kam die Zahlung etwa gleichzeitig zur Rückfrage oder Absage, entscheidet das Team.
  const foto = istFotoanfrage(vorgang) && vorgang.status === 'in-fertigung';
  const einleitung = termin
    ? `Ihre Anzahlung ist bei uns eingegangen, vielen Dank. Ihr Termin am ${formatDate(vorgang.appointment!.date)} `
      + `um ${vorgang.appointment!.time} Uhr bleibt für Sie reserviert.`
    : foto
      ? 'Ihre Zahlung ist bei uns eingegangen, vielen Dank. Damit ist Ihr Auftrag erteilt: Wir fertigen Ihren '
        + 'Schlüssel nach Ihrer Vorlage und melden uns, sobald es Neuigkeiten gibt.'
      : 'Ihre Zahlung ist bei uns eingegangen, vielen Dank. Wir bearbeiten Ihren Vorgang jetzt weiter und '
        + 'melden uns, sobald es Neuigkeiten gibt.';
  const bausteine: Baustein[] = [
    { art: 'absatz', text: einleitung },
    nummerBaustein(vorgang),
    { art: 'felder', zeilen: [...terminZeilen(vorgang, kontext.firma), ...zahlungsZeilen(vorgang)] },
  ];
  // Fotoanfrage mit Einsendung: Gefertigt wird, sobald das Original da ist.
  if (foto && vorgang.approval?.sendInRequired) {
    bausteine.push({
      art: 'hinweis',
      titel: 'Bitte jetzt den Originalschlüssel einsenden',
      text:
        'Die Anschrift und was der Sendung beiliegen soll, stehen in unserer E-Mail zur Freigabe. Bitte legen Sie '
        + `Ihre Vorgangsnummer ${vorgang.reference} bei. Gefertigt wird, sobald Ihr Schlüssel bei uns ist.`,
    });
  }
  bausteine.push({ art: 'knopf', href: statusLink(kontext.site), label: 'Stand abrufen' }, ANTWORT_HINWEIS);
  return baueMail({
    betreff: `Zahlung erhalten – ${vorgang.reference}`,
    vorschau: foto ? 'Ihre Zahlung ist eingegangen, Ihr Auftrag ist erteilt.' : 'Ihre Zahlung ist eingegangen.',
    anrede: anrede(vorgang.contact),
    bausteine,
    firma: kontext.firma,
    site: kontext.site,
  });
}

/** Zahlung eingegangen — an den Betrieb. */
export function betriebBezahlt({ vorgang, kontext, adminUrl }: ZahlungsDaten & { adminUrl: string }): MailInhalt {
  const foto = istFotoanfrage(vorgang);
  const auftrag = foto && vorgang.status === 'in-fertigung';
  const einleitung = foto && !auftrag
    ? `zu dieser Fotoanfrage ist eine Zahlung eingegangen, obwohl sie nicht freigegeben ist (Status „${vorgang.status}“). `
      + 'Bitte prüfen und die Zahlung gegebenenfalls erstatten.'
    : auftrag
    ? 'zu dieser freigegebenen Fotoanfrage (Schlüssel nach Vorlage) ist die Online-Zahlung eingegangen. Der Auftrag '
      + 'ist erteilt, der Status steht auf „In Fertigung“.'
      + (vorgang.approval?.sendInRequired ? ' Der Originalschlüssel muss noch eingesendet werden.' : '')
    : 'zu diesem Vorgang ist die Online-Zahlung eingegangen.';
  return baueMail({
    betreff: `Bezahlt: ${foto ? 'Fotoanfrage' : ART_LABEL[vorgang.kind]} ${vorgang.reference}`,
    anrede: 'Hallo Team,',
    bausteine: [
      { art: 'absatz', text: einleitung },
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
  } else if (istFotoanfrage(vorgang)) {
    // Der Link aus der Freigabe-Mail ersetzt den aus der Eingangsbestätigung.
    bausteine.push(
      {
        art: 'absatz',
        text:
          'die Zahlung zu Ihrer freigegebenen Anfrage wurde nicht abgeschlossen. Die Freigabe bleibt bestehen. Sie '
          + 'können die Zahlung über den persönlichen Link aus unserer E-Mail zur Freigabe jederzeit fortsetzen — '
          + 'erst mit der Zahlung erteilen Sie den Auftrag.',
      },
      nummerBaustein(vorgang),
    );
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
