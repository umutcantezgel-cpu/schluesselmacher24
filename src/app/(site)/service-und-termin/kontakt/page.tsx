import type { Metadata } from 'next';
import Link from 'next/link';

import { getSettings } from '@/lib/data';
import { formatWeekday } from '@/lib/format';
import { enthaeltPlatzhalter } from '@/lib/platzhalter';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphMail } from '@/components/visual/glyphen/mail';
import { GlyphOrt } from '@/components/visual/glyphen/ort';
import { GlyphTelefon } from '@/components/visual/glyphen/telefon';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Anschrift, Erreichbarkeit und Anfahrt zu SCHLÜSSELMACHER24.',
  alternates: { canonical: '/service-und-termin/kontakt' },
};

/** Hinweis zur Anfahrt aus der Redaktion. Solange er einen Platzhalter enthält, bleibt er ungezeigt. */
const ANFAHRT_HINWEIS =
  '[Platzhalter: Hinweise zur Anfahrt, zu Parkmöglichkeiten und zur Erreichbarkeit mit öffentlichen Verkehrsmitteln eintragen. Eine eingebettete Karte eines externen Anbieters ist erst nach Einwilligung zulässig und muss über die Cookie-Einstellungen gesteuert werden.]';

export default async function KontaktPage() {
  const settings = await getSettings();
  const { company } = settings;

  return (
    <>
      {/* Kopf: Fach-Icon als Anker und Ziel des Seitenwechsels (B-13) */}
      <PageHeader
        bereich="service-und-termin"
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
        {/* Redaktionshinweis nur im Entwicklungsmodus (D-016), wie im Fuß */}
        {company.isPlaceholder && process.env.NODE_ENV !== 'production' && (
          <Alert tone="warning" title="Kontaktdaten noch nicht hinterlegt" className="mb-8">
            Anschrift, Telefonnummer und E-Mail-Adresse sind derzeit Platzhalter. Sie werden im
            Backend unter „Einstellungen“ gepflegt und müssen vor dem Livegang ersetzt werden.
          </Alert>
        )}

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading nummer="01" eyebrow="Erreichbarkeit" title="Fachbetrieb" />

            {company.isPlaceholder ? (
              /* Ohne hinterlegte Daten keine Anschrift, kein tel:- oder mailto:-Link mit Platzhalter */
              <p className="mt-6 flex max-w-measure gap-3 text-small text-foreground-muted">
                <GlyphInfo size={18} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  Anschrift, Telefon und E-Mail sind noch nicht hinterlegt. Für Ihr Anliegen stellen Sie
                  bitte eine{' '}
                  <Link href="/service-und-termin/anfrage" className="font-semibold underline">
                    Anfrage
                  </Link>
                  .
                </span>
              </p>
            ) : (
              <dl className="mt-6 border-t border-border">
                <div className="flex gap-4 border-b border-border py-5">
                  <GlyphOrt size={20} className="mt-1 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                      Anschrift
                    </dt>
                    <dd className="mt-2 text-body text-foreground">
                      {company.legalName}
                      <br />
                      {company.street}
                      <br />
                      {company.postalCode} {company.city}
                    </dd>
                  </div>
                </div>

                <div className="flex gap-4 border-b border-border py-5">
                  <GlyphTelefon size={20} className="mt-1 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                      Telefon
                    </dt>
                    <dd className="mt-2 font-mono tabular-nums text-body text-foreground">
                      <a
                        href={`tel:${company.phone}`}
                        className="inline-flex min-h-touch items-center hover:text-primary hover:underline"
                      >
                        {company.phone}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex gap-4 border-b border-border py-5">
                  <GlyphMail size={20} className="mt-1 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                      E-Mail
                    </dt>
                    <dd className="mt-2 break-words text-body text-foreground">
                      <a
                        href={`mailto:${company.email}`}
                        className="inline-flex min-h-touch items-center hover:text-primary hover:underline"
                      >
                        {company.email}
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>
            )}

            <h3 className="mt-12 text-title-sm font-semibold text-foreground">Öffnungszeiten</h3>
            <dl className="mt-6 border-t border-border">
              {settings.openingHours.map((entry) => (
                <div
                  key={entry.day}
                  className="grid gap-1 border-b border-border py-3 sm:grid-cols-3 sm:gap-x-4"
                >
                  <dt className="text-foreground-muted">{formatWeekday(entry.day)}</dt>
                  <dd className="font-mono tabular-nums text-foreground sm:col-span-2">
                    {entry.spans.length === 0
                      ? 'geschlossen'
                      : entry.spans.map((s) => `${s.from}–${s.to}`).join(' · ')}
                  </dd>
                </div>
              ))}
            </dl>

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

          <div className="lg:col-span-5">
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
            {!enthaeltPlatzhalter(ANFAHRT_HINWEIS) && (
              <p className="mt-4 text-small text-foreground-muted">{ANFAHRT_HINWEIS}</p>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
