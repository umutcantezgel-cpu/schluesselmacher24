import { describe, expect, it } from 'vitest';

import {
  ANLIEGEN,
  INITIAL,
  einsatzZusammenfassung,
  postleitzahlGueltig,
  schrittGueltig,
  type EinsatzDaten,
} from './kern';

const BESCHREIBUNG_OK = 'Die Haustür schließt nur schwer, was kann man tun?';

/** Ein vollständig gültiger Entwurf, der je Test gezielt verändert wird. */
function daten(aenderungen: Partial<EinsatzDaten> = {}): EinsatzDaten {
  return {
    ...INITIAL,
    anliegen: ANLIEGEN[1],
    beschreibung: BESCHREIBUNG_OK,
    postleitzahl: '35576',
    ort: 'Wetzlar',
    vorname: 'Erika',
    nachname: 'Muster',
    email: 'erika@example.test',
    telefon: '0641 123456',
    zeitraum: 'bald',
    berechtigt: true,
    ...aenderungen,
  };
}

describe('schrittGueltig · anliegen', () => {
  it('ist gültig mit Anliegen, Beschreibung, Postleitzahl und Ort', () => {
    expect(schrittGueltig(daten(), 'anliegen')).toBe(true);
  });

  it('verlangt ein Anliegen aus der Liste', () => {
    expect(schrittGueltig(daten({ anliegen: '' }), 'anliegen')).toBe(false);
    expect(schrittGueltig(daten({ anliegen: 'Etwas Fremdes' as never }), 'anliegen')).toBe(false);
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

  it('verlangt eine Postleitzahl mit genau fünf Ziffern', () => {
    expect(schrittGueltig(daten({ postleitzahl: '' }), 'anliegen')).toBe(false);
    expect(schrittGueltig(daten({ postleitzahl: '3557' }), 'anliegen')).toBe(false);
    expect(schrittGueltig(daten({ postleitzahl: '355760' }), 'anliegen')).toBe(false);
    expect(schrittGueltig(daten({ postleitzahl: '3557a' }), 'anliegen')).toBe(false);
    expect(schrittGueltig(daten({ postleitzahl: '35576' }), 'anliegen')).toBe(true);
  });

  it('verlangt einen Ort mit mindestens zwei Zeichen', () => {
    expect(schrittGueltig(daten({ ort: '' }), 'anliegen')).toBe(false);
    expect(schrittGueltig(daten({ ort: ' W ' }), 'anliegen')).toBe(false);
    expect(schrittGueltig(daten({ ort: 'Wetzlar' }), 'anliegen')).toBe(true);
  });

  it('verlangt keine Straße', () => {
    expect(schrittGueltig(daten({ strasse: '' }), 'anliegen')).toBe(true);
  });
});

describe('postleitzahlGueltig', () => {
  it('nimmt nur fünf Ziffern an', () => {
    expect(postleitzahlGueltig('35576')).toBe(true);
    expect(postleitzahlGueltig(' 35576 ')).toBe(true);
    expect(postleitzahlGueltig('3557')).toBe(false);
    expect(postleitzahlGueltig('')).toBe(false);
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

  it('verlangt einen Wunschzeitraum', () => {
    expect(schrittGueltig(daten({ zeitraum: '' }), 'kontakt')).toBe(false);
    expect(schrittGueltig(daten({ zeitraum: 'bald' }), 'kontakt')).toBe(true);
    expect(schrittGueltig(daten({ zeitraum: 'spaeter' }), 'kontakt')).toBe(true);
    expect(schrittGueltig(daten({ zeitraum: 'flexibel' }), 'kontakt')).toBe(true);
  });

  it('verlangt die Berechtigung als Haken', () => {
    expect(schrittGueltig(daten({ berechtigt: false }), 'kontakt')).toBe(false);
    expect(schrittGueltig(daten({ berechtigt: true }), 'kontakt')).toBe(true);
  });

  it('verlangt keine Anrede und keine Straße', () => {
    expect(schrittGueltig(daten({ anrede: '', strasse: '' }), 'kontakt')).toBe(true);
  });
});

describe('schrittGueltig · absenden', () => {
  it('ist gültig, wenn Anliegen und Kontakt gültig sind', () => {
    expect(schrittGueltig(daten(), 'absenden')).toBe(true);
  });

  it('ist ungültig ohne Berechtigung', () => {
    expect(schrittGueltig(daten({ berechtigt: false }), 'absenden')).toBe(false);
  });

  it('ist ungültig, sobald ein Schritt davor ungültig ist', () => {
    expect(schrittGueltig(daten({ beschreibung: 'zu kurz' }), 'absenden')).toBe(false);
    expect(schrittGueltig(daten({ vorname: '' }), 'absenden')).toBe(false);
    expect(schrittGueltig(daten({ postleitzahl: '' }), 'absenden')).toBe(false);
  });
});

describe('einsatzZusammenfassung', () => {
  it('hat die Abschnitte Anliegen und Ort und Kontakt', () => {
    expect(einsatzZusammenfassung(daten()).map((abschnitt) => abschnitt.title)).toEqual([
      'Anliegen und Ort',
      'Kontakt',
    ]);
  });

  it('nennt Anliegen und Beschreibung und zählt Fotos ehrlich', () => {
    const [anliegen] = einsatzZusammenfassung(daten());
    const zeile = (label: string) => anliegen.rows.find((r) => r.label === label)?.value;
    expect(zeile('Anliegen')).toBe(ANLIEGEN[1]);
    expect(zeile('Beschreibung')).toBe(BESCHREIBUNG_OK);
    expect(zeile('Fotos')).toBe('keine');
    expect(einsatzZusammenfassung(daten(), 2)[0].rows.find((r) => r.label === 'Fotos')?.value).toBe('2 Datei(en)');
  });

  it('nennt Postleitzahl und Ort zusammen und die Straße', () => {
    const [anliegen] = einsatzZusammenfassung(daten({ strasse: 'Lahnstraße 1' }));
    const zeile = (label: string) => anliegen.rows.find((r) => r.label === label)?.value;
    expect(zeile('Ort')).toBe('35576 Wetzlar');
    expect(zeile('Straße')).toBe('Lahnstraße 1');
  });

  it('zeigt den Wunschzeitraum und die bestätigte Berechtigung', () => {
    const [, kontakt] = einsatzZusammenfassung(daten({ zeitraum: 'spaeter' }));
    const zeile = (label: string) => kontakt.rows.find((r) => r.label === label)?.value;
    expect(zeile('Telefon')).toBe('0641 123456');
    expect(zeile('Wunschzeitraum')).toBe('In den nächsten Wochen');
    expect(zeile('Berechtigung')).toBe('bestätigt');
  });

  it('baut den Namen mit Anrede, ohne doppelte Leerzeichen', () => {
    const [, kontakt] = einsatzZusammenfassung(daten({ anrede: 'Frau' }));
    expect(kontakt.rows.find((r) => r.label === 'Name')?.value).toBe('Frau Erika Muster');
  });

  it('nennt fehlende Angaben ehrlich', () => {
    const [anliegen, kontakt] = einsatzZusammenfassung(INITIAL);
    expect(anliegen.rows.find((r) => r.label === 'Ort')?.value).toBe('keine Angabe');
    expect(kontakt.rows.find((r) => r.label === 'Berechtigung')?.value).toBe('keine Angabe');
  });
});
