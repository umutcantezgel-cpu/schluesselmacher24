import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

import { pruefeCodeMuster as pruefeImBackend } from '@/lib/code-pattern';
import { defaults } from '@/lib/data/defaults';
import { codeLineZuPayload } from '@/lib/data/payload-mapping';
import type { CodeLine, ShopHersteller } from '@/lib/types';

import {
  FREIWILLIGE_SPALTEN,
  SPALTEN,
  arbeiteEin,
  formatBeschreibung,
  importiere,
  leseSortiment,
  preisInCent,
  pruefeCodeMuster,
  pruefeSortiment,
} from './sortiment-import.mjs';

/* Erfundene Testdaten (G4): Hersteller „Testwerk“, Systeme und Preise nur zur Prüfung der Mechanik. */
const KOPF = SPALTEN.join(';');
const HERSTELLER: ShopHersteller[] = [{ id: 'testwerk', slug: 'testwerk', name: 'Testwerk', einsatz: 'Test', angeboten: true, reihenfolge: 10 }];
const KATEGORIEN = [
  ...defaults.kategorien(),
  { ...defaults.kategorien()[0], id: 'briefkasten', slug: 'briefkasten', name: 'Briefkasten', eltern: 'schluessel-nach-code' },
];

function zeile(felder: Partial<Record<(typeof SPALTEN)[number], string>> = {}): string {
  const werte = {
    hersteller: 'Testwerk',
    system: 'TX 100',
    codebereich: '1 bis 500',
    beispielcode: '0812',
    codeformat: '^[0-9]{3,4}$',
    preis: '9,90',
    staffel: '3:8,90|5:7,90',
    max_stueck: '20',
    hinweise: 'Code steht auf dem Schlosskörper.',
    bild_datei: 'tx100.jpg',
    kategorie: '',
    quelle: 'Eigenes Angebot Nr. 1 (Test)',
    ...felder,
  };
  return SPALTEN.map((spalte: string) => `"${(werte as Record<string, string>)[spalte]}"`).join(';');
}
const tabelle = (...zeilen: string[]) => [KOPF, ...zeilen].join('\r\n');
const lauf = (text: string, bestand: CodeLine[] = []) => importiere({ text, bestand, hersteller: HERSTELLER, kategorien: KATEGORIEN });

