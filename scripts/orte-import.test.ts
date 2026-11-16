import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  anhangALesen,
  anhangAZuordnen,
  leseGemeindeverzeichnis,
  leseGeonames,
  postleitzahlenBilden,
  slugsVergeben,
  staendeVergleichen,
  LAENDER as LAENDER_IMPORT,
  STANDARD_GEONAMES,
  STANDARD_GV,
  teileName,
  vergleichsname,
  zeilenJson,
  ZUORDNUNG_ANHANG_A,
} from './orte-import.mjs';
import { leseXlsx } from './fahrzeuge-import-fz2.mjs';
import { LAENDER, ORTSSTAMM_QUELLEN } from '../src/lib/orte/typen';
import type { GemeindenDatei, KreiseDatei, PostleitzahlenDatei, PrioritaetDatei } from '../src/lib/orte/typen';

const ORDNER = path.resolve(__dirname, '../content/orte');
const lies = <T>(datei: string): T => JSON.parse(readFileSync(path.join(ORDNER, datei), 'utf8')) as T;
const gemeindenDatei = lies<GemeindenDatei>('gemeinden.json');
const kreiseDatei = lies<KreiseDatei>('kreise.json');
const plzDatei = lies<PostleitzahlenDatei>('postleitzahlen.json');
const prioritaetDatei = lies<PrioritaetDatei>('prioritaet.json');
const gemeinden = gemeindenDatei.gemeinden;
const kreisNamen = new Map(kreiseDatei.kreise.map((k) => [k.schluessel, k.name]));

type Zeile = Record<string, string>;

/* Blatt im Aufbau der Jahresausgabe mit erfundenen Gemeinden (G4). */
function blatt(datensaetze: Zeile[]): Zeile[] {
  return [
    { A: 'Gemeinden in Deutschland nach Fläche, Bevölkerung und Postleitzahl am 31.12.2025 (Jahr)' },
    {},
    {
      A: 'Satzart',
      B: 'Textkennzeichen',
      C: 'Amtlicher Regionalschlüssel (ARS)',
      H: 'Gemeindename',
      I: 'Fläche km2 1)',
      J: 'Bevölkerung auf Grundlage des Zensus 20222)',
      N: 'Postleitzahl3)',
    },
    { C: 'Land', D: 'RB', E: 'Kreis', F: 'VB', G: 'Gem', J: 'insgesamt', K: 'männlich', L: 'weiblich', M: 'je km2', O: 'Längengrad', P: 'Breitengrad' },
    { C: 'Gebietsstand am 31.12.2025 (Jahr)' },
    ...Object.entries({
      '01': 'Schleswig-Holstein', '02': 'Hamburg', '03': 'Niedersachsen', '04': 'Bremen', '05': 'Nordrhein-Westfalen', '06': 'Hessen',
      '07': 'Rheinland-Pfalz', '08': 'Baden-Württemberg', '09': 'Bayern', '10': 'Saarland', '11': 'Berlin', '12': 'Brandenburg',
      '13': 'Mecklenburg-Vorpommern', '14': 'Sachsen', '15': 'Sachsen-Anhalt', '16': 'Thüringen',
    }).map(([C, H]) => ({ A: '10', C, H })),
    ...datensaetze,
    { A: 'Quelle: Gemeindeverzeichnis-Informationssytem GV-ISys' },
  ];
}

const testkreis = { A: '40', B: '44', C: '06', D: '9', E: '99', H: 'Testkreis' };
const gemeindeZeile = (gem: string, name: string, tk = '64', plz = '35999'): Zeile => ({
  A: '60', B: tk, C: '06', D: '9', E: '99', F: '0001', G: gem, H: name, I: '10.5', J: '1234', N: plz, O: '8,5', P: '50,5',
});

