import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Plug,
  Wallet,
} from 'lucide-react';

import { getCollection } from '@/lib/data';
import { integrationStatuses } from '@/lib/integrations';
import { addDays, toIsoDate } from '@/lib/scheduling';
import { formatCents, formatDateShort, formatDateTime } from '@/lib/format';
import { areaByKey } from '@/lib/navigation';
import type { BusinessRecord, RecordKind, RecordStatus } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Übersicht',
  robots: { index: false, follow: false },
};

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

const ARTEN: RecordKind[] = ['bestellung', 'anfrage', 'termin', 'projekt'];

const STATUS_REIHENFOLGE: RecordStatus[] = [
  'neu',
  'in-pruefung',
  'geprueft',
  'wartet-auf-kunde',
  'in-fertigung',
  'terminiert',
  'versendet',
  'abgeschlossen',
  'storniert',
];

function bereichsName(record: BusinessRecord): string {
  return areaByKey(record.area)?.label ?? record.area;
}

function terminZeit(record: BusinessRecord): string {
  if (!record.appointment) return '—';
  return `${formatDateShort(record.appointment.date)}, ${record.appointment.time} Uhr`;
}

export default async function AdminUebersicht() {
  const records = await getCollection('records');
  const anbindungen = integrationStatuses();

  const heute = toIsoDate(new Date());
  const inVierzehnTagen = addDays(heute, 14);

  const jeArt = ARTEN.map((art) => ({
    art,
    anzahl: records.filter((record) => record.kind === art).length,
  }));

  const jeStatus = STATUS_REIHENFOLGE.map((status) => ({
    status,
    anzahl: records.filter((record) => record.status === status).length,
  }));

  const offeneZahlungen = records.filter((record) => record.payment?.status === 'offen');
  const offenerBetragCents = offeneZahlungen.reduce(
    (summe, record) => summe + (record.payment?.amountCents ?? 0),
    0,
  );

  const kommendeTermine = records
    .filter((record) => {
      if (!record.appointment) return false;
      if (record.status === 'storniert') return false;
      return record.appointment.date >= heute && record.appointment.date <= inVierzehnTagen;
    })
    .sort((a, b) => {
      const links = `${a.appointment?.date ?? ''}T${a.appointment?.time ?? ''}`;
      const rechts = `${b.appointment?.date ?? ''}T${b.appointment?.time ?? ''}`;
      return links.localeCompare(rechts);
    });

  const unbearbeitet = records.filter(
    (record) => record.status === 'neu' || record.status === 'in-pruefung',
  ).length;

  const letzteVorgaenge = [...records]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8);

  const kennzahlen = [
    {
      label: 'Vorgänge insgesamt',
      wert: String(records.length),
      hinweis: `${unbearbeitet} davon noch unbearbeitet`,
      icon: ClipboardList,
    },
    {
      label: 'Offene Zahlungen',
      wert: String(offeneZahlungen.length),
      hinweis:
        offeneZahlungen.length > 0
          ? `Summe ${formatCents(offenerBetragCents)}`
          : 'Keine offene Zahlung vermerkt',
      icon: Wallet,
    },
    {
      label: 'Termine in 14 Tagen',
      wert: String(kommendeTermine.length),
      hinweis: `Zeitraum ${formatDateShort(heute)} bis ${formatDateShort(inVierzehnTagen)}`,
      icon: CalendarDays,
    },
    {
      label: 'Eingerichtete Anbindungen',
      wert: `${anbindungen.filter((eintrag) => eintrag.configured).length} von ${anbindungen.length}`,
      hinweis: 'Zahlung, Mailversand, Dateiablage',
      icon: Plug,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Übersicht</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
          Stand der laufenden Arbeit: was hereingekommen ist, was noch offen ist und welche
          Termine anstehen. Alle Zahlen beziehen sich auf die gespeicherten Vorgänge.
        </p>
      </div>

      {records.length === 0 ? (
        <Card>
          <CardBody>
            <h2 className="font-display text-lg font-bold text-foreground">
              Es liegen noch keine Vorgänge vor
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground-muted">
              Ein Vorgang entsteht immer dann, wenn eine Kundin oder ein Kunde auf der Website
              einen der vier Abläufe abschließt:
            </p>
            <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-foreground-muted">
              <li>
                <span className="font-semibold text-foreground">Bestellung</span> — Kauf im Shop
                für Schlüssel nach Code oder gleichschließende Zylinder.
              </li>
              <li>
                <span className="font-semibold text-foreground">Anfrage</span> — geführte Anfrage,
                zum Beispiel Schlüssel nach Vorlage oder Tür- und Schließtechnik.
              </li>
              <li>
                <span className="font-semibold text-foreground">Termin</span> — Terminbuchung mit
                Anzahlung im Bereich Autoschlüssel.
              </li>
              <li>
                <span className="font-semibold text-foreground">Projekt</span> — erfasste Planung
                aus dem Schließanlagen- oder Zutrittskonfigurator.
              </li>
            </ul>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
              Solange nichts eingegangen ist, bleibt diese Übersicht leer. Die Einstellungen,
              Preise und Produkte lassen sich trotzdem bereits pflegen.
            </p>
          </CardBody>
        </Card>
      ) : null}

      <section aria-labelledby="kennzahlen-titel">
        <h2 id="kennzahlen-titel" className="sr-only">
          Kennzahlen
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kennzahlen.map((kennzahl) => {
            const Symbol = kennzahl.icon;
            return (
              <Card key={kennzahl.label}>
                <CardBody>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[13px] font-semibold text-foreground-muted">{kennzahl.label}</p>
                    <Symbol size={18} aria-hidden className="shrink-0 text-foreground-subtle" />
                  </div>
                  <p className="mt-2 font-display text-2xl font-bold text-foreground">{kennzahl.wert}</p>
                  <p className="mt-1 text-[13px] leading-snug text-foreground-subtle">{kennzahl.hinweis}</p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="font-display text-base font-bold text-foreground">Vorgänge nach Art</h2>
          </CardHeader>
          <CardBody>
            <dl className="divide-y divide-border">
              {jeArt.map((eintrag) => (
                <div key={eintrag.art} className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-[15px] text-foreground">{ART_LABELS[eintrag.art]}</dt>
                  <dd className="font-display text-base font-bold text-foreground">{eintrag.anzahl}</dd>
                </div>
              ))}
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-display text-base font-bold text-foreground">Vorgänge nach Status</h2>
          </CardHeader>
          <CardBody>
            <dl className="divide-y divide-border">
              {jeStatus.map((eintrag) => (
                <div key={eintrag.status} className="flex items-center justify-between gap-4 py-2.5">
                  <dt>
                    <Badge tone={STATUS_TON[eintrag.status]}>{STATUS_LABELS[eintrag.status]}</Badge>
                  </dt>
                  <dd className="font-display text-base font-bold text-foreground">{eintrag.anzahl}</dd>
                </div>
              ))}
            </dl>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-base font-bold text-foreground">
              Zuletzt eingegangene Vorgänge
            </h2>
            <Link
              href="/admin/vorgaenge"
              className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-primary"
            >
              Alle Vorgänge ansehen
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </CardHeader>
        <CardBody>
          {letzteVorgaenge.length === 0 ? (
            <p className="text-[15px] text-foreground-muted">
              Noch nichts eingegangen. Sobald ein Formular auf der Website abgeschickt wird,
              erscheint der Vorgang hier.
            </p>
          ) : (
            <div className="table-scroll">
              <table className="w-full min-w-[46rem] border-collapse text-left">
                <caption className="sr-only">
                  Die acht zuletzt eingegangenen Vorgänge mit Nummer, Art, Status und Datum
                </caption>
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="py-2 pr-4 text-[12px] font-bold uppercase tracking-wider text-foreground-subtle">
                      Nummer
                    </th>
                    <th scope="col" className="py-2 pr-4 text-[12px] font-bold uppercase tracking-wider text-foreground-subtle">
                      Art
                    </th>
                    <th scope="col" className="py-2 pr-4 text-[12px] font-bold uppercase tracking-wider text-foreground-subtle">
                      Bereich
                    </th>
                    <th scope="col" className="py-2 pr-4 text-[12px] font-bold uppercase tracking-wider text-foreground-subtle">
                      Name
                    </th>
                    <th scope="col" className="py-2 pr-4 text-[12px] font-bold uppercase tracking-wider text-foreground-subtle">
                      Status
                    </th>
                    <th scope="col" className="py-2 pr-4 text-[12px] font-bold uppercase tracking-wider text-foreground-subtle">
                      Eingegangen
                    </th>
                    <th scope="col" className="py-2 text-[12px] font-bold uppercase tracking-wider text-foreground-subtle">
                      Termin
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {letzteVorgaenge.map((record) => (
                    <tr key={record.id}>
                      <td className="py-3 pr-4">
                        <Link
                          href={`/admin/vorgaenge/${record.id}`}
                          className="font-mono text-sm font-semibold text-primary"
                        >
                          {record.reference}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-[14px] text-foreground">{ART_LABELS[record.kind]}</td>
                      <td className="py-3 pr-4 text-[14px] text-foreground-muted">{bereichsName(record)}</td>
                      <td className="py-3 pr-4 text-[14px] text-foreground">
                        {record.contact.firstName} {record.contact.lastName}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge tone={STATUS_TON[record.status]}>{STATUS_LABELS[record.status]}</Badge>
                      </td>
                      <td className="py-3 pr-4 text-[14px] text-foreground-muted">
                        {formatDateTime(record.createdAt)}
                      </td>
                      <td className="py-3 text-[14px] text-foreground-muted">{terminZeit(record)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-display text-base font-bold text-foreground">
            Stand der externen Anbindungen
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
            Diese drei Anbindungen sind vorbereitet, aber ohne Zugangsdaten inaktiv. Bis sie
            eingerichtet sind, greift jeweils der beschriebene Ersatzweg.
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          {anbindungen.map((anbindung) => {
            const fehlend = anbindung.requiredEnv.filter((schluessel) => !process.env[schluessel]);

            return (
              <div key={anbindung.id} className="rounded-lg border border-border bg-surface-muted p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-[15px] font-bold text-foreground">{anbindung.label}</h3>
                  <Badge tone={anbindung.configured ? 'success' : 'warning'}>
                    {anbindung.configured ? 'Eingerichtet' : 'Noch nicht eingerichtet'}
                  </Badge>
                </div>

                <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
                  <span className="font-semibold text-foreground">Was ohne diese Anbindung passiert: </span>
                  {anbindung.fallback}
                </p>

                <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
                  <span className="font-semibold text-foreground">
                    {fehlend.length > 0 ? 'Fehlende Umgebungsvariablen: ' : 'Benötigte Umgebungsvariablen: '}
                  </span>
                  <span className="font-mono text-[12px]">
                    {(fehlend.length > 0 ? fehlend : anbindung.requiredEnv).join(', ')}
                  </span>
                </p>
              </div>
            );
          })}

          <Alert tone="info" title="Wer richtet das ein?">
            Die Umgebungsvariablen werden auf dem Server hinterlegt, nicht in diesem Backend.
            Sobald sie gesetzt sind, wechselt die Anzeige hier selbstständig auf „Eingerichtet“.
          </Alert>
        </CardBody>
      </Card>
    </div>
  );
}
