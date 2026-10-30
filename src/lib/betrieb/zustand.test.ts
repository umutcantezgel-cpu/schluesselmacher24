import { describe, expect, it } from 'vitest';

import { betriebBefunde, grenzenAusUmgebung, MB, STANDARD_GRENZEN, type Messwerte } from './zustand';

const JETZT = new Date('2026-10-30T02:17:00Z');
const STUNDE = 3_600_000;

function messwerte(teil: Partial<Messwerte> = {}): Messwerte {
  return {
    datenbankBytes: 40 * MB,
    ablageBytes: 120 * MB,
    tabellenBytes: 8 * MB,
    lebenszeichen: {
      'cron-taeglich': new Date(JETZT.getTime() - 24 * STUNDE),
      'sicherung-db': new Date(JETZT.getTime() - 2 * STUNDE),
      'sicherung-dateien': new Date(JETZT.getTime() - 2 * STUNDE),
    },
    ...teil,
  };
}

describe('betriebBefunde', () => {
  it('meldet nichts, solange alles im grünen Bereich ist', () => {
    expect(betriebBefunde(messwerte(), JETZT)).toEqual([]);
  });

  it('warnt ab 60 % und meldet ab 80 % kritisch – je Grenze', () => {
    expect(betriebBefunde(messwerte({ datenbankBytes: 300 * MB }), JETZT)).toEqual([
      { art: 'datenbank-groesse', stufe: 'warnung', text: 'Datenbank: 300 MB von 500 MB belegt (60 %).' },
    ]);
    const kritisch = betriebBefunde(messwerte({ datenbankBytes: 450 * MB, ablageBytes: 700 * MB }), JETZT);
    expect(kritisch.map((befund) => [befund.art, befund.stufe])).toEqual([
      ['datenbank-groesse', 'kritisch'],
      ['ablage-groesse', 'kritisch'],
    ]);
  });

  it('meldet eine ausgebliebene Sicherung nach 36 Stunden kritisch, eine nie gelaufene als Warnung', () => {
    const befunde = betriebBefunde(
      messwerte({
        lebenszeichen: { 'sicherung-db': new Date(JETZT.getTime() - 37 * STUNDE) },
      }),
      JETZT,
    );
    expect(befunde).toEqual([
      { art: 'sicherung-db', stufe: 'kritisch', text: 'Sicherung der Datenbank: letzter Erfolg vor 37 Stunden.' },
      {
        art: 'sicherung-dateien',
        stufe: 'warnung',
        text: 'Sicherung der Dateien: noch nie gelaufen. Einrichtung siehe docs/SUPABASE.md.',
      },
    ]);
  });

  it('prüft keine Sicherung ohne Lebenszeichen-Tabelle oder wenn sie abgeschaltet ist', () => {
    expect(betriebBefunde(messwerte({ lebenszeichen: null }), JETZT)).toEqual([]);
    expect(
      betriebBefunde(messwerte({ lebenszeichen: {} }), JETZT, { ...STANDARD_GRENZEN, sicherungPruefen: false }),
    ).toEqual([]);
  });

  it('rechnet den Egress der Sicherung auf einen Monat hoch', () => {
    const befunde = betriebBefunde(messwerte({ tabellenBytes: 60 * MB }), JETZT);
    expect(befunde).toHaveLength(1);
    expect(befunde[0]).toMatchObject({ art: 'sicherung-egress', stufe: 'warnung' });
    expect(befunde[0].text).toContain('1800 MB');
  });
});

describe('grenzenAusUmgebung', () => {
  it('nimmt ohne Angaben die Grenzen des Free-Plans', () => {
    expect(grenzenAusUmgebung({})).toEqual(STANDARD_GRENZEN);
  });

  it('übernimmt gültige Werte und ignoriert unsinnige', () => {
    const grenzen = grenzenAusUmgebung({
      SM24_GRENZE_DATENBANK_MB: '8192',
      SM24_GRENZE_ABLAGE_MB: 'viel',
      SM24_GRENZE_WARNUNG_PROZENT: '70',
      SM24_GRENZE_KRITISCH_PROZENT: '90',
      SM24_GRENZE_SICHERUNG_STUNDEN: '-3',
      SM24_SICHERUNG_PRUEFEN: '0',
    });
    expect(grenzen).toEqual({
      ...STANDARD_GRENZEN,
      datenbankBytes: 8192 * MB,
      warnung: 0.7,
      kritisch: 0.9,
      sicherungPruefen: false,
    });
  });

  it('hält die Warnschwelle nie über der kritischen', () => {
    const grenzen = grenzenAusUmgebung({ SM24_GRENZE_WARNUNG_PROZENT: '95', SM24_GRENZE_KRITISCH_PROZENT: '80' });
    expect(grenzen.warnung).toBe(0.8);
  });
});
