import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';

import { getRecord } from '@/lib/data';
import { verifyAccessToken } from '@/lib/server/access-token';
import { mailStatus, storageStatus } from '@/lib/integrations';
import { formatCents, formatDate, formatDateTime, formatDuration } from '@/lib/format';
import type { OrderLine, OrderTotals, PaymentInfo, RecordKind, RecordStatus, SummarySection } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/page-header';
import { SummaryList } from '@/components/layout/summary-list';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

interface BestellungSeiteProps {
  params: Promise<{ id: string }>;
  /** `t` ist der geheime Link-Schlüssel aus der Bestätigung. */
  searchParams: Promise<{ t?: string | string[] }>;
}

type Tonfall = 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'outline';

const KIND_LABELS: Record<RecordKind, string> = {
  bestellung: 'Bestellung',
  anfrage: 'Anfrage',
  termin: 'Termin',
  projekt: 'Projekt',
};

const STATUS_LABELS: Record<RecordStatus, string> = {
  neu: 'Eingegangen',
  'in-pruefung': 'In Prüfung',
  geprueft: 'Geprüft',
  'wartet-auf-kunde': 'Wartet auf Ihre Rückmeldung',
  'in-fertigung': 'In Fertigung',
  terminiert: 'Termin vereinbart',
  versendet: 'Versendet',
  abgeschlossen: 'Abgeschlossen',
  storniert: 'Storniert',
};

const STATUS_TONE: Record<RecordStatus, Tonfall> = {
  neu: 'primary',
  'in-pruefung': 'primary',
  geprueft: 'accent',
  'wartet-auf-kunde': 'warning',
  'in-fertigung': 'accent',
  terminiert: 'accent',
  versendet: 'success',
  abgeschlossen: 'success',
  storniert: 'danger',
};

const PAYMENT_LABELS: Record<PaymentInfo['status'], string> = {
  offen: 'Offen',
  bezahlt: 'Bezahlt',
  fehlgeschlagen: 'Fehlgeschlagen',
  erstattet: 'Erstattet',
};

const PAYMENT_TONE: Record<PaymentInfo['status'], Tonfall> = {
  offen: 'warning',
  bezahlt: 'success',
  fehlgeschlagen: 'danger',
  erstattet: 'neutral',
};

const PAYMENT_SCOPE_LABELS: Record<PaymentInfo['scope'], string> = {
  anzahlung: 'Anzahlung',
  gesamt: 'Gesamtbetrag',
};

export const metadata: Metadata = {
  // Ohne Vorgangsnummer im Titel: Tab-Titel landen in Verläufen und Freigaben.
  title: 'Bestätigung',
  description:
    'Bestätigung Ihres Vorgangs mit Vorgangsnummer, Status, Zahlungsstatus und Zusammenfassung.',
  // Vorgangsdaten sind persönlich und gehören nicht in den Suchindex.
  robots: { index: false, follow: false },
  // Der Link-Schlüssel steht in der Adresse und darf nicht an andere Seiten gehen.
  referrer: 'no-referrer',
};

