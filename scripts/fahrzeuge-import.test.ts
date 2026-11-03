import { describe, expect, it } from 'vitest';

import { reiheKennung } from '../src/lib/fahrzeuge/katalog';

import {
  abdeckung,
  baueKatalog,
  BESTAND_QUELLE,
  KBA_QUELLE,
  kennung,
  markeAnzeige,
  parseCsv,
  reiheAnzeige,
} from './fahrzeuge-import.mjs';

/* Erfundene Tabelle im Aufbau der KBA-Datei (G4): Reihennamen folgen der KBA-Schreibweise, Zahlen sind frei gewählt. */
const KOPF =
  'rang_2026_benannt,zeile_fz12_1,segment,marke_abgeleitet,modellreihe_kba,anzahl_1_1_2026,anzahl_1_1_2025,veraenderung_pct,in_top348_fuer_95pct,benannt,anteil_2026_pct_berechnet';

const CSV = [
  KOPF,
  '1,10,KOMPAKTKLASSE,VW,VW GOLF,2000,1900,5.2,1,1,0.0100',
  '2,11,KOMPAKTKLASSE,VW,VW POLO,1500,1400,7.1,1,1,0.0100',
  '3,12,KLEINWAGEN,VW,"VW ID.4, ID.5",1200,1100,9.0,1,1,0.0100',
  '4,13,KLEINBUSSE,VW,VW TRANSPORTER,900,880,2.0,1,1,0.0100',
  '5,14,WOHNMOBILE,VW,VW TRANSPORTER,300,290,3.0,0,1,0.0100',
  '6,15,KOMPAKTKLASSE,SKODA,SKODA FABIA,800,780,1.0,1,1,0.0100',
  '7,16,KOMPAKTKLASSE,FORD,"FORD TRANSIT, TOURNEO",700,690,1.5,1,1,0.0100',
  '8,17,KLEINBUSSE,MG,"MG ROVER MGF, MG TF",100,120,-3.0,0,1,0.0100',
  '9,18,GELÄNDEWAGEN,ALFA ROMEO,ALFA ROMEO ALFA MITO,400,410,-2.0,0,1,0.0100',
  '10,19,SUVs,KGM,KGM KORANDO,500,510,-1.0,0,1,0.0100',
  '11,20,SUVs,KGM,SSANGYONG KORANDO,200,220,-9.0,0,1,0.0100',
  ',21,KLEINWAGEN,SONSTIGE (nicht benannt),SONSTIGE,123,130,-5.0,0,0,0.0001',
  ',22,SONSTIGE (nicht Segment),SONSTIGE (nicht benannt),SONSTIGE (Gesamtzeile Sonstige),9000,9100,-1.0,0,0,0.0100',
].join('\r\n');

/* Erfundener Bestand in der Form von content/vehicles.json. */
const BESTAND = [
  {
    name: 'Volkswagen',
    slug: 'volkswagen',
    models: [
      { name: 'Golf', slug: 'golf', yearFrom: 2003 },
      { name: 'Polo', slug: 'polo', yearFrom: 2002 },
    ],
  },
  { name: 'Škoda', slug: 'skoda', models: [{ name: 'Octavia', slug: 'octavia', yearFrom: 1996 }] },
  { name: 'Ford', slug: 'ford', models: [{ name: 'Transit', slug: 'transit', yearFrom: 2000 }] },
];

