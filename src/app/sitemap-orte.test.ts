import { describe, expect, it, vi } from 'vitest';

/*
 * Wetzlar bleibt indexierbar und in der Sitemap (FA-PLATTFORM-03B): mit den echten Inhalten (content/cities.json,
 * Einstellungen, Ortsstamm) über die echte Datenschicht im JSON-Modus, ohne Datenbank und ohne Partner.
 */

vi.stubEnv('SM24_DATA', 'json');

const { getCities, getCity } = await import('@/lib/data');
const { stadtIndexierbar } = await import('@/lib/rechtliches/indexierung');
const { default: sitemap } = await import('./sitemap');

describe('Wetzlar mit den echten Inhalten', () => {
  it('hängt am Ortsstamm, ist indexierbar und steht in der Sitemap', async () => {
    const wetzlar = await getCity('wetzlar');
    expect(wetzlar?.gemeindeschluessel).toBe('06532023');
    expect(wetzlar?.lage).toMatchObject({ werkstatt: 'ort', kreis: { name: 'Lahn-Dill-Kreis' }, land: 'Hessen', gruende: [] });
    expect(stadtIndexierbar(wetzlar!)).toBe(true);

    const urls = (await sitemap()).map((eintrag) => new URL(eintrag.url).pathname);
    expect(urls).toContain('/standorte');
    expect(urls).toContain('/standorte/wetzlar');
  });

  it('die Sitemap nennt keine Gemeinde des Stamms ohne Ortsseite', async () => {
    const urls = (await sitemap()).map((eintrag) => new URL(eintrag.url).pathname).filter((url) => url.startsWith('/standorte/'));
    const seiten = (await getCities()).filter(stadtIndexierbar).map((ort) => `/standorte/${ort.slug}`);
    expect(urls).toEqual(seiten);
  });
});
