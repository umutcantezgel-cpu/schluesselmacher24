import { Fragment } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getGuide, getGuides } from '@/lib/data';
import { areaByKey } from '@/lib/navigation';
import { ablaufAusText } from '@/lib/visual/motiv';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/json-ld';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { Profillinie } from '@/components/visual/profillinie';
import { getSiteUrl } from '@/lib/site-url';

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = await getGuide(slug);
  if (!guide) return { title: 'Beitrag nicht gefunden' };

  return {
    title: guide.seo.title,
    description: guide.seo.description,
    alternates: { canonical: `/ratgeber/${guide.slug}` },
  };
}

/**
 * Anker einer Zwischenüberschrift: Kleinbuchstaben, Umlaute ausgeschrieben,
 * alles andere außer a–z und 0–9 wird zu „-“ („Prüfen: …“ wird „pruefen-…“).
 */
function ankerKennung(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default async function GuidePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const [guide, allGuides] = await Promise.all([getGuide(slug), getGuides()]);

  if (!guide) notFound();

  const area = areaByKey(guide.topic);
  const related = allGuides.filter((g) => g.topic === guide.topic && g.id !== guide.id).slice(0, 3);

  const crumbs = [
    { href: '/ratgeber', label: 'Ratgeber' },
    { href: `/ratgeber/${guide.slug}`, label: guide.title },
  ];

  // Der Gedankenstrich hängt am Ende der ersten Zeile, nicht vorn in der zweiten (Befund D00/M00).
  const anzeigeTitel = guide.title.replace(' — ', ' — ');

  // Weiterlesen: verwandte Beiträge zuerst, dann die internen Links – ohne den Schritt-Knopf
  // und ohne doppelte Ziele.
  const weiterlesen = [
    ...related.map((item) => ({ href: `/ratgeber/${item.slug}`, label: item.title })),
    ...guide.seo.internalLinks,
  ].filter(
    (eintrag, index, alle) =>
      eintrag.href !== guide.nextStep.href && alle.findIndex((e) => e.href === eintrag.href) === index,
  );

  // Inhaltsverzeichnis: zweimal gebaut – vor dem Text (Telefon, Tablet) und in der Seitenleiste (ab lg).
  // Nur die Seitenleiste trägt die Leiste des Lesefortschritts (B-24).
  const inhalt = (leiste: boolean) => (
    <div className={leiste ? 'relative pl-5' : undefined}>
      {leiste && (
        <>
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-border" />
          <span aria-hidden="true" className="sm24-lesen-leiste absolute inset-y-0 left-0 w-0.5 bg-primary" />
        </>
      )}
      <ol className="border-t border-border">
        {guide.body.map((block, index) => {
          const zu = index < 6 ? index + 1 : undefined;
          return (
            <li key={block.heading} className="border-b border-border">
              <a
                href={`#${ankerKennung(block.heading)}`}
                className="inline-flex min-h-touch w-full items-center gap-3 text-small font-semibold text-foreground transition-colors duration-quick hover:text-primary"
              >
                <span
                  className={
                    zu
                      ? 'sm24-lesen-nummer font-mono text-caption tabular-nums text-foreground-muted'
                      : 'font-mono text-caption tabular-nums text-foreground-muted'
                  }
                  data-zu={zu}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                {block.heading}
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );

  return (
    <>
      <JsonLd data={articleSchema(guide)} />
      <JsonLd data={breadcrumbSchema(crumbs, `${getSiteUrl()}/ratgeber/${guide.slug}`)} />

      <PageHeader
        eyebrow={area?.label ?? 'Ratgeber'}
        title={anzeigeTitel}
        lead={guide.excerpt}
        crumbs={crumbs}
        /* Blickfang im Kopf (E4-L-23): die Ablaufzeichnung aus der Unterzeile, sonst die Fachgrafik zum Motiv. */
        visual={
          <ImagePlaceholder
            slot={{ ...guide.image, visual: ablaufAusText(guide.excerpt) ?? guide.image.visual }}
            sizes="(min-width: 1024px) 40vw, 100vw"
            frei
          />
        }
      />

      {/* Raster: Text 8 Spalten, Seitenleiste 4. Der gemeinsame Vorfahr trägt den Lesefortschritt (B-24). */}
      <div className="sm24-lesen shell grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-gutter">
        {/* Telefon und Tablet: Inhaltsverzeichnis vor dem Text */}
        <nav aria-label="Inhalt" className="lg:hidden">
          {inhalt(false)}
        </nav>

        <article className="sm24-lesen-artikel min-w-0 lg:col-span-8">
          {/* Der Text beginnt am Artikelanfang: der Abstand der ersten Überschrift hebt sich auf. */}
          <div className="prose-sm24 -mt-12">
            {guide.body.map((block, index) => (
              <Fragment key={block.heading}>
                {/* Trenner zwischen zwei Abschnitten: die Profillinie (B-02), gleicher Abstand oben und unten. */}
                {index > 0 && <Profillinie text={block.heading} className="my-12 text-primary" />}
                <section data-abschnitt={index < 6 ? index + 1 : undefined}>
                  <h2 id={ankerKennung(block.heading)} className="scroll-mt-28">
                    <span aria-hidden="true" className="block font-mono text-small font-semibold tabular-nums text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {block.heading}
                  </h2>
                  <p>{block.text}</p>
                </section>
              </Fragment>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-border bg-surface p-4 sm:p-6">
            <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
              Ihr nächster Schritt
            </p>
            <ButtonLink
              href={guide.nextStep.href}
              className="mt-4 w-full justify-between text-left sm:w-auto"
              pfeil
            >
              {guide.nextStep.label}
            </ButtonLink>
          </div>
        </article>

        <aside className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <div className="space-y-8">
            <nav aria-label="Inhalt" className="hidden lg:block">
              {inhalt(true)}
            </nav>

            {weiterlesen.length > 0 && (
              <div>
                <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Weiterlesen</p>
                <ul className="mt-3 border-t border-border">
                  {weiterlesen.map((eintrag) => (
                    <li key={eintrag.href} className="border-b border-border">
                      <Link
                        href={eintrag.href}
                        className="group flex min-h-touch items-center justify-between gap-3 py-3 text-small font-semibold text-foreground transition-colors duration-quick hover:text-primary"
                      >
                        {eintrag.label}
                        <GlyphPfeilRechts
                          size={16}
                          className="shrink-0 text-primary transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
