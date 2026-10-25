/**
 * Überträgt die bisherigen Inhalte aus `content/*.json` in die Datenbank.
 *
 *   npx payload run src/scripts/seed.ts
 *
 * Läuft bei jedem Build: legt neue Einträge an, belebt gelöschte nicht wieder
 * und gleicht unveränderte Startwerte ab (siehe `src/payload/seed.ts`).
 */
import config from '@payload-config';
import { getPayload } from 'payload';

import { inhalteUebernehmen } from '../payload/seed';

try {
  await inhalteUebernehmen(await getPayload({ config }));
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
