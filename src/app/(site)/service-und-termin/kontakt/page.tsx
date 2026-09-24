import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

import { getSettings } from '@/lib/data';
import { formatWeekday } from '@/lib/format';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Anschrift, Erreichbarkeit und Anfahrt zu SCHLÜSSELMACHER24.',
  alternates: { canonical: '/service-und-termin/kontakt' },
};

export default async function KontaktPage() {
  const settings = await getSettings();
  const { company } = settings;

  return (
    <>
      <PageHeader
        eyebrow="Kontakt"
        title="So erreichen Sie uns"
        lead="Für konkrete Aufträge nutzen Sie bitte die geführten Abläufe — dort erfassen wir gleich alles, was wir brauchen."
        crumbs={[
          { href: '/service-und-termin', label: 'Service und Termin' },
          { href: '/service-und-termin/kontakt', label: 'Kontakt' },
        ]}
        actions={<ButtonLink href="/service-und-termin/anfrage">Anfrage stellen</ButtonLink>}
      />

      <Section>
        {company.isPlaceholder && (
          <Alert tone="warning" title="Kontaktdaten noch nicht hinterlegt" className="mb-8">
            Anschrift, Telefonnummer und E-Mail-Adresse sind derzeit Platzhalter. Sie werden im
            Backend unter „Einstellungen“ gepflegt und müssen vor dem Livegang ersetzt werden.
          </Alert>
        )}

        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <SectionHeading title="Fachbetrieb" />

            <dl className="mt-6 space-y-5">
              <div className="flex gap-4">
                <MapPin size={19} aria-hidden className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                    Anschrift
                  </dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-foreground">
                    {company.legalName}
                    <br />
                    {company.street}
                    <br />
                    {company.postalCode} {company.city}
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone size={19} aria-hidden className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                    Telefon
                  </dt>
                  <dd className="mt-1 text-[15px] text-foreground">
                    <a href={`tel:${company.phone}`} className="hover:text-primary hover:underline">
                      {company.phone}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail size={19} aria-hidden className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                    E-Mail
                  </dt>
                  <dd className="mt-1 text-[15px] text-foreground">
                    <a
                      href={`mailto:${company.email}`}
                      className="hover:text-primary hover:underline"
                    >
                      {company.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>

            <h3 className="mt-10 text-[15px] font-bold text-foreground">Öffnungszeiten</h3>
            <table className="mt-3 w-full max-w-sm border-collapse text-[14px]">
              <tbody>
                {settings.openingHours.map((entry) => (
                  <tr key={entry.day} className="border-b border-border">
                    <th scope="row" className="py-2 pr-6 text-left font-semibold text-foreground">
                      {formatWeekday(entry.day)}
                    </th>
                    <td className="py-2 text-foreground-muted">
                      {entry.spans.length === 0
                        ? 'geschlossen'
                        : entry.spans.map((s) => `${s.from}–${s.to}`).join(' · ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Alert tone="info" className="mt-8">
              Arbeiten an Fahrzeugen und Schließanlagen finden ausschließlich nach Terminvereinbarung
              statt. Bitte buchen Sie Ihren Termin über den{' '}
              <Link href="/autoschluessel/anfrage" className="font-semibold underline">
                Autoschlüssel-Ablauf
              </Link>{' '}
              oder stellen Sie eine{' '}
              <Link href="/service-und-termin/anfrage" className="font-semibold underline">
                allgemeine Anfrage
              </Link>
              .
            </Alert>
          </div>

          <div>
            <ImagePlaceholder
              slot={{
                motif: 'Foto des Betriebs: Eingang und Fassade mit Hausnummer',
                ratio: '4/3',
                note: 'Hilft Kundinnen und Kunden beim Wiederfinden vor Ort.',
              }}
            />
            <ImagePlaceholder
              slot={{
                motif: 'Anfahrtsskizze: Lage, Parkmöglichkeiten und nächste Haltestelle',
                ratio: '4/3',
                note: 'Einfache Zeichnung oder Kartenausschnitt mit geklärten Nutzungsrechten.',
              }}
              className="mt-4"
            />
            <p className="mt-4 text-[13px] leading-relaxed text-foreground-subtle">
              [Platzhalter: Hinweise zur Anfahrt, zu Parkmöglichkeiten und zur Erreichbarkeit mit
              öffentlichen Verkehrsmitteln eintragen. Eine eingebettete Karte eines externen
              Anbieters ist erst nach Einwilligung zulässig und muss über die Cookie-Einstellungen
              gesteuert werden.]
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
