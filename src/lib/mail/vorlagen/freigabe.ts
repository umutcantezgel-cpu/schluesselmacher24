/**
 * Ergebnis der Foto-Prüfung bei „Schlüssel nach Vorlage“ (Erg. Leitfaden
 * §1/§2, PL 07): Freigabe mit Preis und Zahlungslink, Rückfrage oder Absage.
 *
 * Die Freigabe ist noch keine Fertigungszusage: Den Auftrag erteilt der Kunde
 * mit der Zahlung (§ 5 Abs. 2 der AGB — die Freigabe mit Preis ist unser
 * Angebot in Textform). Vor der Zahlung weist die Mail gesondert darauf hin,
 * dass für die Anfertigung nach Vorlage kein Widerrufsrecht besteht.
 *
 * Reine Funktionen, nur relative Importe (Backend-Hook). Die Anschrift für die
 * Einsendung bildet der Aufrufer (`einsendeAnschrift` in ./einsendung.ts).
 */

import { formatCents } from '../../format';
import { gewuenschteStueckzahl } from '../../foto-freigabe';
import type { BusinessRecord } from '../../types';
import { anrede, baueMail, type Baustein, type MailInhalt } from '../html';
import { ANTWORT_HINWEIS, nummerBaustein, ohneSchraegstrich, statusLink, type VorlagenKontext } from './gemeinsam';

export type FreigabeErgebnis = 'freigegeben' | 'nicht-moeglich' | 'wartet-auf-kunde';

export interface FreigabeMailDaten {
  vorgang: BusinessRecord;
  ergebnis: FreigabeErgebnis;
  /** Nachricht des Teams aus dem Backend („Nachricht an den Kunden“). */
  nachricht?: string;
  kontext: VorlagenKontext;
  /** Persönlicher Link zur Zahlung (`/bestellung/<id>?t=…`) — nur mit Online-Zahlung. */
  zahlungsLink?: string;
  /** Anschrift der Werkstatt in Zeilen, Firmenname zuerst. Leer: folgt gesondert. */
  einsendeAnschrift?: string[];
}

/** Nachrichten des Teams — der Hinweis aus der Freigabe und die Nachricht zum Statuswechsel, ohne Dopplung. */
function nachrichten(hinweis: string | undefined, nachricht: string | undefined, titelHinweis: string): Baustein[] {
  const bausteine: Baustein[] = [];
  const h = hinweis?.trim();
  const n = nachricht?.trim();
  if (h) bausteine.push({ art: 'nachricht', titel: titelHinweis, text: h.slice(0, 4000) });
  if (n && n !== h) bausteine.push({ art: 'nachricht', titel: 'Nachricht von uns', text: n.slice(0, 4000) });
  return bausteine;
}

function einsendeBausteine(vorgang: BusinessRecord, mitPreis: boolean, anschrift: string[] | undefined): Baustein[] {
  return [
    { art: 'ueberschrift', text: 'Originalschlüssel einsenden' },
    {
      art: 'absatz',
      text: mitPreis
        ? 'Für die Anfertigung brauchen wir Ihren Originalschlüssel. Bitte senden Sie ihn erst, nachdem Sie den '
          + 'Auftrag mit der Zahlung erteilt haben.'
        : 'Für die Anfertigung brauchen wir Ihren Originalschlüssel. Bitte senden Sie ihn erst, wenn Sie den '
          + 'Auftrag erteilt haben — den Preis nennen wir Ihnen vorher.',
    },
    anschrift?.length
      ? { art: 'felder', zeilen: [['Anschrift für die Einsendung', anschrift.join('\n')]] }
      : { art: 'absatz', text: 'Die Anschrift für die Einsendung nennen wir Ihnen gesondert.' },
    {
      art: 'absatz',
      text: [
        `– Legen Sie einen Zettel mit Ihrer Vorgangsnummer ${vorgang.reference}, Ihrem Namen und Ihrer Telefonnummer bei.`,
        '– Senden Sie nur den betreffenden Schlüssel, ohne Schlüsselring und Anhänger.',
        '– Falls vorhanden: eine Kopie der Sicherungskarte oder des Berechtigungsnachweises.',
        '– Wählen Sie einen versicherten oder mindestens nachverfolgbaren Versand.',
      ].join('\n'),
    },
  ];
}

