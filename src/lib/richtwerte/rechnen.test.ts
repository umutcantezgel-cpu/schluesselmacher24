import { describe, expect, it } from 'vitest';

import {
  MAX_TUEREN,
  orientierungsHinweis,
  serviceEinsatzBerechnen,
  serviceEinsatzZusammenfassung,
  spanneText,
  tuerAbsicherungBerechnen,
  tuerAbsicherungZusammenfassung,
} from './rechnen';
import type { ServiceEinsatzWerte, Spanne, TuerAbsicherungWerte } from './typen';
import { PLATZHALTER_RICHTWERTE } from './uebersetzung';

const s = (vonCent: number, bisCent: number): Spanne => ({ vonCent, bisCent });

const tuer: TuerAbsicherungWerte = {
  platzhalter: false,
  hinweis: null,
  tuerarten: [
    { kennung: 'haustuer', label: 'Hauseingangstür', beschreibung: null, spanne: s(5000, 8000) },
    { kennung: 'nebentuer', label: 'Nebentür', beschreibung: null, spanne: null },
  ],
  massnahmen: [
    { kennung: 'zylinder', label: 'Profilzylinder', beschreibung: null, spanne: s(8999, 14950) },
    { kennung: 'beschlag', label: 'Schutzbeschlag', beschreibung: null, spanne: s(12000, 20000) },
    { kennung: 'querriegel', label: 'Querriegelschloss', beschreibung: null, spanne: null },
  ],
};

const service: ServiceEinsatzWerte = {
  platzhalter: false,
  hinweis: null,
  leistungen: [
    { kennung: 'zylindertausch', label: 'Zylinder tauschen', einheit: 'je-tuer', beschreibung: null, spanne: s(2500, 4000) },
    { kennung: 'beratung', label: 'Beratung vor Ort', einheit: 'pauschal', beschreibung: null, spanne: s(6000, 9000) },
    { kennung: 'wartung', label: 'Wartung', einheit: 'je-tuer', beschreibung: null, spanne: null },
  ],
  anfahrt: s(3000, 4500),
};

