import { sql } from '@payloadcms/db-postgres';
import { getPayload, type Payload } from 'payload';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import type { CollectionName, Collections } from '@/lib/data/adapter';
import { defaults } from '@/lib/data/defaults';
import { JsonFileAdapter } from '@/lib/data/json-adapter';
import { PayloadAdapter } from '@/lib/data/payload-adapter';
import type { ShopKategorie } from '@/lib/types';
import { kategorieAufloesen, sichtbareKategorien } from '@/lib/data/shop';
import { inhalteUebernehmen, type InhaltsQuelle } from './seed';

/* Shop-Grundlage (FA-SHOP-01) gegen die Testdatenbank: Startbestand der Kategorien aus dem Seed,
 * Umbenennen mit Weiterleitung, Unterkategorien ohne Kreis, Hersteller-Stammliste, System als Pflicht,
 * Hersteller und Codebereich als Pflicht beim Veröffentlichen, Duplizieren mit den neuen Feldern und die Verfügbarkeit in der Datenschicht. Erfundene Testdaten (G4). */

let payload: Payload;
const adapter = new PayloadAdapter();
const context = { disableRevalidate: true };
const INHABER = { id: 1, collection: 'benutzer', rollen: ['inhaber'], email: 'inhaber@example.org', name: 'Test Inhaber' };
const aufraeumen: Array<{ collection: 'produkte' | 'kategorien' | 'hersteller'; id: number }> = [];

beforeAll(async () => {
  payload = await getPayload({ config });
});

afterAll(async () => {
  for (const { collection, id } of aufraeumen.reverse()) {
    await payload.delete({ collection, id, trash: true, context }).catch(() => undefined);
  }
});

async function kategorieId(kennung: string): Promise<number> {
  const { docs } = await payload.find({ collection: 'kategorien', where: { kennung: { equals: kennung } }, limit: 1, depth: 0, trash: true });
  return docs[0].id;
}

const codeprodukt = {
  typ: 'code_key' as const,
  beschreibung: 'Testartikel',
  preis: 12.5,
  maxMenge: 10,
  versandklasse: 'code-schluessel' as const,
  codeFormat: '4 Ziffern',
  codeMuster: '^[0-9]{4}$',
  codeBeispiel: '1234',
};

describe('Shop-Kategorien', () => {
  it('legt den Startbestand der neun Hauptkategorien an, „weitere Sicherheitstechnik“ verborgen', async () => {
    const kategorien = await adapter.read('kategorien');
    expect(kategorien.map((k) => k.id)).toEqual(defaults.kategorien().map((k) => k.id));
    expect(kategorien).toEqual(defaults.kategorien());
    expect(sichtbareKategorien(kategorien).map((k) => k.id)).not.toContain('weitere-sicherheitstechnik');
  });

  it('der Seed legt nichts doppelt an und belebt eine gelöschte Kategorie nicht wieder', async () => {
    const id = await kategorieId('customizing-und-modifikation');
    await payload.update({ collection: 'kategorien', id, data: { deletedAt: new Date().toISOString() }, trash: true, context });
    try {
      await inhalteUebernehmen(payload, { startwerte: [] });
      const { totalDocs } = await payload.count({ collection: 'kategorien', where: { kennung: { equals: 'customizing-und-modifikation' } }, trash: true });
      expect(totalDocs).toBe(1);
      expect((await adapter.read('kategorien')).map((k) => k.id)).not.toContain('customizing-und-modifikation');
    } finally {
      await payload.update({ collection: 'kategorien', id, data: { deletedAt: null }, trash: true, context });
    }
    expect((await payload.count({ collection: 'kategorien' })).totalDocs).toBe(9);
  });

  it('behält beim Umbenennen der Adresse die alte als Weiterleitung, die Kennung bleibt', async () => {
    const id = await kategorieId('schliesstechnik-und-zubehoer');
    const neu = await payload.update({ collection: 'kategorien', id, data: { slug: 'zubehoer-test' }, context });
    try {
      expect(neu.kennung).toBe('schliesstechnik-und-zubehoer');
      expect(neu.fruehereAdressen?.map((z) => z.adresse)).toEqual(['schliesstechnik-und-zubehoer']);
      const kategorien = await adapter.read('kategorien');
      expect(kategorieAufloesen(kategorien, 'schliesstechnik-und-zubehoer')?.weiterleitung?.slug).toBe('zubehoer-test');
      expect(kategorieAufloesen(kategorien, 'zubehoer-test')?.kategorie?.id).toBe('schliesstechnik-und-zubehoer');
    } finally {
      const zurueck = await payload.update({ collection: 'kategorien', id, data: { slug: 'schliesstechnik-und-zubehoer' }, context });
      expect(zurueck.fruehereAdressen?.map((z) => z.adresse)).toEqual(['zubehoer-test']);
      await payload.update({ collection: 'kategorien', id, data: { fruehereAdressen: [] }, context });
    }
  });

  it('legt eine Unterkategorie an und verhindert Kreise', async () => {
    const elternId = await kategorieId('schluessel-nach-code');
    const unter = await payload.create({
      collection: 'kategorien',
      data: { name: 'Test Briefkasten', beschreibung: 'Unterkategorie zum Test.', ziel: '/schluessel-nach-code', art: 'codeprodukte', eltern: elternId, reihenfolge: 10 },
      user: INHABER as never,
      overrideAccess: false,
      context,
    });
    aufraeumen.push({ collection: 'kategorien', id: unter.id });
    // Adresse und Kennung aus dem Namen.
    expect(unter.slug).toBe('test-briefkasten');
    expect(unter.kennung).toBe('test-briefkasten');
    const lesen = (await adapter.read('kategorien')).find((k) => k.id === 'test-briefkasten');
    expect(lesen?.eltern).toBe('schluessel-nach-code');

    await expect(
      payload.update({ collection: 'kategorien', id: elternId, data: { eltern: unter.id }, context }),
    ).rejects.toThrow();
    await expect(
      payload.update({ collection: 'kategorien', id: unter.id, data: { eltern: unter.id }, context }),
    ).rejects.toThrow();
    const unveraendert = await payload.findByID({ collection: 'kategorien', id: elternId, depth: 0 });
    expect(unveraendert.eltern ?? null).toBeNull();
  });
});

