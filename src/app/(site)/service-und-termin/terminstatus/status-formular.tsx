'use client';

import { useState } from 'react';
import Link from 'next/link';

import { fetchRecordStatus } from '@/lib/actions/booking';
import { formatCents, formatDate, formatDateTime, formatDuration } from '@/lib/format';
import type { AppointmentInfo, PaymentInfo, RecordStatus, SummarySection } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/forms/field';
import { TextInput } from '@/components/forms/controls';
import { SummaryList } from '@/components/layout/summary-list';
import { GlyphSuche } from '@/components/visual/glyphen/suche';

const STATUS_TEXT: Record<RecordStatus, { label: string; erklaerung: string }> = {
  neu: { label: 'Eingegangen', erklaerung: 'Ihr Vorgang liegt uns vor und wird in Kürze gesichtet.' },
  'in-pruefung': { label: 'In Prüfung', erklaerung: 'Wir prüfen Machbarkeit, Unterlagen und Preis.' },
  geprueft: { label: 'Geprüft', erklaerung: 'Die Prüfung ist abgeschlossen. Sie hören von uns.' },
  freigegeben: {
    label: 'Freigegeben',
    erklaerung:
      'Die Anfertigung ist nach unserer Prüfung möglich; Preis und Weg zur Zahlung stehen in unserer E-Mail. '
      + 'Die Freigabe ist noch keine Fertigungszusage: Den Auftrag erteilen Sie mit der Zahlung.',
  },
  'nicht-moeglich': {
    label: 'Nicht möglich',
    erklaerung: 'Nach unserer Prüfung können wir diesen Auftrag leider nicht ausführen. Einzelheiten stehen in unserer E-Mail.',
  },
  'wartet-auf-kunde': {
    label: 'Rückfrage an Sie',
    erklaerung: 'Wir brauchen noch eine Angabe oder eine Unterlage von Ihnen. Einzelheiten stehen in unserer E-Mail.',
  },
  'in-fertigung': { label: 'In Fertigung', erklaerung: 'Ihr Auftrag wird bearbeitet.' },
  terminiert: { label: 'Termin steht', erklaerung: 'Ihr Termin ist verbindlich eingeplant.' },
  versendet: { label: 'Versendet', erklaerung: 'Ihre Sendung ist auf dem Weg.' },
  abgeschlossen: { label: 'Abgeschlossen', erklaerung: 'Der Vorgang ist erledigt.' },
  storniert: { label: 'Storniert', erklaerung: 'Der Vorgang wurde storniert.' },
};

const STATUS_TON: Record<RecordStatus, 'neutral' | 'primary' | 'success' | 'warning' | 'danger'> = {
  neu: 'primary',
  'in-pruefung': 'primary',
  geprueft: 'primary',
  freigegeben: 'success',
  'nicht-moeglich': 'danger',
  'wartet-auf-kunde': 'warning',
  'in-fertigung': 'primary',
  terminiert: 'success',
  versendet: 'success',
  abgeschlossen: 'success',
  storniert: 'danger',
};

const ZAHLUNG_TEXT: Record<PaymentInfo['status'], string> = {
  offen: 'offen',
  bezahlt: 'bezahlt',
  fehlgeschlagen: 'nicht abgeschlossen',
  erstattet: 'erstattet',
};

interface Ergebnis {
  reference: string;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
  appointment?: AppointmentInfo;
  /** Ohne Kennungen des Zahlungsdienstleisters. */
  payment?: Pick<PaymentInfo, 'scope' | 'amountCents' | 'status' | 'paidAt'>;
  summary: SummarySection[];
  timeline: Array<{ at: string; actor: string; message: string }>;
}

