import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { ArrowRight } from 'lucide-react';

import { getRecord } from '@/lib/data';
import { verifyAccessToken } from '@/lib/server/access-token';
import { mailStatus, storageStatus } from '@/lib/integrations';
import { formatCents, formatDate, formatDateTime, formatDuration } from '@/lib/format';
import type { PaymentInfo, RecordKind, RecordStatus, SummarySection } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { SummaryList } from '@/components/layout/summary-list';

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

  const abschnitte: SummarySection[] = [...record.summary, { title: 'Kontakt und Lieferanschrift', rows: anschrift }];

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
        eyebrow="Direkt kaufen"
        title={`${kindLabel} eingegangen`}
        lead="Wir haben Ihren Vorgang aufgenommen. Bitte bewahren Sie die Vorgangsnummer auf — damit finden Sie den Stand jederzeit wieder."
        crumbs={[{ href: `/bestellung/${record.id}`, label: `${kindLabel} ${record.reference}` }]}
      />

      <div className="shell py-8 md:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start lg:gap-8">
          <div className="space-y-6">
            {/* Vorgangsnummer */}
            <Card>
              <CardBody>
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-foreground-subtle">
                  Ihre Vorgangsnummer
                </h2>
                <p className="mt-2 select-all break-all font-mono text-2xl font-bold text-foreground md:text-3xl">
                  {record.reference}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
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
              </CardBody>
            </Card>

            {hinweise.length > 0 && (
              <Alert tone="info" title="Bitte beachten">
                <ul className="list-disc space-y-1 pl-4">
                  {hinweise.map((hinweis) => (
                    <li key={hinweis}>{hinweis}</li>
                  ))}
                </ul>
              </Alert>
            )}

            {/* Zahlung */}
            {record.payment && (
              <Card>
                <CardHeader>
                  <h2 className="text-[15px] font-bold text-foreground">Zahlung</h2>
                </CardHeader>
                <CardBody>
                  <dl className="space-y-2 text-[14px]">
                    <div className="flex flex-wrap justify-between gap-4">
                      <dt className="text-foreground-muted">
                        {PAYMENT_SCOPE_LABELS[record.payment.scope]}
                      </dt>
                      <dd className="font-semibold text-foreground">
                        {formatCents(record.payment.amountCents)}
                      </dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-4">
                      <dt className="text-foreground-muted">Zahlungsstatus</dt>
                      <dd className="font-semibold text-foreground">
                        {PAYMENT_LABELS[record.payment.status]}
                      </dd>
                    </div>
                    {record.payment.paidAt && (
                      <div className="flex flex-wrap justify-between gap-4">
                        <dt className="text-foreground-muted">Bezahlt am</dt>
                        <dd className="font-semibold text-foreground">
                          {formatDateTime(record.payment.paidAt)}
                        </dd>
                      </div>
                    )}
                  </dl>

                  {record.payment.status === 'offen' && (
                    <div className="mt-4">
                      <Alert tone="info" title="Zahlung noch offen">
                        Ihr Vorgang ist gespeichert. Wir melden uns mit den Zahlungsinformationen
                        zu dieser Vorgangsnummer.
                      </Alert>
                    </div>
                  )}
                </CardBody>
              </Card>
            )}

            {/* Zusammenfassung */}
            <section>
              <h2 className="text-lg font-bold text-foreground">Ihre Angaben</h2>
              <div className="mt-4">
                <SummaryList sections={abschnitte} />
              </div>
            </section>
          </div>

          {/* Nächste Schritte */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card>
              <CardHeader>
                <h2 className="text-[15px] font-bold text-foreground">Wie es weitergeht</h2>
              </CardHeader>
              <CardBody>
                <ol className="space-y-4">
                  <li>
                    <p className="text-[14px] font-bold text-foreground">1. Prüfung Ihrer Angaben</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                      Wir prüfen Code, Maße und Zusammenstellung, bevor etwas gefertigt wird.
                    </p>
                  </li>
                  <li>
                    <p className="text-[14px] font-bold text-foreground">2. Zahlung</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                      Solange der Zahlungsstatus offen ist, erhalten Sie von uns die
                      Zahlungsinformationen zu Ihrer Vorgangsnummer.
                    </p>
                  </li>
                  <li>
                    <p className="text-[14px] font-bold text-foreground">3. Fertigung und Versand</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                      Danach fertigen wir Ihre Bestellung und versenden sie auf dem von Ihnen
                      gewählten Weg. Sie werden über jeden Schritt informiert.
                    </p>
                  </li>
                </ol>

                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-[13px] leading-relaxed text-foreground-muted">
                    Den aktuellen Stand rufen Sie jederzeit mit Ihrer Vorgangsnummer ab.
                  </p>
                  <Link
                    href="/service-und-termin/terminstatus"
                    className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                  >
                    Stand des Vorgangs abrufen
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                </div>
              </CardBody>
            </Card>

            <Card variant="muted">
              <CardBody>
                <h2 className="text-[15px] font-bold text-foreground">Fragen zur Bestellung?</h2>
                <ul className="mt-3 space-y-2">
                  {[
                    { href: '/service-und-termin/kontakt', label: 'Kontakt aufnehmen' },
                    { href: '/rechtliches/versand-und-zahlung', label: 'Zahlung und Versand' },
                    { href: '/rechtliches/widerruf', label: 'Widerruf und Rückgabe' },
                    { href: '/rechtliches/agb', label: 'AGB' },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                      >
                        {link.label}
                        <ArrowRight size={15} aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
