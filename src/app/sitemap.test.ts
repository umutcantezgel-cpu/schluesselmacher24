import { describe, expect, it, vi } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import type { CityPage } from '@/lib/types';

/* Die Sitemap meldet nur indexierbare Seiten: keine Seiten mit noindex und
 * keine Einsatzgebiete, die noch Platzhalter enthalten. */

const gebiete: { liste: CityPage[] } = { liste: [] };

vi.mock('@/lib/data', () => ({
  getVehicleMakes: async () => [],
  getCodeLines: async () => [],
  getCollection: async () => [],
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
    ...defaults.cities()[0],
    id: slug,
    slug,
    localIntro: intro,
    localFacts: [{ label: 'Einsatzradius', value: '20 km' }],
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
});
