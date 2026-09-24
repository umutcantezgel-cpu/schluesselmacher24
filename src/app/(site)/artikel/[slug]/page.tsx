import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Truck } from 'lucide-react';

import {
  artikelPfad,
  istIndexierbar,
  kurztext,
  produktJsonLd,
  versandartenFuer,
} from '@/lib/artikel';
import { getCollection, getSettings } from '@/lib/data';
import { formatCents } from '@/lib/format';
import { PROCESS_LABELS } from '@/lib/navigation';
import type { ImageSlot } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';

import { ArtikelKauf } from './artikel-kauf';

interface ArtikelSeiteProps {
  /** In Next.js 16 sind Routenparameter ein Promise. */
  params: Promise<{ slug: string }>;
}

/** Nach dem Build veröffentlichte Artikel werden beim ersten Aufruf erzeugt. */
export const dynamicParams = true;

async function artikelNachSlug(slug: string) {
  const articles = await getCollection('standardArticles');
  return articles.find((a) => a.slug === slug) ?? null;
}

/** Hersteller nur zeigen, wenn er gepflegt ist — Platzhalter stehen in eckigen Klammern. */
function herstellerVon(manufacturer: string): string | null {
  const wert = manufacturer.trim();
  return wert && !wert.startsWith('[') ? wert : null;
}

