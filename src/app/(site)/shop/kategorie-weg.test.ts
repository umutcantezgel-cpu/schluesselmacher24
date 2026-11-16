import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import { HINWEIS_PRODUKTE_FOLGEN } from '@/lib/data/defaults/kategorien';
import {
  artikelDerKategorie,
  artikelKategorieKette,
  artikelListePfad,
  artikelListenKategorien,
  artikelUebersicht,
  artikelUnterkategorien,
  ersteArtikelKategorie,
  sichtbareKategorien,
} from '@/lib/data/shop';
import { titelPasst } from '@/lib/titelbreite';
import { BESCHREIBUNG_MAX, BESCHREIBUNG_MIN } from '@/lib/codelinie-texte';
import { vorbelegungAusAdresse } from '@/lib/wege/code-anfrage';

import { AUTOSCHLUESSEL_FRAGE_PFAD, SHOP_SEO, anzahlJeKategorie, kategorieWeg } from './kategorie-weg';

/* Shop-Einstieg nach Kategorien (FA-SHOP-01B, Punkt 1 und 4), mit dem Startbestand der Kategorien. */

const KATEGORIEN = defaults.kategorien();
const kategorie = (id: string) => KATEGORIEN.find((k) => k.id === id)!;

describe('Weg einer Shop-Kategorie', () => {
  it('zeigt die Hauptkategorien des Inhabers in seiner Reihenfolge, verborgene nicht', () => {
    const namen = sichtbareKategorien(KATEGORIEN).filter((k) => !k.eltern).map((k) => k.name);
    expect(namen).toEqual([
      'Schlüssel nach Code',
      'Schlüssel nach Vorlage',
      'Autoschlüssel als Produkte',
      'Autoschlüsselgehäuse',
      'Gehäuseumbau und Reparaturservice',
      'Customizing und Modifikation',
      'Gleichschließende Zylinder und Sperrschließungen',
      'Schließtechnik und Zubehör',
    ]);
  });

  it('ohne Produkte: ehrlicher Hinweis und die passende Anfrage', () => {
    expect(kategorieWeg(kategorie('schluessel-nach-code'), 0)).toEqual({
      href: '/service-und-termin/anfrage?thema=schluessel-nach-code',
      label: 'Code anfragen',
      hinweis: HINWEIS_PRODUKTE_FOLGEN,
    });
    expect(kategorieWeg(kategorie('schliesstechnik-und-zubehoer'), 0)).toMatchObject({
      href: '/service-und-termin/anfrage?artikel=Schlie%C3%9Ftechnik%20und%20Zubeh%C3%B6r',
      label: 'Artikel anfragen',
    });
  });

  it('mit Produkten: die Produktliste, ohne Hinweis', () => {
    expect(kategorieWeg(kategorie('schluessel-nach-code'), 3)).toEqual({ href: '/schluessel-nach-code', label: 'Zu den Produkten' });
    expect(kategorieWeg(kategorie('schliesstechnik-und-zubehoer'), 2)).toEqual({ href: '/artikel', label: 'Zu den Artikeln' });
    expect(kategorieWeg(kategorie('gleichschliessende-zylinder'), 0)).toEqual({
      href: '/gleichschliessende-zylinder/konfigurator',
      label: 'Zum Konfigurator',
    });
  });

  it('Autoschlüssel als Produkte, Gehäuseumbau und Customizing führen in einen Weg, der zum Anliegen passt', () => {
    const auto = kategorieWeg(kategorie('autoschluessel-produkte'), 0);
    expect(auto.href).toBe(`${AUTOSCHLUESSEL_FRAGE_PFAD}&artikel=Autoschl%C3%BCssel%20als%20Produkte`);
    expect(auto.hinweis).toBe(HINWEIS_PRODUKTE_FOLGEN);
    // Ziele aus den Daten (FA-SHOP-02B, Punkt 5): die Seiten und die Liste des Bereichs.
    expect(kategorieWeg(kategorie('customizing-und-modifikation'), 0)).toMatchObject({
      href: '/autoschluessel/customizing',
      label: 'Anfragen',
      hinweis: HINWEIS_PRODUKTE_FOLGEN,
    });
    expect(kategorieWeg(kategorie('gehaeuseumbau-und-reparaturservice'), 0)).toMatchObject({
      href: '/autoschluessel/gehaeuse',
      label: 'Anfragen',
    });
    // Ohne Sonderregel: Ein im Backend gepflegtes Ziel ohne Thema bleibt die allgemeine Anfrage mit dem Namen.
    expect(kategorieWeg({ ...kategorie('customizing-und-modifikation'), ziel: '/service-und-termin/anfrage' }, 0).href).toBe(
      '/service-und-termin/anfrage?artikel=Customizing%20und%20Modifikation',
    );
    // Die Anfrage übernimmt den Namen bereinigt, so wie er in der Adresse steht.
    const name = new URL(auto.href, 'https://x.test').searchParams.get('artikel');
    expect(vorbelegungAusAdresse(name, 80)).toBe('Autoschlüssel als Produkte');
  });

  it('mit Hinweis heißt der Knopf „Anfragen“, auch wenn das Ziel keine Anfrageseite ist', () => {
    expect(kategorieWeg(kategorie('autoschluesselgehaeuse'), 0)).toMatchObject({ href: '/autoschluessel/gehaeuse/teile', label: 'Anfragen' });
    expect(kategorieWeg({ ...kategorie('autoschluesselgehaeuse'), hinweis: '' }, 0).label).toBe('Ansehen');
  });

  it('Autoschlüsselgehäuse: mit bestellbaren Teilen kein Anfrage-Hinweis, der Knopf heißt „Ansehen“', () => {
    expect(kategorieWeg(kategorie('autoschluesselgehaeuse'), 2)).toEqual({ href: '/autoschluessel/gehaeuse/teile', label: 'Ansehen' });
    // Erfundene Testdaten (G4): bestellbare Teile zählen, Beispiele, nicht lieferbare und andere Artikel nicht.
    const alle = KATEGORIEN;
    const haupt = sichtbareKategorien(alle).filter((k) => !k.eltern);
    const zahl = (artikel: Parameters<typeof anzahlJeKategorie>[2]['artikel']) =>
      anzahlJeKategorie(alle, haupt, { codeprodukte: [], artikel }).get('autoschluesselgehaeuse');
    expect(zahl([{ fahrzeugteil: {} }, { fahrzeugteil: {}, example: true }, { fahrzeugteil: {}, availability: 'auf-anfrage' }, {}])).toBe(1);
    expect(zahl([{ fahrzeugteil: {}, example: true }])).toBe(0);
    expect(kategorieWeg(kategorie('autoschluesselgehaeuse'), zahl([{ fahrzeugteil: {}, example: true }])!)).toMatchObject({
      label: 'Anfragen',
      hinweis: HINWEIS_PRODUKTE_FOLGEN,
    });
  });

  it('zählt je Kategorie nur ihre eigenen Produkte, Unterkategorien eingeschlossen', () => {
    // Erfundene Testdaten (G4): eine zweite Artikel-Kategorie mit Unterkategorie.
    const zweite = { ...kategorie('schliesstechnik-und-zubehoer'), id: 'test-zweite', slug: 'test-zweite', name: 'Test Zweite', reihenfolge: 999 };
    const unter = { ...zweite, id: 'test-unter', slug: 'test-unter', name: 'Test Unter', eltern: 'test-zweite' };
    const alle = [...KATEGORIEN, zweite, unter];
    const haupt = sichtbareKategorien(alle).filter((k) => !k.eltern);
    const anzahlen = anzahlJeKategorie(alle, haupt, {
      codeprodukte: [{}, { categoryId: 'schluessel-nach-code' }],
      artikel: [{}, { categoryId: 'schliesstechnik-und-zubehoer' }, { categoryId: 'test-unter' }, { categoryId: 'test-unter' }],
    });
    expect(anzahlen.get('schluessel-nach-code')).toBe(2);
    // Ohne Kategorie zählt ein Artikel zur ersten Artikel-Kategorie.
    expect(anzahlen.get('schliesstechnik-und-zubehoer')).toBe(2);
    expect(anzahlen.get('test-zweite')).toBe(2);
    expect(anzahlen.get('autoschluesselgehaeuse')).toBe(0);
    // Leere zweite Kategorie: ehrlicher Zustand mit Anfrage statt „Zu den Artikeln“.
    const leer = anzahlJeKategorie(alle, haupt, { codeprodukte: [], artikel: [{ categoryId: 'schliesstechnik-und-zubehoer' }] });
    expect(leer.get('test-zweite')).toBe(0);
    expect(kategorieWeg(zweite, leer.get('test-zweite')!).label).toBe('Artikel anfragen');
  });

  it('Titel und Beschreibung der Übersicht in den Längen', () => {
    expect(titelPasst(SHOP_SEO.title)).toBe(true);
    expect(SHOP_SEO.description.length).toBeGreaterThanOrEqual(BESCHREIBUNG_MIN);
    expect(SHOP_SEO.description.length).toBeLessThanOrEqual(BESCHREIBUNG_MAX);
    expect(SHOP_SEO.description).not.toMatch(/[—–]/);
  });
});

