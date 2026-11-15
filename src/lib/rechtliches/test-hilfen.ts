import { readFileSync } from 'node:fs';
import path from 'node:path';

import { defaults } from '@/lib/data/defaults';
import type { Settings } from '@/lib/types';

/** Die echten Firmendaten aus `content/settings.json` (wie im Notbetrieb ohne Datenbank). */
export function echteEinstellungen(): Settings {
  const datei = path.resolve(__dirname, '../../../content/settings.json');
  return JSON.parse(readFileSync(datei, 'utf8')) as Settings;
}

/** Erfundener zweiter Standort für Tests: eine Werkstatt abseits des Firmensitzes. */
export const ZWEITER_STANDORT = { label: 'Werkstatt und Abholung', street: 'Werkstattweg 7', postalCode: '35576', city: 'Wetzlar' } as const;

/**
 * Die echten Firmendaten mit erfundenem zweitem Standort. Seit der Arbeitsanweisung vom 11.11.2026 liegen
 * Sitz und Werkstatt an einer Anschrift; der Zweig „Werkstatt abseits des Sitzes“ bleibt damit geprüft.
 */
export function einstellungenMitWerkstatt(): Settings {
  const settings = echteEinstellungen();
  return { ...settings, company: { ...settings.company, location: { ...ZWEITER_STANDORT } } };
}

/** Einstellungen mit Platzhalter-Firmendaten (Rückfall ohne gepflegte Daten). */
export function platzhalterEinstellungen(): Settings {
  return defaults.settings();
}
