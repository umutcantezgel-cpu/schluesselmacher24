/*
 * Gewünschte Leistung der Gehäuse-Anfrage (FA-SHOP-02C; FA-14-04, FA-14-05): die Werteliste an einer Stelle.
 * Die drei Leistungen und ihre Benennung kommen aus `GEHAEUSE_LEISTUNGEN` (Vorgabe), dazu „unklar“ als ehrlicher
 * Ausweg. Reine Funktionen ohne React und ohne Server: Formular, Seiten und Server (`records.ts`) nutzen dieselbe
 * Liste. Kein Preis, keine Frist, kein Zahlungslink (A-036, G9).
 */

import type { SummarySection } from '@/lib/types';

import { GEHAEUSE_LEISTUNGEN, type GehaeuseLeistungKennung } from '../leistungen';

export type { GehaeuseLeistungKennung };

/** Antwort auf „Was sollen wir für Sie tun?“: eine der drei Leistungen oder „unklar“ (bitte beraten). */
export type LeistungWunsch = GehaeuseLeistungKennung | 'unklar';

/** Adresse der Gehäuse-Anfrage ohne Parameter (zugleich `canonical` der Seite). */
export const ANFRAGE_PFAD = '/autoschluessel/gehaeuse/anfrage';

/** Name des Adressparameters für die Vorbelegung. */
export const LEISTUNG_PARAMETER = 'leistung';

/** Bezeichnung der Zeile in Zusammenfassung, Vorgang und Vorgangsblatt. */
export const LEISTUNG_LABEL = 'Gewünschte Leistung';

/** Alle gültigen Antworten, in der Reihenfolge des Formulars. */
export const LEISTUNG_WERTE: readonly LeistungWunsch[] = [...GEHAEUSE_LEISTUNGEN.map((l) => l.kennung), 'unklar'];

/** Je Antwort ein kurzer Satz für Laien. Die Titel der drei Leistungen sind die Benennung der Vorgabe. */
const LAIENSATZ: Record<LeistungWunsch, string> = {
  gehaeusetausch: 'Ihr Schlüssel bekommt ein neues Gehäuse, wenn seine Technik hineinpasst.',
  reparatur: 'Wir tauschen klemmende Tasten oder eine ausgeschlagene Mechanik.',
  umbau: 'Ihr Schlüssel bekommt eine andere Gehäuseform, wenn seine Technik passt.',
  unklar: 'Wir sehen uns Ihre Fotos an und sagen Ihnen, was bei Ihrem Schlüssel geht.',
};

const UNKLAR_TITEL = 'Weiß ich noch nicht, bitte beraten';

/** Auswahl im Formular. */
export const LEISTUNG_OPTIONEN: ReadonlyArray<{ wert: LeistungWunsch; titel: string; satz: string }> = [
  ...GEHAEUSE_LEISTUNGEN.map((l) => ({ wert: l.kennung as LeistungWunsch, titel: l.titel, satz: LAIENSATZ[l.kennung] })),
  { wert: 'unklar', titel: UNKLAR_TITEL, satz: LAIENSATZ.unklar },
];

/** Wortlaut in Zusammenfassung, Vorgang und Vorgangsblatt. */
export const LEISTUNG_TEXT: Record<LeistungWunsch, string> = {
  ...(Object.fromEntries(GEHAEUSE_LEISTUNGEN.map((l) => [l.kennung, l.titel])) as Record<GehaeuseLeistungKennung, string>),
  unklar: 'Noch offen, bitte beraten',
};

/** Eine der drei Leistungen (nicht „unklar“). */
export function istLeistungKennung(wert: unknown): wert is GehaeuseLeistungKennung {
  return typeof wert === 'string' && GEHAEUSE_LEISTUNGEN.some((l) => l.kennung === wert);
}

/** Eine gültige Antwort der Werteliste. */
export function istLeistungWunsch(wert: unknown): wert is LeistungWunsch {
  return typeof wert === 'string' && (LEISTUNG_WERTE as readonly string[]).includes(wert);
}

/**
 * Vorbelegung aus der Adresse (`?leistung=…`): nur die drei Leistungen. Ein unbekannter, leerer oder fehlender
 * Wert wird übergangen (dann fragt das Formular ohne Vorbelegung).
 */
export function leistungAusAdresse(wert: string | null | undefined): GehaeuseLeistungKennung | '' {
  const text = (wert ?? '').trim().toLowerCase();
  return istLeistungKennung(text) ? text : '';
}

/** Prüfung auf dem Server: nur die vier Werte; alles andere wird „unklar“, nie ungeprüft gespeichert. */
export function leistungPruefen(wert: unknown): LeistungWunsch {
  return istLeistungWunsch(wert) ? wert : 'unklar';
}

/** Verweis in die Gehäuse-Anfrage, mit Vorbelegung, wenn eine Leistung genannt ist. */
export function anfrageAdresse(leistung?: GehaeuseLeistungKennung): string {
  return leistung ? `${ANFRAGE_PFAD}?${LEISTUNG_PARAMETER}=${leistung}` : ANFRAGE_PFAD;
}

/** Zeile vor „Ihr Anliegen“ einfügen, sonst ans Ende des Abschnitts. */
const ANLIEGEN_LABEL = 'Ihr Anliegen';

function zeileEinfuegen(rows: SummarySection['rows'], zeile: SummarySection['rows'][number]): SummarySection['rows'] {
  const vor = rows.findIndex((r) => r.label === ANLIEGEN_LABEL);
  return vor < 0 ? [...rows, zeile] : [...rows.slice(0, vor), zeile, ...rows.slice(vor)];
}

/**
 * Server (`records.ts`, Quelle `gehaeuse`): Die Leistung in der Nutzlast wird auf die Werteliste geprüft, und die
 * Zeile „Gewünschte Leistung“ der Zusammenfassung wird aus dem geprüften Wert neu gebaut. Eine Zeile aus dem
 * Browser mit diesem Namen fällt weg; die neue steht vor „Ihr Anliegen“ (sonst im ersten Abschnitt am Ende).
 */
export function gehaeuseLeistungSichern(
  payload: Record<string, unknown>,
  summary: SummarySection[],
): { payload: Record<string, unknown>; summary: SummarySection[] } {
  const leistung = leistungPruefen(payload.leistung);
  const zeile = { label: LEISTUNG_LABEL, value: LEISTUNG_TEXT[leistung] };
  const bereinigt = summary.map((abschnitt) => ({ ...abschnitt, rows: abschnitt.rows.filter((r) => r.label !== LEISTUNG_LABEL) }));
  const ziel = Math.max(0, bereinigt.findIndex((a) => a.rows.some((r) => r.label === ANLIEGEN_LABEL)));
  const neu = bereinigt.length
    ? bereinigt.map((abschnitt, i) => (i === ziel ? { ...abschnitt, rows: zeileEinfuegen(abschnitt.rows, zeile) } : abschnitt))
    : [{ title: 'Fahrzeug und Schlüssel', rows: [zeile] }];
  return { payload: { ...payload, leistung }, summary: neu };
}
