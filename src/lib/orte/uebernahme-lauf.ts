/**
 * Volllauf des Ortsstamms in die Datenbank (FA-PLATTFORM-03, Zusatz 1), wiederholbar, in Stapeln:
 *
 *   npx payload run src/lib/orte/uebernahme-lauf.ts            schreibt, wenn sich der Stamm geändert hat
 *   SM24_ORTSSTAMM_ERZWINGEN=1 npx payload run src/lib/orte/uebernahme-lauf.ts   schreibt in jedem Fall
 *
 * Nach einem neuen Stand von scripts/orte-import.mjs ausführen (content/orte/LIZENZ.md, Abschnitt Aktualisierung). Der Seed beim Build
 * macht dasselbe; dieser Befehl ist für den Fall, dass der Stamm ohne Build übernommen werden soll.
 */
import config from '@payload-config';
import { getPayload } from 'payload';

import { ortsstammUebernehmen } from './uebernahme';

try {
  const payload = await getPayload({ config });
  await ortsstammUebernehmen(payload, { umfang: 'voll', erzwingen: process.env.SM24_ORTSSTAMM_ERZWINGEN === '1' });
  process.exit(0);
} catch (fehler) {
  console.error(fehler);
  process.exit(1);
}
