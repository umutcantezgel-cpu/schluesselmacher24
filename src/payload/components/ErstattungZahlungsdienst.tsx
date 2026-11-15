'use client';

import { Button, useFormFields } from '@payloadcms/ui';

import { ERSTATTUNG_AUSLOESEN_AUS, stripeZahlungsLink } from '@/lib/zahlung/erstattung';

/**
 * Vorbereiteter, abgeschalteter Knopf „Erstattung beim Zahlungsdienst auslösen“ (FA-KERN-05, G5). Er löst
 * nichts aus; die Funktion dahinter (`erstattungBeimZahlungsdienst`) ist ohne Schalter aus und an keinen
 * Endpunkt gebunden. Daneben der Weg ins Stripe-Dashboard.
 */
export function ErstattungZahlungsdienst() {
  const kennung = useFormFields(([felder]) => felder['zahlung.anbieterRef']?.value);
  const ref = typeof kennung === 'string' ? kennung : null;
  const link = stripeZahlungsLink(ref);
  // Wie `StripeLink`: Der Modus der Zahlung ist im Backend nicht bekannt, daher beide Wege.
  const testLink = stripeZahlungsLink(ref, true);
  return (
    <div className="field-type" style={{ marginBottom: 'var(--base)' }}>
      <Button buttonStyle="secondary" size="small" disabled>
        Erstattung beim Zahlungsdienst auslösen
      </Button>
      <div className="field-description">
        {ERSTATTUNG_AUSLOESEN_AUS}{' '}
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            Zahlung im Stripe-Dashboard öffnen
          </a>
        ) : (
          'Für Erstattungen außerhalb des Zahlungsdienstes tragen Sie Weg und Beleg ein.'
        )}
        {link && testLink ? (
          <>
            {' '}(Testmodus:{' '}
            <a href={testLink} target="_blank" rel="noopener noreferrer">
              Testzahlung öffnen
            </a>
            )
          </>
        ) : null}
      </div>
    </div>
  );
}
