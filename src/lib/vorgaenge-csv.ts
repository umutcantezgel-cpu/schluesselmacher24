/* ==========================================================================
   CSV-Export der Vorgänge für die Buchhaltung
   Semikolon, UTF-8 mit BOM und CRLF — so öffnet Excel die Datei in deutscher
   Einstellung direkt richtig. Beträge als Zahl mit Komma, ohne Währungszeichen.
   Zellen, die mit = + - @ (oder Tab/Wagenrücklauf) beginnen, bekommen ein
   Hochkomma vorangestellt: Kundeneingaben dürfen in Excel nie als Formel
   ausgeführt werden (CSV-/Formel-Injection).
   Nur relative Importe: Der Endpunkt im Backend lädt diese Datei.
   ========================================================================== */

import { BEREICH_LABEL, ART_LABEL, ZAHLUNG_LABEL } from './mail/vorlagen/gemeinsam';
import type { BusinessRecord } from './types';

export const CSV_SPALTEN = [
  'Nummer',
  'Datum',
  'Art',
  'Bereich',
  'Name',
  'E-Mail',
  'Positionen',
  'Netto',
  'USt.',
  'Brutto',
  'Versand',
  'Zahlungsstand',
  'Zahlungsreferenz',
] as const;

/** Umsatzsteuersatz, mit dem Anzahlungen ohne festgeschriebene Summen aufgeteilt werden. */
const UST_SATZ = 0.19;

const DATUM = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric' });
const TAG = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' });

/** Kalendertag eines Zeitpunkts in deutscher Zeit (ISO), für die Auswahl nach Zeitraum. */
export function tagInBerlin(iso: string): string {
  return TAG.format(new Date(iso));
}

/** Betrag in Cent als „1234,56“. */
export function betrag(cents: number | undefined): string {
  if (cents === undefined || !Number.isFinite(cents)) return '';
  const vorzeichen = cents < 0 ? '-' : '';
  const absolut = Math.abs(Math.round(cents));
  return `${vorzeichen}${Math.floor(absolut / 100)},${String(absolut % 100).padStart(2, '0')}`;
}

/** Eine Zelle: Formel-Anfänge entschärfen, bei Bedarf in Anführungszeichen. */
export function zelle(wert: string): string {
  let text = wert.replace(/\r\n?/g, '\n');
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[;"\n]|^\s|\s$/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function positionen(vorgang: BusinessRecord): string {
  if (vorgang.lines?.length) return vorgang.lines.map((line) => `${line.qty}× ${line.label}`).join(' | ');
  const leistung = vorgang.summary.flatMap((abschnitt) => abschnitt.rows).find((zeile) => zeile.label === 'Gewünschte Leistung')?.value;
  const termin = vorgang.appointment ? `Termin ${vorgang.appointment.date} ${vorgang.appointment.time}` : '';
  return [leistung, termin].filter(Boolean).join(' | ');
}

/** Brutto, enthaltene USt. und Netto: aus den Summen der Bestellung, sonst aus der Zahlung (Anzahlung). */
function betraege(vorgang: BusinessRecord): { netto?: number; ust?: number; brutto?: number; versand?: number } {
  if (vorgang.totals) {
    const { totalCents, vatCents, shippingCents } = vorgang.totals;
    return { brutto: totalCents, ust: vatCents, netto: totalCents - vatCents, versand: shippingCents };
  }
  if (vorgang.payment) {
    const brutto = vorgang.payment.amountCents;
    const ust = Math.round(brutto - brutto / (1 + UST_SATZ));
    return { brutto, ust, netto: brutto - ust };
  }
  return {};
}

function zeile(vorgang: BusinessRecord): string[] {
  const { contact: k } = vorgang;
  const name = [k.firstName, k.lastName].filter(Boolean).join(' ');
  const { netto, ust, brutto, versand } = betraege(vorgang);
  return [
    vorgang.reference,
    DATUM.format(new Date(vorgang.createdAt)),
    ART_LABEL[vorgang.kind] ?? vorgang.kind,
    BEREICH_LABEL[vorgang.area] ?? vorgang.area,
    k.company ? `${k.company} (${name})` : name,
    k.email,
    positionen(vorgang),
    betrag(netto),
    betrag(ust),
    betrag(brutto),
    betrag(versand),
    vorgang.payment ? ZAHLUNG_LABEL[vorgang.payment.status] : '',
    vorgang.payment?.providerRef ?? '',
  ];
}

/** Vorgänge als CSV-Text (mit BOM), älteste zuerst. */
export function vorgaengeAlsCsv(vorgaenge: BusinessRecord[]): string {
  const sortiert = [...vorgaenge].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const zeilen = [[...CSV_SPALTEN], ...sortiert.map(zeile)];
  return `﻿${zeilen.map((z) => z.map(zelle).join(';')).join('\r\n')}\r\n`;
}
