import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';

import { getServicePage, getServicePages } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';

const AREA = 'tuer-und-schliesstechnik';
const AREA_LABEL = 'Tür- und Schließtechnik';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getServicePages(AREA);
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const page = await getServicePage(AREA, slug);

  if (!page) {
    return { title: 'Leistung nicht gefunden' };
  }

  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: `/${AREA}/${page.slug}` },
    robots: page.seo.noindex ? { index: false, follow: false } : undefined,
  };
}

export default async function ServiceDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const [page, all] = await Promise.all([getServicePage(AREA, slug), getServicePages(AREA)]);

  if (!page) notFound();

  const process = PROCESS_LABELS[page.process];
  const others = all.filter((item) => item.slug !== page.slug).slice(0, 4);

  // Interne Links aus der Datenschicht, ergänzt um die Bereichsübersicht — ohne Dopplung.
  const links = [
    ...page.seo.internalLinks,
    { href: `/${AREA}`, label: `Übersicht ${AREA_LABEL}` },
  ].filter((link, index, list) => list.findIndex((l) => l.href === link.href) === index);

  return (
    <>
      <PageHeader
        eyebrow={AREA_LABEL}
        title={page.title}
        lead={page.summary}
        crumbs={[
          { href: `/${AREA}`, label: AREA_LABEL },
          { href: `/${AREA}/${page.slug}`, label: page.title },
        ]}
        actions={
          <ButtonLink href={page.ctaHref} size="lg">
            {page.ctaLabel}
            <ArrowRight size={18} aria-hidden />
          </ButtonLink>
        }
      />

      {/* Leistungsumfang */}
      <Section tight>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-12">
          <div>
            <SectionHeading eyebrow="Leistungsumfang" title="Das gehört dazu" />

            <ul className="mt-6 space-y-3">
              {page.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"
                  >
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span className="text-[15px] leading-relaxed text-foreground-muted">{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-lg border border-border bg-surface-muted p-5">
              <p className="text-[13px] font-bold uppercase tracking-wider text-foreground-subtle">
                So läuft es ab
              </p>
              <p className="mt-2 text-[15px] font-bold text-foreground">{process.label}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">
                {process.hint}
              </p>
              <div className="mt-5">
                <ButtonLink href={page.ctaHref} variant="outline">
                  {page.ctaLabel}
                </ButtonLink>
              </div>
            </div>
          </div>

          <ImagePlaceholder slot={page.image} />
        </div>
      </Section>

      {/* Weitere Leistungen des Bereichs */}
      {others.length > 0 && (
        <Section tone="muted" tight>
          <SectionHeading
            eyebrow="Ebenfalls im Bereich"
            title={`Weitere Leistungen der ${AREA_LABEL}`}
          />

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {others.map((item) => (
              <li key={item.id}>
                <Card className="h-full">
                  <CardBody className="flex h-full flex-col">
                    <p className="text-[15px] font-bold text-foreground">{item.title}</p>
                    <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                      {item.summary}
                    </p>
                    <Link
                      href={`/${AREA}/${item.slug}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                    >
                      Ansehen
                      <ArrowRight size={15} aria-hidden />
                    </Link>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Interne Verlinkung */}
      <Section tight>
        <SectionHeading eyebrow="Weiterlesen" title="Passende Seiten" />
        <ul className="mt-6 flex flex-wrap gap-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 text-[14px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {link.label}
                <ArrowRight size={15} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
