import { quoteCarKeyService, type QuoteInput } from './pricing';
import type { BookingDefaults, PricingRule, VehicleMake, VehicleModel, CarKeyService } from './types';

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
    pricingGroupId: 'group_b', // Model overrides make's pricingGroupId
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
    windows: [{ from: "09:00", to: "17:00" }]
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
      pricingGroupId: 'group_a', // Should be matched if model is null
      serviceId: 'service_nachmachen',
      keyKind: 'alle', // Test fallback
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
      depositCents: 3000, // Clamp inside bounds [1000, 5000]
      slotMinutes: 45,
      leadTimeDays: 3,
      requiresVehicleOnSite: true, // service requires it
      note: 'Festpreis Angebot.',
      priceCents: 15000,
      remainderCents: 12000, // 15000 - 3000
    });
  });

  it('should fallback to rule with keyKind "alle"', () => {
    const input: QuoteInput = {
      make: mockMake,
      model: null, // Should use make's pricingGroupId (group_a)
      service: mockService,
      keyKind: 'funk',
      workingKeys: 1,
    };

    const result = quoteCarKeyService(input, mockRules, mockBookingDefaults);

    expect(result).toEqual({
      mode: 'rahmen',
      depositCents: 2000, // No deposit in rule, uses default, clamped
      slotMinutes: 30, // Uses default
      leadTimeDays: 2, // Uses default
      requiresVehicleOnSite: true, // service requires it
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

    // Provide empty rules
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
      priceFromCents: 15000, // fallback to priceCents
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
        depositCents: 10000, // Over max 5000
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

    expect(result.depositCents).toBe(5000); // clamped to max
    expect(result.remainderCents).toBe(10000); // 15000 - 5000
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

    expect(result.requiresVehicleOnSite).toBe(true); // model requires it
  });
});
