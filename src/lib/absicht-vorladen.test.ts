import { describe, expect, it } from 'vitest';

import { vorladerFuer } from './absicht-vorladen';

describe('vorladerFuer', () => {
  it('lädt jedes Ziel nur beim ersten Mal vor', () => {
    const angefragt: string[] = [];
    const vorladen = vorladerFuer((href) => angefragt.push(href), () => false, new Set());
    vorladen('/schluessel-nach-code/ms-01');
    vorladen('/schluessel-nach-code/ms-01');
    vorladen('/schluessel-nach-code/ms-02');
    expect(angefragt).toEqual(['/schluessel-nach-code/ms-01', '/schluessel-nach-code/ms-02']);
  });

  it('lädt mit „Daten sparen“ nichts vor und merkt sich das Ziel nicht', () => {
    const angefragt: string[] = [];
    const geladen = new Set<string>();
    let sparen = true;
    const vorladen = vorladerFuer((href) => angefragt.push(href), () => sparen, geladen);
    vorladen('/a');
    expect(angefragt).toEqual([]);
    expect(geladen.size).toBe(0);
    sparen = false;
    vorladen('/a');
    expect(angefragt).toEqual(['/a']);
  });
});
