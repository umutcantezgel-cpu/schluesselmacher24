import { describe, expect, it } from 'vitest';

import { feiertagAm, gesetzlicheFeiertage, ostersonntag } from './feiertage';
import type { FederalState } from './types';

const daten = (jahr: number, land?: FederalState) => gesetzlicheFeiertage(jahr, land).map((f) => f.date);

describe('ostersonntag (Gaußsche Osterformel)', () => {
  it.each([
    [2024, '2024-03-31'],
    [2025, '2025-04-20'],
    [2026, '2026-04-05'],
    [2027, '2027-03-28'],
    [2028, '2028-04-16'],
    // Sonderfälle der Formel (Lichtenberg): 1981 und 1954.
    [1981, '1981-04-19'],
    [1954, '1954-04-18'],
    [2049, '2049-04-18'],
  ])('%i → %s', (jahr, datum) => {
    expect(ostersonntag(jahr)).toBe(datum);
  });
});

describe('gesetzliche Feiertage', () => {
  it('Hessen 2027 (Standard ohne Bundesland)', () => {
    expect(daten(2027)).toEqual([
      '2027-01-01',
      '2027-03-26', // Karfreitag
      '2027-03-28', // Ostersonntag
      '2027-03-29', // Ostermontag
      '2027-05-01',
      '2027-05-06', // Christi Himmelfahrt
      '2027-05-16', // Pfingstsonntag
      '2027-05-17', // Pfingstmontag
      '2027-05-27', // Fronleichnam
      '2027-10-03',
      '2027-12-25',
      '2027-12-26',
    ]);
  });

  it('Hessen 2028', () => {
    expect(daten(2028, 'HE')).toEqual([
      '2028-01-01',
      '2028-04-14',
      '2028-04-16',
      '2028-04-17',
      '2028-05-01',
      '2028-05-25',
      '2028-06-04',
      '2028-06-05',
      '2028-06-15',
      '2028-10-03',
      '2028-12-25',
      '2028-12-26',
    ]);
  });

  it('Landesfeiertage anderer Länder', () => {
    expect(daten(2027, 'BY')).toEqual(expect.arrayContaining(['2027-01-06', '2027-05-27', '2027-11-01']));
    expect(daten(2027, 'BY')).not.toContain('2027-10-31');
    expect(daten(2027, 'NI')).toContain('2027-10-31');
    expect(daten(2027, 'NI')).not.toContain('2027-05-27');
    expect(daten(2028, 'BE')).toContain('2028-03-08');
    expect(daten(2028, 'TH')).toContain('2028-09-20');
    expect(daten(2028, 'SL')).toContain('2028-08-15');
    // Buß- und Bettag: Mittwoch vor dem 23. November.
    expect(daten(2027, 'SN')).toContain('2027-11-17');
    expect(daten(2028, 'SN')).toContain('2028-11-22');
    expect(daten(2028, 'HE')).not.toContain('2028-11-22');
  });

  it('alle 16 Länder haben die bundesweiten Feiertage', () => {
    const laender: FederalState[] = ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'];
    for (const land of laender) {
      expect(daten(2028, land), land).toEqual(
        expect.arrayContaining(['2028-01-01', '2028-04-14', '2028-04-17', '2028-05-01', '2028-05-25', '2028-06-05', '2028-10-03', '2028-12-25', '2028-12-26']),
      );
    }
  });

  it('feiertagAm nennt den Feiertag', () => {
    expect(feiertagAm('2027-05-27', 'HE')?.name).toBe('Fronleichnam');
    expect(feiertagAm('2027-05-28', 'HE')).toBeUndefined();
  });
});
