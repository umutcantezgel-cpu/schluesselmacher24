import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import { getGuide, getGuides, getSettings } from '@/lib/data';
import { areaByKey } from '@/lib/navigation';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { JsonLd, articleSchema, breadcrumbSchema, baseGraphSchema } from '@/components/seo/json-ld';
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

export default async function GuidePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const [guide, allGuides, settings] = await Promise.all([getGuide(slug), getGuides(), getSettings()]);

  if (!guide) notFound();

  const area = areaByKey(guide.topic);
  const related = allGuides.filter((g) => g.topic === guide.topic && g.id !== guide.id).slice(0, 3);

  const crumbs = [
    { href: '/ratgeber', label: 'Ratgeber' },
    { href: `/ratgeber/${guide.slug}`, label: guide.title },
  ];

  const pageUrl = `${getSiteUrl()}/ratgeber/${guide.slug}`;

  return (
    <>
      <JsonLd
        data={baseGraphSchema(
          pageUrl,
          guide.title,
          settings,
          [
            articleSchema(guide),
            breadcrumbSchema(crumbs, pageUrl)
          ]
        )}
      />

      <PageHeader
        eyebrow={area?.label ?? 'Ratgeber'}
        title={guide.title}
        lead={guide.excerpt}
        crumbs={crumbs}
      />

      <div className="shell grid gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
        <article className="min-w-0">
          <ImagePlaceholder slot={guide.image} className="mb-8" />

          <div className="prose-sm24 max-w-none">
            {guide.body.map((block) => (
              <section key={block.heading}>
                <h2>{block.heading}</h2>
                <p>{block.text}</p>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-border bg-surface-muted p-5 md:p-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Ihr nächster Schritt
            </p>
            <p className="mt-2 text-[15px] font-bold text-foreground">{guide.nextStep.label}</p>
            <ButtonLink href={guide.nextStep.href} className="mt-4">
              {guide.nextStep.label}
              <ArrowRight size={16} aria-hidden />
            </ButtonLink>
          </div>
        </article>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          {related.length > 0 && (
            <>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                Passend dazu
              </p>
              <ul className="space-y-2">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/ratgeber/${item.slug}`}
                      className="block rounded-lg border border-border bg-surface p-4 text-[14px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="mb-3 mt-8 text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
            Weiterlesen
          </p>
          <ul className="space-y-2">
            {guide.seo.internalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[14px] text-foreground-muted hover:text-primary hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
