import { existsSync, readFileSync } from 'node:fs';
import { deflateRawSync } from 'node:zlib';

import { describe, expect, it } from 'vitest';

import {
  abstandHoechstensEins,
  entsprichtReihe,
  FZ2_PRAEFIX,
  FZ2_QUELLE,
  fuehreZusammen,
  fuehreZusammenMitBericht,
  handelsnameAnzeige,
  herstellerAnzeige,
  istSammelzeile,
  KLASSEN_FOLGE,
  kraftradName,
  kraftraeder,
  leseHandelsnamen,
  leseXlsx,
  markeAusName,
  neueReihe,
  nurAusstattung,
  ohneLaenderkuerzel,
  pkwErgaenzung,
  reihenSchluessel,
  reiheAusHandelsnamen,
  STANDARD_XLSX,
  teile,
  UNTERMARKEN,
} from './fahrzeuge-import-fz2.mjs';
import { behalteBestand, FZ2_PRAEFIX_FREMD } from './fahrzeuge-import.mjs';
import { FAHRZEUGKLASSEN } from '../src/lib/fahrzeuge/katalog';
import { sucheFahrzeuge, UNTERMARKEN as SUCHE_UNTERMARKEN } from '../src/lib/fahrzeuge/suche';
import type { FahrzeugReihe } from '../src/lib/types';

/* Kleine Zip-Datei im Aufbau einer xlsx (G4: erfundene Inhalte), Einträge gespeichert oder komprimiert. */
function zip(dateien: Record<string, string>, komprimiert = true): Buffer {
  const lokal: Buffer[] = [];
  const verzeichnis: Buffer[] = [];
  let pos = 0;
  for (const [name, text] of Object.entries(dateien)) {
    const roh = Buffer.from(text, 'utf8');
    const daten = komprimiert ? deflateRawSync(roh) : roh;
    const n = Buffer.from(name, 'utf8');
    const kopf = Buffer.alloc(30);
    kopf.writeUInt32LE(0x04034b50, 0);
    kopf.writeUInt16LE(komprimiert ? 8 : 0, 8);
    kopf.writeUInt32LE(daten.length, 18);
    kopf.writeUInt32LE(roh.length, 22);
    kopf.writeUInt16LE(n.length, 26);
    lokal.push(kopf, n, daten);
    const z = Buffer.alloc(46);
    z.writeUInt32LE(0x02014b50, 0);
    z.writeUInt16LE(komprimiert ? 8 : 0, 10);
    z.writeUInt32LE(daten.length, 20);
    z.writeUInt32LE(roh.length, 24);
    z.writeUInt16LE(n.length, 28);
    z.writeUInt32LE(pos, 42);
    verzeichnis.push(z, n);
    pos += 30 + n.length + daten.length;
  }
  const vz = Buffer.concat(verzeichnis);
  const ende = Buffer.alloc(22);
  ende.writeUInt32LE(0x06054b50, 0);
  ende.writeUInt16LE(Object.keys(dateien).length, 8);
  ende.writeUInt16LE(Object.keys(dateien).length, 10);
  ende.writeUInt32LE(vz.length, 12);
  ende.writeUInt32LE(pos, 16);
  return Buffer.concat([...lokal, vz, ende]);
}

const MAPPE = '<workbook><sheets><sheet name="FZ 2.6" sheetId="13" r:id="rId9"/></sheets></workbook>';
const BEZUG = '<Relationships><Relationship Id="rId9" Type="x" Target="worksheets/sheet9.xml"/></Relationships>';
const GETEILT = '<sst><si><t>Hersteller&#13;&#10;</t></si><si><r><t>Handels</t></r><r><t>name</t></r></si><si><t xml:space="preserve">A &amp; B</t></si></sst>';
const BLATT =
  '<worksheet><sheetData><row r="7"><c r="B7" t="s"><v>0</v></c><c r="C7" t="s"><v>1</v></c><c r="D7" t="inlineStr"><is><t>Typ</t></is></c></row>'
  + '<row r="8"><c r="B8" t="s"><v>2</v></c><c r="V8"><v>42</v></c></row><row r="9"/></sheetData></worksheet>';

