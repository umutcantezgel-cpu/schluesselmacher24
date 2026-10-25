/**
 * Vertragsbestätigung auf dauerhaftem Datenträger (§ 312f Abs. 2 BGB):
 * Anbieterkennung, Vertragsinhalt, erteilte Zustimmungen mit Zeitpunkt,
 * AGB (Kurzfassung mit Link, dazu der volle Wortlaut — § 18 Abs. 3 der AGB
 * verspricht ihn mit der Bestätigung), die vollständige Widerrufsbelehrung
 * und das Muster-Widerrufsformular. Die Rechtstexte kommen aus derselben
 * Quelle wie die Seiten (src/lib/rechtliches/texte.ts) bzw. aus dem
 * Eigentext im Backend, wenn einer hinterlegt ist.
 *
 * Reine Funktion. Die Rechtstexte importieren mit `@/`-Pfaden — Backend-Hooks
 * laden diese Vorlage deshalb erst bei Bedarf (src/lib/mail/vertrag.ts).
 */

import { formatCents, formatDateTime } from '../../format';
import { gewuenschteStueckzahl, istFotoanfrage } from '../../foto-freigabe';
import { eigentextAlsText } from '../../rechtliches/eigentext-text';
import { anbieterZeilen, firmenname, kontakt, registereintrag, ustId } from '../../rechtliches/firma';
import {
  RECHTSTEXTE_FASSUNG,
  agbAbschnitte,
  ausschlussSonderanfertigung,
  erloeschenDienstleistung,
  musterWiderrufsformular,
  widerrufErklaerenUrl,
  widerrufsbelehrung,
  type RechtsAbschnitt,
} from '../../rechtliches/texte';
import type { BusinessRecord, CompanyProfile, RecordConsents, Settings } from '../../types';
import { anrede, baueMail, type Baustein, type MailInhalt } from '../html';
import {
  ANTWORT_HINWEIS,
  BEREICH_LABEL,
  nummerBaustein,
  positionsZeilen,
  terminZeilen,
  zahlungsZeilen,
  type VorlagenKontext,
} from './gemeinsam';

export interface VertragsbestaetigungDaten {
  vorgang: BusinessRecord;
  kontext: VorlagenKontext;
  /** Firmendaten, Versandarten, Buchungsregeln und Eigentexte — wie auf den Rechtsseiten. */
  settings: Pick<Settings, 'company' | 'shipping' | 'booking' | 'legalTexts'>;
  /** Anzeigetexte der Online-Zahlarten, `null` ohne Online-Zahlung (wie auf der AGB-Seite). */
  zahlarten: string[] | null;
}

/** Positionen, die nach Kundenangaben gefertigt werden (kein Widerrufsrecht). */
const ANFERTIGUNG = new Set(['code-schluessel', 'zylinder-schliessung']);

const ZUSTIMMUNG_TEXT: Array<[keyof RecordConsents, string]> = [
  ['terms', 'AGB gelesen'],
  ['withdrawalNotice', 'Widerrufsbelehrung zur Kenntnis genommen'],
  ['customMade', 'Anfertigung nach Ihren Angaben, dafür kein Widerrufsrecht – zur Kenntnis genommen'],
  ['deposit', 'Anzahlung akzeptiert'],
  ['authorization', 'Berechtigung für das Fahrzeug bestätigt'],
  [
    'earlyStart',
    'Ausdrücklich verlangt, dass wir vor Ablauf der Widerrufsfrist mit der Leistung beginnen; bestätigt, dass '
      + 'Sie bei vollständiger Vertragserfüllung Ihr Widerrufsrecht verlieren und bei Widerruf Wertersatz leisten',
  ],
];

/** Rechtsabschnitte als Mailbausteine — Überschrift und Absätze, Listen mit „–“. */
export function rechtsBausteine(abschnitte: readonly RechtsAbschnitt[]): Baustein[] {
  return abschnitte.flatMap((abschnitt): Baustein[] => [
    { art: 'ueberschrift', text: abschnitt.ueberschrift },
    ...abschnitt.absaetze.map(
      (absatz): Baustein => ({
        art: 'absatz',
        text: typeof absatz === 'string' ? absatz : absatz.liste.map((punkt) => `– ${punkt}`).join('\n'),
      }),
    ),
  ]);
}