describe('Aliasliste und Anzeigenamen', () => {
  it('übersetzt Markennamen der KBA-Datei und bricht bei unbekannten Marken ab', () => {
    expect(markeAnzeige('VW')).toBe('Volkswagen');
    expect(markeAnzeige('MERCEDES')).toBe('Mercedes-Benz');
    expect(markeAnzeige('SKODA')).toBe('Škoda');
    expect(markeAnzeige('CITROEN')).toBe('Citroën');
    expect(markeAnzeige('SSANGYONG')).toBe('KGM');
    expect(markeAnzeige('ALFA ROMEO')).toBe('Alfa Romeo');
    expect(markeAnzeige('LAND ROVER')).toBe('Land Rover');
    expect(markeAnzeige('MINI')).toBe('MINI');
    expect(() => markeAnzeige('XYZ')).toThrow(/fehlt in der Aliasliste/);
  });

  it('schreibt Reihennamen in Titelschreibung mit Ziffern und Kürzeln wie im Handel', () => {
    expect(reiheAnzeige('VW', 'GOLF, JETTA')).toBe('Golf, Jetta');
    expect(reiheAnzeige('CITROEN', 'C-ZERO')).toBe('C-Zero');
    expect(reiheAnzeige('VW', 'T-ROC')).toBe('T-Roc');
    expect(reiheAnzeige('VW', 'ID. BUZZ')).toBe('ID. Buzz');
    expect(reiheAnzeige('VW', 'LT')).toBe('LT');
    expect(reiheAnzeige('MERCEDES', 'CLA-KLASSE')).toBe('CLA-Klasse');
    expect(reiheAnzeige('MERCEDES', 'GLK, GLC')).toBe('GLK, GLC');
    expect(reiheAnzeige('FORD', 'KA')).toBe('Ka');
    expect(reiheAnzeige('BMW', '3ER')).toBe('3er');
    expect(reiheAnzeige('HYUNDAI', 'I 20')).toBe('i20');
    expect(reiheAnzeige('FIAT', 'TIPO')).toBe('Tipo');
  });
});

describe('Kennung und CSV', () => {
  it('bildet die Kennung nach derselben Regel wie reiheKennung in der Seite', () => {
    expect(kennung('Škoda', 'Octavia')).toBe('skoda-octavia');
    expect(kennung('Škoda', 'Octavia')).toBe(reiheKennung('Škoda', 'Octavia'));
    expect(kennung('Mercedes-Benz', 'A-Klasse')).toBe(reiheKennung('Mercedes-Benz', 'A-Klasse'));
  });

  it('liest Anführungszeichen, Kommas in Feldern und Zeilenenden nach RFC 4180', () => {
    expect(parseCsv('a,"VW ID.4, ID.5",c\r\n1,"sagt ""hallo""",3\r\n')).toEqual([
      ['a', 'VW ID.4, ID.5', 'c'],
      ['1', 'sagt "hallo"', '3'],
    ]);
  });
});

