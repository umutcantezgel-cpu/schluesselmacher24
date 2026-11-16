import { describe, expect, it } from 'vitest';

import { defaults } from './defaults';
import {
  bauformNamen,
  bauformenSortiert,
  baujahrePruefen,
  fahrzeugFilter,
  fahrzeugPassung,
  fahrzeugteile,
  fahrzeugteileFiltern,
  fahrzeugteilLuecken,
  filterAuswahl,
  filterAusSuchparametern,
  filterGesetzt,
  filterZuSuchparametern,
  passtZumFilter,
  umbauBeispieleFuer,
  umbauBeispielZeigbar,
  type Fahrzeugartikel,
} from './fahrzeugteile';
import type { FahrzeugTeil, StandardArticle, UmbauBeispiel } from '@/lib/types';

/* Erfundene Testdaten (G4): Marken und Reihen stehen nur für die Logik. */

function teil(extra: Partial<FahrzeugTeil> = {}): FahrzeugTeil {
  return {
    teileart: 'gehaeuse',
    bauformen: ['klappschluessel'],
    reihen: [],
    schluesselarten: ['klappschluessel'],
    kompatibilitaet: 'Elektronik und Bart werden übernommen.',
    elektronik: 'pruefung',
    ...extra,
  };
}

function artikel(id: string, fahrzeugteil?: FahrzeugTeil): StandardArticle {
  return {
    id,
    slug: id,
    name: id,
    description: '',
    manufacturer: '',
    scope: '',
    properties: [],
    deliveryTime: '',
    priceCents: 1000,
    maxQty: 5,
    shippingClass: 'zubehoer',
    image: { motif: id, ratio: '1/1' },
    gallery: [],
    tags: [],
    seo: { title: id, description: '', internalLinks: [] },
    example: false,
    ...(fahrzeugteil ? { fahrzeugteil } : {}),
  };
}

const golfTeil = teil({ marke: 'Testmarke', reihen: ['testmarke-alpha'], tastenzahl: 3, baujahrVon: 2008, baujahrBis: 2016 });
const markenTeil = teil({ marke: 'Testmarke', tastenzahl: 2 });
const allgemein = teil({ teileart: 'batterie', bauformen: [], schluesselarten: [] });
const fremd = teil({ marke: 'Andere', reihen: ['andere-beta'], tastenzahl: 3, bauformen: ['smart-key'], schluesselarten: ['smart-key'] });

describe('Fahrzeugteile aus den Artikeln', () => {
  it('nimmt nur Artikel mit Fahrzeugbezug', () => {
    const liste = [artikel('a', golfTeil), artikel('b'), artikel('c', allgemein)];
    expect(fahrzeugteile(liste).map((a) => a.id)).toEqual(['a', 'c']);
  });
});

describe('Passung zum Fahrzeug', () => {
  it('unterscheidet Reihe, Marke, markenübergreifend und keine', () => {
    const f = { marke: 'testmarke', reihe: 'testmarke-alpha' };
    expect(fahrzeugPassung(golfTeil, f)).toBe('reihe');
    expect(fahrzeugPassung(markenTeil, f)).toBe('marke');
    expect(fahrzeugPassung(allgemein, f)).toBe('allgemein');
    expect(fahrzeugPassung(fremd, f)).toBe('keine');
    expect(fahrzeugPassung(golfTeil, { marke: 'Testmarke', reihe: 'testmarke-gamma' })).toBe('keine');
  });

  it('prüft das Baujahr nur, wo das Teil Baujahre trägt', () => {
    expect(fahrzeugPassung(golfTeil, { marke: 'Testmarke', baujahr: 2007 })).toBe('keine');
    expect(fahrzeugPassung(golfTeil, { marke: 'Testmarke', baujahr: 2017 })).toBe('keine');
    expect(fahrzeugPassung(golfTeil, { marke: 'Testmarke', baujahr: 2010 })).toBe('reihe');
    expect(fahrzeugPassung(markenTeil, { marke: 'Testmarke', baujahr: 1990 })).toBe('marke');
  });

  it('eine Reihe ohne Marke passt nur, wo sie ausdrücklich steht', () => {
    expect(fahrzeugPassung(golfTeil, { reihe: 'testmarke-alpha' })).toBe('reihe');
    expect(fahrzeugPassung(markenTeil, { reihe: 'testmarke-alpha' })).toBe('keine');
  });
});

