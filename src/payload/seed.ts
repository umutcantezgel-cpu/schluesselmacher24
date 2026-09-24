/**
 * Überträgt die bisherigen Inhalte aus `content/*.json` in die Datenbank
 * (Aufruf über `src/scripts/seed.ts`).
 *
 * Jede Sammlung wird genau einmal übernommen. Danach steht ein Vermerk in der
 * Datenbank (`sm24:seed:<name>`) — auch wenn der Betreiber später alle
 * Einträge löscht, legt ein neuer Build nichts wieder an. Bereits gepflegte
 * Inhalte werden nie überschrieben. Deshalb läuft das Skript bei jedem Build.
 */
import type { CollectionSlug, Payload, Where } from 'payload';

import { JsonFileAdapter } from '../lib/data/json-adapter';
import * as m from '../lib/data/payload-mapping';

const context = { disableRevalidate: true };
const adapter = new JsonFileAdapter();

/** Übernimmt alle noch nicht übernommenen Sammlungen. Mehrfach aufrufbar. */
export async function inhalteUebernehmen(payload: Payload): Promise<void> {
  const vermerk = (name: string) => `sm24:seed:${name}`;

  async function schonUebernommen(name: string, vorhanden: () => Promise<boolean>): Promise<boolean> {
    if (await payload.kv.has(vermerk(name))) return true;
    // Datenbanken aus der Zeit vor dem Vermerk: Inhalt vorhanden = übernommen.
    if (await vorhanden()) {
      await payload.kv.set(vermerk(name), { nachgetragen: true });
      return true;
    }
    return false;
  }

  async function vorhanden(collection: CollectionSlug, where?: Where): Promise<boolean> {
    const { totalDocs } = await payload.count({ collection, where, trash: true });
    return totalDocs > 0;
  }

  /** Kennung → Datenbank-ID, auch für bereits übernommene Sammlungen. */
  async function kennungen(collection: CollectionSlug): Promise<Map<string, number>> {
    const { docs } = await payload.find({ collection, limit: 0, pagination: false, trash: true, depth: 0 });
    const ids = new Map<string, number>();
    for (const doc of docs as { id: number; kennung?: string | null }[]) {
      if (doc.kennung) ids.set(doc.kennung, doc.id);
    }
    return ids;
  }

  async function uebernehmen<T>(
    name: string,
    collection: CollectionSlug,
    items: T[],
    toData: (item: T) => Record<string, unknown>,
    where?: Where,
  ): Promise<Map<string, number>> {
    if (await schonUebernommen(name, () => vorhanden(collection, where))) {
      console.log(`  ${name}: bereits übernommen — übersprungen`);
      return kennungen(collection);
    }
    for (const item of items) {
      const data = toData(item);
      await payload.create({ collection, data: data as never, draft: data._status === 'draft', context });
    }
    await payload.kv.set(vermerk(name), { anzahl: items.length });
    console.log(`  ${name}: ${items.length} angelegt`);
    return kennungen(collection);
  }

  async function globalUebernehmen(
    slug: 'einstellungen' | 'zylinderkatalog',
    gefuellt: (doc: Record<string, unknown>) => boolean,
    daten: () => Promise<Record<string, unknown>>,
  ) {
    const doc = (await payload.findGlobal({ slug, depth: 0 })) as unknown as Record<string, unknown>;
    if (await schonUebernommen(slug, async () => gefuellt(doc))) {
      console.log(`  ${slug}: bereits übernommen — übersprungen`);
      return;
    }
    await payload.updateGlobal({ slug, data: (await daten()) as never, context });
    await payload.kv.set(vermerk(slug), { uebernommen: true });
    console.log(`  ${slug}: übernommen`);
  }

  async function seed() {
    console.log('Inhalte übernehmen …');

    await globalUebernehmen(
      'einstellungen',
      (d) => Boolean((d.firma as { marke?: string } | undefined)?.marke),
      async () => m.einstellungenZuPayload(await adapter.read('settings')) as unknown as Record<string, unknown>,
    );
    await globalUebernehmen(
      'zylinderkatalog',
      (d) => Boolean((d.bauformen as unknown[] | undefined)?.length),
      async () => m.zylinderkatalogZuPayload(await adapter.read('cylinderCatalog')) as unknown as Record<string, unknown>,
    );

    const gruppen = await uebernehmen('preisgruppen', 'preisgruppen', await adapter.read('pricingGroups'), m.preisgruppeZuPayload);
    const leistungen = await uebernehmen(
      'autoschluessel-leistungen',
      'autoschluessel-leistungen',
      await adapter.read('carKeyServices'),
      m.leistungZuPayload,
    );
    await uebernehmen('preisregeln', 'preisregeln', await adapter.read('pricingRules'), (r) =>
      m.preisregelZuPayload(r, gruppen, leistungen),
    );
    await uebernehmen('fahrzeugmarken', 'fahrzeugmarken', await adapter.read('vehicleMakes'), (v) =>
      m.fahrzeugmarkeZuPayload(v, gruppen),
    );
    await uebernehmen('codelinien', 'produkte', await adapter.read('codeLines'), m.codeLineZuPayload, {
      typ: { equals: 'code_key' },
    });
    await uebernehmen(
      'beispielartikel',
      'produkte',
      await adapter.read('standardArticles'),
      m.standardartikelZuPayload,
      { typ: { equals: 'standard' } },
    );
    await uebernehmen('leistungsseiten', 'leistungsseiten', await adapter.read('servicePages'), m.leistungsseiteZuPayload);
    await uebernehmen('seiten', 'seiten', await adapter.read('pages'), m.seiteZuPayload);
    await uebernehmen('ratgeber', 'ratgeber', await adapter.read('guides'), m.ratgeberZuPayload);
    await uebernehmen('einsatzgebiete', 'einsatzgebiete', await adapter.read('cities'), m.einsatzgebietZuPayload);
    await uebernehmen('sperrtage', 'sperrtage', await adapter.read('blockedDays'), m.sperrtagZuPayload);

    console.log('Fertig.');
  }

  await seed();
}
