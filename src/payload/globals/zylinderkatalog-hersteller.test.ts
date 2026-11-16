import { describe, expect, it } from 'vitest';
import type { Field } from 'payload';

import { Zylinderkatalog } from './Zylinderkatalog';

/* Hersteller im Zylinderkatalog (FA-SHOP-04, Nachbesserung): Name und Kennung bleiben Pflicht und ohne
 * admin.condition, damit die Spalten NOT NULL bleiben (G6). Sie sind nur lesbar; mit Auswahl aus dem
 * Stamm füllt der Hook sie, ohne Auswahl braucht der ältere Eintrag seine eigenen Werte. */

type Pruefung = (wert: unknown, optionen: { siblingData?: { stamm?: unknown } }) => true | string;

/** Alle Felder flach, auch in Reitern, Zeilen und Arrays. */
function alleFelder(felder: Field[]): Field[] {
  return felder.flatMap((f) => {
    const kinder: Field[] = [];
    if ('fields' in f && Array.isArray(f.fields)) kinder.push(...alleFelder(f.fields));
    if ('tabs' in f && Array.isArray(f.tabs)) for (const tab of f.tabs) kinder.push(...alleFelder(tab.fields));
    return [f, ...kinder];
  });
}

function herstellerFeld(name: 'name' | 'kennung') {
  const liste = alleFelder(Zylinderkatalog.fields).find((f) => 'name' in f && f.name === 'hersteller');
  if (!liste || !('fields' in liste)) throw new Error('Array „hersteller“ fehlt');
  const feld = alleFelder(liste.fields).find((f) => 'name' in f && f.name === name);
  if (!feld) throw new Error(`Feld „${name}“ fehlt`);
  return feld as Field & { required?: boolean; validate?: Pruefung; admin?: { condition?: unknown; readOnly?: boolean } };
}

describe('Zylinderkatalog: Name und Kennung der Hersteller', () => {
  it.each(['name', 'kennung'] as const)('„%s“ ist Pflicht, nur lesbar und ohne Bedingung', (name) => {
    const feld = herstellerFeld(name);
    expect(feld.required).toBe(true);
    expect(feld.admin?.condition).toBeUndefined();
    expect(feld.admin?.readOnly).toBe(true);
  });

  it('lässt beide leer, wenn ein Hersteller aus der Liste gewählt ist', () => {
    for (const name of ['name', 'kennung'] as const) {
      const pruefe = herstellerFeld(name).validate!;
      expect(pruefe(undefined, { siblingData: { stamm: 7 } })).toBe(true);
      expect(pruefe('', { siblingData: { stamm: { id: 7 } } })).toBe(true);
    }
  });

  it('verlangt ohne Auswahl die bisherigen Werte des älteren Eintrags', () => {
    const name = herstellerFeld('name').validate!;
    const kennung = herstellerFeld('kennung').validate!;
    expect(name('ABUS', { siblingData: {} })).toBe(true);
    expect(kennung('abus', { siblingData: {} })).toBe(true);
    expect(name('', { siblingData: {} })).toBe('Bitte oben den Hersteller aus der Liste wählen.');
    expect(kennung(undefined, { siblingData: { stamm: null } })).toBe('Bitte oben den Hersteller aus der Liste wählen.');
    expect(kennung('Kein Slug', { siblingData: {} })).toBe('Bitte oben den Hersteller aus der Liste wählen.');
  });
});
