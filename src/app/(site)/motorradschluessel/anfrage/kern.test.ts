import { describe, expect, it } from 'vitest';

import { LIEFERLAND } from '@/lib/kasse';

import { INITIAL, baujahrGueltig, kontaktAus, motorradZusammenfassung, payloadAus, schrittGueltig, type MotorradDaten } from './kern';

/* Jahr fest vorgegeben, damit die Grenze 2027 unabhängig vom Testdatum gilt. */
const JAHR = 2026;

const GUELTIG: MotorradDaten = {
  ...INITIAL,
  hersteller: 'Yamaha',
  modell: 'MT-07',
  baujahr: '2019',
  transponder: 'ja',
  vorname: 'Anna',
  nachname: 'Beispiel',
  email: 'anna@example.com',
  telefon: '06441 123456',
  plz: '35576',
  ort: 'Wetzlar',
};

describe('schrittGueltig', () => {
  it('prüft den Schritt Motorrad', () => {
    expect(schrittGueltig(GUELTIG, 'motorrad', JAHR)).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, hersteller: '  ' }, 'motorrad', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, hersteller: 'H'.repeat(61) }, 'motorrad', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, modell: '' }, 'motorrad', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, modell: 'M'.repeat(81) }, 'motorrad', JAHR)).toBe(false);
  });

  it('prüft das Baujahr: vier Ziffern, 1950 bis laufendes Jahr plus 1', () => {
    expect(schrittGueltig({ ...GUELTIG, baujahr: '1949' }, 'motorrad', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '2026' }, 'motorrad', JAHR)).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '2027' }, 'motorrad', JAHR)).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '2028' }, 'motorrad', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '19a0' }, 'motorrad', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '' }, 'motorrad', JAHR)).toBe(false);
    expect(baujahrGueltig('1950', JAHR)).toBe(true);
  });

  it('verlangt eine Antwort auf die Pflichtfrage Transponder', () => {
    expect(schrittGueltig({ ...GUELTIG, transponder: '' }, 'transponder')).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, transponder: 'ja' }, 'transponder')).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, transponder: 'nein' }, 'transponder')).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, transponder: 'unklar' }, 'transponder')).toBe(true);
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

describe('motorradZusammenfassung', () => {
  it('nennt den Chip als Text und trägt Motorrad und Kontakt ein', () => {
    const mitChip = motorradZusammenfassung({ ...GUELTIG, transponder: 'ja' });
    expect(mitChip.map((teil) => teil.title)).toEqual(['Motorrad', 'Kontakt']);
    expect(mitChip[0].rows.find((z) => z.label === 'Chip im Schlüssel')?.value).toBe('mit Chip');
    expect(mitChip[0].rows.find((z) => z.label === 'Hersteller')?.value).toBe('Yamaha');
    expect(mitChip[1].rows.find((z) => z.label === 'Name')?.value).toBe('Anna Beispiel');
    expect(mitChip[1].rows.find((z) => z.label === 'Anschrift')?.value).toBe('35576 Wetzlar');
  });

  it('nennt ohne Chip und unklar den passenden Text', () => {
    const wert = (transponder: MotorradDaten['transponder']) =>
      motorradZusammenfassung({ ...GUELTIG, transponder })[0].rows.find((z) => z.label === 'Chip im Schlüssel')?.value;
    expect(wert('nein')).toBe('ohne Chip');
    expect(wert('unklar')).toBe('unklar, bitte prüfen');
    expect(wert('')).toBe('noch offen');
  });
});

describe('Nutzlast des Vorgangs', () => {
  it('trägt die Quelle motorrad, die Angaben und den Kontakt ins Lieferland', () => {
    expect(payloadAus(GUELTIG)).toEqual({
      quelle: 'motorrad',
      hersteller: 'Yamaha',
      modell: 'MT-07',
      baujahr: 2019,
      transponder: 'ja',
      anmerkung: null,
    });
    expect(kontaktAus(GUELTIG).country).toBe(LIEFERLAND);
    expect(kontaktAus(GUELTIG).firstName).toBe('Anna');
  });
});
