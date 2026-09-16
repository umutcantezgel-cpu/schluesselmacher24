import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getCollection, getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';

import { Konfigurator } from './konfigurator';

const ROUTE = 'gleichschliessende-zylinder/konfigurator';

const FALLBACK_TITLE = 'Gleichschließende Zylinder konfigurieren';
const FALLBACK_DESCRIPTION =
  'Zylinder für mehrere Türen mit einer gemeinsamen Schließung zusammenstellen: Bauform, '
  + 'Maß A und Maß B, Funktion, Stückzahl und Anzahl der gemeinsamen Schlüssel.';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? FALLBACK_TITLE,
    description: page?.seo.description ?? FALLBACK_DESCRIPTION,
    alternates: { canonical: `/${ROUTE}` },
  };
}

const RELATED_LINKS = [
  { href: '/gleichschliessende-zylinder#messen', label: 'Zylinder richtig ausmessen' },
  { href: '/gleichschliessende-zylinder#bauformen', label: 'Bauformen im Vergleich' },
  { href: '/schliessanlagen', label: 'Größeres Vorhaben? Zu den Schließanlagen' },
  { href: '/tuer-und-schliesstechnik', label: 'Tür- und Schließtechnik' },
  { href: '/service-und-termin/kontakt', label: 'Frage zur Zusammenstellung stellen' },
];

export default async function CylinderConfiguratorPage() {
  const [page, catalog] = await Promise.all([
    getPageContent(ROUTE),
    getCollection('cylinderCatalog'),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={PROCESS_LABELS.direktkauf.label}
        title={page?.headline ?? 'Gleichschließende Zylinder zusammenstellen'}
        lead={
          page?.subline
          ?? 'Legen Sie für jede Tür eine Position an. Am Ende sehen Sie die vollständige '
            + 'Preisaufstellung und legen die Zusammenstellung in den Warenkorb.'
        }
        crumbs={[
          { href: '/gleichschliessende-zylinder', label: 'Gleichschließende Zylinder' },
          { href: `/${ROUTE}`, label: 'Konfigurator' },
        ]}
      />

      <Section tight>
        <Konfigurator catalog={catalog} />
      </Section>

      {/* Zusatzabstand, damit die feste Ablauf-Navigation nichts verdeckt. */}
      <Section tone="muted" tight className="pb-28 md:pb-14">
        <h2 className="text-lg font-bold text-foreground">Wenn Sie vorher etwas nachlesen möchten</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RELATED_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full items-center justify-between gap-3 rounded-lg border border-border bg-surface px-5 py-4 transition-colors hover:border-primary"
              >
                <span className="text-[14px] font-semibold text-foreground group-hover:text-primary">
                  {link.label}
                </span>
                <ArrowRight
                  size={15}
                  aria-hidden
                  className="shrink-0 text-foreground-subtle transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
