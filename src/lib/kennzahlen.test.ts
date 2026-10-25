import { describe, expect, it } from 'vitest';

import { kennzahlenAb, kennzahlenBerechnen, monate, monatInBerlin, type KennzahlVorgang } from './kennzahlen';

const JETZT = new Date('2026-10-25T12:00:00.000Z');

function v(teil: Partial<KennzahlVorgang>): KennzahlVorgang {
  return { art: 'anfrage', bereich: 'service-und-termin', status: 'neu', createdAt: '2026-10-10T10:00:00.000Z', ...teil };
}

describe('Monate der Kennzahlen', () => {
  it('aktueller Monat und zwei Vormonate, über den Jahreswechsel', () => {
    expect(monate(JETZT).map((m) => m.label)).toEqual(['August 2026', 'September 2026', 'Oktober 2026']);
    expect(monate(new Date('2027-01-15T12:00:00Z')).map((m) => m.schluessel)).toEqual(['2026-11', '2026-12', '2027-01']);
  });

  it('ordnet nach deutscher Zeit zu und liest einen Tag Puffer', () => {
    expect(monatInBerlin('2026-09-30T22:30:00.000Z')).toBe('2026-10');
    expect(monatInBerlin('2026-09-30T21:30:00.000Z')).toBe('2026-09');
    expect(kennzahlenAb(JETZT)).toBe('2026-07-31T00:00:00.000Z');
  });
});

describe('kennzahlenBerechnen', () => {
  const vorgaenge: KennzahlVorgang[] = [
    v({ art: 'bestellung', bereich: 'schluessel-nach-code', createdAt: '2026-10-02T08:00:00.000Z', status: 'versendet' }),
    v({ art: 'bestellung', bereich: 'gleichschliessende-zylinder', createdAt: '2026-09-12T08:00:00.000Z', status: 'abgeschlossen' }),
    v({ art: 'anfrage', bereich: 'schluessel-nach-vorlage', createdAt: '2026-10-03T08:00:00.000Z', status: 'freigegeben' }),
    v({ art: 'anfrage', bereich: 'schluessel-nach-vorlage', createdAt: '2026-08-03T08:00:00.000Z', status: 'nicht-moeglich' }),
    v({ art: 'termin', bereich: 'autoschluessel', createdAt: '2026-10-04T08:00:00.000Z', status: 'terminiert' }),
    v({ art: 'termin', bereich: 'autoschluessel', createdAt: '2026-10-05T08:00:00.000Z', status: 'storniert' }),
    v({ art: 'projekt', bereich: 'schliessanlagen', createdAt: '2026-09-30T22:30:00.000Z', status: 'in-pruefung' }),
    v({ art: 'partner', bereich: 'autoschluessel', createdAt: '2026-08-20T08:00:00.000Z', status: 'neu' }),
    // Älter als drei Monate: zählt nur noch als offener Vorgang.
    v({ art: 'anfrage', bereich: 'service-und-termin', createdAt: '2026-05-01T08:00:00.000Z', status: 'wartet-auf-kunde' }),
  ];
  const k = kennzahlenBerechnen(vorgaenge, JETZT);

  it('zählt Bestellungen, Foto-, Termin-, Projektanfragen und Partneranmeldungen je Monat', () => {
    const werte = Object.fromEntries(k.zeilen.map((z) => [z.id, z.werte]));
    expect(werte).toEqual({
      bestellungen: [0, 1, 1],
      fotoanfragen: [1, 0, 1],
      terminanfragen: [0, 0, 2],
      // 30.09. 22:30 UTC ist in Berlin schon Oktober.
      projektanfragen: [0, 0, 1],
      partneranmeldungen: [1, 0, 0],
    });
  });

  it('zählt offene Vorgänge je Status ohne Abgeschlossene, Stornierte und „nicht möglich“', () => {
    expect(k.offen).toEqual([
      { status: 'neu', label: 'Neu', anzahl: 1 },
      { status: 'in-pruefung', label: 'In Prüfung', anzahl: 1 },
      { status: 'freigegeben', label: 'Freigegeben', anzahl: 1 },
      { status: 'wartet-auf-kunde', label: 'Wartet auf Kunde', anzahl: 1 },
      { status: 'terminiert', label: 'Terminiert', anzahl: 1 },
      { status: 'versendet', label: 'Versendet', anzahl: 1 },
    ]);
    expect(k.offenGesamt).toBe(6);
  });

  it('summiert bezahlte Beträge nach Zahlungseingang, abzüglich Teilerstattungen', () => {
    const bezahlt = kennzahlenBerechnen(
      [
        v({ createdAt: '2026-09-28T08:00:00.000Z', zahlung: { status: 'bezahlt', betragCent: 6990, bezahltAm: '2026-10-01T08:00:00.000Z' } }),
        v({ zahlung: { status: 'bezahlt', betragCent: 3075, erstattetCent: 1000, bezahltAm: '2026-10-11T08:00:00.000Z' } }),
        v({ createdAt: '2026-08-15T08:00:00.000Z', zahlung: { status: 'bezahlt', betragCent: 1290 } }),
        v({ zahlung: { status: 'offen', betragCent: 9999 } }),
        v({ zahlung: { status: 'erstattet', betragCent: 5000, erstattetCent: 5000, bezahltAm: '2026-10-02T08:00:00.000Z' } }),
      ],
      JETZT,
    );
    expect(bezahlt.umsatzCent).toEqual([1290, 0, 6990 + 2075]);
  });
});
