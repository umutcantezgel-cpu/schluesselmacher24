import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';

import { getRecord, getSettings } from '@/lib/data';
import { verifyAccessToken } from '@/lib/server/access-token';
import { mailStatus, paymentStatus, storageStatus } from '@/lib/integrations';
import { widerrufErklaerenHref } from '@/lib/navigation';
import { formatCents, formatDate, formatDateTime, formatDuration } from '@/lib/format';
import { mailHinweis } from '@/lib/mail/hinweise';
import { vorgangOrtText } from '@/lib/terminort';
import type { OrderLine, OrderTotals, PaymentInfo, RecordKind, RecordStatus, SummarySection } from '@/lib/types';
import { zahlungsAnsicht } from '@/lib/zahlung/ansicht';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/page-header';
import { SummaryList } from '@/components/layout/summary-list';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

import { JetztBezahlen } from './jetzt-bezahlen';

interface BestellungSeiteProps {
  params: Promise<{ id: string }>;
  /**
   * `t` ist der geheime Link-Schlüssel aus der Bestätigung. `abbruch=1` kommt
   * von der Zahlungsseite (abgebrochen), `rueckkehr=1` nach dem Bezahlen.
   */
  searchParams: Promise<{ t?: string | string[]; abbruch?: string | string[]; rueckkehr?: string | string[] }>;
}

type Tonfall = 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'outline';

const KIND_LABELS: Record<RecordKind, string> = {
  bestellung: 'Bestellung',
  anfrage: 'Anfrage',
  termin: 'Termin',
  projekt: 'Projekt',
  partner: 'Partner-Bewerbung',
};

