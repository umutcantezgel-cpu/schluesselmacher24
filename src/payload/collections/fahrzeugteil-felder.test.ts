import type { Field } from 'payload';
import { describe, expect, it, vi } from 'vitest';

import { Bauformen } from './Bauformen';
import { fahrzeugteilFeld, markeImKatalog, reihenDerMarke, reihenZurMarke } from './Produkte';
import { UmbauBeispiele } from './UmbauBeispiele';

/* Gehäuse und Ersatzteile (FA-SHOP-02): Regeln der Felder ohne Datenbank. Gegen die Datenbank:
 * src/payload/gehaeuse.db.test.ts. Erfundene Testdaten (G4). */

type Pruefung = (wert: unknown, optionen: Record<string, unknown>) => true | string | Promise<true | string>;

/** Alle benannten Felder einer Gruppe, auch in Zeilen. */
function felder(liste: Field[]): Record<string, Field & { validate?: Pruefung }> {
  const ergebnis: Record<string, Field & { validate?: Pruefung }> = {};
  for (const feld of liste) {
    if ('name' in feld && feld.name) ergebnis[feld.name] = feld as Field & { validate?: Pruefung };
    if (feld.type === 'row') Object.assign(ergebnis, felder(feld.fields));
  }
  return ergebnis;
}

const teil = felder((fahrzeugteilFeld as { fields: Field[] }).fields);

/** Nachgebildete Abfrage auf den Fahrzeugkatalog: Marken und Reihen mit ID. */
function anfrage(reihen: Array<{ id: number; marke: string }>) {
  const count = vi.fn(async ({ where }: { where?: Record<string, unknown> }) => {
    if (!where) return { totalDocs: reihen.length };
    const marke = (where.marke as { equals?: string } | undefined)?.equals;
    if (marke !== undefined) return { totalDocs: reihen.filter((r) => r.marke === marke).length };
    const [idTeil, markenTeil] = (where.and as Array<Record<string, { in?: unknown[]; not_equals?: string }>>) ?? [];
    const ids = idTeil?.id?.in ?? [];
    const nicht = markenTeil?.marke?.not_equals;
    return { totalDocs: reihen.filter((r) => ids.includes(r.id) && r.marke !== nicht).length };
  });
  return { payload: { count } } as never;
}

const katalog = anfrage([
  { id: 1, marke: 'Testmarke' },
  { id: 2, marke: 'Testmarke' },
  { id: 3, marke: 'Andere' },
]);

describe('Fahrzeugteil am Artikel', () => {
  it('bietet die Merkmale aus Abschnitt 14 an', () => {
    expect(Object.keys(teil).sort()).toEqual(
      ['aktiv', 'baujahrBis', 'baujahrVon', 'bauformen', 'elektronik', 'kompatibilitaet', 'marke', 'reihen', 'schluesselarten', 'tastenzahl', 'teileart'].sort(),
    );
    expect((teil.teileart as { options: { value: string }[] }).options.map((o) => o.value)).toEqual([
      'gehaeuse',
      'tasten',
      'gummimatte',
      'batterie',
      'klappmechanismus',
      'schluesselbart',
      'weitere',
    ]);
    expect((teil.elektronik as { options: { value: string }[] }).options.map((o) => o.value)).toEqual(['ja', 'nein', 'pruefung']);
    expect(teil.bauformen).toMatchObject({ type: 'relationship', relationTo: 'bauformen', hasMany: true });
    expect(teil.reihen).toMatchObject({ type: 'relationship', relationTo: 'fahrzeugreihen', hasMany: true });
  });

  it('prüft Pflichtangaben nur mit Haken „Gehäuse oder Ersatzteil“', async () => {
    const ohne = { aktiv: false };
    expect(await teil.kompatibilitaet.validate!('', { siblingData: ohne })).toBe(true);
    const gehaeuse = { aktiv: true, teileart: 'gehaeuse', elektronik: 'ja', kompatibilitaet: '' };
    expect(await teil.kompatibilitaet.validate!('', { siblingData: gehaeuse })).toMatch(/Kompatibilitätshinweis/);
    expect(await teil.tastenzahl.validate!(undefined, { siblingData: gehaeuse })).toMatch(/Tastenzahl/);
    expect(await teil.tastenzahl.validate!(2.5, { siblingData: { ...gehaeuse, tastenzahl: 2.5 } })).toMatch(/ganze Zahl/);
    expect(await teil.bauformen.validate!([], { siblingData: gehaeuse })).toMatch(/Bauform/);
    expect(await teil.teileart.validate!(undefined, { siblingData: { aktiv: true } })).toMatch(/Art des Teils/);
    expect(await teil.elektronik.validate!(undefined, { siblingData: { aktiv: true } })).toMatch(/Elektronik/);
    const batterie = { aktiv: true, teileart: 'batterie', elektronik: 'nein', kompatibilitaet: 'Passt in Gehäuse mit Knopfzelle.' };
    expect(await teil.tastenzahl.validate!(undefined, { siblingData: batterie })).toBe(true);
    expect(await teil.bauformen.validate!([], { siblingData: batterie })).toBe(true);
  });

  it('Baujahr bis nicht vor von', async () => {
    expect(await teil.baujahrBis.validate!(2005, { siblingData: { baujahrVon: 2010, baujahrBis: 2005 } })).toMatch(/nicht vor/);
    expect(await teil.baujahrVon.validate!(1800, { siblingData: { baujahrVon: 1800 } })).toMatch(/zwischen/);
    expect(await teil.baujahrVon.validate!(2010, { siblingData: { baujahrVon: 2010, baujahrBis: 2015 } })).toBe(true);
  });
});

