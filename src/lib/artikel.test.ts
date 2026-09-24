import { describe, expect, it } from 'vitest';

import {
  aktiveStufe,
  artikelPfad,
  filterArtikel,
  istIndexierbar,
  kurztext,
  preisAb,
  preisAbText,
  preisstufen,
  produktJsonLd,
  schlagworte,
  sortiereArtikel,
  staffelText,
  versandartenFuer,
} from './artikel';
import { standardArticles } from './data/defaults/standard-articles';
import { unitPriceForCodeLine } from './pricing';
import type { ShippingOption, StandardArticle } from './types';

const SITE = 'https://beispiel.test';

function artikel(overrides: Partial<StandardArticle> = {}): StandardArticle {
  return {
    id: 'schluesselkasten',
    slug: 'schluesselkasten',
    name: 'Schlüsselkasten',
    description: 'Wandkasten mit Haken für Büro und Werkstatt.',
    manufacturer: '',
    scope: '1 Kasten',
    properties: [],
    deliveryTime: '',
    priceCents: 4000,
    maxQty: 20,
    shippingClass: 'zubehoer',
    image: { motif: 'Produktfoto', ratio: '1/1' },
    gallery: [],
    tags: ['Aufbewahrung', 'Büro'],
    seo: { title: 'Schlüsselkasten', description: '', internalLinks: [] },
    example: false,
    ...overrides,
  };
}

/** Staffeln ab 5 und ab 10 Stück. */
const gestaffelt = artikel({
  bulkPrices: [
    { minQty: 10, priceCents: 3200 },
    { minQty: 5, priceCents: 3600 },
  ],
});

describe('Preisstufen', () => {
  it('beginnen beim Einzelpreis und sind aufsteigend sortiert', () => {
    expect(preisstufen(gestaffelt)).toEqual([
      { minQty: 1, priceCents: 4000 },
      { minQty: 5, priceCents: 3600 },
      { minQty: 10, priceCents: 3200 },
    ]);
  });

  it('nennen für jede Menge denselben Preis wie Warenkorb und Kasse', () => {
    const stufen = preisstufen(gestaffelt);
    for (let menge = 1; menge <= gestaffelt.maxQty; menge += 1) {
      expect(stufen[aktiveStufe(stufen, menge)].priceCents, `${menge} Stück`).toBe(
        unitPriceForCodeLine(gestaffelt, menge),
      );
    }
  });

  it('lassen Staffeln oberhalb der Höchstmenge weg', () => {
    const begrenzt = artikel({ maxQty: 8, bulkPrices: [{ minQty: 5, priceCents: 3600 }, { minQty: 10, priceCents: 3200 }] });
    expect(preisstufen(begrenzt).map((s) => s.minQty)).toEqual([1, 5]);
  });

  it('ohne Staffel gibt es nur den Einzelpreis', () => {
    expect(preisstufen(artikel())).toEqual([{ minQty: 1, priceCents: 4000 }]);
  });

  it('eine Staffel ab 1 Stück ersetzt den Einzelpreis wie beim Absenden', () => {
    const abEins = artikel({ bulkPrices: [{ minQty: 1, priceCents: 3900 }] });
    expect(preisstufen(abEins)).toEqual([{ minQty: 1, priceCents: 3900 }]);
  });

  it('aktive Stufe wechselt genau an der Schwelle', () => {
    const stufen = preisstufen(gestaffelt);
    expect(aktiveStufe(stufen, 1)).toBe(0);
    expect(aktiveStufe(stufen, 4)).toBe(0);
    expect(aktiveStufe(stufen, 5)).toBe(1);
    expect(aktiveStufe(stufen, 9)).toBe(1);
    expect(aktiveStufe(stufen, 10)).toBe(2);
  });
});

