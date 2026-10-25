/* Beschriftungen der Vorgangsstatus wie im Backend (Sammlung Vorgänge) — für
 * Kennzahlen, CSV-Export und Druckansichten. Nur relative Importe. */

import type { RecordStatus } from './types';

export const STATUS_LABEL: Record<RecordStatus, string> = {
  neu: 'Neu',
  'in-pruefung': 'In Prüfung',
  geprueft: 'Geprüft',
  freigegeben: 'Freigegeben',
  'wartet-auf-kunde': 'Wartet auf Kunde',
  'nicht-moeglich': 'Nicht möglich',
  'in-fertigung': 'In Fertigung',
  terminiert: 'Terminiert',
  versendet: 'Versendet',
  abgeschlossen: 'Abgeschlossen',
  storniert: 'Storniert',
};

/** Status in der Reihenfolge des Backends. */
export const STATUS_REIHENFOLGE = Object.keys(STATUS_LABEL) as RecordStatus[];

/** Erledigt — zählt nicht mehr als offener Vorgang („nicht möglich“ beendet eine Fotoanfrage). */
export const ERLEDIGTE_STATUS: readonly RecordStatus[] = ['abgeschlossen', 'storniert', 'nicht-moeglich'];
