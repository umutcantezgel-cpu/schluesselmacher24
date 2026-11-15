import type { Metadata } from 'next';

import { PageHeader } from '@/components/layout/page-header';
import { getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';

import { FahrzeugAnfrageInhalt, robotsFuer } from '@/components/fahrzeug-anfrage/seiten';

const ROUTE = 'motorradschluessel/anfrage';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Motorradschlüssel: Anfrage mit Fahrzeugschein und drei Fotos',
    description:
      page?.seo.description
      ?? 'Anfrage für einen Motorradschlüssel: Typ und Baujahr, Angabe zum Chip, Fahrzeugschein, drei Fotos des Schlüssels und eine kurze Beschreibung.',
    alternates: { canonical: `/${ROUTE}` },
    // Schalter `indexierbar` der Klasse (ANFRAGE_FORMULAR.motorrad), wie bei den anderen Klassen.
    ...robotsFuer('motorrad'),
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
