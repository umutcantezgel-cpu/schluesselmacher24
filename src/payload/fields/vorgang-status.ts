import type { RecordStatus } from '../../lib/types';

/**
 * Status eines Vorgangs mit Beschriftung im Backend. Eigene Datei, damit
 * Sammlung und Hooks dieselben Bezeichnungen nutzen (Statusverlauf in den
 * Notizen), ohne sich gegenseitig zu importieren.
 */
export const VORGANG_STATUS: Array<{ label: string; value: RecordStatus }> = [
  { label: 'Neu', value: 'neu' },
  { label: 'In Prüfung', value: 'in-pruefung' },
  { label: 'Geprüft', value: 'geprueft' },
  { label: 'Freigegeben', value: 'freigegeben' },
  { label: 'Wartet auf Kunde', value: 'wartet-auf-kunde' },
  { label: 'Nicht möglich', value: 'nicht-moeglich' },
  { label: 'In Fertigung', value: 'in-fertigung' },
  { label: 'Terminiert', value: 'terminiert' },
  { label: 'Versendet', value: 'versendet' },
  { label: 'Abgeschlossen', value: 'abgeschlossen' },
  { label: 'Storniert', value: 'storniert' },
];

/** Beschriftung eines Status, z. B. für die Notiz zum Statuswechsel. */
export function statusBezeichnung(status: string | null | undefined): string {
  return VORGANG_STATUS.find((eintrag) => eintrag.value === status)?.label ?? (status || '–');
}
