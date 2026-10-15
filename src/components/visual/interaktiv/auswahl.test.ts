import { describe, expect, it } from 'vitest';

import {
  alleTueren,
  aufzaehlung,
  naechsterIndex,
  oeffnendeSchluessel,
  schliessBeschreibung,
  tuerBeschreibung,
  tuerName,
  type PlanSchluessel,
} from './auswahl';

const plan: PlanSchluessel[] = [
  { kennung: 'wurzel', kuerzel: 'HS', tueren: ['t1', 't2', 't3'] },
  { kennung: 'e1', kuerzel: 'ES 1', tueren: ['t1'] },
  { kennung: 'e2', kuerzel: 'ES 2', tueren: ['t2'] },
  { kennung: 'e3', kuerzel: 'ES 3', tueren: ['t3'] },
];

describe('Texte für Screenreader', () => {
  it('benennt Türen und Zentraltüren', () => {
    expect(tuerName('t3')).toBe('Tür 3');
    expect(tuerName('z1')).toBe('Zentraltür 1');
    expect(tuerName('x')).toBe('x');
  });

  it('zählt mit „und“ auf', () => {
    expect(aufzaehlung([])).toBe('');
    expect(aufzaehlung(['A'])).toBe('A');
    expect(aufzaehlung(['A', 'B', 'C'])).toBe('A, B und C');
  });

  it('beschreibt, was ein Schlüssel schließt', () => {
    expect(schliessBeschreibung(plan[0])).toBe('HS schließt 3 Türen: Tür 1, Tür 2 und Tür 3.');
    expect(schliessBeschreibung(plan[2])).toBe('ES 2 schließt 1 Tür: Tür 2.');
  });

  it('beschreibt, welche Schlüssel eine Tür öffnen', () => {
    expect(oeffnendeSchluessel(plan, 't3').map((s) => s.kuerzel)).toEqual(['HS', 'ES 3']);
    expect(tuerBeschreibung(plan, 't3')).toBe('Tür 3 öffnen: HS und ES 3.');
    expect(tuerBeschreibung(plan, 't9')).toBe('Tür 9: kein Schlüssel im Plan.');
  });

  it('listet alle Türen, Zentraltüren zuerst', () => {
    expect(alleTueren([...plan, { kennung: 'e4', kuerzel: 'ES 4', tueren: ['t10', 'z2', 'z1'] }])).toEqual([
      'z1',
      'z2',
      't1',
      't2',
      't3',
      't10',
    ]);
  });
});

describe('naechsterIndex (Registerkarten)', () => {
  it('wandert mit Pfeilen ringsum', () => {
    expect(naechsterIndex(0, 'ArrowRight', 3)).toBe(1);
    expect(naechsterIndex(2, 'ArrowRight', 3)).toBe(0);
    expect(naechsterIndex(0, 'ArrowLeft', 3)).toBe(2);
    expect(naechsterIndex(1, 'ArrowDown', 3)).toBe(2);
    expect(naechsterIndex(1, 'ArrowUp', 3)).toBe(0);
  });

  it('springt mit Pos1 und Ende an den Rand und ignoriert andere Tasten', () => {
    expect(naechsterIndex(1, 'Home', 3)).toBe(0);
    expect(naechsterIndex(1, 'End', 3)).toBe(2);
    expect(naechsterIndex(1, 'Enter', 3)).toBeNull();
    expect(naechsterIndex(0, 'ArrowRight', 0)).toBeNull();
  });
});