export async function generateStaticParams() {
  const articles = await getCollection('standardArticles');
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: ArtikelSeiteProps): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await artikelNachSlug(slug);

  if (!article) {
    return { title: 'Artikel nicht gefunden', robots: { index: false, follow: true } };
  }

  return {
    title: article.seo.title || article.name,
    description: article.seo.description || kurztext(article.description),
    alternates: { canonical: artikelPfad(article.slug) },
    // Beispielartikel und bewusst ausgeschlossene Artikel nicht in Suchmaschinen.
    ...(istIndexierbar(article) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function ArtikelSeite(props: ArtikelSeiteProps) {
  const { slug } = await props.params;
  const [article, settings] = await Promise.all([artikelNachSlug(slug), getSettings()]);

  if (!article) notFound();

  const pfad = artikelPfad(article.slug);
  const crumbs = [
    { href: '/artikel', label: 'Artikel' },
    { href: pfad, label: article.name },
  ];
  const produkt = produktJsonLd(article);
  const versandarten = versandartenFuer(article, settings.shipping);
  const hersteller = herstellerVon(article.manufacturer);

  // Nur gepflegte Angaben — fehlende Werte werden nicht ergänzt.
  const eigenschaften = [
    ...(hersteller ? [{ name: 'Hersteller', value: hersteller }] : []),
    ...article.properties.filter((p) => p.name.trim() && p.value.trim()),
    ...(article.deliveryTime.trim() ? [{ name: 'Lieferzeit', value: article.deliveryTime }] : []),
  ];

  const galerie: ImageSlot[] = article.gallery.map((bild) => ({
    motif: bild.alt || article.name,
    ratio: '1/1',
    bild,
  }));

  const baseLinks = [
    { href: '/artikel', label: 'Alle Artikel ansehen' },
    { href: '/warenkorb', label: 'Zum Warenkorb' },
    { href: '/rechtliches/versand-und-zahlung', label: 'Zahlung und Versand' },
    { href: '/rechtliches/widerruf', label: 'Widerruf und Rückgabe' },
  ];
  const links = [
    ...baseLinks,
    ...article.seo.internalLinks.filter(
      (link) => link.href !== pfad && !baseLinks.some((b) => b.href === link.href),
    ),
  ];

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: pfad,
          name: article.name,
          description: article.seo.description || kurztext(article.description),
          crumbs,
        })}
      />
      {produkt && <JsonLd data={produkt} />}

      <PageHeader
        eyebrow={article.example ? 'Beispielartikel' : PROCESS_LABELS.direktkauf.label}
        title={article.name}
        crumbs={crumbs}
      >
        {(article.example || article.tags.length > 0) && (
          <div className="grid gap-4">
            {article.example && (
              <Alert tone="info" title="Beispielartikel — nicht bestellbar">
                <p>
                  Dieser Artikel zeigt, wie Artikel im Shop dargestellt werden. Preis und Angaben
                  sind Beispielwerte; der Artikel kann nicht bestellt werden.
                </p>
              </Alert>
            )}
            {article.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Schlagworte">
                {article.tags.map((tag) => (
                  <li key={tag}>
                    <Badge tone="outline">{tag}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </PageHeader>

      <Section tight>
        {/* Am Smartphone: Bild, Bestellung, Angaben. Ab Desktop steht die
            Bestellung rechts neben Bild und Angaben. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-x-12">
          <div className="min-w-0 lg:col-start-1">
            <ImagePlaceholder slot={article.image} sizes="(min-width: 1024px) 50vw, 100vw" />
            {galerie.length > 0 && (
              <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4" aria-label="Weitere Bilder">
                {galerie.map((slot, index) => (
                  <li key={`${index}-${slot.bild?.url}`}>
                    <ImagePlaceholder slot={slot} compact sizes="(min-width: 640px) 12rem, 33vw" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
            <ArtikelKauf
              article={{
                id: article.id,
                name: article.name,
                priceCents: article.priceCents,
                bulkPrices: article.bulkPrices,
                maxQty: article.maxQty,
                shippingClass: article.shippingClass,
                example: article.example,
              }}
            />
          </div>

          <div className="min-w-0 lg:col-start-1">
            <h2 className="text-xl font-bold text-foreground md:text-2xl">Beschreibung</h2>
            <p className="prose-sm24 mt-3">{article.description}</p>

            {eigenschaften.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-foreground md:text-2xl">Eigenschaften</h2>
                <Card className="mt-4 overflow-hidden">
                  <table className="w-full border-collapse text-left">
                    <caption className="sr-only">Eigenschaften von {article.name}</caption>
                    <tbody className="divide-y divide-border">
                      {eigenschaften.map((eintrag, index) => (
                        <tr key={`${index}-${eintrag.name}`}>
                          <th
                            scope="row"
                            className="w-2/5 px-4 py-3 align-top text-[13px] font-semibold text-foreground-muted"
                          >
                            {eintrag.name}
                          </th>
                          <td className="px-4 py-3 align-top text-[15px] text-foreground">
                            {eintrag.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}

            {article.scope.trim() && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-foreground md:text-2xl">Lieferumfang</h2>
                <p className="prose-sm24 mt-3">{article.scope}</p>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-xl font-bold text-foreground md:text-2xl">Versand</h2>
              <p className="prose-sm24 mt-3">
                Die Versandart wählen Sie im Warenkorb.
                {versandarten.length > 0 && ' Für diesen Artikel kommen folgende Versandarten in Frage:'}
              </p>
              {versandarten.length > 0 && (
                <ul className="mt-4 grid gap-2">
                  {versandarten.map((option) => (
                    <li
                      key={option.id}
                      className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4"
                    >
                      <Truck size={18} aria-hidden className="mt-0.5 shrink-0 text-primary" />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <span className="text-[15px] font-semibold text-foreground">{option.label}</span>
                          <span className="text-[14px] text-foreground-muted">
                            {formatCents(option.priceCents)}
                          </span>
                        </span>
                        {option.description && (
                          <span className="mt-1 block text-[13px] leading-relaxed text-foreground-muted">
                            {option.description}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="prose-sm24 mt-4">
                Liegen mehrere Artikel im Warenkorb, stehen die Versandarten zur Wahl, die zu allen
                passen. Kosten, Zahlungswege und Bedingungen stehen unter{' '}
                <Link
                  href="/rechtliches/versand-und-zahlung"
                  className="font-semibold text-primary hover:underline"
                >
                  Zahlung und Versand
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted" tight>
        <SectionHeading eyebrow="Weiter im Shop" title="Passende Seiten zu diesem Artikel" />

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full min-h-[44px] items-center justify-between gap-3 rounded-lg border border-border bg-surface px-5 py-4 text-[15px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {link.label}
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="shrink-0 text-foreground-subtle transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