function anbieterText(settings: VertragsbestaetigungDaten['settings']): string {
  const firma = settings.company;
  const { telefon, email } = kontakt(firma);
  const register = registereintrag(firma);
  const ust = ustId(firma);
  // Die Steuernummer gibt es hier bewusst nicht — sie wird nie veröffentlicht.
  return [
    ...anbieterZeilen(firma),
    ...(telefon ? [`Telefon ${telefon}`] : []),
    ...(email ? [`E-Mail ${email}`] : []),
    ...(ust ? [`USt-IdNr. ${ust}`] : []),
    ...(register ? [`${register.gericht}, ${register.nummer}`] : []),
  ].join('\n');
}

function zeileAus(vorgang: BusinessRecord, label: string): string | undefined {
  for (const abschnitt of vorgang.summary) {
    const treffer = abschnitt.rows.find((zeile) => zeile.label === label);
    if (treffer?.value) return treffer.value;
  }
  return undefined;
}

/** Vertragsinhalt eines Termins: Leistung, Termin, Preis und Anzahlung. */
function terminInhalt(vorgang: BusinessRecord, firma: CompanyProfile | undefined): Array<[string, string]> {
  const zeilen: Array<[string, string]> = [];
  const leistung = zeileAus(vorgang, 'Gewünschte Leistung') ?? BEREICH_LABEL[vorgang.area];
  zeilen.push(['Leistung', leistung]);
  const fahrzeug = [zeileAus(vorgang, 'Marke'), zeileAus(vorgang, 'Modell')].filter(Boolean).join(' ');
  if (fahrzeug) zeilen.push(['Fahrzeug', fahrzeug]);
  zeilen.push(...terminZeilen(vorgang, firma));
  const quote = vorgang.quote;
  if (quote) {
    if (quote.mode === 'fest' && quote.priceCents !== undefined) {
      zeilen.push(['Gesamtpreis', `${formatCents(quote.priceCents)} (inkl. 19 % USt.)`]);
    } else if (quote.mode === 'rahmen' && quote.priceFromCents !== undefined) {
      zeilen.push([
        'Preisrahmen',
        quote.priceToCents !== undefined
          ? `${formatCents(quote.priceFromCents)} bis ${formatCents(quote.priceToCents)} (inkl. 19 % USt.); den verbindlichen Preis nennen wir vor Beginn der Arbeiten`
          : `ab ${formatCents(quote.priceFromCents)} (inkl. 19 % USt.); den verbindlichen Preis nennen wir vor Beginn der Arbeiten`,
      ]);
    } else {
      zeilen.push(['Preis', 'wird nach Prüfung festgelegt; Sie erhalten ihn vor Beginn der Arbeiten']);
    }
    zeilen.push(['Anzahlung', `${formatCents(quote.depositCents)}, wird vollständig mit dem Endpreis verrechnet`]);
    if (quote.mode === 'fest' && quote.remainderCents !== undefined) {
      zeilen.push(['Restbetrag beim Termin', formatCents(quote.remainderCents)]);
    }
  }
  return zeilen;
}

/**
 * Vertragsinhalt einer bezahlten Fotoanfrage: das Angebot aus der Freigabe
 * (Preis, Einsendung, Hinweis) und die Stückzahl der Anfrage.
 */
function fotoauftragInhalt(vorgang: BusinessRecord): Array<[string, string]> {
  const freigabe = vorgang.approval ?? {};
  const zeilen: Array<[string, string]> = [['Leistung', 'Schlüssel nach Vorlage — Anfertigung nach Ihrer Vorlage']];
  const stueck = gewuenschteStueckzahl(vorgang);
  if (stueck) zeilen.push(['Stückzahl laut Ihrer Anfrage', String(stueck)]);
  const preis = freigabe.priceCents ?? vorgang.payment?.amountCents;
  if (preis !== undefined) zeilen.push(['Preis laut Freigabe', `${formatCents(preis)} (inkl. 19 % USt.)`]);
  zeilen.push(['Originalschlüssel', freigabe.sendInRequired ? 'Einsendung erforderlich (siehe E-Mail zur Freigabe)' : 'keine Einsendung nötig']);
  if (freigabe.note?.trim()) zeilen.push(['Hinweis zur Freigabe', freigabe.note.trim().slice(0, 2000)]);
  return zeilen;
}

