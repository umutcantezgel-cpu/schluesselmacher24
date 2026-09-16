import type { Metadata } from 'next';
import Link from 'next/link';

import { getPageContent, getSettings } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { AnfrageFormular } from './anfrage-formular';

const ROUTE = 'schluessel-nach-vorlage/anfrage';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Schlüssel nach Vorlage anfragen — acht Schritte',
    description:
      page?.seo.description
      ?? 'Anfrage für einen Schlüssel nach Vorlage: drei Fotos, Angaben zum Schlüssel, '
        + 'Stückzahl und Kontakt. Das Original bleibt zunächst bei Ihnen.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

export default async function SchluesselNachVorlageAnfragePage() {
  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);

  return (
    <>
      <PageHeader
        eyebrow={PROCESS_LABELS['gefuehrte-anfrage'].label}
        title={page?.headline ?? 'Schlüssel nach Vorlage anfragen'}
        lead={
          page?.subline
          ?? 'Acht Schritte: drei Fotos, Angaben zum Schlüssel, Stückzahl und Kontakt. '
            + 'Ihren Originalschlüssel senden Sie zunächst nicht ein.'
        }
        crumbs={[
          { href: '/schluessel-nach-vorlage', label: 'Schlüssel nach Vorlage' },
          { href: '/schluessel-nach-vorlage/anfrage', label: 'Anfrage' },
        ]}
      />

      <div className="shell py-8 md:py-12">
        <AnfrageFormular photoRetentionDays={settings.retentionDays.keyPhotos} />

        <p className="mt-10 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-6 text-[14px]">
          <span className="font-semibold text-foreground-muted">Verwandte Bereiche:</span>
          <Link href="/schluessel-nach-vorlage" className="font-semibold text-primary hover:underline">
            So funktioniert die Anfrage
          </Link>
          <Link href="/schluessel-nach-code" className="font-semibold text-primary hover:underline">
            Schlüssel nach Code
          </Link>
          <Link href="/autoschluessel/kopieren" className="font-semibold text-primary hover:underline">
            Autoschlüssel kopieren
          </Link>
          <Link href="/autoschluessel/programmieren" className="font-semibold text-primary hover:underline">
            Programmieren und anlernen
          </Link>
        </p>
      </div>
    </>
  );
}
