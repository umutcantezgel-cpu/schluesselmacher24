import type { RecordKind } from '@/lib/types';

const PREFIX: Record<RecordKind, string> = {
  bestellung: 'B',
  anfrage: 'A',
  termin: 'T',
  projekt: 'P',
};

/**
 * Kundenlesbare Vorgangsnummer, z. B. "SM24-B-2026-0042".
 * Die laufende Nummer wird aus dem Bestand abgeleitet.
 */
export function buildReference(kind: RecordKind, year: number, sequence: number): string {
  return `SM24-${PREFIX[kind]}-${year}-${String(sequence).padStart(4, '0')}`;
}

/** Technische Kennung eines Vorgangs — stabil und URL-tauglich. */
export function buildRecordId(reference: string): string {
  return reference.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