function zustimmungsZeilen(consents: RecordConsents | undefined): Array<[string, string]> {
  if (!consents) return [];
  const am = consents.at ? `ja, am ${formatDateTime(consents.at)} Uhr` : 'ja';
  const zeilen: Array<[string, string]> = ZUSTIMMUNG_TEXT.filter(([schluessel]) => consents[schluessel] === true).map(
    ([, text]) => [text, am],
  );
  if (zeilen.length && consents.version) zeilen.push(['Stand der Rechtstexte', consents.version]);
  return zeilen;
}

/** Die wichtigsten Punkte der eingebauten AGB — Einzelheiten im Wortlaut am Ende. */
function agbKurzfassung(vorgang: BusinessRecord, settings: VertragsbestaetigungDaten['settings']): string {
  const punkte = [`Ihr Vertragspartner ist ${firmenname(settings.company)}.`];
  punkte.push('Alle Preise sind Endpreise einschließlich 19 % Umsatzsteuer.');
  if (istFotoanfrage(vorgang)) {
    punkte.push(
      'Inhalt, Umfang und Preis richten sich nach unserem Angebot aus der Freigabe; mit Ihrer Zahlung haben Sie es angenommen.',
      'Schlüssel nach Vorlage fertigen wir eigens nach Ihrer Vorlage; für die Richtigkeit Ihrer Angaben sind Sie verantwortlich. Für solche Anfertigungen besteht kein Widerrufsrecht.',
      'Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.',
    );
  } else if (vorgang.kind === 'bestellung') {
    punkte.push(
      'Versandkosten richten sich nach der gewählten Versandart; wir liefern nur an Anschriften in Deutschland.',
      'Schlüssel nach Code und gleichschließende Zylinder fertigen wir nach Ihren Angaben; für deren Richtigkeit sind Sie verantwortlich. Für solche Anfertigungen besteht kein Widerrufsrecht.',
      'Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.',
    );
  } else {
    punkte.push(
      'Die Anzahlung wird vollständig mit dem Endpreis verrechnet; der Restbetrag ist mit Abschluss der Leistung fällig.',
      'Wir arbeiten nur für Berechtigte. Bitte bringen Sie die Zulassungsbescheinigung Teil I mit.',
      'Steht der Preis erst nach einer Prüfung fest oder liegt er über dem genannten Rahmen, führen wir die Leistung nur mit Ihrer Zustimmung aus.',
    );
  }
  punkte.push(
    'Es gelten die gesetzlichen Mängelrechte; unsere Haftung richtet sich nach § 14 der AGB.',
    'Es gilt deutsches Recht; Vertragssprache ist Deutsch.',
  );
  return punkte.map((punkt) => `– ${punkt}`).join('\n');
}

