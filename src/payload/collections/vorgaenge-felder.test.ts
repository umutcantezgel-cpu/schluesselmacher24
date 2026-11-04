import { describe, expect, it } from 'vitest';

import type { Field } from 'payload';

import { Vorgaenge } from './Vorgaenge';

type MitName = Field & { name?: string; label?: string; fields?: Field[]; tabs?: Array<{ label?: string; fields: Field[]; admin?: { condition?: (data: Record<string, unknown>) => boolean } }> };

function finde(felder: Field[], name: string): MitName | undefined {
  for (const feld of felder as MitName[]) {
    if (feld.name === name) return feld;
    const innen = feld.fields ? finde(feld.fields, name) : undefined;
    if (innen) return innen;
    for (const tab of feld.tabs ?? []) {
      const imTab = finde(tab.fields, name);
      if (imTab) return imTab;
    }
  }
  return undefined;
}

function versandTab() {
  for (const feld of Vorgaenge.fields as MitName[]) {
    const tab = feld.tabs?.find((t) => t.label === 'Versand');
    if (tab) return tab;
  }
  throw new Error('Tab Versand fehlt');
}

describe('Backend-Felder der Vorgänge (E6-OPUS-04)', () => {
  it('zeigt den Versand bei Bestellungen und bei Schlüssel nach Vorlage, sonst nicht (G-25)', () => {
    const bedingung = versandTab().admin?.condition;
    expect(bedingung?.({ art: 'bestellung', bereich: 'schluessel-nach-code' })).toBe(true);
    expect(bedingung?.({ art: 'anfrage', bereich: 'schluessel-nach-vorlage' })).toBe(true);
    expect(bedingung?.({ art: 'anfrage', bereich: 'service-und-termin' })).toBe(false);
    expect(bedingung?.({ art: 'termin', bereich: 'autoschluessel' })).toBe(false);
  });

  it('nennt den Telefontermin nur bei telefonisch eingetragenen Terminen, ohne Datenbankspalte (E-57)', () => {
    const feld = finde(Vorgaenge.fields, 'telefonterminHinweis') as MitName & {
      virtual?: boolean;
      admin?: { condition?: (data: Record<string, unknown>) => boolean };
      hooks?: { afterRead?: Array<(args: { siblingData: Record<string, unknown> }) => unknown> };
    };
    expect(feld?.virtual).toBe(true);
    expect(feld?.admin?.condition?.({ daten: { telefonisch: true } })).toBe(true);
    expect(feld?.admin?.condition?.({ daten: {} })).toBe(false);
    const lesen = feld?.hooks?.afterRead?.[0];
    expect(lesen?.({ siblingData: { daten: { telefonisch: true } } })).toContain('ohne Online-Anzahlung');
    expect(lesen?.({ siblingData: { daten: { quelle: 'kontakt' } } })).toBeNull();
  });
});
