import { describe, expect, it } from 'vitest';

import { arbeiteEin, leseGenerationen } from './fahrzeuge-generationen-import.mjs';

/* Erfundene Generationen und Quellen (G4, R4): Sie prüfen nur die Mechanik, keine Fahrzeugdaten. */
const KOPF = 'marke,reihe,generation,baujahr_von,baujahr_bis,quelle';

const katalog = [
  { id: 'muster-alpha', klasse: 'pkw', marke: 'Muster', reihe: 'Alpha', quelle: 'Test', klonbar: 'unbekannt', gehaeuse: 'unbekannt', leistungen: [], sichtbar: true },
  {
    id: 'muster-beta',
    klasse: 'pkw',
    marke: 'Muster',
    reihe: 'Beta',
    quelle: 'Test',
    klonbar: 'unbekannt',
    gehaeuse: 'unbekannt',
    leistungen: [],
    sichtbar: true,
    generationen: [{ bezeichnung: 'B1', baujahrVon: 2001, baujahrBis: 2005, quelle: 'Testquelle alt' }],
  },
  { id: 'kraftrad-muster-beta', klasse: 'kraftrad', marke: 'Muster', reihe: 'Beta', quelle: 'Test', klonbar: 'unbekannt', gehaeuse: 'unbekannt', leistungen: [], sichtbar: true },
];

describe('Generationen einlesen', () => {
  it('liest Zeilen mit Bauzeitraum und Quelle', () => {
    const zeilen = leseGenerationen(`${KOPF}\r\nMuster,Alpha,A2,2010,2015,Testquelle\r\nMuster,Alpha,A3,2016,,Testquelle\r\n`);
    expect(zeilen.map((z: { generation: unknown }) => z.generation)).toEqual([
      { bezeichnung: 'A2', baujahrVon: 2010, baujahrBis: 2015, quelle: 'Testquelle' },
      { bezeichnung: 'A3', baujahrVon: 2016, quelle: 'Testquelle' },
    ]);
  });

  it('verlangt Quelle, gültige Jahre und alle Spalten', () => {
    expect(() => leseGenerationen(`${KOPF}\nMuster,Alpha,A2,2010,2015,\n`)).toThrow(/ohne Quelle/);
    expect(() => leseGenerationen(`${KOPF}\nMuster,Alpha,A2,2016,2010,Q\n`)).toThrow(/nach Baujahr bis/);
    expect(() => leseGenerationen(`${KOPF}\nMuster,Alpha,A2,10,,Q\n`)).toThrow(/kein Jahr/);
    expect(() => leseGenerationen('marke,reihe,generation\nMuster,Alpha,A2\n')).toThrow(/Spalte „baujahr_von“ fehlt/);
  });
});

describe('Generationen einarbeiten', () => {
  it('übernimmt nur Zeilen mit eindeutiger Reihe und listet den Rest', () => {
    const zeilen = leseGenerationen(
      [KOPF, 'muster,ALPHA,A2,2010,2015,Testquelle', 'Muster,Gamma,G1,2000,2004,Testquelle', 'Muster,Beta,B2,2006,2012,Testquelle'].join('\n'),
    );
    const { katalog: neu, uebernommen, nichtZugeordnet } = arbeiteEin(katalog, zeilen);
    expect(uebernommen).toBe(1);
    expect(nichtZugeordnet.map((z: { reihe: string; grund: string }) => [z.reihe, z.grund])).toEqual([
      ['Gamma', 'Reihe nicht im Katalog'],
      ['Beta', 'mehrere Reihen passen'],
    ]);
    expect(neu[0].generationen).toEqual([{ bezeichnung: 'A2', baujahrVon: 2010, baujahrBis: 2015, quelle: 'Testquelle' }]);
    // Unberührt und ohne Nebenwirkung auf die Eingabe.
    expect(neu[1].generationen).toEqual(katalog[1].generationen);
    expect(katalog[0]).not.toHaveProperty('generationen');
  });

  it('ersetzt eine Generation gleicher Bezeichnung und sortiert nach Baujahr', () => {
    const nurPkw = katalog.filter((r) => r.klasse === 'pkw');
    const zeilen = leseGenerationen([KOPF, 'Muster,Beta,B2,2006,2012,Testquelle', 'Muster,Beta,b1,2000,2005,Testquelle neu'].join('\n'));
    const { katalog: neu } = arbeiteEin(nurPkw, zeilen);
    expect(neu[1].generationen).toEqual([
      { bezeichnung: 'b1', baujahrVon: 2000, baujahrBis: 2005, quelle: 'Testquelle neu' },
      { bezeichnung: 'B2', baujahrVon: 2006, baujahrBis: 2012, quelle: 'Testquelle' },
    ]);
  });
});
