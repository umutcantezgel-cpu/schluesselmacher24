import { describe, expect, it } from 'vitest';

import {
  ANLIEGEN,
  INITIAL,
  kontaktZusammenfassung,
  schrittGueltig,
  type KontaktDaten,
} from './kern';

const NACHRICHT_OK = 'Ist der Riegel an der Haustür noch zu reparieren?';

/** Ein vollständig gültiger Entwurf, der je Test gezielt verändert wird. */
function daten(aenderungen: Partial<KontaktDaten> = {}): KontaktDaten {
  return {
    ...INITIAL,
    anliegen: ANLIEGEN[0],
    nachricht: NACHRICHT_OK,
    vorname: 'Erika',
    nachname: 'Muster',
    email: 'erika@example.test',
    telefon: '0641 123456',
    antwortweg: 'email',
    ...aenderungen,
  };
}

describe('schrittGueltig · nachricht', () => {
  it('ist gültig mit Anliegen und Nachricht', () => {
    expect(schrittGueltig(daten(), 'nachricht')).toBe(true);
  });

  it('ist ungültig ohne Anliegen', () => {
    expect(schrittGueltig(daten({ anliegen: '' }), 'nachricht')).toBe(false);
  });

  it('ist ungültig bei einem Anliegen, das nicht in der Liste steht', () => {
    expect(schrittGueltig(daten({ anliegen: 'Etwas Fremdes' as never }), 'nachricht')).toBe(false);
  });

  it('verlangt mindestens 10 Zeichen', () => {
    expect(schrittGueltig(daten({ nachricht: 'a'.repeat(9) }), 'nachricht')).toBe(false);
    expect(schrittGueltig(daten({ nachricht: 'a'.repeat(10) }), 'nachricht')).toBe(true);
  });

  it('zählt Leerzeichen am Rand nicht mit', () => {
    expect(schrittGueltig(daten({ nachricht: `   ${'a'.repeat(9)}   ` }), 'nachricht')).toBe(false);
  });

  it('erlaubt höchstens 2000 Zeichen', () => {
    expect(schrittGueltig(daten({ nachricht: 'a'.repeat(2000) }), 'nachricht')).toBe(true);
    expect(schrittGueltig(daten({ nachricht: 'a'.repeat(2001) }), 'nachricht')).toBe(false);
  });

  it('erlaubt eine Vorgangsnummer bis 40 Zeichen, nicht mehr', () => {
    expect(schrittGueltig(daten({ vorgangsnummer: 'V'.repeat(40) }), 'nachricht')).toBe(true);
    expect(schrittGueltig(daten({ vorgangsnummer: 'V'.repeat(41) }), 'nachricht')).toBe(false);
  });

  it('macht die Vorgangsnummer nicht zur Pflicht', () => {
    expect(schrittGueltig(daten({ vorgangsnummer: '' }), 'nachricht')).toBe(true);
  });
});

describe('schrittGueltig · kontakt', () => {
  it('verlangt auch beim Antwortweg E-Mail eine Telefonnummer (Pflichtfeld des Vorgangs)', () => {
    expect(schrittGueltig(daten({ antwortweg: 'email', telefon: '' }), 'kontakt')).toBe(false);
    expect(schrittGueltig(daten({ antwortweg: 'email', telefon: '0641 123456' }), 'kontakt')).toBe(true);
  });

  it('verlangt einen gewählten Antwortweg', () => {
    expect(schrittGueltig(daten({ antwortweg: '' }), 'kontakt')).toBe(false);
  });

  it('verlangt Vor- und Nachnamen', () => {
    expect(schrittGueltig(daten({ vorname: '' }), 'kontakt')).toBe(false);
    expect(schrittGueltig(daten({ nachname: ' M ' }), 'kontakt')).toBe(false);
  });

  it('verlangt eine E-Mail-Adresse im Muster', () => {
    expect(schrittGueltig(daten({ email: 'ohne-at.example.test' }), 'kontakt')).toBe(false);
    expect(schrittGueltig(daten({ email: 'erika@example' }), 'kontakt')).toBe(false);
  });

  it('verlangt beim Antwortweg Telefon eine Nummer mit mindestens sechs Ziffern', () => {
    expect(schrittGueltig(daten({ antwortweg: 'telefon', telefon: '', zeitfenster: 'egal' }), 'kontakt')).toBe(false);
    expect(schrittGueltig(daten({ antwortweg: 'telefon', telefon: '0641 1', zeitfenster: 'egal' }), 'kontakt')).toBe(false);
    expect(schrittGueltig(daten({ antwortweg: 'telefon', telefon: '0641 123', zeitfenster: 'egal' }), 'kontakt')).toBe(true);
  });

  it('verlangt beim Antwortweg Telefon ein Zeitfenster', () => {
    expect(schrittGueltig(daten({ antwortweg: 'telefon', telefon: '0641 123456', zeitfenster: '' }), 'kontakt')).toBe(false);
    expect(schrittGueltig(daten({ antwortweg: 'telefon', telefon: '0641 123456', zeitfenster: 'vormittags' }), 'kontakt')).toBe(true);
    expect(schrittGueltig(daten({ antwortweg: 'telefon', telefon: '0641 123456', zeitfenster: 'nachmittags' }), 'kontakt')).toBe(true);
  });

  it('verlangt das Zeitfenster nur beim Antwortweg Telefon', () => {
    expect(schrittGueltig(daten({ antwortweg: 'email', zeitfenster: '' }), 'kontakt')).toBe(true);
  });
});

