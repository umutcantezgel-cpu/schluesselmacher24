import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { CollectionName, Collections, DataAdapter } from './adapter';
import { defaults } from './defaults';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const TMP_CONTENT_DIR = path.join('/tmp', 'sm24-content');

const FILE_NAMES: Record<CollectionName, string> = {
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

/**
 * Liest und schreibt die Inhalte als JSON-Dateien unter `content/`.
 *
 * Fehlt eine Datei, greift der eingebaute Standardinhalt. So ist die Seite
 * auch auf einer frisch aufgesetzten Umgebung sofort vollständig.
 */
export class JsonFileAdapter implements DataAdapter {
  readonly name = 'json-datei';

  /** Auf Plattformen ohne beschreibbares Dateisystem automatisch aus. */
  readonly writable = process.env.SM24_READONLY_CONTENT !== '1';

  private cache = new Map<CollectionName, unknown>();

  async read<K extends CollectionName>(name: K): Promise<Collections[K]> {
    const cached = this.cache.get(name);
    if (cached !== undefined) return cached as Collections[K];

    // Zuerst prüfen, ob in dieser Instanz eine temporäre Version geschrieben wurde
    const tmpFile = path.join(TMP_CONTENT_DIR, FILE_NAMES[name]);
    try {
      const raw = await fs.readFile(tmpFile, 'utf8');
      const parsed = JSON.parse(raw) as Collections[K];
      this.cache.set(name, parsed);
      return parsed;
    } catch {
      // Nicht in TMP, fahre mit regulärem CONTENT_DIR fort
    }

    const file = path.join(CONTENT_DIR, FILE_NAMES[name]);
    try {
      const raw = await fs.readFile(file, 'utf8');
      const parsed = JSON.parse(raw) as Collections[K];
      this.cache.set(name, parsed);
      return parsed;
    } catch {
      const fallback = defaults[name]() as Collections[K];
      this.cache.set(name, fallback);
      return fallback;
    }
  }

  async write<K extends CollectionName>(name: K, value: Collections[K]): Promise<void> {
    if (!this.writable) {
      throw new Error(
        'Die Inhalte sind auf dieser Umgebung schreibgeschützt. ' +
          'Für den Dauerbetrieb bitte einen Datenbank-Adapter hinterlegen.',
      );
    }
    this.cache.set(name, value);

    try {
      await fs.mkdir(CONTENT_DIR, { recursive: true });
      const file = path.join(CONTENT_DIR, FILE_NAMES[name]);
      await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    } catch (err: unknown) {
      // Auf Serverless-Umgebungen (wie Vercel) ist das Dateisystem schreibgeschützt (EROFS).
      // Hier weichen wir auf /tmp aus, damit Testanfragen und Abläufe in der Vorschau
      // fehlerfrei durchlaufen.
      const isReadOnlyFs =
        err !== null &&
        typeof err === 'object' &&
        'code' in err &&
        ((err as { code?: string }).code === 'EROFS' || (err as { code?: string }).code === 'EACCES');

      if (isReadOnlyFs || process.env.VERCEL) {
        try {
          await fs.mkdir(TMP_CONTENT_DIR, { recursive: true });
          const tmpFile = path.join(TMP_CONTENT_DIR, FILE_NAMES[name]);
          await fs.writeFile(tmpFile, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
        } catch {
          // Cache in-memory bleibt aktiv
        }
      } else {
        throw err;
      }
    }
  }

  /** Nach einer Änderung von außen den Zwischenspeicher leeren. */
  invalidate(name?: CollectionName) {
    if (name) this.cache.delete(name);
    else this.cache.clear();
  }
}
