import type { Metadata } from 'next';
import Link from 'next/link';

import { getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

import { ZutrittKonfigurator } from './zutritt-konfigurator';

const ROUTE = 'elektronische-zutrittsloesungen/konfigurator';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Zutrittskonfigurator — Bedarf erfassen',
    description:
      page?.seo.description
      ?? 'Acht Fragen zu Objekt, Umfang, Identmedien, Verwaltung, Berechtigungen, Standorten, '
        + 'Integration und Service. Daraus erstellen wir Ihr Angebot für die elektronische '
        + 'Zutrittslösung.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/* Acht Abfragen — die Reihenfolge entspricht der Reihenfolge im Konfigurator. */
const QUESTIONS = [
  'Objekt',
  'Umfang',
  'Identmedium',
  'Verwaltung',
  'Berechtigungen',
  'Standorte',
  'Integration',
  'Service',
];

const RELATED_LINKS = [
  { href: '/elektronische-zutrittsloesungen', label: 'Überblick elektronische Zutrittslösungen' },
  { href: '/ratgeber/mechanisch-oder-elektronisch', label: 'Ratgeber: mechanisch oder elektronisch?' },
  { href: '/schliessanlagen', label: 'Mechanische Schließanlagen' },
  { href: '/schliessanlagen/konfigurator', label: 'Konfigurator für Schließanlagen' },
  { href: '/service-und-termin/kontakt', label: 'Kontakt' },
];

export default async function ZutrittKonfiguratorPage() {
  const page = await getPageContent(ROUTE);
  const process = PROCESS_LABELS.projektkonfigurator;

  return (
    <>
      <PageHeader
        art="arbeit"
        bereich="elektronische-zutrittsloesungen"
        eyebrow={process.label}
        title={page?.headline ?? 'Zutrittskonfigurator'}
        lead={
          page?.subline
          ?? 'Acht Fragen zu Ihrem Objekt. Am Ende sehen Sie alle Angaben noch einmal, bevor Sie '
            + 'absenden.'
        }
        crumbs={[
          { href: '/elektronische-zutrittsloesungen', label: 'Elektronische Zutrittslösungen' },
          { href: `/${ROUTE}`, label: 'Konfigurator' },
        ]}
      >
        {/* Die acht Abfragen als Stückliste: Mono-Nummer und Name, Haarlinien statt Kreise */}
        <ol className="grid gap-x-8 border-b border-border sm:grid-cols-2">
          {QUESTIONS.map((question, index) => (
            <li
              key={question}
              className="flex items-baseline gap-4 border-t border-border py-2.5 text-small text-foreground"
            >
              <span className="font-mono text-caption tabular-nums text-foreground-muted">
                {String(index + 1).padStart(2, '0')}
              </span>
              {question}
            </li>
          ))}
        </ol>
      </PageHeader>

      <Section tight>
        <div className="mx-auto max-w-3xl">
          <Alert tone="info" title="Was Sie hier bekommen — und was nicht" className="mb-8">
            <p>
              {process.hint} Preise nennen wir erst, wenn wir die Türsituation kennen: Sie hängen
              von Türanzahl, Medien, Verwaltungsart und Montageumfang ab. Ihre Angaben bleiben bis
              zum Absenden in diesem Browser gespeichert, Sie können also jederzeit unterbrechen.
            </p>
          </Alert>

          <ZutrittKonfigurator />
        </div>
      </Section>

      <Section tone="muted" tight>
        <SectionHeading nummer="01" eyebrow="Weiterlesen" title="Passende Seiten" />
        <ul className="mt-8 grid border-t border-border sm:grid-cols-2 sm:gap-x-8">
          {RELATED_LINKS.map((link) => (
            <li key={link.href} className="border-b border-border">
              <Link
                href={link.href}
                className="group flex min-h-touch items-center justify-between gap-4 py-4 text-body font-semibold text-foreground hover:text-primary"
              >
                {link.label}
                <GlyphPfeilRechts
                  size={16}
                  className="shrink-0 text-primary transition-transform duration-quick ease-standard motion-reduce:transition-none zeiger:group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
