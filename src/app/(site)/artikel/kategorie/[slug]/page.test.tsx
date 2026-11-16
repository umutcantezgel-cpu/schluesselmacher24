import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ShopKategorie, StandardArticle } from '@/lib/types';

/* Artikelliste je Kategorie (FA-10-10, FA-10-11): nur die Artikel der Kategorie samt Unterkategorien,
 * ohne Artikel noindex und Anfrage, die erste Artikel-Kategorie leitet auf /artikel. Erfundene Testdaten (G4). */

vi.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch: () => {}, push: () => {}, replace: () => {} }),
  usePathname: () => '/artikel/kategorie/test-technik',
  useSearchParams: () => new URLSearchParams(),
  notFound: () => {
    throw new Error('notFound');
  },
  permanentRedirect: (ziel: string) => {
    throw new Error(`redirect ${ziel}`);
  },
}));

const zustand: { artikel: StandardArticle[]; kategorien: ShopKategorie[] } = { artikel: [], kategorien: [] };

vi.mock('@/lib/data', () => ({
  getCollection: async () => zustand.artikel,
  getKategorien: async () => zustand.kategorien,
}));

const { defaults } = await import('@/lib/data/defaults');
const seite = await import('./page');

const ZUBEHOER = defaults.kategorien().find((k) => k.id === 'schliesstechnik-und-zubehoer')!;
const TECHNIK: ShopKategorie = {
  ...ZUBEHOER,
  id: 'test-technik',
  slug: 'test-technik',
  name: 'Test Technik',
  beschreibung: 'Erfundene Kategorie für den Test.',
  reihenfolge: 95,
  ziel: '',
  fruehereAdressen: ['test-alt'],
};
const UNTER: ShopKategorie = { ...TECHNIK, id: 'test-unter', slug: 'test-unter', name: 'Test Unter', eltern: 'test-technik', fruehereAdressen: [] };

function artikel(id: string, felder: Partial<StandardArticle> = {}): StandardArticle {
  return {
    id,
    slug: id,
    name: `Testartikel ${id}`,
    description: 'Erfundener Artikel für den Test.',
    manufacturer: '',
    priceCents: 1000,
    bulkPrices: [],
    maxQty: 5,
    image: { motif: 'Testartikel', ratio: '1/1' },
    gallery: [],
    tags: [],
    properties: [],
    scope: '',
    shippingClass: 'brief',
    example: false,
    seo: { title: '', description: '', internalLinks: [] },
    ...felder,
  } as unknown as StandardArticle;
}

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });
const html = async (slug: string) => renderToStaticMarkup(await seite.default(params(slug))).replace(/\s+/g, ' ');

describe('Artikelliste einer Kategorie', () => {
  beforeEach(() => {
    zustand.kategorien = [...defaults.kategorien(), TECHNIK, UNTER];
    zustand.artikel = [];
  });

  it('zeigt nur die Artikel der Kategorie und ihrer Unterkategorien, Brotkrumen über den Shop', async () => {
    zustand.artikel = [
      artikel('eigen', { categoryId: 'test-technik' }),
      artikel('unter', { categoryId: 'test-unter' }),
      artikel('zubehoer', { categoryId: 'schliesstechnik-und-zubehoer' }),
      artikel('ohne'),
    ];
    const text = await html('test-technik');
    expect(text).toContain('Testartikel eigen');
    expect(text).toContain('Testartikel unter');
    expect(text).not.toContain('Testartikel zubehoer');
    expect(text).not.toContain('Testartikel ohne');
    expect(text).toContain('href="/shop"');
    // Die Unterkategorie mit Artikeln ist verlinkt.
    expect(text).toContain('href="/artikel/kategorie/test-unter"');
    const meta = await seite.generateMetadata(params('test-technik'));
    expect(meta.robots).toBeUndefined();
    expect(meta.alternates?.canonical).toBe('/artikel/kategorie/test-technik');
    expect(String(meta.description).length).toBeLessThanOrEqual(160);
    expect(String(meta.description).length).toBeGreaterThanOrEqual(120);
    expect(await seite.generateStaticParams()).toEqual([{ slug: 'test-technik' }, { slug: 'test-unter' }]);
  });

  it('ohne Artikel: Hinweis, Anfrage mit dem Namen und noindex', async () => {
    const text = await html('test-technik');
    expect(text).toContain('Bitte fragen Sie bei uns an.');
    expect(text).toContain('artikel=Test%20Technik');
    expect((await seite.generateMetadata(params('test-technik'))).robots).toEqual({ index: false, follow: true });
    expect(await seite.generateStaticParams()).toEqual([]);
  });

  it('nur Beispiele: noindex', async () => {
    zustand.artikel = [artikel('muster', { categoryId: 'test-technik', example: true })];
    expect((await seite.generateMetadata(params('test-technik'))).robots).toEqual({ index: false, follow: true });
  });

  it('die erste Artikel-Kategorie leitet auf /artikel, frühere Adressen auf die neue, Unbekanntes auf 404', async () => {
    await expect(seite.default(params('schliesstechnik-und-zubehoer'))).rejects.toThrow('redirect /artikel');
    await expect(seite.default(params('test-alt'))).rejects.toThrow('redirect /artikel/kategorie/test-technik');
    await expect(seite.default(params('gibt-es-nicht'))).rejects.toThrow('notFound');
    // Kategorien anderer Art haben keine Artikelliste.
    await expect(seite.default(params('autoschluesselgehaeuse'))).rejects.toThrow('notFound');
  });
});