describe('xlsx mit Bordmitteln', () => {
  for (const komprimiert of [true, false]) {
    it(`liest geteilte Texte, Inline-Texte und Zahlen (${komprimiert ? 'deflate' : 'gespeichert'})`, () => {
      const datei = zip(
        { 'xl/workbook.xml': MAPPE, 'xl/_rels/workbook.xml.rels': BEZUG, 'xl/sharedStrings.xml': GETEILT, 'xl/worksheets/sheet9.xml': BLATT },
        komprimiert,
      );
      const blaetter = leseXlsx(datei);
      expect(Object.keys(blaetter)).toEqual(['FZ 2.6']);
      expect(blaetter['FZ 2.6'][0]).toEqual({ B: 'Hersteller\r\n', C: 'Handelsname', D: 'Typ' });
      expect(blaetter['FZ 2.6'][1]).toEqual({ B: 'A & B', V: '42' });
      expect(blaetter['FZ 2.6'][2]).toEqual({});
    });
  }

  it('bricht ohne Zip-Verzeichnis ab', () => {
    expect(() => leseXlsx(Buffer.from('keine zip-datei, nur text, lang genug für das ende'))).toThrow(/Keine Zip-Datei/);
  });
});

/* Erfundenes Blatt im Aufbau von FZ 2.6 (Spalte V „Deutschland“, Fortsetzungszeilen ohne Handelsname). */
const KOPF = { B: 'Hersteller\r\n', C: 'Handelsname', D: 'Typ-Schl.-Nr.', E: 'Baden-\r\nWürttemberg', V: 'Deutschland' };
function blattKraftrad(insgesamt = 1046) {
  return [
    {},
    { B: 'FZ 2.6 Bestand an Krafträdern' },
    KOPF,
    { B: 'MUSTER MOTO (I)', C: '', D: 'AAA', E: '1', V: '5' },
    { C: 'ALPHA 125', D: '001', E: '-', V: '100' },
    { D: '002', E: '3', V: '50' },
    { C: 'Alpha 125', D: 'AAB', V: '20' },
    { C: 'MUSTER MOTO BETA 300,BETA 300 R', D: '003', V: '300' },
    { C: 'SONSTIGE/NICHT GETYPT', D: '', V: '70' },
    { C: 'ZUSAMMEN', V: '545' },
    { B: 'MUSTER MOTO (J)', C: 'GAMMA', D: '010', V: '400' },
    { C: 'ZUSAMMEN', V: '400' },
    { B: 'SONSTIGE HERSTELLER', C: 'ZUSAMMEN', V: '101' },
    { B: 'INSGESAMT', V: String(insgesamt) },
    {},
    { B: 'Hinweise:' },
  ];
}

describe('Tabellen nach Herstellern und Handelsnamen', () => {
  it('liest Fortsetzungszeilen und prüft die Summen des KBA', () => {
    const { typen, insgesamt } = leseHandelsnamen(blattKraftrad(), 'FZ 2.6', { anzahl: 'Deutschland' });
    expect(insgesamt.anzahl).toBe(1046);
    expect(typen.map((t) => [t.handelsname, t.anzahl])).toEqual([
      ['', 5],
      ['ALPHA 125', 100],
      ['ALPHA 125', 50],
      ['Alpha 125', 20],
      ['MUSTER MOTO BETA 300,BETA 300 R', 300],
      ['SONSTIGE/NICHT GETYPT', 70],
      ['GAMMA', 400],
    ]);
  });

  it('bricht ab, wenn eine Summe nicht aufgeht', () => {
    expect(() => leseHandelsnamen(blattKraftrad(9999), 'FZ 2.6', { anzahl: 'Deutschland' })).toThrow(/KBA nennt 9999/);
    const falsch = blattKraftrad();
    falsch[9] = { C: 'ZUSAMMEN', V: '546' };
    expect(() => leseHandelsnamen(falsch, 'FZ 2.6', { anzahl: 'Deutschland' })).toThrow(/Summe für „MUSTER MOTO \(I\)“/);
  });

  it('bricht ohne Kopfzeile oder bei fremden Werten ab', () => {
    expect(() => leseHandelsnamen([{ B: 'Marke' }], 'FZ 2.6', { anzahl: 'Deutschland' })).toThrow(/Kopfzeile/);
    const falsch = blattKraftrad();
    falsch[4] = { C: 'ALPHA 125', D: '001', V: 'x' };
    expect(() => leseHandelsnamen(falsch, 'FZ 2.6', { anzahl: 'Deutschland' })).toThrow(/keine Bestandszahl/);
  });

  it('erkennt Sammelzeilen', () => {
    expect(istSammelzeile('SONSTIGE/NICHT GETYPT')).toBe(true);
    expect(istSammelzeile('NICHT GETYPT')).toBe(true);
    expect(istSammelzeile('ZUSAMMEN')).toBe(true);
    expect(istSammelzeile('Sonstige')).toBe(true);
    expect(istSammelzeile('SONNE 50')).toBe(false);
  });
});

