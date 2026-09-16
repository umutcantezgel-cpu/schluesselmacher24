'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

import { fetchRecordStatus } from '@/lib/actions/booking';
import { formatCents, formatDate, formatDateTime, formatDuration } from '@/lib/format';
import type { AppointmentInfo, PaymentInfo, RecordStatus, SummarySection } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Field } from '@/components/forms/field';
import { TextInput } from '@/components/forms/controls';
import { SummaryList } from '@/components/layout/summary-list';

const STATUS_TEXT: Record<RecordStatus, { label: string; erklaerung: string }> = {
  neu: { label: 'Eingegangen', erklaerung: 'Ihr Vorgang liegt uns vor und wird in Kürze gesichtet.' },
  'in-pruefung': { label: 'In Prüfung', erklaerung: 'Wir prüfen Machbarkeit, Unterlagen und Preis.' },
  geprueft: { label: 'Geprüft', erklaerung: 'Die Prüfung ist abgeschlossen. Sie hören von uns.' },
  'wartet-auf-kunde': {
    label: 'Wartet auf Sie',
    erklaerung: 'Wir brauchen noch eine Angabe oder eine Unterlage von Ihnen.',
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
  'wartet-auf-kunde': 'warning',
  'in-fertigung': 'primary',
  terminiert: 'success',
  versendet: 'success',
  abgeschlossen: 'success',
  storniert: 'danger',
};

interface Ergebnis {
  reference: string;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
  appointment?: AppointmentInfo;
  payment?: PaymentInfo;
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
          <Search size={16} aria-hidden />
          Stand abrufen
        </Button>
      </form>

      {fehler && (
        <Alert tone="warning" title="Nichts gefunden" className="mt-6">
          {fehler}{' '}
          <Link href="/service-und-termin/kontakt" className="font-semibold underline">
            Nehmen Sie Kontakt auf
          </Link>
          , wenn Sie Ihre Nummer nicht mehr haben.
        </Alert>
      )}

      {ergebnis && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                  Vorgang
                </p>
                <p className="mt-0.5 font-mono text-lg font-bold text-foreground">
                  {ergebnis.reference}
                </p>
              </div>
              <Badge tone={STATUS_TON[ergebnis.status]}>{STATUS_TEXT[ergebnis.status].label}</Badge>
            </CardHeader>

            <CardBody>
              <p className="text-[15px] leading-relaxed text-foreground-muted">
                {STATUS_TEXT[ergebnis.status].erklaerung}
              </p>

              <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                    Angelegt
                  </dt>
                  <dd className="mt-1 text-[15px] text-foreground">
                    {formatDateTime(ergebnis.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                    Zuletzt aktualisiert
                  </dt>
                  <dd className="mt-1 text-[15px] text-foreground">
                    {formatDateTime(ergebnis.updatedAt)}
                  </dd>
                </div>

                {ergebnis.appointment && (
                  <div className="sm:col-span-2">
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                      Termin
                    </dt>
                    <dd className="mt-1 text-[15px] text-foreground">
                      {formatDate(ergebnis.appointment.date)}, {ergebnis.appointment.time} Uhr ·{' '}
                      {formatDuration(ergebnis.appointment.durationMinutes)} ·{' '}
                      {ergebnis.appointment.location === 'werkstatt' ? 'im Fachbetrieb' : 'vor Ort'}
                    </dd>
                  </div>
                )}

                {ergebnis.payment && (
                  <div className="sm:col-span-2">
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                      Zahlung
                    </dt>
                    <dd className="mt-1 text-[15px] text-foreground">
                      {ergebnis.payment.scope === 'anzahlung' ? 'Anzahlung' : 'Gesamtbetrag'}{' '}
                      {formatCents(ergebnis.payment.amountCents)} — Status:{' '}
                      {ergebnis.payment.status}
                      {ergebnis.payment.paidAt && `, bezahlt am ${formatDateTime(ergebnis.payment.paidAt)}`}
                    </dd>
                  </div>
                )}
              </dl>
            </CardBody>
          </Card>

          <SummaryList sections={ergebnis.summary} />

          {ergebnis.timeline.length > 0 && (
            <div>
              <h2 className="text-[15px] font-bold text-foreground">Verlauf</h2>
              <ol className="mt-3 space-y-3 border-l border-border pl-5">
                {ergebnis.timeline.map((entry, index) => (
                  <li key={`${entry.at}-${index}`} className="relative">
                    <span
                      aria-hidden
                      className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-primary"
                    />
                    <p className="text-[13px] font-semibold text-foreground-subtle">
                      {formatDateTime(entry.at)}
                    </p>
                    <p className="text-[14px] text-foreground-muted">{entry.message}</p>
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
