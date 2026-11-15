/*
 * „So geht es weiter“ nach dem Absenden (G-38, E6-OPUS-01): eine Quelle für die Bestätigung am Ende
 * jedes Weges und für die Statusseite des Vorgangs (/bestellung/[id]), damit beide dasselbe zusagen (R4).
 * Grundlage sind die Art des Vorgangs und, wo ein Weg eigene Schritte hat, Bereich und Quelle.
 * Die Texte stammen aus den bisherigen Erfolgsansichten und der Statusseite; neu formuliert ist nichts,
 * was über deren Zusagen hinausgeht.
 *
 * Reine Daten ohne Abhängigkeiten, im Browser und auf dem Server nutzbar.
 */

import { istEinsendung } from '@/lib/einsenden/vorgang';
import { istFotoanfrage } from '@/lib/foto-freigabe';
import type { BusinessRecord, RecordKind } from '@/lib/types';

export interface NaechsterSchritt {
  titel: string;
  text: string;
}

/** Quelle eines Projekts aus dem Schließplan-Planer (gleich `PLANER_QUELLE` in lib/konfigurator/vorgang, Test sichert das). */
const PLANER = 'schliessplan-planer';

/** Je Art des Vorgangs, wenn der Weg keine eigenen Schritte hat. */
export const SCHRITTE_NACH_ART: Record<RecordKind, NaechsterSchritt[]> = {
  bestellung: [
    { titel: 'Prüfung Ihrer Angaben', text: 'Wir prüfen Code, Maße und Zusammenstellung, bevor wir etwas fertigen.' },
    { titel: 'Zahlung', text: 'Wir fertigen, sobald Ihre Zahlung da ist.' },
    {
      titel: 'Fertigung und Versand',
      text: 'Danach fertigen wir Ihre Bestellung und versenden sie mit der Versandart, die Sie gewählt haben. Wir sagen Ihnen bei jedem Schritt Bescheid.',
    },
  ],
  termin: [
    { titel: 'Anzahlung', text: 'Mit der Anzahlung ist Ihr Zeitfenster fest für Sie reserviert. Wir rechnen sie auf den Gesamtpreis an.' },
    { titel: 'Prüfung Ihrer Angaben', text: 'Wir prüfen Fahrzeug, Unterlagen und Leistung. Fehlt etwas, melden wir uns bei Ihnen.' },
    { titel: 'Termin', text: 'Zum vereinbarten Termin sind wir für Sie da. Ändert sich etwas, schreiben wir Ihnen eine E-Mail.' },
  ],
  anfrage: [
    { titel: 'Wir sehen uns alles an', text: 'Wir sehen uns Ihre Angaben und Unterlagen an. Sie müssen dafür nichts tun.' },
    { titel: 'Rückmeldung', text: 'Wir melden uns mit einem Angebot oder dem nächsten Schritt.' },
  ],
  projekt: [
    { titel: 'Wir sehen uns alles an', text: 'Wir sehen uns Ihre Angaben und Unterlagen an. Sie müssen dafür nichts tun.' },
    { titel: 'Rückmeldung', text: 'Wir melden uns mit einem Angebot oder schlagen Ihnen einen Termin vor Ort vor.' },
  ],
  partner: [
    { titel: 'Prüfung', text: 'Wir prüfen Ihre Angaben zu Betrieb, Leistungen und Qualifikation.' },
    { titel: 'Rückmeldung', text: 'Wir melden uns mit dem nächsten Schritt. Eine Zusammenarbeit beginnt erst mit einem Partnervertrag.' },
  ],
};

/** Schlüssel nach Vorlage: Prüfung, Freigabe oder Rückfrage oder Absage, Auftrag erst mit der Zahlung (Erg. Leitfaden §2, R13). */
export const SCHRITTE_FOTOANFRAGE: NaechsterSchritt[] = [
  {
    titel: 'Prüfung Ihrer Fotos',
    text: 'Wir bestimmen auf den Fotos die Form des Schlüssels und den passenden Rohling. So klären wir, ob wir den Schlüssel nach Ihrer Vorlage anfertigen können. Gehört er zu einer Anlage mit Sicherungskarte, prüfen wir vorher Ihren Nachweis.',
  },
  {
    titel: 'Ergebnis per E-Mail',
    text: 'Sie bekommen per E-Mail die Freigabe mit Preis, eine Rückfrage oder eine Absage. Die Prüfung ist noch keine Fertigungszusage.',
  },
  {
    titel: 'Auftrag mit der Zahlung',
    text: 'Mit der Freigabe bekommen Sie einen persönlichen Link zum Bezahlen. Erst mit Ihrer Zahlung erteilen Sie den Auftrag. Bis dahin entstehen Ihnen keine Verpflichtungen.',
  },
  {
    titel: 'Anfertigung',
    text: 'Danach fertigen wir. Brauchen wir Ihr Original, steht in der Freigabe, wohin Sie es schicken und welche Vorgangsnummer Sie beilegen. Bitte senden Sie nichts unaufgefordert ein.',
  },
];

