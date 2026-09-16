import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Paperclip } from 'lucide-react';

import { getRecord } from '@/lib/data';
import {
  formatCents,
  formatDate,
  formatDateTime,
  formatDuration,
  formatFileSize,
} from '@/lib/format';
import { areaByKey, PROCESS_LABELS } from '@/lib/navigation';
import type {
  AppointmentInfo,
  BusinessRecord,
  PaymentInfo,
  PriceQuote,
  RecordKind,
  RecordStatus,
  TimelineEntry,
  UploadRef,
} from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { SummaryList } from '@/components/layout/summary-list';
import { DruckKnopf, VorgangsAktionen } from './vorgangs-aktionen';

type Tonfall = 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'outline';

const ART_LABELS: Record<RecordKind, string> = {
  bestellung: 'Bestellung',
  anfrage: 'Anfrage',
  termin: 'Termin',
  projekt: 'Projekt',
};

const STATUS_LABELS: Record<RecordStatus, string> = {
  neu: 'Eingegangen',
  'in-pruefung': 'In Prüfung',
  geprueft: 'Geprüft',
  'wartet-auf-kunde': 'Wartet auf Kundin oder Kunde',
  'in-fertigung': 'In Fertigung',
  terminiert: 'Termin vereinbart',
  versendet: 'Versendet',
  abgeschlossen: 'Abgeschlossen',
  storniert: 'Storniert',
};

const STATUS_TON: Record<RecordStatus, Tonfall> = {
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

const ZAHLUNG_LABELS: Record<PaymentInfo['status'], string> = {
  offen: 'Offen',
  bezahlt: 'Bezahlt',
  fehlgeschlagen: 'Fehlgeschlagen',
  erstattet: 'Erstattet',
};

const ZAHLUNG_TON: Record<PaymentInfo['status'], Tonfall> = {
  offen: 'warning',
  bezahlt: 'success',
  fehlgeschlagen: 'danger',
  erstattet: 'neutral',
};

const ZAHLUNG_UMFANG: Record<PaymentInfo['scope'], string> = {
  anzahlung: 'Anzahlung',
  gesamt: 'Gesamtbetrag',
};

const ORT_LABELS: Record<AppointmentInfo['location'], string> = {
  werkstatt: 'In der Werkstatt',
  'vor-ort': 'Beim Kunden vor Ort',
};

const PREIS_ART: Record<PriceQuote['mode'], string> = {
  fest: 'Fester Preis',
  rahmen: 'Preisrahmen',
  pruefung: 'Preis erst nach manueller Prüfung',
};

const UPLOAD_KATEGORIEN: Record<UploadRef['category'], string> = {
  schluesselfoto: 'Schlüsselfoto',
  fahrzeugschein: 'Fahrzeugschein',
  grundriss: 'Grundriss',
  dokument: 'Dokument',
  objektfoto: 'Objektfoto',
};

const AKTEURE: Record<TimelineEntry['actor'], string> = {
  kunde: 'Kundin oder Kunde',
  team: 'Betrieb',
  system: 'System',
};

interface SeitenProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: SeitenProps): Promise<Metadata> {
  const { id } = await props.params;
  const record = await getRecord(id);

  return {
    title: record ? `Vorgang ${record.reference}` : 'Vorgang',
    robots: { index: false, follow: false },
  };
}

/** Preisangaben als Beschriftung-Wert-Paare — alle Werte stammen aus dem Vorgang. */
function preisZeilen(quote: PriceQuote): { label: string; value: string }[] {
  const zeilen: { label: string; value: string }[] = [
    { label: 'Art der Preisangabe', value: PREIS_ART[quote.mode] },
  ];

  if (quote.mode === 'fest' && typeof quote.priceCents === 'number') {
    zeilen.push({ label: 'Gesamtpreis', value: formatCents(quote.priceCents) });
  }

  if (
    quote.mode === 'rahmen'
    && typeof quote.priceFromCents === 'number'
    && typeof quote.priceToCents === 'number'
  ) {
    zeilen.push({
      label: 'Preisrahmen',
      value: `${formatCents(quote.priceFromCents)} bis ${formatCents(quote.priceToCents)}`,
    });
  }

  zeilen.push({ label: 'Anzahlung', value: formatCents(quote.depositCents) });

  if (typeof quote.remainderCents === 'number') {
    zeilen.push({ label: 'Restbetrag nach Anzahlung', value: formatCents(quote.remainderCents) });
  }

  zeilen.push(
    { label: 'Eingeplante Terminlänge', value: formatDuration(quote.slotMinutes) },
    {
      label: 'Vorlauf bis zum frühesten Termin',
      value: quote.leadTimeDays === 1 ? '1 Tag' : `${quote.leadTimeDays} Tage`,
    },
    {
      label: 'Fahrzeug muss vor Ort sein',
      value: quote.requiresVehicleOnSite ? 'Ja' : 'Nein',
    },
  );

  if (quote.note) zeilen.push({ label: 'Hinweis', value: quote.note });

  return zeilen;
}