describe('Türabsicherung', () => {
  it('addiert Türart und gewählte Maßnahmen', () => {
    expect(tuerAbsicherungBerechnen(tuer, { tuerart: 'haustuer', massnahmen: ['zylinder', 'beschlag'] })).toEqual({
      art: 'spanne',
      spanne: s(5000 + 8999 + 12000, 8000 + 14950 + 20000),
    });
  });

  it('zählt doppelt gewählte Maßnahmen einmal und übergeht unbekannte', () => {
    expect(
      tuerAbsicherungBerechnen(tuer, { tuerart: 'haustuer', massnahmen: ['zylinder', 'zylinder', 'gibt-es-nicht'] }),
    ).toEqual({ art: 'spanne', spanne: s(13999, 22950) });
  });

  it('braucht eine Türart und mindestens eine Maßnahme', () => {
    expect(tuerAbsicherungBerechnen(tuer, { tuerart: null, massnahmen: ['zylinder'] })).toEqual({ art: 'unvollstaendig' });
    expect(tuerAbsicherungBerechnen(tuer, { tuerart: 'haustuer', massnahmen: [] })).toEqual({ art: 'unvollstaendig' });
    expect(tuerAbsicherungBerechnen(tuer, { tuerart: 'unbekannt', massnahmen: ['zylinder'] })).toEqual({
      art: 'unvollstaendig',
    });
    expect(tuerAbsicherungBerechnen(tuer, { tuerart: 'haustuer', massnahmen: ['unbekannt'] })).toEqual({
      art: 'unvollstaendig',
    });
  });

  it('nennt keinen Betrag, wenn eine Spanne der Türart oder einer Maßnahme fehlt', () => {
    const fehlt = { art: 'kein-richtwert', grund: 'betrag-fehlt' };
    expect(tuerAbsicherungBerechnen(tuer, { tuerart: 'nebentuer', massnahmen: ['zylinder'] })).toEqual(fehlt);
    expect(tuerAbsicherungBerechnen(tuer, { tuerart: 'haustuer', massnahmen: ['zylinder', 'querriegel'] })).toEqual(
      fehlt,
    );
  });

  it('nennt als Platzhalter nie einen Betrag — auch nicht bei vollständigen Spannen', () => {
    expect(
      tuerAbsicherungBerechnen({ ...tuer, platzhalter: true }, { tuerart: 'haustuer', massnahmen: ['zylinder'] }),
    ).toEqual({ art: 'kein-richtwert', grund: 'platzhalter' });
  });

  it('nennt mit der Platzhalter-Struktur keinen Betrag', () => {
    const { tuerAbsicherung } = PLATZHALTER_RICHTWERTE;
    const alle = { tuerart: 'haustuer', massnahmen: tuerAbsicherung.massnahmen.map((m) => m.kennung) };
    expect(tuerAbsicherungBerechnen(tuerAbsicherung, alle).art).toBe('kein-richtwert');
  });

  it('nimmt 0 € als gepflegten Betrag', () => {
    const frei = { ...tuer, tuerarten: [{ kennung: 'x', label: 'X', beschreibung: null, spanne: s(0, 0) }] };
    expect(tuerAbsicherungBerechnen(frei, { tuerart: 'x', massnahmen: ['beschlag'] })).toEqual({
      art: 'spanne',
      spanne: s(12000, 20000),
    });
  });

  it('fasst die Auswahl zusammen', () => {
    expect(tuerAbsicherungZusammenfassung(tuer, { tuerart: 'haustuer', massnahmen: ['beschlag', 'zylinder'] })).toEqual([
      { label: 'Türart', wert: 'Hauseingangstür' },
      { label: 'Maßnahmen', wert: 'Profilzylinder, Schutzbeschlag' },
    ]);
    expect(tuerAbsicherungZusammenfassung(tuer, { tuerart: null, massnahmen: ['zylinder'] })).toEqual([
      { label: 'Türart', wert: 'noch nicht gewählt' },
      { label: 'Maßnahme', wert: 'Profilzylinder' },
    ]);
  });
});

