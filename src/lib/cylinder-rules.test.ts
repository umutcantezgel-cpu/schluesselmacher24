import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import { ERWEITERBAR_OPTION_ID, validateCylinderDraft, wirksameZusatzIds } from './cylinder-rules';
import type { CylinderCatalog, CylinderManufacturer, CylinderOrderDraft } from './types';

const katalog = defaults.cylinderCatalog();

const entwurf: CylinderOrderDraft = {
  items: [{ uid: 'a', form: 'doppelzylinder', measureAMm: 30, measureBMm: 30, functionId: 'standard', qty: 2 }],
  keyCount: 3,
  extraIds: [],
  expandable: false,
};

const abus: CylinderManufacturer = {
  id: 'abus',
  name: 'ABUS',
  active: true,
  description: '',
  surchargeCentsPerCylinder: 500,
  forms: ['doppelzylinder'],
  components: [{ name: 'Vorhängeschloss', priceCents: 3900, description: '' }],
};

const mitHersteller: CylinderCatalog = { ...katalog, manufacturers: [abus] };

describe('wirksameZusatzIds', () => {
  it('setzt „Erweiterbar reservieren“ genau dann, wenn erweiterbar gewählt ist', () => {
    expect(wirksameZusatzIds({ extraIds: ['sicherungskarte'], expandable: true }, katalog)).toEqual([
      'sicherungskarte',
      ERWEITERBAR_OPTION_ID,
    ]);
    expect(wirksameZusatzIds({ extraIds: [ERWEITERBAR_OPTION_ID], expandable: false }, katalog)).toEqual([]);
  });
});

describe('validateCylinderDraft mit Herstellern', () => {
  it('lässt Entwürfe ohne Hersteller unverändert gelten, solange keiner angeboten wird', () => {
    expect(validateCylinderDraft(entwurf, katalog)).toBeNull();
    expect(validateCylinderDraft({ ...entwurf, manufacturerId: 'abus' }, katalog)).not.toBeNull();
  });

  it('verlangt einen angebotenen Hersteller, sobald es welche gibt', () => {
    expect(validateCylinderDraft(entwurf, mitHersteller)).toBe('Bitte wählen Sie einen Hersteller.');
    expect(validateCylinderDraft({ ...entwurf, manufacturerId: 'bks' }, mitHersteller)).not.toBeNull();
    expect(validateCylinderDraft({ ...entwurf, manufacturerId: 'abus' }, mitHersteller)).toBeNull();
  });

  it('prüft Bauformen und Zusatzkomponenten gegen den Hersteller', () => {
    const halb: CylinderOrderDraft = {
      ...entwurf,
      manufacturerId: 'abus',
      items: [{ uid: 'b', form: 'halbzylinder', measureAMm: 30, qty: 1 }],
    };
    expect(validateCylinderDraft(halb, mitHersteller)).toContain('nicht wählbar');
    expect(
      validateCylinderDraft({ ...entwurf, manufacturerId: 'abus', components: [{ name: 'Vorhängeschloss', qty: 2 }] }, mitHersteller),
    ).toBeNull();
    expect(
      validateCylinderDraft({ ...entwurf, manufacturerId: 'abus', components: [{ name: 'Unbekannt', qty: 1 }] }, mitHersteller),
    ).not.toBeNull();
    expect(
      validateCylinderDraft({ ...entwurf, manufacturerId: 'abus', components: [{ name: 'Vorhängeschloss', qty: 0 }] }, mitHersteller),
    ).not.toBeNull();
  });
});
