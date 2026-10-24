import { readFileSync } from 'node:fs';
import path from 'node:path';

import { defaults } from '@/lib/data/defaults';
import type { Settings } from '@/lib/types';

/** Die echten Firmendaten aus `content/settings.json` (wie im Notbetrieb ohne Datenbank). */
export function echteEinstellungen(): Settings {
  const datei = path.resolve(__dirname, '../../../content/settings.json');
  return JSON.parse(readFileSync(datei, 'utf8')) as Settings;
}

/** Einstellungen mit Platzhalter-Firmendaten (Rückfall ohne gepflegte Daten). */
export function platzhalterEinstellungen(): Settings {
  return defaults.settings();
}
