import { describe, expect, it, vi } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import type { CityPage, CodeLine, StandardArticle, VehicleMake } from '@/lib/types';
import codeLinesJson from '../../content/code-lines.json';
import vehiclesJson from '../../content/vehicles.json';

/* Die Sitemap meldet nur indexierbare Seiten: keine Seiten mit noindex und
 * keine Einsatzgebiete, die noch Platzhalter enthalten. */

const gebiete: { liste: CityPage[] } = { liste: [] };
const daten: { linien: CodeLine[]; marken: VehicleMake[]; artikel: StandardArticle[] } = { linien: [], marken: [], artikel: [] };

vi.mock('@/lib/data', () => ({
  getVehicleMakes: async () => daten.marken,
  getCodeLines: async () => daten.linien,
  getCollection: async (name: string) => (name === 'standardArticles' ? daten.artikel : []),
  getServicePages: async () => [
    { ...defaults.servicePages()[0], slug: 'sichtbar', seo: { ...defaults.servicePages()[0].seo, noindex: false } },
    { ...defaults.servicePages()[0], slug: 'versteckt', seo: { ...defaults.servicePages()[0].seo, noindex: true } },
  ],
  getGuides: async () => [],
  getCities: async () => gebiete.liste,
}));

const { default: sitemap } = await import('./sitemap');

function stadt(slug: string, intro: string): CityPage {
  return {
    id: slug,
    slug,
    city: slug,
    state: 'Hessen',
    localIntro: intro,
    localFacts: [{ label: 'Einsatzradius', value: '20 km' }],
    servicesOffered: ['autoschluessel'],
    onSiteRadiusKm: 20,
    seo: { title: `Schlüsseldienst in ${slug}`, description: 'Vor Ort und in der Werkstatt.', internalLinks: [] },
    updatedAt: '2026-09-15T00:00:00.000Z',
  };
}

describe('Sitemap', () => {
  it('enthält keine Seiten mit noindex', async () => {
    gebiete.liste = [];
    const urls = (await sitemap()).map((eintrag) => new URL(eintrag.url).pathname);
    for (const pfad of [
      '/rechtliches/impressum',
      '/rechtliches/datenschutz',
      '/rechtliches/widerruf',
      '/rechtliches/agb',
      '/rechtliches/cookie-einstellungen',
      '/service-und-termin/terminstatus',
      '/kasse',
      '/warenkorb',
    ]) {
      expect(urls).not.toContain(pfad);
    }
    expect(urls).toContain('/rechtliches/versand-und-zahlung');
    expect(urls.some((url) => url.endsWith('/sichtbar'))).toBe(true);
    expect(urls.some((url) => url.endsWith('/versteckt'))).toBe(false);
  });

  it('nimmt Einsatzgebiete nur ohne Platzhalter auf, die Übersicht nur mit mindestens einem', async () => {
    gebiete.liste = [stadt('wetzlar', 'Werkstatt in der Altstadt.'), stadt('berlin', '[Platzhalter — örtlicher Text]')];
    const urls = (await sitemap()).map((eintrag) => new URL(eintrag.url).pathname);
    expect(urls).toContain('/standorte');
    expect(urls).toContain('/standorte/wetzlar');
    expect(urls).not.toContain('/standorte/berlin');

    gebiete.liste = [stadt('berlin', '[Platzhalter — örtlicher Text]')];
    const ohne = (await sitemap()).map((eintrag) => new URL(eintrag.url).pathname);
    expect(ohne).not.toContain('/standorte');
  });

  it('meldet Codelinien, Kategorien und Hersteller — ohne noindex, Hersteller erst wenn gepflegt', async () => {
    const linien = (codeLinesJson as CodeLine[]).map((line) =>
      line.id === 'ms-02' ? { ...line, seo: { ...line.seo, noindex: true } } : line,
    );
    daten.linien = linien;
    const urls = (await sitemap()).map((eintrag) => new URL(eintrag.url).pathname);
    expect(urls).toContain('/schluessel-nach-code/ms-01');
    expect(urls).not.toContain('/schluessel-nach-code/ms-02');
    expect(urls).toContain('/schluessel-nach-code/kategorie/moebel-und-bueroschloesser');
    expect(urls.filter((url) => url.startsWith('/schluessel-nach-code/kategorie/'))).toHaveLength(10);
    expect(urls.some((url) => url.startsWith('/schluessel-nach-code/hersteller/'))).toBe(false);

    daten.linien = linien.map((line) => (line.id === 'zy-01' ? { ...line, manufacturer: 'BKS' } : line));
    const mitHersteller = (await sitemap()).map((eintrag) => new URL(eintrag.url).pathname);
    expect(mitHersteller).toContain('/schluessel-nach-code/hersteller/bks');
    daten.linien = [];
  });

  it('beachtet noindex der Modelle und nimmt lastModified aus updatedAt', async () => {
    const [vw] = vehiclesJson as VehicleMake[];
    daten.marken = [
      {
        ...vw,
        updatedAt: '2026-10-20T08:00:00.000Z',
        models: vw.models.map((m, i) => (i === 0 ? { ...m, seo: { title: '', description: '', noindex: true } } : m)),
      },
    ];
    const eintraege = await sitemap();
    const urls = eintraege.map((eintrag) => new URL(eintrag.url).pathname);
    expect(urls).not.toContain(`/autoschluessel/marken/${vw.slug}/${vw.models[0].slug}`);
    expect(urls).toContain(`/autoschluessel/marken/${vw.slug}/${vw.models[1].slug}`);
    const marke = eintraege.find((e) => e.url.endsWith(`/autoschluessel/marken/${vw.slug}`));
    expect(marke?.lastModified).toEqual(new Date('2026-10-20T08:00:00.000Z'));
    daten.marken = [];
  });

  it('führt „Artikel“ nur mit echten, indexierbaren Artikeln', async () => {
    daten.artikel = defaults.standardArticles();
    expect(daten.artikel.every((a) => a.example)).toBe(true);
    expect((await sitemap()).some((e) => e.url.endsWith('/artikel'))).toBe(false);
    daten.artikel = [{ ...daten.artikel[0], example: false, seo: { ...daten.artikel[0].seo, noindex: false } }];
    expect((await sitemap()).some((e) => e.url.endsWith('/artikel'))).toBe(true);
    daten.artikel = [];
  });
});