describe('Anzeigename der Marke (feste Regel, R4)', () => {
  it('entfernt Länderkürzel und normalisiert die Großschreibung', () => {
    expect(ohneLaenderkuerzel('APRILIA (I)')).toBe('APRILIA');
    expect(ohneLaenderkuerzel('HARLEY-DAVIDSON(USA)')).toBe('HARLEY-DAVIDSON');
    expect(ohneLaenderkuerzel('MAZDA (B/J/USA/RC)')).toBe('MAZDA');
    expect(herstellerAnzeige('APRILIA (I)')).toBe('Aprilia');
    expect(herstellerAnzeige('HARLEY-DAVIDSON(USA)')).toBe('Harley-Davidson');
    expect(herstellerAnzeige('INDIAN MOTORCYCLE (USA)')).toBe('Indian Motorcycle');
    expect(herstellerAnzeige('KAWASAKI (J)')).toBe('Kawasaki');
  });

  it('nimmt Sonderfälle aus der Aliasliste', () => {
    expect(herstellerAnzeige('BMW')).toBe('BMW');
    expect(herstellerAnzeige('KTM (A)')).toBe('KTM');
    expect(herstellerAnzeige('MV AGUSTA (I)')).toBe('MV Agusta');
    expect(herstellerAnzeige('MOTO-GUZZI (I)')).toBe('Moto Guzzi');
    expect(herstellerAnzeige('HONDA MOTOR (J)')).toBe('Honda');
    expect(herstellerAnzeige('HONDA (THA)')).toBe('Honda');
    expect(herstellerAnzeige('ZUENDAPP-WERKE')).toBe('Zündapp');
  });

  it('bricht bei Kurzwörtern, Punkten und Ziffern ohne Aliaseintrag ab, statt zu raten', () => {
    expect(() => herstellerAnzeige('ABC (RC)')).toThrow(/Kurzwort „ABC“/);
    expect(() => herstellerAnzeige('MOTO XY (I)')).toThrow(/Kurzwort „XY“/);
    expect(() => herstellerAnzeige('NORD.WERKE')).toThrow(/HERSTELLER_ALIAS/);
    expect(() => herstellerAnzeige('WERK 2000')).toThrow(/HERSTELLER_ALIAS/);
  });

  it('schreibt Handelsnamen lesbar, Kürzel und Ziffernwörter bleiben', () => {
    expect(handelsnameAnzeige('ETV 1000 CAPO NORD')).toBe('ETV 1000 Capo Nord');
    expect(handelsnameAnzeige('Mojito 125')).toBe('Mojito 125');
    expect(handelsnameAnzeige('RS 125,TUONO')).toBe('RS 125, Tuono');
  });

  it('schreibt Umlaute nur für Wörter der Liste zurück (echte Namen aus FZ 2)', () => {
    expect(handelsnameAnzeige('KAEFER')).toBe('Käfer');
    expect(handelsnameAnzeige('KAPITAEN-P-L')).toBe('Kapitän-P-L');
    expect(handelsnameAnzeige('F 650 GS MILITAER')).toBe('F 650 GS Militär');
    expect(handelsnameAnzeige('PHAETON')).toBe('Phaeton');
    expect(handelsnameAnzeige('E 220 BLUETEC')).toBe('E 220 Bluetec');
    expect(handelsnameAnzeige('ZOE')).toBe('ZOE');
  });
});

describe('Teile eines Handelsnamens', () => {
  it('trennt an „oder“ nur als eigenes Wort (echte Namen aus FZ 2)', () => {
    expect(teile('Chevrolet Orlando')).toEqual(['Chevrolet Orlando']);
    expect(teile('BRUTALE ORO;BRUTALE S')).toEqual(['BRUTALE ORO', 'BRUTALE S']);
    expect(teile('Orlando,Chevrolet Orlando')).toEqual(['Orlando', 'Chevrolet Orlando']);
    expect(teile('Carens or Rondo')).toEqual(['Carens', 'Rondo']);
    expect(teile('J125 or J125 ABS')).toEqual(['J125', 'J125 ABS']);
    expect(teile('THALIA,THALIA oder SYMBOL')).toEqual(['THALIA', 'THALIA', 'SYMBOL']);
    expect(teile('JB,RIO,JB od.RIO')).toEqual(['JB', 'RIO', 'JB', 'RIO']);
    expect(teile('PARTNER OD.RANCH')).toEqual(['PARTNER', 'RANCH']);
    expect(teile('TRANSPORTER o. CARAVELLE')).toEqual(['TRANSPORTER', 'CARAVELLE']);
  });

  it('nimmt „BRUTALE ORO“ als eigenen Kraftradnamen', () => {
    expect(kraftradName('BRUTALE ORO;BRUTALE S', 'MV AGUSTA (I)', 'MV Agusta')).toEqual({ reihe: 'Brutale ORO', weitere: ['Brutale S'] });
  });
});