describe('Fahrzeug aus dem Fahrzeugkatalog', () => {
  it('nimmt nur Marken aus dem Katalog; leer heißt markenübergreifend', async () => {
    expect(await markeImKatalog('Testmarke', { req: katalog })).toBe(true);
    expect(await markeImKatalog('', { req: katalog })).toBe(true);
    expect(await markeImKatalog(null, { req: katalog })).toBe(true);
    expect(await markeImKatalog('Erfunden', { req: katalog })).toMatch(/nicht im Fahrzeugkatalog/);
    // Leerer Katalog (frische Datenbank): nichts ablehnen.
    expect(await markeImKatalog('Erfunden', { req: anfrage([]) })).toBe(true);
  });

  it('Reihen nur zur eingetragenen Marke, ohne Marke keine Reihen', async () => {
    expect(await reihenZurMarke([], { siblingData: {}, req: katalog })).toBe(true);
    expect(await reihenZurMarke([1, { id: 2 }], { siblingData: { marke: 'Testmarke' }, req: katalog })).toBe(true);
    expect(await reihenZurMarke([1, 3], { siblingData: { marke: 'Testmarke' }, req: katalog })).toMatch(/gehört nicht zur Marke/);
    expect(await reihenZurMarke([1], { siblingData: {}, req: katalog })).toMatch(/zuerst die Marke/);
    expect(await reihenZurMarke(3, { siblingData: { marke: 'Andere' }, req: katalog })).toBe(true);
  });

  it('bietet im Backend nur Reihen der Marke an', () => {
    expect(reihenDerMarke({ siblingData: { marke: ' Testmarke ' } })).toEqual({ marke: { equals: 'Testmarke' } });
    expect(reihenDerMarke({ siblingData: {} })).toBe(true);
  });
});

describe('Bauformen und Umbau-Beispiele', () => {
  it('Bauformen: pflegbare Liste mit eindeutigem Namen und fester Kennung', () => {
    const f = felder(Bauformen.fields);
    expect(f.name).toMatchObject({ required: true, unique: true });
    expect(f.kennung).toBeDefined();
    expect(Bauformen.trash).toBe(true);
    expect(Bauformen.admin?.group).toBe('Shop');
  });

  it('Umbau-Beispiel: Vorher, Nachher, Fahrzeug, Schlüsseltyp, Übernommenes, Hinweis und Freigabe', () => {
    const f = felder(UmbauBeispiele.fields);
    expect(Object.keys(f)).toEqual(
      expect.arrayContaining(['titel', 'vorher', 'nachher', 'marke', 'reihe', 'schluesselart', 'uebernommen', 'hinweis', 'einsatz', 'freigabe']),
    );
    for (const name of ['vorher', 'nachher']) {
      const bild = felder((f[name] as { fields: Field[] }).fields);
      expect(bild.bild).toMatchObject({ type: 'upload', relationTo: 'medien', required: true });
      expect(bild.beschriftung).toMatchObject({ required: true });
    }
    expect(f.freigabe).toMatchObject({ defaultValue: false });
    expect(UmbauBeispiele.versions).toMatchObject({ drafts: true });
  });
});
