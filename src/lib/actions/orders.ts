'use server';

import { z } from 'zod';

import { getCollection, getSettings } from '@/lib/data';
import { codePasst } from '@/lib/code-pattern';
import { validateCylinderDraft } from '@/lib/cylinder-rules';
import { formatCents } from '@/lib/format';
import { availableShipping, cartTotals, priceCylinderOrder, unitPriceForCodeLine } from '@/lib/pricing';
import { createRecord } from '@/lib/server/create-record';
import { LIMITS, RATE_LIMIT_MESSAGE, allowRequest } from '@/lib/server/rate-limit';
import { contactSchema } from '@/lib/server/record-schema';
import type { Cart, CartItem, ContactDetails, SummarySection } from '@/lib/types';

export interface CheckoutInput {
  items: CartItem[];
  shippingOptionId: string;
  contact: ContactDetails;
  /** Abweichende Lieferanschrift, falls angegeben. */
  deliveryNote?: string;
  acceptedTerms: boolean;
  acceptedCustomMade: boolean;
  /**
   * Der Gesamtbetrag, den der Kunde beim Absenden gesehen hat. Weicht der
   * serverseitig berechnete Betrag ab, wird nicht bestellt (§ 312j BGB).
   */
  expectedTotalCents: number;
}

export interface CheckoutResult {
  ok: boolean;
  reference?: string;
  recordId?: string;
  /** Geheimer Link-Schlüssel für die Bestellbestätigung. */
  accessToken?: string;
  redirectUrl?: string;
  notices: string[];
  error?: string;
  /** Gesetzt, wenn sich der Preis seit der Anzeige geändert hat. */
  priceChanged?: { expectedCents: number; actualCents: number };
}

const uploadRefSchema = z.object({
  id: z.string().max(120),
  fileName: z.string().max(255),
  sizeBytes: z.number().int().min(0).max(30 * 1024 * 1024),
  mimeType: z.string().max(120),
  category: z.enum(['schluesselfoto', 'fahrzeugschein', 'grundriss', 'dokument', 'objektfoto']),
  storageKey: z.string().max(500).optional(),
  uploadedAt: z.string().max(40),
});

const cartItemSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('code-schluessel'),
    uid: z.string().max(80),
    codeLineId: z.string().max(80),
    code: z.string().trim().min(1).max(60),
    qty: z.number().int().min(1).max(999),
    unitPriceCents: z.number().int().min(0),
    photoRefs: z.array(uploadRefSchema).max(6),
    note: z.string().max(1000).optional(),
  }),
  z.object({
    kind: z.literal('zylinder-schliessung'),
    uid: z.string().max(80),
    draft: z.object({
      items: z
        .array(
          z.object({
            uid: z.string().max(80),
            form: z.enum(['doppelzylinder', 'knaufzylinder', 'halbzylinder']),
            measureAMm: z.number().int().min(1).max(400),
            measureBMm: z.number().int().min(1).max(400).optional(),
            functionId: z.string().max(80).optional(),
            qty: z.number().int().min(1).max(999),
          }),
        )
        .max(100),
      keyCount: z.number().int(),
      extraIds: z.array(z.string().max(80)).max(20),
      expandable: z.boolean(),
    }),
    unitPriceCents: z.number().int().min(0),
    qty: z.literal(1),
    note: z.string().max(1000).optional(),
  }),
  z.object({
    kind: z.literal('standard'),
    uid: z.string().max(80),
    productId: z.string().max(80),
    label: z.string().max(200),
    shippingClass: z.enum(['code-schluessel', 'zylinder', 'zubehoer']),
    qty: z.number().int().min(1).max(999),
    unitPriceCents: z.number().int().min(0),
    note: z.string().max(1000).optional(),
  }),
]);

const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(50),
  shippingOptionId: z.string().max(80),
  contact: contactSchema,
  deliveryNote: z.string().max(2000).optional(),
  acceptedTerms: z.literal(true),
  acceptedCustomMade: z.literal(true),
  expectedTotalCents: z.number().int().min(0),
});

function fail(error: string): CheckoutResult {
  return { ok: false, notices: [], error };
}

/**
 * Nimmt eine Bestellung aus dem Warenkorb an.
 *
 * Preise, Versand und Zusammenstellungen werden auf dem Server neu geprüft
 * und berechnet. Beträge aus dem Browser dienen nur dem Abgleich.
 */
