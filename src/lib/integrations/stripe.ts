import 'server-only';

import Stripe from 'stripe';

import { formatDateShort } from '@/lib/format';
import { getSiteUrl } from '@/lib/site-url';
import type { RecordKind } from '@/lib/types';
import { zahlungKonfiguration, type ZahlungKonfiguration } from '@/lib/umgebung';

import type { PaymentIntent, PaymentResult } from './index';

/* ==========================================================================
   Stripe Checkout (gehostete Zahlungsseite)
   Der Kunde zahlt auf der Seite von Stripe; das Ergebnis kommt per Webhook
   (/api/zahlung/stripe) und — schneller — über die Rückkehr-Adresse
   (/api/zahlung/rueckkehr). An Stripe gehen nur Bezeichnung, Menge und Preis
   der Positionen: nie Schlüsselcodes, Maße oder andere Angaben aus `details`.
   ========================================================================== */

/** Kleinster Betrag, den Stripe in Euro annimmt. */
export const MINDESTBETRAG_CENT = 50;

/**
 * Wie lange die Zahlungsseite offen bleibt. Stripe verlangt mindestens
 * 30 Minuten — mit einer Minute Puffer für Laufzeit und Uhrzeitabweichung.
 * Bestellungen und freigegebene Fotoanfragen: höchstens 24 Stunden, mit einer
 * Stunde Puffer — danach startet „Jetzt bezahlen“ eine neue Sitzung.
 */
export const ABLAUF_MINUTEN = { termin: 31, bestellung: 23 * 60 } as const;

let client: { schluessel: string; stripe: Stripe } | null = null;

/** Stripe-Client, erst bei Bedarf angelegt. Wiederholungen übernimmt das SDK (mit eigenen Idempotenz-Schlüsseln). */
export function stripeClient(konfiguration: ZahlungKonfiguration | null = zahlungKonfiguration()): Stripe {
  if (!konfiguration) throw new Error('Stripe ist nicht eingerichtet.');
  if (client?.schluessel !== konfiguration.apiKey) {
    client = {
      schluessel: konfiguration.apiKey,
      stripe: new Stripe(konfiguration.apiKey, {
        maxNetworkRetries: 2,
        timeout: 20_000,
        appInfo: { name: 'schluesselmacher24' },
      }),
    };
  }
  return client.stripe;
}

/** Merkmal der Umgebung in den Metadaten — ein Stripe-Konto beliefert alle Webhook-Ziele. */
export function zahlungsUmgebung(): string {
  return process.env.VERCEL_ENV?.trim() || 'lokal';
}

/** Metadaten, an denen Webhook, Rückkehr und Abgleich den Vorgang erkennen. */
export interface CheckoutMetadaten {
  vorgangId: string;
  nummer: string;
  art: string;
  umgebung: string;
  [schluessel: string]: string;
}

/**
 * Arten ohne Eintrag (Anfrage, Projekt, Partner) nutzen die Beschreibung der
 * Zahlung — bei der freigegebenen Fotoanfrage „Anfertigung Schlüssel nach
 * Vorlage“ (`FOTOANFRAGE_ZAHLUNG`), als einzige Position mit Vorgangsnummer.
 */
const BESCHREIBUNG: Partial<Record<RecordKind, string>> = {
  termin: 'Anzahlung Autoschlüssel-Termin',
  bestellung: 'Bestellung',
};

/** Text für Kontoauszug und Dashboard, vom Server gebildet. */
export function zahlungsBeschreibung(intent: Pick<PaymentIntent, 'reference' | 'recordKind' | 'description'>): string {
  return `${intent.reference} – ${BESCHREIBUNG[intent.recordKind] ?? intent.description}`;
}

type Position = Stripe.Checkout.SessionCreateParams.LineItem;

function position(name: string, cent: number, menge = 1): Position {
  return {
    quantity: menge,
    price_data: { currency: 'eur', unit_amount: cent, product_data: { name: name.slice(0, 250) } },
  };
}

/**
 * Positionen für die Zahlungsseite. Weicht die Summe vom Betrag des Vorgangs
 * ab, steht dort eine einzige Sammelposition — maßgeblich ist immer der
 * Betrag, den der Server festgeschrieben hat.
 */
function positionen(intent: PaymentIntent): {
  line_items: Position[];
  shipping_options?: Stripe.Checkout.SessionCreateParams.ShippingOption[];
} {
  if (intent.recordKind === 'termin') {
    const termin = intent.appointment ? ` ${formatDateShort(intent.appointment.date)} ${intent.appointment.time} Uhr` : '';
    return { line_items: [position(`${BESCHREIBUNG.termin}${termin}`, intent.amountCents)] };
  }

  const sammel = { line_items: [position(`${BESCHREIBUNG[intent.recordKind] ?? intent.description} ${intent.reference}`, intent.amountCents)] };
  const lines = (intent.lines ?? []).filter((line) => line.unitPriceCents !== 0);
  if (lines.length === 0) return sammel;
  const gueltig = lines.every(
    (line) => Number.isSafeInteger(line.unitPriceCents) && line.unitPriceCents > 0 && Number.isSafeInteger(line.qty) && line.qty > 0,
  );
  const versand = intent.shipping && Number.isSafeInteger(intent.shipping.cents) && intent.shipping.cents >= 0 ? intent.shipping : undefined;
  const summe = lines.reduce((s, line) => s + line.unitPriceCents * line.qty, 0) + (versand?.cents ?? 0);
  if (!gueltig || summe !== intent.amountCents) return sammel;

  return {
    // Nur die Bezeichnung — `details` enthält Schlüsselcodes und bleibt bei uns.
    line_items: lines.map((line) => position(line.label, line.unitPriceCents, line.qty)),
    shipping_options: versand
      ? [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              display_name: (versand.label || 'Versand').slice(0, 100),
              fixed_amount: { amount: versand.cents, currency: 'eur' },
            },
          },
        ]
      : undefined,
  };
}

