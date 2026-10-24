/** Stripe-Ereignisse, die der Webhook (/api/zahlung/stripe) verarbeitet — in Stripe genau diese abonnieren. */
export const STRIPE_EREIGNISSE = [
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'checkout.session.expired',
  'charge.refunded',
  'charge.dispute.created',
] as const;
