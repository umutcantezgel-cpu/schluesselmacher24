import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getGuide, getGuides } from '@/lib/data';
import { areaByKey } from '@/lib/navigation';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/json-ld';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
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

  // Inhaltsverzeichnis: einmal gebaut, je nach Breite vor dem Text oder oben in der Seitenleiste.
  const inhalt = (
    <ol className="border-t border-border">
      {guide.body.map((block, index) => (
        <li key={block.heading} className="border-b border-border">
          <a
            href={`#${ankerKennung(block.heading)}`}
            className="inline-flex min-h-touch w-full items-center gap-3 text-small font-semibold text-foreground transition-colors duration-quick hover:text-primary"
          >
            <span className="font-mono text-caption tabular-nums text-foreground-muted">
              {String(index + 1).padStart(2, '0')}
            </span>
            {block.heading}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <JsonLd data={articleSchema(guide)} />
      <JsonLd data={breadcrumbSchema(crumbs, `${getSiteUrl()}/ratgeber/${guide.slug}`)} />

      <PageHeader
        eyebrow={area?.label ?? 'Ratgeber'}
        title={guide.title}
        lead={guide.excerpt}
        crumbs={crumbs}
      />

      {/* Raster: Text 8 Spalten, Seitenleiste 4 */}
      <div className="shell grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-gutter">
        {/* Telefon und Tablet: Inhaltsverzeichnis vor dem Text */}
        <nav aria-label="Inhalt" className="lg:hidden">
          {inhalt}
        </nav>


        <article className="min-w-0 lg:col-span-8">
          <ImagePlaceholder slot={guide.image} className="mb-8" />

          <div className="prose-sm24">
            {guide.body.map((block) => (
              <section key={block.heading}>
                <h2 id={ankerKennung(block.heading)} className="scroll-mt-28">
                  {block.heading}
                </h2>
                <p>{block.text}</p>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-border bg-surface p-6">
            <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
              Ihr nächster Schritt
            </p>
            <ButtonLink href={guide.nextStep.href} className="mt-4" pfeil>
              {guide.nextStep.label}
            </ButtonLink>
          </div>
        </article>

        <aside className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <div className="space-y-8">
            <nav aria-label="Inhalt" className="hidden lg:block">
              {inhalt}
            </nav>

            {related.length > 0 && (
              <div>
                <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                  Passend dazu
                </p>
                <ul className="mt-3 border-t border-border">
                  {related.map((item) => (
                    <li key={item.id} className="border-b border-border">
                      <Link
                        href={`/ratgeber/${item.slug}`}
                        className="group flex min-h-touch items-center justify-between gap-3 py-3 text-small font-semibold text-foreground transition-colors duration-quick hover:text-primary"
                      >
                        {item.title}
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

            <div>
              <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Weiterlesen</p>
              <ul className="mt-3 border-t border-border">
                {guide.seo.internalLinks.map((link) => (
                  <li key={link.href} className="border-b border-border">
                    <Link
                      href={link.href}
                      className="group flex min-h-touch items-center justify-between gap-3 py-3 text-small text-foreground-muted transition-colors duration-quick hover:text-primary"
                    >
                      {link.label}
                      <GlyphPfeilRechts
                        size={16}
                        className="shrink-0 text-primary transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