describe('Sortiment einlesen und prüfen', () => {
  it('übernimmt eine vollständige Zeile mit Hersteller, System, Codebereich, Staffel und Kategorie, ohne example', () => {
    const ergebnis = lauf(tabelle(zeile(), zeile({ system: 'TX 200', codebereich: 'A001 bis A500', beispielcode: 'A123', codeformat: '^[A-Z][0-9]{3}$', staffel: '', kategorie: 'Briefkasten' })));
    expect(ergebnis.ok).toBe(true);
    expect(ergebnis.fehler).toEqual([]);
    const [a, b] = ergebnis.liste as CodeLine[];
    expect(a).toMatchObject({
      id: 'testwerk-tx-100-1-bis-500',
      name: 'Testwerk TX 100, Codebereich 1 bis 500',
      manufacturer: 'Testwerk',
      manufacturerId: 'testwerk',
      system: 'TX 100',
      codeRange: '1 bis 500',
      codePattern: '^[0-9]{3,4}$',
      codeExample: '0812',
      codeFormatLabel: '3 bis 4 Ziffern',
      priceCents: 990,
      bulkPrices: [
        { minQty: 3, priceCents: 890 },
        { minQty: 5, priceCents: 790 },
      ],
      maxQty: 20,
      availability: 'lieferbar',
      categoryId: 'schluessel-nach-code',
      active: false,
      tags: [],
    });
    expect(a).not.toHaveProperty('example');
    expect(a.productImage.note).toContain('tx100.jpg');
    expect(b).toMatchObject({ categoryId: 'briefkasten', codeFormatLabel: '1 Großbuchstabe, dann 3 Ziffern' });
    expect(b).not.toHaveProperty('bulkPrices');
  });

  it('lehnt eine Zeile ohne Pflichtfeld ab und übernimmt nichts', () => {
    const ergebnis = lauf(tabelle(zeile(), zeile({ system: '', codebereich: '2 bis 9' })));
    expect(ergebnis.ok).toBe(false);
    expect(ergebnis.fehler).toEqual(['Zeile 3: Pflichtfeld leer: system']);
    expect(ergebnis.liste).toEqual([]);
  });

  it('lehnt ein falsches Preisformat ab', () => {
    for (const preis of ['9,9', '9,90 €', 'neun', '0', '-3']) {
      const ergebnis = lauf(tabelle(zeile({ preis, staffel: '' })));
      expect(ergebnis.ok, preis).toBe(false);
      expect(ergebnis.fehler[0], preis).toMatch(/Preis .* kein gültiges Format/);
    }
    expect(preisInCent('12,50')).toBe(1250);
    expect(preisInCent('12.50')).toBe(1250);
    expect(preisInCent('12')).toBe(1200);
  });

  it('übernimmt Linien nur als Entwurf: unsichtbar ohne Datenbank, der Seed legt sie nicht veröffentlicht an', () => {
    const ergebnis = lauf(tabelle(zeile()));
    expect(ergebnis.ok).toBe(true);
    const [linie] = ergebnis.liste as CodeLine[];
    expect(linie.active).toBe(false);
    expect(codeLineZuPayload(linie)._status).toBe('draft');
  });

  it('prüft den Beispielcode genau wie das Backend (Kleinbuchstaben nur, wenn das Muster sie erlaubt)', () => {
    expect(lauf(tabelle(zeile({ beispielcode: 'a123', codeformat: '^[A-Z][0-9]{3}$' }))).fehler).toEqual([
      'Zeile 2: Beispielcode „a123“ passt nicht zum Prüfmuster ^[A-Z][0-9]{3}$',
    ]);
    expect(lauf(tabelle(zeile({ beispielcode: 'a123', codeformat: '^[A-Za-z][0-9]{3}$' }))).ok).toBe(true);
  });

  it('lehnt ein Prüfmuster ab, das nicht zum Beispielcode passt oder fehlerhaft ist', () => {
    expect(lauf(tabelle(zeile({ beispielcode: 'AB12' }))).fehler).toEqual([
      'Zeile 2: Beispielcode „AB12“ passt nicht zum Prüfmuster ^[0-9]{3,4}$',
    ]);
    expect(lauf(tabelle(zeile({ codeformat: '[0-9]{4}' }))).fehler[0]).toMatch(/muss mit \^ beginnen/);
    expect(lauf(tabelle(zeile({ codeformat: '^(a+)+$', beispielcode: 'aa' }))).fehler[0]).toMatch(/Verschachtelte/);
  });

  it('prüft Staffel und Höchstmenge', () => {
    expect(lauf(tabelle(zeile({ staffel: '3:9,90' }))).fehler[0]).toMatch(/nicht günstiger/);
    expect(lauf(tabelle(zeile({ staffel: '5:7,90|3:8,90' }))).fehler[0]).toMatch(/aufsteigen/);
    expect(lauf(tabelle(zeile({ staffel: 'ab drei' }))).fehler[0]).toMatch(/Format/);
    expect(lauf(tabelle(zeile({ max_stueck: '100' }))).fehler[0]).toMatch(/max_stueck/);
  });

  it('schlägt einen unbekannten Hersteller als neuen Stammeintrag vor und bricht ab', () => {
    const ergebnis = lauf(tabelle(zeile({ hersteller: 'Neuwerk' }), zeile({ hersteller: 'NEUWERK', codebereich: '501 bis 999' })));
    expect(ergebnis.ok).toBe(false);
    expect(ergebnis.vorschlaege).toEqual([{ id: 'neuwerk', slug: 'neuwerk', name: 'Neuwerk', einsatz: '', angeboten: true, reihenfolge: 20 }]);
    expect(ergebnis.fehler[0]).toContain('Zeile 2, 3');
    expect(ergebnis.liste).toEqual([]);
  });

  it('nimmt nur Kategorien unter „Schlüssel nach Code“ und meldet doppelte Kennungen', () => {
    expect(lauf(tabelle(zeile({ kategorie: 'Schließtechnik und Zubehör' }))).fehler[0]).toMatch(/gehört nicht zu „Schlüssel nach Code“/);
    expect(lauf(tabelle(zeile({ kategorie: 'Gibt es nicht' }))).fehler[0]).toMatch(/steht nicht in den Shop-Kategorien/);
    expect(lauf(tabelle(zeile(), zeile())).fehler[0]).toMatch(/gleiche Kennung/);
  });

  it('übergeht die als Beispiel gekennzeichneten Zeilen der Vorlage', () => {
    const vorlage = readFileSync(path.join(process.cwd(), '_werkstatt/ausbau/erhebung/boegen/SORTIMENT-vorlage.csv'), 'utf8');
    const zeilen = leseSortiment(vorlage);
    expect(zeilen).toHaveLength(2);
    const ergebnis = pruefeSortiment(zeilen, { hersteller: HERSTELLER, kategorien: KATEGORIEN });
    expect(ergebnis).toMatchObject({ linien: [], fehler: [], uebersprungen: 2 });
  });

  it('übernimmt die freiwilligen Spalten Schlüsseltyp und Einsatzbereich (FA-11-18), weiter nur als Entwurf', () => {
    expect(FREIWILLIGE_SPALTEN).toEqual(['schluesseltyp', 'einsatz']);
    const kopf = [...SPALTEN, ...FREIWILLIGE_SPALTEN].join(';');
    const text = [kopf, `${zeile()};"Flachschlüssel";"Briefkasten"`, `${zeile({ system: 'TX 200' })};"";""`].join('\r\n');
    const ergebnis = lauf(text);
    expect(ergebnis.fehler).toEqual([]);
    const [mit, ohne] = ergebnis.liste as CodeLine[];
    expect(mit).toMatchObject({ keyType: 'Flachschlüssel', application: 'Briefkasten', active: false });
    // Leere Zellen: Schlüsseltyp leer, Einsatzbereich wie bisher aus Hersteller und System.
    expect(ohne).toMatchObject({ keyType: '', application: 'Testwerk TX 200' });
    // Im Backend landen sie in den vorhandenen Feldern „Schlüsseltyp“ und „Einsatzbereich“, als Entwurf.
    expect(codeLineZuPayload(mit)).toMatchObject({ schluesseltyp: 'Flachschlüssel', einsatz: 'Briefkasten', _status: 'draft' });
  });

  it('kommt ohne die freiwilligen Spalten aus', () => {
    const [linie] = lauf(tabelle(zeile())).liste as CodeLine[];
    expect(linie).toMatchObject({ keyType: '', application: 'Testwerk TX 100' });
  });

  it('die Vorlage nennt die freiwilligen Spalten', () => {
    const vorlage = readFileSync(path.join(process.cwd(), '_werkstatt/ausbau/erhebung/boegen/SORTIMENT-vorlage.csv'), 'utf8');
    const [zeile1] = leseSortiment(vorlage);
    expect(Object.keys(zeile1)).toEqual(expect.arrayContaining([...SPALTEN, ...FREIWILLIGE_SPALTEN]));
  });

  it('verlangt alle Spalten', () => {
    expect(() => leseSortiment('hersteller;system\nTestwerk;TX')).toThrow(/Spalte\(n\) fehlen: codebereich/);
  });
});

