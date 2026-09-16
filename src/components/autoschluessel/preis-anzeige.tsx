'use client';

import { Car, Clock, Info } from 'lucide-react';
import type { PriceQuote } from '@/lib/types';
import { formatCents, formatDuration } from '@/lib/format';
import { Alert } from '@/components/ui/alert';
import { Card, CardBody } from '@/components/ui/card';
import { InfoTip } from '@/components/ui/info-tip';

export interface PreisAnzeigeProps {
  quote: PriceQuote;
}

function Zeile({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 py-2.5">
      <dt className={strong ? 'text-[15px] font-bold text-foreground' : 'text-[14px] text-foreground-muted'}>
        {label}
      </dt>
      <dd
        className={
          strong
            ? 'font-display text-lg font-bold text-foreground'
            : 'text-[15px] font-semibold text-foreground'
        }
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * Stellt das Ergebnis der Preisermittlung dar.
 * Die drei Fälle fester Preis, Preisrahmen und manuelle Prüfung werden
 * bewusst unterschiedlich dargestellt, damit keine Zusage entsteht,
 * die noch nicht belastbar ist.
 */
export function PreisAnzeige({ quote }: PreisAnzeigeProps) {
  return (
    <div className="space-y-4">
      {quote.mode === 'fest' && quote.priceCents !== undefined && (
        <Card>
          <CardBody>
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Fester Preis für Ihre Angaben
            </p>
            <dl className="mt-3 divide-y divide-border">
              <Zeile label="Gesamtpreis" value={formatCents(quote.priceCents)} strong />
              <Zeile label="Davon jetzt als Anzahlung" value={formatCents(quote.depositCents)} />
              <Zeile
                label="Restbetrag beim Termin"
                value={formatCents(quote.remainderCents ?? Math.max(0, quote.priceCents - quote.depositCents))}
              />
            </dl>
            <p className="mt-3 text-[13px] leading-relaxed text-foreground-muted">
              Der Gesamtpreis gilt für die gewählte Leistung und die von Ihnen angegebene
              Fahrzeug- und Schlüsselart. Ergibt die Sichtung Ihrer Fotos einen anderen Fall,
              sprechen wir Sie vor der Ausführung an.
            </p>
          </CardBody>
        </Card>
      )}

      {quote.mode === 'rahmen' && (
        <Card>
          <CardBody>
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Preisrahmen für Ihre Angaben
            </p>
            <dl className="mt-3 divide-y divide-border">
              <Zeile
                label={quote.priceToCents ? 'Von — bis' : 'Voraussichtlich ab'}
                value={
                  quote.priceFromCents === undefined
                    ? 'wird nach Prüfung genannt'
                    : quote.priceToCents
                      ? `${formatCents(quote.priceFromCents)} — ${formatCents(quote.priceToCents)}`
                      : `ab ${formatCents(quote.priceFromCents)}`
                }
                strong
              />
              <Zeile label="Anzahlung jetzt" value={formatCents(quote.depositCents)} />
            </dl>
            <p className="mt-3 text-[13px] leading-relaxed text-foreground-muted">
              Ein Preisrahmen bedeutet: Der endgültige Betrag hängt davon ab, welcher Schlüssel
              tatsächlich verbaut ist und wie aufwendig das Anlernen ausfällt. Den genauen Preis
              nennen wir Ihnen nach Sichtung Ihrer Unterlagen — vor der Ausführung.
            </p>
          </CardBody>
        </Card>
      )}

      {quote.mode === 'pruefung' && (
        <Alert tone="warning" title="Ihr Fall wird vor der verbindlichen Buchung geprüft">
          <p>
            Für diese Kombination aus Fahrzeug, Schlüsselart und Leistung nennen wir keinen Preis
            ohne vorherige Prüfung. Sie können den Termin vormerken lassen; verbindlich wird er erst,
            wenn wir Ihre Unterlagen geprüft und Ihnen den Preis genannt haben.
          </p>
          <p className="mt-2">
            Eine Anzahlung von {formatCents(quote.depositCents)} sichert Ihnen den Platz im
            Terminplan und wird vollständig auf den späteren Gesamtpreis angerechnet.
          </p>
        </Alert>
      )}

      {quote.note && (
        <Alert tone="info" title="Hinweis zu Ihrem Fall">
          {quote.note}
        </Alert>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Card variant="muted">
          <CardBody className="flex items-start gap-3">
            <Clock size={18} className="mt-0.5 shrink-0 text-foreground-subtle" aria-hidden />
            <div>
              <p className="text-[14px] font-bold text-foreground">Eingeplante Terminlänge</p>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                {formatDuration(quote.slotMinutes)} — so viel Zeit reservieren wir für Ihren Vorgang.
              </p>
            </div>
          </CardBody>
        </Card>

        <Card variant="muted">
          <CardBody className="flex items-start gap-3">
            <Car size={18} className="mt-0.5 shrink-0 text-foreground-subtle" aria-hidden />
            <div>
              <p className="flex items-center gap-2 text-[14px] font-bold text-foreground">
                Fahrzeug beim Termin
                <InfoTip
                  hint={{
                    title: 'Warum das Fahrzeug gebraucht wird',
                    body:
                      'Elektronische Schlüssel werden am Fahrzeug angelernt. Ohne Zugriff auf das '
                      + 'Fahrzeug lässt sich dieser Schritt nicht ausführen. Rein mechanische '
                      + 'Arbeiten sind davon nicht betroffen.',
                  }}
                />
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                {quote.requiresVehicleOnSite
                  ? 'Wird benötigt. Der Termin wird als Vor-Ort-Termin mit Fahrzeug geführt.'
                  : 'Wird für diese Leistung nicht zwingend benötigt.'}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      <p className="flex items-start gap-2 text-[13px] leading-relaxed text-foreground-subtle">
        <Info size={15} className="mt-0.5 shrink-0" aria-hidden />
        Alle Beträge verstehen sich als Endpreise einschließlich Umsatzsteuer.
      </p>
    </div>
  );
}
