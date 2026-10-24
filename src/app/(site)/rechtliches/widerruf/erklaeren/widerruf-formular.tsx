'use client';

import { useActionState, useState } from 'react';

import { Field } from '@/components/forms/field';
import { TextArea, TextInput } from '@/components/forms/controls';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { widerrufErklaeren } from '@/lib/actions/widerruf';
import { WIDERRUF_ERKLAERUNG, type WiderrufErgebnis } from '@/lib/rechtliches/widerruf-typen';
import { eingangszeitText } from '@/lib/rechtliches/zeit';

/** Bestätigung nach dem Absenden: Eingangszeit und Angaben, zum Drucken oder Speichern. */
function Eingangsbestaetigung({ ergebnis }: { ergebnis: Extract<WiderrufErgebnis, { status: 'eingegangen' }> }) {
  return (
    <div className="mt-6">
      <Alert tone="success" title="Ihr Widerruf ist bei uns eingegangen" role="status">
        <p>
          Eingegangen am{' '}
          <strong className="font-mono tabular-nums">{eingangszeitText(ergebnis.eingangAm)}</strong>{' '}
          (deutsche Zeit). Maßgeblich für die Frist ist dieser Zeitpunkt.
        </p>
      </Alert>

      <dl className="mt-6 border-t border-border">
        {[
          ['Name', ergebnis.name],
          ['E-Mail', ergebnis.email],
          ['Vorgangsnummer', ergebnis.vorgangsnummer ?? 'nicht angegeben'],
          ['Erklärung', WIDERRUF_ERKLAERUNG],
        ].map(([label, wert]) => (
          <div key={label} className="grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4">
            <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted sm:col-span-4">
              {label}
            </dt>
            <dd className="break-words text-body text-foreground sm:col-span-8">{wert}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6">
        {ergebnis.mailGesendet
          ? `Eine Eingangsbestätigung haben wir zusätzlich an ${ergebnis.email} gesendet.`
          : 'Bitte drucken oder speichern Sie diese Seite als Nachweis. Eine Bestätigung per E-Mail erhalten Sie, sobald wir Ihren Widerruf bearbeiten.'}{' '}
        Wir prüfen Ihren Widerruf und melden uns mit den weiteren Schritten.
      </p>
      <Button type="button" variant="outline" className="mt-4" onClick={() => window.print()}>
        Seite drucken
      </Button>
    </div>
  );
}

/**
 * Formular des Widerrufsbuttons. Die Eingaben bleiben im Zustand, damit sie
 * nach einem Prüffehler stehen bleiben (React setzt Formulare nach einer
 * Aktion sonst zurück).
 */
export function WiderrufFormular({ vorgangsnummer = '' }: { vorgangsnummer?: string }) {
  const [ergebnis, absenden, laeuft] = useActionState(widerrufErklaeren, null);
  const [werte, setWerte] = useState({ name: '', email: '', vorgangsnummer, erklaerung: '' });

  if (ergebnis?.status === 'eingegangen') return <Eingangsbestaetigung ergebnis={ergebnis} />;

  const fehler = ergebnis?.status === 'ungueltig' ? ergebnis.fehler : {};
  const setzen = (feld: keyof typeof werte) => (event: { target: { value: string } }) =>
    setWerte((vorher) => ({ ...vorher, [feld]: event.target.value }));

  return (
    <form action={absenden} noValidate className="mt-6 rounded-lg border border-border bg-surface p-5 md:p-6">
      {ergebnis?.status === 'fehler' && (
        <Alert tone="danger" title="Nicht gespeichert" role="alert" className="mb-5">
          {ergebnis.meldung}
        </Alert>
      )}
      {ergebnis?.status === 'ohne-speicher' && (
        <Alert tone="warning" title="Online-Widerruf gerade nicht verfügbar" role="alert" className="mb-5">
          {ergebnis.email ? (
            <>
              Bitte senden Sie Ihren Widerruf per E-Mail an{' '}
              <a
                href={`mailto:${ergebnis.email}?subject=${encodeURIComponent('Widerruf')}`}
                className="font-semibold underline"
              >
                {ergebnis.email}
              </a>
              . Für die Frist genügt es, wenn Sie die Erklärung rechtzeitig absenden.
            </>
          ) : (
            'Bitte senden Sie uns Ihren Widerruf per E-Mail oder Brief. Für die Frist genügt es, wenn Sie die Erklärung rechtzeitig absenden.'
          )}
        </Alert>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" required error={fehler.name}>
          {({ id, describedBy, invalid }) => (
            <TextInput
              id={id}
              name="name"
              aria-describedby={describedBy}
              invalid={invalid}
              autoComplete="name"
              value={werte.name}
              onChange={setzen('name')}
              maxLength={120}
              required
            />
          )}
        </Field>

        <Field
          label="E-Mail-Adresse"
          required
          hint="Dorthin senden wir die Eingangsbestätigung."
          error={fehler.email}
        >
          {({ id, describedBy, invalid }) => (
            <TextInput
              id={id}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-describedby={describedBy}
              invalid={invalid}
              value={werte.email}
              onChange={setzen('email')}
              maxLength={254}
              required
            />
          )}
        </Field>

        <Field
          label="Vorgangsnummer"
          hint="Steht in Ihrer Bestätigung, zum Beispiel SM24-B-2026-0001. Ohne Nummer ordnen wir den Widerruf von Hand zu."
          error={fehler.vorgangsnummer}
          className="sm:col-span-2"
        >
          {({ id, describedBy, invalid }) => (
            <TextInput
              id={id}
              name="vorgangsnummer"
              aria-describedby={describedBy}
              invalid={invalid}
              value={werte.vorgangsnummer}
              onChange={setzen('vorgangsnummer')}
              placeholder="SM24-…"
              className="font-mono"
              maxLength={40}
              autoCapitalize="characters"
            />
          )}
        </Field>

        <Field
          label="Weitere Angaben (freiwillig)"
          hint="Zum Beispiel, welche Bestellung oder welcher Termin gemeint ist."
          error={fehler.erklaerung}
          className="sm:col-span-2"
        >
          {({ id, describedBy, invalid }) => (
            <TextArea
              id={id}
              name="erklaerung"
              aria-describedby={describedBy}
              invalid={invalid}
              value={werte.erklaerung}
              onChange={setzen('erklaerung')}
              maxLength={2000}
              rows={4}
            />
          )}
        </Field>
      </div>

      <p className="mt-6 rounded-md border-l-2 border-border-strong bg-surface-muted px-4 py-3 text-small text-foreground">
        Mit dem Absenden erklären Sie: „{WIDERRUF_ERKLAERUNG}“
      </p>

      <Button type="submit" size="lg" className="mt-5" loading={laeuft}>
        Widerruf jetzt erklären
      </Button>
    </form>
  );
}