export function vertragsbestaetigung({ vorgang, kontext, settings, zahlarten }: VertragsbestaetigungDaten): MailInhalt {
  const bestellung = vorgang.kind === 'bestellung';
  // Bezahlte Fotoanfrage: Kauf einer Anfertigung nach Vorlage — Ware, kein Termin.
  const fotoauftrag = istFotoanfrage(vorgang);
  const ware = bestellung || fotoauftrag;
  const site = kontext.site;
  const agbUrl = `${site}/rechtliches/agb`;
  const eigeneAgb = settings.legalTexts?.terms;
  const eigenerWiderruf = settings.legalTexts?.withdrawal;
  const anfertigungen = (vorgang.lines ?? []).filter((line) => ANFERTIGUNG.has(line.kind));

  const bausteine: Baustein[] = [
    {
      art: 'absatz',
      text: fotoauftrag
        ? 'vielen Dank für Ihren Auftrag. Mit Ihrer Zahlung haben Sie unser Angebot aus der Freigabe angenommen; '
          + 'hiermit bestätigen wir Ihnen den Vertrag. Bitte bewahren Sie diese E-Mail auf: Sie enthält die '
          + 'Vertragsdaten, unsere AGB, die Widerrufsbelehrung und das Muster-Widerrufsformular.'
        : bestellung
          ? 'vielen Dank für Ihre Bestellung. Hiermit nehmen wir sie an und bestätigen Ihnen den Vertrag. '
            + 'Bitte bewahren Sie diese E-Mail auf: Sie enthält die Vertragsdaten, unsere AGB, die '
            + 'Widerrufsbelehrung und das Muster-Widerrufsformular.'
          : 'vielen Dank für Ihre Buchung. Hiermit bestätigen wir Ihnen den Vertrag über Ihren Termin. '
            + 'Bitte bewahren Sie diese E-Mail auf: Sie enthält die Vertragsdaten, unsere AGB, die '
            + 'Widerrufsbelehrung und das Muster-Widerrufsformular.',
    },
    nummerBaustein(vorgang),
    { art: 'ueberschrift', text: 'Ihr Vertragspartner' },
    { art: 'absatz', text: anbieterText(settings) },
    { art: 'ueberschrift', text: 'Vertragsinhalt' },
    {
      art: 'felder',
      zeilen: fotoauftrag
        ? fotoauftragInhalt(vorgang)
        : bestellung
          ? positionsZeilen(vorgang)
          : terminInhalt(vorgang, settings.company),
    },
  ];

  const zahlung = zahlungsZeilen(vorgang);
  if (zahlung.length) bausteine.push({ art: 'felder', zeilen: zahlung });

  if (bestellung && anfertigungen.length) {
    bausteine.push({
      art: 'hinweis',
      titel: 'Kein Widerrufsrecht bei Anfertigungen nach Ihren Angaben',
      text:
        `Diese Positionen fertigen wir eigens nach Ihren Angaben: ${anfertigungen.map((line) => line.label).join(', ')}. `
        + 'Für sie besteht nach § 312g Abs. 2 Nr. 1 BGB kein Widerrufsrecht.',
    });
  }
  if (fotoauftrag) {
    bausteine.push({
      art: 'hinweis',
      titel: 'Kein Widerrufsrecht bei Anfertigungen nach Ihren Angaben',
      text:
        'Diesen Schlüssel fertigen wir eigens nach Ihrer Vorlage. Für ihn besteht nach § 312g Abs. 2 Nr. 1 BGB '
        + 'kein Widerrufsrecht.',
    });
  }

  const zustimmungen = zustimmungsZeilen(vorgang.consents);
  if (zustimmungen.length) {
    bausteine.push({ art: 'ueberschrift', text: 'Ihre Bestätigungen beim Absenden' }, { art: 'felder', zeilen: zustimmungen });
  }

  bausteine.push({ art: 'ueberschrift', text: 'Allgemeine Geschäftsbedingungen' });
  if (!eigeneAgb) {
    bausteine.push(
      { art: 'absatz', text: `Es gelten unsere AGB (Stand ${RECHTSTEXTE_FASSUNG}). Das Wichtigste in Kürze:` },
      { art: 'absatz', text: agbKurzfassung(vorgang, settings) },
    );
  }
  bausteine.push(
    { art: 'absatz', text: 'Den vollständigen Wortlaut finden Sie am Ende dieser E-Mail und jederzeit online.' },
    { art: 'knopf', href: agbUrl, label: 'AGB online lesen' },
  );

  // Widerrufsbelehrung — vollständig, wie auf der Seite.
  bausteine.push({ art: 'ueberschrift', text: 'Widerrufsbelehrung' });
  if (eigenerWiderruf) {
    bausteine.push({ art: 'absatz', text: eigentextAlsText(eigenerWiderruf) });
  } else {
    const firma = settings.company;
    bausteine.push(
      ...rechtsBausteine(widerrufsbelehrung(ware ? 'waren' : 'dienstleistung', firma, site)),
      { art: 'absatz', text: 'Ende der Widerrufsbelehrung' },
      ...rechtsBausteine([ware ? ausschlussSonderanfertigung() : erloeschenDienstleistung()]),
      ...rechtsBausteine([musterWiderrufsformular(firma)]),
    );
  }
  bausteine.push({
    art: 'absatz',
    text: `Ihren Widerruf können Sie auch online erklären: ${widerrufErklaerenUrl(site)}`,
  });

  bausteine.push({ art: 'ueberschrift', text: 'Unsere AGB im Wortlaut' });
  if (eigeneAgb) bausteine.push({ art: 'absatz', text: eigentextAlsText(eigeneAgb) });
  else bausteine.push(...rechtsBausteine(agbAbschnitte({ settings, zahlarten, siteUrl: site })));

  bausteine.push(ANTWORT_HINWEIS);

  return baueMail({
    betreff: `Vertragsbestätigung – ${vorgang.reference}`,
    vorschau: 'Ihre Vertragsdaten, AGB und Widerrufsbelehrung zum Aufbewahren.',
    anrede: anrede(vorgang.contact),
    bausteine,
    firma: kontext.firma ?? settings.company,
    site,
  });
}