describe('Krafträder aus FZ 2.6', () => {
  it('bildet je Hersteller und Handelsname eine Zeile, Bestände summiert', () => {
    const { reihen, zaehler } = kraftraeder(blattKraftrad());
    expect(reihen.map((r: { marke: string; reihe: string; bestand: number }) => [r.marke, r.reihe, r.bestand])).toEqual([
      ['Muster Moto', 'Alpha 125', 170],
      ['Muster Moto', 'Beta 300', 300],
      ['Muster Moto', 'Gamma', 400],
    ]);
    expect(zaehler).toMatchObject({ sammel: 1, sammelBestand: 70, ohneName: 1, ohneNameBestand: 5, hersteller: 2, marken: 1, handelsnamen: 3 });
    const [alpha, beta] = reihen;
    expect(alpha).toMatchObject({ id: 'kraftrad-muster-moto-alpha-125', klasse: 'kraftrad', quelle: FZ2_QUELLE, leistungen: [], klonbar: 'unbekannt', gehaeuse: 'unbekannt', sichtbar: true });
    expect(alpha.kbaName).toBe('MUSTER MOTO (I): ALPHA 125 / Alpha 125');
    expect(beta.alias).toEqual(['Beta 300 R']);
  });

  it('nimmt den Herstellernamen vorn weg und lässt einen gekürzten letzten Teil fallen', () => {
    expect(kraftradName('KTM 125 DUKE', 'KTM (A)', 'KTM')).toEqual({ reihe: '125 Duke', weitere: [] });
    expect(kraftradName('BMW R850 GS, BMW R850 R', 'BMW', 'BMW')).toEqual({ reihe: 'R850 GS', weitere: ['R850 R'] });
    // Genau 25 Zeichen: Das KBA hat gekürzt, „R 12“ ist kein Name.
    expect(kraftradName('R 1200 GS Adventure, R 12', 'BMW', 'BMW')).toEqual({ reihe: 'R 1200 GS Adventure', weitere: [] });
  });
});