describe('Gemeindeverzeichnis lesen', () => {
  it('liest Länder, Kreise und Gemeinden, lässt gemeindefreie Gebiete weg', () => {
    const gv = leseGemeindeverzeichnis(blatt([
      testkreis,
      gemeindeZeile('001', 'Musterstadt, Stadt', '63'),
      gemeindeZeile('002', 'Beispieldorf'),
      gemeindeZeile('003', 'Forst Test, gemfr. Gebiet', '66'),
    ]));
    expect(gv.kreise).toEqual([{ schluessel: '06999', name: 'Testkreis', art: 'landkreis', land: '06' }]);
    expect(gv.gemeindefrei).toBe(1);
    expect(gv.gemeinden).toHaveLength(2);
    expect(gv.gemeinden[0]).toEqual({
      schluessel: '06999001',
      regionalschluessel: '069990001001',
      name: 'Musterstadt',
      bezeichnung: 'Stadt',
      art: 'stadt',
      kreis: '06999',
      land: '06',
      plz: '35999',
      breite: 50.5,
      laenge: 8.5,
      einwohner: 1234,
    });
  });

  it('bricht bei geänderter Spaltenfolge ab', () => {
    const zeilen = blatt([testkreis]);
    zeilen[3] = { ...zeilen[3], O: 'Breitengrad', P: 'Längengrad' };
    expect(() => leseGemeindeverzeichnis(zeilen)).toThrow(/Längengrad/);
  });

  it('bricht bei unbekanntem Textkennzeichen und doppeltem Schlüssel ab', () => {
    expect(() => leseGemeindeverzeichnis(blatt([testkreis, gemeindeZeile('001', 'X', '69')]))).toThrow(/Textkennzeichen/);
    expect(() => leseGemeindeverzeichnis(blatt([testkreis, gemeindeZeile('001', 'X'), gemeindeZeile('001', 'Y')]))).toThrow(/doppelt/);
  });

  it('teilt Name und Bezeichnung am ersten Komma', () => {
    expect(teileName('Bautzen / Budyšin, Stadt, Hochschulstadt / Wysokošulske město')).toEqual({
      name: 'Bautzen / Budyšin',
      bezeichnung: 'Stadt, Hochschulstadt / Wysokošulske město',
    });
    expect(teileName('Amberg')).toEqual({ name: 'Amberg', bezeichnung: null });
  });
});

describe('Postleitzahlen', () => {
  const geo = leseGeonames(
    [
      ['DE', '35999', 'Musterstadt', 'Hessen', 'HE', '', '', 'Testkreis', '06999', '50.5', '8.5', '4'],
      ['DE', '35999', 'Musterstadt Nord', 'Hessen', 'HE', '', '', 'Testkreis', '06999', '50.7', '8.7', '4'],
      ['DE', '35998', 'Beispieldorf', 'Hessen', 'HE', '', '', 'Testkreis', '06999', '50.6', '8.6', '4'],
      ['DE', '87491', 'Grenzort', '', '', '', '', '', '', '47.5', '10.4', ''],
    ].map((z) => z.join('\t')).join('\n'),
  );
  const gem = [
    { schluessel: '06999001', name: 'Musterstadt', kreis: '06999', plz: '35999' },
    { schluessel: '06999002', name: 'Beispieldorf', kreis: '06999', plz: '35997' },
  ];

  it('ordnet Gemeinden nur eindeutig zu und mittelt die Koordinaten', () => {
    const { liste, zaehler } = postleitzahlenBilden(geo, gem);
    const p: Record<string, { gemeinden: string[] }> = Object.fromEntries(liste.map((e: { plz: string; gemeinden: string[] }) => [e.plz, e]));
    expect(p['35999']).toEqual({ plz: '35999', orte: ['Musterstadt', 'Musterstadt Nord'], kreise: ['06999'], gemeinden: ['06999001'], breite: 50.6, laenge: 8.6 });
    expect(p['35998'].gemeinden).toEqual(['06999002']);
    // Ohne Kreis keine Gemeinde, aber die Postleitzahl bleibt.
    expect(p['87491']).toMatchObject({ kreise: [], gemeinden: [] });
    // „Musterstadt Nord“ ist ein Ortsteil: nicht geraten. Der Verwaltungssitz 35997 fehlt in GeoNames.
    expect(zaehler).toMatchObject({ zeilen: 4, zugeordnet: 2, ohneGeonames: 1 });
  });
});

