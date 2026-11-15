import { describe, expect, it } from 'vitest';

import { defaults } from '../data/defaults';
import { fahrzeugreiheZuPayload, fahrzeugreiheZuSeite } from '../data/payload-mapping';
import type { FahrzeugReihe } from '../types';

import { klonbarSichtbar, reiheKennung, reihenAusBestand } from './katalog';
import { abstand, normalisiere, sucheFahrzeuge } from './suche';

/* Erfundene Bestandszahlen für die Gewichtung (G4); Namen wie im Handel. */
function reihe(marke: string, name: string, bestand?: number, extra: Partial<FahrzeugReihe> = {}): FahrzeugReihe {
  return { id: reiheKennung(marke, name), marke, reihe: name, quelle: 'Test', bestand, klonbar: 'unbekannt', gehaeuse: 'unbekannt', leistungen: [], sichtbar: true, ...extra };
}

const KATALOG: FahrzeugReihe[] = [
  reihe('Volkswagen', 'Golf', 2_000_000),
  reihe('Volkswagen', 'Polo', 1_000_000),
  reihe('Volkswagen', 'Passat', 800_000),
  reihe('Mercedes-Benz', 'A-Klasse', 700_000),
  reihe('Mercedes-Benz', 'E-Klasse', 600_000),
  reihe('Škoda', 'Octavia', 900_000),
  reihe('Opel', 'Corsa', 950_000),
  reihe('Citroën', 'C3', 300_000),
  reihe('Ford', 'Focus', 700_000, { sichtbar: false }),
];

describe('normalisiere und abstand', () => {
  it('vereinheitlicht Groß- und Kleinschreibung, Akzente, ß und Zeichen', () => {
    expect(normalisiere('Škoda  Octavia')).toBe('skoda octavia');
    expect(normalisiere('Citroën C3')).toBe('citroen c3');
    expect(normalisiere('Mercedes-Benz E-Klasse')).toBe('mercedes benz e klasse');
    expect(normalisiere('Straße')).toBe('strasse');
  });

  it('zählt Vertauschungen einmal und bricht über der Grenze ab', () => {
    expect(abstand('golf', 'glof')).toBe(1);
    expect(abstand('volkswagn', 'volkswagen')).toBe(1);
    expect(abstand('abc', 'xyzxyzxyz', 2)).toBe(3);
  });
});

describe('sucheFahrzeuge', () => {
  const erste = (anfrage: string) => sucheFahrzeuge(anfrage, KATALOG)[0]?.reihe.id;

  it('findet Marke und Reihe, auch mit Kurzform und Tippfehler (G-14)', () => {
    expect(erste('golf')).toBe('volkswagen-golf');
    expect(erste('vw polo')).toBe('volkswagen-polo');
    expect(erste('Volkswagn Glof')).toBe('volkswagen-golf');
    expect(erste('mercedes a klasse')).toBe('mercedes-benz-a-klasse');
    expect(erste('benz e-klase')).toBe('mercedes-benz-e-klasse');
    expect(erste('skoda octavia')).toBe('skoda-octavia');
    expect(erste('citroen c3')).toBe('citroen-c3');
  });

  it('ordnet nach Bestand, wenn mehrere passen, und lässt Ausgeblendetes weg', () => {
    expect(sucheFahrzeuge('volkswagen', KATALOG).map((t) => t.reihe.reihe)).toEqual(['Golf', 'Polo', 'Passat']);
    expect(sucheFahrzeuge('focus', KATALOG)).toEqual([]);
    expect(sucheFahrzeuge('   ', KATALOG)).toEqual([]);
  });

  it('erfindet keine Treffer für Unbekanntes', () => {
    expect(sucheFahrzeuge('Traktor Lanz', KATALOG)).toEqual([]);
  });

  it('filtert nach Fahrzeugklasse; Reihen ohne Klasse sind Pkw (A-047)', () => {
    const gemischt = [...KATALOG, reihe('Kawasaki', 'Z900', 30_000, { klasse: 'kraftrad' }), reihe('Volkswagen', 'Golfmobil', 10, { klasse: 'kraftrad' })];
    expect(sucheFahrzeuge('kawasaki', gemischt, { klasse: 'pkw' })).toEqual([]);
    expect(sucheFahrzeuge('kawasaki z900', gemischt, { klasse: 'kraftrad' })[0]?.reihe.reihe).toBe('Z900');
    expect(sucheFahrzeuge('golf', gemischt, { klasse: 'kraftrad' }).map((t) => t.reihe.reihe)).not.toContain('Golf');
    expect(sucheFahrzeuge('golf', gemischt, { klasse: 'pkw' })[0]?.reihe.reihe).toBe('Golf');
    expect(sucheFahrzeuge('kawasaki', gemischt).length).toBe(1);
  });

  it('nutzt gepflegte Generationen als Treffertext', () => {
    // Erfundene Bezeichnung nur für den Test (keine Fahrzeugdaten, R4).
    const mitGeneration = [...KATALOG, reihe('Testmarke', 'Alpha', 5, { generationen: [{ bezeichnung: 'Zeta Neu', quelle: 'Test' }] })];
    expect(sucheFahrzeuge('zeta neu', mitGeneration)[0]?.reihe.reihe).toBe('Alpha');
    expect(sucheFahrzeuge('zeta neu', KATALOG)).toEqual([]);
  });

  it('stellt einen Treffer im Namen der Reihe vor einen, der nur über einen Alias trifft', () => {
    // Erfundene Bestandszahlen (G4): Die Reihe mit dem Alias ist viel häufiger und stünde ohne die Regel vorn.
    const roller = [
      reihe('Piaggio', 'Vespa GTV', 900_000, { klasse: 'kraftrad', alias: ['Vespa GTS'] }),
      reihe('Piaggio', 'Vespa GTS', 40, { klasse: 'kraftrad' }),
      reihe('Piaggio', 'Vespa GTS 125', 30, { klasse: 'kraftrad' }),
    ];
    const namen = sucheFahrzeuge('Vespa GTS', roller, { klasse: 'kraftrad' }).map((t) => t.reihe.reihe);
    expect(namen).toEqual(['Vespa GTS', 'Vespa GTS 125', 'Vespa GTV']);
    // Der Alias findet weiter: Wer nur den Alias kennt, kommt ans Ziel.
    expect(sucheFahrzeuge('gts', [roller[0]], { klasse: 'kraftrad' })[0]?.reihe.reihe).toBe('Vespa GTV');
  });

  it('findet zu einer Untermarke auch Reihen der Stammmarke, eigene zuerst (FA-06-U3)', () => {
    const mitUntermarke = [...KATALOG, reihe('SEAT', 'Leon', 400_000), reihe('SEAT', 'Born', 5_000), reihe('Cupra', 'Formentor', 50_000)];
    expect(sucheFahrzeuge('cupra formentor', mitUntermarke)[0]?.reihe.marke).toBe('Cupra');
    expect(sucheFahrzeuge('cupra born', mitUntermarke)[0]?.reihe).toMatchObject({ marke: 'SEAT', reihe: 'Born' });
    expect(sucheFahrzeuge('cupra', mitUntermarke)[0]?.reihe.marke).toBe('Cupra');
  });
});