describe('Filter (keine falschen Versprechen)', () => {
  it('Bauform, Tastenzahl und Schlüsseltyp passen nur bei ausdrücklicher Angabe', () => {
    expect(passtZumFilter(golfTeil, { bauform: 'klappschluessel' })).toBe(true);
    expect(passtZumFilter(allgemein, { bauform: 'klappschluessel' })).toBe(false);
    expect(passtZumFilter(golfTeil, { tastenzahl: 3 })).toBe(true);
    expect(passtZumFilter(golfTeil, { tastenzahl: 2 })).toBe(false);
    expect(passtZumFilter(allgemein, { tastenzahl: 3 })).toBe(false);
    expect(passtZumFilter(fremd, { schluesselart: 'smart-key' })).toBe(true);
    expect(passtZumFilter(golfTeil, { schluesselart: 'smart-key' })).toBe(false);
    expect(passtZumFilter(allgemein, { teileart: 'batterie' })).toBe(true);
    expect(passtZumFilter(golfTeil, { teileart: 'batterie' })).toBe(false);
  });

  it('markenübergreifende Teile lassen sich abschalten', () => {
    expect(passtZumFilter(allgemein, { marke: 'Testmarke' })).toBe(true);
    expect(passtZumFilter(allgemein, { marke: 'Testmarke' }, { allgemeineTeile: false })).toBe(false);
  });

  it('stellt mit Fahrzeug genaue Treffer nach vorn', () => {
    const liste = [artikel('allgemein', allgemein), artikel('marke', markenTeil), artikel('fremd', fremd), artikel('reihe', golfTeil)] as Fahrzeugartikel[];
    const treffer = fahrzeugteileFiltern(liste, { marke: 'Testmarke', reihe: 'testmarke-alpha' });
    expect(treffer.map((a) => a.id)).toEqual(['reihe', 'marke', 'allgemein']);
    expect(fahrzeugteileFiltern(liste, {}).map((a) => a.id)).toEqual(['allgemein', 'marke', 'fremd', 'reihe']);
  });

  it('„Mein Fahrzeug“ aus einer Reihe des Fahrzeugkatalogs', () => {
    expect(fahrzeugFilter({ id: 'testmarke-alpha', marke: 'Testmarke' }, 2012)).toEqual({
      marke: 'Testmarke',
      reihe: 'testmarke-alpha',
      baujahr: 2012,
    });
    expect(fahrzeugFilter({ id: 'testmarke-alpha', marke: 'Testmarke' })).toEqual({ marke: 'Testmarke', reihe: 'testmarke-alpha' });
  });

  it('bietet nur Werte an, die es bei den Teilen gibt', () => {
    const liste = [artikel('a', golfTeil), artikel('b', fremd), artikel('c', allgemein), artikel('d', markenTeil)] as Fahrzeugartikel[];
    expect(filterAuswahl(liste)).toEqual({
      marken: ['Andere', 'Testmarke'],
      reihen: { Andere: ['andere-beta'], Testmarke: ['testmarke-alpha'] },
      bauformen: ['klappschluessel', 'smart-key'],
      tastenzahlen: [2, 3],
      teilearten: ['gehaeuse', 'batterie'],
      schluesselarten: ['klappschluessel', 'smart-key'],
    });
  });
});

describe('Filter in der Adresse', () => {
  it('liest gültige Werte und verwirft ungültige still', () => {
    const params = new URLSearchParams('marke=Testmarke&reihe=testmarke-alpha&baujahr=2012&bauform=karte&tasten=3&teil=gehaeuse&typ=smart-key');
    const filter = filterAusSuchparametern(params);
    expect(filter).toEqual({
      marke: 'Testmarke',
      reihe: 'testmarke-alpha',
      baujahr: 2012,
      bauform: 'karte',
      tastenzahl: 3,
      teileart: 'gehaeuse',
      schluesselart: 'smart-key',
    });
    expect(filterZuSuchparametern(filter)).toBe(params.toString());
    expect(
      filterAusSuchparametern({ reihe: 'testmarke-alpha', baujahr: '1800', bauform: '<x>', tasten: '99', teil: 'motor', typ: 'karte' }),
    ).toEqual({});
    expect(filterAusSuchparametern({ marke: ['Testmarke', 'Andere'], tasten: '0' })).toEqual({ marke: 'Testmarke', tastenzahl: 0 });
  });

  it('erkennt einen leeren Filter', () => {
    expect(filterGesetzt({})).toBe(false);
    expect(filterZuSuchparametern({})).toBe('');
    expect(filterGesetzt({ tastenzahl: 0 })).toBe(true);
  });
});

