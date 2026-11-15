import type { Metadata } from 'next';

import { PageHeader } from '@/components/layout/page-header';
import { TerminStatusFormular } from './status-formular';
import { SeitenDaten } from '@/components/seo/seiten-daten';

export const metadata: Metadata = {
  title: 'Terminstatus',
  description:
    'Rufen Sie den Stand Ihres Auftrags mit Vorgangsnummer und E-Mail-Adresse ab.',
  alternates: { canonical: '/service-und-termin/terminstatus' },
  robots: { index: false, follow: true },
};

export default function TerminStatusPage() {
  // Sichtbare Brotkrumen, zugleich Grundlage der Strukturdaten (FA-SEO-01C).
  const crumbs = [
    { href: '/service-und-termin', label: 'Service und Termin' },
    { href: '/service-und-termin/terminstatus', label: 'Terminstatus' },
  ];

  return (
    <>
      <SeitenDaten pfad="/service-und-termin/terminstatus" name="Stand Ihres Auftrags" crumbs={crumbs} />
      <PageHeader
        eyebrow="Terminstatus"
        bereich="service-und-termin"
        art="arbeit"
        title="Stand Ihres Auftrags"
        lead="Geben Sie Ihre Vorgangsnummer und Ihre E-Mail-Adresse ein. Dann sehen Sie, wie weit Ihr Auftrag oder Ihre Anfrage ist."
        crumbs={crumbs}
      />

      <div className="shell py-8 md:py-12">
        <TerminStatusFormular />
      </div>
    </>
  );
}