describe('Stabile Adresse und Unterkategorien im Seed', () => {
  it('ein Teil-Update des Namens lässt die Adresse unverändert', async () => {
    const id = await kategorieId('autoschluesselgehaeuse');
    const vorher = await payload.findByID({ collection: 'kategorien', id, depth: 0 });
    try {
      const neu = await payload.update({ collection: 'kategorien', id, data: { name: 'Neuer Name' }, context });
      expect(neu.slug).toBe(vorher.slug);
      expect(neu.fruehereAdressen ?? []).toEqual(vorher.fruehereAdressen ?? []);
    } finally {
      await payload.update({ collection: 'kategorien', id, data: { name: vorher.name }, context });
    }
  });

  it('verknüpft eine neue Unterkategorie aus dem Inhalt schon im ersten Lauf mit ihrer Hauptkategorie', async () => {
    const dateien = new JsonFileAdapter();
    const unter: ShopKategorie = {
      id: 'test-seed-unterkategorie',
      slug: 'test-seed-unterkategorie',
      name: 'Test Seed Unterkategorie',
      beschreibung: 'Unterkategorie zum Test.',
      eltern: 'test-seed-hauptkategorie',
      reihenfolge: 10,
      art: 'codeprodukte',
      ziel: '/schluessel-nach-code',
      sichtbar: true,
      fruehereAdressen: [],
    };
    // Die Hauptkategorie steht in der Liste hinter der Unterkategorie und entsteht im selben Lauf.
    const haupt: ShopKategorie = { ...unter, id: 'test-seed-hauptkategorie', slug: 'test-seed-hauptkategorie', name: 'Test Seed Hauptkategorie', eltern: undefined };
    const quelle: InhaltsQuelle = {
      async read<K extends CollectionName>(name: K): Promise<Collections[K]> {
        const inhalt = await dateien.read(name);
        return (name === 'kategorien' ? [...(inhalt as ShopKategorie[]), unter, haupt] : inhalt) as Collections[K];
      },
    };
    await inhalteUebernehmen(payload, { quelle, startwerte: [] });
    const unterId = await kategorieId('test-seed-unterkategorie');
    const hauptId = await kategorieId('test-seed-hauptkategorie');
    aufraeumen.push({ collection: 'kategorien', id: hauptId }, { collection: 'kategorien', id: unterId });
    const doc = await payload.findByID({ collection: 'kategorien', id: unterId, depth: 0 });
    expect(doc.eltern).toBe(hauptId);
  });
});

