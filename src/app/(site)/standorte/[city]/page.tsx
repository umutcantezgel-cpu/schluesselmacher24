import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getCities, getCity } from '@/lib/data';
import { areaByKey } from '@/lib/navigation';
import { enthaeltPlatzhalter, istPlatzhalter } from '@/lib/platzhalter';
import { cn } from '@/lib/cn';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { AreaScope } from '@/components/visual/area-scope';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { JsonLd, breadcrumbSchema, serviceAreaSchema } from '@/components/seo/json-ld';
import { getSiteUrl } from '@/lib/site-url';

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

/** Platzhalter aus den Inhalten („[Platzhalter …]“, „… eintragen“) erscheinen nie als Fakt (MENSCHEN M-03). */
const alsFakt = (wert: string) => !istPlatzhalter(wert) && !enthaeltPlatzhalter(wert);

export default async function CityPage(props: { params: Promise<{ city: string }> }) {
  const { city: slug } = await props.params;
  const city = await getCity(slug);

  if (!city) notFound();

  const areas = city.servicesOffered.map((key) => areaByKey(key)).filter(Boolean);
  const einleitung = alsFakt(city.localIntro) ? city.localIntro : null;
  const angaben = city.localFacts.filter((fact) => alsFakt(fact.value));

  const crumbs = [
    { href: '/standorte', label: 'Einsatzgebiete' },
    { href: `/standorte/${city.slug}`, label: city.city },
  ];

  return (
    <>
      <JsonLd data={serviceAreaSchema(city)} />
      <JsonLd data={breadcrumbSchema(crumbs, `${getSiteUrl()}/standorte/${city.slug}`)} />

      <PageHeader
        eyebrow={city.state}
        title={`Schlüssel- und Schließtechnik in ${city.city}`}
        lead={`Vor-Ort-Leistungen im Umkreis von etwa ${city.onSiteRadiusKm} km. Bestellungen aus dem Shop liefern wir deutschlandweit.`}
        crumbs={crumbs}
        actions={
          <ButtonLink href="/autoschluessel/anfrage" pfeil>
            Autoschlüssel-Termin
          </ButtonLink>
        }
        visual={
          <ImagePlaceholder
            slot={{
              motif: `Einsatzgebiet ${city.city}: Schlüssel- und Schließtechnik vor Ort`,
              ratio: '4/3',
              visual: { generator: 'schluessel', params: { typ: 'funk' } },
            }}
          />
        }
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <SectionHeading
            className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start"
            nummer="01"
            eyebrow="Einsatzgebiet"
            title={`${city.city} und Umgebung`}
          />

          <div className="lg:col-span-7 lg:col-start-6">
            {einleitung && <p className="max-w-measure text-lead text-foreground-muted">{einleitung}</p>}

            {/* Angaben als Schriftfeld: Haarlinien, Werte groß, Zahlen in Mono. Platzhalter entfallen. */}
            {angaben.length > 0 && (
              <dl className={cn('grid border-y border-border sm:grid-cols-2', einleitung && 'mt-10')}>
                {angaben.map((fact, index) => (
                  <div
                    key={fact.label}
                    className={cn(
                      'py-5',
                      index > 0 && 'border-t border-border sm:border-t-0 sm:border-l sm:pl-6',
                    )}
                  >
                    <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                      {fact.label}
                    </dt>
                    <dd
                      className={cn(
                        'mt-2 text-title-sm font-semibold text-foreground',
                        /\d/.test(fact.value) && 'font-mono tabular-nums',
                      )}
                    >
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading nummer="02" eyebrow="Leistungen" title="Bereiche in dieser Region" />

        {/* Haarlinienliste wie auf den Bereichsseiten: die ganze Zeile ist der Link, ab lg zwei Spalten */}
        <ul className="mt-12 grid border-t border-border lg:grid-cols-2">
          {areas.map((area, index) => (
            <li key={area!.key} className={cn('border-b border-border', index % 2 === 1 && 'lg:border-l')}>
              <AreaScope area={area!.key}>
                <Link
                  href={area!.href}
                  className={cn(
                    'group flex min-h-touch-lg items-start gap-4 py-5 transition-colors duration-quick sm:gap-6 sm:py-6',
                    index % 2 === 1 ? 'lg:pl-gutter' : 'lg:pr-gutter',
                  )}
                >
                  <BereichIcon area={area!.key} size={40} className="mt-0.5 shrink-0 text-area-strong" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-title-sm font-semibold text-foreground transition-colors duration-quick group-hover:text-area-strong">
                      {area!.label}
                    </span>
                    <span className="mt-1 block max-w-measure text-small leading-relaxed text-foreground-muted">
                      {area!.summary}
                    </span>
                  </span>
                  <GlyphPfeilRechts
                    size={18}
                    className="mt-2 shrink-0 text-foreground-muted transition-transform duration-quick group-hover:translate-x-1"
                  />
                </Link>
              </AreaScope>
            </li>
          ))}
        </ul>

        {/* Weiterlesen: interne Links als Stückliste, die ganze Zeile ist der Link */}
        <ul className="mt-12 border-t border-border">
          {city.seo.internalLinks.map((link) => (
            <li key={link.href} className="border-b border-border">
              <Link
                href={link.href}
                className="group flex min-h-touch items-center justify-between gap-4 py-4 text-body font-semibold text-foreground transition-colors duration-quick hover:text-primary"
              >
                {link.label}
                <GlyphPfeilRechts
                  size={18}
                  className="shrink-0 text-primary transition-transform duration-quick group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
