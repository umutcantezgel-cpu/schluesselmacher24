import { getPayload, type Payload } from 'payload';
import { beforeAll, describe, expect, it } from 'vitest';

import config from '@payload-config';
import { inhalteUebernehmen } from '@/payload/seed';
import { PayloadAdapter } from './payload-adapter';

/* Gegen die Testdatenbank (siehe src/test/db-global-setup.ts): Seed ist
 * eingespielt, die Seite liest über denselben Adapter wie im Betrieb. */

let payload: Payload;
const adapter = new PayloadAdapter();
const context = { disableRevalidate: true };

const basis = {
  typ: 'code_key' as const,
  beschreibung: 'Testartikel',
  preis: 12.5,
  maxMenge: 10,
  versandklasse: 'code-schluessel' as const,
  codeFormat: '4 Ziffern',
  codeMuster: '^[0-9]{4}$',
  codeBeispiel: '1234',
};

beforeAll(async () => {
  payload = await getPayload({ config });
});

describe('Inhalte aus der Datenbank', () => {
  it('liefert die übernommenen Inhalte', async () => {
    const [lines, settings, catalog, makes] = await Promise.all([
      adapter.read('codeLines'),
      adapter.read('settings'),
      adapter.read('cylinderCatalog'),
      adapter.read('vehicleMakes'),
    ]);
    expect(lines.length).toBe(52);
    expect(lines[0].id).toBe('ms-01');
    expect(settings.company.brandName).toBe('SCHLÜSSELMACHER24');
    expect(catalog.forms.length).toBeGreaterThan(0);
    expect(makes.find((m) => m.slug === 'volkswagen')?.pricingGroupId).toBe('gruppe-b');
  });

  it('zeigt Entwürfe nicht öffentlich, veröffentlichte schon', async () => {
    const doc = await payload.create({
      collection: 'produkte',
      data: { ...basis, name: 'Entwurf', slug: 'test-entwurf', _status: 'draft' },
      draft: true,
      context,
    });
    expect((await adapter.read('codeLines')).some((l) => l.slug === 'test-entwurf')).toBe(false);

    await payload.update({ collection: 'produkte', id: doc.id, data: { _status: 'published' }, context });
    const line = (await adapter.read('codeLines')).find((l) => l.slug === 'test-entwurf');
    expect(line?.id).toBe('test-entwurf');
    expect(line?.priceCents).toBe(1250);
  });

  it('lässt einen veröffentlichten Artikel sichtbar, solange eine Änderung nur Entwurf ist', async () => {
    const doc = await payload.create({
      collection: 'produkte',
      data: { ...basis, name: 'Stabil', slug: 'test-stabil', _status: 'published' },
      context,
    });
    await payload.update({
      collection: 'produkte',
      id: doc.id,
      data: { preis: 99 },
      draft: true,
      context,
    });
    const line = (await adapter.read('codeLines')).find((l) => l.slug === 'test-stabil');
    expect(line?.priceCents).toBe(1250);
  });

  it('nimmt Artikel im Papierkorb aus dem Shop und stellt sie wieder her', async () => {
    const doc = await payload.create({
      collection: 'produkte',
      data: { ...basis, name: 'Papierkorb', slug: 'test-papierkorb', _status: 'published' },
      context,
    });
    // „In den Papierkorb“ = deletedAt setzen; `delete({ trash: true })` löscht endgültig.
    await payload.update({ collection: 'produkte', id: doc.id, data: { deletedAt: new Date().toISOString() }, context });
    expect((await adapter.read('codeLines')).some((l) => l.slug === 'test-papierkorb')).toBe(false);

    await payload.update({ collection: 'produkte', id: doc.id, data: { deletedAt: null }, trash: true, context });
    expect((await adapter.read('codeLines')).some((l) => l.slug === 'test-papierkorb')).toBe(true);
  });

  it('behält die Kennung, auch wenn die Adresse geändert wird', async () => {
    const doc = await payload.create({
      collection: 'produkte',
      data: { ...basis, name: 'Kennung', slug: 'test-kennung', _status: 'published' },
      context,
    });
    const updated = await payload.update({ collection: 'produkte', id: doc.id, data: { slug: 'test-kennung-neu' }, context });
    expect(updated.kennung).toBe('test-kennung');
  });

  it('staffelt relativ zum aktuellen Preis', async () => {
    const doc = await payload.create({
      collection: 'produkte',
      data: { ...basis, name: 'Staffel', slug: 'test-staffel', staffeln: [{ abMenge: 5, rabattProzent: 10 }], _status: 'published' },
      context,
    });
    await payload.update({ collection: 'produkte', id: doc.id, data: { preis: 20 }, context });
    const line = (await adapter.read('codeLines')).find((l) => l.slug === 'test-staffel');
    expect(line?.bulkPrices).toEqual([{ minQty: 5, priceCents: 1800 }]);
  });
});

