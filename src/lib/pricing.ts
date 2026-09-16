import type {
  BookingDefaults,
  CarKeyService,
  CylinderCatalog,
  CylinderOrderDraft,
  KeyKind,
  PriceQuote,
  PricingRule,
  VehicleMake,
  VehicleModel,
  CodeLine,
  Cart,
  CartItem,
  ProductClass,
  ShippingOption,
} from '@/lib/types';

/* ==========================================================================
   Preisermittlung
   Alle Werte stammen aus der Datenschicht. In dieser Datei steht keine
   Zahl, die den Preis eines Produkts oder einer Leistung bestimmt.
   ========================================================================== */

export interface QuoteInput {
  make: VehicleMake;
  model?: VehicleModel | null;
  service: CarKeyService;
  keyKind: KeyKind;
  /** Anzahl noch funktionierender Schlüssel. */
  workingKeys: number;
}

/**
 * Ermittelt Preis, Anzahlung, Terminlänge und Vorlauf für einen
 * Autoschlüssel-Vorgang.
 */
export function quoteCarKeyService(
  input: QuoteInput,
  rules: PricingRule[],
  booking: BookingDefaults,
): PriceQuote {
  const groupId = input.model?.pricingGroupId ?? input.make.pricingGroupId;

  const rule =
    rules.find(
      (r) =>
        r.pricingGroupId === groupId &&
        r.serviceId === input.service.id &&
        r.keyKind === input.keyKind,
    ) ??
    rules.find(
      (r) =>
        r.pricingGroupId === groupId &&
        r.serviceId === input.service.id &&
        r.keyKind === 'alle',
    ) ??
    null;

  const requiresVehicleOnSite =
    input.model?.requiresVehicleOnSite || input.service.requiresVehicleOnSite;

  // Ohne hinterlegte Regel wird der Fall grundsätzlich manuell geprüft.
  if (!rule) {
    return {
      mode: 'pruefung',
      depositCents: booking.depositCents,
      slotMinutes: booking.slotMinutes,
      leadTimeDays: booking.leadTimeDays,
      requiresVehicleOnSite,
      note: 'Für diese Kombination ist noch kein Preis hinterlegt. Wir prüfen Ihren Fall und melden uns mit einem verbindlichen Preis.',
    };
  }

  // Ist kein funktionierender Schlüssel mehr vorhanden, ist der Aufwand
  // grundsätzlich höher — ein fester Preis wird dann nicht zugesagt.
  const noWorkingKey = input.workingKeys <= 0;
  const mode: PriceQuote['mode'] = noWorkingKey && rule.mode === 'fest' ? 'rahmen' : rule.mode;

  const depositCents = clampDeposit(rule.depositCents ?? booking.depositCents, booking);
  const slotMinutes = rule.slotMinutes ?? booking.slotMinutes;
  const leadTimeDays = rule.leadTimeDays ?? booking.leadTimeDays;

  const quote: PriceQuote = {
    mode,
    depositCents,
    slotMinutes,
    leadTimeDays,
    requiresVehicleOnSite,
    note: rule.note,
  };

  if (mode === 'fest' && rule.priceCents !== undefined) {
    quote.priceCents = rule.priceCents;
    quote.remainderCents = Math.max(0, rule.priceCents - depositCents);
  } else if (mode === 'rahmen') {
    quote.priceFromCents = rule.priceFromCents ?? rule.priceCents;
    quote.priceToCents = rule.priceToCents ?? undefined;
    if (noWorkingKey && !rule.priceToCents && rule.priceCents) {
      // Ohne vorhandenen Schlüssel nennen wir bewusst nur eine Untergrenze.
      quote.priceFromCents = rule.priceCents;
      quote.note = [
        quote.note,
        'Ohne vorhandenen Schlüssel ist der Aufwand höher. Den endgültigen Preis nennen wir nach Prüfung Ihrer Unterlagen.',
      ]
        .filter(Boolean)
        .join(' ');
    }
  }

  return quote;
}

function clampDeposit(value: number, booking: BookingDefaults): number {
  return Math.min(Math.max(value, booking.depositMinCents), booking.depositMaxCents);
}

/* ---------- Schlüssel nach Code ----------------------------------------- */

