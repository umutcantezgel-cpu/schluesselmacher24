import { beforeEach, describe, expect, it } from 'vitest';

import type { CylinderOrderDraft } from '@/lib/types';

import { useCartStore } from './cart';

/** Charakterisierung des Warenkorbs: geprüft wird nur, was der Store mit seinen Einträgen tut. */

const zylinderEntwurf: CylinderOrderDraft = {
  items: [{ uid: 'z-1', form: 'doppelzylinder', measureAMm: 30, measureBMm: 30, qty: 1 }],
  keyCount: 3,
  extraIds: [],
  expandable: false,
};

const codeEingabe = { codeLineId: 'ms-01', code: '1234', qty: 2, unitPriceCents: 1200 };

const store = () => useCartStore.getState();

beforeEach(() => {
  useCartStore.setState({ items: [], shippingOptionId: undefined });
});

describe('Warenkorb-Store (Charakterisierung)', () => {
  it('addCodeKey legt einen Eintrag an', () => {
    store().addCodeKey(codeEingabe);

    const { items } = store();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      kind: 'code-schluessel',
      codeLineId: 'ms-01',
      code: '1234',
      qty: 2,
      unitPriceCents: 1200,
    });
  });

  it('fasst gleiche Codelinie und gleichen Code zusammen: Menge addiert, Preis aktualisiert', () => {
    store().addCodeKey({ ...codeEingabe, qty: 2, unitPriceCents: 1200 });
    store().addCodeKey({ ...codeEingabe, qty: 3, unitPriceCents: 1100 });

    const { items } = store();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ qty: 5, unitPriceCents: 1100 });
  });

  it('ein anderer Code ergibt einen zweiten Eintrag', () => {
    store().addCodeKey(codeEingabe);
    store().addCodeKey({ ...codeEingabe, code: '5678' });
    store().addCodeKey({ ...codeEingabe, codeLineId: 'ms-02' });

    const { items } = store();
    expect(items).toHaveLength(3);
    expect(items.map((i) => (i.kind === 'code-schluessel' ? i.code : null))).toEqual(['1234', '5678', '1234']);
  });

  it('addCylinderOrder legt einen Eintrag mit Entwurf und Preis an', () => {
    store().addCylinderOrder(zylinderEntwurf, 4900, 'Eingang');

    const { items } = store();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      kind: 'zylinder-schliessung',
      draft: zylinderEntwurf,
      unitPriceCents: 4900,
      qty: 1,
      note: 'Eingang',
    });
  });

  it('addStandard legt einen Eintrag an und addiert gleiche Artikel', () => {
    const artikel = {
      productId: 'art-kasten',
      label: 'Schlüsselkasten',
      shippingClass: 'zubehoer' as const,
      qty: 1,
      unitPriceCents: 2500,
    };
    store().addStandard(artikel);
    expect(store().items).toHaveLength(1);
    expect(store().items[0]).toMatchObject({ kind: 'standard', productId: 'art-kasten', qty: 1 });

    store().addStandard({ ...artikel, qty: 2, unitPriceCents: 2300 });
    expect(store().items).toHaveLength(1);
    expect(store().items[0]).toMatchObject({ qty: 3, unitPriceCents: 2300 });
  });

  it('updateQty ändert die Menge, begrenzt auf mindestens 1, und nur bei Code- und Standardartikeln', () => {
    store().addCodeKey(codeEingabe);
    store().addCylinderOrder(zylinderEntwurf, 4900);
    const [code, zylinder] = store().items;

    store().updateQty(code.uid, 7);
    expect(store().items[0]).toMatchObject({ qty: 7, unitPriceCents: 1200 });

    store().updateQty(code.uid, 0, 999);
    expect(store().items[0]).toMatchObject({ qty: 1, unitPriceCents: 999 });

    store().updateQty(zylinder.uid, 4);
    expect(store().items[1]).toMatchObject({ qty: 1 });
  });

  it('remove entfernt genau einen Eintrag', () => {
    store().addCodeKey(codeEingabe);
    store().addCodeKey({ ...codeEingabe, code: '5678' });
    store().addCylinderOrder(zylinderEntwurf, 4900);
    const [erster, mitte, letzter] = store().items;

    store().remove(mitte.uid);

    const uids = store().items.map((i) => i.uid);
    expect(uids).toEqual([erster.uid, letzter.uid]);
  });

  it('setShipping setzt die Versandart', () => {
    store().setShipping('versand-standard');

    expect(store().shippingOptionId).toBe('versand-standard');
  });

  it('clear leert Einträge und Versandart', () => {
    store().addCodeKey(codeEingabe);
    store().setShipping('versand-standard');

    store().clear();

    expect(store().items).toEqual([]);
    expect(store().shippingOptionId).toBeUndefined();
  });

  it('count() summiert die Mengen über alle Einträge', () => {
    store().addCodeKey({ ...codeEingabe, qty: 2 });
    store().addCodeKey({ ...codeEingabe, code: '5678', qty: 3 });

    expect(store().count()).toBe(5);
  });
});