describe('Pkw aus FZ 2.2: Marke und Abgleich mit FZ 12 (echte Namen aus der Datei)', () => {
  const reihe = (marke: string, name: string, alias?: string[]) => ({ id: `${marke}-${name}`.toLowerCase(), marke, reihe: name, alias, quelle: 'FZ 12', klonbar: 'unbekannt', gehaeuse: 'unbekannt', leistungen: [], sichtbar: true });

  it('erkennt Untermarken am Markenwort im Namen', () => {
    expect(markeAusName('CUPRA LEON SP')).toEqual({ marke: 'Cupra', rest: 'LEON SP' });
    expect(markeAusName('ABARTH 124 Spider')).toEqual({ marke: 'Abarth', rest: '124 Spider' });
    expect(markeAusName('500 ABARTH')).toEqual({ marke: 'Abarth', rest: '500' });
    expect(markeAusName('BMW ALPINA B3 BITURBO')).toEqual({ marke: 'Alpina', rest: 'B3 BITURBO' });
    expect(markeAusName('Genesis GV80')).toEqual({ marke: 'Genesis', rest: 'GV80' });
    expect(markeAusName('MAZDA2')).toEqual({ marke: 'Mazda', rest: '2' });
    expect(markeAusName('RANGE ROVER SPORT')).toEqual({ marke: 'Land Rover', rest: 'RANGE ROVER SPORT' });
    expect(markeAusName('LEON')).toBeNull();
  });

  it('ordnet Handelsnamen vorhandenen Reihen zu', () => {
    const liste = reihenSchluessel([
      reihe('Volkswagen', 'Golf'),
      reihe('Mercedes-Benz', 'E-Klasse'),
      reihe('BMW', '3er'),
      reihe('Volvo', '40'),
      reihe('DS', '3'),
      reihe('Honda', 'e'),
      reihe('Suzuki', 'SX4 S-Cross'),
    ]);
    expect(entsprichtReihe('GOLF VARIANT', liste)?.reihe).toBe('Golf');
    expect(entsprichtReihe('E 220 CDI', liste)?.reihe).toBe('E-Klasse');
    expect(entsprichtReihe('320D', liste)?.reihe).toBe('3er');
    expect(entsprichtReihe('V40', liste)?.reihe).toBe('40');
    expect(entsprichtReihe('S 40', liste)?.reihe).toBe('40');
    expect(entsprichtReihe('3 Cabrio', liste)?.reihe).toBe('3');
    expect(entsprichtReihe('SX4', liste)?.reihe).toBe('SX4 S-Cross');
    expect(entsprichtReihe('e:Ny1', liste)).toBeNull();
    expect(entsprichtReihe('M3', liste)).toBeNull();
    expect(entsprichtReihe('400', liste)).toBeNull();
  });

  it('bildet Reihennamen und erkennt reine Ausstattungswörter', () => {
    expect(neueReihe('P 601 A')).toBe('P 601');
    expect(neueReihe('2 CV 4')).toBe('2 CV');
    expect(neueReihe('200 SX')).toBe('200 SX');
    expect(neueReihe('300 ZX')).toBe('300 ZX');
    expect(neueReihe('SUPER V8')).toBe('SUPER V8');
    expect(neueReihe('240 GL')).toBe('240');
    expect(neueReihe('3200 GT')).toBe('3200');
    expect(neueReihe('STREET KA')).toBe('STREET KA');
    expect(neueReihe('XD3 BITURBO')).toBe('XD3');
    expect(nurAusstattung('GL')).toBe(true);
    expect(nurAusstattung('SPORT')).toBe(true);
    expect(nurAusstattung('Taunus')).toBe(false);
  });

  /* Erfundene Bestände, echte Handelsnamen aus FZ 2.2 (Spalte I „Insgesamt“, J „Wohnmobile“). */
  const KOPF_PKW = { B: 'Hersteller\r\n', C: 'Handelsname', D: 'Typ-Schl.-Nr.', I: 'Insgesamt', J: 'Und zwar' };
  const blattPkw = [
    KOPF_PKW,
    { J: 'Wohnmobile' },
    { B: 'SEAT (E)', C: 'CUPRA LEON', D: 'A1', I: '10', J: '-' },
    { C: 'LEON ST', D: 'A2', I: '20', J: '-' },
    { C: 'MARBELLA', D: 'A3', I: '5', J: '-' },
    { C: 'ZUSAMMEN', I: '35' },
    { B: 'FCA (I)', C: '500 ABARTH', D: 'B1', I: '7', J: '-' },
    { C: 'Trend I 7057,Trend A 6977', D: 'B2', I: '9', J: '8' },
    { C: 'PANDA', D: 'B3', I: '4', J: '-' },
    { C: 'ZUSAMMEN', I: '20' },
    { B: 'BMW', C: 'Cooper', D: 'C1', I: '3', J: '-' },
    { C: 'Cooper Clubman,MINI', D: 'C2', I: '2', J: '-' },
    { C: 'GL', D: 'C3', I: '2', J: '-' },
    { C: 'ZUSAMMEN', I: '7' },
    { B: 'INSGESAMT', I: '62' },
  ];

  it('übernimmt nur, was keiner Reihe entspricht, ohne Wohnmobil-Aufbauten und Ausstattungswörter', () => {
    const katalog = [reihe('SEAT', 'Leon'), reihe('Fiat', '500'), reihe('Fiat', 'Panda'), reihe('MINI', 'Mini')];
    const { reihen, zaehler } = pkwErgaenzung(blattPkw, katalog);
    expect(reihen.map((r: { marke: string; reihe: string; bestand: number }) => [r.marke, r.reihe, r.bestand])).toEqual([
      ['Cupra', 'Leon', 10],
      ['SEAT', 'Marbella', 5],
      ['Abarth', '500', 7],
      ['MINI', 'Cooper', 5],
    ]);
    expect(zaehler.wohnmobil).toBe(1);
    expect(zaehler.ausstattung).toEqual(['BMW: GL']);
    expect(zaehler.ohneMarke).toEqual(['FCA (I): PANDA']);
    expect(zaehler.neueMarken).toEqual(['Abarth', 'Cupra']);
  });

  it('ordnet MINI-Handelsnamen ohne Markenwort unter BMW der Marke MINI zu', () => {
    expect(reiheAusHandelsnamen('Countryman Cooper SD ALL4', 'BMW')).toEqual({ marke: 'MINI', reihe: 'Countryman' });
    expect(reiheAusHandelsnamen('JCW Aceman E', 'BMW')).toEqual({ marke: 'MINI', reihe: 'John Cooper Works' });
    expect(reiheAusHandelsnamen('JohnCooperWorks Cabrio', 'BMW')).toEqual({ marke: 'MINI', reihe: 'John Cooper Works' });
    expect(reiheAusHandelsnamen('ONE D', undefined, 'MINI')).toEqual({ marke: 'MINI', reihe: 'One' });
    expect(reiheAusHandelsnamen('X1 sDrive18d', 'BMW')).toBeNull();
    expect(reiheAusHandelsnamen('Countryman', 'OPEL')).toBeNull();
    const blatt = [
      KOPF_PKW,
      { J: 'Wohnmobile' },
      { B: 'BMW', C: 'Countryman Cooper', D: 'C1', I: '7', J: '-' },
      { C: 'Clubman One D', D: 'C2', I: '3', J: '-' },
      { C: 'Aceman SE', D: 'C3', I: '2', J: '-' },
      { C: 'JCW Countryman ALL4', D: 'C4', I: '4', J: '-' },
      { C: 'John Cooper Works,MINI', D: 'C5', I: '1', J: '-' },
      { C: 'X7 M50d', D: 'C6', I: '5', J: '-' },
      { C: 'ZUSAMMEN', I: '22' },
      { B: 'INSGESAMT', I: '22' },
    ];
    const { reihen } = pkwErgaenzung(blatt, [reihe('MINI', 'Mini'), reihe('BMW', 'X7')]);
    expect(reihen.map((r: { marke: string; reihe: string; bestand: number }) => [r.marke, r.reihe, r.bestand])).toEqual([
      ['MINI', 'Countryman', 7],
      ['MINI', 'Clubman', 3],
      ['MINI', 'Aceman', 2],
      ['MINI', 'John Cooper Works', 5],
    ]);
  });

  it('erkennt Reihen mit Markenwort, Vorsilbe, Vorsatz, Schrägstrich und Schreibfehler (echte Namen aus FZ 2.2)', () => {
    const blatt = [
      KOPF_PKW,
      { J: 'Wohnmobile' },
      { B: 'GREAT WALL MOTOR (RC)', C: 'WEY 05', D: 'G1', I: '5', J: '-' },
      { C: 'ZUSAMMEN', I: '5' },
      { B: 'MG ROVER (UK)', C: 'MG TF', D: 'M1', I: '4', J: '-' },
      { C: 'MG TF;MGF', D: 'M2', I: '3', J: '-' },
      { C: 'ZUSAMMEN', I: '7' },
      { B: 'SAIC (RC)', C: 'MG ZS', D: 'S1', I: '6', J: '-' },
      { C: 'MG Marvel R Electric', D: 'S2', I: '2', J: '-' },
      { C: 'ZUSAMMEN', I: '8' },
      { B: 'KIA MOTORS (ROK)', C: 'Kia LD/Kia Cerato', D: 'K1', I: '2', J: '-' },
      { C: 'ZUSAMMEN', I: '2' },
      { B: 'SKODA (CZ)', C: 'SKODA SUBERB', D: 'K2', I: '3', J: '-' },
      { C: 'ZUSAMMEN', I: '3' },
      { B: 'DAIMLER (D)', C: 'AMG A 35 4MATIC', D: 'D1', I: '9', J: '-' },
      { C: '230 CE', D: 'D2', I: '2', J: '-' },
      { C: '230 SL', D: 'D3', I: '1', J: '-' },
      { C: 'ZUSAMMEN', I: '12' },
      { B: 'CHEVROLET (USA)', C: 'Chevrolet Orlando', D: 'H1', I: '3', J: '-' },
      { C: 'ZUSAMMEN', I: '3' },
      { B: 'INSGESAMT', I: '40' },
    ];
    const katalog = [
      reihe('GWM', 'WEY 05'),
      reihe('MG', 'Rover MGF, MG TF'),
      reihe('MG', 'Roewe ZS'),
      reihe('MG', 'Roewe Marvel'),
      reihe('Kia', 'Cerato'),
      reihe('Škoda', 'Superb'),
      reihe('Mercedes-Benz', 'A-Klasse'),
      reihe('Chevrolet', 'Orlando'),
    ];
    const { reihen, zaehler } = pkwErgaenzung(blatt, katalog);
    expect(reihen.map((r: { marke: string; reihe: string; bestand: number }) => [r.marke, r.reihe, r.bestand])).toEqual([['Mercedes-Benz', '230', 3]]);
    expect(zaehler.entspricht).toBe(9);
  });

  it('erkennt mögliche Schreibfehler mit Abstand 1', () => {
    expect(abstandHoechstensEins('suberb', 'superb')).toBe(true);
    expect(abstandHoechstensEins('xceed', 'ceed')).toBe(true);
    expect(abstandHoechstensEins('superb', 'superb')).toBe(true);
    expect(abstandHoechstensEins('kodiaq', 'karoq')).toBe(false);
  });

  it('hält die Untermarken von Import und Suche gleich', () => {
    const klein = (liste: Record<string, string>) => Object.fromEntries(Object.entries(liste).map(([k, v]) => [k.toLowerCase(), v.toLowerCase()]));
    expect(klein(UNTERMARKEN)).toEqual(klein(SUCHE_UNTERMARKEN));
  });
});

