
import type { Metadata } from 'next';
import Link from 'next/link';

import { getCollection, getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

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
        art="arbeit"
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
        <h2 className="text-title-sm font-semibold text-foreground">Wenn Sie vorher etwas nachlesen möchten</h2>
        <ul className="mt-5 border-t border-border">
          {RELATED_LINKS.map((link) => (
            <li key={link.href} className="border-b border-border">
              <Link
                href={link.href}
                className="group flex min-h-touch items-center justify-between gap-4 py-5 transition-colors duration-quick hover:text-primary"
              >
                <span className="text-small font-semibold text-foreground group-hover:text-primary">
                  {link.label}
                </span>
                <GlyphPfeilRechts
                  size={16}
                  className="shrink-0 text-foreground-muted transition-transform duration-quick group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