describe('Artikel je Kategorie (FA-10-10, FA-10-11, FA-10-01)', () => {
  // Erfundene Testdaten (G4): eine Unterkategorie unter „Schließtechnik und Zubehör“, eine weitere Artikel-Hauptkategorie.
  const zubehoer = kategorie('schliesstechnik-und-zubehoer');
  const unter = { ...zubehoer, id: 'test-beschlaege', slug: 'test-beschlaege', name: 'Test Beschläge', eltern: zubehoer.id, ziel: '' };
  const weitere = { ...zubehoer, id: 'test-technik', slug: 'test-technik', name: 'Test Technik', reihenfolge: 95, ziel: '/artikel' };
  const alle = [...KATEGORIEN, unter, weitere];
  const haupt = sichtbareKategorien(alle).filter((k) => !k.eltern);
  const artikel = [
    { id: 'a', categoryId: undefined },
    { id: 'b', categoryId: 'schliesstechnik-und-zubehoer' },
    { id: 'c', categoryId: 'test-beschlaege' },
    { id: 'd', categoryId: 'test-technik' },
    { id: 'e', fahrzeugteil: {} },
    { id: 'f', categoryId: 'schliesstechnik-und-zubehoer', fahrzeugteil: {} },
    { id: 'g', categoryId: 'autoschluesselgehaeuse' },
  ];

  it('/artikel zeigt die erste Artikel-Kategorie mit Unterkategorien und Artikel ohne Kategorie, ohne Fahrzeugteile', () => {
    expect(ersteArtikelKategorie(alle)?.id).toBe('schliesstechnik-und-zubehoer');
    const liste = artikelDerKategorie(alle, artikel, 'schliesstechnik-und-zubehoer', true);
    expect(liste.map((a) => a.id)).toEqual(['a', 'b', 'c']);
    // Die Zahl im Shop stimmt mit der Liste überein.
    const anzahlen = anzahlJeKategorie(alle, haupt, { codeprodukte: [], artikel });
    expect(anzahlen.get('schliesstechnik-und-zubehoer')).toBe(liste.length);
    expect(anzahlen.get('test-technik')).toBe(artikelDerKategorie(alle, artikel, 'test-technik', false).length);
    expect(anzahlen.get('test-technik')).toBe(1);
  });

  it('im Startbestand: Zahl im Shop gleich Länge der Liste, Gehäuseteile zählen nicht zu Zubehör', () => {
    const start = sichtbareKategorien(KATEGORIEN).filter((k) => !k.eltern);
    const teile = [{ fahrzeugteil: {} }, { fahrzeugteil: {}, categoryId: 'autoschluesselgehaeuse' }, {}];
    expect(anzahlJeKategorie(KATEGORIEN, start, { codeprodukte: [], artikel: teile }).get('schliesstechnik-und-zubehoer')).toBe(
      artikelDerKategorie(KATEGORIEN, teile, 'schliesstechnik-und-zubehoer', true).length,
    );
    expect(artikelDerKategorie(KATEGORIEN, teile, 'schliesstechnik-und-zubehoer', true)).toHaveLength(1);
  });

  it('weitere Kategorien und Unterkategorien haben eine eigene Liste; die erste bleibt /artikel', () => {
    expect(artikelListenKategorien(alle).map((k) => k.id)).toEqual(['test-beschlaege', 'test-technik']);
    expect(artikelListePfad(zubehoer, 'schliesstechnik-und-zubehoer')).toBe('/artikel');
    expect(artikelListePfad(unter, 'schliesstechnik-und-zubehoer')).toBe('/artikel/kategorie/test-beschlaege');
    // Verborgene „Weitere Sicherheitstechnik“ (Art Anfrage) bekommt keine Liste.
    expect(artikelListenKategorien(KATEGORIEN)).toEqual([]);
  });

  it('der Weg einer weiteren Artikel-Kategorie mit Ziel /artikel oder leer führt auf ihre eigene Liste', () => {
    expect(kategorieWeg(weitere, 1, false)).toEqual({ href: '/artikel/kategorie/test-technik', label: 'Zu den Artikeln' });
    expect(kategorieWeg({ ...weitere, ziel: '' }, 1, false).href).toBe('/artikel/kategorie/test-technik');
    // Ein eigenes Ziel bleibt; die erste Kategorie bleibt bei /artikel.
    expect(kategorieWeg({ ...weitere, ziel: '/sicherheitstechnik' }, 1, false).href).toBe('/sicherheitstechnik');
    expect(kategorieWeg(zubehoer, 1, true).href).toBe('/artikel');
    // Ohne Artikel: Anfrage mit dem Namen, wie bisher.
    expect(kategorieWeg(weitere, 0, false)).toMatchObject({ label: 'Artikel anfragen', href: '/service-und-termin/anfrage?artikel=Test%20Technik' });
  });

  it('die Liste der Hauptkategorie verlinkt Unterkategorien mit Artikeln', () => {
    expect(artikelUnterkategorien(alle, zubehoer.id, artikel)).toEqual([
      { kategorie: unter, href: '/artikel/kategorie/test-beschlaege', anzahl: 1 },
    ]);
    expect(artikelUnterkategorien(alle, zubehoer.id, [{ categoryId: 'test-beschlaege', fahrzeugteil: {} }])).toEqual([]);
  });

  it('ein Artikel mit Verweis auf eine gelöschte Kategorie zählt wie ohne Kategorie, in Liste und Zahl', () => {
    const verwaist = [...artikel, { id: 'h', categoryId: 'test-geloescht' }];
    const liste = artikelDerKategorie(alle, verwaist, 'schliesstechnik-und-zubehoer', true);
    expect(liste.map((a) => a.id)).toEqual(['a', 'b', 'c', 'h']);
    expect(artikelDerKategorie(alle, verwaist, 'test-technik', false).map((a) => a.id)).toEqual(['d']);
    expect(anzahlJeKategorie(alle, haupt, { codeprodukte: [], artikel: verwaist }).get('schliesstechnik-und-zubehoer')).toBe(liste.length);
  });

  it('Übersicht auf der Seite eines Artikels: die Liste, in der er steht', () => {
    expect(artikelUebersicht(alle, { categoryId: 'test-beschlaege' }, '/teile')).toEqual({
      href: '/artikel/kategorie/test-beschlaege',
      label: 'Mehr aus Test Beschläge',
    });
    expect(artikelUebersicht(alle, { categoryId: 'schliesstechnik-und-zubehoer' }, '/teile')).toEqual({
      href: '/artikel',
      label: `Mehr aus ${zubehoer.name}`,
    });
    expect(artikelUebersicht(alle, { categoryId: 'test-technik' }, '/teile').href).toBe('/artikel/kategorie/test-technik');
    expect(artikelUebersicht(alle, { fahrzeugteil: {} }, '/teile')).toEqual({ href: '/teile', label: 'Alle Gehäuse und Ersatzteile' });
    expect(artikelUebersicht(alle, {}, '/teile')).toEqual({ href: '/artikel', label: 'Zur Artikelliste' });
    expect(artikelUebersicht(alle, { categoryId: 'test-geloescht' }, '/teile').href).toBe('/artikel');
    // In keiner Artikelliste (fremde Kategorie): kein Fehlweg nach /artikel, sondern der Shop.
    expect(artikelUebersicht(alle, { categoryId: 'autoschluesselgehaeuse' }, '/teile')).toEqual({ href: '/shop', label: 'Alle Shop-Kategorien' });
  });

  it('Brotkrumen eines Artikels: Kette der sichtbaren Artikel-Kategorien, sonst leer', () => {
    expect(artikelKategorieKette(alle, 'test-beschlaege').map((k) => k.id)).toEqual(['schliesstechnik-und-zubehoer', 'test-beschlaege']);
    expect(artikelKategorieKette(alle, undefined)).toEqual([]);
    expect(artikelKategorieKette(alle, 'autoschluesselgehaeuse')).toEqual([]);
    expect(artikelKategorieKette([...alle, { ...unter, id: 'test-verborgen', sichtbar: false }], 'test-verborgen')).toEqual([]);
  });
});

describe('Beschreibungen der Kategorien (FA-INHALT-03I, L-34)', () => {
  it('wiederholen nicht nur den Namen und versprechen ohne Produkte keine Bestellung', () => {
    for (const k of KATEGORIEN) {
      const name = k.name.toLowerCase();
      const beschreibung = k.beschreibung.toLowerCase().replace(/[.,]/g, '');
      expect(beschreibung, k.id).not.toContain(name);
      expect(k.beschreibung, k.id).not.toMatch(/Sie bestellen|geeignete/);
    }
  });
});