describe('Zusammenführen', () => {
  const zeile = (id: string, quelle: string, klasse?: string) => ({ id, marke: 'M', reihe: id, quelle, ...(klasse ? { klasse } : {}), klonbar: 'unbekannt', gehaeuse: 'unbekannt', leistungen: [], sichtbar: true });

  it('ersetzt frühere FZ-2-Zeilen, setzt fehlende Klasse auf pkw und lehnt doppelte Kennungen ab', () => {
    const alt = [zeile('a', 'FZ 12'), zeile('b', `${FZ2_PRAEFIX} alt`, 'kraftrad')];
    const neu = fuehreZusammen(alt, [zeile('c', FZ2_QUELLE, 'kraftrad')]);
    expect(neu.map((r: { id: string; klasse: string }) => [r.id, r.klasse])).toEqual([['a', 'pkw'], ['c', 'kraftrad']]);
    expect(() => fuehreZusammen(alt, [zeile('a', FZ2_QUELLE, 'pkw')])).toThrow(/doppelt/);
  });

  it('ordnet die Klassen wie die Auswahlliste des Backends', () => {
    expect(KLASSEN_FOLGE).toEqual(FAHRZEUGKLASSEN.map((k) => k.value));
  });

  it('behält gepflegte Felder einer FZ-2-Zeile beim erneuten Lauf', () => {
    const generationen = [{ bezeichnung: 'KL', baujahrVon: 2020, quelle: 'Test' }];
    const alt = [zeile('a', 'FZ 12'), { ...zeile('kraftrad-x', FZ2_QUELLE, 'kraftrad'), generationen, sichtbar: false }];
    const neu = fuehreZusammen(alt, [zeile('kraftrad-x', FZ2_QUELLE, 'kraftrad')]);
    expect(neu.find((r: { id: string }) => r.id === 'kraftrad-x')).toMatchObject({ generationen, sichtbar: false });
    // Ein zweiter Lauf ändert nichts mehr.
    expect(fuehreZusammen(neu, [zeile('kraftrad-x', FZ2_QUELLE, 'kraftrad')])).toEqual(neu);
  });

  it('bricht ab, wenn eine FZ-2-Zeile mit Generationen wegfiele', () => {
    const alt = [{ ...zeile('b', FZ2_QUELLE, 'pkw'), generationen: [{ bezeichnung: 'I', quelle: 'Test' }] }, zeile('c', FZ2_QUELLE, 'pkw')];
    expect(fuehreZusammenMitBericht(alt, []).verloren.map((r: { id: string }) => r.id)).toEqual(['b']);
    expect(() => fuehreZusammen(alt, [])).toThrow(/gepflegten Angaben fielen weg: b/);
  });

  it('übersteht FZ 12 und FZ 2 hintereinander ohne Verlust (wiederholbar, G6)', () => {
    expect(FZ2_PRAEFIX_FREMD).toBe(FZ2_PRAEFIX);
    const gen = [{ bezeichnung: 'G1', quelle: 'Test' }];
    // Stand nach beiden Läufen: FZ-12-Zeile mit Generation, Pkw und Kraftrad aus FZ 2, eines mit Generation.
    const stand = fuehreZusammen(
      [{ ...zeile('golf', 'FZ 12'), generationen: gen }],
      [zeile('cupra-leon', FZ2_QUELLE, 'pkw'), { ...zeile('kraftrad-y', FZ2_QUELLE, 'kraftrad') }],
    ).map((r: { id: string }) => (r.id === 'kraftrad-y' ? { ...r, generationen: gen } : r));
    // FZ-12-Lauf: dieselbe FZ-12-Zeile frisch ohne Klasse und Generation.
    const nachFz12 = behalteBestand([zeile('golf', 'FZ 12')], stand);
    expect(nachFz12.verloren).toEqual([]);
    expect(nachFz12.behalten).toBe(2);
    expect(nachFz12.katalog).toEqual(stand);
    // FZ-2-Lauf danach: wieder derselbe Stand.
    expect(fuehreZusammen(nachFz12.katalog, [zeile('cupra-leon', FZ2_QUELLE, 'pkw'), zeile('kraftrad-y', FZ2_QUELLE, 'kraftrad')])).toEqual(stand);
    // Fiele die FZ-12-Zeile mit Generation weg, wird sie genannt.
    expect(behalteBestand([], stand).verloren).toEqual(['golf']);
  });
});