const STATUS_LABELS: Record<RecordStatus, string> = {
  neu: 'Eingegangen',
  'in-pruefung': 'In Prüfung',
  geprueft: 'Geprüft',
  freigegeben: 'Freigegeben',
  'nicht-moeglich': 'Nicht möglich',
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
  freigegeben: 'success',
  'nicht-moeglich': 'danger',
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
      <p className="eyebrow"><span className="sm24-nummer tabular-nums text-foreground-muted" />Positionen</p>
      <h2 className="mt-1 text-title font-semibold text-foreground">Bestellte Artikel</h2>

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

const erster = (wert: string | string[] | undefined) => (Array.isArray(wert) ? wert[0] : wert);

async function loadAuthorisedRecord(props: BestellungSeiteProps) {
  const [{ id }, suche] = await Promise.all([props.params, props.searchParams]);
  const token = erster(suche.t);
  const record = await getRecord(id);
  // Unbekannter Vorgang und falscher Schlüssel sehen gleich aus — so lässt
  // sich nicht herausfinden, welche Nummern existieren.
  if (!record || !token || !verifyAccessToken(token, record.accessTokenHash)) return null;
  return { record, token, abbruch: erster(suche.abbruch) === '1', rueckkehr: erster(suche.rueckkehr) === '1' };
}

/** Nächste Schritte je Art des Vorgangs. */
const SCHRITTE: Record<RecordKind, Array<{ titel: string; text: string }>> = {
  bestellung: [
    { titel: 'Prüfung Ihrer Angaben', text: 'Wir prüfen Code, Maße und Zusammenstellung, bevor etwas gefertigt wird.' },
    { titel: 'Zahlung', text: 'Gefertigt wird nach Zahlungseingang. Solange die Zahlung offen ist, können Sie sie hier fortsetzen.' },
    {
      titel: 'Fertigung und Versand',
      text: 'Danach fertigen wir Ihre Bestellung und versenden sie auf dem von Ihnen gewählten Weg. Sie werden über jeden Schritt informiert.',
    },
  ],
  termin: [
    { titel: 'Anzahlung', text: 'Mit der Anzahlung ist Ihr Zeitfenster fest für Sie reserviert. Sie wird auf den Gesamtpreis angerechnet.' },
    { titel: 'Prüfung Ihrer Angaben', text: 'Wir prüfen Fahrzeug, Unterlagen und Leistung und melden uns, falls etwas fehlt.' },
    { titel: 'Termin', text: 'Wir sind zum vereinbarten Termin für Sie da. Über Änderungen informieren wir Sie per E-Mail.' },
  ],
  anfrage: [
    { titel: 'Sichtung', text: 'Wir sichten Ihre Angaben und Unterlagen.' },
    { titel: 'Rückmeldung', text: 'Wir melden uns mit einem Angebot oder dem nächsten Schritt.' },
  ],
  projekt: [
    { titel: 'Sichtung', text: 'Wir sichten Ihre Angaben und Unterlagen.' },
    { titel: 'Rückmeldung', text: 'Wir melden uns mit einem Angebot oder einem Vorschlag für einen Termin vor Ort.' },
  ],
  partner: [
    { titel: 'Prüfung', text: 'Wir prüfen Ihre Angaben zu Betrieb, Leistungen und Qualifikation.' },
    { titel: 'Rückmeldung', text: 'Wir melden uns mit dem nächsten Schritt.' },
  ],
};

export default async function BestellungSeite(props: BestellungSeiteProps) {
  // Persönliche Daten: immer zur Anfragezeit rendern, nie aus einem Seiten-Cache.
  await connection();
  const geladen = await loadAuthorisedRecord(props);

  if (!geladen) notFound();
  const { record, token } = geladen;

  const kindLabel = KIND_LABELS[record.kind];
  const zahlung = zahlungsAnsicht(record, {
    online: paymentStatus().configured,
    abbruch: geladen.abbruch,
    rueckkehr: geladen.rueckkehr,
    jetzt: new Date(),
  });
  // Widerrufsbutton: nur bei Verträgen (Bestellung, Termin mit Anzahlung).
  const widerrufbar = record.kind === 'bestellung' || record.kind === 'termin';

  // Hinweise zu diesem Vorgang: ob die Bestätigung per E-Mail rausging
  // (Mailprotokoll) und ob die Dateien gespeichert werden konnten.
  const hinweise: string[] = [];
  const mail = mailHinweis(record, mailStatus().configured);
  if (mail) hinweise.push(mail);
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
    // Werkstatt mit Anschrift (Erg. Leitfaden §1); die Firmendaten nur für Termine laden.
    const ort = vorgangOrtText(record, (await getSettings()).company);
    abschnitte.push({
      title: 'Termin',
      rows: [
        { label: 'Datum', value: formatDate(record.appointment.date) },
        { label: 'Uhrzeit', value: `${record.appointment.time} Uhr` },
        { label: 'Dauer', value: formatDuration(record.appointment.durationMinutes) },
        { label: 'Ort', value: ort ?? '' },
      ],
    });
  }

  return (
    <>
      <PageHeader
        art="arbeit"
        eyebrow={record.kind === 'bestellung' ? 'Direkt kaufen' : kindLabel}
        title={`${kindLabel} eingegangen`}
        lead="Wir haben Ihren Vorgang aufgenommen. Bitte bewahren Sie die Vorgangsnummer auf — damit finden Sie den Stand jederzeit wieder."
        crumbs={[{ href: `/bestellung/${record.id}`, label: `${kindLabel} ${record.reference}` }]}
      />

      <div className="shell py-8 md:py-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          {/* Abschnittsnummern zählt CSS (.sm24-zaehlung): Artikel und Zahlung erscheinen nur mit Daten */}
          <div className="sm24-zaehlung space-y-12 lg:col-span-7">
            {/* Vorgangsnummer und Stand */}
            <section className="border-t border-border pt-8">
              <p className="eyebrow"><span className="sm24-nummer tabular-nums text-foreground-muted" />Bestätigung</p>
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
                <p className="eyebrow"><span className="sm24-nummer tabular-nums text-foreground-muted" />Abrechnung</p>
                <h2 className="mt-1 text-title font-semibold text-foreground">Zahlung</h2>

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

                {zahlung && (
                  <div className="mt-6 space-y-4">
                    <Alert tone={zahlung.ton} title={zahlung.titel} role={zahlung.ton === 'info' ? 'status' : 'note'}>
                      {zahlung.text}
                      {zahlung.neuBuchen && (
                        <>
                          {' '}
                          <Link href="/autoschluessel/anfrage" className="font-semibold text-primary hover:underline">
                            Termin neu buchen
                          </Link>
                        </>
                      )}
                    </Alert>
                    {zahlung.knopf && (
                      <JetztBezahlen
                        recordId={record.id}
                        token={token}
                        label={zahlung.knopf === 'erneut' ? 'Erneut bezahlen' : 'Jetzt bezahlen'}
                      />
                    )}
                  </div>
                )}
              </section>
            )}

            {/* Angaben */}
            <section className="border-t border-border pt-8">
              <p className="eyebrow"><span className="sm24-nummer tabular-nums text-foreground-muted" />Übersicht</p>
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
                {SCHRITTE[record.kind].map((schritt, index) => (
                  <li key={schritt.titel} className="py-4">
                    <p className="text-body font-semibold text-foreground">{index + 1}. {schritt.titel}</p>
                    <p className="mt-1 text-small leading-relaxed text-foreground-muted">{schritt.text}</p>
                  </li>
                ))}
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
              <h2 className="text-title-sm font-semibold text-foreground">Fragen zu Ihrem Vorgang?</h2>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {[
                  { href: '/service-und-termin/kontakt', label: 'Kontakt aufnehmen' },
                  { href: '/rechtliches/versand-und-zahlung', label: 'Zahlung und Versand' },
                  { href: '/rechtliches/widerruf', label: 'Widerruf und Rückgabe' },
                  { href: '/rechtliches/agb', label: 'AGB' },
                  ...(widerrufbar
                    ? [{ href: widerrufErklaerenHref(record.reference), label: 'Vertrag widerrufen' }]
                    : []),
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
