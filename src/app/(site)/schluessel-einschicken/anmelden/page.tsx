import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { getPageContent, getSettings } from '@/lib/data';
import { defaults } from '@/lib/data/defaults';
import { einsendeAngebotFuerWeg } from '@/lib/einsenden/schein';
import { PROCESS_LABELS } from '@/lib/navigation';

import { EinsendeFormular } from './einsende-formular';

const ROUTE = 'schluessel-einschicken/anmelden';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Schlüssel einschicken: Einsendung anmelden',
    description:
      page?.seo.description
      ?? 'Einsendung in fünf Schritten anmelden und den Begleitschein als PDF erhalten: Schlüssel, Nachweis, Versand und Rücksendeanschrift.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/** Einsendung anmelden (G-24, E6-OPUS-02): Formular mit Begleitschein am Ende. */
export default async function EinsendungAnmeldenPage() {
  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);
  const angebot = einsendeAngebotFuerWeg(settings.sendIn ?? defaults.settings().sendIn!);

  return (
    <>
      <PageHeader
        bereich="schluessel-nach-vorlage"
        art="arbeit"
        eyebrow={PROCESS_LABELS['gefuehrte-anfrage'].label}
        title={page?.headline ?? 'Einsendung anmelden'}
        lead={
          page?.subline
          ?? 'Fünf Schritte: Schlüssel, Nachweis, Versand und Rücksendeanschrift. Danach drucken Sie den Begleitschein aus und schicken den Schlüssel ein.'
        }
        crumbs={[
          { href: '/schluessel-einschicken', label: 'Schlüssel einschicken' },
          { href: `/${ROUTE}`, label: 'Anmelden' },
        ]}
      />

      <div className="shell py-8 md:py-12">
        <EinsendeFormular angebot={angebot} />

        <p className="mt-10 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-6 text-small">
          <span className="font-semibold text-foreground-muted">Lieber erst prüfen lassen?</span>
          <Link href="/schluessel-nach-vorlage/anfrage" className="flex min-h-touch items-center font-semibold text-primary hover:underline">
            Foto prüfen lassen, ohne den Schlüssel aus der Hand zu geben
          </Link>
        </p>
      </div>
    </>
  );
}