describe('Adressen (Slug-Regel)', () => {
  it('sind über alle Gemeinden eindeutig', () => {
    expect(new Set(gemeinden.map((g) => g.slug)).size).toBe(gemeinden.length);
  });

  it('bekommen bei gleichnamigen Gemeinden den Kreis, sonst das Land als Zusatz (echte Dubletten)', () => {
    const slug = (schluessel: string) => gemeinden.find((g) => g.schluessel === schluessel)?.slug;
    // Zwei Gemeinden „Hof“: die kreisfreie Stadt heißt wie ihr Kreis, also Land.
    expect(slug('09464000')).toBe('hof-bayern');
    expect(slug('07143243')).toBe('hof-westerwaldkreis');
    // Zwei „Amberg“ in Bayern.
    expect(slug('09361000')).toBe('amberg-bayern');
    expect(slug('09778111')).toBe('amberg-unterallgaeu');
    // Drei „Mühlhausen“: Kreis als Zusatz; „Mühlhausen/Thüringen“ ist ein eigener Name.
    expect(slug('08226054')).toBe('muehlhausen-rhein-neckar-kreis');
    expect(slug('09572143')).toBe('muehlhausen-erlangen-hoechstadt');
    expect(slug('16064046')).toBe('muehlhausen-thueringen');
    // Die vielen „Neustadt“ unterscheiden sich schon im amtlichen Namen.
    expect(slug('07138044')).toBe('neustadt-wied');
    expect(slug('06534016')).toBe('neustadt-hessen');
    expect(slug('07316000')).toBe('neustadt-an-der-weinstrasse');
    expect(slug('06532023')).toBe('wetzlar');
  });

  it('erzeugt aus dem Stamm dieselben Adressen und hält frühere über Stände fest', () => {
    const neu = slugsVergeben(gemeinden, kreisNamen);
    expect(gemeinden.every((g) => neu.get(g.schluessel) === g.slug)).toBe(true);
    // Kommt eine dritte „Wetzlar“ hinzu, behält die vorhandene ihre Adresse, die neue bekommt den Zusatz.
    const mitNeuer = [...gemeinden, { ...gemeinden.find((g) => g.schluessel === '06532023')!, schluessel: '06999999', kreis: '06535' }];
    const vorher = new Map(gemeinden.map((g) => [g.schluessel, g.slug]));
    const stabil = slugsVergeben(mitNeuer, kreisNamen, vorher);
    expect(stabil.get('06532023')).toBe('wetzlar');
    expect(stabil.get('06999999')).toBe('wetzlar-vogelsbergkreis');
  });
});