describe('Übernahme der Inhalte (Seed)', () => {
  it('legt endgültig gelöschte Inhalte beim nächsten Build nicht wieder an', async () => {
    await payload.delete({ collection: 'sperrtage', where: { id: { exists: true } }, trash: true, context });
    expect((await payload.count({ collection: 'sperrtage' })).totalDocs).toBe(0);
    await inhalteUebernehmen(payload);
    expect((await payload.count({ collection: 'sperrtage' })).totalDocs).toBe(0);
  });

  it('enthält die Beispielartikel — sichtbar, aber als Beispiel gekennzeichnet', async () => {
    const articles = await adapter.read('standardArticles');
    expect(articles.length).toBe(8);
    expect(articles.every((a) => a.example && a.seo.noindex)).toBe(true);
  });
});

describe('Prüfungen beim Speichern', () => {
  it('lehnt gefährliche oder fehlerhafte Prüfmuster ab', async () => {
    await expect(
      payload.create({
        collection: 'produkte',
        data: { ...basis, name: 'Muster', slug: 'test-muster', codeMuster: '^(a+)+$', codeBeispiel: 'aa' },
        context,
      }),
    ).rejects.toThrow(/Prüfmuster/);
  });

  it('lehnt einen Beispielcode ab, der nicht zum Muster passt', async () => {
    await expect(
      payload.create({
        collection: 'produkte',
        data: { ...basis, name: 'Beispiel', slug: 'test-beispiel', codeBeispiel: 'ABCD' },
        context,
      }),
    ).rejects.toThrow(/Beispielcode/);
  });

  it('lehnt Beträge mit mehr als zwei Nachkommastellen ab', async () => {
    await expect(
      payload.create({
        collection: 'produkte',
        data: { ...basis, name: 'Cent', slug: 'test-cent', preis: 1.234 },
        context,
      }),
    ).rejects.toThrow(/Preis/);
  });
});

describe('Zugriffsschutz', () => {
  it('ohne Anmeldung sind Artikel, Vorgänge und Einstellungen gesperrt', async () => {
    await expect(payload.find({ collection: 'produkte', overrideAccess: false })).rejects.toThrow();
    await expect(payload.find({ collection: 'vorgaenge', overrideAccess: false })).rejects.toThrow();
    await expect(payload.findGlobal({ slug: 'einstellungen', overrideAccess: false })).rejects.toThrow();
  });

  it('niemand legt Vorgänge über das Backend an — auch nicht das Team', async () => {
    const user = { id: 1, collection: 'benutzer', rollen: ['inhaber'], email: 'x@example.org' };
    await expect(
      payload.create({
        collection: 'vorgaenge',
        overrideAccess: false,
        user: user as never,
        data: {
          nummer: 'X-1',
          art: 'bestellung',
          bereich: 'schluessel-nach-code',
          prozess: 'direktkauf',
          status: 'neu',
          kontakt: { vorname: 'A', nachname: 'B', email: 'a@example.org', telefon: '1', land: 'DE' },
        },
      }),
    ).rejects.toThrow();
  });

  it('Mitarbeiter dürfen Artikel pflegen und in den Papierkorb legen, aber nicht endgültig löschen', async () => {
    const user = { id: 2, collection: 'benutzer', rollen: ['mitarbeiter'], email: 'm@example.org' };
    const doc = await payload.create({
      collection: 'produkte',
      data: { ...basis, name: 'Rechte', slug: 'test-rechte', _status: 'published' },
      overrideAccess: false,
      user: user as never,
      context,
    });
    await payload.update({
      collection: 'produkte',
      id: doc.id,
      data: { deletedAt: new Date().toISOString() },
      overrideAccess: false,
      user: user as never,
      context,
    });
    await expect(
      payload.delete({ collection: 'produkte', id: doc.id, trash: true, overrideAccess: false, user: user as never, context }),
    ).rejects.toThrow();
    const inhaber = { id: 1, collection: 'benutzer', rollen: ['inhaber'], email: 'i@example.org' };
    await payload.delete({ collection: 'produkte', id: doc.id, trash: true, overrideAccess: false, user: inhaber as never, context });
  });
});
