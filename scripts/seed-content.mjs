/**
 * Schreibt die Standardinhalte als JSON-Dateien nach content/.
 *
 * Solange unter content/ keine Datei liegt, greift der eingebaute
 * Standardinhalt aus src/lib/data/defaults. Dieses Skript macht daraus
 * echte Dateien, die im Backend bearbeitet werden können.
 *
 * Aufruf: npm run seed
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('./ts-loader.mjs', pathToFileURL(path.join(process.cwd(), 'scripts/')));

const FILES = {
  settings: 'settings.json',
  pricingGroups: 'pricing-groups.json',
  pricingRules: 'service-pricing.json',
  carKeyServices: 'car-key-services.json',
  vehicleMakes: 'vehicles.json',
  codeLines: 'code-lines.json',
  cylinderCatalog: 'cylinder-catalog.json',
  servicePages: 'service-pages.json',
  pages: 'seo.json',
  guides: 'guides.json',
  cities: 'cities.json',
  blockedDays: 'blocked-days.json',
  records: 'records.json',
};

const { defaults } = await import('../src/lib/data/defaults/index.ts');

const dir = path.join(process.cwd(), 'content');
await mkdir(dir, { recursive: true });

const force = process.argv.includes('--force');
let written = 0;
let skipped = 0;

for (const [name, file] of Object.entries(FILES)) {
  const target = path.join(dir, file);
  if (existsSync(target) && !force) {
    skipped += 1;
    continue;
  }
  await writeFile(target, `${JSON.stringify(defaults[name](), null, 2)}\n`, 'utf8');
  written += 1;
}

console.log(`content/: ${written} Datei(en) geschrieben, ${skipped} übersprungen.`);
if (skipped > 0 && !force) {
  console.log('Vorhandene Dateien bleiben erhalten. Zum Überschreiben: npm run seed -- --force');
}
