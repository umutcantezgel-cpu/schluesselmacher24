'use client';

import type { PriceQuote } from '@/lib/types';
import { formatCents, formatDuration } from '@/lib/format';
import { InfoTip } from '@/components/ui/info-tip';
import { IconFahrzeugmarke } from '@/components/visual/icons/fahrzeugmarke';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphUhr } from '@/components/visual/glyphen/uhr';

export interface PreisAnzeigeProps {
  quote: PriceQuote;
  /** Leistung beim Fahrzeug des Kunden (Fahrzeugöffnung): Das Fahrzeug kommt nicht in die Werkstatt. */
  beimKunden?: boolean;
}

/** Eine Zeile der bemaßten Liste: Bezeichnung links, Zahl rechts in Mono. */
function Zeile({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  // Werte mit Ziffern sind Zahlen und stehen in Mono; Platzhaltertexte bleiben in der Schrift des Fließtextes.
  const zahl = /\d/.test(value);
  const wert = zahl
    ? strong
      ? 'font-mono text-headline tabular-nums text-foreground'
      : 'font-mono text-title-sm font-semibold tabular-nums text-foreground'
    : strong
      ? 'text-title-sm font-bold text-foreground'
      : 'text-title-sm font-semibold text-foreground';

  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 py-2.5">
      <dt className={strong ? 'text-body font-bold text-foreground' : 'text-small text-foreground-muted'}>
        {label}
      </dt>
      <dd className={wert}>{value}</dd>
    </div>
  );
}

/**
 * Stellt das Ergebnis der Preisermittlung dar.
 * Die drei Fälle fester Preis, Preisrahmen und manuelle Prüfung werden
 * bewusst unterschiedlich dargestellt, damit keine Zusage entsteht,
 * die noch nicht belastbar ist.
 */
export function PreisAnzeige({ quote, beimKunden = false }: PreisAnzeigeProps) {
  return (
    <div className="space-y-4">
      {quote.mode === 'fest' && quote.priceCents !== undefined && (
        <div className="rounded-lg border border-border bg-surface px-5 py-4 md:px-6 md:py-5">
          <p className="font-mono text-caption uppercase tracking-label text-primary">
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
          <p className="mt-3 text-small leading-relaxed text-foreground-muted">
            Der Gesamtpreis gilt für die gewählte Leistung und die von Ihnen angegebene
            Fahrzeug- und Schlüsselart. Ergibt die Sichtung Ihrer Fotos einen anderen Fall,
            sprechen wir Sie vor der Ausführung an.
          </p>
        </div>
      )}

      {quote.mode === 'rahmen' && (
        <div className="rounded-lg border border-border bg-surface px-5 py-4 md:px-6 md:py-5">
          <p className="font-mono text-caption uppercase tracking-label text-primary">
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
          <p className="mt-3 text-small leading-relaxed text-foreground-muted">
            Ein Preisrahmen bedeutet: Der endgültige Betrag hängt davon ab, welcher Schlüssel
            tatsächlich verbaut ist und wie aufwendig das Anlernen ausfällt. Den genauen Preis
            nennen wir Ihnen nach Sichtung Ihrer Unterlagen — vor der Ausführung.
          </p>
        </div>
      )}

      {quote.mode === 'pruefung' && (
        <div className="rounded-lg border border-border bg-surface px-5 py-4 md:px-6 md:py-5">
          <p className="text-title-sm font-semibold text-foreground">
            Ihr Fall wird vor der verbindlichen Buchung geprüft
          </p>
          <p className="mt-2 text-small leading-relaxed text-foreground-muted">
            Für diese Kombination aus Fahrzeug, Schlüsselart und Leistung nennen wir keinen Preis
            ohne vorherige Prüfung. Sie können den Termin vormerken lassen; verbindlich wird er erst,
            wenn wir Ihre Unterlagen geprüft und Ihnen den Preis genannt haben.
          </p>
          <p className="mt-2 text-small leading-relaxed text-foreground-muted">
            Eine Anzahlung von {formatCents(quote.depositCents)} sichert Ihnen den Platz im
            Terminplan und wird vollständig auf den späteren Gesamtpreis angerechnet.
          </p>
        </div>
      )}

      {quote.note && (
        <div role="note" className="flex items-start gap-2 text-small leading-relaxed text-foreground-muted">
          <GlyphInfo size={16} className="mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-foreground">Hinweis zu Ihrem Fall</p>
            <p className="mt-1">{quote.note}</p>
          </div>
        </div>
      )}

      {/* Schriftfeld mit Haarlinien statt getönter Kästen (Sichtabnahme E4-L-23, H04 Preisschritt) */}
      <dl className="grid border-y border-border sm:grid-cols-2">
        <div className="py-4 sm:pr-gutter">
          <dt className="flex items-center gap-2 font-mono text-caption uppercase tracking-label text-foreground">
            <GlyphUhr size={18} className="shrink-0 text-foreground-subtle" />
            Eingeplante Terminlänge
          </dt>
          <dd className="mt-2 text-small leading-relaxed text-foreground-muted">
            <span className="font-mono tabular-nums text-foreground">{formatDuration(quote.slotMinutes)}</span>{' '}
            — so viel Zeit reservieren wir für Ihren Vorgang.
          </dd>
        </div>

        <div className="border-t border-border py-4 sm:border-l sm:border-t-0 sm:pl-gutter">
          <dt className="flex items-center gap-2 font-mono text-caption uppercase tracking-label text-foreground">
            <IconFahrzeugmarke size={24} className="shrink-0 text-area-strong" />
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
          </dt>
          <dd className="mt-2 text-small leading-relaxed text-foreground-muted">
            {beimKunden
              ? 'Die Leistung findet bei Ihrem Fahrzeug statt. Ort und Anfahrt klären wir telefonisch mit Ihnen.'
              : quote.requiresVehicleOnSite
                ? 'Wird benötigt. Bitte bringen Sie Ihr Fahrzeug zum Termin in unsere Werkstatt mit.'
                : 'Wird für diese Leistung nicht zwingend benötigt.'}
          </dd>
        </div>
      </dl>

      <p className="flex items-start gap-2 text-small leading-relaxed text-foreground-subtle">
        <GlyphInfo size={16} className="mt-0.5 shrink-0" />
        Alle Beträge verstehen sich als Endpreise einschließlich Umsatzsteuer.
      </p>
    </div>
  );
}
