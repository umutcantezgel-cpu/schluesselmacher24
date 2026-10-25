/**
 * Prüft vor dem Livegang, ob noch Redaktions-Platzhalter sichtbar wären:
 * - Firmendaten (Global „Einstellungen“, Tab „Firma“; ohne Datenbank
 *   content/settings.json),
 * - Quelltext der Rechtsseiten unter src/app/(site)/rechtliches/.
 *
 *   npm run pruefen:livegang
 *
 * Exit 1 bei einem Fund. Der Produktions-Build bricht dann ab
 * (scripts/build.mjs), andere Builds warnen nur.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

import config from '@payload-config';
import { createLocalReq, getPayload } from 'payload';

import { einstellungenZuPayload } from '../lib/data/payload-mapping';
import { firmendatenFunde, rechtsseitenFunde, type Fund } from '../lib/livegang-pruefung';
import type { Settings } from '../lib/types';
import { mitDatenbank } from '../lib/umgebung';

async function firmendaten(): Promise<Fund[]> {
  if (!mitDatenbank()) {
    const settings = JSON.parse(readFileSync(path.resolve(process.cwd(), 'content/settings.json'), 'utf8')) as Settings;
    console.log('Ohne Datenbank: Firmendaten aus content/settings.json.');
    return firmendatenFunde(einstellungenZuPayload(settings).firma as Record<string, unknown>);
  }
  const payload = await getPayload({ config });
  const einstellungen = await payload.findGlobal({ slug: 'einstellungen', depth: 0, overrideAccess: true });
  return firmendatenFunde(einstellungen.firma as Record<string, unknown>, await createLocalReq({}, payload));
}

try {
  const funde = [
    ...(await firmendaten()),
    ...rechtsseitenFunde(path.resolve(process.cwd(), 'src/app/(site)/rechtliches')),
  ];

  if (funde.length === 0) {
    console.log('Livegang-Prüfung: keine Platzhalter gefunden.');
    process.exit(0);
  }
  console.error(`Livegang-Prüfung: ${funde.length} Platzhalter gefunden.`);
  for (const fund of funde) console.error(`  ${fund.ort}  ${fund.hinweis}`);
  process.exit(1);
} catch (error) {
  console.error('Livegang-Prüfung fehlgeschlagen.', error);
  process.exit(1);
}
