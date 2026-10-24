/* Gemeinsame Bausteine der Mailvorlagen. Reine Funktionen, relative Importe. */

import { formatCents, formatDate, formatDateTime, formatDuration } from '../../format';
import type { AreaKey, BusinessRecord, CompanyProfile, PaymentInfo, RecordKind } from '../../types';
import type { Baustein } from '../html';

/** Was jede Vorlage über die Umgebung wissen muss. */
export interface VorlagenKontext {
  /** Absolute Adresse der Seite, ohne Schrägstrich am Ende. */
  site: string;
  /** Für den Fuß — nur echte Firmendaten erscheinen. */
  firma?: CompanyProfile;
}

export const ART_LABEL: Record<RecordKind, string> = {
  bestellung: 'Bestellung',
  termin: 'Termin',
  anfrage: 'Anfrage',
  projekt: 'Projektanfrage',
};

export const BEREICH_LABEL: Record<AreaKey, string> = {
  autoschluessel: 'Autoschlüssel',
  'schluessel-nach-vorlage': 'Schlüssel nach Vorlage',
  'schluessel-nach-code': 'Schlüssel nach Code',
  'gleichschliessende-zylinder': 'Gleichschließende Zylinder',
  schliessanlagen: 'Schließanlagen',
  'elektronische-zutrittsloesungen': 'Elektronische Zutrittslösungen',
  'tuer-und-schliesstechnik': 'Tür- und Schließtechnik',
  sicherheitstechnik: 'Sicherheitstechnik',
  'service-und-termin': 'Service und Termin',
};

export const ZAHLUNG_LABEL: Record<PaymentInfo['status'], string> = {
  offen: 'offen',
  bezahlt: 'bezahlt',
  fehlgeschlagen: 'nicht abgeschlossen',
  erstattet: 'erstattet',
};

export const UMFANG_LABEL: Record<PaymentInfo['scope'], string> = {
  anzahlung: 'Anzahlung',
  gesamt: 'Gesamtbetrag',
};

/** Absolute Adresse ohne Schrägstrich am Ende. */
export function ohneSchraegstrich(url: string): string {
  return url.replace(/\/+$/, '');
}

/** Persönlicher Link zum Vorgang — nur mit dem Link-Schlüssel abrufbar. */
export function vorgangsLink(site: string, id: string, token: string): string {
  return `${ohneSchraegstrich(site)}/bestellung/${encodeURIComponent(id)}?t=${encodeURIComponent(token)}`;
}

/** Statusabfrage mit Vorgangsnummer und E-Mail-Adresse. */
export function statusLink(site: string): string {
  return `${ohneSchraegstrich(site)}/service-und-termin/terminstatus`;
}

export function terminZeilen(vorgang: BusinessRecord): Array<[string, string]> {
  const termin = vorgang.appointment;
  if (!termin) return [];
  return [
    ['Termin', `${formatDate(termin.date)}, ${termin.time} Uhr`],
    ['Dauer', formatDuration(termin.durationMinutes)],
    ['Ort', termin.location === 'werkstatt' ? 'In unserer Werkstatt' : 'Vor Ort mit Ihrem Fahrzeug (Ort stimmen wir mit Ihnen ab)'],
  ];
}

export function zahlungsZeilen(vorgang: BusinessRecord): Array<[string, string]> {
  const zahlung = vorgang.payment;
  if (!zahlung) return [];
  const zeilen: Array<[string, string]> = [
    [UMFANG_LABEL[zahlung.scope], formatCents(zahlung.amountCents)],
    ['Zahlungsstand', ZAHLUNG_LABEL[zahlung.status]],
  ];
  if (zahlung.paidAt) zeilen.push(['Bezahlt am', formatDateTime(zahlung.paidAt)]);
  return zeilen;
}

/** Positionen nur mit Bezeichnung — nie mit Code oder Maßen (`details`). */
export function positionsZeilen(vorgang: BusinessRecord): Array<[string, string]> {
  const zeilen: Array<[string, string]> = (vorgang.lines ?? []).map((line) => [
    `${line.qty} × ${line.label}`,
    formatCents(line.totalCents),
  ]);
  if (vorgang.totals) {
    zeilen.push(
      [`Versand${vorgang.totals.shippingLabel ? ` (${vorgang.totals.shippingLabel})` : ''}`, formatCents(vorgang.totals.shippingCents)],
      ['Gesamtbetrag', formatCents(vorgang.totals.totalCents)],
      ['Enthaltene Umsatzsteuer', formatCents(vorgang.totals.vatCents)],
    );
  }
  return zeilen;
}

export function nummerBaustein(vorgang: BusinessRecord): Baustein {
  return { art: 'nummer', label: 'Ihre Vorgangsnummer', nummer: vorgang.reference };
}

export const ANTWORT_HINWEIS: Baustein = {
  art: 'absatz',
  text: 'Fragen? Antworten Sie einfach auf diese E-Mail und nennen Sie Ihre Vorgangsnummer.',
};
