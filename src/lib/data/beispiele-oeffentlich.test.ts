import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import codeLinesJson from '../../../content/code-lines.json';
import type { CodeLine } from '@/lib/types';

/* Beispiel-Einträge auf der öffentlichen Seite (A-046): Ohne SM24_BEISPIELE=1 kennt die
 * Datenschicht keine Beispiel-Codelinien und keine Beispielartikel. Geprüft über die echte
 * Datenschicht im Dateimodus (content/*.json), so wie Seiten, Sitemap und Kasse sie lesen. */

vi.stubEnv('SM24_DATA', 'json');
vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': '203.0.113.9' }),
}));
// Der Datenbank-Adapter bleibt im Dateimodus ungenutzt; ohne ihn lädt die Datenschicht keine Payload-Konfiguration.
vi.mock('./payload-adapter', () => ({
  PayloadAdapter: class {},
  payloadInstanz: async () => {
    throw new Error('Keine Datenbank in diesem Test.');
  },
}));

const daten = await import('./index');
const { default: sitemap } = await import('@/app/sitemap');
const { submitOrder } = await import('@/lib/actions/orders');
const { startSignieren } = await import('@/lib/server/formular-schutz');
const { resetRateLimits } = await import('@/lib/server/rate-limit');

const MUSTER = codeLinesJson as CodeLine[];

beforeEach(() => {
  vi.stubEnv('SM24_BEISPIELE', '');
  resetRateLimits();
});
afterEach(() => {
  vi.stubEnv('SM24_BEISPIELE', '1');
});

describe('Beispiel-Einträge ohne SM24_BEISPIELE', () => {
  it('die Muster-Codelinien sind alle als Beispiel gekennzeichnet', () => {
    expect(MUSTER).toHaveLength(52);
    expect(MUSTER.every((line) => line.example === true)).toBe(true);
  });

  it('erscheinen in keiner Liste: Codelinien, auch inaktive, und Standardartikel', async () => {
    expect(await daten.getCodeLines()).toEqual([]);
    expect(await daten.getCodeLines(false)).toEqual([]);
    expect(await daten.getCollection('codeLines')).toEqual([]);
    expect(await daten.getCollection('standardArticles')).toEqual([]);
    expect(await daten.getCodeLine('ms-01')).toBeNull();
  });

  it('erscheinen mit SM24_BEISPIELE=1 wieder (nur Tests und lokale Entwicklung)', async () => {
    vi.stubEnv('SM24_BEISPIELE', '1');
    expect(await daten.getCodeLines()).toHaveLength(52);
    expect((await daten.getCollection('standardArticles')).length).toBeGreaterThan(0);
    // Jeder andere Wert gilt als aus.
    vi.stubEnv('SM24_BEISPIELE', 'true');
    expect(await daten.getCodeLines()).toEqual([]);
  });

  it('stehen nicht in der Sitemap, auch keine Kategorien, Hersteller oder Artikel', async () => {
    const pfade = (await sitemap()).map((eintrag) => new URL(eintrag.url).pathname);
    expect(pfade).toContain('/schluessel-nach-code');
    expect(pfade.filter((pfad) => pfad.startsWith('/schluessel-nach-code/'))).toEqual([]);
    expect(pfade.filter((pfad) => pfad === '/artikel' || pfad.startsWith('/artikel/'))).toEqual([]);
  });

  it('sind nicht bestellbar, auch wenn der Browser sie in den Warenkorb legt', async () => {
    const [settings, line] = [await daten.getSettings(), MUSTER[0]];
    const versand = settings.shipping.find((s) => s.productClasses.includes('code-schluessel'))!;
    const ergebnis = await submitOrder({
      schutz: { start: startSignieren(Date.now() - 10_000), website: '' },
      items: [{ kind: 'code-schluessel', uid: 'a', codeLineId: line.id, code: line.codeExample, qty: 1, unitPriceCents: 1, photoRefs: [] }],
      shippingOptionId: versand.id,
      contact: {
        firstName: 'Erika',
        lastName: 'Muster',
        email: 'erika@example.org',
        phone: '0301234567',
        street: 'Musterweg 1',
        postalCode: '35576',
        city: 'Wetzlar',
        country: 'Deutschland',
      },
      acceptedTerms: true,
      acceptedCustomMade: true,
      expectedTotalCents: line.priceCents + versand.priceCents,
    });
    expect(ergebnis.ok).toBe(false);
    expect(ergebnis.error).toContain('nicht mehr verfügbar');
  });

  it('haben keine Detailseiten: 404 und keine vorab erzeugten Adressen', async () => {
    const codeSeite = await import('@/app/(site)/schluessel-nach-code/[slug]/page');
    const kategorieSeite = await import('@/app/(site)/schluessel-nach-code/kategorie/[kategorie]/page');
    const artikelSeite = await import('@/app/(site)/artikel/[slug]/page');
    const artikel = (await import('@/lib/data/defaults')).defaults.standardArticles()[0];

    expect(await codeSeite.generateStaticParams()).toEqual([]);
    expect(await kategorieSeite.generateStaticParams()).toEqual([]);
    expect(await artikelSeite.generateStaticParams()).toEqual([]);

    const nichtGefunden = { digest: expect.stringContaining('404') };
    await expect(codeSeite.default({ params: Promise.resolve({ slug: 'ms-01' }) })).rejects.toMatchObject(nichtGefunden);
    // Frühere Familienadresse der Musterdaten: Seit FA-SHOP-01B kommen Kategorieseiten nur aus den
    // Shop-Kategorien, diese Adresse ist also unbekannt und führt auf 404. Dass Beispiellinien auf keiner
    // Kategorieseite erscheinen, belegen getCodeLines (oben: leer, auch inaktive) und die Sitemap.
    await expect(
      kategorieSeite.default({ params: Promise.resolve({ kategorie: 'moebel-und-bueroschloesser' }) }),
    ).rejects.toMatchObject(nichtGefunden);
    await expect(artikelSeite.default({ params: Promise.resolve({ slug: artikel.slug }) })).rejects.toMatchObject(nichtGefunden);
  });

  it('/schluessel-nach-code verspricht in Titel und Beschreibung keine Bestellung und kein Sortiment', async () => {
    const seite = await import('@/app/(site)/schluessel-nach-code/page');
    const ohne = await seite.generateMetadata();
    expect(ohne.title).toBe('Schlüssel nach Code anfragen');
    expect(ohne.description).toBe(
      'Nennen Sie uns den Code auf Ihrem Schloss oder Schlüssel. Wir prüfen, ob wir danach fertigen können, und melden uns. Ihr Originalschlüssel bleibt bei Ihnen.',
    );
    expect(`${String(ohne.title)} ${ohne.description}`).not.toMatch(/bestellen|Möbel|Briefkasten|Spind/);

    // Mit Codelinien gilt wieder der gepflegte Text.
    vi.stubEnv('SM24_BEISPIELE', '1');
    const mit = await seite.generateMetadata();
    expect(mit.title).not.toBe('Schlüssel nach Code anfragen');
  });
});
