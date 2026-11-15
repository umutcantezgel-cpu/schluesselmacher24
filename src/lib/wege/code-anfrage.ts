/*
 * Code anfragen (FA-11-17, A-046): Wer einen Code hat, der zu keinem Produkt passt, oder solange es
 * noch keine Codeprodukte gibt, fragt ihn über die allgemeine Anfrage an (Thema
 * „schluessel-nach-code“). Pflicht sind Hersteller oder Schloss, der Code wie aufgedruckt, die
 * Stückzahl und die Bestätigung der Berechtigung (R13). Ein Foto von Schlüssel oder Schloss ist
 * freiwillig.
 *
 * Reine Funktionen ohne Seiteneffekte, im Browser und auf dem Server nutzbar.
 */

import type { SummarySection } from '@/lib/types';

/** Thema der allgemeinen Anfrage für Codes (gleich dem Bereich). */
export const CODE_ANFRAGE_THEMA = 'schluessel-nach-code';

/** Quelle im payload, an der der Server die Code-Anfrage erkennt. */
export const CODE_ANFRAGE_QUELLE = 'code-anfrage';

/** Adresse der Code-Anfrage. */
export const CODE_ANFRAGE_PFAD = `/service-und-termin/anfrage?thema=${CODE_ANFRAGE_THEMA}`;

/** Beschreibung des Themas in der Themenwahl der Anfrage: stimmt mit und ohne Codeprodukte. */
export const CODE_ANFRAGE_THEMENTEXT = 'Code nennen, wir prüfen ihn und melden uns. Ohne Einsendung des Originals.';

/** Höchste Stückzahl je Anfrage (Eingabegrenze wie beim Stückzahlfeld). */
export const CODE_ANFRAGE_HOECHSTENS = 99;

/** Adresse der Code-Anfrage, auf Wunsch mit Code und Schloss vorbelegt (etwa von einer Produktseite). */
export function codeAnfragePfad(vorbelegung: { code?: string; schloss?: string } = {}): string {
  const teile = [`thema=${CODE_ANFRAGE_THEMA}`];
  if (vorbelegung.code?.trim()) teile.push(`code=${encodeURIComponent(vorbelegung.code.trim())}`);
  if (vorbelegung.schloss?.trim()) teile.push(`schloss=${encodeURIComponent(vorbelegung.schloss.trim())}`);
  return `/service-und-termin/anfrage?${teile.join('&')}`;
}

/** Vorbelegung aus der Adresse: nur Buchstaben, Ziffern und wenige Zeichen, gekürzt. */
export function vorbelegungAusAdresse(wert: unknown, laenge: number): string {
  if (typeof wert !== 'string') return '';
  return wert.replace(/[^\p{L}\p{N} .\-/]/gu, '').replace(/\s+/g, ' ').trim().slice(0, laenge);
}

export interface CodeAnfrageAngaben {
  /** Hersteller oder Schloss, frei beschrieben. */
  schloss: string;
  /** Code wie aufgedruckt. */
  code: string;
  stueckzahl: number;
}

/** Grenzen der Felder (Zeichen). */
export const CODE_ANFRAGE_LAENGE = { schloss: 120, code: 40 } as const;

/**
 * Prüft die Pflichtangaben der Code-Anfrage. Liefert die bereinigten Angaben oder `null`, wenn etwas
 * fehlt oder nicht passt. Ohne bestätigte Berechtigung (`berechtigt: true`) nimmt der Server die
 * Anfrage nicht an (R13).
 */
export function codeAnfragePruefen(payload: Record<string, unknown>): CodeAnfrageAngaben | null {
  const schloss = typeof payload.schloss === 'string' ? payload.schloss.replace(/\s+/g, ' ').trim() : '';
  const code = typeof payload.code === 'string' ? payload.code.trim() : '';
  const roh = typeof payload.stueckzahl === 'string' ? Number(payload.stueckzahl) : payload.stueckzahl;
  if (schloss.length < 2 || schloss.length > CODE_ANFRAGE_LAENGE.schloss) return null;
  if (code === '' || code.length > CODE_ANFRAGE_LAENGE.code || /[\r\n]/.test(code)) return null;
  if (typeof roh !== 'number' || !Number.isInteger(roh) || roh < 1 || roh > CODE_ANFRAGE_HOECHSTENS) return null;
  if (payload.berechtigt !== true) return null;
  return { schloss, code, stueckzahl: roh };
}

/** Titel des Abschnitts „Code“ in der Zusammenfassung. */
export const CODE_ANFRAGE_ABSCHNITT = 'Code';

/**
 * Abschnitt „Code“ der Zusammenfassung. Der Browser zeigt ihn vor dem Absenden, der Server baut ihn
 * nach der Prüfung aus den geprüften Angaben neu, damit Zusammenfassung, Mail und PDF dieselben
 * Werte tragen wie der Vorgang.
 */
export function codeAnfrageAbschnitt(angaben: {
  schloss: string;
  code: string;
  stueckzahl: number;
  berechtigt: boolean;
}): SummarySection {
  return {
    title: CODE_ANFRAGE_ABSCHNITT,
    rows: [
      { label: 'Hersteller oder Schloss', value: angaben.schloss.trim() || '—' },
      { label: 'Code wie aufgedruckt', value: angaben.code.trim() || '—' },
      { label: 'Stückzahl', value: String(angaben.stueckzahl) },
      { label: 'Berechtigung', value: angaben.berechtigt ? 'bestätigt' : 'nicht bestätigt' },
    ],
  };
}

/** Zusammenfassung mit dem geprüften Abschnitt „Code“; ein gleichnamiger Abschnitt aus dem Browser fällt weg. */
export function mitGeprueftemCode(summary: SummarySection[], angaben: CodeAnfrageAngaben): SummarySection[] {
  return [
    codeAnfrageAbschnitt({ ...angaben, berechtigt: true }),
    ...summary.filter((abschnitt) => abschnitt.title !== CODE_ANFRAGE_ABSCHNITT),
  ];
}

/** Felder, die nur die Code-Anfrage abfragt. */
export const CODE_ANFRAGE_FELDER = ['schloss', 'code', 'stueckzahl', 'berechtigt'] as const;

/** Angaben ohne die Felder der Code-Anfrage, für alle anderen Themen (dort wurde nicht danach gefragt). */
export function ohneCodeFelder<T extends Record<string, unknown>>(daten: T): Omit<T, (typeof CODE_ANFRAGE_FELDER)[number]> {
  const rest: Record<string, unknown> = { ...daten };
  for (const feld of CODE_ANFRAGE_FELDER) delete rest[feld];
  return rest as Omit<T, (typeof CODE_ANFRAGE_FELDER)[number]>;
}

/**
 * Kategorie der Unterlagen. Bei der Code-Anfrage sind es Fotos von Schlüssel oder Schloss, oft mit
 * lesbarem Code; sie tragen am Feld und im Vorgang dieselbe Kategorie und damit die kürzere Frist.
 */
export function codeAnfrageUploadKategorie(thema: string): 'schluesselfoto' | 'dokument' {
  return thema === CODE_ANFRAGE_THEMA ? 'schluesselfoto' : 'dokument';
}
