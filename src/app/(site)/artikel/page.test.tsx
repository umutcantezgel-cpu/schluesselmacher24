import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { StandardArticle, Verfuegbarkeit } from '@/lib/types';

/* Artikelübersicht (FA-INHALT-03I, L-17): Direktkauf in Kopfzeile, Unterzeile und Abschnitt nur mit
 * mindestens einem bestellbaren Artikel (kein Beispiel, lieferbar). Erfundene Testdaten (G4). */

vi.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch: () => {}, push: () => {}, replace: () => {} }),
  usePathname: () => '/artikel',
  useSearchParams: () => new URLSearchParams(),
}));

const zustand: { artikel: StandardArticle[] } = { artikel: [] };

vi.mock('@/lib/data', () => ({
  getPageContent: async () => null,
  getCollection: async () => zustand.artikel,
  getKategorien: async () => (await import('@/lib/data/defaults')).defaults.kategorien(),
}));

const { default: Seite } = await import('./page');

function artikel(
  id: string,
  felder: { availability?: Verfuegbarkeit; example?: boolean; categoryId?: string; fahrzeugteil?: unknown } = {},
): StandardArticle {
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

async function seite(): Promise<string> {
  return renderToStaticMarkup(await Seite()).replace(/\s+/g, ' ');
}

const DIREKT = 'Artikel rund um Schlüssel, Schloss und Tür zum direkten Bestellen.';
const ANFRAGE = 'Artikel rund um Schlüssel, Schloss und Tür. Zurzeit fragen Sie Artikel bei uns an.';

describe('Artikelübersicht', () => {
  beforeEach(() => {
    zustand.artikel = [];
  });

  it('mit einem bestellbaren Artikel: Direktkauf', async () => {
    zustand.artikel = [artikel('a', { availability: 'nicht-lieferbar' }), artikel('b')];
    const html = await seite();
    expect(html).toContain('Direkt kaufen');
    expect(html).toContain(DIREKT);
    expect(html).toContain('wählen die Stückzahl');
  });

  it('nur Beispiele, nur „auf Anfrage“ oder „nicht lieferbar“: Kopf „Auf Anfrage“, ohne Stückzahl', async () => {
    const faelle = [
      [artikel('a', { example: true }), artikel('b', { example: true })],
      [artikel('a', { availability: 'auf-anfrage' }), artikel('b', { availability: 'nicht-lieferbar' })],
      [artikel('a', { availability: 'lieferbar', example: true }), artikel('b', { availability: 'auf-anfrage' })],
    ];
    for (const [i, fall] of faelle.entries()) {
      zustand.artikel = fall;
      const html = await seite();
      expect(html, String(i)).toContain('Auf Anfrage');
      expect(html, String(i)).toContain(ANFRAGE);
      expect(html, String(i)).toContain('Öffnen Sie einen Artikel. Dort finden Sie Eigenschaften und Lieferumfang.');
      expect(html, String(i)).not.toContain(DIREKT);
      expect(html, String(i)).not.toContain('wählen die Stückzahl');
      expect(html, String(i)).not.toContain('Direkt kaufen');
      // Kein Sackgassen-Kopf: der Weg zur Anfrage steht auf der Seite.
      expect(html, String(i)).toContain('Artikel anfragen');
      expect(html, String(i)).toMatch(/href="[^"]*artikel=Schlie%C3%9Ftechnik/);
    }
  });

  it('Suchbeschreibung: Direktkauf nur mit bestellbarem Artikel, sonst Anfrage-Fassung in geprüfter Länge', async () => {
    const { generateMetadata } = await import('./page');
    zustand.artikel = [artikel('a', { availability: 'nicht-lieferbar' }), artikel('b')];
    expect(String((await generateMetadata()).description)).toContain('direkt bestellen');
    for (const fall of [[], [artikel('a', { example: true })], [artikel('a', { availability: 'nicht-lieferbar' })]]) {
      zustand.artikel = fall;
      const beschreibung = String((await generateMetadata()).description);
      expect(beschreibung).toContain('Zurzeit fragen Sie Artikel bei uns an.');
      expect(beschreibung).not.toMatch(/bestellen|Staffelpreis/);
      expect([...beschreibung].length).toBeGreaterThanOrEqual(120);
      expect([...beschreibung].length).toBeLessThanOrEqual(160);
    }
  });

  it('mit bestellbarem Artikel: kein zusätzlicher Anfrage-Knopf über der Liste', async () => {
    zustand.artikel = [artikel('b')];
    const html = await seite();
    expect(html).not.toContain('Artikel anfragen');
  });

  it('ohne Artikel: dieselbe Anfrage-Fassung im Kopf', async () => {
    const html = await seite();
    expect(html).toContain('Auf Anfrage');
    expect(html).toContain(ANFRAGE);
  });

  it('zeigt nur Artikel ihrer Kategorie und ohne Kategorie, keine Gehäuseteile (FA-10-10)', async () => {
    zustand.artikel = [
      artikel('ohne'),
      artikel('zubehoer', { categoryId: 'schliesstechnik-und-zubehoer' }),
      artikel('teil', { fahrzeugteil: { teileart: 'gehaeuse' } }),
      artikel('fremd', { categoryId: 'autoschluesselgehaeuse' }),
    ];
    const html = await seite();
    expect(html).toContain('Testartikel ohne');
    expect(html).toContain('Testartikel zubehoer');
    expect(html).not.toContain('Testartikel teil');
    expect(html).not.toContain('Testartikel fremd');
  });

  it('nur Gehäuseteile: Leerzustand mit Anfrage, keine Suchmaschinen', async () => {
    const { generateMetadata } = await import('./page');
    zustand.artikel = [artikel('teil', { fahrzeugteil: { teileart: 'gehaeuse' } })];
    expect(await seite()).toContain('Hier gibt es gerade keine Artikel.');
    expect((await generateMetadata()).robots).toEqual({ index: false, follow: true });
  });
});
