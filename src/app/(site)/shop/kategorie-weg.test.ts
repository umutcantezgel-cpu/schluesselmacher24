import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import { HINWEIS_PRODUKTE_FOLGEN } from '@/lib/data/defaults/kategorien';
import { sichtbareKategorien } from '@/lib/data/shop';
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
