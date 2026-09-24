/**
 * Überträgt die bisherigen Inhalte aus `content/*.json` in die Datenbank.
 *
 *   npx payload run src/scripts/seed.ts
 *
 * Befüllt nur leere Sammlungen — bereits gepflegte Inhalte werden nie
 * überschrieben. Deshalb läuft das Skript gefahrlos bei jedem Build mit.
 */
import config from '@payload-config';
import { getPayload, type CollectionSlug, type Payload } from 'payload';

import { JsonFileAdapter } from '../lib/data/json-adapter';
import * as m from '../lib/data/payload-mapping';

const context = { disableRevalidate: true };
const adapter = new JsonFileAdapter();
const payload = await getPayload({ config });

async function leer(collection: CollectionSlug): Promise<boolean> {
  const { totalDocs } = await payload.count({ collection, trash: true });
  return totalDocs === 0;
}

async function anlegen<T>(
  collection: CollectionSlug,
  items: T[],
  toData: (item: T) => Record<string, unknown>,
): Promise<Map<string, number>> {
  const ids = new Map<string, number>();
  if (!(await leer(collection))) {
    const bestehende = await payload.find({ collection, limit: 0, pagination: false, trash: true, depth: 0 });
    for (const doc of bestehende.docs as { id: number; kennung?: string | null }[]) {
      if (doc.kennung) ids.set(doc.kennung, doc.id);
    }
    console.log(`  ${collection}: bereits gepflegt — übersprungen`);
    return ids;
  }
  for (const item of items) {
    const data = toData(item);
    const doc = (await payload.create({
      collection,
      data: data as never,
      draft: data._status === 'draft',
      context,
    })) as { id: number; kennung?: string | null };
    if (doc.kennung) ids.set(doc.kennung, doc.id);
  }
  console.log(`  ${collection}: ${items.length} angelegt`);
  return ids;
}

async function globalLeer(slug: 'einstellungen' | 'zylinderkatalog', probe: (doc: Record<string, unknown>) => unknown) {
  const doc = (await payload.findGlobal({ slug, depth: 0 })) as unknown as Record<string, unknown>;
  return !probe(doc);
}

async function seed(p: Payload) {
  console.log('Inhalte übernehmen …');

  if (await globalLeer('einstellungen', (d) => (d.firma as { marke?: string } | undefined)?.marke)) {
    await p.updateGlobal({ slug: 'einstellungen', data: m.einstellungenZuPayload(await adapter.read('settings')), context });
    console.log('  einstellungen: übernommen');
  }
  if (await globalLeer('zylinderkatalog', (d) => (d.bauformen as unknown[] | undefined)?.length)) {
    await p.updateGlobal({ slug: 'zylinderkatalog', data: m.zylinderkatalogZuPayload(await adapter.read('cylinderCatalog')), context });
    console.log('  zylinderkatalog: übernommen');
  }

  const gruppen = await anlegen('preisgruppen', await adapter.read('pricingGroups'), m.preisgruppeZuPayload);
  const leistungen = await anlegen('autoschluessel-leistungen', await adapter.read('carKeyServices'), m.leistungZuPayload);
  await anlegen('preisregeln', await adapter.read('pricingRules'), (r) => m.preisregelZuPayload(r, gruppen, leistungen));
  await anlegen('fahrzeugmarken', await adapter.read('vehicleMakes'), (v) => m.fahrzeugmarkeZuPayload(v, gruppen));
  await anlegen('produkte', await adapter.read('codeLines'), m.codeLineZuPayload);
  await anlegen('leistungsseiten', await adapter.read('servicePages'), m.leistungsseiteZuPayload);
  await anlegen('seiten', await adapter.read('pages'), m.seiteZuPayload);
  await anlegen('ratgeber', await adapter.read('guides'), m.ratgeberZuPayload);
  await anlegen('einsatzgebiete', await adapter.read('cities'), m.einsatzgebietZuPayload);
  await anlegen('sperrtage', await adapter.read('blockedDays'), m.sperrtagZuPayload);

  console.log('Fertig.');
}

try {
  await seed(payload);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
