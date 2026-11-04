import type { Metadata } from 'next';

import { PageHeader } from '@/components/layout/page-header';
import { getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';

import { AnfrageFormular } from './anfrage-formular';

const ROUTE = 'autoschluessel/gehaeuse/anfrage';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Gehäuse-Anfrage: Fahrzeug, Fotos von Schlüssel und Fahrzeugschein',
    description:
      page?.seo.description
      ?? 'Anfrage für ein Autoschlüssel-Gehäuse: Fahrzeug, Anzahl der Tasten, Fotos von Schlüssel und Fahrzeugschein und Kontakt.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/** Anfrage Autoschlüssel-Gehäuse (G-20, E6-BAUMEISTER-02): Formular mit Pflichtfrage Tasten. */
export default async function GehaeuseAnfragePage() {
  const page = await getPageContent(ROUTE);

  return (
    <>
      <PageHeader
        bereich="autoschluessel"
        art="arbeit"
        eyebrow={PROCESS_LABELS['gefuehrte-anfrage'].label}
        title={page?.headline ?? 'Gehäuse-Anfrage'}
        lead={
          page?.subline
          ?? 'Fünf Schritte: Fahrzeug, Tasten, Fotos, Kontakt und Absenden. Mit der Anfrage entsteht noch kein Vertrag.'
        }
        crumbs={[
          { href: '/autoschluessel', label: 'Autoschlüssel' },
          { href: '/autoschluessel/gehaeuse', label: 'Gehäuse' },
          { href: `/${ROUTE}`, label: 'Anfrage' },
        ]}
      />

      <div className="shell py-8 md:py-12">
        <AnfrageFormular />
      </div>
    </>
  );
}
