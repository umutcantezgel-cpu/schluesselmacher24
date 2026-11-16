import { getPayload, type Payload } from 'payload';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import { defaults } from '@/lib/data/defaults';
import { fahrzeugteile, fahrzeugteileFiltern } from '@/lib/data/fahrzeugteile';
import { PayloadAdapter } from '@/lib/data/payload-adapter';
import { inhalteUebernehmen } from './seed';

/* Gehäuse und Ersatzteile (FA-SHOP-02) gegen die Testdatenbank: Bauformen aus dem Seed, ein Gehäuse
 * mit Fahrzeugbezug aus dem Fahrzeugkatalog, Pflichtangaben beim Veröffentlichen, Marke und Reihen
 * nur aus dem Katalog, Umbau-Beispiele erst mit Fotos und Freigabe. Erfundene Testdaten (G4). */

let payload: Payload;
const adapter = new PayloadAdapter();
const context = { disableRevalidate: true };
const INHABER = { id: 1, collection: 'benutzer', rollen: ['inhaber'], email: 'inhaber@example.org', name: 'Test Inhaber' };
const aufraeumen: Array<{ collection: 'produkte' | 'bauformen' | 'umbau-beispiele'; id: number }> = [];
const lauf = `${process.pid}`;

beforeAll(async () => {
  payload = await getPayload({ config });
});

afterAll(async () => {
  for (const { collection, id } of aufraeumen.reverse()) {
    await payload.delete({ collection, id, trash: true, context }).catch(() => undefined);
  }
});

async function bauformId(kennung: string): Promise<number> {
  const { docs } = await payload.find({ collection: 'bauformen', where: { kennung: { equals: kennung } }, limit: 1, depth: 0, trash: true });
  return docs[0].id;
}

/** Zwei Reihen derselben Marke und eine Reihe einer anderen Marke aus dem geseedeten Katalog. */
async function reihenAusKatalog() {
  const { docs } = await payload.find({ collection: 'fahrzeugreihen', limit: 400, depth: 0, sort: 'marke' });
  const jeMarke = new Map<string, typeof docs>();
  for (const doc of docs) jeMarke.set(doc.marke, [...(jeMarke.get(doc.marke) ?? []), doc]);
  const [marke, eigene] = [...jeMarke.entries()].find(([, liste]) => liste.length >= 2)!;
  const fremd = docs.find((d) => d.marke !== marke)!;
  return { marke, eigene: eigene.slice(0, 2), fremd };
}

/** Meldungen eines abgelehnten Speicherns (Payload nennt im Fehlertext nur die Felder). */
async function meldungen(vorgang: Promise<unknown>): Promise<string> {
  try {
    await vorgang;
  } catch (fehler) {
    const daten = (fehler as { data?: { errors?: Array<{ message?: string }> } }).data;
    return [(fehler as Error).message, ...(daten?.errors ?? []).map((e) => e.message ?? '')].join(' | ');
  }
  throw new Error('Speichern wurde nicht abgelehnt.');
}

const gehaeuse = (extra: Record<string, unknown> = {}) => ({
  typ: 'standard' as const,
  name: `Testgehäuse ${lauf}`,
  slug: `testgehaeuse-${lauf}`,
  beschreibung: 'Testartikel',
  preis: 10,
  maxMenge: 5,
  versandklasse: 'zubehoer' as const,
  ...extra,
});

describe('Bauformen', () => {
  it('legt den Startbestand an und belebt eine gelöschte Bauform nicht wieder', async () => {
    expect(await adapter.read('bauformen')).toEqual(defaults.bauformen());
    const id = await bauformId('schluesselkopf');
    await payload.update({ collection: 'bauformen', id, data: { deletedAt: new Date().toISOString() }, trash: true, context });
    try {
      await inhalteUebernehmen(payload);
      const { totalDocs } = await payload.count({ collection: 'bauformen', where: { kennung: { equals: 'schluesselkopf' } }, trash: true });
      expect(totalDocs).toBe(1);
      expect((await adapter.read('bauformen')).map((b) => b.id)).not.toContain('schluesselkopf');
    } finally {
      await payload.update({ collection: 'bauformen', id, data: { deletedAt: null }, trash: true, context });
    }
  });

  it('eine neue Bauform bekommt ihre Adresse aus dem Namen; jeder Name nur einmal', async () => {
    const neu = await payload.create({ collection: 'bauformen', data: { name: `Testform ${lauf}`, reihenfolge: 90 }, user: INHABER as never, overrideAccess: false, context });
    aufraeumen.push({ collection: 'bauformen', id: neu.id });
    expect(neu.slug).toBe(`testform-${lauf}`);
    expect(neu.kennung).toBe(neu.slug);
    await expect(
      payload.create({ collection: 'bauformen', data: { name: `Testform ${lauf}`, reihenfolge: 91 }, user: INHABER as never, overrideAccess: false, context }),
    ).rejects.toThrow();
  });
});