/** Beim Bestellen festgeschriebene Positionen — unabhängig von späteren Preisänderungen. */
function BestelltePositionen({ lines, totals }: { lines: OrderLine[]; totals?: OrderTotals }) {
  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-title font-semibold text-foreground">Bestellte Artikel</h2>

      <ul className="mt-6 divide-y divide-border border-y border-border">
        {lines.map((line, index) => (
          <li key={`${line.productId}-${index}`} className="py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-body font-semibold text-foreground">{line.label}</p>
              <p className="font-mono text-body font-semibold tabular-nums text-foreground">{formatCents(line.totalCents)}</p>
            </div>
            {line.details && (
              <p className="mt-1 whitespace-pre-line text-small leading-relaxed text-foreground-muted">
                {line.details}
              </p>
            )}
            <p className="mt-1 text-small text-foreground-muted"><span className="font-mono tabular-nums">{line.qty}</span> Stück zu je <span className="font-mono tabular-nums">{formatCents(line.unitPriceCents)}</span> · inkl. <span className="font-mono tabular-nums">{line.vatPercent}</span> % USt.</p>
          </li>
        ))}
      </ul>

      {totals && (
        <dl className="mt-6 space-y-3 text-small">
          <div className="flex flex-wrap justify-between gap-4">
            <dt className="text-foreground-muted">Artikel</dt>
            <dd className="font-mono tabular-nums text-foreground">{formatCents(totals.itemsCents)}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-4">
            <dt className="text-foreground-muted">
              Versand{totals.shippingLabel ? ` · ${totals.shippingLabel}` : ''}
            </dt>
            <dd className="font-mono tabular-nums text-foreground">{formatCents(totals.shippingCents)}</dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-border pt-4">
            <dt className="text-body font-semibold text-foreground">Gesamtbetrag</dt>
            <dd className="font-mono text-title-sm font-semibold tabular-nums text-foreground">{formatCents(totals.totalCents)}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-4">
            <dt className="text-foreground-muted">Enthaltene Umsatzsteuer</dt>
            <dd className="font-mono tabular-nums text-foreground">{formatCents(totals.vatCents)}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}

async function loadAuthorisedRecord(props: BestellungSeiteProps) {
  const [{ id }, { t }] = await Promise.all([props.params, props.searchParams]);
  const token = Array.isArray(t) ? t[0] : t;
  const record = await getRecord(id);
  // Unbekannter Vorgang und falscher Schlüssel sehen gleich aus — so lässt
  // sich nicht herausfinden, welche Nummern existieren.
  if (!record || !verifyAccessToken(token, record.accessTokenHash)) return null;
  return record;
}

export default async function BestellungSeite(props: BestellungSeiteProps) {
  // Persönliche Daten: immer zur Anfragezeit rendern, nie aus einem Seiten-Cache.
  await connection();
  const record = await loadAuthorisedRecord(props);

  if (!record) notFound();

  const kindLabel = KIND_LABELS[record.kind];

  // Dieselben Hinweise, die beim Absenden zurückgegeben werden — sie ergeben
  // sich aus den noch nicht angebundenen Diensten.
  const hinweise: string[] = [];
  if (!mailStatus().configured) {
    hinweise.push(
      'Eine automatische Bestätigung per E-Mail ist noch nicht eingerichtet. '
      + 'Notieren Sie sich bitte Ihre Vorgangsnummer.',
    );
  }
  if (record.uploads.length > 0 && !storageStatus().configured) {
    hinweise.push(
      'Ihre Dateien konnten noch nicht dauerhaft gespeichert werden. Wir melden uns, '
      + 'falls wir sie erneut benötigen.',
    );
  }

  const anschrift: SummarySection['rows'] = [
    {
      label: 'Name',
      value: [record.contact.salutation, record.contact.firstName, record.contact.lastName]
        .filter(Boolean)
        .join(' '),
    },
  ];
  if (record.contact.company) {
    anschrift.push({ label: 'Firma', value: record.contact.company });
  }
  anschrift.push(
    { label: 'E-Mail', value: record.contact.email },
    { label: 'Telefon', value: record.contact.phone },
  );
  if (record.contact.street) {
    anschrift.push({ label: 'Straße', value: record.contact.street });
  }
  if (record.contact.postalCode || record.contact.city) {
    anschrift.push({
      label: 'PLZ und Ort',
      value: [record.contact.postalCode, record.contact.city].filter(Boolean).join(' '),
    });
  }
  anschrift.push({ label: 'Land', value: record.contact.country });

  // Bei Bestellungen fasst die Zusammenfassung nur Artikel und Summen zusammen —
  // die festgeschriebenen Positionen ersetzen sie, sofern vorhanden.
  const positionen = record.kind === 'bestellung' && record.lines?.length ? record.lines : null;
  const angaben = positionen ? [] : record.summary;

  const abschnitte: SummarySection[] = [...angaben, { title: 'Kontakt und Lieferanschrift', rows: anschrift }];

  if (record.appointment) {
    abschnitte.push({
      title: 'Termin',
      rows: [
        { label: 'Datum', value: formatDate(record.appointment.date) },
        { label: 'Uhrzeit', value: `${record.appointment.time} Uhr` },
        { label: 'Dauer', value: formatDuration(record.appointment.durationMinutes) },
        {
          label: 'Ort',
          value: record.appointment.location === 'werkstatt' ? 'In der Werkstatt' : 'Vor Ort bei Ihnen',
        },
      ],
    });
  }

  return (
    <>
      <PageHeader
        art="arbeit"
        eyebrow="Direkt kaufen"
        title={`${kindLabel} eingegangen`}
        lead="Wir haben Ihren Vorgang aufgenommen. Bitte bewahren Sie die Vorgangsnummer auf — damit finden Sie den Stand jederzeit wieder."
        crumbs={[{ href: `/bestellung/${record.id}`, label: `${kindLabel} ${record.reference}` }]}
      />

      <div className="shell py-8 md:py-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <div className="space-y-12 lg:col-span-7">
            {/* 01 Vorgangsnummer und Stand */}
            <section className="border-t border-border pt-8">
              <p className="eyebrow"><span className="tabular-nums text-foreground-muted">01</span></p>
              <h2 className="mt-1 text-title font-semibold text-foreground">Ihre Vorgangsnummer</h2>
              <p className="mt-4 select-all break-all font-mono text-headline font-bold tabular-nums text-foreground">
                {record.reference}
              </p>
              <p className="mt-3 text-small leading-relaxed text-foreground-muted">
                Ein Klick auf die Nummer markiert sie vollständig — danach können Sie sie
                kopieren. Eingegangen am {formatDateTime(record.createdAt)}.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone={STATUS_TONE[record.status]}>
                  Status: {STATUS_LABELS[record.status]}
                </Badge>
                {record.payment && (
                  <Badge tone={PAYMENT_TONE[record.payment.status]}>
                    Zahlung: {PAYMENT_LABELS[record.payment.status]}
                  </Badge>
                )}
              </div>
            </section>

            {hinweise.length > 0 && (
              <Alert tone="info" title="Bitte beachten">
                <ul className="list-disc space-y-1 pl-4">
                  {hinweise.map((hinweis) => (
                    <li key={hinweis}>{hinweis}</li>
                  ))}
                </ul>
              </Alert>
            )}

            {positionen && <BestelltePositionen lines={positionen} totals={record.totals} />}

            {/* Zahlung */}
            {record.payment && (
              <section className="border-t border-border pt-8">
                <h2 className="text-title font-semibold text-foreground">Zahlung</h2>

                <dl className="mt-6 divide-y divide-border border-y border-border text-small">
                  <div className="flex flex-wrap items-baseline justify-between gap-4 py-3">
                    <dt className="text-foreground-muted">
                      {PAYMENT_SCOPE_LABELS[record.payment.scope]}
                    </dt>
                    <dd className="font-mono text-body font-semibold tabular-nums text-foreground">
                      {formatCents(record.payment.amountCents)}
                    </dd>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-4 py-3">
                    <dt className="text-foreground-muted">Zahlungsstatus</dt>
                    <dd className="font-semibold text-foreground">
                      {PAYMENT_LABELS[record.payment.status]}
                    </dd>
                  </div>
                  {record.payment.paidAt && (
                    <div className="flex flex-wrap items-baseline justify-between gap-4 py-3">
                      <dt className="text-foreground-muted">Bezahlt am</dt>
                      <dd className="font-semibold text-foreground">
                        {formatDateTime(record.payment.paidAt)}
                      </dd>
                    </div>
                  )}
                </dl>

                {record.payment.status === 'offen' && (
                  <div className="mt-6">
                    <Alert tone="info" title="Zahlung noch offen">
                      Ihr Vorgang ist gespeichert. Wir melden uns mit den Zahlungsinformationen
                      zu dieser Vorgangsnummer.
                    </Alert>
                  </div>
                )}
              </section>
            )}

            {/* 02 Angaben */}
            <section className="border-t border-border pt-8">
              <p className="eyebrow"><span className="tabular-nums text-foreground-muted">02</span></p>
              <h2 className="mt-1 text-title font-semibold text-foreground">Ihre Angaben</h2>
              <div className="mt-6">
                <SummaryList sections={abschnitte} variante="schriftfeld" hervorheben="Gesamtbetrag" />
              </div>
            </section>
          </div>

          {/* Nächste Schritte und Fragen: Seitenleiste mit Haarlinien */}
          <aside className="space-y-12 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <section className="border-t border-border pt-8">
              <h2 className="text-title-sm font-semibold text-foreground">Wie es weitergeht</h2>

              <ol className="mt-6 divide-y divide-border border-y border-border">
                <li className="py-4">
                  <p className="text-body font-semibold text-foreground">1. Prüfung Ihrer Angaben</p>
                  <p className="mt-1 text-small leading-relaxed text-foreground-muted">
                    Wir prüfen Code, Maße und Zusammenstellung, bevor etwas gefertigt wird.
                  </p>
                </li>
                <li className="py-4">
                  <p className="text-body font-semibold text-foreground">2. Zahlung</p>
                  <p className="mt-1 text-small leading-relaxed text-foreground-muted">
                    Solange der Zahlungsstatus offen ist, erhalten Sie von uns die
                    Zahlungsinformationen zu Ihrer Vorgangsnummer.
                  </p>
                </li>
                <li className="py-4">
                  <p className="text-body font-semibold text-foreground">3. Fertigung und Versand</p>
                  <p className="mt-1 text-small leading-relaxed text-foreground-muted">
                    Danach fertigen wir Ihre Bestellung und versenden sie auf dem von Ihnen
                    gewählten Weg. Sie werden über jeden Schritt informiert.
                  </p>
                </li>
              </ol>

              <div className="mt-6">
                <p className="text-small leading-relaxed text-foreground-muted">
                  Den aktuellen Stand rufen Sie jederzeit mit Ihrer Vorgangsnummer ab.
                </p>
                <Link
                  href="/service-und-termin/terminstatus"
                  className="mt-3 inline-flex min-h-touch items-center gap-1.5 text-small font-semibold text-primary hover:underline"
                >
                  Stand des Vorgangs abrufen
                  <GlyphPfeilRechts size={18} />
                </Link>
              </div>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="text-title-sm font-semibold text-foreground">Fragen zur Bestellung?</h2>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {[
                  { href: '/service-und-termin/kontakt', label: 'Kontakt aufnehmen' },
                  { href: '/rechtliches/versand-und-zahlung', label: 'Zahlung und Versand' },
                  { href: '/rechtliches/widerruf', label: 'Widerruf und Rückgabe' },
                  { href: '/rechtliches/agb', label: 'AGB' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex min-h-touch items-center justify-between gap-4 py-3 text-small font-semibold text-foreground transition-colors duration-quick hover:text-primary"
                    >
                      {link.label}
                      <GlyphPfeilRechts
                        size={18}
                        className="shrink-0 text-primary transition-transform duration-quick group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
