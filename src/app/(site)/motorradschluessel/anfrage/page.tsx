import type { Metadata } from 'next';

import { PageHeader } from '@/components/layout/page-header';
import { getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';

import { FahrzeugAnfrageInhalt, robotsNachStand } from '@/components/fahrzeug-anfrage/seiten';

const ROUTE = 'motorradschluessel/anfrage';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Motorradschlüssel anfragen',
    description:
      page?.seo.description
      ?? 'Motorradschlüssel in sechs Schritten: Motorrad, Schlüssel und Chip, Unterlagen und drei Fotos, Beschreibung, Kontakt und Absenden. Die Anfrage ist kein Vertrag.',
    alternates: { canonical: `/${ROUTE}` },
    // Schalter `indexierbar` der Klasse (ANFRAGE_FORMULAR.motorrad), wie bei den anderen Klassen; Rubrik nicht live: noindex.
    ...(await robotsNachStand('motorrad')),
  };
}

/**
 * Anfrage Motorradschlüssel (G-19, E6-BAUMEISTER-01): seit FA-KERN-02B die gemeinsame Fahrzeugschlüssel-Anfrage
 * mit der Klasse „motorrad“, Katalogsuche der Krafträder und Pflichtfrage Transponder.
 */
export default async function MotorradAnfragePage() {
  const page = await getPageContent(ROUTE);

  return (
    <>
      <PageHeader
        bereich="autoschluessel"
        art="arbeit"
        eyebrow={PROCESS_LABELS['gefuehrte-anfrage'].label}
        title={page?.headline ?? 'Motorradschlüssel anfragen'}
        lead={
          page?.subline
          ?? 'Sechs Schritte: Motorrad, Schlüssel, Unterlagen, Beschreibung, Kontakt und Absenden. Mit der Anfrage entsteht noch kein Vertrag.'
        }
        crumbs={[
          { href: '/motorradschluessel', label: 'Motorradschlüssel' },
          { href: `/${ROUTE}`, label: 'Anfrage' },
        ]}
      />

      <div className="shell py-8 md:py-12">
        <FahrzeugAnfrageInhalt klasse="motorrad" />
      </div>
    </>
  );
}
