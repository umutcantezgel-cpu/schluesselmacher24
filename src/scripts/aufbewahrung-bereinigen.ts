/**
 * Löscht Kundendateien mit abgelaufener Aufbewahrungsfrist und Uploads, die
 * nie einem Vorgang zugeordnet wurden (älter als 24 Stunden).
 *
 *   npx payload run src/scripts/aufbewahrung-bereinigen.ts            # löschen
 *   npx payload run src/scripts/aufbewahrung-bereinigen.ts -- --probe # nur anzeigen
 *
 * Gedacht für einen täglichen Aufruf (z. B. Vercel Cron oder Server-Cron).
 */
import config from '@payload-config';
import { getPayload } from 'payload';

import { bereinigeKundendateien } from '../lib/server/kundendateien';

const probelauf = process.argv.includes('--probe');

try {
  const payload = await getPayload({ config });
  const { geloescht, fehlgeschlagen } = await bereinigeKundendateien({ payload, probelauf });
  const grund = { 'frist-abgelaufen': 'Frist abgelaufen', 'nie-zugeordnet': 'nie zugeordnet' } as const;

  console.log(probelauf ? 'Probelauf — es wird nichts gelöscht.' : 'Aufbewahrung bereinigt.');
  for (const datei of geloescht) {
    console.log(`  ${probelauf ? 'würde löschen' : 'gelöscht'}: #${datei.id} ${datei.dateiname ?? ''} (${grund[datei.grund]})`);
  }
  for (const datei of fehlgeschlagen) {
    console.error(`  fehlgeschlagen: #${datei.id} ${datei.dateiname ?? ''} — ${datei.fehler}`);
  }
  console.log(`${geloescht.length} Datei(en)${fehlgeschlagen.length ? `, ${fehlgeschlagen.length} Fehler` : ''}.`);
  process.exit(fehlgeschlagen.length ? 1 : 0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