describe('Bestand und Regeln', () => {
  it('ersetzt eine echte Linie mit derselben Kennung, behält alle anderen und überschreibt kein Beispiel', () => {
    const [neu] = lauf(tabelle(zeile())).liste as CodeLine[];
    const andere = { ...neu, id: 'andere', slug: 'andere' };
    const alt = { ...neu, priceCents: 100 };
    expect(arbeiteEin([andere, alt], [neu])).toEqual({ liste: [andere, neu], fehler: [] });
    expect(arbeiteEin([{ ...alt, example: true }], [neu]).fehler[0]).toMatch(/Beispiel/);
  });

  it('prüft Muster wie das Backend', () => {
    for (const muster of ['^[0-9]{3,4}$', '[0-9]', '^(a+)+$', '^(a)\\1$', '^[$', '', `^${'a'.repeat(130)}$`]) {
      expect(pruefeCodeMuster(muster) === true, muster).toBe(pruefeImBackend(muster) === true);
    }
    expect(formatBeschreibung('^[0-9]{5}$')).toBe('5 Ziffern');
    expect(formatBeschreibung('^[A-Z]{2}\\-[0-9]{3}$')).toBe('2 Großbuchstaben, dann „-“, dann 3 Ziffern');
    expect(formatBeschreibung('^(AB|CD)[0-9]+$')).toBeUndefined();
  });
});

describe('Lauf über die Datei', () => {
  const ordner = mkdtempSync(path.join(os.tmpdir(), 'sortiment-'));
  afterAll(() => rmSync(ordner, { recursive: true, force: true }));
  const skript = path.join(process.cwd(), 'scripts/sortiment-import.mjs');

  it('schreibt bei einer fehlerhaften Zeile nichts in die Zieldatei', () => {
    const ziel = path.join(ordner, 'code-lines.json');
    const csv = path.join(ordner, 'sortiment.csv');
    writeFileSync(ziel, '[]\n');
    // Hersteller aus der echten Stammliste (content/hersteller.json), aber ohne Preis.
    writeFileSync(csv, tabelle(zeile({ hersteller: 'BKS', preis: '' })));
    const ergebnis = spawnSync(process.execPath, [skript, csv, `--ziel=${ziel}`], { encoding: 'utf8' });
    expect(ergebnis.status).toBe(1);
    expect(ergebnis.stderr).toContain('Pflichtfeld leer: preis');
    expect(readFileSync(ziel, 'utf8')).toBe('[]\n');
  });

  it('schreibt eine geprüfte Tabelle in eine Kopie der Codelinien', () => {
    const ziel = path.join(ordner, 'kopie.json');
    const csv = path.join(ordner, 'gut.csv');
    writeFileSync(ziel, '[]\n');
    writeFileSync(csv, tabelle(zeile({ hersteller: 'BKS' })));
    const ergebnis = spawnSync(process.execPath, [skript, csv, `--ziel=${ziel}`], { encoding: 'utf8' });
    expect(ergebnis.status, ergebnis.stderr).toBe(0);
    const liste = JSON.parse(readFileSync(ziel, 'utf8')) as CodeLine[];
    expect(liste.map((l) => [l.manufacturerId, l.system, l.example])).toEqual([['bks', 'TX 100', undefined]]);
  });
});
