'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { sendungsnummerEintragen } from '@/lib/einsenden/aktion';
import { Field } from '@/components/forms/field';
import { Select, TextInput } from '@/components/forms/controls';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface SendungsnummerFormularProps {
  recordId: string;
  /** Link-Schlüssel aus der Adresse; die Aktion prüft ihn erneut. */
  token: string;
  /** Schon gespeicherte Nummer (zum Berichtigen). */
  gespeichert?: string;
  /** Nur bei der Freigabe mit Einsendung: die Varianten, die die Seite anbietet. */
  varianten?: Array<{ art: string; titel: string }>;
  /** Vorauswahl: gespeicherte Wahl, sonst die Empfehlung. */
  vorauswahl?: string;
}

/** Sendungsnummer der Sendung an uns nachtragen (FA-SHOP-03B). */
export function SendungsnummerFormular({ recordId, token, gespeichert, varianten, vorauswahl }: SendungsnummerFormularProps) {
  const router = useRouter();
  const [nummer, setNummer] = useState(gespeichert ?? '');
  const [variante, setVariante] = useState(vorauswahl ?? varianten?.[0]?.art ?? '');
  const [laeuft, setLaeuft] = useState(false);
  const [meldung, setMeldung] = useState<{ ok: boolean; text: string } | null>(null);

  async function absenden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLaeuft(true);
    setMeldung(null);
    try {
      const antwort = await sendungsnummerEintragen({ recordId, token, nummer, ...(varianten ? { variante } : {}) });
      setMeldung({ ok: antwort.ok, text: antwort.meldung });
      if (antwort.ok) {
        if (antwort.nummer) setNummer(antwort.nummer);
        // Seite neu vom Server: Stand „unterwegs zu uns“ und Nummer erscheinen.
        router.refresh();
      }
    } catch {
      setMeldung({ ok: false, text: 'Die Sendungsnummer konnte gerade nicht gespeichert werden. Bitte versuchen Sie es in einigen Minuten erneut.' });
    }
    setLaeuft(false);
  }

  return (
    <form onSubmit={absenden} className="mt-4 max-w-measure space-y-4" noValidate>
      {varianten && varianten.length > 0 && (
        <Field label="So schicken Sie den Schlüssel" required>
          {({ id, describedBy, invalid }) => (
            <Select id={id} aria-describedby={describedBy} invalid={invalid} value={variante} onChange={(e) => setVariante(e.target.value)}>
              {varianten.map((v) => (
                <option key={v.art} value={v.art}>
                  {v.titel}
                </option>
              ))}
            </Select>
          )}
        </Field>
      )}
      <Field
        label={gespeichert ? 'Sendungsnummer berichtigen' : 'Sendungsnummer'}
        hint="Steht auf dem Einlieferungsbeleg der Post oder von DHL. Leerzeichen dürfen Sie mit eingeben."
        required
      >
        {({ id, describedBy, invalid }) => (
          <TextInput
            id={id}
            name="sendungsnummer"
            aria-describedby={describedBy}
            invalid={invalid}
            autoComplete="off"
            spellCheck={false}
            maxLength={80}
            value={nummer}
            onChange={(e) => setNummer(e.target.value)}
          />
        )}
      </Field>
      <Button type="submit" loading={laeuft} disabled={laeuft || nummer.trim() === ''}>
        Sendungsnummer speichern
      </Button>
      {meldung && (
        <Alert tone={meldung.ok ? 'success' : 'warning'} role={meldung.ok ? 'status' : 'alert'}>
          {meldung.text}
        </Alert>
      )}
    </form>
  );
}
