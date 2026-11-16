import { describe, expect, it } from 'vitest';

import { defaults } from '../../lib/data/defaults';
import { Hersteller } from './Hersteller';
import { KATEGORIE_ARTEN, Kategorien, ZIEL_MUSTER, adresseAusName, alteAdresseMerken } from './Kategorien';
import { Produkte, VERFUEGBARKEIT_OPTIONEN, codebereichPruefen, herstellerPruefen, systemPruefen, vorschauPfad } from './Produkte';

/* Shop-Grundlage (FA-SHOP-01): Regeln der Sammlungen ohne Datenbank. Gegen die Datenbank: src/payload/shop-grundlage.db.test.ts. */

const aufruf = (args: Record<string, unknown>) => args as never;

describe('Produkte', () => {
  it('verlangt das System bei echten Codeprodukten, nicht bei Artikeln und Beispielen', () => {
    expect(systemPruefen('', { data: { typ: 'code_key' } })).toMatch(/System/);
    expect(systemPruefen('  ', { data: { typ: 'code_key' } })).toMatch(/System/);
    expect(systemPruefen('System T', { data: { typ: 'code_key' } })).toBe(true);
    expect(systemPruefen('', { data: { typ: 'standard' } })).toBe(true);
    expect(systemPruefen('', { data: { typ: 'code_key', beispiel: true } })).toBe(true);
  });

  it('verlangt Hersteller und Codebereich bei echten Codeprodukten, nicht bei Artikeln und Beispielen (FA-11-07, FA-11-09)', () => {
    const code = { typ: 'code_key' };
    // Hersteller: Auswahl aus dem Stamm (Kennung oder geladenes Dokument) oder der ältere Freitext.
    expect(herstellerPruefen(null, { data: code })).toMatch(/Hersteller/);
    expect(herstellerPruefen(undefined, { data: { ...code, hersteller: '  ' } })).toMatch(/Hersteller/);
    expect(herstellerPruefen(null, { data: { ...code, hersteller: '[Hersteller eintragen]' } })).toMatch(/Hersteller/);
    expect(herstellerPruefen(3, { data: code })).toBe(true);
    expect(herstellerPruefen({ id: 3, name: 'Testwerk' }, { data: code })).toBe(true);
    expect(herstellerPruefen(null, { data: { ...code, hersteller: 'Testwerk' } })).toBe(true);
    expect(herstellerPruefen(null, { data: { typ: 'standard' } })).toBe(true);
    expect(herstellerPruefen(null, { data: { ...code, beispiel: true } })).toBe(true);
    // Codebereich: Text, kein Platzhalter.
    expect(codebereichPruefen('', { data: code })).toMatch(/Codebereich/);
    expect(codebereichPruefen(' ', { data: code })).toMatch(/Codebereich/);
    expect(codebereichPruefen('[Codebereich]', { data: code })).toMatch(/Codebereich/);
    expect(codebereichPruefen('1 bis 999', { data: code })).toBe(true);
    expect(codebereichPruefen(undefined, { data: { typ: 'standard' } })).toBe(true);
    expect(codebereichPruefen(undefined, { data: { ...code, beispiel: true } })).toBe(true);
    // Klare Meldung ohne Gedankenstrich.
    for (const meldung of [herstellerPruefen(null, { data: code }), codebereichPruefen('', { data: code })]) {
      expect(meldung).not.toMatch(/[–—]/);
    }
  });

  it('öffnet als Vorschau die Seite des Artikels', () => {
    expect(vorschauPfad({ typ: 'code_key', slug: 'abc' })).toBe('/schluessel-nach-code/abc');
    expect(vorschauPfad({ typ: 'standard', slug: 'abc' })).toBe('/artikel/abc');
    expect(vorschauPfad({ typ: 'code_key' })).toBeNull();
  });

  it('bietet die drei Verfügbarkeiten an und zeigt die gewünschten Spalten', () => {
    expect(VERFUEGBARKEIT_OPTIONEN.map((o) => o.value)).toEqual(['lieferbar', 'auf-anfrage', 'nicht-lieferbar']);
    expect(Produkte.admin?.defaultColumns).toEqual(
      expect.arrayContaining(['herstellerAuswahl', 'system', 'preis', 'verfuegbarkeit', 'kategorie']),
    );
    expect(Produkte.trash).toBe(true);
  });
});

describe('Shop-Kategorien', () => {
  it('bildet eine leere Adresse aus dem Namen', () => {
    expect(adresseAusName(aufruf({ operation: 'create', data: { name: 'Schließtechnik und Zubehör' } }))).toMatchObject({ slug: 'schliesstechnik-und-zubehoer' });
    expect(adresseAusName(aufruf({ operation: 'create', data: { name: 'Neu', slug: 'eigene' } }))).toMatchObject({ slug: 'eigene' });
  });

  it('lässt die Adresse beim Ändern stehen, außer sie wird ausdrücklich geleert', () => {
    const teil = adresseAusName(aufruf({ operation: 'update', data: { name: 'Neuer Name' }, originalDoc: { name: 'Alt', slug: 'eigene' } }));
    expect(teil).not.toHaveProperty('slug');
    const geleert = adresseAusName(aufruf({ operation: 'update', data: { slug: '' }, originalDoc: { name: 'Alter Name', slug: 'eigene' } }));
    expect(geleert).toMatchObject({ slug: 'alter-name' });
  });

  it('merkt die alte Adresse, wenn der Betreiber sie ändert', () => {
    const geaendert = alteAdresseMerken(aufruf({ operation: 'update', data: { slug: 'neu' }, originalDoc: { slug: 'alt', fruehereAdressen: [] } }));
    expect(geaendert.fruehereAdressen).toEqual([{ adresse: 'alt' }]);
    const zurueck = alteAdresseMerken(aufruf({ operation: 'update', data: { slug: 'alt' }, originalDoc: { slug: 'neu', fruehereAdressen: [{ adresse: 'alt' }] } }));
    expect(zurueck.fruehereAdressen).toEqual([{ adresse: 'neu' }]);
    const gleich = alteAdresseMerken(aufruf({ operation: 'update', data: { name: 'x' }, originalDoc: { slug: 'alt', fruehereAdressen: [] } }));
    expect(gleich.fruehereAdressen).toBeUndefined();
    const neu = alteAdresseMerken(aufruf({ operation: 'create', data: { slug: 'neu' } }));
    expect(neu.fruehereAdressen).toBeUndefined();
  });

  it('nimmt nur Adressen dieser Seite als Ziel', () => {
    for (const k of defaults.kategorien()) expect(ZIEL_MUSTER.test(k.ziel), k.ziel).toBe(true);
    expect(ZIEL_MUSTER.test('https://example.org')).toBe(false);
    expect(ZIEL_MUSTER.test('schluessel')).toBe(false);
    expect(ZIEL_MUSTER.test('/a?b=<script>')).toBe(false);
  });

  it('kennt alle Arten des Startbestands', () => {
    const arten = new Set(KATEGORIE_ARTEN.map((a) => a.value));
    for (const k of defaults.kategorien()) expect(arten.has(k.art)).toBe(true);
  });

  it('Papierkorb, Versionen und Pflege durch das Team', () => {
    for (const sammlung of [Kategorien, Hersteller]) {
      expect(sammlung.trash).toBe(true);
      expect(sammlung.versions).toBeTruthy();
      expect(sammlung.admin?.group).toBe('Shop');
    }
  });
});