/* Der übernommene Katalog selbst: keine Dubletten und keine zerlegten Namen (Gegenprüfung FA-KERN-01). */
describe('Katalog content/fahrzeugkatalog.json nach FZ 2', () => {
  const katalog = JSON.parse(readFileSync(new URL('../content/fahrzeugkatalog.json', import.meta.url), 'utf8')) as FahrzeugReihe[];
  const finde = (text: string, klasse: 'pkw' | 'kraftrad' = 'pkw') =>
    sucheFahrzeuge(text, katalog, { hoechstens: 6, klasse }).map((t) => `${t.reihe.marke} ${t.reihe.reihe}`);

  it('führt keine zerlegten oder doppelten Reihen', () => {
    const ids = new Set(katalog.map((r) => r.id));
    for (const id of ['chevrolet-lando', 'kia-ld-kia', 'skoda-suberb', 'gwm-05', 'mg-tf', 'mg-zs', 'bmw-countryman', 'bmw-clubman', 'bmw-jcw']) {
      expect(ids.has(id), id).toBe(false);
    }
    expect(finde('Chevrolet Orlando')).toEqual(['Chevrolet Orlando']);
    expect(finde('Skoda Superb')).toEqual(['Škoda Superb']);
  });

  it('findet MINI-Modelle unter MINI', () => {
    expect(finde('Mini Countryman')[0]).toBe('MINI Countryman');
    expect(finde('Mini Clubman')[0]).toBe('MINI Clubman');
    expect(finde('Mini John Cooper Works')[0]).toBe('MINI John Cooper Works');
    expect(finde('BMW Countryman')).toEqual([]);
  });

  it('zeigt Umlaute und volle Namen', () => {
    expect(finde('VW Käfer')[0]).toBe('Volkswagen Käfer');
    expect(finde('Nissan 200 SX')[0]).toBe('Nissan 200 SX');
    expect(finde('Vespa GTS 125', 'kraftrad')[0]).toBe('Piaggio Vespa GTS 125');
  });
});

/* Gegenprobe mit der echten Rohdatei, nur wo sie liegt (nicht im Repository, G13). */
describe.skipIf(!existsSync(STANDARD_XLSX))('Stichproben gegen KBA FZ 2 (lokal)', () => {
  it('liest die Blätter und belegt drei Stichproben', () => {
    const blaetter = leseXlsx(readFileSync(STANDARD_XLSX), ['FZ 2.6']);
    const { reihen, zaehler } = kraftraeder(blaetter['FZ 2.6']);
    expect(zaehler.insgesamt).toBe(5071468);
    const finde = (marke: string, name: string) => reihen.find((r: { marke: string; reihe: string }) => r.marke === marke && r.reihe === name);
    // KAWASAKI (J): „Z900“ 20.349 (13 Typschlüssel) und „Z900,Z900 ABS“ 6.359.
    expect(finde('Kawasaki', 'Z900')?.bestand).toBe(26708);
    expect(finde('Aprilia', 'Pegaso 650')?.bestand).toBe(521);
    expect(finde('Zündapp', 'Bella 203')?.bestand).toBe(144);
  });
});

