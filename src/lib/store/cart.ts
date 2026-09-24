'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CartItem, CylinderOrderDraft, ProductClass, UploadRef } from '@/lib/types';

interface CartState {
  items: CartItem[];
  shippingOptionId?: string;
  addCodeKey: (input: {
    codeLineId: string;
    code: string;
    qty: number;
    unitPriceCents: number;
    photoRefs?: UploadRef[];
    note?: string;
  }) => void;
  addCylinderOrder: (draft: CylinderOrderDraft, unitPriceCents: number, note?: string) => void;
  addStandard: (input: {
    productId: string;
    label: string;
    shippingClass: ProductClass;
    qty: number;
    unitPriceCents: number;
  }) => void;
  updateQty: (uid: string, qty: number, unitPriceCents?: number) => void;
  remove: (uid: string) => void;
  setShipping: (id: string) => void;
  clear: () => void;
  count: () => number;
}

let counter = 0;
function nextUid(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}-${Math.round(performance.now())}`;
}

/** Warenkorb für „Direkt kaufen“ — Code-Schlüssel, Zylinder-Schließungen und Standardartikel. */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shippingOptionId: undefined,

      addCodeKey: ({ codeLineId, code, qty, unitPriceCents, photoRefs = [], note }) =>
        set((state) => {
          // Gleiche Codelinie mit gleichem Code wird zusammengefasst.
          const existing = state.items.find(
            (i) => i.kind === 'code-schluessel' && i.codeLineId === codeLineId && i.code === code,
          );
          if (existing && existing.kind === 'code-schluessel') {
            return {
              items: state.items.map((i) =>
                i.uid === existing.uid && i.kind === 'code-schluessel'
                  ? { ...i, qty: i.qty + qty, unitPriceCents }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                kind: 'code-schluessel',
                uid: nextUid('ck'),
                codeLineId,
                code,
                qty,
                unitPriceCents,
                photoRefs,
                note,
              },
            ],
          };
        }),

      addCylinderOrder: (draft, unitPriceCents, note) =>
        set((state) => ({
          items: [
            ...state.items,
            { kind: 'zylinder-schliessung', uid: nextUid('zs'), draft, unitPriceCents, qty: 1, note },
          ],
        })),

      addStandard: ({ productId, label, shippingClass, qty, unitPriceCents }) =>
        set((state) => {
          const existing = state.items.find((i) => i.kind === 'standard' && i.productId === productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.uid === existing.uid && i.kind === 'standard'
                  ? { ...i, qty: i.qty + qty, unitPriceCents }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { kind: 'standard', uid: nextUid('st'), productId, label, shippingClass, qty, unitPriceCents },
            ],
          };
        }),

      /**
       * Menge ändern. `unitPriceCents` wird mitgegeben, weil bei Staffelpreisen
       * ein anderer Stückpreis gilt — sonst stünde im Warenkorb ein veralteter
       * Preis. Maßgeblich bleibt in jedem Fall die Berechnung beim Absenden.
       */
      updateQty: (uid, qty, unitPriceCents) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.uid === uid && (i.kind === 'code-schluessel' || i.kind === 'standard')
              ? {
                  ...i,
                  qty: Math.max(1, qty),
                  unitPriceCents: unitPriceCents ?? i.unitPriceCents,
                }
              : i,
          ),
        })),

      remove: (uid) => set((state) => ({ items: state.items.filter((i) => i.uid !== uid) })),

      setShipping: (id) => set({ shippingOptionId: id }),

      clear: () => set({ items: [], shippingOptionId: undefined }),

      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'sm24-warenkorb', version: 1 },
  ),
);
