'use client';

import { useFormFields } from '@payloadcms/ui';

/** Link zur Zahlung im Stripe-Dashboard — neben der Zahlungskennung. */
export function StripeLink() {
  const kennung = useFormFields(([felder]) => felder['zahlung.anbieterRef']?.value);
  if (typeof kennung !== 'string' || !/^pi_[A-Za-z0-9]+$/.test(kennung)) return null;
  return (
    <div className="field-description" style={{ marginBottom: 'var(--base)' }}>
      <a href={`https://dashboard.stripe.com/payments/${kennung}`} target="_blank" rel="noopener noreferrer">
        Zahlung im Stripe-Dashboard öffnen
      </a>{' '}
      (Testmodus:{' '}
      <a href={`https://dashboard.stripe.com/test/payments/${kennung}`} target="_blank" rel="noopener noreferrer">
        Testzahlung öffnen
      </a>
      ). Erstattungen dort auslösen — der Stand hier folgt automatisch.
    </div>
  );
}
