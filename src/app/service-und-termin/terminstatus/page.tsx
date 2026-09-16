import type { Metadata } from 'next';

import { PageHeader } from '@/components/layout/page-header';
import { TerminStatusFormular } from './status-formular';

export const metadata: Metadata = {
  title: 'Terminstatus',
  description:
    'Rufen Sie den Stand Ihres Vorgangs mit Vorgangsnummer und E-Mail-Adresse ab.',
  alternates: { canonical: '/service-und-termin/terminstatus' },
  robots: { index: false, follow: true },
};

export default function TerminStatusPage() {
  return (
    <>
      <PageHeader
        eyebrow="Terminstatus"
        title="Stand Ihres Vorgangs"
        lead="Geben Sie Ihre Vorgangsnummer und die E-Mail-Adresse ein, mit der Sie den Vorgang angelegt haben."
        crumbs={[
          { href: '/service-und-termin', label: 'Service und Termin' },
          { href: '/service-und-termin/terminstatus', label: 'Terminstatus' },
        ]}
      />

      <div className="shell py-8 md:py-12">
        <TerminStatusFormular />
      </div>
    </>
  );
}
