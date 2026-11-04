import { describe, expect, it } from 'vitest';

import { LIEFERLAND } from '@/lib/kasse';

import { INITIAL, baujahrGueltig, gehaeuseZusammenfassung, kontaktAus, payloadAus, schrittGueltig, type GehaeuseDaten } from './kern';

/* Jahr fest vorgegeben, damit die Grenze 2027 unabhängig vom Testdatum gilt. */
const JAHR = 2026;

const GUELTIG: GehaeuseDaten = {
  ...INITIAL,
  marke: 'Volkswagen',
  modell: 'Golf VII',
  baujahr: '2019',
  tasten: '3-4',
  vorname: 'Anna',
  nachname: 'Beispiel',
  email: 'anna@example.com',
  telefon: '06441 123456',
  plz: '35576',
  ort: 'Wetzlar',
};

describe('schrittGueltig', () => {
  it('prüft den Schritt Fahrzeug', () => {
    expect(schrittGueltig(GUELTIG, 'fahrzeug', JAHR)).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, marke: '  ' }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, marke: 'M'.repeat(61) }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, modell: '' }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, modell: 'M'.repeat(81) }, 'fahrzeug', JAHR)).toBe(false);
  });

  it('prüft das Baujahr: vier Ziffern, 1990 bis laufendes Jahr plus 1', () => {
    expect(schrittGueltig({ ...GUELTIG, baujahr: '1989' }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '1998' }, 'fahrzeug', JAHR)).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '2022' }, 'fahrzeug', JAHR)).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '2027' }, 'fahrzeug', JAHR)).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '2028' }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '19a0' }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '' }, 'fahrzeug', JAHR)).toBe(false);
    expect(baujahrGueltig('1990', JAHR)).toBe(true);
  });

  it('verlangt eine Antwort auf die Pflichtfrage Tasten', () => {
    expect(schrittGueltig({ ...GUELTIG, tasten: '' }, 'tasten')).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, tasten: '1-2' }, 'tasten')).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, tasten: '3-4' }, 'tasten')).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, tasten: 'unklar' }, 'tasten')).toBe(true);
  });

  it('lässt die Fotos dem Formular, der Schritt Unterlagen ist hier immer gültig', () => {
    expect(schrittGueltig({ ...INITIAL }, 'unterlagen', JAHR)).toBe(true);
    expect(schrittGueltig({ ...INITIAL }, 'absenden', JAHR)).toBe(true);
  });

  it('prüft den Kontakt: Namen, E-Mail, Telefon, Postleitzahl', () => {
    expect(schrittGueltig(GUELTIG, 'kontakt', JAHR)).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, vorname: 'A' }, 'kontakt', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, nachname: '' }, 'kontakt', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, email: 'anna@' }, 'kontakt', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, telefon: '12' }, 'kontakt', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, plz: '3557' }, 'kontakt', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, plz: '', ort: '' }, 'kontakt', JAHR)).toBe(true);
  });
});

describe('gehaeuseZusammenfassung', () => {
  it('trägt Fahrzeug und Schlüssel sowie Kontakt ein', () => {
    const teile = gehaeuseZusammenfassung(GUELTIG);
    expect(teile.map((teil) => teil.title)).toEqual(['Fahrzeug und Schlüssel', 'Kontakt']);
    expect(teile[0].rows.find((z) => z.label === 'Marke')?.value).toBe('Volkswagen');
    expect(teile[0].rows.find((z) => z.label === 'Tasten am Schlüssel')?.value).toBe('3 oder 4 Tasten');
    expect(teile[1].rows.find((z) => z.label === 'Name')?.value).toBe('Anna Beispiel');
    expect(teile[1].rows.find((z) => z.label === 'Anschrift')?.value).toBe('35576 Wetzlar');
  });

  it('nennt die Tastenzahl und unklar mit dem passenden Text', () => {
    const wert = (tasten: GehaeuseDaten['tasten']) =>
      gehaeuseZusammenfassung({ ...GUELTIG, tasten })[0].rows.find((z) => z.label === 'Tasten am Schlüssel')?.value;
    expect(wert('1-2')).toBe('1 oder 2 Tasten');
    expect(wert('unklar')).toBe('unklar, bitte prüfen');
    expect(wert('')).toBe('noch offen');
  });
});

describe('Nutzlast des Vorgangs', () => {
  it('trägt die Quelle gehaeuse, die Angaben und den Kontakt ins Lieferland', () => {
    expect(payloadAus(GUELTIG)).toEqual({
      quelle: 'gehaeuse',
      marke: 'Volkswagen',
      modell: 'Golf VII',
      baujahr: 2019,
      tasten: '3-4',
      anmerkung: null,
    });
    expect(kontaktAus(GUELTIG).country).toBe(LIEFERLAND);
    expect(kontaktAus(GUELTIG).firstName).toBe('Anna');
  });
});
