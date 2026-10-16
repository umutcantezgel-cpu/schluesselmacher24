import type { Metadata } from 'next';
import Link from 'next/link';

import { getCities } from '@/lib/data';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { Alert } from '@/components/ui/alert';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { GlyphOrt } from '@/components/visual/glyphen/ort';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

export const metadata: Metadata = {
  title: 'Einsatzgebiete',
  description:
    'Vor-Ort-Leistungen in ausgewählten Regionen, Versand von Schlüsseln und Zylindern '
    + 'deutschlandweit.',
  alternates: { canonical: '/standorte' },
};

export default async function StandortePage() {
  const cities = await getCities();

  return (
    <>
      <PageHeader
        eyebrow="Einsatzgebiete"
        title="Vor Ort und deutschlandweit"
        lead="Schlüssel nach Code und gleichschließende Zylinder versenden wir deutschlandweit. Vor-Ort-Leistungen erbringen wir in den hier aufgeführten Gebieten."
        crumbs={[{ href: '/standorte', label: 'Einsatzgebiete' }]}
        visual={
          <ImagePlaceholder
            slot={{
              motif: 'Einsatzgebiete: Anfrage, Termin und Einsatz vor Ort',
              ratio: '16/9',
              visual: { generator: 'schluessel', params: { typ: 'zylinder' } },
            }}
          />
        }
      />

      <Section>
        <SectionHeading
          nummer="01"
          eyebrow="Vor-Ort-Gebiete"
          title="Regionen"
          lead="Jede Region hat eigene Angaben zu Anfahrt und angebotenen Leistungen."
        />

        {/* Stückliste mit Haarlinien: die ganze Zeile ist der Link. Mobil eine Spalte, ab 768 px zwei. */}
        <ul className="mt-10 border-t border-border md:grid md:grid-cols-2 md:gap-x-gutter">
          {cities.map((city) => (
            <li key={city.id} className="border-b border-border">
              <Link
                href={`/standorte/${city.slug}`}
                className="group flex min-h-touch-lg items-center gap-4 py-5 transition-colors duration-quick sm:gap-6 sm:py-6"
              >
                <GlyphOrt size={24} className="shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block text-title-sm font-semibold text-foreground transition-colors duration-quick group-hover:text-primary">
                    {city.city}
                  </span>
                  <span className="mt-1 block text-small text-foreground-muted">
                    {city.state} · Einsatzradius etwa{' '}
                    <span className="whitespace-nowrap font-mono tabular-nums text-foreground">{city.onSiteRadiusKm} km</span>
                  </span>
                </span>
                <GlyphPfeilRechts
                  size={18}
                  className="shrink-0 text-foreground-muted transition-transform duration-quick group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>

        <Alert tone="info" title="Ihre Region ist nicht dabei?" className="mt-10">
          Bestellungen aus dem Shop liefern wir deutschlandweit. Für Vor-Ort-Leistungen außerhalb
          der aufgeführten Gebiete stellen Sie bitte eine{' '}
          <Link href="/service-und-termin/anfrage" className="font-semibold underline">
            allgemeine Anfrage
          </Link>{' '}
          — wir sagen Ihnen, was möglich ist.
        </Alert>
      </Section>
    </>
  );
}
