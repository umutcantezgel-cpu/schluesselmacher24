import { mitDatenbank, zahlungKonfiguration } from '@/lib/umgebung';

/* ==========================================================================
   Zahlarten für die Anzeige
   Dieselbe Quelle wie der Stripe-Checkout: `zahlungKonfiguration().zahlarten`
   (PAYMENT_METHODS). So nennen Rechtsseiten und Kasse nie andere Zahlarten
   als die, die der Checkout tatsächlich anbietet.
   ========================================================================== */

/**
 * Anzeigetexte je Stripe-Zahlart (`payment_method_types`). Apple Pay und
 * Google Pay sind bei Stripe keine eigenen Zahlarten, sondern laufen über
 * `card` — ob sie erscheinen, hängt vom Gerät ab.
 */
export const ZAHLART_TEXTE: Readonly<Record<string, string>> = {
  card: 'Kredit- und Debitkarte, Apple Pay und Google Pay je nach Gerät',
  paypal: 'PayPal',
  klarna: 'Klarna',
  sepa_debit: 'SEPA-Lastschrift',
  link: 'Link (gespeicherte Zahlungsdaten bei Stripe)',
  amazon_pay: 'Amazon Pay',
  revolut_pay: 'Revolut Pay',
  eps: 'eps-Überweisung',
  ideal: 'iDEAL',
  bancontact: 'Bancontact',
  customer_balance: 'Banküberweisung über Stripe',
};

/** Ohne Online-Zahlung: Zahlung nach Rechnung oder vor Ort. */
export const ZAHLUNG_OHNE_ONLINE = 'Überweisung nach Rechnung oder Zahlung vor Ort';

/** Anzeigetexte für die konfigurierten Zahlarten, ohne Dopplungen. */
export function zahlartenAnzeige(zahlarten: readonly string[]): string[] {
  const texte = zahlarten.map((art) => ZAHLART_TEXTE[art.trim()] ?? art.trim()).filter(Boolean);
  return [...new Set(texte)];
}

/**
 * Online angebotene Zahlarten oder `null`, solange keine Online-Zahlung
 * eingerichtet ist. Stripe braucht die Datenbank, weil Webhooks die Zahlung
 * am gespeicherten Vorgang verbuchen (wie `paymentStatus()`).
 */
export function onlineZahlarten(): string[] | null {
  const konfiguration = zahlungKonfiguration();
  if (!konfiguration || !mitDatenbank()) return null;
  return zahlartenAnzeige(konfiguration.zahlarten);
}
