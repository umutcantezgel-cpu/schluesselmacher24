import type { Metadata } from 'next';

import { NAV_AREAS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { AllgemeineAnfrage } from './anfrage-formular';

export const metadata: Metadata = {
  title: 'Allgemeine Anfrage',
  description:
    'Stellen Sie eine Anfrage, wenn Ihr Anliegen in keinen der Fachbereiche passt. Wir melden '
    + 'uns mit einer Einschätzung.',
  alternates: { canonical: '/service-und-termin/anfrage' },
};

export default async function AnfragePage(props: {
  searchParams: Promise<{ thema?: string }>;
}) {
  const { thema } = await props.searchParams;

  const themen = NAV_AREAS.map((area) => ({
    key: area.key,
    label: area.label,
    summary: area.summary,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Geführte Anfrage"
        title="Allgemeine Anfrage"
        lead="Wenn Ihr Anliegen in keinen der Fachbereiche passt: Beschreiben Sie kurz, worum es geht. Wir melden uns mit einer Einschätzung."
        crumbs={[
          { href: '/service-und-termin', label: 'Service und Termin' },
          { href: '/service-und-termin/anfrage', label: 'Anfrage' },
        ]}
      />

      <div className="shell py-8 md:py-12">
        <AllgemeineAnfrage themen={themen} vorauswahl={thema} />
      </div>
    </>
  );
}
