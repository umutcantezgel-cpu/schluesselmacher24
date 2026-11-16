import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CylinderCatalog } from '@/lib/types';

/* Rubrikseite (FA-SHOP-04, Nachbesserung): Ein Eintrag mit dem Haken „Preis nicht bestätigt“ nennt
 * keinen Betrag, sondern „Preis auf Anfrage“. Ohne Haken bleibt die Seite wie bisher. */

vi.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch: () => {}, push: () => {}, replace: () => {} }),
  usePathname: () => '/gleichschliessende-zylinder',
  useSearchParams: () => new URLSearchParams(),
}));

const zustand: { katalog: CylinderCatalog | null } = { katalog: null };

vi.mock('@/lib/data', async () => {
  const { defaults } = await import('@/lib/data/defaults');
  return {
    getRubrik: async () => null,
    getPageContent: async () => null,
    getCollection: async () => zustand.katalog,
    getCodeLines: async () => defaults.codeLines(),
    getHersteller: async () => defaults.hersteller(),
  };
});

const { default: Seite } = await import('./page');
const { cylinderCatalog } = await import('@/lib/data/defaults/cylinders');
const { formatCents } = await import('@/lib/format');

/** Text ohne Tags, damit Beträge unabhängig vom Markup gefunden werden. */
async function seitenText(): Promise<string> {
  return renderToStaticMarkup(await Seite()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
}

/** Betrag so, wie formatCents ihn ausgibt, mit normalem Leerzeichen. */
const euro = (cents: number) => formatCents(cents).replace(/\s/g, ' ');

describe('Rubrikseite Gleichschließende Zylinder: Sperre für unbestätigte Preise', () => {
  beforeEach(() => {
    zustand.katalog = cylinderCatalog();
  });

  it('nennt ohne Haken Grundpreis, Längenaufpreis und Schlüsselpreis wie bisher', async () => {
    const katalog = zustand.katalog!;
    const halb = katalog.forms.find((f) => f.id === 'halbzylinder')!;
    const text = await seitenText();
    expect(text).toContain(euro(halb.basePriceCents));
    expect(text).toContain(`jeder weitere kostet ${euro(katalog.keyPriceCents)}`);
    expect(text).not.toContain('Preis auf Anfrage');
    expect(text).toContain('bestellen direkt');
  });

  it('zeigt bei einer Bauform mit Haken keinen Betrag und keinen Längenaufpreis', async () => {
    const katalog = zustand.katalog!;
    // Eindeutiger Testbetrag, damit kein anderer Preis der Seite zufällig gleich lautet.
    const halb = katalog.forms.find((f) => f.id === 'halbzylinder')!;
    halb.basePriceCents = 98_765;
    halb.lengthSurchargeCents = 4_321;
    halb.priceUnconfirmed = true;
    const text = await seitenText();
    expect(text).toContain('Preis auf Anfrage');
    expect(text).not.toContain(euro(98_765));
    expect(text).not.toContain(euro(4_321));
    expect(text).toContain('Diese Bauform schicken Sie uns als Anfrage.');
    // Andere Bauformen bleiben bestellbar, der Kopf bleibt.
    expect(text).toContain('bestellen direkt');
  });

  it('zeigt bei Funktion, Option und Schlüsselpreis mit Haken keinen Betrag', async () => {
    const katalog = zustand.katalog!;
    const fn = katalog.functions.find((f) => f.active && f.surchargeCents > 0)!;
    fn.surchargeCents = 87_654;
    fn.priceUnconfirmed = true;
    const extra = katalog.extras.find((e) => e.active)!;
    extra.priceCents = 76_543;
    extra.priceUnconfirmed = true;
    katalog.keyPriceCents = 65_432;
    katalog.keyPriceUnconfirmed = true;
    const text = await seitenText();
    for (const betrag of [87_654, 76_543, 65_432]) expect(text).not.toContain(euro(betrag));
    expect(text).toContain('den Preis für jeden weiteren nennen wir auf Anfrage');
  });

  it('verspricht keinen Direktkauf, wenn keine Bauform bestellbar ist', async () => {
    for (const form of zustand.katalog!.forms) form.priceUnconfirmed = true;
    const text = await seitenText();
    expect(text).not.toContain('bestellen direkt');
    expect(text).toContain('bekommen ein Angebot');
  });
});
