'use client';

import Link from 'next/link';
import { useState } from 'react';

import { zahlungFortsetzen } from '@/lib/actions/zahlung';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface JetztBezahlenProps {
  recordId: string;
  /** Link-Schlüssel aus der Adresse — die Aktion prüft ihn erneut. */
  token: string;
  label: string;
}

/** Öffnet die Zahlungsseite (vorhandene oder neue Checkout-Sitzung). */
export function JetztBezahlen({ recordId, token, label }: JetztBezahlenProps) {
  const [laeuft, setLaeuft] = useState(false);
  const [meldung, setMeldung] = useState<{ text: string; neuBuchen?: string } | null>(null);

  async function bezahlen() {
    setLaeuft(true);
    setMeldung(null);
    try {
      const ergebnis = await zahlungFortsetzen({ recordId, token });
      if (ergebnis.ok && ergebnis.url) {
        window.location.assign(ergebnis.url);
        return;
      }
      setMeldung({ text: ergebnis.meldung ?? 'Die Zahlung konnte gerade nicht gestartet werden.', neuBuchen: ergebnis.neuBuchen });
    } catch {
      setMeldung({ text: 'Die Zahlung konnte gerade nicht gestartet werden. Bitte versuchen Sie es erneut.' });
    }
    setLaeuft(false);
  }

  return (
    <div className="space-y-4">
      <Button type="button" size="lg" loading={laeuft} disabled={laeuft} onClick={bezahlen}>
        {label}
      </Button>
      {meldung && (
        <Alert tone="warning" role="alert">
          {meldung.text}
          {meldung.neuBuchen && (
            <>
              {' '}
              <Link href={meldung.neuBuchen} className="font-semibold text-primary hover:underline">
                Termin neu buchen
              </Link>
            </>
          )}
        </Alert>
      )}
    </div>
  );
}