describe('Preis „ab“', () => {
  it('nennt den günstigsten Staffelpreis mit „ab“', () => {
    expect(preisAb(gestaffelt)).toEqual({ cents: 3200, einzelCents: 4000, ab: true, abMenge: 10 });
    expect(preisAbText(gestaffelt)).toBe('ab 32,00 €');
  });

  it('ohne Staffel steht der Einzelpreis ohne „ab“', () => {
    expect(preisAb(artikel())).toEqual({ cents: 4000, einzelCents: 4000, ab: false, abMenge: 1 });
    expect(preisAbText(artikel())).toBe('40,00 €');
  });

  it('eine nicht erreichbare Staffel wird nicht beworben', () => {
    const unerreichbar = artikel({ maxQty: 3, bulkPrices: [{ minQty: 5, priceCents: 1000 }] });
    expect(preisAb(unerreichbar)).toEqual({ cents: 4000, einzelCents: 4000, ab: false, abMenge: 1 });
  });
});

describe('Staffeltext', () => {
  it('beschreibt alle Stufen in einem Satz', () => {
    expect(staffelText(gestaffelt)).toBe(
      'Einzelpreis 40,00 € je Stück, ab 5 Stück 36,00 € je Stück, ab 10 Stück 32,00 € je Stück.',
    );
  });

  it('kennzeichnet Beispielpreise', () => {
    expect(staffelText(gestaffelt, true)).toMatch(/^Beispielpreise: Einzelpreis 40,00/);
  });

  it('ist leer ohne Staffel', () => {
    expect(staffelText(artikel())).toBeNull();
  });
});

describe('Kurztext', () => {
  it('lässt kurze Texte unverändert', () => {
    expect(kurztext('  Kurzer   Text. ')).toBe('Kurzer Text.');
  });

  it('kürzt an einer Wortgrenze und hängt Auslassungspunkte an', () => {
    const text = 'Wandkasten aus Stahlblech mit nummerierten Haken, hält Schlüssel geordnet und verschlossen.';
    const kurz = kurztext(text, 40);
    expect(kurz.length).toBeLessThanOrEqual(40);
    expect(kurz.endsWith('…')).toBe(true);
    expect(text.startsWith(kurz.slice(0, -1))).toBe(true);
    expect(kurz).not.toMatch(/[\s,]…$/);
  });
});

describe('Versandarten je Artikel', () => {
  const versand = [
    { id: 'brief', productClasses: ['code-schluessel', 'zubehoer'] },
    { id: 'paket', productClasses: ['code-schluessel', 'zylinder', 'zubehoer'] },
    { id: 'nur-zylinder', productClasses: ['zylinder'] },
  ] as ShippingOption[];

  it('nennt nur die Versandarten, die zur Versandklasse passen', () => {
    expect(versandartenFuer(artikel(), versand).map((v) => v.id)).toEqual(['brief', 'paket']);
    expect(versandartenFuer(artikel({ shippingClass: 'zylinder' }), versand).map((v) => v.id)).toEqual([
      'paket',
      'nur-zylinder',
    ]);
  });
});

describe('Übersicht', () => {
  const beispiel = artikel({ id: 'b', slug: 'b', name: 'Beispiel', example: true, tags: ['Pflege'] });
  const echt = artikel({ id: 'e', slug: 'e', name: 'Echter Kasten', tags: ['Aufbewahrung'] });
  const safe = artikel({
    id: 's',
    slug: 's',
    name: 'Schlüsselsafe',
    description: 'Wandtresor mit Zahlencode.',
    manufacturer: 'Werkstatt Nord',
    tags: ['Übergabe', 'Aufbewahrung'],
  });

  it('stellt echte Artikel vor Beispielartikel und behält sonst die Reihenfolge', () => {
    expect(sortiereArtikel([beispiel, echt, safe]).map((a) => a.id)).toEqual(['e', 's', 'b']);
  });

  it('sammelt Schlagworte alphabetisch ohne Doppelungen', () => {
    expect(schlagworte([beispiel, echt, safe, artikel({ tags: [' Pflege ', ''] })])).toEqual([
      'Aufbewahrung',
      'Pflege',
      'Übergabe',
    ]);
  });

  it('filtert nach Schlagworten — ein Treffer genügt', () => {
    const alle = [beispiel, echt, safe];
    expect(filterArtikel(alle, { schlagworte: ['Übergabe'] }).map((a) => a.id)).toEqual(['s']);
    expect(filterArtikel(alle, { schlagworte: ['Übergabe', 'Pflege'] }).map((a) => a.id)).toEqual(['b', 's']);
    expect(filterArtikel(alle, {}).length).toBe(3);
  });

  it('sucht in Name, Beschreibung, Hersteller und Schlagworten; alle Wörter müssen passen', () => {
    const alle = [beispiel, echt, safe];
    expect(filterArtikel(alle, { suche: 'ZAHLENCODE' }).map((a) => a.id)).toEqual(['s']);
    expect(filterArtikel(alle, { suche: 'werkstatt nord' }).map((a) => a.id)).toEqual(['s']);
    expect(filterArtikel(alle, { suche: 'tresor kasten' })).toEqual([]);
    expect(filterArtikel(alle, { suche: 'aufbewahrung', schlagworte: ['Übergabe'] }).map((a) => a.id)).toEqual(['s']);
  });
});

