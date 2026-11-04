import { describe, expect, it } from 'vitest';

import { defaults } from '../data/defaults';
import type { Schliessplan } from './schliessplan';
import { PLANER_QUELLE, planerVorgang, schnappschuss, schnappschussAusPayload } from './vorgang';
import { kodiere, planAusDaten, dekodiere } from './zwischenstand';

const KATALOG = defaults.cylinderCatalog();
const JETZT = new Date('2026-11-03T19:00:00.000Z');

/* Erfundene Testdaten (G4): ein Haus mit Haustür, Keller und Wohnung, Hausverwaltung und Mieter. */
function plan(teil: Partial<Schliessplan> = {}): Schliessplan {
  const form = KATALOG.forms[0].id;
  return {
    version: 1,
    tueren: [
      { id: 't1', bezeichnung: 'Haustür', form, a: 30, b: 35, optionen: ['ziehschutz'] },
      { id: 't2', bezeichnung: 'Keller', form, a: 30, b: 30 },
      { id: 't3', bezeichnung: 'Wohnung 1', form, a: 35, b: 35 },
    ],
    schluessel: [
      { id: 's1', bezeichnung: 'Hausverwaltung', anzahl: 2, reserve: 1 },
      { id: 's2', bezeichnung: 'Mieter Wohnung 1', anzahl: 3 },
    ],
    berechtigungen: { s1: ['t1', 't2', 't3'], s2: ['t3', 't1'] },
    masseGeprueft: true,
    ...teil,
  };
}

describe('Schnappschuss eines Schließplans (E5-OPUS-03)', () => {
  const s = schnappschuss(plan(), KATALOG, { jetzt: JETZT });

  it('nummeriert Türen und Schlüssel und übernimmt die Namen aus dem Katalog', () => {
    expect(s.tueren.map((t) => t.nr)).toEqual([1, 2, 3]);
    expect(s.tueren[0]).toMatchObject({ bezeichnung: 'Haustür', bauform: KATALOG.forms[0].label, masse: 'A 30 mm, B 35 mm' });
    expect(s.tueren[0].schutz).toBe(KATALOG.extras.find((e) => e.id === 'ziehschutz')?.label ?? 'Ziehschutz');
    expect(s.tueren[1].schutz).toBeUndefined();
    expect(s.erstellt).toBe(JETZT.toISOString());
  });

  it('hält die Matrix als Türnummern je Schlüssel fest, sortiert, mit Ebene und Vormerkung', () => {
    expect(s.schluessel[0]).toMatchObject({ bezeichnung: 'Hausverwaltung', tueren: [1, 2, 3], ebene: 'schließt alle Türen', reserve: 1 });
    expect(s.schluessel[1]).toMatchObject({ tueren: [1, 3], ebene: 'schließt mehrere Türen', reserve: 0 });
    expect(s.masseGeprueft).toBe(true);
  });

  it('nennt beim Preis den Weg wie der Planer', () => {
    expect(s.preis.art).toBe('angebot');
    expect(s.preis.text).toMatch(/^Angebot: /);
    const offen = schnappschuss(plan({ schluessel: [] , berechtigungen: {} }), KATALOG);
    expect(offen.preis).toMatchObject({ art: 'offen' });
  });

  it('liest gespeicherte Schnappschüsse zurück und verwirft fremde oder ältere Daten', () => {
    expect(schnappschussAusPayload({ schnappschuss: s })).toEqual(s);
    expect(schnappschussAusPayload({})).toBeNull();
    expect(schnappschussAusPayload({ schnappschuss: { ...s, version: 2 } })).toBeNull();
    expect(schnappschussAusPayload({ schnappschuss: { ...s, tueren: 'Haustür' } })).toBeNull();
    expect(schnappschussAusPayload(null)).toBeNull();
  });
});

describe('Anfrage aus dem Planer auf dem Server (E5-OPUS-03)', () => {
  it('baut das payload neu: Plan geprüft, nur bekannte Wünsche, Notiz gekürzt, Schnappschuss vom Server', () => {
    const ergebnis = planerVorgang(
      {
        quelle: PLANER_QUELLE,
        schliessplan: plan(),
        extraIds: ['erfunden', KATALOG.extras[0]?.id, KATALOG.extras[0]?.id, 7],
        notiz: `  ${'x'.repeat(2500)}  `,
        consent: true,
        schnappschuss: { gefaelscht: true },
        betragCents: 1,
      },
      KATALOG,
      JETZT,
    );
    expect(ergebnis.ok).toBe(true);
    if (!ergebnis.ok) return;
    expect(Object.keys(ergebnis.payload).sort()).toEqual(['consent', 'extraIds', 'notiz', 'quelle', 'schliessplan', 'schnappschuss']);
    expect(ergebnis.payload.extraIds).toEqual(KATALOG.extras[0] ? [KATALOG.extras[0].id] : []);
    expect(String(ergebnis.payload.notiz)).toHaveLength(2000);
    expect(schnappschussAusPayload(ergebnis.payload)?.schluessel[0].tueren).toEqual([1, 2, 3]);
  });

  it('übernimmt „Maße geprüft“ aus dem Vorgang, aber nie aus dem Link', () => {
    expect(planAusDaten(plan(), { masseGeprueft: true })?.masseGeprueft).toBe(true);
    expect(planAusDaten(plan())?.masseGeprueft).toBeUndefined();
    expect(dekodiere(kodiere(plan()))?.masseGeprueft).toBeUndefined();
  });

  it('lehnt Pläne ab, die nicht dem Schema entsprechen oder Fehler haben', () => {
    expect(planerVorgang({ quelle: PLANER_QUELLE, schliessplan: 'Haustür' }, KATALOG).ok).toBe(false);
    expect(planerVorgang({ quelle: PLANER_QUELLE, schliessplan: plan({ tueren: [] }) }, KATALOG).ok).toBe(false);
    const doppelt = plan({ tueren: [...plan().tueren, { ...plan().tueren[0] }] });
    expect(planerVorgang({ quelle: PLANER_QUELLE, schliessplan: doppelt }, KATALOG).ok).toBe(false);
    expect(planerVorgang({ quelle: PLANER_QUELLE }, KATALOG).ok).toBe(false);
  });

  it('streicht Verweise auf unbekannte Türen und doppelte Einträge der Matrix', () => {
    const roh = plan({ berechtigungen: { s1: ['t1', 't1', 'tX'], s2: ['t3'] } });
    expect(planAusDaten(roh)?.berechtigungen).toEqual({ s1: ['t1'], s2: ['t3'] });
  });
});
