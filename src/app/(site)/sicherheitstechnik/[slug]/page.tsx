import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getServicePage, getServicePages } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { GlyphHaken } from '@/components/visual/glyphen/haken';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

const AREA = 'sicherheitstechnik';
const AREA_LABEL = 'Sicherheitstechnik';

/** Bereiche, bei denen der rechtliche Hinweis unmittelbar zur Leistung gehört. */
const LEGAL_RELEVANT = [
  'videoueberwachung',
  'alarmtechnik',
  'smarte-funktionen',
  'panik-und-alarmtaster',
  'kombinierte-konzepte',
];

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

export default async function SecurityDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const [page, all] = await Promise.all([getServicePage(AREA, slug), getServicePages(AREA)]);

  if (!page) notFound();

  const process = PROCESS_LABELS[page.process];
  const others = all.filter((item) => item.slug !== page.slug).slice(0, 4);
  const showLegal = LEGAL_RELEVANT.includes(page.slug);

  // Interne Links aus der Datenschicht, ergänzt um die Bereichsübersicht — ohne Dopplung.
  const rawLinks = [
    ...page.seo.internalLinks,
    { href: `/${AREA}`, label: `Übersicht ${AREA_LABEL}` },
    { href: '/tuer-und-schliesstechnik', label: 'Mechanischer Grundschutz an der Tür' },
  ];

  const seen = new Set<string>();
  const links = rawLinks.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });

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
          <ButtonLink href={page.ctaHref} size="lg" pfeil>
            {page.ctaLabel}
          </ButtonLink>
        }
      />

      {/* Leistungsumfang: Raster 7/5 mit Punkten im Kreis */}
      <Section tight>
        <div className="grid gap-8 md:grid-cols-12 md:items-start md:gap-gutter">
          <div className="md:col-span-7">
            <SectionHeading eyebrow="Leistungsumfang" title="Das gehört dazu" />

            <ul className="mt-6 space-y-3">
              {page.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-area-soft text-area-strong"
                  >
                    <GlyphHaken size={14} />
                  </span>
                  <span className="text-body leading-relaxed text-foreground-muted">{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Kasten im Etikett-Stil: Ablauf wie ein Schriftfeld */}
            <div className="mt-8 rounded-lg border border-border bg-surface-muted p-5">
              <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                So läuft es ab
              </p>
              <p className="mt-2 text-body font-semibold text-foreground">{process.label}</p>
              <p className="mt-1 text-small leading-relaxed text-foreground-muted">
                {process.hint}
              </p>
              <div className="mt-5">
                <ButtonLink href={page.ctaHref} variant="outline">
                  {page.ctaLabel}
                </ButtonLink>
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            {/* Rangfolge aus ImagePlaceholder: Foto, sonst Fachgrafik, sonst Fach-Icon zum Motiv */}
            <ImagePlaceholder slot={page.image} />
          </div>
        </div>
      </Section>

      {/* Recht und Verantwortung, wenn die Leistung es berührt: Kasten mit Haarlinien */}
      {showLegal && (
        <Section tight>
          <div
            role="note"
            className="flex gap-4 rounded-lg border border-border bg-surface p-5 sm:p-6"
          >
            <GlyphInfo size={22} className="mt-1 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-title-sm font-semibold text-foreground">Recht und Verantwortung</p>
              <p className="mt-3 max-w-measure text-small leading-relaxed text-foreground-muted">
                Für die rechtmäßige Nutzung von Video-, Audio- und Protokollfunktionen ist die
                Betreiberin oder der Betreiber der Anlage verantwortlich. Kameras dürfen öffentliche
                Flächen und Nachbargrundstücke nicht erfassen. Verdeckte Audioüberwachung bieten wir
                nicht als Standardprodukt an; Gegensprech- und Alarmfunktionen richten wir nur für
                zulässige Einsatzzwecke ein. Wir beraten technisch und leisten keine Rechtsberatung.
              </p>
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                <Link
                  href={`/${AREA}#recht-und-verantwortung`}
                  className="inline-flex min-h-touch items-center font-semibold text-primary hover:underline"
                >
                  Alle Punkte im Überblick
                </Link>
                <Link
                  href="/rechtliches/datenschutz"
                  className="inline-flex min-h-touch items-center font-semibold text-primary hover:underline"
                >
                  Hinweise zum Datenschutz
                </Link>
              </p>
            </div>
          </div>
        </Section>
      )}

      {/* Weitere Leistungen des Bereichs: Haarlinienliste, ganze Zeile ist der Link */}
      {others.length > 0 && (
        <Section tone="muted" tight>
          <SectionHeading
            eyebrow="Ebenfalls im Bereich"
            title={`Weitere Bereiche der ${AREA_LABEL}`}
          />

          <ul className="mt-8 border-t border-border">
            {others.map((item) => (
              <li key={item.id} className="border-b border-border">
                <Link
                  href={`/${AREA}/${item.slug}`}
                  className="group flex min-h-touch flex-col gap-3 py-6 transition-colors duration-quick hover:text-area-strong sm:flex-row sm:items-start sm:justify-between sm:gap-8"
                >
                  <span className="min-w-0">
                    <span className="block text-title-sm font-semibold text-foreground group-hover:text-area-strong">
                      {item.title}
                    </span>
                    <span className="mt-2 block max-w-measure text-small leading-relaxed text-foreground-muted">
                      {item.summary}
                    </span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-small font-semibold text-primary">
                    Ansehen
                    <GlyphPfeilRechts
                      size={16}
                      className="transition-transform duration-quick group-hover:translate-x-1"
                    />
                  </span>
                </Link>
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
                className="inline-flex min-h-touch items-center gap-2 rounded-lg border border-border bg-surface px-4 text-small font-semibold text-foreground transition-colors duration-quick ease-standard hover:border-primary hover:text-primary"
              >
                {link.label}
                <GlyphPfeilRechts size={16} />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
