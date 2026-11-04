import type { Metadata } from 'next';

import { PageHeader } from '@/components/layout/page-header';
import { getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';

import { AnfrageFormular } from './anfrage-formular';

const ROUTE = 'motorradschluessel/anfrage';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Motorradschlüssel: Anfrage mit Fahrzeugschein und Foto',
    description:
      page?.seo.description
      ?? 'Anfrage für einen Motorradschlüssel: Typ, Baujahr, Angabe zum Chip, Fotos von Schlüssel und Fahrzeugschein und Kontakt.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/** Anfrage Motorradschlüssel (G-19, E6-BAUMEISTER-01): Formular mit Pflichtfrage Transponder. */
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
          ?? 'Fünf Schritte: Motorrad, Chip, Fotos, Kontakt und Absenden. Mit der Anfrage entsteht noch kein Vertrag.'
        }
        crumbs={[
          { href: '/motorradschluessel', label: 'Motorradschlüssel' },
          { href: `/${ROUTE}`, label: 'Anfrage' },
        ]}
      />

      <div className="shell py-8 md:py-12">
        <AnfrageFormular />
      </div>
    </>
  );
}
