import type { Metadata } from 'next';

import { SchliessplanPlaner } from '@/components/konfigurator/schliessplan-planer';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { getCollection, getSettings } from '@/lib/data';
import { SeitenDaten } from '@/components/seo/seiten-daten';
import { hilfeAus } from '@/components/forms/hilfe-daten';

/*
 * Schließplan selbst anlegen (E5-OPUS-01, G-27): Türen, Schlüssel und Matrix auf dem Konfigurator-Kern.
 * Die Seite bleibt statisch; ein Plan aus einem Link (?plan=…) wird erst im Browser gelesen.
 */

export const metadata: Metadata = {
  title: 'Schließplan selbst anlegen',
  description:
    'Türen und Schlüssel anlegen, dann ankreuzen, wer welche Tür schließt. Ihr Plan bleibt in '
    + 'diesem Browser gespeichert und lässt sich als Link weitergeben.',
  alternates: { canonical: '/schliessanlagen/konfigurator/schliessplan' },
};

export default async function SchliessplanSeite() {
  const katalog = await getCollection('cylinderCatalog');
  // Sichtbare Brotkrumen, zugleich Grundlage der Strukturdaten (FA-SEO-01C).
  const crumbs = [
    { href: '/schliessanlagen', label: 'Schließanlagen' },
    { href: '/schliessanlagen/konfigurator/schliessplan', label: 'Schließplan' },
  ];

  return (
    <>
      <SeitenDaten pfad="/schliessanlagen/konfigurator/schliessplan" name="Schließplan selbst anlegen" crumbs={crumbs} />
      <PageHeader
        eyebrow="Schließplan"
        bereich="schliessanlagen"
        art="arbeit"
        title="Schließplan selbst anlegen"
        lead="Türen und Schlüssel anlegen, dann ankreuzen, wer welche Tür schließt. Ihr Plan bleibt in diesem Browser gespeichert und lässt sich als Link weitergeben."
        leadClassName="max-sm:hidden"
        crumbs={crumbs}
      />
      <Section tight>
        <SchliessplanPlaner hilfe={hilfeAus(await getSettings())} katalog={katalog} />
      </Section>
    </>
  );
}
