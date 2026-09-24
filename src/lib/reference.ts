import type { RecordKind } from '@/lib/types';

const PREFIX: Record<RecordKind, string> = {
  bestellung: 'B',
  anfrage: 'A',
  termin: 'T',
  projekt: 'P',
};

/**
 * Kundenlesbare Vorgangsnummer, z. B. "SM24-B-2026-0042".
 * Die laufende Nummer vergibt der Zähler in der Datenbank (`sm24_zaehler`).
 */
export function buildReference(kind: RecordKind, year: number, sequence: number): string {
  return `SM24-${PREFIX[kind]}-${year}-${String(sequence).padStart(4, '0')}`;
}

/** Technische Kennung eines Vorgangs — stabil und URL-tauglich. */
export function buildRecordId(reference: string): string {
  return reference.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/** Schlüssel des Nummernzählers: je Art und Jahr ein eigener, z. B. "B-2026". */
export function counterKey(kind: RecordKind, year: number): string {
  return `${PREFIX[kind]}-${year}`;
}

/** Laufende Nummer einer Vorgangsnummer dieser Art und dieses Jahres, sonst `null`. */
export function parseSequence(reference: string, kind: RecordKind, year: number): number | null {
  const prefix = `SM24-${PREFIX[kind]}-${year}-`;
  if (!reference.startsWith(prefix)) return null;
  const rest = reference.slice(prefix.length);
  return /^\d+$/.test(rest) ? Number(rest) : null;
}

/**
 * Nächste laufende Nummer aus dem Bestand — nur für den Dateimodus ohne
 * Datenbank. Höchste vorhandene Nummer + 1 statt „Anzahl + 1“, damit ein
 * gelöschter Vorgang keine Nummer doppelt vergibt.
 */
export function nextSequenceFromExisting(
  references: readonly string[],
  kind: RecordKind,
  year: number,
): number {
  let highest = 0;
  for (const reference of references) {
    const sequence = parseSequence(reference, kind, year);
    if (sequence !== null && sequence > highest) highest = sequence;
  }
  return highest + 1;
}
