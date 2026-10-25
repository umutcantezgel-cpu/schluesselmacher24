'use client';

import Link from 'next/link';
import type { AppointmentInfo, CompanyLocation, PriceQuote, SummarySection } from '@/lib/types';
import { formatCents, formatDate, formatDuration, formatTime } from '@/lib/format';
import { terminOrtText } from '@/lib/terminort';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { SummaryList } from '@/components/layout/summary-list';
import { CheckDraw } from '@/components/visual/motion/check-draw';
import { GlyphKalender } from '@/components/visual/glyphen/kalender';
import { IconZahlung } from '@/components/visual/icons/zahlung';

export interface BestaetigungProps {
  reference: string;
  appointment: AppointmentInfo;
  quote: PriceQuote;
  summary: SummarySection[];
  notices: string[];
  /** Zahlungsseite des Anbieters, sobald einer angebunden ist. */
  redirectUrl?: string;
  /** Bei offener Online-Zahlung: bis wann der Termin reserviert ist (ISO). */
  reserviertBis?: string;
  /** Werkstatt, in der der Termin stattfindet. */
  werkstatt?: CompanyLocation;
}

/** Abschlussansicht nach erfolgreichem Absenden. */
export function Bestaetigung({
  reference,
  appointment,
  quote,
  summary,
  notices,
  redirectUrl,
  reserviertBis,
  werkstatt,
}: BestaetigungProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-surface p-6">
        <CheckDraw title="Vorgang angelegt" size={56} />
        <p className="mt-4 font-mono text-caption uppercase tracking-label text-success">
          Vorgang angelegt
        </p>
        <h2 className="mt-2 text-headline text-foreground">
          Ihre Anfrage ist bei uns eingegangen
        </h2>

        <div className="mt-5 rounded-lg border border-border bg-surface-muted p-5">
          <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
            Ihre Vorgangsnummer
          </p>
          <p className="mt-1 break-words font-mono text-headline tabular-nums text-foreground">
            {reference}
          </p>
          <p className="mt-2 text-small leading-relaxed text-foreground-muted">
            Bitte bewahren Sie diese Nummer auf. Zusammen mit Ihrer E-Mail-Adresse rufen Sie damit
            jederzeit den Stand Ihres Vorgangs ab.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardBody className="flex items-start gap-3">
            <GlyphKalender size={18} className="mt-0.5 shrink-0 text-foreground-subtle" />
            <div>
              <p className="font-mono text-caption uppercase tracking-label text-foreground">Ihr Termin</p>
              <p className="mt-1 font-mono text-title-sm font-semibold tabular-nums text-foreground">
                {formatDate(appointment.date)}, {appointment.time} Uhr
              </p>
              <p className="mt-1 text-small leading-relaxed text-foreground-muted">
                Eingeplant sind{' '}
                <span className="font-mono tabular-nums text-foreground">{formatDuration(appointment.durationMinutes)}</span>.
                {' '}
                {terminOrtText(appointment, { mitFahrzeug: quote.requiresVehicleOnSite, werkstatt })}.
                {appointment.location === 'werkstatt' && quote.requiresVehicleOnSite
                  ? ' Bitte bringen Sie Ihr Fahrzeug zum Termin mit.'
                  : ''}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-start gap-3">
            <IconZahlung size={24} className="mt-0.5 shrink-0 text-area-strong" />
            <div>
              <p className="font-mono text-caption uppercase tracking-label text-foreground">Anzahlung</p>
              <p className="mt-1 font-mono text-title-sm font-semibold tabular-nums text-foreground">
                {formatCents(quote.depositCents)}
              </p>
              <p className="mt-1 text-small leading-relaxed text-foreground-muted">
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
        <div className="space-y-3">
          <Alert tone="warning" title={reserviertBis ? `Reserviert bis ${formatTime(reserviertBis)} Uhr` : 'Anzahlung offen'} role="status">
            Sie werden zur sicheren Zahlungsseite weitergeleitet. Geht die Anzahlung bis dahin nicht ein, geben wir das
            Zeitfenster wieder frei.
          </Alert>
          <ButtonLink href={redirectUrl} size="lg">
            Anzahlung jetzt bezahlen
          </ButtonLink>
        </div>
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
        <h3 className="text-title-sm font-semibold text-foreground">Das haben Sie uns übermittelt</h3>
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

      <p className="text-small leading-relaxed text-foreground-muted">
        Stimmt etwas nicht?{' '}
        <Link
          href="/service-und-termin/kontakt"
          className="rounded-sm font-semibold text-primary hover:underline"
        >
          Melden Sie sich bei uns
        </Link>{' '}
        und nennen Sie Ihre Vorgangsnummer.
      </p>
    </div>
  );
}