function freigegeben({ vorgang, nachricht, kontext, zahlungsLink, einsendeAnschrift }: FreigabeMailDaten): MailInhalt {
  const freigabe = vorgang.approval ?? {};
  const preis = freigabe.priceCents && freigabe.priceCents > 0 ? freigabe.priceCents : undefined;
  const bezahlt = vorgang.payment?.status === 'bezahlt';
  const einsenden = freigabe.sendInRequired === true;
  const stueck = gewuenschteStueckzahl(vorgang);

  const felder: Array<[string, string]> = [['Ergebnis der Prüfung', 'Anfertigung möglich']];
  if (stueck) felder.push(['Stückzahl laut Ihrer Anfrage', String(stueck)]);
  felder.push(['Preis', preis ? `${formatCents(preis)} inkl. Umsatzsteuer` : 'nennen wir Ihnen gesondert']);
  felder.push(['Originalschlüssel', einsenden ? 'bitte einsenden (Anleitung unten)' : 'nicht nötig — wir fertigen nach Ihren Fotos']);

  const bausteine: Baustein[] = [
    { art: 'absatz', text: 'wir haben Ihre Fotos geprüft: Wir können Ihren Schlüssel nach Ihrer Vorlage anfertigen.' },
    nummerBaustein(vorgang),
    { art: 'felder', zeilen: felder },
    ...nachrichten(freigabe.note, nachricht, 'Hinweis zur Freigabe'),
  ];

  if (preis && bezahlt) {
    bausteine.push({ art: 'absatz', text: 'Ihre Zahlung ist bereits bei uns eingegangen. Wir fertigen Ihren Schlüssel.' });
  } else if (preis) {
    bausteine.push(
      { art: 'ueberschrift', text: 'So erteilen Sie den Auftrag' },
      {
        art: 'absatz',
        text:
          'Diese Freigabe ist noch keine Fertigungszusage und noch kein Auftrag. Den Auftrag erteilen Sie, indem Sie '
          + 'den Preis bezahlen. Erst mit Ihrer Zahlung kommt der Vertrag zustande; danach fertigen wir Ihren Schlüssel.',
      },
    );
    if (zahlungsLink) {
      bausteine.push(
        { art: 'knopf', href: zahlungsLink, label: 'Jetzt bezahlen' },
        {
          art: 'absatz',
          text:
            'Über diesen persönlichen Link sehen Sie die Freigabe und bezahlen über unseren Zahlungsdienstleister. '
            + 'Links aus früheren E-Mails zu diesem Vorgang gelten nicht mehr – bitte nutzen Sie diesen. '
            + 'Bitte geben Sie den Link nicht weiter.',
        },
      );
    } else {
      bausteine.push({ art: 'absatz', text: 'Die Zahlungsinformationen erhalten Sie gesondert von uns.' });
    }
    bausteine.push({
      art: 'hinweis',
      titel: 'Anfertigung nach Ihrer Vorlage',
      text:
        'Wir fertigen den Schlüssel eigens nach Ihrer Vorlage. Für solche Anfertigungen besteht kein Widerrufsrecht '
        + `(§ 312g Abs. 2 Nr. 1 BGB). Es gelten unsere AGB: ${ohneSchraegstrich(kontext.site)}/rechtliches/agb`,
    });
  } else {
    bausteine.push({
      art: 'absatz',
      text:
        'Den Preis nennen wir Ihnen in einer gesonderten Nachricht. Diese Freigabe ist noch keine Fertigungszusage: '
        + 'Gefertigt wird erst, wenn Sie den Auftrag danach erteilt haben.',
    });
  }

  if (einsenden && !bezahlt) bausteine.push(...einsendeBausteine(vorgang, Boolean(preis), einsendeAnschrift));
  if (!zahlungsLink) bausteine.push({ art: 'knopf', href: statusLink(kontext.site), label: 'Stand abrufen' });
  bausteine.push(ANTWORT_HINWEIS);

  return baueMail({
    betreff: `Ihre Anfrage ist freigegeben – ${vorgang.reference}`,
    vorschau: preis
      ? `Anfertigung möglich, Preis ${formatCents(preis)}. Mit der Zahlung erteilen Sie den Auftrag.`
      : 'Anfertigung möglich. Den Preis nennen wir Ihnen gesondert.',
    anrede: anrede(vorgang.contact),
    bausteine,
    firma: kontext.firma,
    site: kontext.site,
  });
}