describe('Suchmaschinen', () => {
  it('Beispielartikel und Artikel mit noindex sind nicht indexierbar', () => {
    expect(istIndexierbar(artikel())).toBe(true);
    expect(istIndexierbar(artikel({ example: true }))).toBe(false);
    expect(istIndexierbar(artikel({ seo: { title: 'x', description: '', internalLinks: [], noindex: true } }))).toBe(false);
  });

  it('alle mitgelieferten Beispielartikel bleiben außen vor', () => {
    const beispiele = standardArticles();
    expect(beispiele.length).toBeGreaterThan(0);
    expect(beispiele.some(istIndexierbar)).toBe(false);
    expect(beispiele.map((a) => produktJsonLd(a, SITE))).toEqual(beispiele.map(() => null));
  });

  it('beschreibt einen echten Artikel als Produkt mit Angebot in Euro', () => {
    const graph = produktJsonLd(gestaffelt, SITE);
    expect(graph).toEqual({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Product',
          '@id': `${SITE}/artikel/schluesselkasten#product`,
          name: 'Schlüsselkasten',
          description: 'Wandkasten mit Haken für Büro und Werkstatt.',
          url: `${SITE}/artikel/schluesselkasten`,
          mainEntityOfPage: { '@id': `${SITE}/artikel/schluesselkasten#webpage` },
          offers: {
            '@type': 'Offer',
            price: '40.00',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: `${SITE}/artikel/schluesselkasten`,
            seller: { '@id': `${SITE}/#organization` },
          },
        },
      ],
    });
    // Keine erfundenen Bewertungen oder Marken.
    const json = JSON.stringify(graph);
    expect(json).not.toMatch(/aggregateRating|review|brand/i);
  });

  it('übernimmt gepflegten Hersteller und Bilder, aber keine Platzhalter', () => {
    const mitBild = artikel({
      manufacturer: 'Werkstatt Nord',
      image: { motif: 'Foto', ratio: '1/1', bild: { url: '/api/medien/file/kasten.jpg', alt: 'Kasten' } },
      gallery: [{ url: 'https://cdn.beispiel.test/detail.jpg', alt: 'Detail' }],
    });
    const produkt = produktJsonLd(mitBild, SITE)?.['@graph'][0] as Record<string, unknown>;
    expect(produkt.brand).toEqual({ '@type': 'Brand', name: 'Werkstatt Nord' });
    expect(produkt.image).toEqual([`${SITE}/api/medien/file/kasten.jpg`, 'https://cdn.beispiel.test/detail.jpg']);

    const platzhalter = produktJsonLd(artikel({ manufacturer: '[Hersteller eintragen]' }), SITE);
    expect(JSON.stringify(platzhalter)).not.toMatch(/brand/i);
  });

  it('bildet den Pfad der Detailseite', () => {
    expect(artikelPfad('schluesselkasten')).toBe('/artikel/schluesselkasten');
  });
});