function kontaktZeilen(record: BusinessRecord): { label: string; value: string }[] {
  const kontakt = record.contact;
  const anschrift = [
    kontakt.street,
    [kontakt.postalCode, kontakt.city].filter(Boolean).join(' ').trim(),
    kontakt.country,
  ]
    .filter((teil) => Boolean(teil && teil.trim()))
    .join(', ');

  const zeilen: { label: string; value: string }[] = [
    {
      label: 'Name',
      value: [kontakt.salutation, kontakt.firstName, kontakt.lastName]
        .filter(Boolean)
        .join(' ')
        .trim(),
    },
  ];

  if (kontakt.company) zeilen.push({ label: 'Firma', value: kontakt.company });

  zeilen.push(
    { label: 'E-Mail-Adresse', value: kontakt.email },
    { label: 'Telefon', value: kontakt.phone },
  );

  if (anschrift) zeilen.push({ label: 'Anschrift', value: anschrift });

  return zeilen;
}

/** Einfache Aufstellung aus Beschriftung und Wert. */
function Angaben({ zeilen }: { zeilen: { label: string; value: string }[] }) {
  return (
    <dl className="divide-y divide-border">
      {zeilen.map((zeile, index) => (
        <div
          key={`${zeile.label}-${index}`}
          className="grid gap-1 py-3 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4"
        >
          <dt className="text-[13px] font-semibold text-foreground-muted">{zeile.label}</dt>
          <dd className="text-[15px] text-foreground">{zeile.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Eintraege({ eintraege }: { eintraege: TimelineEntry[] }) {
  return (
    <ol className="space-y-4">
      {eintraege.map((eintrag, index) => (
        <li key={`${eintrag.at}-${index}`} className="border-l-2 border-border pl-4">
          <p className="text-[13px] font-semibold text-foreground-subtle">
            {formatDateTime(eintrag.at)} · {AKTEURE[eintrag.actor]}
          </p>
          <p className="mt-1 text-[15px] leading-relaxed text-foreground">{eintrag.message}</p>
        </li>
      ))}
    </ol>
  );
}

export default async function VorgangsSeite(props: SeitenProps) {
  const { id } = await props.params;
  const record = await getRecord(id);

  if (!record) notFound();

  const bereich = areaByKey(record.area)?.label ?? record.area;
  const ablauf = PROCESS_LABELS[record.process];
  const nichtGespeicherteDateien = record.uploads.filter((datei) => !datei.storageKey);

  const zahlungsZeilen = record.payment
    ? [
        { label: 'Umfang', value: ZAHLUNG_UMFANG[record.payment.scope] },
        { label: 'Betrag', value: formatCents(record.payment.amountCents) },
        { label: 'Status', value: ZAHLUNG_LABELS[record.payment.status] },
        ...(record.payment.paidAt
          ? [{ label: 'Bezahlt am', value: formatDateTime(record.payment.paidAt) }]
          : []),
        ...(record.payment.providerRef
          ? [{ label: 'Kennung des Zahlungsdienstleisters', value: record.payment.providerRef }]
          : []),
      ]
    : [];

  const terminZeilen = record.appointment
    ? [
        { label: 'Datum', value: formatDate(record.appointment.date) },
        { label: 'Beginn', value: `${record.appointment.time} Uhr` },
        { label: 'Dauer', value: formatDuration(record.appointment.durationMinutes) },
        { label: 'Ort', value: ORT_LABELS[record.appointment.location] },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="space-y-6 print:hidden">
        <div>
          <Link
            href="/admin/vorgaenge"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-primary"
          >
            <ArrowLeft size={16} aria-hidden />
            Zurück zur Vorgangsliste
          </Link>

          <h1 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
            Vorgang {record.reference}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="outline">{ART_LABELS[record.kind]}</Badge>
            <Badge tone={STATUS_TON[record.status]}>{STATUS_LABELS[record.status]}</Badge>
            <Badge tone="neutral">{bereich}</Badge>
            <Badge tone="neutral">{ablauf.label}</Badge>
          </div>

          <p className="mt-3 text-[13px] text-foreground-muted">
            Eingegangen am {formatDateTime(record.createdAt)} · Zuletzt geändert am{' '}
            {formatDateTime(record.updatedAt)}
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_23rem] xl:items-start">
          <div className="min-w-0 space-y-5">
            <Card>
              <CardHeader>
                <h2 className="font-display text-base font-bold text-foreground">Kontaktdaten</h2>
              </CardHeader>
              <CardBody>
                <Angaben zeilen={kontaktZeilen(record)} />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-display text-base font-bold text-foreground">
                  Zusammenfassung des Vorgangs
                </h2>
                <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                  Dieselben Angaben, die die Kundin oder der Kunde zum Abschluss gesehen hat.
                </p>
              </CardHeader>
              <CardBody>
                {record.summary.length > 0 ? (
                  <SummaryList sections={record.summary} />
                ) : (
                  <p className="text-[15px] text-foreground-muted">
                    Für diesen Vorgang wurde keine Zusammenfassung hinterlegt.
                  </p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-display text-base font-bold text-foreground">Preisangaben</h2>
              </CardHeader>
              <CardBody>
                {record.quote ? (
                  <Angaben zeilen={preisZeilen(record.quote)} />
                ) : (
                  <p className="text-[15px] text-foreground-muted">
                    Zu diesem Vorgang liegt keine Preisermittlung vor. Der Preis wird nach der
                    fachlichen Prüfung ergänzt.
                  </p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-display text-base font-bold text-foreground">Termin</h2>
              </CardHeader>
              <CardBody>
                {record.appointment ? (
                  <Angaben zeilen={terminZeilen} />
                ) : (
                  <p className="text-[15px] text-foreground-muted">
                    Für diesen Vorgang ist kein Termin gebucht.
                  </p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-base font-bold text-foreground">Zahlung</h2>
                  {record.payment && (
                    <Badge tone={ZAHLUNG_TON[record.payment.status]}>
                      {ZAHLUNG_LABELS[record.payment.status]}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                {record.payment ? (
                  <Angaben zeilen={zahlungsZeilen} />
                ) : (
                  <p className="text-[15px] text-foreground-muted">
                    Für diesen Vorgang ist keine Zahlung hinterlegt.
                  </p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-display text-base font-bold text-foreground">
                  Hochgeladene Unterlagen
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {record.uploads.length === 0 ? (
                  <p className="text-[15px] text-foreground-muted">
                    Zu diesem Vorgang wurden keine Dateien hinterlegt.
                  </p>
                ) : (
                  <>
                    {nichtGespeicherteDateien.length > 0 && (
                      <Alert tone="warning" title="Dateien sind nicht dauerhaft gespeichert">
                        Für {nichtGespeicherteDateien.length === 1 ? 'eine Datei' : `${nichtGespeicherteDateien.length} Dateien`}{' '}
                        fehlt der Speicherort, weil noch keine Dateiablage angebunden ist. Es ist
                        nur vermerkt, welche Datei ausgewählt wurde — die Datei selbst muss bei der
                        Kundin oder dem Kunden angefordert werden.
                      </Alert>
                    )}

                    <ul className="divide-y divide-border">
                      {record.uploads.map((datei) => (
                        <li key={datei.id} className="flex items-start gap-3 py-3">
                          <Paperclip size={16} aria-hidden className="mt-1 shrink-0 text-foreground-subtle" />
                          <div className="min-w-0">
                            <p className="text-[15px] font-semibold text-foreground">{datei.fileName}</p>
                            <p className="mt-0.5 text-[13px] text-foreground-muted">
                              {UPLOAD_KATEGORIEN[datei.category]} · {formatFileSize(datei.sizeBytes)} ·{' '}
                              {datei.mimeType} · hochgeladen am {formatDateTime(datei.uploadedAt)}
                            </p>
                            {!datei.storageKey && (
                              <p className="mt-1.5">
                                <Badge tone="warning">Nicht dauerhaft gespeichert</Badge>
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </CardBody>
            </Card>

            <div className="grid gap-5 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <h2 className="font-display text-base font-bold text-foreground">Zeitleiste</h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                    Der nachvollziehbare Verlauf des Vorgangs.
                  </p>
                </CardHeader>
                <CardBody>
                  {record.timeline.length > 0 ? (
                    <Eintraege eintraege={record.timeline} />
                  ) : (
                    <p className="text-[15px] text-foreground-muted">
                      Es wurden noch keine Schritte festgehalten.
                    </p>
                  )}
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-display text-base font-bold text-foreground">Interne Notizen</h2>
                    <Badge tone="warning">Nur intern sichtbar</Badge>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                    Diese Notizen sieht die Kundin oder der Kunde nicht. Sie erscheinen weder in
                    der Bestätigung noch in der Terminauskunft.
                  </p>
                </CardHeader>
                <CardBody>
                  {record.internalNotes.length > 0 ? (
                    <Eintraege eintraege={record.internalNotes} />
                  ) : (
                    <p className="text-[15px] text-foreground-muted">
                      Es liegt noch keine interne Notiz vor.
                    </p>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>

          <div className="min-w-0">
            <VorgangsAktionen
              id={record.id}
              aktuellerStatus={record.status}
              zahlungVorhanden={Boolean(record.payment)}
              zahlungBezahlt={record.payment?.status === 'bezahlt'}
            />
          </div>
        </div>
      </div>

      <section
        aria-labelledby="projektbericht-titel"
        className="rounded-lg border border-border bg-surface print:rounded-none print:border-0"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 md:px-6 print:hidden">
          <div>
            <h2 id="projektbericht-titel" className="font-display text-base font-bold text-foreground">
              Projektbericht
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
              Zusammenstellung für die Werkstatt oder die Akte. Beim Drucken werden Navigation,
              Hinweise und Schaltflächen ausgeblendet.
            </p>
          </div>
          <DruckKnopf />
        </div>

        <div className="space-y-6 px-5 py-5 md:px-6 print:px-0 print:py-0">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Projektbericht SCHLÜSSELMACHER24
            </p>
            <p className="mt-1 font-display text-xl font-bold text-foreground">
              Vorgang {record.reference}
            </p>
            <p className="mt-1 text-[13px] text-foreground-muted">
              {ART_LABELS[record.kind]} · {bereich} · Status: {STATUS_LABELS[record.status]}
            </p>
            <p className="mt-1 text-[13px] text-foreground-muted">
              Eingegangen am {formatDateTime(record.createdAt)} · Zuletzt geändert am{' '}
              {formatDateTime(record.updatedAt)}
            </p>
          </div>

          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground-subtle">
              Kontakt
            </h3>
            <Angaben zeilen={kontaktZeilen(record)} />
          </div>

          {record.summary.length > 0 && (
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground-subtle">
                Angaben zum Vorgang
              </h3>
              <div className="mt-3">
                <SummaryList sections={record.summary} />
              </div>
            </div>
          )}

          {record.quote && (
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground-subtle">
                Preisangaben
              </h3>
              <Angaben zeilen={preisZeilen(record.quote)} />
            </div>
          )}

          {record.appointment && (
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground-subtle">
                Termin
              </h3>
              <Angaben zeilen={terminZeilen} />
            </div>
          )}

          {record.payment && (
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground-subtle">
                Zahlung
              </h3>
              <Angaben zeilen={zahlungsZeilen} />
            </div>
          )}

          {record.uploads.length > 0 && (
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground-subtle">
                Unterlagen
              </h3>
              <ul className="mt-2 space-y-1.5">
                {record.uploads.map((datei) => (
                  <li key={`bericht-${datei.id}`} className="text-[14px] text-foreground">
                    {datei.fileName} — {UPLOAD_KATEGORIEN[datei.category]},{' '}
                    {formatFileSize(datei.sizeBytes)}
                    {datei.storageKey ? '' : ' (nicht dauerhaft gespeichert)'}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-[12px] leading-relaxed text-foreground-subtle">
            Interne Notizen sind in diesem Bericht bewusst nicht enthalten.
          </p>
        </div>
      </section>
    </div>
  );
}
