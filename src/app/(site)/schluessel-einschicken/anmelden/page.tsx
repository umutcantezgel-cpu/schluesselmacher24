import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { getPageContent, getSettings } from '@/lib/data';
import { defaults } from '@/lib/data/defaults';
import { PROCESS_LABELS } from '@/lib/navigation';

import { EinsendeFormular } from './einsende-formular';
import { SeitenDaten } from '@/components/seo/seiten-daten';
import { hilfeAus } from '@/components/forms/hilfe-daten';

const ROUTE = 'schluessel-einschicken/anmelden';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Schlüssel-Einsendung anmelden',
    description:
      page?.seo.description
      ?? 'Einsendung in fünf Schritten anmelden und den Begleitschein als PDF erhalten: Schlüssel, Nachweis, Versand und Rücksendeanschrift.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/** Einsendung anmelden (G-24, E6-OPUS-02): Formular mit Begleitschein am Ende. */
export default async function EinsendungAnmeldenPage() {
  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);
  const einstellungen = settings.sendIn ?? defaults.settings().sendIn!;

  // Sichtbare Brotkrumen, zugleich Grundlage der Strukturdaten (FA-SEO-01C).
  const crumbs = [
    { href: '/schluessel-einschicken', label: 'Schlüssel einschicken' },
    { href: `/${ROUTE}`, label: 'Anmelden' },
  ];

  return (
    <>
      <SeitenDaten pfad={`/${ROUTE}`} name={page?.headline ?? 'Einsendung anmelden'} crumbs={crumbs} />
      <PageHeader
        bereich="schluessel-nach-vorlage"
        art="arbeit"
        eyebrow={PROCESS_LABELS['gefuehrte-anfrage'].label}
        title={page?.headline ?? 'Einsendung anmelden'}
        lead={
          page?.subline
          ?? 'Fünf Schritte: Schlüssel, Nachweis, Versand und Rücksendeanschrift. Danach drucken Sie den Begleitschein aus und schicken den Schlüssel ein.'
        }
        crumbs={crumbs}
      />

      <div className="shell py-8 md:py-12">
        <EinsendeFormular hilfe={hilfeAus(settings)} einstellungen={einstellungen} />

        <p className="mt-10 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-6 text-small">
          <span className="font-semibold text-foreground-muted">Lieber erst prüfen lassen? Ihr Schlüssel bleibt dabei zunächst bei Ihnen.</span>
          <Link href="/schluessel-nach-vorlage/anfrage" className="flex min-h-touch items-center font-semibold text-primary hover:underline">
            Schlüssel prüfen lassen
          </Link>
        </p>
      </div>
    </>
  );
}
