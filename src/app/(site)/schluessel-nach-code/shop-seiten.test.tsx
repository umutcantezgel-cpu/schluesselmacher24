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
    // Ein Code, der zum Codeformat aller drei Linien passt.
    const html = renderToStaticMarkup(<ShopListe lines={lines} hersteller={STAMM} startSuche="0812" />);
    expect(html.match(/passt zum Codeformat<\/span>/g)).toHaveLength(3);
    expect(html.match(/>Nach Code bestellen</g)).toHaveLength(1);
    expect(html).toContain('href="/schluessel-nach-code/ms-01?code=0812"');
    expect(html).toContain('href="/service-und-termin/anfrage?thema=schluessel-nach-code&amp;code=0812&amp;schloss=');
    // Je Treffer mit Bestellweg ein Knopf: einer zum Warenkorb, einer zur Anfrage, keiner für „nicht lieferbar“.
    expect(html.match(/<span class="sr-only">: /g)).toHaveLength(2);
  });
});