describe('baueKatalog', () => {
  const { reihen, kennzahlen } = baueKatalog({ csv: CSV, bestand: BESTAND });
  const finde = (id: string) => reihen.find((r) => r.id === id);

  it('verknüpft ein gepflegtes Modell mit seiner KBA-Reihe und behält Bestand, Rang, Quelle und Baujahr', () => {
    expect(finde('volkswagen-golf')).toEqual({
      id: 'volkswagen-golf',
      marke: 'Volkswagen',
      reihe: 'Golf',
      kbaName: 'VW GOLF',
      segment: 'KOMPAKTKLASSE',
      bestand: 2000,
      rang: 1,
      quelle: KBA_QUELLE,
      bestandsModell: 'volkswagen/golf',
      baujahrVon: 2003,
      baujahrQuelle: BESTAND_QUELLE,
      klonbar: 'unbekannt',
      gehaeuse: 'unbekannt',
      leistungen: [],
      sichtbar: true,
    });
  });

  it('behält eine Bestandszeile ohne KBA-Gegenstück mit der Quelle Bestand', () => {
    expect(finde('skoda-octavia')).toEqual({
      id: 'skoda-octavia',
      marke: 'Škoda',
      reihe: 'Octavia',
      quelle: BESTAND_QUELLE,
      bestandsModell: 'skoda/octavia',
      baujahrVon: 1996,
      baujahrQuelle: BESTAND_QUELLE,
      klonbar: 'unbekannt',
      gehaeuse: 'unbekannt',
      leistungen: [],
      sichtbar: true,
    });
  });

  it('führt gleiche Reihen aus mehreren Segmenten zusammen und addiert den Bestand', () => {
    expect(reihen.filter((r) => r.id === 'volkswagen-transporter')).toHaveLength(1);
    expect(finde('volkswagen-transporter')).toMatchObject({
      reihe: 'Transporter',
      kbaName: 'VW TRANSPORTER',
      segment: 'KLEINBUSSE / WOHNMOBILE',
      bestand: 1200,
      rang: 4,
    });
  });

  it('führt die Schreibweise SSANGYONG unter der Marke KGM zusammen', () => {
    expect(finde('kgm-korando')).toMatchObject({
      marke: 'KGM',
      reihe: 'Korando',
      bestand: 700,
      rang: 10,
      kbaName: 'KGM KORANDO / SSANGYONG KORANDO',
    });
  });

  it('übernimmt weitere Modellnamen als Suchbegriffe und trennt Markenteile ab', () => {
    expect(finde('ford-transit')).toMatchObject({
      reihe: 'Transit',
      alias: ['Tourneo'],
      bestandsModell: 'ford/transit',
      kbaName: 'FORD TRANSIT, TOURNEO',
    });
    expect(finde('alfa-romeo-mito')).toMatchObject({ marke: 'Alfa Romeo', reihe: 'Mito', kbaName: 'ALFA ROMEO ALFA MITO' });
    expect(finde('mg-rover-mgf-mg-tf')).toMatchObject({ marke: 'MG', reihe: 'Rover MGF, MG TF' });
    expect(finde('volkswagen-id-4-id-5')).toMatchObject({ reihe: 'ID.4, ID.5', kbaName: 'VW ID.4, ID.5' });
  });

  it('lässt SONSTIGE und die Gesamtzeile aus', () => {
    expect(kennzahlen.nichtBenannt).toBe(2);
    expect(reihen.some((r) => JSON.stringify(r).includes('SONSTIGE'))).toBe(false);
  });

  it('zählt Zeilen, Summen und Verknüpfungen', () => {
    expect(kennzahlen).toMatchObject({
      zeilen: 13,
      benannt: 11,
      nichtBenannt: 2,
      summeAlle: 17723,
      summeBenannt: 8600,
      reihenAusKba: 9,
      zusammengefuehrt: 2,
      bestandsmodelle: 4,
      verknuepft: 3,
      ohneKba: 1,
      reihen: 10,
    });
  });

  it('vergibt eindeutige Kennungen, führt jede Zeile mit Quelle und verknüpft jedes Bestandsmodell genau einmal', () => {
    expect(new Set(reihen.map((r) => r.id)).size).toBe(reihen.length);
    expect(reihen.every((r) => r.quelle === KBA_QUELLE || r.quelle === BESTAND_QUELLE)).toBe(true);
    expect(reihen.map((r) => r.bestandsModell).filter((v) => v !== undefined).sort()).toEqual([
      'ford/transit',
      'skoda/octavia',
      'volkswagen/golf',
      'volkswagen/polo',
    ]);
  });

  it('rechnet die Abdeckung aus den Beständen der Katalogzeilen', () => {
    expect(abdeckung(reihen, kennzahlen.summeAlle)).toEqual({ summe: 8600, gesamt: 17723, anteil: 8600 / 17723 });
  });
});

describe('Abdeckung und Fehlerfälle', () => {
  it('zählt Zeilen ohne Bestand nicht mit und teilt durch den Gesamtbestand', () => {
    expect(abdeckung([{ bestand: 50 }, { bestand: 25 }, {}], 100)).toEqual({ summe: 75, gesamt: 100, anteil: 0.75 });
  });

  it('bricht ab, wenn eine Pflichtspalte fehlt', () => {
    expect(() => baueKatalog({ csv: 'a,b\r\n1,2', bestand: [] })).toThrow(/ohne Spalte/);
  });

  it('bricht ab, wenn eine Marke in der Aliasliste fehlt, statt einen Namen zu raten', () => {
    const csv = [KOPF, '1,10,KLEINWAGEN,UNBEKANNT,UNBEKANNT FOO,100,90,1.0,1,1,0.0100'].join('\r\n');
    expect(() => baueKatalog({ csv, bestand: [] })).toThrow(/fehlt in der Aliasliste/);
  });
});