/** Schlüssel einschicken (G-24, G-25): Begleitschein, Eingang, Freigabe mit Zahlung, Rückversand. */
export const SCHRITTE_EINSENDUNG: NaechsterSchritt[] = [
  {
    titel: 'Einschicken',
    text: 'Drucken Sie den Begleitschein aus. Legen Sie ihn mit dem Schlüssel in einen gepolsterten Umschlag und geben Sie ihn bei der Post auf.',
  },
  {
    titel: 'Eingang und Prüfung',
    text: 'Sobald Ihr Schlüssel ankommt, sehen Sie das im Stand Ihrer Anfrage. Wir prüfen, ob eine Kopie möglich ist. Gehört der Schlüssel zu einer Anlage mit Sicherungskarte, prüfen wir vorher Ihren Nachweis.',
  },
  {
    titel: 'Preis und Auftrag',
    text: 'Ist eine Kopie möglich, bekommen Sie per E-Mail die Freigabe mit Preis und einen persönlichen Link zum Bezahlen. Erst mit Ihrer Zahlung erteilen Sie den Auftrag. Geht es nicht, schicken wir Ihnen Ihr Original zurück.',
  },
  {
    titel: 'Anfertigung und Rückversand',
    text: 'Nach Ihrer Zahlung fertigen wir die Kopien und schicken sie mit Ihrem Original zurück. Sobald die Sendung unterwegs ist, bekommen Sie eine E-Mail. Hat die Sendung eine Sendungsnummer, steht sie darin.',
  },
];

/** Projekt aus dem Projektkonfigurator Schließanlage. */
export const SCHRITTE_SCHLIESSANLAGE: NaechsterSchritt[] = [
  { titel: 'Prüfung Ihrer Angaben', text: 'Wir prüfen Ihre Angaben und melden uns bei offenen Punkten.' },
  { titel: 'Abstimmung', text: 'Wir klären mit Ihnen, welches System zu Ihrem Gebäude passt.' },
  { titel: 'Entwurf des Schließplans', text: 'Sie erhalten einen Entwurf des Schließplans zur Abstimmung.' },
  { titel: 'Fertigung nach Freigabe', text: 'Erst nach Ihrer Freigabe wird die Anlage gefertigt.' },
];

/** Projekt aus dem Schließplan-Planer: Der Plan liegt schon vor. */
export const SCHRITTE_PLANER: NaechsterSchritt[] = [
  { titel: 'Prüfung Ihres Schließplans', text: 'Wir prüfen Türen, Maße und Schlüssel und melden uns bei offenen Punkten.' },
  { titel: 'Angebot', text: 'Sie erhalten ein Angebot zu Ihrem Schließplan.' },
  { titel: 'Fertigung nach Freigabe', text: 'Erst nach Ihrer Freigabe wird die Anlage gefertigt.' },
];

/** Projekt aus dem Zutrittskonfigurator. */
export const SCHRITTE_ZUTRITT: NaechsterSchritt[] = [
  { titel: 'Prüfung', text: 'Wir schauen uns die Türsituation an und sagen Ihnen, was technisch möglich ist.' },
  { titel: 'Beratung', text: 'Wir klären mit Ihnen das passende System.' },
  { titel: 'Angebot', text: 'Sie bekommen ein Angebot, in dem jede Leistung mit ihrem Preis steht.' },
];

/** Anfrage zur Sicherheitstechnik (Sicherheitscheck oder allgemeine Anfrage zu diesem Bereich). */
export const SCHRITTE_SICHERHEITSTECHNIK: NaechsterSchritt[] = [
  { titel: 'Einschätzung', text: 'Wir prüfen Ihre Angaben und melden uns mit einer Einschätzung.' },
  { titel: 'Beratung', text: 'Wir beraten Sie am Telefon oder vor Ort, wenn Ihr Objekt in unserem Einsatzgebiet liegt.' },
  { titel: 'Angebot', text: 'Sie erhalten ein Angebot mit allen Kosten.' },
];

type Vorgang = Pick<BusinessRecord, 'kind' | 'area' | 'process'> & { payload?: Record<string, unknown> };

/**
 * Die Schritte nach dem Absenden für einen Vorgang; die Bestätigung im Weg zeigt dieselben.
 * Eine Foto-Anfrage erkennt dieselbe Regel wie die Foto-Freigabe (`istFotoanfrage`), damit
 * Schritte und Freigabe-Block auf der Statusseite zusammenpassen, auch bei einer allgemeinen
 * Anfrage zum Thema „Schlüssel nach Vorlage“.
 */
export function naechsteSchritte(vorgang: Vorgang): NaechsterSchritt[] {
  if (istEinsendung(vorgang)) return SCHRITTE_EINSENDUNG;
  if (istFotoanfrage(vorgang)) return SCHRITTE_FOTOANFRAGE;
  if (vorgang.kind === 'anfrage' && vorgang.area === 'sicherheitstechnik' && vorgang.process === 'gefuehrte-anfrage') return SCHRITTE_SICHERHEITSTECHNIK;
  if (vorgang.kind === 'projekt' && vorgang.process === 'projektkonfigurator') {
    if (vorgang.area === 'elektronische-zutrittsloesungen') return SCHRITTE_ZUTRITT;
    if (vorgang.area === 'schliessanlagen') return vorgang.payload?.quelle === PLANER ? SCHRITTE_PLANER : SCHRITTE_SCHLIESSANLAGE;
  }
  return SCHRITTE_NACH_ART[vorgang.kind];
}
