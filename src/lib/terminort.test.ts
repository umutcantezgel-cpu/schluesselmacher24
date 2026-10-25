import { describe, expect, it } from 'vitest';

import { defaults } from './data/defaults';
import { echteEinstellungen } from './rechtliches/test-hilfen';
import {
  AUSSENEINSATZ_HINWEIS,
  ausserhalbDerRegion,
  ausserhalbHinweis,
  buchungsOrt,
  mitbringliste,
  terminBeimKunden,
  terminOrtText,
  vorgangOrtText,
  werkstattAnschrift,
} from './terminort';

/** Echte Firmendaten aus content/settings.json: Sitz Gloelstraße 11, Werkstatt Langgasse 70. */
const FIRMA = echteEinstellungen().company;

describe('Werkstatt-Anschrift', () => {
  it('nimmt den gepflegten Standort', () => {
    expect(werkstattAnschrift(FIRMA)).toEqual({
      label: 'Werkstatt und Abholung',
      street: 'Langgasse 70',
      postalCode: '35576',
      city: 'Wetzlar',
    });
  });

  it('nimmt ohne eigenen Standort den Firmensitz, mit Platzhaltern nichts', () => {
    expect(werkstattAnschrift({ ...FIRMA, location: undefined })).toMatchObject({ street: 'Gloelstraße 11', city: 'Wetzlar' });
    expect(werkstattAnschrift(defaults.settings().company)).toBeUndefined();
    expect(werkstattAnschrift(undefined)).toBeUndefined();
  });
});

describe('Terminort-Texte', () => {
  const werkstatt = werkstattAnschrift(FIRMA);

  it('Werkstatt mit Anschrift, Fahrzeugtermin „in der Werkstatt, mit Fahrzeug“', () => {
    expect(terminOrtText({ location: 'werkstatt' }, { werkstatt })).toBe('In unserer Werkstatt (Langgasse 70, 35576 Wetzlar)');
    expect(terminOrtText({ location: 'werkstatt' }, { werkstatt, mitFahrzeug: true })).toBe(
      'In unserer Werkstatt, mit Fahrzeug (Langgasse 70, 35576 Wetzlar)',
    );
    expect(terminOrtText({ location: 'werkstatt' })).toBe('In unserer Werkstatt');
  });

  it('„vor-ort“ heißt beim Kunden — nur nach Absprache', () => {
    expect(terminOrtText({ location: 'vor-ort' }, { werkstatt, mitFahrzeug: true })).toBe('Bei Ihnen vor Ort (nach Absprache)');
  });

  it('leitet „mit Fahrzeug“ aus dem Angebot des Vorgangs ab', () => {
    const quote = {
      mode: 'fest' as const,
      depositCents: 6990,
      slotMinutes: 60,
      leadTimeDays: 7,
      requiresVehicleOnSite: true,
    };
    const appointment = { date: '2026-11-02', time: '09:00', durationMinutes: 60, location: 'werkstatt' as const };
    expect(vorgangOrtText({ appointment, quote }, FIRMA)).toBe('In unserer Werkstatt, mit Fahrzeug (Langgasse 70, 35576 Wetzlar)');
    expect(vorgangOrtText({ appointment, quote: { ...quote, requiresVehicleOnSite: false } }, FIRMA)).toBe(
      'In unserer Werkstatt (Langgasse 70, 35576 Wetzlar)',
    );
    expect(vorgangOrtText({ appointment: undefined, quote }, FIRMA)).toBeUndefined();
  });
});

describe('Anfragen von außerhalb der Region', () => {
  it('erst mit vollständiger PLZ; 35 ist die Region der Werkstatt', () => {
    expect(ausserhalbDerRegion('35576')).toBe(false);
    expect(ausserhalbDerRegion('35')).toBe(false);
    expect(ausserhalbDerRegion('2010')).toBe(false);
    expect(ausserhalbDerRegion('20095')).toBe(true);
    expect(ausserhalbDerRegion(' 60311 ')).toBe(true);
    expect(ausserhalbDerRegion('3500', 'Österreich')).toBe(true);
  });

  it('Hinweistext wie vorgegeben', () => {
    expect(ausserhalbHinweis('Wetzlar')).toBe(
      'Termine finden in unserer Werkstatt in Wetzlar statt. Ein Einsatz bei Ihnen ist nur nach individueller '
        + 'Prüfung möglich – rufen Sie uns dazu gern an.',
    );
    expect(ausserhalbHinweis()).toBe(`Termine finden in unserer Werkstatt statt. ${AUSSENEINSATZ_HINWEIS}`);
  });
});

describe('Mitbringliste', () => {
  it('Fahrzeug nur, wenn die Leistung am Fahrzeug erfolgt', () => {
    expect(mitbringliste(false)).toEqual([
      'Zulassungsbescheinigung Teil I (Fahrzeugschein) im Original',
      'Nachweis, dass Sie über das Fahrzeug verfügen dürfen',
      'Alle vorhandenen Schlüssel zum Fahrzeug',
    ]);
    expect(mitbringliste(true)[0]).toMatch(/^Ihr Fahrzeug/);
    expect(mitbringliste(true)).toHaveLength(4);
  });
});

describe('Leistungen beim Kunden', () => {
  it('bucht die Fahrzeugöffnung beim Kunden, alles andere in der Werkstatt', () => {
    expect(terminBeimKunden('fahrzeugoeffnung')).toBe(true);
    expect(buchungsOrt('fahrzeugoeffnung')).toBe('vor-ort');
    expect(buchungsOrt('zweitschluessel')).toBe('werkstatt');
    expect(buchungsOrt(undefined)).toBe('werkstatt');
  });

  it('lässt das Fahrzeug bei Terminen ohne Angebot nicht stillschweigend weg', () => {
    expect(mitbringliste('unbekannt')[0]).toMatch(/falls am Fahrzeug gearbeitet wird/);
    expect(mitbringliste(false).some((punkt) => /Ihr Fahrzeug/.test(punkt))).toBe(false);
  });
});
