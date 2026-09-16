'use server';

import { getCollection, getSettings } from '@/lib/data';
import { cartTotals, priceCylinderOrder, unitPriceForCodeLine } from '@/lib/pricing';
import { formatCents, formatMillimeter } from '@/lib/format';
import { submitRecord } from './records';
import type { Cart, CartItem, ContactDetails, SummarySection } from '@/lib/types';

export interface CheckoutInput {
  items: CartItem[];
  shippingOptionId: string;
  contact: ContactDetails;
  /** Abweichende Lieferanschrift, falls angegeben. */
  deliveryNote?: string;
  acceptedTerms: boolean;
  acceptedCustomMade: boolean;
}

/**
 * Nimmt eine Bestellung aus dem Warenkorb an.
 *
 * Die Preise werden auf dem Server neu berechnet — Angaben aus dem
 * Browser werden nicht als Preisgrundlage übernommen.
 */
export async function submitOrder(input: CheckoutInput) {
  if (!input.acceptedTerms || !input.acceptedCustomMade) {
    return {
      ok: false as const,
      notices: [],
      error: 'Bitte bestätigen Sie die erforderlichen Hinweise, um die Bestellung abzuschließen.',
    };
  }

  if (input.items.length === 0) {
    return { ok: false as const, notices: [], error: 'Ihr Warenkorb ist leer.' };
  }

  const [settings, codeLines, catalog] = await Promise.all([
    getSettings(),
    getCollection('codeLines'),
    getCollection('cylinderCatalog'),
  ]);

  // Preise serverseitig neu ermitteln.
  const verified: CartItem[] = [];
  const rows: SummarySection['rows'] = [];

  for (const item of input.items) {
    if (item.kind === 'code-schluessel') {
      const line = codeLines.find((l) => l.id === item.codeLineId && l.active);
      if (!line) {
        return {
          ok: false as const,
          notices: [],
          error: 'Ein Artikel im Warenkorb ist nicht mehr verfügbar. Bitte prüfen Sie Ihren Warenkorb.',
        };
      }
      if (!new RegExp(line.codePattern).test(item.code)) {
        return {
          ok: false as const,
          notices: [],
          error: `Der Code „${item.code}“ passt nicht zum erwarteten Format (${line.codeFormatLabel}).`,
        };
      }
      const qty = Math.min(Math.max(1, item.qty), line.maxQty);
      const unit = unitPriceForCodeLine(line, qty);
      verified.push({ ...item, qty, unitPriceCents: unit });
      rows.push({
        label: line.name,
        value: `Code ${item.code} · ${qty} Stück · ${formatCents(unit * qty)}`,
      });
    } else {
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

  const cart: Cart = {
    items: verified,
    shippingOptionId: input.shippingOptionId,
    updatedAt: new Date().toISOString(),
  };
  const totals = cartTotals(cart, settings.shipping);
  const shipping = settings.shipping.find((s) => s.id === input.shippingOptionId);

  const summary: SummarySection[] = [
    { title: 'Artikel', rows },
    {
      title: 'Summe',
      rows: [
        { label: 'Artikel', value: formatCents(totals.itemsCents) },
        { label: 'Versand', value: `${shipping?.label ?? 'Versand'} · ${formatCents(totals.shippingCents)}` },
        { label: 'Gesamtbetrag', value: formatCents(totals.totalCents) },
        {
          label: 'Enthaltene Umsatzsteuer',
          value: `${formatCents(totals.vatCents)} (${Math.round(totals.vatRate * 100)} %)`,
        },
      ],
    },
  ];

  return submitRecord({
    kind: 'bestellung',
    area: verified.some((i) => i.kind === 'zylinder-schliessung')
      ? 'gleichschliessende-zylinder'
      : 'schluessel-nach-code',
    process: 'direktkauf',
    contact: input.contact,
    payload: {
      items: verified,
      shippingOptionId: input.shippingOptionId,
      deliveryNote: input.deliveryNote,
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

/** Lesbare Beschreibung einer Zylinder-Position, auch im Backend verwendet. */
export async function describeCylinderItem(draft: CheckoutInput['items'][number]) {
  if (draft.kind !== 'zylinder-schliessung') return '';
  const catalog = await getCollection('cylinderCatalog');
  return draft.draft.items
    .map((item) => {
      const form = catalog.forms.find((f) => f.id === item.form);
      const measure = item.measureBMm
        ? `${formatMillimeter(item.measureAMm)}/${formatMillimeter(item.measureBMm)}`
        : formatMillimeter(item.measureAMm);
      return `${item.qty} × ${form?.label ?? item.form} ${measure}`;
    })
    .join(', ');
}
