import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import { getCities, getCity } from '@/lib/data';
import { areaByKey } from '@/lib/navigation';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, breadcrumbSchema, serviceAreaSchema } from '@/components/seo/json-ld';

export async function generateStaticParams() {
  const cities = await getCities();
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await props.params;
  const city = await getCity(slug);
  if (!city) return { title: 'Einsatzgebiet nicht gefunden' };

  return {
    title: city.seo.title,
    description: city.seo.description,
    alternates: { canonical: `/standorte/${city.slug}` },
  };
}

export default async function CityPage(props: { params: Promise<{ city: string }> }) {
  const { city: slug } = await props.params;
  const city = await getCity(slug);

  if (!city) notFound();

  const areas = city.servicesOffered.map((key) => areaByKey(key)).filter(Boolean);

  const crumbs = [
    { href: '/standorte', label: 'Einsatzgebiete' },
    { href: `/standorte/${city.slug}`, label: city.city },
  ];

  return (
    <>
      <JsonLd data={serviceAreaSchema(city)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <PageHeader
        eyebrow={city.state}
        title={`Schlüssel- und Schließtechnik in ${city.city}`}
        lead={`Vor-Ort-Leistungen im Umkreis von etwa ${city.onSiteRadiusKm} km. Bestellungen aus dem Shop liefern wir deutschlandweit.`}
        crumbs={crumbs}
        actions={
          <ButtonLink href="/autoschluessel/anfrage">
            Autoschlüssel-Termin
            <ArrowRight size={16} aria-hidden />
          </ButtonLink>
        }
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div>
            <SectionHeading title={`Was wir in ${city.city} anbieten`} />
            <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
              {city.localIntro}
            </p>

            <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {city.localFacts.map((fact) => (
                <div key={fact.label} className="border-t border-border pt-3">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-[15px] text-foreground">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <ImagePlaceholder
            slot={{
              motif: `Foto Einsatzgebiet ${city.city}: Servicefahrzeug oder Montagesituation`,
              ratio: '4/3',
              note: 'Echtes Foto aus dem Einsatzgebiet, kein Stadtmotiv aus einer Bilddatenbank.',
            }}
          />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Leistungen" title="Bereiche in dieser Region" />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <li key={area!.key}>
              <Card className="h-full">
                <CardBody className="flex h-full flex-col">
                  <p className="text-[15px] font-bold text-foreground">{area!.label}</p>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-foreground-muted">
                    {area!.summary}
                  </p>
                  <Link
                    href={area!.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline"
                  >
                    Zum Bereich
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-4">
          {city.seo.internalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-semibold text-primary hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
