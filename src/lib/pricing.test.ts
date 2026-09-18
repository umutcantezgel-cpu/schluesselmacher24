import { describe, it, expect } from 'vitest';
import {
  quoteCarKeyService,
  unitPriceForCodeLine,
  cartTotals,
  priceCylinderOrder,
  availableShipping,
  type QuoteInput,
} from './pricing';
import type {
  BookingDefaults,
  PricingRule,
  VehicleMake,
  VehicleModel,
  CarKeyService,
  CodeLine,
  Cart,
  CartItem,
  ShippingOption,
  CylinderCatalog,
  CylinderOrderDraft,
} from './types';

describe('pricing', () => {
  describe('quoteCarKeyService', () => {
    const mockMake: VehicleMake = {
      id: 'make_vw',
      slug: 'volkswagen',
      name: 'Volkswagen',
      pricingGroupId: 'group_a',
      models: [],
    };

    const mockModel: VehicleModel = {
      id: 'model_golf',
      slug: 'golf',
      name: 'Golf',
      yearFrom: 2010,
      yearTo: 2015,
      pricingGroupId: 'group_b',
      requiresVehicleOnSite: false,
      keyKinds: ['mechanisch'],
    };

    const mockService: CarKeyService = {
      id: 'service_nachmachen',
      slug: 'nachmachen',
      label: 'Nachmachen',
      description: 'Neuer Schlüssel',
      requiresVehicleOnSite: true,
      keyKinds: ['mechanisch'],
      active: true,
    };

    const mockBookingDefaults: BookingDefaults = {
      depositMinCents: 1000,
      depositMaxCents: 5000,
      depositCents: 2000,
      slotMinutes: 30,
      leadTimeDays: 2,
      bookingHorizonDays: 14,
      slotsPerWindow: 2,
      windows: [{ from: '09:00', to: '17:00' }],
    };

    const mockRules: PricingRule[] = [
      {
        id: 'rule_1',
        pricingGroupId: 'group_b',
        serviceId: 'service_nachmachen',
        keyKind: 'mechanisch',
        mode: 'fest',
        priceCents: 15000,
        depositCents: 3000,
        slotMinutes: 45,
        leadTimeDays: 3,
        note: 'Festpreis Angebot.',
      },
      {
        id: 'rule_2',
        pricingGroupId: 'group_a',
        serviceId: 'service_nachmachen',
        keyKind: 'alle',
        mode: 'rahmen',
        priceFromCents: 8000,
        priceToCents: 12000,
      },
    ];

    it('should find exact rule by pricingGroupId and keyKind', () => {
      const input: QuoteInput = {
        make: mockMake,
        model: mockModel,
        service: mockService,
        keyKind: 'mechanisch',
        workingKeys: 1,
      };

      const result = quoteCarKeyService(input, mockRules, mockBookingDefaults);

      expect(result).toEqual({
        mode: 'fest',
        depositCents: 3000,
        slotMinutes: 45,
        leadTimeDays: 3,
        requiresVehicleOnSite: true,
        note: 'Festpreis Angebot.',
        priceCents: 15000,
        remainderCents: 12000,
      });
    });

    it('should fallback to rule with keyKind "alle"', () => {
      const input: QuoteInput = {
        make: mockMake,
        model: null,
        service: mockService,
        keyKind: 'funk',
        workingKeys: 1,
      };

      const result = quoteCarKeyService(input, mockRules, mockBookingDefaults);

      expect(result).toEqual({
        mode: 'rahmen',
        depositCents: 2000,
        slotMinutes: 30,
        leadTimeDays: 2,
        requiresVehicleOnSite: true,
        note: undefined,
        priceFromCents: 8000,
        priceToCents: 12000,
      });
    });

    it('should return mode "pruefung" if no rule is found', () => {
      const input: QuoteInput = {
        make: mockMake,
        model: mockModel,
        service: mockService,
        keyKind: 'smart-key',
        workingKeys: 1,
      };

      const result = quoteCarKeyService(input, [], mockBookingDefaults);

      expect(result).toEqual({
        mode: 'pruefung',
        depositCents: 2000,
        slotMinutes: 30,
        leadTimeDays: 2,
        requiresVehicleOnSite: true,
        note: 'Für diese Kombination ist noch kein Preis hinterlegt. Wir prüfen Ihren Fall und melden uns mit einem verbindlichen Preis.',
      });
    });

    it('should change mode from "fest" to "rahmen" if no working keys', () => {
      const input: QuoteInput = {
        make: mockMake,
        model: mockModel,
        service: mockService,
        keyKind: 'mechanisch',
        workingKeys: 0,
      };

      const result = quoteCarKeyService(input, mockRules, mockBookingDefaults);

      expect(result).toEqual({
        mode: 'rahmen',
        depositCents: 3000,
        slotMinutes: 45,
        leadTimeDays: 3,
        requiresVehicleOnSite: true,
        priceFromCents: 15000,
        priceToCents: undefined,
        note: 'Festpreis Angebot. Ohne vorhandenen Schlüssel ist der Aufwand höher. Den endgültigen Preis nennen wir nach Prüfung Ihrer Unterlagen.',
      });
    });

    it('should clamp deposit value correctly', () => {
      const rulesWithHighDeposit: PricingRule[] = [
        {
          id: 'rule_3',
          pricingGroupId: 'group_b',
          serviceId: 'service_nachmachen',
          keyKind: 'mechanisch',
          mode: 'fest',
          priceCents: 15000,
          depositCents: 10000,
        },
      ];

      const input: QuoteInput = {
        make: mockMake,
        model: mockModel,
        service: mockService,
        keyKind: 'mechanisch',
        workingKeys: 1,
      };

      const result = quoteCarKeyService(input, rulesWithHighDeposit, mockBookingDefaults);

      expect(result.depositCents).toBe(5000);
      expect(result.remainderCents).toBe(10000);
    });

    it('should establish requiresVehicleOnSite correctly', () => {
      const serviceNoSite: CarKeyService = { ...mockService, requiresVehicleOnSite: false };
      const modelRequiresSite: VehicleModel = { ...mockModel, requiresVehicleOnSite: true };

      const input: QuoteInput = {
        make: mockMake,
        model: modelRequiresSite,
        service: serviceNoSite,
        keyKind: 'mechanisch',
        workingKeys: 1,
      };

      const result = quoteCarKeyService(input, mockRules, mockBookingDefaults);

      expect(result.requiresVehicleOnSite).toBe(true);
    });
  });

  describe('unitPriceForCodeLine', () => {
    const createCodeLine = (overrides: Partial<CodeLine> = {}): CodeLine => ({
      id: 'test-id',
      slug: 'test-slug',
      name: 'Test Code Line',
      manufacturer: 'Test Mfg',
      application: 'Test App',
      keyType: 'Test Type',
      description: 'Test Desc',
      codeFormatLabel: 'Test Format',
      codePattern: 'Test Pattern',
      codeExample: 'Test Example',
      codeHint: 'Test Hint',
      codeLocationImage: { motif: 'test', ratio: '1/1' },
      productImage: { motif: 'test', ratio: '1/1' },
      priceCents: 1000,
      scope: 'test',
      maxQty: 100,
      photoUpload: 'nein',
      shippingClass: 'code-schluessel',
      active: true,
      tags: [],
      ...overrides,
    }) as CodeLine;

    it('returns the base price if bulkPrices is not defined or empty', () => {
      const line1 = createCodeLine({ bulkPrices: undefined });
      expect(unitPriceForCodeLine(line1, 1)).toBe(1000);
      expect(unitPriceForCodeLine(line1, 5)).toBe(1000);

      const line2 = createCodeLine({ bulkPrices: [] });
      expect(unitPriceForCodeLine(line2, 1)).toBe(1000);
      expect(unitPriceForCodeLine(line2, 5)).toBe(1000);
    });

    it('returns the base price if requested quantity is lower than any tier minimum', () => {
      const line = createCodeLine({
        bulkPrices: [{ minQty: 5, priceCents: 900 }],
      });
      expect(unitPriceForCodeLine(line, 1)).toBe(1000);
      expect(unitPriceForCodeLine(line, 4)).toBe(1000);
    });

    it('returns the correct bulk price if quantity matches or exceeds a tier minimum', () => {
      const line = createCodeLine({
        bulkPrices: [
          { minQty: 5, priceCents: 900 },
          { minQty: 10, priceCents: 800 },
        ],
      });

      expect(unitPriceForCodeLine(line, 5)).toBe(900);
      expect(unitPriceForCodeLine(line, 7)).toBe(900);
      expect(unitPriceForCodeLine(line, 10)).toBe(800);
      expect(unitPriceForCodeLine(line, 15)).toBe(800);
    });

    it('correctly picks the highest applicable tier even if bulkPrices are unsorted', () => {
      const line = createCodeLine({
        bulkPrices: [
          { minQty: 10, priceCents: 800 },
          { minQty: 5, priceCents: 900 },
          { minQty: 20, priceCents: 700 },
        ],
      });

      expect(unitPriceForCodeLine(line, 3)).toBe(1000);
      expect(unitPriceForCodeLine(line, 7)).toBe(900);
      expect(unitPriceForCodeLine(line, 12)).toBe(800);
      expect(unitPriceForCodeLine(line, 25)).toBe(700);
    });
  });

  describe('cartTotals', () => {
    const dummyShippingOptions: ShippingOption[] = [
      {
        id: 'standard',
        label: 'Standard',
        description: 'Standard shipping',
        priceCents: 490,
        tracked: false,
        insured: false,
        productClasses: [],
      },
      {
        id: 'express',
        label: 'Express',
        description: 'Express shipping',
        priceCents: 990,
        tracked: true,
        insured: true,
        productClasses: [],
      },
    ];

    const dummyItem1 = {
      kind: 'code-schluessel',
      uid: '1',
      codeLineId: 'line1',
      code: '123',
      qty: 1,
      unitPriceCents: 1500,
      photoRefs: [],
    } as CartItem;

    const dummyItem2 = {
      kind: 'code-schluessel',
      uid: '2',
      codeLineId: 'line2',
      code: '456',
      qty: 2,
      unitPriceCents: 800,
      photoRefs: [],
    } as CartItem;

    it('calculates totals for an empty cart', () => {
      const cart: Cart = { items: [] };
      const result = cartTotals(cart, dummyShippingOptions);

      expect(result).toEqual({
        itemsCents: 0,
        shippingCents: 0,
        totalCents: 0,
        vatCents: 0,
        vatRate: 0.19,
      });
    });

    it('calculates totals for a cart with items but no shipping option', () => {
      const cart: Cart = { items: [dummyItem1, dummyItem2] };
      const result = cartTotals(cart, dummyShippingOptions);

      expect(result).toEqual({
        itemsCents: 3100,
        shippingCents: 0,
        totalCents: 3100,
        vatCents: 495,
        vatRate: 0.19,
      });
    });

    it('calculates totals for a cart with items and a shipping option', () => {
      const cart: Cart = {
        items: [dummyItem1, dummyItem2],
        shippingOptionId: 'express',
      };
      const result = cartTotals(cart, dummyShippingOptions);

      expect(result).toEqual({
        itemsCents: 3100,
        shippingCents: 990,
        totalCents: 4090,
        vatCents: 653,
        vatRate: 0.19,
      });
    });

    it('calculates totals correctly when shipping option is not found', () => {
      const cart: Cart = {
        items: [dummyItem1],
        shippingOptionId: 'invalid-id',
      };
      const result = cartTotals(cart, dummyShippingOptions);

      expect(result).toEqual({
        itemsCents: 1500,
        shippingCents: 0,
        totalCents: 1500,
        vatCents: 239,
        vatRate: 0.19,
      });
    });

    it('rounds VAT correctly', () => {
      const cart: Cart = {
        items: [
          { ...dummyItem1, unitPriceCents: 500, qty: 1 },
          { ...dummyItem2, unitPriceCents: 500, qty: 1 },
        ],
      };
      const result = cartTotals(cart, dummyShippingOptions);
      expect(result.vatCents).toBe(160);

      const cart2: Cart = {
        items: [{ ...dummyItem1, unitPriceCents: 1100, qty: 1 }],
      };
      const result2 = cartTotals(cart2, dummyShippingOptions);
      expect(result2.vatCents).toBe(176);
    });
  });

  describe('priceCylinderOrder', () => {
    const mockInfo = { title: 'Test Info', body: 'This is a test' };
    const mockImage = { motif: 'Test Motif', ratio: '1/1' as const };

    const catalog: CylinderCatalog = {
      forms: [
        {
          id: 'doppelzylinder',
          label: 'Doppelzylinder',
          description: 'Mock Doppelzylinder',
          measures: 'beide',
          measureLabels: { a: 'A', b: 'B' },
          info: mockInfo,
          figure: mockImage,
          minMm: 60,
          maxMm: 120,
          stepMm: 5,
          basePriceCents: 3000,
          lengthSurchargeCents: 500,
          baseLengthMm: 60,
          active: true,
        },
        {
          id: 'halbzylinder',
          label: 'Halbzylinder',
          description: 'Mock Halbzylinder',
          measures: 'eines',
          measureLabels: { a: 'A' },
          info: mockInfo,
          figure: mockImage,
          minMm: 30,
          maxMm: 60,
          stepMm: 5,
          basePriceCents: 2000,
          lengthSurchargeCents: 300,
          baseLengthMm: 30,
          active: true,
        },
      ],
      functions: [
        {
          id: 'not-und-gefahren',
          label: 'Not- und Gefahrenfunktion',
          description: 'Mock function',
          surchargeCents: 1000,
          info: mockInfo,
          forms: ['doppelzylinder'],
          active: true,
        },
      ],
      extras: [
        {
          id: 'bohrschutz',
          label: 'Bohrschutz',
          description: 'Mock extra stueck',
          priceCents: 1500,
          unit: 'stueck',
          info: mockInfo,
          active: true,
        },
        {
          id: 'sicherungskarte',
          label: 'Sicherungskarte',
          description: 'Mock extra einmal',
          priceCents: 2500,
          unit: 'einmal',
          info: mockInfo,
          active: true,
        },
      ],
      keyPriceCents: 500,
      includedKeys: 3,
      maxKeys: 10,
      maxCylinders: 10,
      measuringInfo: mockInfo,
      measuringFigure: mockImage,
    };

    it('calculates the base case correctly without surcharges', () => {
      const draft: CylinderOrderDraft = {
        items: [
          { uid: '1', form: 'doppelzylinder', measureAMm: 30, measureBMm: 30, qty: 1 },
        ],
        keyCount: 3,
        extraIds: [],
        expandable: false,
      };
      const result = priceCylinderOrder(draft, catalog);
      expect(result.cylindersCents).toBe(3000);
      expect(result.keysCents).toBe(0);
      expect(result.extrasCents).toBe(0);
      expect(result.totalCents).toBe(3000);
      expect(result.cylinderCount).toBe(1);
      expect(result.lines).toHaveLength(1);
    });

    it('calculates length surcharge correctly', () => {
      const draft: CylinderOrderDraft = {
        items: [
          { uid: '1', form: 'doppelzylinder', measureAMm: 35, measureBMm: 35, qty: 1 },
        ],
        keyCount: 3,
        extraIds: [],
        expandable: false,
      };
      const result = priceCylinderOrder(draft, catalog);
      expect(result.cylindersCents).toBe(4000);
      expect(result.totalCents).toBe(4000);
    });

    it('calculates function surcharge correctly', () => {
      const draft: CylinderOrderDraft = {
        items: [
          { uid: '1', form: 'doppelzylinder', measureAMm: 30, measureBMm: 30, qty: 1, functionId: 'not-und-gefahren' },
        ],
        keyCount: 3,
        extraIds: [],
        expandable: false,
      };
      const result = priceCylinderOrder(draft, catalog);
      expect(result.cylindersCents).toBe(4000);
      expect(result.totalCents).toBe(4000);
    });

    it('ignores function surcharge if not applicable to form', () => {
      const draft: CylinderOrderDraft = {
        items: [
          { uid: '1', form: 'halbzylinder', measureAMm: 30, qty: 1, functionId: 'not-und-gefahren' },
        ],
        keyCount: 3,
        extraIds: [],
        expandable: false,
      };
      const result = priceCylinderOrder(draft, catalog);
      expect(result.cylindersCents).toBe(2000);
      expect(result.totalCents).toBe(2000);
    });

    it('calculates extra keys correctly', () => {
      const draft: CylinderOrderDraft = {
        items: [
          { uid: '1', form: 'doppelzylinder', measureAMm: 30, measureBMm: 30, qty: 1 },
        ],
        keyCount: 5,
        extraIds: [],
        expandable: false,
      };
      const result = priceCylinderOrder(draft, catalog);
      expect(result.cylindersCents).toBe(3000);
      expect(result.keysCents).toBe(1000);
      expect(result.totalCents).toBe(4000);
    });

    it('calculates extras per piece and once correctly', () => {
      const draft: CylinderOrderDraft = {
        items: [
          { uid: '1', form: 'doppelzylinder', measureAMm: 30, measureBMm: 30, qty: 2 },
        ],
        keyCount: 3,
        extraIds: ['bohrschutz', 'sicherungskarte'],
        expandable: false,
      };
      const result = priceCylinderOrder(draft, catalog);
      expect(result.cylindersCents).toBe(6000);
      expect(result.extrasCents).toBe(5500);
      expect(result.totalCents).toBe(11500);
      expect(result.cylinderCount).toBe(2);
    });
  });

  describe('availableShipping', () => {
    const options: ShippingOption[] = [
      {
        id: 'versand-code',
        label: 'Post',
        description: 'Briefversand',
        priceCents: 290,
        tracked: false,
        insured: false,
        productClasses: ['code-schluessel'],
      },
      {
        id: 'versand-paket',
        label: 'DHL Paket',
        description: 'Paketversand',
        priceCents: 590,
        tracked: true,
        insured: true,
        productClasses: ['code-schluessel', 'zylinder', 'zubehoer'],
      },
      {
        id: 'versand-zylinder',
        label: 'Spezialversand Zylinder',
        description: 'Paketversand für Zylinder',
        priceCents: 890,
        tracked: true,
        insured: true,
        productClasses: ['zylinder'],
      },
    ];

    it('returns all options for an empty cart', () => {
      const result = availableShipping([], options);
      expect(result).toHaveLength(options.length);
      expect(result).toEqual(options);
    });

    it('filters options for code-schluessel only', () => {
      const items: CartItem[] = [
        {
          kind: 'code-schluessel',
          uid: '1',
          codeLineId: 'line1',
          code: '123',
          qty: 1,
          unitPriceCents: 1000,
          photoRefs: [],
        },
      ];

      const result = availableShipping(items, options);
      expect(result).toHaveLength(2);
      expect(result.map((o) => o.id)).toEqual(['versand-code', 'versand-paket']);
    });

    it('filters options for zylinder only', () => {
      const items: CartItem[] = [
        {
          kind: 'zylinder-schliessung',
          uid: '2',
          draft: { items: [], keyCount: 3, extraIds: [], expandable: false },
          unitPriceCents: 5000,
          qty: 1,
        },
      ];

      const result = availableShipping(items, options);
      expect(result).toHaveLength(2);
      expect(result.map((o) => o.id)).toEqual(['versand-paket', 'versand-zylinder']);
    });

    it('filters options for mixed cart (code-schluessel and zylinder)', () => {
      const items: CartItem[] = [
        {
          kind: 'code-schluessel',
          uid: '1',
          codeLineId: 'line1',
          code: '123',
          qty: 1,
          unitPriceCents: 1000,
          photoRefs: [],
        },
        {
          kind: 'zylinder-schliessung',
          uid: '2',
          draft: { items: [], keyCount: 3, extraIds: [], expandable: false },
          unitPriceCents: 5000,
          qty: 1,
        },
      ];

      const result = availableShipping(items, options);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('versand-paket');
    });

    it('returns empty array if no shipping option supports all classes', () => {
      const items: CartItem[] = [
        {
          kind: 'code-schluessel',
          uid: '1',
          codeLineId: 'line1',
          code: '123',
          qty: 1,
          unitPriceCents: 1000,
          photoRefs: [],
        },
        {
          kind: 'zylinder-schliessung',
          uid: '2',
          draft: { items: [], keyCount: 3, extraIds: [], expandable: false },
          unitPriceCents: 5000,
          qty: 1,
        },
      ];

      const limitedOptions: ShippingOption[] = [
        {
          id: 'versand-code',
          label: 'Post',
          description: 'Briefversand',
          priceCents: 290,
          tracked: false,
          insured: false,
          productClasses: ['code-schluessel'],
        },
        {
          id: 'versand-zylinder',
          label: 'Spezialversand Zylinder',
          description: 'Paketversand für Zylinder',
          priceCents: 890,
          tracked: true,
          insured: true,
          productClasses: ['zylinder'],
        },
      ];

      const result = availableShipping(items, limitedOptions);
      expect(result).toHaveLength(0);
    });
  });
});