describe('Gehäuse mit Fahrzeugbezug', () => {
  it('veröffentlicht ein vollständiges Gehäuse und liest es in der Datenschicht samt Filter', async () => {
    const { marke, eigene } = await reihenAusKatalog();
    const doc = await payload.create({
      collection: 'produkte',
      data: gehaeuse({
        fahrzeugteil: {
          aktiv: true,
          teileart: 'gehaeuse',
          elektronik: 'pruefung',
          kompatibilitaet: 'Elektronik und Bart werden übernommen, wenn die Platine passt.',
          bauformen: [await bauformId('klappschluessel')],
          marke,
          reihen: [eigene[0].id],
          baujahrVon: 2008,
          baujahrBis: 2016,
          tastenzahl: 3,
          schluesselarten: ['klappschluessel'],
        },
        _status: 'published',
      }),
      user: INHABER as never,
      overrideAccess: false,
      context,
    });
    aufraeumen.push({ collection: 'produkte', id: doc.id });

    const artikel = (await adapter.read('standardArticles')).find((a) => a.id === doc.kennung);
    expect(artikel?.fahrzeugteil).toEqual({
      teileart: 'gehaeuse',
      bauformen: ['klappschluessel'],
      marke,
      reihen: [eigene[0].kennung],
      baujahrVon: 2008,
      baujahrBis: 2016,
      tastenzahl: 3,
      schluesselarten: ['klappschluessel'],
      kompatibilitaet: 'Elektronik und Bart werden übernommen, wenn die Platine passt.',
      elektronik: 'pruefung',
    });
    const teile = fahrzeugteile(await adapter.read('standardArticles'));
    const treffer = (reihe: string, baujahr?: number) =>
      fahrzeugteileFiltern(teile, { marke, reihe, baujahr }).map((a) => a.id);
    expect(treffer(eigene[0].kennung!, 2012)).toContain(doc.kennung);
    expect(treffer(eigene[0].kennung!, 2020)).not.toContain(doc.kennung);
    expect(treffer(eigene[1].kennung!)).not.toContain(doc.kennung);
  });

  it('verlangt beim Veröffentlichen Kompatibilitätshinweis, Elektronik, Bauform und Tastenzahl', async () => {
    const text = await meldungen(
      payload.create({
        collection: 'produkte',
        data: gehaeuse({ slug: `testgehaeuse-leer-${lauf}`, fahrzeugteil: { aktiv: true, teileart: 'gehaeuse' }, _status: 'published' }),
        user: INHABER as never,
        overrideAccess: false,
        context,
      }),
    );
    for (const erwartet of [/Kompatibilitätshinweis/, /Elektronik und Transponder/, /Bauform/, /Tastenzahl/]) {
      expect(text).toMatch(erwartet);
    }

    // Als Entwurf darf es unvollständig sein; die Seite sieht es nicht.
    const entwurf = await payload.create({
      collection: 'produkte',
      data: gehaeuse({ slug: `testgehaeuse-entwurf-${lauf}`, fahrzeugteil: { aktiv: true, teileart: 'gehaeuse' }, _status: 'draft' }),
      draft: true,
      user: INHABER as never,
      overrideAccess: false,
      context,
    });
    aufraeumen.push({ collection: 'produkte', id: entwurf.id });
    expect((await adapter.read('standardArticles')).map((a) => a.id)).not.toContain(entwurf.kennung);
  });

  it('nimmt Marke und Reihen nur aus dem Fahrzeugkatalog', async () => {
    const { marke, eigene, fremd } = await reihenAusKatalog();
    const basis = {
      aktiv: true,
      teileart: 'batterie',
      elektronik: 'nein',
      kompatibilitaet: 'Nur die Batterie, sonst nichts.',
    };
    const anlegen = (slug: string, fahrzeugteil: Record<string, unknown>) =>
      payload.create({
        collection: 'produkte',
        data: gehaeuse({ slug: `${slug}-${lauf}`, fahrzeugteil: { ...basis, ...fahrzeugteil }, _status: 'published' }),
        user: INHABER as never,
        overrideAccess: false,
        context,
      });
    expect(await meldungen(anlegen('testteil-marke', { marke: `Erfundene Marke ${lauf}` }))).toMatch(/nicht im Fahrzeugkatalog/);
    expect(await meldungen(anlegen('testteil-reihe', { marke, reihen: [eigene[0].id, fremd.id] }))).toMatch(/gehört nicht zur Marke/);
    expect(await meldungen(anlegen('testteil-ohne-marke', { reihen: [eigene[0].id] }))).toMatch(/zuerst die Marke/);
    const allgemein = await anlegen('testteil-allgemein', {});
    aufraeumen.push({ collection: 'produkte', id: allgemein.id });
    const artikel = (await adapter.read('standardArticles')).find((a) => a.id === allgemein.kennung);
    expect(artikel?.fahrzeugteil).toMatchObject({ teileart: 'batterie', reihen: [], bauformen: [], schluesselarten: [] });
    expect(artikel?.fahrzeugteil?.marke).toBeUndefined();
  });
});

describe('Umbau-Beispiele', () => {
  it('Startbestand leer; ein Entwurf ohne Fotos erscheint nicht', async () => {
    expect(await adapter.read('umbauBeispiele')).toEqual([]);
    const entwurf = await payload.create({
      collection: 'umbau-beispiele',
      data: { titel: `Testumbau ${lauf}`, hinweis: 'Test', einsatz: ['customizing'], _status: 'draft' } as never,
      draft: true,
      user: INHABER as never,
      overrideAccess: false,
      context,
    });
    aufraeumen.push({ collection: 'umbau-beispiele', id: entwurf.id });
    expect(await adapter.read('umbauBeispiele')).toEqual([]);
    // Veröffentlichen ohne Fotos geht nicht.
    await expect(
      payload.update({ collection: 'umbau-beispiele', id: entwurf.id, data: { _status: 'published' }, user: INHABER as never, overrideAccess: false, context }),
    ).rejects.toThrow();
  });
});