describe('Anhang A', () => {
  const text = [
    'Anhang A: bundesweite SEO Prioritätsliste Städte',
    'Einleitung',
    'Berlin',
    'Berlin',
    '',
    'Hessen',
    'Frankfurt am Main • Bad',
    'Homburg vor der Höhe • Wetzlar',
    '• Langen',
    '                     Schlüsselmacher24 • Stand 11.11.2026 • Verbindliche Arbeitsgrundlage',
    '                     SCHLÜSSELMACHER24 | FINALE ARBEITSANWEISUNG WEBSITE UND SHOP',
    'Saarland',
    'Neunkirchen Saar • Gibtsnichtstadt',
    'Technischer Auftrag für die Ortsdatenbank',
  ].join('\n');

  it('liest Länder, Reihenfolge und umbrochene Namen; Seitenköpfe fallen weg', () => {
    expect(anhangALesen(text)).toEqual([
      { land: '11', rang: 1, name: 'Berlin' },
      { land: '06', rang: 1, name: 'Frankfurt am Main' },
      { land: '06', rang: 2, name: 'Bad Homburg vor der Höhe' },
      { land: '06', rang: 3, name: 'Wetzlar' },
      { land: '06', rang: 4, name: 'Langen' },
      { land: '10', rang: 1, name: 'Neunkirchen Saar' },
      { land: '10', rang: 2, name: 'Gibtsnichtstadt' },
    ]);
  });

  it('ordnet nach Name, ohne Klammer, Tabelle; Unklares bleibt offen', () => {
    const z = anhangAZuordnen(anhangALesen(text), gemeinden);
    expect(z.map((e: { zuordnung: string; schluessel: string | null }) => [e.zuordnung, e.schluessel])).toEqual([
      ['name', '11000000'],
      ['name', '06412000'],
      ['tabelle', '06434001'],
      ['name', '06532023'],
      ['ohne-klammer', '06438006'],
      ['tabelle', '10043114'],
      ['offen', null],
    ]);
  });

  it('prüft die Tabelle gegen das Gemeindeverzeichnis', () => {
    expect(() => anhangAZuordnen([], gemeinden, { '06|X': { schluessel: '06532023', pruefung: 'Gießen' } })).toThrow(/Wetzlar/);
    for (const eintrag of Object.values(ZUORDNUNG_ANHANG_A)) {
      expect(gemeinden.find((g) => g.schluessel === eintrag.schluessel)?.name).toContain(eintrag.pruefung);
    }
  });

  it('hält einen unbestätigten Tabelleneintrag offen: Vorschlag und Kandidaten, kein Schlüssel', () => {
    const tabelle = {
      '06|Wetzlar': { schluessel: '06532023', pruefung: 'Wetzlar', bestaetigt: false, kandidaten: ['06532023'], hinweis: 'Probe' },
    };
    // Erfundener Fall (G4): eine zweite Gemeinde „Wetzlar“, damit die Namensregel nicht eindeutig ist.
    const wetzlar = gemeinden.find((g) => g.schluessel === '06532023')!;
    const mitZweiter = [...gemeinden, { ...wetzlar, schluessel: '06999998' }];
    const tabelleProbe = { '06|Wetzlar': { ...tabelle['06|Wetzlar'], kandidaten: ['06532023', '06999998'] } };
    const [e] = anhangAZuordnen([{ land: '06', rang: 1, name: 'Wetzlar' }], mitZweiter, tabelleProbe);
    expect(e).toMatchObject({ zuordnung: 'offen', schluessel: null, vorschlag: '06532023', hinweis: 'Probe' });
    expect(e.kandidaten).toHaveLength(2);
    expect(() => anhangAZuordnen([], gemeinden, { '06|X': { schluessel: '06532023', pruefung: 'Wetzlar', bestaetigt: false, kandidaten: ['06999999'] } })).toThrow(/Kandidat 06999999/);
  });

  it('Amberg bleibt bis zur Bestätigung offen (A-051 Nr. 3)', () => {
    const amberg = prioritaetDatei.eintraege.find((e) => e.land === '09' && e.name === 'Amberg')!;
    expect(amberg).toMatchObject({ rang: 23, schluessel: null, zuordnung: 'offen', vorschlag: '09361000' });
    expect(amberg.kandidaten).toEqual(['Amberg (09361000)', 'Amberg (09778111)']);
  });

  it('führt alle 348 Einträge in der Reihenfolge je Land, Schlüssel für alle außer den offenen', () => {
    expect(prioritaetDatei.anzahl).toBe(348);
    expect(prioritaetDatei.eintraege).toHaveLength(348);
    const offen = prioritaetDatei.eintraege.filter((e) => e.zuordnung === 'offen');
    expect(prioritaetDatei.offen).toBe(offen.length);
    expect(offen.map((e) => e.name)).toEqual(['Amberg']);
    expect(offen.every((e) => e.schluessel === null && (e.kandidaten ?? []).length > 1)).toBe(true);
    const jeLand: Record<string, number> = {};
    for (const e of prioritaetDatei.eintraege) jeLand[e.land] = (jeLand[e.land] ?? 0) + 1;
    // Zählung je Land wie im Abgleich (FA-ABGLEICH Block 04, FA-AA-09).
    expect(jeLand).toEqual({ '08': 38, '09': 37, '11': 1, '12': 18, '04': 2, '02': 1, '06': 35, '13': 12, '03': 35, '05': 67, '07': 22, '10': 9, '14': 19, '15': 16, '01': 19, '16': 17 });
    const zugeordnet = prioritaetDatei.eintraege.filter((e) => e.zuordnung !== 'offen');
    for (const e of zugeordnet) {
      expect(gemeinden.some((g) => g.schluessel === e.schluessel)).toBe(true);
    }
    expect(new Set(zugeordnet.map((e) => e.schluessel)).size).toBe(347);
  });
});

