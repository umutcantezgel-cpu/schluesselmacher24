import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/* Seiten der Tutorials gegen content/tutorials.json (Notbetrieb ohne Datenbank, FA-INHALT-01):
 * Unveröffentlichte erzeugen keine Seite, keinen Sitemap-Eintrag und keinen Hinweis; Seiten ohne belegten
 * eigenen Inhalt stehen nicht in der Sitemap und tragen noindex. */

describe('Tutorial-Seiten', () => {
  beforeEach(() => {
    vi.stubEnv('SM24_DATA', 'json');
    vi.resetModules();
  });
  afterEach(() => vi.unstubAllEnvs());

  it('nur veröffentlichte Tutorials erzeugen eine Seite', async () => {
    const { generateStaticParams } = await import('./[slug]/page');
    const slugs = (await generateStaticParams()).map((p) => p.slug);
    expect(slugs).toContain('schluessel-richtig-fotografieren');
    expect(slugs).toContain('profilzylinder-messen');
    expect(slugs).not.toContain('angaben-im-fahrzeugschein');
    expect(slugs).not.toContain('gehaeuseumbau');
    expect(slugs).toHaveLength(8);
  }, 30_000); // ./[slug]/page lädt nach resetModules die Datenschicht samt Bausteinen kalt; im vollen Lauf dauert das länger als 5 s.

  it('ein unveröffentlichtes Tutorial ist nicht abrufbar und erscheint an keinem Ort', async () => {
    const { getTutorial, getTutorialsFuer } = await import('@/lib/data');
    expect(await getTutorial('gehaeuseumbau')).toBeNull();
    expect(await getTutorialsFuer('autoschluessel-gehaeuse')).toEqual([]);
    expect(await getTutorialsFuer('autoschluessel-fahrzeugschein')).toEqual([]);
    expect((await getTutorialsFuer('schluessel-nach-vorlage-fotos')).map((t) => t.id)).toEqual(['schluessel-richtig-fotografieren']);
  });

  it('Sitemap: ohne Eintrag in Menü oder Fuß keine Tutorials (Insel), mit Eintrag Übersicht und Seiten mit eigenem Inhalt', async () => {
    const tutorialPfade = async () => {
      const { default: sitemap } = await import('@/app/sitemap');
      return (await sitemap()).map((e) => new URL(e.url).pathname).filter((p) => p.startsWith('/tutorials'));
    };
    const { tutorialsVerlinkt } = await import('@/lib/tutorials/erreichbar');
    if (!tutorialsVerlinkt()) expect(await tutorialPfade()).toEqual([]);

    vi.resetModules();
    vi.doMock('@/lib/tutorials/erreichbar', () => ({ tutorialsVerlinkt: () => true }));
    try {
      expect(await tutorialPfade()).toEqual([
        '/tutorials',
        '/tutorials/schluessel-richtig-fotografieren',
        '/tutorials/autoschluessel-richtig-fotografieren',
        '/tutorials/so-funktioniert-schluessel-nach-code',
        '/tutorials/schluessel-richtig-einschicken',
        '/tutorials/not-und-gefahrenfunktion',
        '/tutorials/was-bedeutet-gleichschliessend',
      ]);
    } finally {
      vi.doUnmock('@/lib/tutorials/erreichbar');
    }
  }, 30_000);

  it('noindex für das Doppel zum Ratgeber, indexierbar mit eigenem Inhalt, Titel nur für Vorhandenes', async () => {
    const { generateMetadata } = await import('./[slug]/page');
    const params = (slug: string) => ({ params: Promise.resolve({ slug }) });
    const messen = await generateMetadata(params('profilzylinder-messen'));
    expect(messen.robots).toEqual({ index: false, follow: true });
    expect(messen.alternates?.canonical).toBe('/tutorials/profilzylinder-messen');
    const foto = await generateMetadata(params('schluessel-richtig-fotografieren'));
    expect(foto.robots).toBeUndefined();
    expect(foto.title).toBe('Schlüssel richtig fotografieren');
    expect((await generateMetadata(params('gehaeuseumbau'))).title).toBe('Tutorial nicht gefunden');
  }, 30_000);

  it('feste Adresse: Eigene Seiten aus dem Admin dürfen /tutorials nicht überdecken', async () => {
    const { VORHANDENE_ROUTEN, eigeneSeiteAdresse } = await import('@/payload/hooks/seiten-adresse-pruefung');
    expect(VORHANDENE_ROUTEN).toContain('tutorials');
    expect(eigeneSeiteAdresse(['tutorials'])).toBeNull();
  });
});