describe('Katalog', () => {
  it('zeigt Klonbarkeit nur nach Bestätigung (G-18)', () => {
    expect(klonbarSichtbar({ klonbar: 'bestaetigt' })).toBe(true);
    expect(klonbarSichtbar({ klonbar: 'unbekannt' })).toBe(false);
    expect(klonbarSichtbar({ klonbar: 'nein' })).toBe(false);
  });

  it('startet ohne Import mit den 49 gepflegten Modellen des Bestands, mit Quelle', () => {
    const reihen = defaults.fahrzeugkatalog();
    expect(reihen).toHaveLength(defaults.vehicleMakes().reduce((n, m) => n + m.models.length, 0));
    expect(reihen.every((r) => r.quelle.startsWith('Bestand') && r.bestandsModell && r.klonbar === 'unbekannt')).toBe(true);
    expect(reihen.find((r) => r.id === 'volkswagen-golf')?.bestandsModell).toBe('volkswagen/golf');
    expect(reihenAusBestand([])).toEqual([]);
  });

  it('übersteht den Weg über das Backend ohne Verlust', () => {
    const voll = reihe('Volkswagen', 'Golf', 2_000_000, {
      kbaName: 'VW GOLF, JETTA',
      rang: 1,
      segment: 'Kompaktklasse',
      bestandsModell: 'volkswagen/golf',
      baujahrVon: 2003,
      baujahrQuelle: 'Bestand',
      transponder: { typ: 'Megamos AES', quelle: 'Test' },
      klonbar: 'bestaetigt',
      gehaeuse: 'verfuegbar',
      leistungen: ['nachmachen', 'programmieren'],
      alias: ['Golf Variant'],
      klasse: 'pkw',
      generationen: [{ bezeichnung: 'Testgeneration', baujahrVon: 2012, baujahrBis: 2019, quelle: 'Test' }, { bezeichnung: 'Ohne Jahre', quelle: 'Test' }],
    });
    const zurueck = fahrzeugreiheZuSeite({ ...(fahrzeugreiheZuPayload(voll) as object), id: 1, updatedAt: '', createdAt: '' } as never);
    expect(zurueck).toEqual(voll);
  });

  it('schließt mit einer Generationsangabe wie „Golf 7“ oder „Golf VII“ nichts aus (E4-PROBENUTZER-01)', () => {
    const katalog = defaults.fahrzeugkatalog();
    expect(sucheFahrzeuge('VW Golf 7', katalog)[0]?.reihe.bestandsModell).toBe('volkswagen/golf');
    expect(sucheFahrzeuge('golf vii', katalog)[0]?.reihe.bestandsModell).toBe('volkswagen/golf');
    expect(sucheFahrzeuge('7', katalog)).toEqual([]);
    expect(sucheFahrzeuge('golf xyz', katalog)).toEqual([]);
  });
});
