import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  DoorClosed,
  KeyRound,
  Layers,
  Lock,
  PanelTop,
  ScanLine,
  ShieldCheck,
  Siren,
  Wrench,
} from 'lucide-react';

import { getPageContent, getServicePages } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';

const ROUTE = 'tuer-und-schliesstechnik';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Tür- und Schließtechnik',
    description:
      page?.seo.description
      ?? 'Zylinder, Einsteckschlösser, Mehrfachverriegelungen, Beschläge und Türtechnik — Beratung, Montage, Reparatur.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/** Symbole je Leistung — rein dekorativ, die Inhalte kommen aus der Datenschicht. */
const SERVICE_ICONS: Record<string, typeof KeyRound> = {
  'profilzylinder-und-spezialzylinder': KeyRound,
  einsteckschloesser: Lock,
  mehrfachverriegelungen: Layers,
  schutzbeschlaege: ShieldCheck,
  tuerzusatzschloesser: PanelTop,
  tuerschliesser: DoorClosed,
  'panik-und-fluchttuertechnik': Siren,
  'reparatur-und-austausch': Wrench,
  'technische-beratung': ScanLine,
  'montage-und-anpassung': Wrench,
};

/** Angrenzende Bereiche — die Hauptnavigation bleibt davon unberührt. */
const RELATED_AREAS = [
  {
    href: '/gleichschliessende-zylinder',
    label: 'Gleichschließende Zylinder',
    body: 'Mehrere Türen mit demselben Schlüssel schließen — ohne vollständige Anlagenplanung.',
  },
  {
    href: '/schliessanlagen',
    label: 'Schließanlagen',
    body: 'Wenn verschiedene Personen unterschiedlich weit schließen sollen, wird daraus eine Anlage.',
  },
  {
    href: '/elektronische-zutrittsloesungen',
    label: 'Elektronische Zutrittslösungen',
    body: 'Karte, Transponder, PIN oder App statt Schlüssel — auch in Verbindung mit vorhandener Mechanik.',
  },
  {
    href: '/sicherheitstechnik',
    label: 'Sicherheitstechnik',
    body: 'Wenn zusätzlich erkannt und gemeldet werden soll, was an der Tür passiert.',
  },
];

export default async function TuerUndSchliesstechnikPage() {
  const [page, services] = await Promise.all([
    getPageContent(ROUTE),
    getServicePages(ROUTE),
  ]);

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  return (
    <>
      <PageHeader
        eyebrow="Leistungsbereich"
        title={page?.headline ?? 'Tür- und Schließtechnik'}
        lead={page?.subline}
        crumbs={[{ href: `/${ROUTE}`, label: 'Tür- und Schließtechnik' }]}
        actions={
          <ButtonLink href={`/service-und-termin/anfrage?thema=${ROUTE}`} size="lg">
            Anfrage starten
            <ArrowRight size={18} aria-hidden />
          </ButtonLink>
        }
      />

      {/* Einordnung */}
      <Section tight>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-12">
          <div>
            <SectionHeading
              eyebrow="Worum es geht"
              title="Die Tür als Ganzes, nicht nur der Zylinder"
              lead={page?.intro}
            />

            <div className="mt-6 rounded-lg border border-border bg-surface-muted p-5">
              <p className="text-[13px] font-bold uppercase tracking-wider text-foreground-subtle">
                Ablauf in diesem Bereich
              </p>
              <p className="mt-2 text-[15px] font-bold text-foreground">{process.label}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">
                {process.hint}
              </p>
            </div>
          </div>

          <ImagePlaceholder
            slot={{
              motif: 'Werkstattfoto: geöffnete Wohnungstür mit ausgebautem Einsteckschloss und Zylinder',
              ratio: '4/3',
              note: 'Eigene Aufnahme aus einem Montageauftrag. Kein Stockfoto.',
            }}
          />
        </div>
      </Section>

      {/* Leistungen */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Leistungen"
          title="Was wir an Türen machen"
          lead="Zehn Leistungen, die sich im Alltag ergänzen. Was im Einzelfall sinnvoll ist, klären wir vorab."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = SERVICE_ICONS[service.slug] ?? Wrench;
            return (
              <li key={service.id}>
                <Link
                  href={`/${ROUTE}/${service.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon size={19} aria-hidden />
                  </span>
                  <span className="mt-4 block text-[15px] font-bold text-foreground group-hover:text-primary">
                    {service.title}
                  </span>
                  <span className="mt-1.5 block flex-1 text-[13px] leading-relaxed text-foreground-muted">
                    {service.summary}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-foreground-subtle">
                    Zur Leistung
                    <ArrowRight
                      size={13}
                      aria-hidden
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Sachlicher Hinweis zur Flucht- und Rettungswegtechnik */}
      <Section tight>
        <Alert tone="info" title="Panik- und Fluchttürtechnik wird immer am Objekt geklärt">
          <p>
            Welche Ausführung an einer Tür zulässig und sinnvoll ist, ergibt sich aus dem konkreten
            Gebäude und seiner Nutzung. Wir sehen uns die vorhandene Situation an und stimmen
            Schloss, Beschlag und Zylinder darauf ab. Vorgaben aus Baugenehmigung, Brandschutz oder
            Versicherung sind vorab zu klären — dafür ist die Betreiberin oder der Betreiber des
            Gebäudes zuständig.
          </p>
          <p className="mt-2">
            <Link
              href={`/${ROUTE}/panik-und-fluchttuertechnik`}
              className="font-semibold text-primary hover:underline"
            >
              Panik- und Fluchttürtechnik ansehen
            </Link>
          </p>
        </Alert>
      </Section>

      {/* Angrenzende Bereiche */}
      <Section tone="muted" tight>
        <SectionHeading
          eyebrow="Angrenzende Bereiche"
          title="Wann ein anderer Bereich besser passt"
          lead="Tür- und Schließtechnik betrifft die einzelne Tür. Sobald mehrere Türen zusammen gedacht werden, führt ein eigener Ablauf schneller zum Ziel."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {RELATED_AREAS.map((area) => (
            <li key={area.href}>
              <Card className="h-full">
                <CardBody className="flex h-full flex-col">
                  <p className="text-[15px] font-bold text-foreground">{area.label}</p>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                    {area.body}
                  </p>
                  <Link
                    href={area.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                  >
                    {area.label} ansehen
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* Weiterführende Seiten */}
      {page && page.seo.internalLinks.length > 0 && (
        <Section tight>
          <SectionHeading eyebrow="Weiterlesen" title="Passende Seiten" />
          <ul className="mt-6 flex flex-wrap gap-3">
            {page.seo.internalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 text-[14px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {link.label}
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