describe('Pflichtangaben im Backend', () => {
  it('verlangt Art, Kompatibilitätshinweis und Elektronik, bei Gehäusen Bauform und Tastenzahl', () => {
    expect(Object.keys(fahrzeugteilLuecken({}))).toEqual(['teileart', 'kompatibilitaet', 'elektronik']);
    expect(Object.keys(fahrzeugteilLuecken({ teileart: 'gehaeuse', kompatibilitaet: ' ', elektronik: 'ja' }))).toEqual([
      'kompatibilitaet',
      'tastenzahl',
      'bauformen',
    ]);
    expect(fahrzeugteilLuecken({ teileart: 'gehaeuse', kompatibilitaet: 'x', elektronik: 'ja', tastenzahl: 0, bauformen: [1] })).toEqual({});
    expect(fahrzeugteilLuecken({ teileart: 'batterie', kompatibilitaet: 'x', elektronik: 'nein' })).toEqual({});
  });

  it('Baujahr bis nicht vor von', () => {
    expect(baujahrePruefen(2010, 2008)).toMatch(/nicht vor/);
    expect(baujahrePruefen(2010, 2010)).toBe(true);
    expect(baujahrePruefen(undefined, 2008)).toBe(true);
  });
});

describe('Bauformen', () => {
  it('Startbestand: die Bauformen aus Abschnitt 14 und dem Paket, ohne erfundene Erklärungen', () => {
    const liste = defaults.bauformen();
    expect(liste.map((b) => b.name)).toEqual(['Klappschlüssel', 'Smart Key', 'Karte', 'Fernbedienung', 'Schlüsselkopf']);
    expect(liste.every((b) => b.beschreibung === undefined)).toBe(true);
    expect(new Set(liste.map((b) => b.id)).size).toBe(liste.length);
  });

  it('sortiert und nennt Bauformen in der Reihenfolge der Liste', () => {
    const liste = [...defaults.bauformen()].reverse();
    expect(bauformenSortiert(liste)[0].id).toBe('klappschluessel');
    expect(bauformNamen(['karte', 'klappschluessel', 'unbekannt'], liste)).toEqual(['Klappschlüssel', 'Karte']);
  });
});

describe('Umbau-Beispiele', () => {
  const bild = (beschriftung: string) => ({ url: '/api/medien/file/test.jpg', alt: beschriftung, beschriftung });
  const beispiel = (id: string, extra: Partial<UmbauBeispiel> = {}): UmbauBeispiel => ({
    id,
    titel: id,
    vorher: bild('Alter Schlüssel'),
    nachher: bild('Neues Gehäuse'),
    uebernommen: ['elektronik'],
    hinweis: 'Nur bei passender Platine.',
    einsatz: ['customizing'],
    reihenfolge: 100,
    ...extra,
  });

  it('Startbestand leer: keine erfundenen Bilder (R4)', () => {
    expect(defaults.umbauBeispiele()).toEqual([]);
  });

  it('zeigt nur Beispiele mit beiden Fotos und Beschriftung für den Bereich', () => {
    const liste = [
      beispiel('b', { reihenfolge: 20 }),
      beispiel('a', { reihenfolge: 10 }),
      beispiel('gehaeuse', { einsatz: ['gehaeuse'] }),
      beispiel('ohne-nachher', { nachher: { url: '', alt: '', beschriftung: 'x' } }),
      beispiel('ohne-text', { vorher: { ...bild(''), beschriftung: ' ' } }),
    ];
    expect(umbauBeispieleFuer(liste, 'customizing').map((b) => b.id)).toEqual(['a', 'b']);
    expect(umbauBeispieleFuer(liste, 'reparatur')).toEqual([]);
    expect(umbauBeispielZeigbar(liste[3])).toBe(false);
  });
});
