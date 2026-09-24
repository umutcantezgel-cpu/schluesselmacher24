import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import { zylinderDetails, zylinderZeilen } from './cylinder-summary';
import type { CylinderOrderDraft } from './types';

const catalog = defaults.cylinderCatalog();
const label = (id: string) => catalog.forms.find((f) => f.id === id)!.label;

const draft: CylinderOrderDraft = {
  items: [
    { uid: 'a', form: 'doppelzylinder', measureAMm: 30, measureBMm: 35, functionId: 'not-gefahr', qty: 2 },
    { uid: 'b', form: 'halbzylinder', measureAMm: 40, qty: 1 },
  ],
  keyCount: 5,
  extraIds: ['sicherungskarte', 'gibt-es-nicht'],
  expandable: false,
};

describe('zylinderZeilen', () => {
  it('beschreibt Bauform, Maße, Funktion, Stückzahl, Schlüssel und Extras', () => {
    const funktion = catalog.functions.find((f) => f.id === 'not-gefahr')!.label;
    const extra = catalog.extras.find((e) => e.id === 'sicherungskarte')!.label;
    expect(zylinderZeilen(draft, catalog)).toEqual([
      { label: label('doppelzylinder'), value: `30 mm / 35 mm · ${funktion} · 2 Stück` },
      { label: label('halbzylinder'), value: '40 mm · 1 Stück' },
      { label: 'Gemeinsame Schlüssel', value: '5 Stück' },
      { label: 'Zusatzoptionen', value: extra },
      { label: 'Spätere Erweiterung', value: 'Nicht vorgesehen' },
    ]);
  });

  it('lässt Zusatzoptionen weg, wenn keine gewählt sind', () => {
    const zeilen = zylinderZeilen({ ...draft, extraIds: [], expandable: true }, catalog);
    expect(zeilen.some((z) => z.label === 'Zusatzoptionen')).toBe(false);
    expect(zeilen.at(-1)).toEqual({ label: 'Spätere Erweiterung', value: 'Vorgesehen' });
  });

  it('zeigt unbekannte Bauformen mit ihrer Kennung statt zu scheitern', () => {
    const zeilen = zylinderZeilen(
      { ...draft, items: [{ uid: 'x', form: 'knaufzylinder', measureAMm: 30, measureBMm: 30, qty: 1 }] },
      { ...catalog, forms: [] },
    );
    expect(zeilen[0].label).toBe('knaufzylinder');
  });
});

describe('zylinderDetails', () => {
  it('fasst dieselben Zeilen als mehrzeiligen Text zusammen', () => {
    const text = zylinderDetails(draft, catalog);
    expect(text.split('\n')).toEqual(zylinderZeilen(draft, catalog).map((z) => `${z.label}: ${z.value}`));
    expect(text).toContain('Gemeinsame Schlüssel: 5 Stück');
  });
});
