import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

import { getCities } from '@/lib/data';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { Alert } from '@/components/ui/alert';

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
      />

      <Section>
        <SectionHeading
          title="Regionen"
          lead="Jede Region hat eigene Angaben zu Anfahrt und angebotenen Leistungen."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <li key={city.id}>
              <Link
                href={`/standorte/${city.slug}`}
                className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
              >
                <span className="flex items-center gap-2 text-[15px] font-bold text-foreground group-hover:text-primary">
                  <MapPin size={16} aria-hidden className="text-primary" />
                  {city.city}
                </span>
                <span className="mt-1 block text-[13px] text-foreground-subtle">{city.state}</span>
                <span className="mt-3 flex-1 text-[13px] leading-relaxed text-foreground-muted">
                  Einsatzradius etwa {city.onSiteRadiusKm} km
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                  Details ansehen
                  <ArrowRight size={14} aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Alert tone="info" title="Ihre Region ist nicht dabei?" className="mt-8">
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
