import { getPayload, type Payload } from 'payload';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import { herstellerFuerAnzeige } from '@/components/hersteller/bereiche';
import { defaults } from '@/lib/data/defaults';
import { PayloadAdapter } from '@/lib/data/payload-adapter';
import { inhalteUebernehmen } from './seed';

/* FA-SHOP-04, Teil A, gegen die Testdatenbank (Migration „zylinder_bestaetigt“ und Seed aus dem
 * globalen Aufbau): Bereiche der Hersteller als Daten, Zylinderkatalog mit Hersteller aus dem Stamm,
 * Haken „Preis nicht bestätigt“. Erfundene Testdaten (G4); kein Preis wird geändert (G9). */

let payload: Payload;
const adapter = new PayloadAdapter();
const context = { disableRevalidate: true };
const STAND_HERSTELLER = 'sm24:seed-stand:hersteller';

beforeAll(async () => {
  payload = await getPayload({ config });
});

async function herstellerId(kennung: string): Promise<number> {
  const { docs } = await payload.find({ collection: 'hersteller', where: { kennung: { equals: kennung } }, limit: 1, depth: 0, trash: true });
  return docs[0].id;
}

describe('Hersteller: Bereiche als Daten', () => {
  it('der Seed legt die Bereiche mit den Startwerten an; die Seite liest sie aus der Datenbank', async () => {
    const hersteller = await adapter.read('hersteller');
    expect(hersteller).toEqual(defaults.hersteller());
    expect(herstellerFuerAnzeige(hersteller, 'sperrschliessung').map((e) => e.name)).toEqual(['BKS', 'ABUS']);
    expect(herstellerFuerAnzeige(hersteller, 'zutritt').map((e) => e.name)).toEqual(['BKS', 'ABUS', 'BURG-WÄCHTER']);
  });

  it('eine Änderung im Admin wirkt auf die Bereichsseite', async () => {
    const id = await herstellerId('burg-waechter');
    const vorher = await payload.findByID({ collection: 'hersteller', id, depth: 0 });
    try {
      await payload.update({
        collection: 'hersteller',
        id,
        data: { bereiche: [...(vorher.bereiche ?? []), { art: 'sperrschliessung', einsatz: 'Testtext für Sperrschließungen.' }] },
        context,
      });
      const anzeige = herstellerFuerAnzeige(await adapter.read('hersteller'), 'sperrschliessung');
      expect(anzeige.map((e) => [e.name, e.bereiche[0].einsatz])).toContainEqual(['BURG-WÄCHTER', 'Testtext für Sperrschließungen.']);
    } finally {
      await payload.update({ collection: 'hersteller', id, data: { bereiche: vorher.bereiche ?? [] }, context });
    }
  });

  it('lehnt einen doppelten Bereich ab', async () => {
    const id = await herstellerId('bks');
    await expect(
      payload.update({
        collection: 'hersteller',
        id,
        data: { bereiche: [{ art: 'zutritt', einsatz: 'Eins.' }, { art: 'zutritt', einsatz: 'Zwei.' }] },
        context,
      }),
    ).rejects.toThrow();
  });

  it('der Seed füllt leere Bereiche eines schon angelegten Herstellers einmal; leert der Betrieb sie danach, bleiben sie leer', async () => {
    const id = await herstellerId('abus');
    const vorher = await payload.findByID({ collection: 'hersteller', id, depth: 0 });
    const standVorher = await payload.kv.get<Record<string, Record<string, string>>>(STAND_HERSTELLER);
    try {
      // Stand wie nach FA-SHOP-01: Hersteller angelegt, Bereiche noch unbekannt.
      await payload.update({ collection: 'hersteller', id, data: { bereiche: [] }, context });
      const ohneBereiche = Object.fromEntries(
        Object.entries(standVorher ?? {}).map(([schluessel, felder]) => [schluessel, Object.fromEntries(Object.entries(felder).filter(([pfad]) => pfad !== 'bereiche'))]),
      );
      await payload.kv.set(STAND_HERSTELLER, ohneBereiche);
      await inhalteUebernehmen(payload, { startwerte: [] });
      const ergaenzt = await payload.findByID({ collection: 'hersteller', id, depth: 0 });
      expect(ergaenzt.bereiche?.map((b) => [b.art, b.einsatz])).toEqual(
        defaults.hersteller().find((h) => h.id === 'abus')?.bereiche?.map((b) => [b.art, b.einsatz]),
      );

      // Jetzt leert der Betrieb die Bereiche bewusst: Der nächste Seed lässt sie leer.
      await payload.update({ collection: 'hersteller', id, data: { bereiche: [] }, context });
      await inhalteUebernehmen(payload, { startwerte: [] });
      expect((await payload.findByID({ collection: 'hersteller', id, depth: 0 })).bereiche).toEqual([]);
    } finally {
      await payload.update({ collection: 'hersteller', id, data: { bereiche: vorher.bereiche ?? [] }, context });
      if (standVorher) await payload.kv.set(STAND_HERSTELLER, standVorher);
    }
  });
});