describe('Hersteller-Stammliste', () => {
  it('bildet die Adresse aus dem Namen und nimmt jeden Namen nur einmal', async () => {
    const h = await payload.create({ collection: 'hersteller', data: { name: 'Testwerk Schlösser', angeboten: true, reihenfolge: 10 }, context });
    aufraeumen.push({ collection: 'hersteller', id: h.id });
    expect(h).toMatchObject({ slug: 'testwerk-schloesser', kennung: 'testwerk-schloesser' });
    await expect(payload.create({ collection: 'hersteller', data: { name: 'Testwerk Schlösser', reihenfolge: 20 }, context })).rejects.toThrow();
    const gelesen = (await adapter.read('hersteller')).find((x) => x.id === 'testwerk-schloesser');
    expect(gelesen).toMatchObject({ name: 'Testwerk Schlösser', angeboten: true });
    expect(gelesen?.logo).toBeUndefined();
  });
});

describe('Codeprodukt mit den neuen Feldern', () => {
  it('verlangt das System beim Veröffentlichen, nicht im Entwurf', async () => {
    const slug = `test-ohne-system-${process.pid}`;
    await expect(
      payload.create({ collection: 'produkte', data: { ...codeprodukt, name: 'Ohne System', slug, _status: 'published' }, context }),
    ).rejects.toThrow(/system/i);
    const entwurf = await payload.create({ collection: 'produkte', data: { ...codeprodukt, name: 'Ohne System', slug, _status: 'draft' }, draft: true, context });
    aufraeumen.push({ collection: 'produkte', id: entwurf.id });
    await expect(
      payload.update({ collection: 'produkte', id: entwurf.id, data: { _status: 'published' }, context }),
    ).rejects.toThrow(/system/i);
  });

  it('liest Hersteller, System, Codebereich, Kategorie und Verfügbarkeit und dupliziert sie mit neuer Kennung', async () => {
    const hersteller = await payload.create({ collection: 'hersteller', data: { name: 'Testhersteller Duplikat', reihenfolge: 30 }, context });
    aufraeumen.push({ collection: 'hersteller', id: hersteller.id });
    const kategorie = await kategorieId('schluessel-nach-code');
    const original = await payload.create({
      collection: 'produkte',
      data: {
        ...codeprodukt,
        name: 'Testlinie Shop',
        slug: `test-shop-${process.pid}`,
        system: 'System T',
        codebereich: '0001 bis 9999',
        lieferzeit: '2 bis 4 Werktage',
        verfuegbarkeit: 'nicht-lieferbar',
        kategorie,
        herstellerAuswahl: hersteller.id,
        hersteller: 'Alter Freitext',
        _status: 'published',
      },
      context,
    });
    aufraeumen.push({ collection: 'produkte', id: original.id });

    const linie = (await adapter.read('codeLines')).find((l) => l.slug === original.slug);
    expect(linie).toMatchObject({
      manufacturer: 'Testhersteller Duplikat',
      manufacturerId: 'testhersteller-duplikat',
      system: 'System T',
      codeRange: '0001 bis 9999',
      deliveryTime: '2 bis 4 Werktage',
      availability: 'nicht-lieferbar',
      categoryId: 'schluessel-nach-code',
    });

    const kopie = await payload.duplicate({ collection: 'produkte', id: original.id, user: INHABER as never, overrideAccess: false, context });
    aufraeumen.push({ collection: 'produkte', id: kopie.id });
    expect(kopie.slug).toMatch(new RegExp(`^${original.slug}-kopie-[a-z0-9]+$`));
    expect(kopie.kennung).toBe(kopie.slug);
    expect(kopie.kennung).not.toBe(original.kennung);
    expect(kopie._status).toBe('draft');
    expect(kopie).toMatchObject({ system: 'System T', codebereich: '0001 bis 9999', verfuegbarkeit: 'nicht-lieferbar' });
    const verweis = (wert: unknown) => (wert && typeof wert === 'object' ? (wert as { id: number }).id : wert);
    expect(verweis(kopie.kategorie)).toBe(kategorie);
    expect(verweis(kopie.herstellerAuswahl)).toBe(hersteller.id);
  });

  it('verlangt Hersteller und Codebereich beim Veröffentlichen, nicht im Entwurf und nicht beim Beispiel (FA-11-07, FA-11-09)', async () => {
    const hersteller = await payload.create({ collection: 'hersteller', data: { name: 'Testhersteller Pflicht', reihenfolge: 40 }, context });
    aufraeumen.push({ collection: 'hersteller', id: hersteller.id });
    const basis = { ...codeprodukt, name: 'Pflichtangaben', system: 'System T' };
    const slug = `test-pflicht-${process.pid}`;

    await expect(
      payload.create({ collection: 'produkte', data: { ...basis, slug, codebereich: '1 bis 99', _status: 'published' }, context }),
    ).rejects.toThrow(/Hersteller/);
    await expect(
      payload.create({ collection: 'produkte', data: { ...basis, slug, herstellerAuswahl: hersteller.id, _status: 'published' }, context }),
    ).rejects.toThrow(/Codebereich/);

    // Entwurf ohne beides: erlaubt; Veröffentlichen erst mit beidem.
    const entwurf = await payload.create({ collection: 'produkte', data: { ...basis, slug, _status: 'draft' }, draft: true, context });
    aufraeumen.push({ collection: 'produkte', id: entwurf.id });
    await expect(payload.update({ collection: 'produkte', id: entwurf.id, data: { _status: 'published' }, context })).rejects.toThrow(
      /Hersteller|Codebereich/,
    );
    const fertig = await payload.update({
      collection: 'produkte',
      id: entwurf.id,
      data: { herstellerAuswahl: hersteller.id, codebereich: '1 bis 99', _status: 'published' },
      context,
    });
    expect(fertig._status).toBe('published');

    // Der ältere Freitext genügt als Hersteller; ein Beispiel bleibt frei.
    const alt = await payload.create({
      collection: 'produkte',
      data: { ...basis, slug: `${slug}-alt`, hersteller: 'Alter Testhersteller', codebereich: '1 bis 99', _status: 'published' },
      context,
    });
    aufraeumen.push({ collection: 'produkte', id: alt.id });
    expect(alt._status).toBe('published');
  });

  it('ein schon veröffentlichtes Produkt ohne Codebereich bleibt lesbar, speichern geht erst mit der Angabe', async () => {
    const hersteller = await payload.create({ collection: 'hersteller', data: { name: 'Testhersteller Bestand', reihenfolge: 50 }, context });
    aufraeumen.push({ collection: 'hersteller', id: hersteller.id });
    const doc = await payload.create({
      collection: 'produkte',
      data: { ...codeprodukt, name: 'Bestand ohne Codebereich', slug: `test-bestand-${process.pid}`, system: 'System T', herstellerAuswahl: hersteller.id, codebereich: '1 bis 99', _status: 'published' },
      context,
    });
    aufraeumen.push({ collection: 'produkte', id: doc.id });
    // So sieht ein Eintrag aus der Zeit vor der Pflicht aus: direkt in der Datenbank (Dokument und Fassungen), ohne Prüfung.
    const db = payload.db.drizzle as unknown as { execute: (q: ReturnType<typeof sql>) => Promise<unknown> };
    await db.execute(sql`UPDATE produkte SET codebereich = NULL WHERE id = ${doc.id}`);
    await db.execute(sql`UPDATE _produkte_v SET version_codebereich = NULL WHERE parent_id = ${doc.id}`);

    const linie = (await adapter.read('codeLines')).find((l) => l.slug === doc.slug);
    expect(linie).toBeDefined();
    expect(linie?.codeRange ?? '').toBe('');
    await expect(payload.update({ collection: 'produkte', id: doc.id, data: { name: 'Bestand neu' }, context })).rejects.toThrow(/Codebereich/);
    const neu = await payload.update({ collection: 'produkte', id: doc.id, data: { name: 'Bestand neu', codebereich: '1 bis 99' }, context });
    expect(neu.name).toBe('Bestand neu');
  });

  it('bestehende Artikel ohne Angabe gelten als lieferbar', async () => {
    const hersteller = await payload.create({ collection: 'hersteller', data: { name: 'Testhersteller Lieferbar', reihenfolge: 60 }, context });
    aufraeumen.push({ collection: 'hersteller', id: hersteller.id });
    const doc = await payload.create({
      collection: 'produkte',
      data: { ...codeprodukt, name: 'Ohne Verfügbarkeit', slug: `test-lieferbar-${process.pid}`, system: 'System T', herstellerAuswahl: hersteller.id, codebereich: '1 bis 99', _status: 'published' },
      context,
    });
    aufraeumen.push({ collection: 'produkte', id: doc.id });
    expect(doc.verfuegbarkeit).toBe('lieferbar');
    const linie = (await adapter.read('codeLines')).find((l) => l.slug === doc.slug);
    expect(linie?.availability).toBeUndefined();
  });
});
