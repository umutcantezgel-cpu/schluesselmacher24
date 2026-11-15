import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { defaults } from './defaults';
import { HINWEIS_PRODUKTE_FOLGEN } from './defaults/kategorien';
import {
  angeboteneHersteller,
  fruehereAdressenNachAenderung,
  hauptkategorien,
  istBestellbar,
  kategorieAufloesen,
  kategorieKette,
  kategorieSichtbar,
  produkteDerKategorie,
  produkteDesHerstellers,
  sichtbareKategorien,
  unterkategorien,
  verfuegbarkeitVon,
} from './shop';
import type { ShopHersteller, ShopKategorie } from '@/lib/types';

function kategorie(id: string, extra: Partial<ShopKategorie> = {}): ShopKategorie {
  return {
    id,
    slug: id,
    name: id,
    beschreibung: '',
    reihenfolge: 100,
    art: 'anfrage',
    ziel: '/',
    sichtbar: true,
    fruehereAdressen: [],
    ...extra,
  };
}

describe('Verfügbarkeit (FA-22-10)', () => {
  it('gilt ohne Angabe als lieferbar und kennt nur die drei Werte', () => {
    expect(verfuegbarkeitVon({})).toBe('lieferbar');
    expect(verfuegbarkeitVon({ availability: null })).toBe('lieferbar');
    expect(verfuegbarkeitVon({ availability: 'auf-anfrage' })).toBe('auf-anfrage');
    expect(verfuegbarkeitVon({ availability: 'nicht-lieferbar' })).toBe('nicht-lieferbar');
    expect(verfuegbarkeitVon({ availability: 'unbekannt' as never })).toBe('lieferbar');
  });

  it('bestellbar ist nur, was lieferbar und kein Beispiel ist', () => {
    expect(istBestellbar({})).toBe(true);
    expect(istBestellbar({ availability: 'lieferbar' })).toBe(true);
    expect(istBestellbar({ availability: 'auf-anfrage' })).toBe(false);
    expect(istBestellbar({ availability: 'nicht-lieferbar' })).toBe(false);
    expect(istBestellbar({ example: true })).toBe(false);
  });
});

describe('Shop-Kategorien', () => {
  const daten = [
    kategorie('b', { reihenfolge: 20 }),
    kategorie('a', { reihenfolge: 10 }),
    kategorie('a-1', { eltern: 'a', reihenfolge: 5 }),
    kategorie('a-1-x', { eltern: 'a-1' }),
    kategorie('versteckt', { sichtbar: false, reihenfolge: 30 }),
    kategorie('unter-versteckt', { eltern: 'versteckt' }),
    kategorie('waise', { eltern: 'geloescht' }),
    kategorie('kreis-1', { eltern: 'kreis-2' }),
    kategorie('kreis-2', { eltern: 'kreis-1' }),
  ];

  it('ordnet Haupt- und Unterkategorien nach Reihenfolge', () => {
    expect(hauptkategorien(daten).map((k) => k.id)).toEqual(['a', 'b', 'versteckt']);
    expect(unterkategorien(daten, 'a').map((k) => k.id)).toEqual(['a-1']);
    expect(kategorieKette(daten, 'a-1-x').map((k) => k.id)).toEqual(['a', 'a-1', 'a-1-x']);
  });

  it('hält Kreise und fehlende Elternkategorien aus, ohne zu hängen', () => {
    expect(kategorieKette(daten, 'kreis-1').map((k) => k.id)).toEqual(['kreis-2', 'kreis-1']);
    expect(kategorieSichtbar(daten, daten.find((k) => k.id === 'kreis-1')!)).toBe(false);
    expect(kategorieSichtbar(daten, daten.find((k) => k.id === 'waise')!)).toBe(false);
  });

  it('verbirgt Unterkategorien unter einer verborgenen Kategorie', () => {
    expect(sichtbareKategorien(daten).map((k) => k.id)).toEqual(['a-1', 'a', 'b', 'a-1-x']);
  });

  it('leitet eine frühere Adresse auf die aktuelle weiter', () => {
    const umbenannt = [kategorie('k', { slug: 'neu', fruehereAdressen: ['alt'] }), kategorie('z', { sichtbar: false, fruehereAdressen: ['weg'] })];
    expect(kategorieAufloesen(umbenannt, 'neu')?.kategorie?.id).toBe('k');
    expect(kategorieAufloesen(umbenannt, 'alt')?.weiterleitung?.slug).toBe('neu');
    expect(kategorieAufloesen(umbenannt, 'weg')).toBeNull();
    expect(kategorieAufloesen(umbenannt, 'unbekannt')).toBeNull();
  });

  it('merkt die alte Adresse bei einer Umbenennung, ohne Doppelte und ohne die neue', () => {
    expect(fruehereAdressenNachAenderung('alt', 'neu', [])).toEqual(['alt']);
    expect(fruehereAdressenNachAenderung('alt', 'alt', ['x'])).toEqual(['x']);
    expect(fruehereAdressenNachAenderung('neu', 'alt', ['alt'])).toEqual(['neu']);
    expect(fruehereAdressenNachAenderung('b', 'c', ['a', 'b', ''])).toEqual(['a', 'b']);
    expect(fruehereAdressenNachAenderung(undefined, 'neu', ['a'])).toEqual(['a']);
  });

  it('ordnet Produkte der Kategorie und dem Hersteller zu', () => {
    const produkte = [
      { name: '1', categoryId: 'a', manufacturerId: 'bks', manufacturer: 'BKS' },
      { name: '2', categoryId: 'b', manufacturer: 'BKS' },
      { name: '3', categoryId: 'a', manufacturer: 'BKS-Muster' },
      { name: '4', manufacturerId: 'andere', manufacturer: 'BKS' },
    ];
    expect(produkteDerKategorie(produkte, 'a').map((p) => p.name)).toEqual(['1', '3']);
    expect(produkteDesHerstellers(produkte, { id: 'bks', name: 'BKS' }).map((p) => p.name)).toEqual(['1', '2']);
  });

  it('zeigt nur angebotene Hersteller nach Reihenfolge', () => {
    const h = (id: string, angeboten: boolean, reihenfolge: number): ShopHersteller => ({ id, slug: id, name: id, einsatz: '', angeboten, reihenfolge });
    expect(angeboteneHersteller([h('c', true, 30), h('a', true, 10), h('b', false, 20)]).map((x) => x.id)).toEqual(['a', 'c']);
  });
});