describe('Zylinderkatalog: Hersteller aus dem Stamm und Preis nicht bestätigt', () => {
  let original: Record<string, unknown>;

  beforeAll(async () => {
    original = (await payload.findGlobal({ slug: 'zylinderkatalog', depth: 0 })) as unknown as Record<string, unknown>;
  });

  afterAll(async () => {
    const { id: _id, createdAt: _c, updatedAt: _u, globalType: _g, ...daten } = original;
    void [_id, _c, _u, _g];
    await payload.updateGlobal({ slug: 'zylinderkatalog', data: daten as never, context });
  });

  it('der Bestand trägt nach der Migration keinen Haken und liest sich wie der JSON-Rückfall', async () => {
    const katalog = await adapter.read('cylinderCatalog');
    expect(katalog).toEqual(defaults.cylinderCatalog());
    expect(original.schluesselPreisNichtBestaetigt).toBe(false);
    for (const liste of ['bauformen', 'funktionen', 'extras'] as const) {
      const zeilen = original[liste] as Array<{ preisNichtBestaetigt?: boolean | null }>;
      expect(zeilen.length).toBeGreaterThan(0);
      expect(zeilen.every((z) => z.preisNichtBestaetigt === false)).toBe(true);
    }
  });

  it('übernimmt Name und Kennung aus der Hersteller-Liste; ältere Einträge bleiben lesbar', async () => {
    const bks = await herstellerId('bks');
    await payload.updateGlobal({
      slug: 'zylinderkatalog',
      data: {
        hersteller: [
          { stamm: bks, aktiv: true, aufpreisJeZylinder: 0, bauformen: [], zusatzkomponenten: [] },
          { name: 'Älterer Testhersteller', kennung: 'aelterer-testhersteller', aktiv: false, aufpreisJeZylinder: 0 },
        ],
      } as never,
      context,
    });
    const gespeichert = await payload.findGlobal({ slug: 'zylinderkatalog', depth: 0 });
    expect(gespeichert.hersteller?.map((h) => [h.stamm, h.name, h.kennung])).toEqual([
      [bks, 'BKS', 'bks'],
      [null, 'Älterer Testhersteller', 'aelterer-testhersteller'],
    ]);
    const katalog = await adapter.read('cylinderCatalog');
    expect(katalog.manufacturers.map((h) => [h.id, h.name, h.stammId, h.active])).toEqual([
      ['bks', 'BKS', 'bks', true],
      ['aelterer-testhersteller', 'Älterer Testhersteller', undefined, false],
    ]);
  });

  it('der Haken „Preis nicht bestätigt“ kommt bei der Seite an, der Preis bleibt', async () => {
    const bauformen = (original.bauformen as Array<Record<string, unknown>>).map((b, i) => ({ ...b, preisNichtBestaetigt: i === 0 }));
    await payload.updateGlobal({
      slug: 'zylinderkatalog',
      data: { bauformen, schluesselPreisNichtBestaetigt: true, hersteller: [] } as never,
      context,
    });
    const katalog = await adapter.read('cylinderCatalog');
    const bestand = defaults.cylinderCatalog();
    expect(katalog.forms[0].priceUnconfirmed).toBe(true);
    expect(katalog.forms.slice(1).some((f) => f.priceUnconfirmed)).toBe(false);
    expect(katalog.keyPriceUnconfirmed).toBe(true);
    expect(katalog.forms.map((f) => f.basePriceCents)).toEqual(bestand.forms.map((f) => f.basePriceCents));
    expect(katalog.keyPriceCents).toBe(bestand.keyPriceCents);
  });
});
