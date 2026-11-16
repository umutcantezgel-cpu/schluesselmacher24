import { describe, expect, it, vi } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import { ANFRAGE_FORMULAR } from '@/lib/fahrzeuge/anfrage-klassen';
import type { CityPage, CodeLine, ShopHersteller, ShopKategorie, StandardArticle, VehicleMake } from '@/lib/types';
import codeLinesJson from '../../content/code-lines.json';
import vehiclesJson from '../../content/vehicles.json';

/* Die Sitemap meldet nur indexierbare Seiten: keine Seiten mit noindex und
 * keine Einsatzgebiete, die noch Platzhalter enthalten. */

const gebiete: { liste: CityPage[] } = { liste: [] };
const rubrikAus = new Set<string>();
const daten: {
  linien: CodeLine[];
  marken: VehicleMake[];
  artikel: StandardArticle[];
  seiten: Array<{ route: string; updatedAt?: string; seo: { noindex?: boolean } }>;
  kategorien: ShopKategorie[];
  hersteller: ShopHersteller[];
} = { linien: [], marken: [], artikel: [], seiten: [], kategorien: defaults.kategorien(), hersteller: [] };

vi.mock('@/lib/data', () => ({
  getVehicleMakes: async () => daten.marken,
  getCodeLines: async () => daten.linien,
  getCollection: async (name: string) => (name === 'standardArticles' ? daten.artikel : name === 'pages' ? daten.seiten : []),
  getServicePages: async () => [
    { ...defaults.servicePages()[0], slug: 'sichtbar', seo: { ...defaults.servicePages()[0].seo, noindex: false } },
    { ...defaults.servicePages()[0], slug: 'versteckt', seo: { ...defaults.servicePages()[0].seo, noindex: true } },
  ],
  getGuides: async () => [],
  getKategorien: async () => daten.kategorien,
  getHersteller: async () => daten.hersteller,
  getCities: async () => gebiete.liste,
  // Rubriken (FA-KERN-05): alle live, außer ein Test schaltet eine ab.
  getRubriken: async () => defaults.rubriken().map((r) => ({ ...r, status: rubrikAus.has(r.id) ? 'spaeter' : 'live' })),
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

  it('meldet Codelinien, Kategorien und Hersteller: ohne noindex, ohne Beispiele, ohne leere Seiten', async () => {
    // Die Musterdaten sind Beispiele (A-046); hier stehen sie für echte Linien. ms-03 bleibt Beispiel.
    const linien = (codeLinesJson as CodeLine[]).map((line) => ({
      ...line,
      example: line.id === 'ms-03',
      ...(line.id === 'ms-02' ? { seo: { ...line.seo, noindex: true } } : {}),
    }));
    daten.linien = linien;
    const urls = (await sitemap()).map((eintrag) => new URL(eintrag.url).pathname);
    expect(urls).toContain('/schluessel-nach-code/ms-01');
    expect(urls).not.toContain('/schluessel-nach-code/ms-02');
    expect(urls).not.toContain('/schluessel-nach-code/ms-03');
    expect(urls).toContain('/shop');
    // Ohne Unterkategorien und ohne gepflegte Hersteller keine Kategorie- und keine Herstellerseiten.
    expect(urls.some((url) => url.startsWith('/schluessel-nach-code/kategorie/'))).toBe(false);
    expect(urls.some((url) => url.startsWith('/schluessel-nach-code/hersteller/'))).toBe(false);

    // Erfundene Testdaten (G4): eine Unterkategorie mit Linie, eine leere, ein Hersteller mit und einer ohne Linie.
    const basis = defaults.kategorien();
    daten.kategorien = [
      ...basis,
      { ...basis[0], id: 'briefkasten', slug: 'briefkasten', name: 'Briefkasten', eltern: 'schluessel-nach-code', reihenfolge: 11 },
      { ...basis[0], id: 'leer', slug: 'leer', name: 'Leer', eltern: 'schluessel-nach-code', reihenfolge: 12 },
    ];
    daten.hersteller = [
      { id: 'testa', slug: 'testa', name: 'Testa', einsatz: '', angeboten: true, reihenfolge: 1 },
      { id: 'testb', slug: 'testb', name: 'Testb', einsatz: '', angeboten: true, reihenfolge: 2 },
    ];
    daten.linien = linien.map((line) =>
      line.id === 'zy-01' ? { ...line, manufacturerId: 'testa', categoryId: 'briefkasten' } : line.id === 'ms-03' ? { ...line, manufacturerId: 'testb' } : line,
    );
    const mitDaten = (await sitemap()).map((eintrag) => new URL(eintrag.url).pathname);
    expect(mitDaten).toContain('/schluessel-nach-code/hersteller/testa');
    expect(mitDaten).toContain('/schluessel-nach-code/kategorie/briefkasten');
    // Leere Kategorie und Hersteller, dessen einzige Linie ein Beispiel ist: keine Seite in der Sitemap.
    expect(mitDaten).not.toContain('/schluessel-nach-code/kategorie/leer');
    expect(mitDaten).not.toContain('/schluessel-nach-code/hersteller/testb');
    daten.linien = [];
    daten.kategorien = defaults.kategorien();
    daten.hersteller = [];
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

  it('führt Customizing immer und die Liste der Gehäuse und Ersatzteile nur mit echten Teilen (FA-SHOP-02B)', async () => {
    const pfade = async () => (await sitemap()).map((e) => new URL(e.url).pathname);
    daten.artikel = [];
    expect(await pfade()).toContain('/autoschluessel/customizing');
    expect(await pfade()).not.toContain('/autoschluessel/gehaeuse/teile');
    // Erfundene Testdaten (G4): ein Beispielartikel mit Fahrzeugbezug zählt nicht, ein echtes Teil schon.
    const basis = defaults.standardArticles()[0];
    const teil = {
      ...basis,
      fahrzeugteil: { teileart: 'batterie' as const, bauformen: [], reihen: [], schluesselarten: [], kompatibilitaet: 'Test', elektronik: 'ja' as const },
    };
    daten.artikel = [{ ...teil, example: true }];
    expect(await pfade()).not.toContain('/autoschluessel/gehaeuse/teile');
    daten.artikel = [{ ...teil, example: false, seo: { ...basis.seo, noindex: false } }];
    expect(await pfade()).toContain('/autoschluessel/gehaeuse/teile');
    daten.artikel = [];
  });

  it('meldet die Hauptseite und die vier Seiten zur Partnergewinnung', async () => {
    const urls = (await sitemap()).map((eintrag) => new URL(eintrag.url).pathname);
    for (const pfad of [
      '/partner-werden',
      '/partner-werden/auftraege-erhalten',
      '/partner-werden/netzwerk-deutschland',
      '/partner-werden/kfz-betriebe',
      '/partner-werden/kooperation',
    ]) {
      expect(urls).toContain(pfad);
    }
  });

  it('führt die Seiten der neuen Fahrzeugklassen erst, wenn ihr Schalter an ist (FA-KERN-02B, FA-SOFORT-05)', async () => {
    // Freigegeben in FA-SOFORT-05: Roller und Fahrrad. Noch nicht: E-Scooter, Seniorenmobil, „nicht gefunden“.
    const frei = ['/roller-und-kleinstfahrzeuge', '/roller-und-kleinstfahrzeuge/anfrage', '/fahrradschluessel', '/fahrradschluessel/anfrage'];
    const gesperrt = ['/e-scooter', '/e-scooter/anfrage', '/seniorenmobile', '/seniorenmobile/anfrage', '/autoschluessel/fahrzeug-nicht-gefunden'];
    const pfade = async () => (await sitemap()).map((eintrag) => new URL(eintrag.url).pathname);
    let urls = await pfade();
    for (const pfad of frei) expect(urls.filter((u) => u === pfad), pfad).toHaveLength(1);
    for (const pfad of gesperrt) expect(urls, pfad).not.toContain(pfad);
    // Das Motorrad ist freigegeben und steht genau einmal da.
    expect(urls.filter((u) => u === '/motorradschluessel')).toHaveLength(1);
    expect(urls.filter((u) => u === '/motorradschluessel/anfrage')).toHaveLength(1);

    const roller = ANFRAGE_FORMULAR.roller as { indexierbar: boolean };
    const scooter = ANFRAGE_FORMULAR['e-scooter'] as { indexierbar: boolean };
    roller.indexierbar = false;
    scooter.indexierbar = true;
    try {
      urls = await pfade();
      expect(urls).not.toContain('/roller-und-kleinstfahrzeuge');
      expect(urls).not.toContain('/roller-und-kleinstfahrzeuge/anfrage');
      expect(urls).toContain('/e-scooter');
      expect(urls).toContain('/e-scooter/anfrage');
      expect(urls).not.toContain('/seniorenmobile');
    } finally {
      roller.indexierbar = true;
      scooter.indexierbar = false;
    }

    // Auch das Motorrad folgt seinem Schalter: aus, dann fehlen beide festen Seiten.
    const motorrad = ANFRAGE_FORMULAR.motorrad as { indexierbar: boolean };
    motorrad.indexierbar = false;
    try {
      urls = await pfade();
      expect(urls).not.toContain('/motorradschluessel');
      expect(urls).not.toContain('/motorradschluessel/anfrage');
    } finally {
      motorrad.indexierbar = true;
    }
  });

  it('führt eigene Inhaltsseiten des Betreibers nur ohne noindex (FA-KERN-05)', async () => {
    // Erfundene Adressen (G4): eine freigegebene, eine auf noindex, eine vorhandene Route, die keine eigene Seite ist.
    daten.seiten = [
      { route: 'werkstatt-rundgang', updatedAt: '2026-11-01T10:00:00.000Z', seo: { noindex: false } },
      { route: 'entwurf-seite', seo: { noindex: true } },
      { route: 'schliessanlagen', seo: { noindex: false } },
    ];
    try {
      const pfade = (await sitemap()).map((e) => new URL(e.url).pathname);
      expect(pfade).toContain('/werkstatt-rundgang');
      expect(pfade).not.toContain('/entwurf-seite');
      // Die eingebaute Seite steht genau einmal da, nicht zusätzlich als eigene Seite.
      expect(pfade.filter((pfad) => pfad === '/schliessanlagen')).toHaveLength(1);
    } finally {
      daten.seiten = [];
    }
  });

  it('lässt Seiten einer Klasse weg, deren Rubrik nicht live ist (FA-KERN-05)', async () => {
    const pfade = async () => (await sitemap()).map((eintrag) => new URL(eintrag.url).pathname);
    rubrikAus.add('motorradschluessel');
    rubrikAus.add('fahrradschluessel');
    try {
      const urls = await pfade();
      for (const pfad of ['/motorradschluessel', '/motorradschluessel/anfrage', '/fahrradschluessel', '/fahrradschluessel/anfrage']) {
        expect(urls, pfad).not.toContain(pfad);
      }
      // Die anderen freigegebenen Klassen bleiben.
      expect(urls).toContain('/roller-und-kleinstfahrzeuge');
    } finally {
      rubrikAus.clear();
    }
    expect(await pfade()).toContain('/fahrradschluessel');
  });
});