export async function submitOrder(input: CheckoutInput): Promise<CheckoutResult> {
  if (!(await allowRequest(LIMITS.bestellung))) return fail(RATE_LIMIT_MESSAGE);

  if (!input?.acceptedTerms || !input?.acceptedCustomMade) {
    return fail('Bitte bestätigen Sie die erforderlichen Hinweise, um die Bestellung abzuschließen.');
  }
  if (!Array.isArray(input.items) || input.items.length === 0) {
    return fail('Ihr Warenkorb ist leer.');
  }

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return fail('Einige Angaben sind unvollständig oder ungültig. Bitte prüfen Sie das Formular.');
  }
  const data = parsed.data;

  const [settings, codeLines, standardArticles, catalog] = await Promise.all([
    getSettings(),
    getCollection('codeLines'),
    getCollection('standardArticles'),
    getCollection('cylinderCatalog'),
  ]);

  const verified: CartItem[] = [];
  const rows: SummarySection['rows'] = [];

  for (const item of data.items) {
    if (item.kind === 'code-schluessel') {
      const line = codeLines.find((l) => l.id === item.codeLineId && l.active && !l.example);
      if (!line) {
        return fail('Ein Artikel im Warenkorb ist nicht mehr verfügbar. Bitte prüfen Sie Ihren Warenkorb.');
      }
      if (!codePasst(line.codePattern, item.code)) {
        return fail(`Der Code „${item.code}“ passt nicht zum erwarteten Format (${line.codeFormatLabel}).`);
      }
      if (item.qty > line.maxQty) {
        return fail(`Von „${line.name}“ sind höchstens ${line.maxQty} Stück je Bestellung möglich.`);
      }
      const unit = unitPriceForCodeLine(line, item.qty);
      verified.push({ ...item, unitPriceCents: unit });
      rows.push({
        label: line.name,
        value: `Code ${item.code} · ${item.qty} Stück · ${formatCents(unit * item.qty)}`,
      });
    } else if (item.kind === 'standard') {
      const article = standardArticles.find((a) => a.id === item.productId);
      if (!article) {
        return fail('Ein Artikel im Warenkorb ist nicht mehr verfügbar. Bitte prüfen Sie Ihren Warenkorb.');
      }
      if (article.example) {
        return fail(`„${article.name}“ ist ein Beispielartikel und kann nicht bestellt werden.`);
      }
      if (item.qty > article.maxQty) {
        return fail(`Von „${article.name}“ sind höchstens ${article.maxQty} Stück je Bestellung möglich.`);
      }
      const unit = unitPriceForCodeLine(article, item.qty);
      // Name, Preis und Versandklasse kommen aus dem Artikel, nie aus dem Browser.
      verified.push({ ...item, label: article.name, shippingClass: article.shippingClass, unitPriceCents: unit });
      rows.push({ label: article.name, value: `${item.qty} Stück · ${formatCents(unit * item.qty)}` });
    } else {
      const problem = validateCylinderDraft(item.draft, catalog);
      if (problem) return fail(`Zylinder-Zusammenstellung: ${problem}`);

      const breakdown = priceCylinderOrder(item.draft, catalog);
      verified.push({ ...item, unitPriceCents: breakdown.totalCents });
      rows.push({
        label: 'Gleichschließende Zylinder',
        value:
          `${breakdown.cylinderCount} Zylinder · ${item.draft.keyCount} gemeinsame Schlüssel · `
          + formatCents(breakdown.totalCents),
      });
      for (const line of breakdown.lines) {
        rows.push({ label: `— ${line.label}`, value: `${line.qty} × ${formatCents(line.unitCents)}` });
      }
    }
  }

  // Versandart muss existieren und zu allen Artikeln passen.
  const shipping = availableShipping(verified, settings.shipping).find(
    (option) => option.id === data.shippingOptionId,
  );
  if (!shipping) {
    return fail('Die gewählte Versandart passt nicht zu Ihrem Warenkorb. Bitte wählen Sie erneut.');
  }

  const cart: Cart = { items: verified, shippingOptionId: shipping.id };
  const totals = cartTotals(cart, settings.shipping);

  if (totals.totalCents !== data.expectedTotalCents) {
    return {
      ...fail(
        `Der Gesamtbetrag hat sich geändert: jetzt ${formatCents(totals.totalCents)} statt `
          + `${formatCents(data.expectedTotalCents)}. Bitte prüfen Sie die Übersicht und bestellen Sie erneut.`,
      ),
      priceChanged: { expectedCents: data.expectedTotalCents, actualCents: totals.totalCents },
    };
  }

  const summary: SummarySection[] = [
    { title: 'Artikel', rows },
    {
      title: 'Summe',
      rows: [
        { label: 'Artikel', value: formatCents(totals.itemsCents) },
        { label: 'Versand', value: `${shipping.label} · ${formatCents(totals.shippingCents)}` },
        { label: 'Gesamtbetrag', value: formatCents(totals.totalCents) },
        {
          label: 'Enthaltene Umsatzsteuer',
          value: `${formatCents(totals.vatCents)} (${Math.round(totals.vatRate * 100)} %)`,
        },
      ],
    },
  ];

  return createRecord({
    kind: 'bestellung',
    area: verified.some((i) => i.kind === 'zylinder-schliessung')
      ? 'gleichschliessende-zylinder'
      : 'schluessel-nach-code',
    process: 'direktkauf',
    contact: data.contact,
    payload: {
      items: verified,
      shippingOptionId: shipping.id,
      shippingLabel: shipping.label,
      deliveryNote: data.deliveryNote,
      totals,
    },
    summary,
    uploads: [],
    payment: {
      scope: 'gesamt',
      amountCents: totals.totalCents,
      description: `Bestellung über ${formatCents(totals.totalCents)}`,
    },
  });
}
