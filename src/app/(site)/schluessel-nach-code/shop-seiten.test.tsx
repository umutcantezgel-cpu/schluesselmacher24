import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import codeLinesJson from '../../../../content/code-lines.json';
import * as m from '@/lib/data/payload-mapping';
import type { CodeLine, ShopHersteller } from '@/lib/types';

/* Bausteine der Shopseiten (FA-SHOP-01B) mit erfundenen Testdaten (G4): Logo nur mit Freigabe (R12),
 * Liste nach Hersteller und System, „nicht lieferbar“ ohne Warenkorb, „auf Anfrage“ mit „Code anfragen“. */

vi.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch: () => {}, push: () => {}, replace: () => {} }),
  usePathname: () => '/schluessel-nach-code',
  useSearchParams: () => new URLSearchParams(),
}));

const { HerstellerMarke } = await import('./hersteller-marke');
const { ShopListe } = await import('./shop-liste');
const { LinienListe } = await import('./linien-liste');
const { VerfuegbarkeitHinweis } = await import('./verfuegbarkeit-hinweis');

const LINIEN = codeLinesJson as CodeLine[];
const linie = (id: string, felder: Partial<CodeLine> = {}): CodeLine => ({ ...LINIEN.find((l) => l.id === id)!, example: false, ...felder });
const STAMM: ShopHersteller[] = [
  { id: 'testwerk', slug: 'testwerk', name: 'Testwerk', einsatz: '', angeboten: true, reihenfolge: 10 },
  { id: 'musterbau', slug: 'musterbau', name: 'Musterbau', einsatz: '', angeboten: true, reihenfolge: 20 },
];

describe('Herstellerlogo nur mit Freigabe (R12)', () => {
  const daten = m.herstellerZuPayload({ id: 'testwerk', slug: 'testwerk', name: 'Testwerk', einsatz: 'Test', angeboten: true, reihenfolge: 10 });
  const logo = { id: 7, url: '/api/medien/file/testwerk.png', alt: '', width: 200, height: 100 };
  const seite = (freigabe: boolean) => m.herstellerZuSeite({ ...daten, id: 1, logo: { bild: logo, freigabe } } as never);

  it('ohne Freigabe steht der Name als Text, kein Bild', () => {
    const html = renderToStaticMarkup(<HerstellerMarke name="Testwerk" logo={seite(false).logo} />);
    expect(html).not.toContain('<img');
    expect(html).toContain('Testwerk');
  });

  it('mit Freigabe erscheint das Logo', () => {
    const html = renderToStaticMarkup(<HerstellerMarke name="Testwerk" logo={seite(true).logo} />);
    expect(html).toContain('<img');
    expect(html).toContain('alt="Logo Testwerk"');
  });
});

describe('Shop-Liste nach Hersteller und System', () => {
  const linien = [
    linie('ms-01', { manufacturerId: 'musterbau', system: 'M 2', codeRange: '1 bis 500', deliveryTime: '2 bis 4 Werktage' }),
    linie('ms-02', { manufacturerId: 'testwerk', system: 'T 1' }),
    linie('ms-03', { manufacturerId: 'testwerk', system: 'T 1', availability: 'nicht-lieferbar' }),
    linie('ms-04', { manufacturerId: 'testwerk', system: 'T 0', availability: 'auf-anfrage' }),
  ];

  it('zeigt Hersteller in der Reihenfolge der Stammliste, darunter die Systeme, mit Link zur Herstellerseite', () => {
    const html = renderToStaticMarkup(<ShopListe lines={linien} hersteller={STAMM} />);
    const testwerk = html.indexOf('href="/schluessel-nach-code/hersteller/testwerk"');
    const musterbau = html.indexOf('href="/schluessel-nach-code/hersteller/musterbau"');
    expect(testwerk).toBeGreaterThan(-1);
    expect(musterbau).toBeGreaterThan(testwerk);
    expect(html.indexOf('System T 0')).toBeGreaterThan(testwerk);
    expect(html.indexOf('System T 1')).toBeGreaterThan(html.indexOf('System T 0'));
    expect(html.indexOf('System M 2')).toBeGreaterThan(musterbau);
    // Codebereich und Lieferzeit stehen in der Zeile.
    expect(html).toContain('Codebereich 1 bis 500');
    expect(html).toContain('Lieferzeit 2 bis 4 Werktage');
  });

  it('nennt „Preis je Stück“ im Gruppenkopf nur, wenn ein Produkt der Gruppe einen Preis zeigt (R9)', () => {
    // Testwerk hat ein lieferbares Produkt, Musterbau hier nur eines auf Anfrage.
    const gemischt = [linien[1], linien[2], { ...linien[0], availability: 'auf-anfrage' as const }];
    const html = renderToStaticMarkup(<ShopListe lines={gemischt} hersteller={STAMM} />);
    const testwerk = html.indexOf('id="hersteller-testwerk"');
    const musterbau = html.indexOf('id="hersteller-musterbau"');
    expect(testwerk).toBeGreaterThan(-1);
    expect(musterbau).toBeGreaterThan(testwerk);
    expect(html.slice(testwerk, musterbau)).toContain('Preis je Stück');
    expect(html.slice(musterbau)).not.toContain('Preis je Stück');
  });

  it('zeigt bei „nicht lieferbar“ und „auf Anfrage“ die Verfügbarkeit statt eines Preises', () => {
    const html = renderToStaticMarkup(<LinienListe lines={[linien[2], linien[3]]} />);
    expect(html).toContain('Derzeit nicht lieferbar');
    expect(html).toContain('Auf Anfrage');
    expect(html).not.toMatch(/\d+,\d{2}\s?€/);
  });
});

