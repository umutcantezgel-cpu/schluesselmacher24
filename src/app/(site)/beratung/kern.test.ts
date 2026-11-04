import { describe, expect, it } from 'vitest';

import {
  THEMEN,
  INITIAL,
  beratungZusammenfassung,
  schrittGueltig,
  type BeratungDaten,
} from './kern';

const BESCHREIBUNG_OK = 'Die Haustür schließt nur schwer, was kann man tun?';

/** Ein vollständig gültiger Entwurf, der je Test gezielt verändert wird. */
function daten(aenderungen: Partial<BeratungDaten> = {}): BeratungDaten {
  return {
    ...INITIAL,
    thema: THEMEN[1],
    beschreibung: BESCHREIBUNG_OK,
    vorname: 'Erika',
    nachname: 'Muster',
    email: 'erika@example.test',
    telefon: '0641 123456',
    zeitfenster: 'vormittags',
    ...aenderungen,
  };
}

describe('schrittGueltig · anliegen', () => {
  it('ist gültig mit Thema und Beschreibung', () => {
    expect(schrittGueltig(daten(), 'anliegen')).toBe(true);
  });

  it('verlangt ein Thema', () => {
    expect(schrittGueltig(daten({ thema: '' }), 'anliegen')).toBe(false);
  });

  it('ist ungültig bei einem Thema, das nicht in der Liste steht', () => {
    expect(schrittGueltig(daten({ thema: 'Etwas Fremdes' as never }), 'anliegen')).toBe(false);
  });

  it('verlangt mindestens 10 Zeichen in der Beschreibung', () => {
    expect(schrittGueltig(daten({ beschreibung: 'a'.repeat(9) }), 'anliegen')).toBe(false);
    expect(schrittGueltig(daten({ beschreibung: 'a'.repeat(10) }), 'anliegen')).toBe(true);
  });

  it('zählt Leerzeichen am Rand nicht mit', () => {
    expect(schrittGueltig(daten({ beschreibung: `   ${'a'.repeat(9)}   ` }), 'anliegen')).toBe(false);
  });

  it('erlaubt höchstens 2000 Zeichen in der Beschreibung', () => {
    expect(schrittGueltig(daten({ beschreibung: 'a'.repeat(2000) }), 'anliegen')).toBe(true);
    expect(schrittGueltig(daten({ beschreibung: 'a'.repeat(2001) }), 'anliegen')).toBe(false);
  });
});

describe('schrittGueltig · kontakt', () => {
  it('verlangt eine Telefonnummer', () => {
    expect(schrittGueltig(daten({ telefon: '' }), 'kontakt')).toBe(false);
    expect(schrittGueltig(daten({ telefon: '0641 1' }), 'kontakt')).toBe(false);
    expect(schrittGueltig(daten({ telefon: '0641 123' }), 'kontakt')).toBe(true);
  });

  it('verlangt eine E-Mail-Adresse', () => {
    expect(schrittGueltig(daten({ email: '' }), 'kontakt')).toBe(false);
    expect(schrittGueltig(daten({ email: 'ohne-at.example.test' }), 'kontakt')).toBe(false);
    expect(schrittGueltig(daten({ email: 'erika@example' }), 'kontakt')).toBe(false);
  });

  it('verlangt Vor- und Nachnamen', () => {
    expect(schrittGueltig(daten({ vorname: '' }), 'kontakt')).toBe(false);
    expect(schrittGueltig(daten({ nachname: ' M ' }), 'kontakt')).toBe(false);
  });

  it('verlangt ein Zeitfenster', () => {
    expect(schrittGueltig(daten({ zeitfenster: '' }), 'kontakt')).toBe(false);
    expect(schrittGueltig(daten({ zeitfenster: 'vormittags' }), 'kontakt')).toBe(true);
    expect(schrittGueltig(daten({ zeitfenster: 'nachmittags' }), 'kontakt')).toBe(true);
    expect(schrittGueltig(daten({ zeitfenster: 'egal' }), 'kontakt')).toBe(true);
  });

  it('verlangt weder Postleitzahl noch Ort', () => {
    expect(schrittGueltig(daten({ postleitzahl: '', ort: '' }), 'kontakt')).toBe(true);
  });
});

describe('schrittGueltig · absenden', () => {
  it('ist gültig, wenn Anliegen und Kontakt gültig sind', () => {
    expect(schrittGueltig(daten(), 'absenden')).toBe(true);
  });

  it('ist ungültig, sobald ein Schritt davor ungültig ist', () => {
    expect(schrittGueltig(daten({ beschreibung: 'zu kurz' }), 'absenden')).toBe(false);
    expect(schrittGueltig(daten({ vorname: '' }), 'absenden')).toBe(false);
  });
});

describe('beratungZusammenfassung', () => {
  it('hat die Abschnitte Anliegen und Kontakt und Rückruf', () => {
    expect(beratungZusammenfassung(daten()).map((abschnitt) => abschnitt.title)).toEqual([
      'Anliegen',
      'Kontakt und Rückruf',
    ]);
  });

  it('nennt Thema und Beschreibung und zählt Fotos ehrlich', () => {
    const [anliegen] = beratungZusammenfassung(daten());
    const zeile = (label: string) => anliegen.rows.find((r) => r.label === label)?.value;
    expect(zeile('Thema')).toBe(THEMEN[1]);
    expect(zeile('Beschreibung')).toBe(BESCHREIBUNG_OK);
    expect(zeile('Fotos')).toBe('keine');
    expect(beratungZusammenfassung(daten(), 2)[0].rows.find((r) => r.label === 'Fotos')?.value).toBe('2 Datei(en)');
  });

  it('zeigt Telefon und Zeitfenster und kennt keinen Antwortweg', () => {
    const [, kontakt] = beratungZusammenfassung(daten({ zeitfenster: 'nachmittags' }));
    const zeile = (label: string) => kontakt.rows.find((r) => r.label === label)?.value;
    expect(zeile('Telefon')).toBe('0641 123456');
    expect(zeile('Zeitfenster')).toBe('Nachmittags');
    expect(kontakt.rows.map((r) => r.label)).not.toContain('Antwort per');
  });

  it('nennt Ort ehrlich, auch wenn er fehlt', () => {
    const [, kontakt] = beratungZusammenfassung(daten({ postleitzahl: '35576', ort: 'Wetzlar' }));
    expect(kontakt.rows.find((r) => r.label === 'Ort')?.value).toBe('35576 Wetzlar');
    const [, ohne] = beratungZusammenfassung(daten());
    expect(ohne.rows.find((r) => r.label === 'Ort')?.value).toBe('keine Angabe');
  });

  it('baut den Namen mit Anrede, ohne doppelte Leerzeichen', () => {
    const [, kontakt] = beratungZusammenfassung(daten({ anrede: 'Frau' }));
    expect(kontakt.rows.find((r) => r.label === 'Name')?.value).toBe('Frau Erika Muster');
  });
});
