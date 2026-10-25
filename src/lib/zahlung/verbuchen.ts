import 'server-only';

import type Stripe from 'stripe';

import { findeVorgangFuerZahlung, zahlungsereignisVerbuchen, type ZahlungsVerweis } from '@/lib/data';
import { zahlungAbrufen, zahlungsUmgebung } from '@/lib/integrations/stripe';
import type { BusinessRecord } from '@/lib/types';

import {
  zahlungsUebergang,
  type Sitzung,
  type SitzungsEreignisTyp,
  type ZahlungsEreignis,
  type ZahlungsErgebnis,
  type ZahlungsMail,
} from './uebergaenge';

/* ==========================================================================
   Verbuchung von Stripe-Ereignissen
   Übersetzt Stripe-Objekte in die Ereignisse des Zustandsautomaten, findet
   den Vorgang und verbucht genau einmal (`zahlungsereignisVerbuchen`).
   Gemeinsam für Webhook, Rückkehr von der Zahlungsseite und Abgleich.
   ========================================================================== */

export interface Verbucht {
  /** Ergebnis des Automaten oder der Verbuchung (`doppelt`, `kein-vorgang`, `ignoriert`). */
  ergebnis: ZahlungsErgebnis | 'doppelt' | 'kein-vorgang' | 'ignoriert';
  /** Vorgang nach der Verbuchung. */
  vorgang?: BusinessRecord;
  /** Mail, die nach dem Verbuchen an den Kunden geht. */
  mail?: ZahlungsMail;
}

function kennung(wert: string | { id: string } | null | undefined): string | undefined {
  if (!wert) return undefined;
  return typeof wert === 'string' ? wert : wert.id;
}

function zahlstatus(wert: string): Sitzung['zahlstatus'] {
  return wert === 'paid' || wert === 'no_payment_required' ? wert : 'unpaid';
}

/** Nur die Angaben, die der Automat braucht. */
export function sitzungAusStripe(session: Stripe.Checkout.Session): Sitzung {
  const sitzung: Sitzung = {
    id: session.id,
    // Unbekannte, neuere Werte wie „unbezahlt“ behandeln — nie als Zahlungseingang.
    zahlstatus: zahlstatus(session.payment_status),
    betragCent: session.amount_total,
    waehrung: session.currency,
    metadata: { ...(session.metadata ?? {}) },
  };
  const paymentIntent = kennung(session.payment_intent);
  if (paymentIntent) sitzung.paymentIntent = paymentIntent;
  return sitzung;
}

/**
 * Zuerst über die Kennung des Vorgangs aus den Metadaten — aber nur aus
 * dieser Umgebung. Sonst über die Sitzung (Stripe-Kennungen sind eindeutig).
 */
function verweisAusMetadaten(metadata: Record<string, string> | null | undefined, sonst: ZahlungsVerweis): ZahlungsVerweis {
  const id = metadata?.vorgangId;
  if (metadata?.umgebung === zahlungsUmgebung() && id && /^\d{1,15}$/.test(id)) return { vorgangId: id };
  return sonst;
}

async function verbuchen(
  ereignisId: string,
  typ: string,
  finde: ZahlungsVerweis,
  ereignis: ZahlungsEreignis,
): Promise<Verbucht> {
  const kontext = { jetzt: new Date().toISOString(), umgebung: zahlungsUmgebung() };
  let mail: ZahlungsMail | undefined;
  const ergebnis = await zahlungsereignisVerbuchen<ZahlungsErgebnis>({
    ereignisId,
    typ,
    anbieter: 'stripe',
    finde,
    anwenden: (vorgang) => {
      const uebergang = zahlungsUebergang(vorgang, ereignis, kontext);
      mail = uebergang?.mail;
      return uebergang ? { aenderung: uebergang.aenderung, ergebnis: uebergang.ergebnis } : null;
    },
  });
  if (!('vorgang' in ergebnis)) return { ergebnis: ergebnis.ergebnis };
  const verbucht: Verbucht = { ergebnis: ergebnis.ergebnis, vorgang: ergebnis.vorgang };
  if (mail && ergebnis.ergebnis !== 'ignoriert') verbucht.mail = mail;
  return verbucht;
}

/** Verbucht den Stand einer Checkout-Sitzung (Webhook, Rückkehr, Abgleich). */
export async function sitzungVerbuchen(
  ereignisId: string,
  typ: SitzungsEreignisTyp,
  session: Stripe.Checkout.Session,
): Promise<Verbucht> {
  const sitzung = sitzungAusStripe(session);
  return verbuchen(ereignisId, typ, verweisAusMetadaten(sitzung.metadata, { checkoutSitzung: sitzung.id }), { typ, sitzung });
}

/**
 * Vorgang zu einer Zahlung: über die gespeicherte Kennung, sonst über die
 * Metadaten der Zahlung bei Stripe.
 */
async function verweisFuerZahlung(paymentIntent: string | undefined): Promise<ZahlungsVerweis | null> {
  if (!paymentIntent) return null;
  if (await findeVorgangFuerZahlung({ anbieterRef: paymentIntent })) return { anbieterRef: paymentIntent };
  const zahlung = await zahlungAbrufen(paymentIntent);
  const verweis = verweisAusMetadaten(zahlung.metadata, {});
  return verweis.vorgangId ? verweis : { anbieterRef: paymentIntent };
}

/**
 * Verbucht ein Webhook-Ereignis. `null`: Typ wird nicht verarbeitet.
 * Wirft bei Fehlern — der Webhook antwortet dann 500 und Stripe stellt
 * das Ereignis erneut zu.
 */
export async function stripeEreignisVerbuchen(event: Stripe.Event): Promise<Verbucht | null> {
  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
    case 'checkout.session.async_payment_failed':
    case 'checkout.session.expired':
      // Nur Zahlungen dieser Seite (mode „payment“ mit unseren Metadaten).
      if (event.data.object.mode !== 'payment') return { ergebnis: 'ignoriert' };
      return sitzungVerbuchen(event.id, event.type, event.data.object);

    case 'charge.refunded': {
      const charge = event.data.object;
      const verweis = await verweisFuerZahlung(kennung(charge.payment_intent));
      if (!verweis) return { ergebnis: 'kein-vorgang' };
      return verbuchen(event.id, event.type, verweis, {
        typ: 'charge.refunded',
        erstattung: {
          betragCent: charge.amount,
          erstattetCent: charge.amount_refunded,
          vollstaendig: charge.refunded,
          waehrung: charge.currency,
        },
      });
    }

    case 'charge.dispute.created': {
      const streitfall = event.data.object;
      const verweis = await verweisFuerZahlung(kennung(streitfall.payment_intent));
      if (!verweis) return { ergebnis: 'kein-vorgang' };
      return verbuchen(event.id, event.type, verweis, {
        typ: 'charge.dispute.created',
        streitfall: { betragCent: streitfall.amount, grund: streitfall.reason, waehrung: streitfall.currency },
      });
    }

    default:
      return null;
  }
}
