import { describe, expect, it } from 'vitest';

import type { Richtwerte } from '@/payload-types';
import { PLATZHALTER_RICHTWERTE, centAusEuro, richtwerteAusPayload, spanneAusEuro } from './uebersetzung';

const leer: Richtwerte = { id: 1 };

function doc(teil: Partial<Richtwerte>): Richtwerte {
  return { id: 1, ...teil };
}

describe('Euro → Cent', () => {
  it('rundet auf ganze Cent, auch bei ungenauen Kommazahlen', () => {
    expect(centAusEuro(19.99)).toBe(1999);
    expect(centAusEuro(0.1 + 0.2)).toBe(30);
    expect(centAusEuro(4.35)).toBe(435);
    expect(centAusEuro(149)).toBe(14900);
    expect(centAusEuro(1_000_000)).toBe(100_000_000);
  });

  it('nimmt 0 als gepflegten Betrag, leere und unsinnige Werte nicht', () => {
    expect(centAusEuro(0)).toBe(0);
    expect(centAusEuro(null)).toBeNull();
    expect(centAusEuro(undefined)).toBeNull();
    expect(centAusEuro(-1)).toBeNull();
    expect(centAusEuro(Number.NaN)).toBeNull();
    expect(centAusEuro(Number.POSITIVE_INFINITY)).toBeNull();
  });
});

describe('Spannen', () => {
  it('gilt nur vollständig und aufsteigend', () => {
    expect(spanneAusEuro(80, 120.5)).toEqual({ vonCent: 8000, bisCent: 12050 });
    expect(spanneAusEuro(90, 90)).toEqual({ vonCent: 9000, bisCent: 9000 });
    expect(spanneAusEuro(0, 0)).toEqual({ vonCent: 0, bisCent: 0 });
    expect(spanneAusEuro(80, null)).toBeNull();
    expect(spanneAusEuro(null, 120)).toBeNull();
    expect(spanneAusEuro(undefined, undefined)).toBeNull();
    expect(spanneAusEuro(120, 80)).toBeNull();
  });
});

describe('Richtwerte aus dem Global', () => {
  it('fällt bei leerem Global auf die Platzhalter-Struktur zurück', () => {
    expect(richtwerteAusPayload(leer)).toBe(PLATZHALTER_RICHTWERTE);
    expect(richtwerteAusPayload(null)).toBe(PLATZHALTER_RICHTWERTE);
    expect(richtwerteAusPayload(undefined)).toBe(PLATZHALTER_RICHTWERTE);
    expect(
      richtwerteAusPayload(doc({ platzhalter: false, tuerAbsicherung: { tuerarten: [], massnahmen: [] } })),
    ).toBe(PLATZHALTER_RICHTWERTE);
  });

  it('die Platzhalter-Struktur nennt keine Beträge', () => {
    const { tuerAbsicherung: t, serviceEinsatz: s } = PLATZHALTER_RICHTWERTE;
    expect(t.platzhalter && s.platzhalter).toBe(true);
    expect([...t.tuerarten, ...t.massnahmen, ...s.leistungen].every((p) => p.spanne === null)).toBe(true);
    expect(s.anfahrt).toBeNull();
  });

  it('übernimmt Aufbau und Beträge in Cent', () => {
    const werte = richtwerteAusPayload(
      doc({
        platzhalter: false,
        hinweis: '  Preis nach Prüfung.  ',
        tuerAbsicherung: {
          tuerarten: [{ kennung: 'haustuer', label: 'Hauseingangstür', beschreibung: 'Außentür', preisVon: 40, preisBis: 60.5 }],
          massnahmen: [{ kennung: 'zylinder', label: 'Profilzylinder', beschreibung: '', preisVon: 89.99, preisBis: null }],
        },
        serviceEinsatz: {
          leistungen: [{ kennung: 'zylindertausch', label: 'Zylinder tauschen', einheit: 'je-tuer', preisVon: 25, preisBis: 45 }],
          anfahrtVon: 30,
          anfahrtBis: 50,
        },
      }),
    );

    expect(werte.tuerAbsicherung).toEqual({
      platzhalter: false,
      hinweis: 'Preis nach Prüfung.',
      tuerarten: [
        { kennung: 'haustuer', label: 'Hauseingangstür', beschreibung: 'Außentür', spanne: { vonCent: 4000, bisCent: 6050 } },
      ],
      massnahmen: [{ kennung: 'zylinder', label: 'Profilzylinder', beschreibung: null, spanne: null }],
    });
    expect(werte.serviceEinsatz).toEqual({
      platzhalter: false,
      hinweis: 'Preis nach Prüfung.',
      leistungen: [
        {
          kennung: 'zylindertausch',
          label: 'Zylinder tauschen',
          einheit: 'je-tuer',
          beschreibung: null,
          spanne: { vonCent: 2500, bisCent: 4500 },
        },
      ],
      anfahrt: { vonCent: 3000, bisCent: 5000 },
    });
  });

  it('bleibt Platzhalter, solange der Haken nicht ausdrücklich entfernt ist', () => {
    const zeile = { kennung: 'haustuer', label: 'Hauseingangstür', preisVon: 1, preisBis: 2 };
    for (const platzhalter of [true, null, undefined]) {
      const werte = richtwerteAusPayload(doc({ platzhalter, tuerAbsicherung: { tuerarten: [zeile] } }));
      expect(werte.tuerAbsicherung.platzhalter).toBe(true);
      expect(werte.serviceEinsatz.platzhalter).toBe(true);
    }
  });

  it('lässt Zeilen ohne Kennung oder Bezeichnung weg und zählt doppelte Kennungen einmal', () => {
    const werte = richtwerteAusPayload(
      doc({
        tuerAbsicherung: {
          massnahmen: [
            { kennung: 'zylinder', label: 'Erster Eintrag', preisVon: 10, preisBis: 20 },
            { kennung: 'zylinder', label: 'Doppelt', preisVon: 99, preisBis: 99 },
            { kennung: '  ', label: 'Ohne Kennung' },
            { kennung: 'beschlag', label: '' },
          ],
        },
      }),
    );
    expect(werte.tuerAbsicherung.massnahmen.map((m) => m.label)).toEqual(['Erster Eintrag']);
  });

  it('ohne Hinweis und ohne Anfahrt bleiben beide leer', () => {
    const werte = richtwerteAusPayload(
      doc({
        platzhalter: false,
        hinweis: '   ',
        serviceEinsatz: { leistungen: [{ kennung: 'beratung', label: 'Beratung', einheit: 'pauschal' }], anfahrtVon: 30 },
      }),
    );
    expect(werte.serviceEinsatz.hinweis).toBeNull();
    expect(werte.serviceEinsatz.anfahrt).toBeNull();
    expect(werte.serviceEinsatz.leistungen[0].einheit).toBe('pauschal');
    expect(werte.tuerAbsicherung.tuerarten).toEqual([]);
  });
});
