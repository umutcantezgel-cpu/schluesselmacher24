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
    { titel: 'Prüfung Ihrer Angaben', text: 'Wir prüfen Code, Maße und Zusammenstellung, bevor etwas gefertigt wird.' },
    { titel: 'Zahlung', text: 'Gefertigt wird nach Zahlungseingang. Solange die Zahlung offen ist, können Sie sie hier fortsetzen.' },
    {
      titel: 'Fertigung und Versand',
      text: 'Danach fertigen wir Ihre Bestellung und versenden sie auf dem von Ihnen gewählten Weg. Sie werden über jeden Schritt informiert.',
    },
  ],
  termin: [
    { titel: 'Anzahlung', text: 'Mit der Anzahlung ist Ihr Zeitfenster fest für Sie reserviert. Sie wird auf den Gesamtpreis angerechnet.' },
    { titel: 'Prüfung Ihrer Angaben', text: 'Wir prüfen Fahrzeug, Unterlagen und Leistung und melden uns, falls etwas fehlt.' },
    { titel: 'Termin', text: 'Wir sind zum vereinbarten Termin für Sie da. Über Änderungen informieren wir Sie per E-Mail.' },
  ],
  anfrage: [
    { titel: 'Sichtung', text: 'Wir sichten Ihre Angaben und Unterlagen.' },
    { titel: 'Rückmeldung', text: 'Wir melden uns mit einem Angebot oder dem nächsten Schritt.' },
  ],
  projekt: [
    { titel: 'Sichtung', text: 'Wir sichten Ihre Angaben und Unterlagen.' },
    { titel: 'Rückmeldung', text: 'Wir melden uns mit einem Angebot oder einem Vorschlag für einen Termin vor Ort.' },
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
    text: 'Wir bestimmen Profil und Rohling, lesen Beschriftungen aus und klären, ob eine Anfertigung nach Ihrer Vorlage möglich ist. Gehört der Schlüssel zu einer Anlage mit Sicherungskarte, prüfen wir den Nachweis vor der Fertigung.',
  },
  {
    titel: 'Ergebnis per E-Mail',
    text: 'Sie erhalten die Freigabe mit Preis, eine Rückfrage oder, wenn es nicht geht, eine Absage. Die Prüfung ist noch keine Fertigungszusage.',
  },
  {
    titel: 'Auftrag mit der Zahlung',
    text: 'Mit der Freigabe erhalten Sie einen persönlichen Zahlungslink. Erst mit Ihrer Zahlung erteilen Sie den Auftrag; bis dahin entstehen Ihnen keine Verpflichtungen.',
  },
  {
    titel: 'Anfertigung',
    text: 'Danach fertigen wir. Brauchen wir das Original, steht die Einsendeanweisung mit Anschrift und Vorgangsnummer in der Freigabe; bitte senden Sie nichts unaufgefordert ein.',
  },
];

/** Schlüssel einschicken (G-24, G-25): Begleitschein, Eingang, Freigabe mit Zahlung, Rückversand. */
export const SCHRITTE_EINSENDUNG: NaechsterSchritt[] = [
  {
    titel: 'Einschicken',
    text: 'Den Begleitschein ausdrucken, mit dem Schlüssel in einen gepolsterten Umschlag legen und bei der Post aufgeben.',
  },
  {
    titel: 'Eingang und Prüfung',
    text: 'Sobald Ihr Schlüssel ankommt, steht das auf Ihrer Vorgangsseite. Wir prüfen, ob eine Kopie möglich ist; gehört der Schlüssel zu einer Anlage mit Sicherungskarte, prüfen wir den Nachweis vor der Fertigung.',
  },
  {
    titel: 'Preis und Auftrag',
    text: 'Ist die Kopie möglich, erhalten Sie die Freigabe mit Preis und einen persönlichen Zahlungslink per E-Mail. Erst mit Ihrer Zahlung erteilen Sie den Auftrag. Geht es nicht, schicken wir Ihnen Ihr Original zurück.',
  },
  {
    titel: 'Anfertigung und Rückversand',
    text: 'Nach Zahlungseingang fertigen wir die Kopien und schicken sie mit Ihrem Original zurück. Sobald die Sendung unterwegs ist, bekommen Sie eine E-Mail, mit Sendungsnummer, wenn die Sendung eine hat.',
  },
];

/** Projekt aus dem Projektkonfigurator Schließanlage. */
export const SCHRITTE_SCHLIESSANLAGE: NaechsterSchritt[] = [
  { titel: 'Prüfung Ihrer Angaben', text: 'Wir prüfen Ihre Angaben und melden uns bei offenen Punkten.' },
  { titel: 'Abstimmung', text: 'Gemeinsam legen wir fest, welches System zu Ihrem Objekt passt.' },
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
  { titel: 'Angebot', text: 'Sie erhalten ein Angebot mit nachvollziehbaren Positionen und allen Kosten.' },
];

/** Anfrage zur Sicherheitstechnik (Sicherheitscheck oder allgemeine Anfrage zu diesem Bereich). */
export const SCHRITTE_SICHERHEITSTECHNIK: NaechsterSchritt[] = [
  { titel: 'Einschätzung', text: 'Wir prüfen Ihre Angaben und melden uns mit einer Einschätzung.' },
  { titel: 'Beratung', text: 'Am Telefon oder vor Ort im Einsatzgebiet.' },
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
