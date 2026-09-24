import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { CollectionName, Collections, DataAdapter } from './adapter';
import { defaults } from './defaults';

const CONTENT_DIR = path.join(process.cwd(), 'content');

const FILE_NAMES: Record<CollectionName, string> = {
  settings: 'settings.json',
  pricingGroups: 'pricing-groups.json',
  pricingRules: 'service-pricing.json',
  carKeyServices: 'car-key-services.json',
  vehicleMakes: 'vehicles.json',
  codeLines: 'code-lines.json',
  standardArticles: 'standard-articles.json',
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

  /**
   * Auf Vercel gibt es kein dauerhaft beschreibbares Dateisystem. Statt dort
   * still in einen flüchtigen Zwischenspeicher zu schreiben, wird ehrlich
   * abgelehnt — dauerhaft gespeichert wird über die Datenbank (Payload).
   */
  readonly writable = !process.env.VERCEL && process.env.SM24_READONLY_CONTENT !== '1';

  private cache = new Map<CollectionName, unknown>();

  async read<K extends CollectionName>(name: K): Promise<Collections[K]> {
    const cached = this.cache.get(name);
    if (cached !== undefined) return cached as Collections[K];

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
    await fs.mkdir(CONTENT_DIR, { recursive: true });
    const file = path.join(CONTENT_DIR, FILE_NAMES[name]);
    await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    // Erst nach erfolgreichem Schreiben übernehmen — sonst meldete der
    // Zwischenspeicher Daten, die nie gespeichert wurden.
    this.cache.set(name, value);
  }

  /** Nach einer Änderung von außen den Zwischenspeicher leeren. */
  invalidate(name?: CollectionName) {
    if (name) this.cache.delete(name);
    else this.cache.clear();
  }
}