describe('Abgleich der Stände', () => {
  it('meldet Zugänge, Abgänge und Umbenennungen über den Schlüssel', () => {
    const alt = [
      { schluessel: '1', name: 'A' },
      { schluessel: '2', name: 'B' },
    ];
    const neu = [
      { schluessel: '2', name: 'B-Stadt' },
      { schluessel: '3', name: 'C' },
    ];
    expect(staendeVergleichen(alt, neu)).toEqual({
      zugaenge: [{ schluessel: '3', name: 'C' }],
      abgaenge: [{ schluessel: '1', name: 'A' }],
      umbenennungen: [{ schluessel: '2', alt: 'B', neu: 'B-Stadt' }],
    });
  });
});

describe('Dateien des Stamms', () => {
  it('Zahlen und Quellen', () => {
    expect(gemeindenDatei.anzahl).toBe(10751);
    expect(gemeinden).toHaveLength(10751);
    expect(kreiseDatei.kreise).toHaveLength(400);
    expect(plzDatei.postleitzahlen).toHaveLength(10815);
    expect(gemeindenDatei.herkunft.gebietsstand).toBe('31.12.2025');
    expect(gemeindenDatei.quelle).toContain('Statistisches Bundesamt (Destatis)');
    expect(plzDatei.quelle).toContain('CC BY 4.0');
  });

  it('Stichproben: Wetzlar, Lahn-Dill-Kreis, 35576', () => {
    expect(gemeinden.find((g) => g.schluessel === '06532023')).toEqual({
      schluessel: '06532023',
      regionalschluessel: '065320023023',
      name: 'Wetzlar',
      bezeichnung: 'Stadt',
      art: 'stadt',
      slug: 'wetzlar',
      kreis: '06532',
      land: '06',
      plz: '35578',
      breite: 50.55444,
      laenge: 8.50107,
      einwohner: 54865,
    });
    expect(kreiseDatei.kreise.find((k) => k.schluessel === '06532')).toEqual({ schluessel: '06532', name: 'Lahn-Dill-Kreis', art: 'landkreis', land: '06' });
    expect(plzDatei.postleitzahlen.find((p) => p.plz === '35576')).toEqual({
      plz: '35576',
      orte: ['Wetzlar'],
      kreise: ['06532'],
      gemeinden: ['06532023'],
      breite: 50.5665,
      laenge: 8.5247,
    });
  });

  it('jede Gemeinde gehört zu einem Kreis, jeder Gemeindeschlüssel der Postleitzahlen zu einer Gemeinde', () => {
    const kreise = new Set(kreiseDatei.kreise.map((k) => k.schluessel));
    expect(gemeinden.every((g) => kreise.has(g.kreis) && g.schluessel.startsWith(g.kreis))).toBe(true);
    const ags = new Set(gemeinden.map((g) => g.schluessel));
    expect(plzDatei.postleitzahlen.every((p) => p.gemeinden.every((s) => ags.has(s)))).toBe(true);
  });

  it('der Kreis jeder Gemeinde einer Postleitzahl steht in ihrer Kreisliste (auch über den Verwaltungssitz)', () => {
    const kreisVon = new Map(gemeinden.map((g) => [g.schluessel, g.kreis]));
    const fehler = plzDatei.postleitzahlen.filter((p) => p.gemeinden.some((s) => !p.kreise.includes(kreisVon.get(s)!)));
    expect(fehler.map((p) => p.plz)).toEqual([]);
    // 57629: GeoNames nennt nur den Westerwaldkreis, Malberg (Kreis Altenkirchen) kommt über den Verwaltungssitz.
    const p = plzDatei.postleitzahlen.find((x) => x.plz === '57629')!;
    expect(p.gemeinden).toContain('07132066');
    expect(p.kreise).toEqual(['07132', '07143']);
  });

  it('postleitzahlenBilden nimmt mit der Gemeinde des Verwaltungssitzes auch ihren Kreis auf', () => {
    const geo = [{ plz: '99999', ort: 'Probeort', kreis: '07143', breite: 50, laenge: 8 }];
    const probe = [{ ...gemeinden.find((g) => g.schluessel === '07132066')!, plz: '99999' }];
    const [e] = postleitzahlenBilden(geo, probe).liste;
    expect(e.gemeinden).toEqual(['07132066']);
    expect(e.kreise).toEqual(['07132', '07143']);
  });

  it('Quellenvermerke für Seiten tragen Links, GeoNames auch auf die Lizenz (CC BY 4.0)', () => {
    expect(ORTSSTAMM_QUELLEN.gemeinden.url).toMatch(/^https:\/\/www\.destatis\.de\//);
    expect(ORTSSTAMM_QUELLEN.postleitzahlen).toMatchObject({ url: 'https://www.geonames.org', lizenzUrl: 'https://creativecommons.org/licenses/by/4.0/' });
    expect(ORTSSTAMM_QUELLEN.postleitzahlen.text).toContain('CC BY 4.0');
  });

  it('die Ländertabelle des Imports gleicht der der Anwendung', () => {
    expect({ ...LAENDER_IMPORT }).toEqual({ ...LAENDER });
  });

  it('zeilenJson ist gültiges JSON mit einem Datensatz je Zeile', () => {
    const text = zeilenJson({ quelle: 'Q' }, 'liste', [{ a: 1 }, { a: 2 }]);
    expect(JSON.parse(text)).toEqual({ quelle: 'Q', liste: [{ a: 1 }, { a: 2 }] });
    expect(text.split('\n').filter((z: string) => z.startsWith('    {'))).toHaveLength(2);
  });

  it('vergleichsname gleicht Bindestrich, Schrägstrich und Klammer an', () => {
    expect(vergleichsname('Frankfurt (Oder)')).toBe(vergleichsname('Frankfurt Oder'));
    expect(vergleichsname('Mühlhausen/Thüringen')).toBe(vergleichsname('Mühlhausen Thüringen'));
  });
});

/* Gegen die Rohdateien, nur wo sie vorliegen (nicht im Repository, G13). */
describe.skipIf(!existsSync(STANDARD_GV) || !existsSync(STANDARD_GEONAMES))('Rohdateien', () => {
  it('der Stamm entspricht der Jahresausgabe und GeoNames', () => {
    const blaetter = leseXlsx(readFileSync(STANDARD_GV));
    const name = Object.keys(blaetter).find((n) => n.startsWith('Onlineprodukt_Gemeinden'))!;
    const gv = leseGemeindeverzeichnis(blaetter[name]);
    expect(gv.gemeinden).toHaveLength(gemeinden.length);
    expect(gv.kreise).toEqual(kreiseDatei.kreise);
    const geo = leseGeonames(readFileSync(STANDARD_GEONAMES, 'utf8'));
    expect(geo).toHaveLength(23296);
    expect(postleitzahlenBilden(geo, gv.gemeinden).liste).toEqual(plzDatei.postleitzahlen);
  }, 60_000);
});