export interface CheckoutUmfeld {
  jetzt: Date;
  /** Absolute Adresse der Seite. */
  site: string;
  konfiguration: Pick<ZahlungKonfiguration, 'zahlarten' | 'rechnungen'>;
  umgebung: string;
}

/** Parameter der Checkout-Sitzung — rein, damit Tests sie ohne Stripe prüfen. */
export function checkoutParameter(intent: PaymentIntent, umfeld: CheckoutUmfeld): Stripe.Checkout.SessionCreateParams {
  const metadata: CheckoutMetadaten = {
    vorgangId: intent.recordId,
    nummer: intent.reference,
    art: intent.recordKind,
    umgebung: umfeld.umgebung,
  };

  // Den Platzhalter {CHECKOUT_SESSION_ID} als Text anhängen: Über URL/
  // URLSearchParams würde er kodiert, und Stripe ersetzte ihn nicht.
  const rueckkehr = new URL('/api/zahlung/rueckkehr', umfeld.site);
  rueckkehr.searchParams.set('id', intent.recordId);
  rueckkehr.searchParams.set('t', intent.accessToken);
  const abbruch = new URL(`/bestellung/${encodeURIComponent(intent.recordId)}`, umfeld.site);
  abbruch.searchParams.set('t', intent.accessToken);
  abbruch.searchParams.set('abbruch', '1');

  const minuten = intent.recordKind === 'termin' ? ABLAUF_MINUTEN.termin : ABLAUF_MINUTEN.bestellung;
  const beschreibung = zahlungsBeschreibung(intent);

  return {
    mode: 'payment',
    locale: 'de',
    customer_email: intent.customerEmail,
    client_reference_id: intent.recordId,
    metadata,
    payment_intent_data: { metadata, description: beschreibung },
    payment_method_types: umfeld.konfiguration.zahlarten as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
    // Beträge bleiben in Euro — sonst passt amount_total nicht zum Vorgang.
    adaptive_pricing: { enabled: false },
    expires_at: Math.floor(umfeld.jetzt.getTime() / 1000) + minuten * 60,
    success_url: `${rueckkehr.toString()}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: abbruch.toString(),
    ...positionen(intent),
    ...(umfeld.konfiguration.rechnungen
      ? { invoice_creation: { enabled: true, invoice_data: { description: beschreibung, metadata } } }
      : {}),
  };
}

/**
 * Legt die Checkout-Sitzung an. Unter dem Mindestbetrag gibt es keine
 * Sitzung — der Vorgang bleibt offen und das Team sieht eine Notiz.
 */
export async function starteCheckout(intent: PaymentIntent): Promise<PaymentResult> {
  const konfiguration = zahlungKonfiguration();
  if (!konfiguration) throw new Error('Stripe ist nicht eingerichtet.');

  if (!Number.isSafeInteger(intent.amountCents) || intent.amountCents < MINDESTBETRAG_CENT) {
    return {
      status: 'offen',
      message: 'Ihr Vorgang ist gespeichert. Die Zahlungsinformationen erhalten Sie von uns.',
      internalNote:
        `Keine Online-Zahlung gestartet: Der Betrag liegt unter ${MINDESTBETRAG_CENT} Cent (Mindestbetrag bei Stripe). `
        + 'Bitte die Zahlung anders abwickeln.',
    };
  }

  const session = await stripeClient(konfiguration).checkout.sessions.create(
    checkoutParameter(intent, { jetzt: new Date(), site: getSiteUrl(), konfiguration, umgebung: zahlungsUmgebung() }),
  );
  if (!session.url) throw new Error('Stripe hat keine Zahlungsadresse geliefert.');

  return {
    status: 'offen',
    checkoutSessionId: session.id,
    ...(typeof session.payment_intent === 'string' ? { providerRef: session.payment_intent } : {}),
    expiresAt: new Date(session.expires_at * 1000).toISOString(),
    redirectUrl: session.url,
    message: 'Sie werden zur Zahlung weitergeleitet.',
  };
}

/** Sitzung abrufen — für Rückkehr, „Jetzt bezahlen“ und Abgleich. */
export async function checkoutAbrufen(sessionId: string): Promise<Stripe.Checkout.Session> {
  return stripeClient().checkout.sessions.retrieve(sessionId);
}

/** Offene Sitzung beenden, etwa wenn das Team den Vorgang storniert. */
export async function checkoutBeenden(sessionId: string): Promise<void> {
  await stripeClient().checkout.sessions.expire(sessionId);
}

/** Zahlung (PaymentIntent) abrufen — für Erstattungen ohne gespeicherte Kennung. */
export async function zahlungAbrufen(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  return stripeClient().paymentIntents.retrieve(paymentIntentId);
}

/**
 * Prüft die Signatur eines Webhooks über die exakten Bytes und liefert das
 * Ereignis. Wirft bei falscher oder fehlender Signatur.
 */
export function webhookEreignis(koerper: Buffer, signatur: string, geheimnis: string): Stripe.Event {
  return Stripe.webhooks.constructEvent(koerper, signatur, geheimnis);
}
