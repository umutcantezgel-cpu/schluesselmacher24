import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getCodeLine, getCodeLines } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { formatCents, formatNumber } from '@/lib/format';
import { cn } from '@/lib/cn';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { JsonLd, productSchema, breadcrumbSchema } from '@/components/seo/json-ld';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { GlyphOrt } from '@/components/visual/glyphen/ort';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { CodeFundstelleInteraktiv } from '@/components/visual/interaktiv/code-fundstelle-interaktiv';

import { BestellFormular } from './bestell-formular';
import { getSiteUrl } from '@/lib/site-url';

interface CodeLinePageProps {
  /** In Next.js 16 sind Routenparameter ein Promise. */
  params: Promise<{ slug: string }>;
}

/** Hersteller-Platzhalter aus den Inhalten (`[Hersteller eintragen]`) sind kein Fakt. */
function istPlatzhalter(wert: string): boolean {
  return wert.trim().startsWith('[');
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
  // Platzhalter-Werte (etwa ein noch nicht eingetragener Hersteller) erscheinen nicht.
  const technik = facts.filter((fact) => !istPlatzhalter(fact.value));

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
      <JsonLd data={breadcrumbSchema(crumbs, `${getSiteUrl()}/schluessel-nach-code/${line.slug}`)} />
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
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          {/* Produktangaben */}
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-12">
              <figure className="m-0 sm:col-span-6">
                <ImagePlaceholder slot={line.productImage} />
                <figcaption className="mt-2 text-caption leading-snug text-foreground-muted">
                  Produktansicht der Codelinie.
                </figcaption>
              </figure>
            </div>

            <div className="mt-8">
              <h2 className="text-title font-semibold text-foreground">
                Was Sie erhalten
              </h2>
              <p className="prose-sm24 mt-3">{line.description}</p>
            </div>

            {/* Schriftfeld-Liste: Haarlinien statt Karte, Codeformat und Stückzahl in Mono */}
            <div className="mt-8">
              <h2 className="text-title font-semibold text-foreground">Technische Angaben</h2>
              <dl className="mt-4 border-t border-border">
                {technik.map((fact) => (
                  <div
                    key={fact.label}
                    className="grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4"
                  >
                    <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted max-sm:tracking-label-eng sm:col-span-4">
                      {fact.label}
                    </dt>
                    <dd
                      className={cn(
                        'text-body text-foreground sm:col-span-8',
                        (fact.label === 'Codeformat' || fact.label === 'Stückzahl je Bestellung')
                          && 'font-mono tabular-nums',
                      )}
                    >
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Großer Moment (B-15/B-16): Fundstelle als Zeichnung, solange kein Foto hinterlegt ist */}
            <div className="mt-8">
              <h2 className="text-title font-semibold text-foreground">
                Wo steht der Code?
              </h2>
              <p className="prose-sm24 mt-3">{line.codeHint}</p>

              {line.codeLocationImage.bild ? (
                <figure className="m-0 mt-4 sm:max-w-md">
                  <ImagePlaceholder slot={line.codeLocationImage} />
                  <figcaption className="mt-2 flex items-start gap-1.5 text-caption leading-snug text-foreground-muted">
                    <GlyphOrt size={16} className="mt-0.5 shrink-0" />
                    <span>So finden Sie den Code an Schloss und Schlüssel.</span>
                  </figcaption>
                </figure>
              ) : (
                <CodeFundstelleInteraktiv className="mt-4" />
              )}

              <p className="prose-sm24 mt-4">
                Sie finden den Code nicht?{' '}
                <Link
                  href="/ratgeber/schluesselcode-finden"
                  className="inline-flex min-h-touch items-center font-semibold text-primary hover:underline"
                >
                  Der Ratgeber zeigt die üblichen Fundstellen.
                </Link>{' '}
                Ohne Code ist{' '}
                <Link
                  href="/schluessel-nach-vorlage"
                  className="inline-flex min-h-touch items-center font-semibold text-primary hover:underline"
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
                  className="inline-flex min-h-touch items-center font-semibold text-primary hover:underline"
                >
                  Widerruf und Rückgabe
                </Link>
                .
              </p>
            </Alert>
          </div>

          {/* Bestellung */}
          <div className="lg:sticky lg:top-24 lg:col-span-5">
            <BestellFormular line={line} />
          </div>
        </div>
      </Section>

      <Section tone="muted" tight>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <SectionHeading
            className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start"
            nummer="01"
            eyebrow="Weiter im Bereich"
            title="Passende Seiten zu dieser Codelinie"
          />

          {/* Stückliste mit Haarlinien: die ganze Zeile ist der Link */}
          <ol className="border-t border-border lg:col-span-7">
            {links.map((link, index) => (
              <li key={link.href} className="border-b border-border">
                <Link
                  href={link.href}
                  className="group flex min-h-touch items-center gap-4 py-5 transition-colors duration-quick ease-standard sm:gap-6"
                >
                  <span className="w-6 shrink-0 font-mono text-caption tabular-nums text-foreground-muted sm:w-8">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1 text-title-sm font-semibold text-foreground group-hover:text-primary">
                    {link.label}
                  </span>
                  <GlyphPfeilRechts
                    size={18}
                    className="shrink-0 text-foreground-muted transition-transform duration-base ease-standard group-hover:translate-x-1 group-hover:text-primary"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-6 text-small text-foreground-muted">
          Preis je Stück:{' '}
          <span className="font-mono tabular-nums text-foreground">{formatCents(line.priceCents)}</span>.
          Die Versandart und die Versandkosten wählen Sie im Warenkorb.
        </p>
      </Section>
    </>
  );
}