describe('Startbestand (FA-SHOP-01)', () => {
  it('führt die neun Hauptkategorien des Inhabers in seiner Reihenfolge', () => {
    const k = defaults.kategorien();
    expect(k.map((x) => x.name)).toEqual([
      'Schlüssel nach Code',
      'Schlüssel nach Vorlage',
      'Autoschlüssel als Produkte',
      'Autoschlüsselgehäuse',
      'Gehäuseumbau und Reparaturservice',
      'Customizing und Modifikation',
      'Gleichschließende Zylinder und Sperrschließungen',
      'Schließtechnik und Zubehör',
      'Weitere Sicherheitstechnik',
    ]);
    expect(k.every((x) => !x.eltern)).toBe(true);
    expect(new Set(k.map((x) => x.slug)).size).toBe(9);
    expect(k.map((x) => x.reihenfolge)).toEqual([...k.map((x) => x.reihenfolge)].sort((a, b) => a - b));
  });

  it('führt jede Kategorie auf einen Weg, den es gibt, und sagt ehrlich, wo Produkte fehlen', () => {
    const k = Object.fromEntries(defaults.kategorien().map((x) => [x.id, x]));
    expect(k['schluessel-nach-code']).toMatchObject({ art: 'codeprodukte', ziel: '/schluessel-nach-code' });
    expect(k['schluessel-nach-vorlage']).toMatchObject({ art: 'anfrage', ziel: '/schluessel-nach-vorlage' });
    expect(k['gleichschliessende-zylinder']).toMatchObject({ art: 'konfigurator', ziel: '/gleichschliessende-zylinder/konfigurator' });
    expect(k['schliesstechnik-und-zubehoer']).toMatchObject({ art: 'artikel', ziel: '/artikel' });
    for (const id of ['autoschluessel-produkte', 'autoschluesselgehaeuse', 'gehaeuseumbau-und-reparaturservice', 'customizing-und-modifikation']) {
      expect(k[id]).toMatchObject({ art: 'anfrage', hinweis: HINWEIS_PRODUKTE_FOLGEN, sichtbar: true });
    }
    expect(k['weitere-sicherheitstechnik'].sichtbar).toBe(false);
    expect(sichtbareKategorien(defaults.kategorien())).toHaveLength(8);
    // Jedes Ziel ist eine Seite der Anwendung.
    for (const x of defaults.kategorien()) {
      const pfad = x.ziel.split('?')[0].replace(/^\//, '');
      const seite = path.join(process.cwd(), 'src/app/(site)', pfad, 'page.tsx');
      expect(() => readFileSync(seite), x.ziel).not.toThrow();
    }
  });

  it('stimmt mit content/kategorien.json und content/hersteller.json überein (JSON-Rückfall, G6)', () => {
    const datei = (name: string) => JSON.parse(readFileSync(path.join(process.cwd(), 'content', name), 'utf8')) as unknown;
    expect(datei('kategorien.json')).toEqual(defaults.kategorien());
    // Keine erfundenen Hersteller (R4): Der Bestand belegt keinen.
    expect(datei('hersteller.json')).toEqual([]);
    expect(defaults.hersteller()).toEqual([]);
  });

  it('Texte ohne Gedankenstriche', () => {
    for (const x of defaults.kategorien()) {
      expect(`${x.name} ${x.beschreibung} ${x.hinweis ?? ''}`).not.toMatch(/[–—]/);
    }
  });
});