describe('Bestellknöpfe der Codesuche', () => {
  it('„nicht lieferbar“ ohne Warenkorb, „auf Anfrage“ mit „Code anfragen“, lieferbar mit „Nach Code bestellen“', () => {
    const lines = [
      linie('ms-01', { manufacturerId: 'testwerk', system: 'A' }),
      linie('ms-02', { manufacturerId: 'testwerk', system: 'B', availability: 'nicht-lieferbar' }),
      linie('ms-03', { manufacturerId: 'testwerk', system: 'C', availability: 'auf-anfrage' }),
    ].map((l) => ({ ...l, codePattern: '^[0-9]{4}$' }));
    // Ein Code, der die richtige Form für alle drei Linien hat.
    const html = renderToStaticMarkup(<ShopListe lines={lines} hersteller={STAMM} startSuche="0812" />);
    // Plakette und Satz sagen, dass nur die Form stimmt, und nennen den Weg im Zweifel (FA-INHALT-03I, L-02).
    expect(html.match(/Code hat die richtige Form<\/span>/g)).toHaveLength(3);
    expect(html).not.toContain('Codeformat');
    expect(html).toContain('Das heißt noch nicht,');
    expect(html).toMatch(/Im Zweifel hilft <a [^>]*>Code anfragen<\/a>/);
    expect(html.match(/>Nach Code bestellen</g)).toHaveLength(1);
    expect(html).toContain('href="/schluessel-nach-code/ms-01?code=0812"');
    expect(html).toContain('href="/service-und-termin/anfrage?thema=schluessel-nach-code&amp;code=0812&amp;schloss=');
    // Je Treffer mit Bestellweg ein Knopf: einer zum Warenkorb, einer zur Anfrage, keiner für „nicht lieferbar“.
    expect(html.match(/<span class="sr-only">: /g)).toHaveLength(2);
  });
});

describe('Kasten statt Kaufbereich (FA-INHALT-03I, L-01, L-05)', () => {
  const wege = {
    anfrage: { href: '/service-und-termin/anfrage?thema=schluessel-nach-code', label: 'Code anfragen' },
    uebersicht: { href: '/schluessel-nach-code', label: 'Alle Schlüssel nach Code' },
  };
  const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

  it('„auf Anfrage“: was nicht geht, welcher Knopf und was dann kommt', () => {
    const html = renderToStaticMarkup(<VerfuegbarkeitHinweis verfuegbarkeit="auf-anfrage" was="Diesen Schlüssel" {...wege} />);
    expect(text(html)).toContain(
      'Diesen Schlüssel können Sie nicht in den Warenkorb legen. Über „Code anfragen“ prüfen wir Ihren Code und melden uns mit einem Angebot.',
    );
    expect(text(html)).not.toContain('nicht direkt');
    expect(html.match(/>Code anfragen</g)).toHaveLength(1);
  });

  it('„nicht lieferbar“: der Satz einmal, dazu Übersicht und Code-Anfrage als zweiter Weg', () => {
    const html = renderToStaticMarkup(<VerfuegbarkeitHinweis verfuegbarkeit="nicht-lieferbar" was="Diesen Schlüssel" {...wege} />);
    expect(text(html).split('Diesen Schlüssel können Sie zurzeit nicht bestellen.').length - 1).toBe(1);
    expect(html).toContain('href="/schluessel-nach-code"');
    expect(html).toContain('>Code anfragen<');
    expect(text(html)).not.toMatch(/gefertigt|fertigen/);
  });

  it('Artikel „nicht lieferbar“ bleibt beim Weg zur Übersicht', () => {
    const html = renderToStaticMarkup(
      <VerfuegbarkeitHinweis verfuegbarkeit="nicht-lieferbar" was="Diesen Artikel" anfrage={{ href: '/x', label: 'Artikel anfragen' }} uebersicht={{ href: '/artikel', label: 'Alle Artikel' }} />,
    );
    expect(text(html)).toContain('Diesen Artikel können Sie zurzeit nicht bestellen.');
    expect(html).not.toContain('Artikel anfragen');
  });
});

describe('Staffelhinweis in der Liste wie auf der Produktseite (FA-INHALT-03I, L-20)', () => {
  const basis = linie('ms-01', { priceCents: 800, maxQty: 10 });

  it('nennt die erste gültige, günstigere Stufe', () => {
    const html = renderToStaticMarkup(
      <LinienListe lines={[{ ...basis, bulkPrices: [{ minQty: 5, priceCents: 600 }, { minQty: 3, priceCents: 700 }] }]} />,
    );
    expect(html).toMatch(/Staffelpreis ab 3\s*Stück/);
  });

  it('ohne gültige Stufe kein Staffelhinweis', () => {
    for (const bulkPrices of [
      [{ minQty: 20, priceCents: 600 }], // über der Höchstmenge
      [{ minQty: 3, priceCents: 900 }], // nicht günstiger
      [{ minQty: 1, priceCents: 700 }], // ab 1 Stück ist keine Staffel
    ]) {
      const html = renderToStaticMarkup(<LinienListe lines={[{ ...basis, bulkPrices }]} />);
      expect(html, JSON.stringify(bulkPrices)).not.toContain('Staffelpreis');
    }
  });
});