/** Stückpreis unter Berücksichtigung der Staffel. */
export function unitPriceForCodeLine(line: CodeLine, qty: number): number {
  const tiers = [...(line.bulkPrices ?? [])].sort((a, b) => b.minQty - a.minQty);
  const tier = tiers.find((t) => qty >= t.minQty);
  return tier ? tier.priceCents : line.priceCents;
}

/* ---------- Gleichschließende Zylinder ---------------------------------- */

export interface CylinderPriceBreakdown {
  lines: Array<{ label: string; qty: number; unitCents: number; totalCents: number }>;
  cylindersCents: number;
  keysCents: number;
  extrasCents: number;
  totalCents: number;
  /** Anzahl Zylinder insgesamt. */
  cylinderCount: number;
}

export function priceCylinderOrder(
  draft: CylinderOrderDraft,
  catalog: CylinderCatalog,
): CylinderPriceBreakdown {
  const lines: CylinderPriceBreakdown['lines'] = [];
  let cylindersCents = 0;
  let cylinderCount = 0;

  for (const item of draft.items) {
    const form = catalog.forms.find((f) => f.id === item.form);
    if (!form) continue;

    const totalMm = item.measureAMm + (item.measureBMm ?? 0);
    const overMm = Math.max(0, totalMm - form.baseLengthMm);
    // Der Aufschlag folgt der im Katalog gepflegten Schrittweite.
    const step = form.stepMm > 0 ? form.stepMm : 5;
    const surcharge = Math.ceil(overMm / step) * form.lengthSurchargeCents;

    const fn = catalog.functions.find((f) => f.id === item.functionId);
    const fnSurcharge = fn && fn.forms.includes(item.form) ? fn.surchargeCents : 0;

    const unit = form.basePriceCents + surcharge + fnSurcharge;
    const total = unit * item.qty;

    const measureLabel = item.measureBMm
      ? `${item.measureAMm}/${item.measureBMm} mm`
      : `${item.measureAMm} mm`;

    lines.push({
      label: `${form.label} ${measureLabel}${fn && fn.id !== 'standard' ? ` · ${fn.label}` : ''}`,
      qty: item.qty,
      unitCents: unit,
      totalCents: total,
    });

    cylindersCents += total;
    cylinderCount += item.qty;
  }

  const extraKeys = Math.max(0, draft.keyCount - catalog.includedKeys);
  const keysCents = extraKeys * catalog.keyPriceCents;

  let extrasCents = 0;
  for (const id of draft.extraIds) {
    const extra = catalog.extras.find((e) => e.id === id && e.active);
    if (!extra) continue;
    extrasCents += extra.unit === 'stueck' ? extra.priceCents * cylinderCount : extra.priceCents;
  }

  return {
    lines,
    cylindersCents,
    keysCents,
    extrasCents,
    cylinderCount,
    totalCents: cylindersCents + keysCents + extrasCents,
  };
}

/* ---------- Warenkorb ---------------------------------------------------- */

export interface CartTotals {
  itemsCents: number;
  shippingCents: number;
  totalCents: number;
  /** Enthaltene Umsatzsteuer, informativ. */
  vatCents: number;
  vatRate: number;
}

export function cartTotals(cart: Cart, shipping: ShippingOption[]): CartTotals {
  const itemsCents = cart.items.reduce(
    (sum, item) => sum + item.unitPriceCents * item.qty,
    0,
  );
  const option = shipping.find((s) => s.id === cart.shippingOptionId);
  const shippingCents = option?.priceCents ?? 0;
  const totalCents = itemsCents + shippingCents;
  const vatRate = 0.19;
  const vatCents = Math.round(totalCents - totalCents / (1 + vatRate));
  return { itemsCents, shippingCents, totalCents, vatCents, vatRate };
}

/**
 * Welche Versandarten passen zu den Artikeln im Warenkorb?
 * Nimmt die Versandarten direkt entgegen, damit die Funktion auch im
 * Browser verwendbar ist, wo kein vollständiges Einstellungsobjekt vorliegt.
 */
export function availableShipping(
  items: CartItem[],
  shipping: ShippingOption[],
): ShippingOption[] {
  const classes = new Set<ProductClass>(
    items.map((i) => (i.kind === 'code-schluessel' ? 'code-schluessel' : 'zylinder')),
  );
  return shipping.filter((option) =>
    [...classes].every((cls) => option.productClasses.includes(cls)),
  );
}
