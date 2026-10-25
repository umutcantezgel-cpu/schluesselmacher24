/**
 * Termin-Erinnerung an den Kunden (Leitfaden Kap. 17), mit Kalendereintrag
 * als Anhang. Der persönliche Link zur Vorgangsseite ist hier unbekannt (der
 * Schlüssel wird nie gespeichert) — die Mail verweist auf die Statusabfrage.
 * Reine Funktionen, relative Importe.
 */

import { zeitpunktInBerlin } from '../../berliner-zeit';
import { formatDate, formatDateShort, formatDuration } from '../../format';
import { icsDatei } from '../../kalender-ics';
import { kontakt } from '../../rechtliches/firma';
import { anschriftEinzeilig, mitbringliste, mitFahrzeug, vorgangOrtText, werkstattAnschrift } from '../../terminort';
import type { BusinessRecord } from '../../types';
import { anrede, baueMail, type Baustein, type MailInhalt } from '../html';
import type { MailAnhang } from '../transport-resend';
import { ANTWORT_HINWEIS, nummerBaustein, statusLink, terminZeilen, type VorlagenKontext } from './gemeinsam';

export interface ErinnerungDaten {
  /** Vorgang mit Termin (`appointment` gesetzt). */
  vorgang: BusinessRecord;
  kontext: VorlagenKontext;
}

/** Mitbringliste nur bei Autoschlüsseln — dort sind Fahrzeugpapiere und Schlüssel nötig. */
function mitbringen(vorgang: BusinessRecord): string[] {
  if (vorgang.area !== 'autoschluessel') return [];
  // Beim Kunden steht das Fahrzeug schon dort; ohne Angebot (Telefontermin) ist offen, ob es gebraucht wird.
  if (vorgang.appointment?.location === 'vor-ort') return mitbringliste(false);
  return mitbringliste(vorgang.quote ? mitFahrzeug(vorgang) : 'unbekannt');
}

function marke(kontext: VorlagenKontext): string {
  return kontext.firma?.brandName?.trim() || 'SCHLÜSSELMACHER24';
}

export function kundeErinnerung({ vorgang, kontext }: ErinnerungDaten): MailInhalt {
  const termin = vorgang.appointment!;
  const telefon = kontext.firma ? kontakt(kontext.firma).telefon : undefined;
  const liste = mitbringen(vorgang);

  const bausteine: Baustein[] = [
    {
      art: 'absatz',
      text: `wir erinnern Sie an Ihren Termin bei uns am ${formatDate(termin.date)} um ${termin.time} Uhr.`,
    },
    nummerBaustein(vorgang),
    {
      art: 'felder',
      zeilen: [...terminZeilen(vorgang, kontext.firma), ...(telefon ? [['Telefon', telefon] as [string, string]] : [])],
    },
  ];
  if (liste.length) {
    bausteine.push(
      { art: 'ueberschrift', text: 'Bitte mitbringen' },
      { art: 'absatz', text: liste.map((punkt) => `• ${punkt}`).join('\n') },
    );
  }
  bausteine.push(
    {
      art: 'hinweis',
      titel: 'Termin verhindert?',
      text: 'Bitte melden Sie sich rechtzeitig bei uns – telefonisch oder per Antwort auf diese E-Mail.',
    },
    { art: 'absatz', text: 'Im Anhang finden Sie den Termin als Kalendereintrag (.ics).' },
    { art: 'knopf', href: statusLink(kontext.site), label: 'Stand abrufen' },
    ANTWORT_HINWEIS,
  );

  return baueMail({
    betreff: `Erinnerung an Ihren Termin am ${formatDateShort(termin.date)} um ${termin.time} Uhr – ${vorgang.reference}`,
    vorschau: `Ihr Termin am ${formatDate(termin.date)} um ${termin.time} Uhr.`,
    anrede: anrede(vorgang.contact),
    bausteine,
    firma: kontext.firma,
    site: kontext.site,
  });
}

/** Host der Seite für die Kennung des Kalendereintrags. */
function host(site: string): string {
  try {
    return new URL(site).host || 'schluesselmacher24.de';
  } catch {
    return 'schluesselmacher24.de';
  }
}

/**
 * Kalendereintrag zum Termin. Die Kennung hängt nur an der Vorgangsnummer:
 * Nach einer Verschiebung ersetzt der neue Eintrag den alten im Kalender.
 */
export function terminKalender({ vorgang, kontext }: ErinnerungDaten, jetzt: Date = new Date()): MailAnhang {
  const termin = vorgang.appointment!;
  const beginn = zeitpunktInBerlin(termin.date, termin.time);
  const ende = new Date(beginn.getTime() + termin.durationMinutes * 60_000);
  const werkstatt = werkstattAnschrift(kontext.firma);
  const telefon = kontext.firma ? kontakt(kontext.firma).telefon : undefined;
  const liste = mitbringen(vorgang);

  const ort =
    termin.location === 'werkstatt' && werkstatt
      ? `${marke(kontext)}, ${anschriftEinzeilig(werkstatt)}`
      : vorgangOrtText(vorgang, kontext.firma);
  const beschreibung = [
    `Vorgangsnummer: ${vorgang.reference}`,
    `Dauer: ${formatDuration(termin.durationMinutes)}`,
    `Ort: ${vorgangOrtText(vorgang, kontext.firma)}`,
    ...(telefon ? [`Telefon: ${telefon}`] : []),
    ...(liste.length ? ['', 'Bitte mitbringen:', ...liste.map((punkt) => `- ${punkt}`)] : []),
    '',
    `Stand abrufen: ${statusLink(kontext.site)}`,
  ].join('\n');

  return {
    dateiname: `termin-${vorgang.reference}.ics`,
    typ: 'text/calendar; charset=utf-8; method=PUBLISH',
    inhalt: icsDatei({
      uid: `${vorgang.reference.toLowerCase()}@${host(kontext.site)}`,
      beginn,
      ende,
      titel: `Termin bei ${marke(kontext)} (${vorgang.reference})`,
      ort,
      beschreibung,
      url: statusLink(kontext.site),
      erstellt: jetzt,
    }),
  };
}