export function TerminStatusFormular() {
  const [nummer, setNummer] = useState('');
  const [email, setEmail] = useState('');
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [ergebnis, setErgebnis] = useState<Ergebnis | null>(null);

  async function suchen(event: React.FormEvent) {
    event.preventDefault();
    setLaeuft(true);
    setFehler(null);
    setErgebnis(null);

    const antwort = await fetchRecordStatus(nummer, email);
    setLaeuft(false);

    if (!antwort.ok) {
      setFehler(antwort.error);
      return;
    }

    // Die Zeitleiste zeigt nur, was auch für Kundinnen und Kunden bestimmt ist.
    setErgebnis(antwort.record as Ergebnis);
  }

  return (
    <div className="max-w-3xl">
      <form onSubmit={suchen} className="rounded-lg border border-border bg-surface p-5 md:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Vorgangsnummer"
            required
            hint="Steht in Ihrer Bestätigung, zum Beispiel SM24-T-2026-0001."
          >
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                value={nummer}
                onChange={(e) => setNummer(e.target.value)}
                placeholder="SM24-…"
                className="font-mono"
                required
              />
            )}
          </Field>

          <Field label="E-Mail-Adresse" required hint="Die Adresse, mit der Sie den Vorgang angelegt haben.">
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}
          </Field>
        </div>

        <Button type="submit" className="mt-5" loading={laeuft}>
          <GlyphSuche size={16} />
          Stand abrufen
        </Button>
      </form>

      {fehler && (
        <Alert tone="warning" title="Nichts gefunden" className="mt-6" role="alert">
          {fehler}{' '}
          <Link href="/service-und-termin/kontakt" className="font-semibold underline">
            Nehmen Sie Kontakt auf
          </Link>
          , wenn Sie Ihre Nummer nicht mehr haben.
        </Alert>
      )}

      {ergebnis && (
        <div className="mt-8 space-y-6">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                  Vorgang
                </p>
                <p className="mt-1 break-words font-mono text-title-sm font-semibold tabular-nums text-foreground">
                  {ergebnis.reference}
                </p>
              </div>
              <Badge tone={STATUS_TON[ergebnis.status]}>{STATUS_TEXT[ergebnis.status].label}</Badge>
            </div>

            <p className="mt-4 text-body text-foreground-muted">
              {STATUS_TEXT[ergebnis.status].erklaerung}
            </p>

            <dl className="mt-5 border-t border-border">
              <div className="grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4">
                <dt className="text-small font-semibold text-foreground-muted sm:col-span-5">Angelegt</dt>
                <dd className="font-mono text-body tabular-nums text-foreground sm:col-span-7 sm:text-right">
                  {formatDateTime(ergebnis.createdAt)}
                </dd>
              </div>
              <div className="grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4">
                <dt className="text-small font-semibold text-foreground-muted sm:col-span-5">
                  Zuletzt aktualisiert
                </dt>
                <dd className="font-mono text-body tabular-nums text-foreground sm:col-span-7 sm:text-right">
                  {formatDateTime(ergebnis.updatedAt)}
                </dd>
              </div>

              {ergebnis.appointment && (
                <div className="grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4">
                  <dt className="text-small font-semibold text-foreground-muted sm:col-span-5">Termin</dt>
                  <dd className="text-body text-foreground sm:col-span-7 sm:text-right">
                    {formatDate(ergebnis.appointment.date)}, {ergebnis.appointment.time} Uhr ·{' '}
                    <span className="font-mono tabular-nums">
                      {formatDuration(ergebnis.appointment.durationMinutes)}
                    </span> ·{' '}
                    {ergebnis.appointment.location === 'werkstatt' ? 'im Fachbetrieb' : 'vor Ort'}
                  </dd>
                </div>
              )}

              {ergebnis.payment && (
                <div className="grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4">
                  <dt className="text-small font-semibold text-foreground-muted sm:col-span-5">Zahlung</dt>
                  <dd className="text-body text-foreground sm:col-span-7 sm:text-right">
                    {ergebnis.payment.scope === 'anzahlung' ? 'Anzahlung' : 'Gesamtbetrag'}{' '}
                    <span className="font-mono tabular-nums">{formatCents(ergebnis.payment.amountCents)}</span>{' '}
                    — {ZAHLUNG_TEXT[ergebnis.payment.status]}
                    {ergebnis.payment.paidAt && `, bezahlt am ${formatDateTime(ergebnis.payment.paidAt)}`}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <SummaryList sections={ergebnis.summary} variante="schriftfeld" />

          {ergebnis.timeline.length > 0 && (
            <div>
              <h2 className="text-title-sm font-semibold text-foreground">Verlauf</h2>
              <ol className="mt-4 space-y-4 border-l border-border pl-5">
                {ergebnis.timeline.map((entry, index) => (
                  <li key={`${entry.at}-${index}`} className="relative">
                    <p className="relative font-mono text-caption tabular-nums text-foreground-muted">
                      <span
                        aria-hidden
                        className="absolute -left-5 top-1/2 h-px w-5 bg-border"
                      />
                      <span
                        aria-hidden
                        className="absolute -left-6 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-area-strong ring-4 ring-background"
                      />
                      {formatDateTime(entry.at)}
                    </p>
                    <p className="text-small text-foreground">{entry.message}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <Alert tone="info">
            Passt etwas nicht oder möchten Sie Ihren Termin verschieben? Melden Sie sich mit Ihrer
            Vorgangsnummer über die{' '}
            <Link href="/service-und-termin/kontakt" className="font-semibold underline">
              Kontaktseite
            </Link>
            .
          </Alert>
        </div>
      )}
    </div>
  );
}
