import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getCollection, getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { ProjektKonfigurator, type DoorTypeOption } from './projekt-konfigurator';

const ROUTE = 'schliessanlagen/konfigurator';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Projektkonfigurator Schließanlage',
    description:
      page?.seo.description
      ?? 'Erfassen Sie Ihr Schließanlagen-Projekt in zehn Blöcken: Objekt, Nutzer, Bestand, '
        + 'Türen, Berechtigungen, Schlüssel, Unterlagen und Service. Zwischenstand wird gespeichert.',
    alternates: { canonical: '/schliessanlagen/konfigurator' },
  };
}

export default async function SchliessanlagenKonfiguratorPage() {
  const [page, catalog] = await Promise.all([
    getPageContent(ROUTE),
    getCollection('cylinderCatalog'),
  ]);

  // Bauformen kommen aus der Datenschicht — hier ohne Preisangaben.
  const doorTypes: DoorTypeOption[] = catalog.forms
    .filter((form) => form.active)
    .map((form) => ({
      id: form.id,
      label: form.label,
      description: form.description,
      measureLabels: form.measureLabels,
      info: form.info,
    }));

  const process = PROCESS_LABELS.projektkonfigurator;

  return (
    <>
      <PageHeader
        eyebrow={process.label}
        title={page?.headline ?? 'Projektkonfigurator Schließanlage'}
        lead={
          page?.subline
          ?? 'Zehn Blöcke, mobil bedienbar. Sie können jederzeit unterbrechen — Ihr Zwischenstand '
            + 'bleibt in diesem Browser erhalten.'
        }
        crumbs={[
          { href: '/schliessanlagen', label: 'Schließanlagen' },
          { href: '/schliessanlagen/konfigurator', label: 'Projektkonfigurator' },
        ]}
      />

      <Section tight>
        <ProjektKonfigurator
          doorTypes={doorTypes}
          measuringInfo={catalog.measuringInfo}
        />
      </Section>

      <Section tone="muted" tight>
        <h2 className="text-xl font-bold text-foreground">Noch unsicher?</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: '/schliessanlagen#systeme',
              label: 'Systeme im Vergleich',
              body: 'Gleichschließung, Zentralschloss, Hauptschlüssel und Generalhauptschlüssel.',
            },
            {
              href: '/gleichschliessende-zylinder',
              label: 'Nur wenige Türen?',
              body: 'Dann genügt meist eine Gleichschließung — direkt konfigurierbar.',
            },
            {
              href: '/elektronische-zutrittsloesungen',
              label: 'Lieber elektronisch?',
              body: 'Rechte ändern, ohne Zylinder zu tauschen.',
            },
            {
              href: '/ratgeber/welche-schliessanlage-passt',
              label: 'Entscheidungshilfe',
              body: 'Welche Anlage zu welchem Objekt passt.',
            },
            {
              href: '/tuer-und-schliesstechnik',
              label: 'Tür- und Schließtechnik',
              body: 'Wenn zuerst die Tür selbst instand gesetzt werden muss.',
            },
            {
              href: '/service-und-termin/kontakt',
              label: 'Kontakt',
              body: 'Wenn Sie eine Frage vorab klären möchten.',
            },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
              >
                <span className="text-[15px] font-bold text-foreground group-hover:text-primary">
                  {link.label}
                </span>
                <span className="mt-1.5 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                  {link.body}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                  Ansehen
                  <ArrowRight size={14} aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
