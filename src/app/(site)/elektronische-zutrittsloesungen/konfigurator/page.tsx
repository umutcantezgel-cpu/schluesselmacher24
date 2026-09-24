import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';

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
        <ol className="flex flex-wrap gap-x-4 gap-y-2">
          {QUESTIONS.map((question, index) => (
            <li
              key={question}
              className="inline-flex items-center gap-1.5 text-[13px] text-foreground-muted"
            >
              <span
                aria-hidden
                className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface-muted font-display text-[11px] font-bold text-primary"
              >
                {index + 1}
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
        <h2 className="text-lg font-bold text-foreground">Passende Seiten</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {RELATED_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex items-center gap-1.5 py-2 text-[14px] font-semibold text-primary hover:underline"
              >
                {link.label}
                <ArrowRight size={14} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