describe('Serviceeinsatz', () => {
  it('rechnet Leistungen je Tür mal Anzahl, pauschale einmal, und die Anfahrt dazu', () => {
    expect(
      serviceEinsatzBerechnen(service, { leistungen: ['zylindertausch', 'beratung'], anzahlTueren: 3 }),
    ).toEqual({ art: 'spanne', spanne: s(2500 * 3 + 6000 + 3000, 4000 * 3 + 9000 + 4500) });
  });

  it('ignoriert die Türanzahl, wenn nur pauschale Leistungen gewählt sind', () => {
    const erwartet = { art: 'spanne', spanne: s(9000, 13500) };
    expect(serviceEinsatzBerechnen(service, { leistungen: ['beratung'], anzahlTueren: 7 })).toEqual(erwartet);
    expect(serviceEinsatzBerechnen(service, { leistungen: ['beratung'], anzahlTueren: 0 })).toEqual(erwartet);
  });

  it('braucht eine Leistung und bei Leistungen je Tür eine gültige Türanzahl', () => {
    const offen = { art: 'unvollstaendig' };
    expect(serviceEinsatzBerechnen(service, { leistungen: [], anzahlTueren: 2 })).toEqual(offen);
    for (const anzahl of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(serviceEinsatzBerechnen(service, { leistungen: ['zylindertausch'], anzahlTueren: anzahl })).toEqual(offen);
    }
  });

  it('verweist große Vorhaben an die Anfrage', () => {
    expect(
      serviceEinsatzBerechnen(service, { leistungen: ['zylindertausch'], anzahlTueren: MAX_TUEREN }).art,
    ).toBe('spanne');
    expect(
      serviceEinsatzBerechnen(service, { leistungen: ['zylindertausch'], anzahlTueren: MAX_TUEREN + 1 }),
    ).toEqual({ art: 'kein-richtwert', grund: 'umfang' });
  });

  it('nennt keinen Betrag ohne Anfahrt oder mit einer Leistung ohne Spanne', () => {
    const fehlt = { art: 'kein-richtwert', grund: 'betrag-fehlt' };
    expect(
      serviceEinsatzBerechnen({ ...service, anfahrt: null }, { leistungen: ['beratung'], anzahlTueren: 1 }),
    ).toEqual(fehlt);
    expect(serviceEinsatzBerechnen(service, { leistungen: ['beratung', 'wartung'], anzahlTueren: 2 })).toEqual(fehlt);
  });

  it('nimmt eine kostenfreie Anfahrt als gepflegten Betrag', () => {
    expect(
      serviceEinsatzBerechnen({ ...service, anfahrt: s(0, 0) }, { leistungen: ['beratung'], anzahlTueren: 1 }),
    ).toEqual({ art: 'spanne', spanne: s(6000, 9000) });
  });

  it('nennt als Platzhalter nie einen Betrag', () => {
    expect(
      serviceEinsatzBerechnen({ ...service, platzhalter: true }, { leistungen: ['beratung'], anzahlTueren: 1 }),
    ).toEqual({ art: 'kein-richtwert', grund: 'platzhalter' });
    const { serviceEinsatz } = PLATZHALTER_RICHTWERTE;
    const alle = { leistungen: serviceEinsatz.leistungen.map((l) => l.kennung), anzahlTueren: 4 };
    expect(serviceEinsatzBerechnen(serviceEinsatz, alle).art).toBe('kein-richtwert');
  });

  it('fasst die Auswahl zusammen, die Türanzahl nur bei Leistungen je Tür', () => {
    expect(serviceEinsatzZusammenfassung(service, { leistungen: ['beratung', 'zylindertausch'], anzahlTueren: 4 })).toEqual([
      { label: 'Leistungen', wert: 'Zylinder tauschen (je Tür), Beratung vor Ort (pauschal)' },
      { label: 'Anzahl Türen', wert: '4' },
    ]);
    expect(serviceEinsatzZusammenfassung(service, { leistungen: ['beratung'], anzahlTueren: 4 })).toEqual([
      { label: 'Leistung', wert: 'Beratung vor Ort (pauschal)' },
    ]);
    expect(serviceEinsatzZusammenfassung(service, { leistungen: [], anzahlTueren: 1 })).toEqual([
      { label: 'Leistungen', wert: 'noch keine gewählt' },
    ]);
  });
});

describe('Anzeige', () => {
  it('zeigt ganze Euro und schließt die gerechnete Spanne ein', () => {
    expect(spanneText(s(12000, 18000))).toBe('ca. 120 – 180 €');
    expect(spanneText(s(12099, 18001))).toBe('ca. 120 – 181 €');
    expect(spanneText(s(8999, 14950))).toBe('ca. 89 – 150 €');
    expect(spanneText(s(120000, 1850050))).toBe('ca. 1.200 – 18.501 €');
  });

  it('zeigt einen einzelnen Betrag, wenn beide Grenzen gleich sind', () => {
    expect(spanneText(s(9000, 9000))).toBe('ca. 90 €');
    expect(spanneText(s(0, 0))).toBe('ca. 0 €');
  });

  it('sagt immer „unverbindliche Orientierung“ — genau einmal', () => {
    expect(orientierungsHinweis(null)).toBe('Unverbindliche Orientierung.');
    expect(orientierungsHinweis('  ')).toBe('Unverbindliche Orientierung.');
    expect(orientierungsHinweis('Preis nach Prüfung.')).toBe('Unverbindliche Orientierung. Preis nach Prüfung.');
    const gepflegt = 'Unverbindliche Orientierung. Der tatsächliche Preis steht erst nach unserer Prüfung fest.';
    expect(orientierungsHinweis(gepflegt)).toBe(gepflegt);
  });
});