describe('schrittGueltig · absenden', () => {
  it('ist gültig, wenn Nachricht und Kontakt gültig sind', () => {
    expect(schrittGueltig(daten(), 'absenden')).toBe(true);
  });

  it('ist ungültig, sobald ein Schritt davor ungültig ist', () => {
    expect(schrittGueltig(daten({ nachricht: 'zu kurz' }), 'absenden')).toBe(false);
    expect(schrittGueltig(daten({ vorname: '' }), 'absenden')).toBe(false);
  });
});

describe('kontaktZusammenfassung', () => {
  it('hat die Abschnitte Nachricht und Kontakt', () => {
    expect(kontaktZusammenfassung(daten()).map((abschnitt) => abschnitt.title)).toEqual(['Nachricht', 'Kontakt']);
  });

  it('nennt Anliegen, Nachricht und Vorgangsnummer ohne Angabe ehrlich', () => {
    const [nachricht] = kontaktZusammenfassung(daten({ vorgangsnummer: '' }));
    const zeile = (label: string) => nachricht.rows.find((r) => r.label === label)?.value;
    expect(zeile('Anliegen')).toBe(ANLIEGEN[0]);
    expect(zeile('Nachricht')).toBe(NACHRICHT_OK);
    expect(zeile('Vorgangsnummer')).toBe('keine Angabe');
    expect(zeile('Fotos')).toBe('keine');
  });

  it('zählt Fotos, wenn sie angegeben werden', () => {
    const [nachricht] = kontaktZusammenfassung(daten(), 2);
    expect(nachricht.rows.find((r) => r.label === 'Fotos')?.value).toBe('2 Datei(en)');
  });

  it('zeigt das Telefon immer und das Zeitfenster nur beim Antwortweg Telefon', () => {
    const perMail = kontaktZusammenfassung(daten({ antwortweg: 'email' }))[1];
    expect(perMail.rows.map((r) => r.label)).toContain('Telefon');
    expect(perMail.rows.map((r) => r.label)).not.toContain('Zeitfenster');
    expect(perMail.rows.find((r) => r.label === 'Antwort per')?.value).toBe('E-Mail');

    const perTelefon = kontaktZusammenfassung(
      daten({ antwortweg: 'telefon', telefon: '0641 123456', zeitfenster: 'nachmittags' }),
    )[1];
    expect(perTelefon.rows.find((r) => r.label === 'Telefon')?.value).toBe('0641 123456');
    expect(perTelefon.rows.find((r) => r.label === 'Zeitfenster')?.value).toBe('Nachmittags');
    expect(perTelefon.rows.find((r) => r.label === 'Antwort per')?.value).toBe('Telefon');
  });

  it('baut den Namen mit Anrede, ohne doppelte Leerzeichen', () => {
    const kontakt = kontaktZusammenfassung(daten({ anrede: 'Frau' }))[1];
    expect(kontakt.rows.find((r) => r.label === 'Name')?.value).toBe('Frau Erika Muster');
  });
});
