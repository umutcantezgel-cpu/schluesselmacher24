'use client';

import { useState } from 'react';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ausfuehrungBestaetigen } from '@/lib/actions/kundenbestaetigung';

interface BestaetigenKnopfProps {
  recordId: string;
  /** Einmal-Schlüssel aus der Adresse; die Aktion prüft ihn erneut. */
  schluessel: string;
}

/** „Auftrag wurde ausgeführt: bestätigen“ (FA-KERN-04). */
export function BestaetigenKnopf({ recordId, schluessel }: BestaetigenKnopfProps) {
  const [laeuft, setLaeuft] = useState(false);
  const [ergebnis, setErgebnis] = useState<{ ok: boolean; meldung: string } | null>(null);

  async function bestaetigen() {
    setLaeuft(true);
    try {
      setErgebnis(await ausfuehrungBestaetigen({ recordId, key: schluessel }));
    } catch {
      setErgebnis({ ok: false, meldung: 'Das hat gerade nicht geklappt. Bitte versuchen Sie es erneut.' });
    }
    setLaeuft(false);
  }

  if (ergebnis?.ok) {
    return (
      <Alert tone="success" title="Bestätigt" role="status">
        {ergebnis.meldung}
      </Alert>
    );
  }
  return (
    <div className="space-y-4">
      <Button type="button" size="lg" loading={laeuft} disabled={laeuft} onClick={bestaetigen}>
        Auftrag wurde ausgeführt: bestätigen
      </Button>
      {ergebnis && (
        <Alert tone="warning" role="alert">
          {ergebnis.meldung}
        </Alert>
      )}
    </div>
  );
}