function nichtMoeglich({ vorgang, nachricht, kontext }: FreigabeMailDaten): MailInhalt {
  const zahlung = vorgang.payment;
  const bausteine: Baustein[] = [
    {
      art: 'absatz',
      text:
        'vielen Dank für Ihre Anfrage und Ihre Fotos. Wir haben Ihren Schlüssel sorgfältig geprüft. Leider können '
        + 'wir ihn nicht nach Ihrer Vorlage anfertigen.',
    },
    nummerBaustein(vorgang),
    ...nachrichten(vorgang.approval?.note, nachricht, 'Begründung'),
    {
      art: 'absatz',
      text:
        'Ein Auftrag ist damit nicht zustande gekommen; Sie müssen nichts weiter tun. Bitte senden Sie uns Ihren '
        + 'Originalschlüssel nicht zu.'
        + (zahlung?.status === 'bezahlt'
          ? ' Zu Ihrer bereits geleisteten Zahlung melden wir uns gesondert.'
          : zahlung?.status === 'offen'
            ? ' Eine Zahlung ist nicht nötig.'
            : ''),
    },
    ANTWORT_HINWEIS,
  ];
  return baueMail({
    betreff: `Ergebnis Ihrer Anfrage – ${vorgang.reference}`,
    vorschau: 'Wir haben Ihre Anfrage geprüft.',
    anrede: anrede(vorgang.contact),
    bausteine,
    firma: kontext.firma,
    site: kontext.site,
  });
}

function rueckfrage({ vorgang, nachricht, kontext }: FreigabeMailDaten): MailInhalt {
  const text = nachricht?.trim();
  const bausteine: Baustein[] = [
    {
      art: 'absatz',
      text: 'für die Prüfung Ihres Schlüssels brauchen wir noch etwas von Ihnen — etwa ein weiteres Foto oder eine Angabe.',
    },
    nummerBaustein(vorgang),
    text
      ? { art: 'nachricht', titel: 'Unsere Rückfrage', text: text.slice(0, 4000) }
      : { art: 'absatz', text: 'Was genau wir brauchen, besprechen wir gern mit Ihnen.' },
    {
      art: 'absatz',
      text:
        'Antworten Sie einfach auf diese E-Mail und nennen Sie Ihre Vorgangsnummer. Sobald Ihre Antwort da ist, '
        + 'setzen wir die Prüfung fort. Ihren Originalschlüssel senden Sie bitte erst ein, wenn wir Sie ausdrücklich '
        + 'darum bitten.',
    },
    { art: 'knopf', href: statusLink(kontext.site), label: 'Stand abrufen' },
  ];
  return baueMail({
    betreff: `Rückfrage zu Ihrer Anfrage – ${vorgang.reference}`,
    vorschau: 'Für die Prüfung brauchen wir noch eine Angabe von Ihnen.',
    anrede: anrede(vorgang.contact),
    bausteine,
    firma: kontext.firma,
    site: kontext.site,
  });
}

/** Mail zum Ergebnis der Foto-Prüfung. */
export function freigabeMail(daten: FreigabeMailDaten): MailInhalt {
  switch (daten.ergebnis) {
    case 'freigegeben':
      return freigegeben(daten);
    case 'nicht-moeglich':
      return nichtMoeglich(daten);
    case 'wartet-auf-kunde':
      return rueckfrage(daten);
  }
}
