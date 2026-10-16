import type { Metadata } from 'next';
import Link from 'next/link';

import { getCollection, getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
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
        bereich="schliessanlagen"
        art="arbeit"
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
        <SectionHeading nummer="01" eyebrow="Fragen" title="Noch unsicher?" />
        <ul className="mt-8 grid border-t border-border md:grid-cols-2">
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
            <li key={link.href} className="border-b border-border md:pr-10">
              <Link
                href={link.href}
                className="group flex min-h-touch items-start justify-between gap-6 py-6 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="min-w-0">
                  <span className="block text-body font-semibold text-foreground transition-colors duration-quick group-hover:text-primary">
                    {link.label}
                  </span>
                  <span className="mt-2 block max-w-measure text-small text-foreground-muted">
                    {link.body}
                  </span>
                </span>
                <GlyphPfeilRechts
                  size={18}
                  className="mt-1 shrink-0 text-primary transition-transform duration-quick ease-standard motion-reduce:transition-none zeiger:group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
