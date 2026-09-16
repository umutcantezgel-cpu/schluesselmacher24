'use client';

import Link from 'next/link';
import { CalendarCheck, CheckCircle2, CreditCard } from 'lucide-react';
import type { AppointmentInfo, PriceQuote, SummarySection } from '@/lib/types';
import { formatCents, formatDate, formatDuration } from '@/lib/format';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { SummaryList } from '@/components/layout/summary-list';

export interface BestaetigungProps {
  reference: string;
  appointment: AppointmentInfo;
  quote: PriceQuote;
  summary: SummarySection[];
  notices: string[];
  /** Zahlungsseite des Anbieters, sobald einer angebunden ist. */
  redirectUrl?: string;
}

/** Abschlussansicht nach erfolgreichem Absenden. */
export function Bestaetigung({
  reference,
  appointment,
  quote,
  summary,
  notices,
  redirectUrl,
}: BestaetigungProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-surface p-6">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-success">
          <CheckCircle2 size={16} aria-hidden />
          Vorgang angelegt
        </p>
        <h2 className="mt-3 text-xl font-bold text-foreground md:text-2xl">
          Ihre Anfrage ist bei uns eingegangen
        </h2>

        <div className="mt-5 rounded-lg border border-border bg-surface-muted p-5">
          <p className="text-[13px] font-semibold text-foreground-muted">Ihre Vorgangsnummer</p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-foreground">
            {reference}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
            Bitte bewahren Sie diese Nummer auf. Zusammen mit Ihrer E-Mail-Adresse rufen Sie damit
            jederzeit den Stand Ihres Vorgangs ab.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardBody className="flex items-start gap-3">
            <CalendarCheck size={18} className="mt-0.5 shrink-0 text-foreground-subtle" aria-hidden />
            <div>
              <p className="text-[14px] font-bold text-foreground">Ihr Termin</p>
              <p className="mt-1 text-[15px] font-semibold text-foreground">
                {formatDate(appointment.date)}, {appointment.time} Uhr
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                Eingeplant sind {formatDuration(appointment.durationMinutes)}.
                {appointment.location === 'vor-ort'
                  ? ' Der Termin findet mit Fahrzeug statt; den Ort stimmen wir mit Ihnen ab.'
                  : ' Die Arbeiten erfolgen im Fachbetrieb.'}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-start gap-3">
            <CreditCard size={18} className="mt-0.5 shrink-0 text-foreground-subtle" aria-hidden />
            <div>
              <p className="text-[14px] font-bold text-foreground">Anzahlung</p>
              <p className="mt-1 text-[15px] font-semibold text-foreground">
                {formatCents(quote.depositCents)}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                Die Anzahlung wird vollständig auf den Gesamtpreis angerechnet.
                {quote.mode === 'pruefung'
                  ? ' Verbindlich wird der Termin, sobald wir Ihre Unterlagen geprüft und Ihnen den Preis genannt haben.'
                  : ''}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {redirectUrl && (
        <ButtonLink href={redirectUrl} size="lg">
          Anzahlung jetzt bezahlen
        </ButtonLink>
      )}

      {notices.length > 0 && (
        <Alert tone="info" title="Was Sie noch wissen sollten">
          <ul className="space-y-1.5">
            {notices.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </Alert>
      )}

      <div>
        <h3 className="text-[15px] font-bold text-foreground">Das haben Sie uns übermittelt</h3>
        <SummaryList sections={summary} className="mt-3" />
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
        <ButtonLink href="/service-und-termin/terminstatus" variant="outline">
          Stand des Vorgangs abrufen
        </ButtonLink>
        <ButtonLink href="/autoschluessel" variant="ghost">
          Zurück zum Bereich Autoschlüssel
        </ButtonLink>
      </div>

      <p className="text-[13px] leading-relaxed text-foreground-muted">
        Stimmt etwas nicht?{' '}
        <Link href="/service-und-termin/kontakt" className="font-semibold text-primary hover:underline">
          Melden Sie sich bei uns
        </Link>{' '}
        und nennen Sie Ihre Vorgangsnummer.
      </p>
    </div>
  );
}
