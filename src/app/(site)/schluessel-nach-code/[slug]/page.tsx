import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, MapPin } from 'lucide-react';

import { getCodeLine, getCodeLines } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { formatCents, formatNumber } from '@/lib/format';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { JsonLd, productSchema, breadcrumbSchema } from '@/components/seo/json-ld';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';

import { BestellFormular } from './bestell-formular';

interface CodeLinePageProps {
  /** In Next.js 16 sind Routenparameter ein Promise. */
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const lines = await getCodeLines();
  return lines.map((line) => ({ slug: line.slug }));
}

export async function generateMetadata(props: CodeLinePageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const line = await getCodeLine(slug);


  if (!line || !line.active) {
    return { title: 'Codelinie nicht gefunden', robots: { index: false, follow: true } };
  }

  return {
    title: line.seo.title,
    description: line.seo.description,
    alternates: { canonical: `/schluessel-nach-code/${line.slug}` },
    ...(line.seo.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function CodeLinePage(props: CodeLinePageProps) {
  const { slug } = await props.params;
  const line = await getCodeLine(slug);

  if (!line || !line.active) notFound();

  const facts: Array<{ label: string; value: string }> = [
    { label: 'Hersteller', value: line.manufacturer },
    { label: 'Anwendung', value: line.application },
    { label: 'Schlüsseltyp', value: line.keyType },
    { label: 'Codeformat', value: `${line.codeFormatLabel} (Beispiel: ${line.codeExample})` },
    { label: 'Lieferumfang', value: line.scope },
    { label: 'Stückzahl je Bestellung', value: `1 bis ${formatNumber(line.maxQty)} Stück` },
  ];

  // Pflichtlinks laut Leitfaden, ergänzt um die gepflegten Ziele der Codelinie.
  const baseLinks = [
    { href: '/schluessel-nach-code', label: 'Alle Codelinien ansehen' },
    { href: '/schluessel-nach-vorlage', label: 'Kein Code? Schlüssel nach Vorlage' },
    { href: '/ratgeber/schluesselcode-finden', label: 'Ratgeber: Wo finde ich den Code?' },
  ];
  const crumbs = [
    { href: '/schluessel-nach-code', label: 'Schlüssel nach Code' },
    { href: `/schluessel-nach-code/${line.slug}`, label: line.name },
  ];
  const links = [
    ...baseLinks,
    ...line.seo.internalLinks.filter((link) => !baseLinks.some((b) => b.href === link.href)),
  ];

  return (
    <>
      <JsonLd data={productSchema(line)} />
      <JsonLd data={breadcrumbSchema(crumbs, `${process.env.NEXT_PUBLIC_SITE_URL || 'https://schluesselmacher24.de'}/schluessel-nach-code/${line.slug}`)} />
      <PageHeader
        eyebrow={PROCESS_LABELS.direktkauf.label}
        title={line.name}
        lead={line.application}
        crumbs={crumbs}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="primary">Ohne Einsendung des Originalschlüssels</Badge>
          <Badge tone="outline">{line.keyType}</Badge>
          <Badge tone="outline">Codeformat: {line.codeFormatLabel}</Badge>
        </div>
      </PageHeader>

      <Section tight>
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-start lg:gap-12">
          {/* Produktangaben */}
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              <figure className="m-0">
                <ImagePlaceholder slot={line.productImage} />
                <figcaption className="mt-2 text-[12px] leading-snug text-foreground-subtle">
                  Produktansicht der Codelinie.
                </figcaption>
              </figure>

              <figure className="m-0">
                <ImagePlaceholder slot={line.codeLocationImage} />
                <figcaption className="mt-2 flex items-start gap-1.5 text-[12px] leading-snug text-foreground-subtle">
                  <MapPin size={13} aria-hidden className="mt-0.5 shrink-0" />
                  <span>So finden Sie den Code an Schloss und Schlüssel.</span>
                </figcaption>
              </figure>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-foreground md:text-2xl">
                Was Sie erhalten
              </h2>
              <p className="prose-sm24 mt-3">{line.description}</p>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-foreground md:text-2xl">Technische Angaben</h2>
              <Card className="mt-4 overflow-hidden">
                <dl className="divide-y divide-border">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,12rem)_1fr] sm:gap-4"
                    >
                      <dt className="text-[13px] font-semibold text-foreground-muted">
                        {fact.label}
                      </dt>
                      <dd className="text-[15px] text-foreground">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-foreground md:text-2xl">
                Wo steht der Code?
              </h2>
              <p className="prose-sm24 mt-3">{line.codeHint}</p>
              <p className="prose-sm24 mt-3">
                Sie finden den Code nicht?{' '}
                <Link
                  href="/ratgeber/schluesselcode-finden"
                  className="font-semibold text-primary hover:underline"
                >
                  Der Ratgeber zeigt die üblichen Fundstellen.
                </Link>{' '}
                Ohne Code ist{' '}
                <Link
                  href="/schluessel-nach-vorlage"
                  className="font-semibold text-primary hover:underline"
                >
                  Schlüssel nach Vorlage
                </Link>{' '}
                der passende Weg.
              </p>
            </div>

            <Alert tone="legal" title="Anfertigung nach Ihrer Codeangabe" className="mt-8">
              <p>
                Dieser Schlüssel wird eigens für Sie nach dem Code gefertigt, den Sie angeben. Ein
                falsch eingegebener Code führt zu einem nicht passenden Schlüssel. Bitte prüfen Sie
                Ihre Eingabe deshalb vor dem Absenden.
              </p>
              <p className="mt-2">
                Weil es sich um eine kundenspezifische Anfertigung handelt, kann das Widerrufsrecht
                eingeschränkt sein. Was im Einzelnen gilt, steht unter{' '}
                <Link
                  href="/rechtliches/widerruf"
                  className="font-semibold text-primary hover:underline"
                >
                  Widerruf und Rückgabe
                </Link>
                .
              </p>
            </Alert>
          </div>

          {/* Bestellung */}
          <div className="lg:sticky lg:top-24">
            <BestellFormular line={line} />
          </div>
        </div>
      </Section>

      <Section tone="muted" tight>
        <SectionHeading
          eyebrow="Weiter im Bereich"
          title="Passende Seiten zu dieser Codelinie"
        />

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full items-center justify-between gap-3 rounded-lg border border-border bg-surface px-5 py-4 text-[15px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
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

        <p className="mt-6 text-[13px] text-foreground-subtle">
          Preis je Stück: {formatCents(line.priceCents)}. Die Versandart und die Versandkosten
          wählen Sie im Warenkorb.
        </p>
      </Section>
    </>
  );
}
