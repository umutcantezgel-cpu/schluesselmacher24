import type { Metadata } from 'next';

import { SchliessplanPlaner } from '@/components/konfigurator/schliessplan-planer';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { getCollection } from '@/lib/data';

/*
 * Schließplan selbst anlegen (E5-OPUS-01, G-27): Türen, Schlüssel und Matrix auf dem Konfigurator-Kern.
 * Die Seite bleibt statisch; ein Plan aus einem Link (?plan=…) wird erst im Browser gelesen.
 */

export const metadata: Metadata = {
  title: 'Schließplan selbst anlegen',
  description:
    'Türen und Schlüssel anlegen und ankreuzen, wer welche Tür schließt. Eine Sperrschließung bestellen Sie direkt mit Preis, '
    + 'für eine Schließanlage mit Ebenen schicken wir Ihnen ein Angebot. Der Plan lässt sich als Link speichern.',
  alternates: { canonical: '/schliessanlagen/konfigurator/schliessplan' },
};

export default async function SchliessplanSeite() {
  const katalog = await getCollection('cylinderCatalog');
  return (
    <>
      <PageHeader
        eyebrow="Schließplan"
        bereich="schliessanlagen"
        art="arbeit"
        title="Schließplan selbst anlegen"
        lead="Türen und Schlüssel anlegen, dann ankreuzen, wer welche Tür schließt. Ihr Plan bleibt in diesem Browser gespeichert und lässt sich als Link weitergeben."
        leadClassName="max-sm:hidden"
        crumbs={[
          { href: '/schliessanlagen', label: 'Schließanlagen' },
          { href: '/schliessanlagen/konfigurator/schliessplan', label: 'Schließplan' },
        ]}
      />
      <Section tight>
        <SchliessplanPlaner katalog={katalog} />
      </Section>
    </>
  );
}
