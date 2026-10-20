import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getCodeLine, getCodeLines } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/cn';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { JsonLd, productSchema, breadcrumbSchema } from '@/components/seo/json-ld';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { GlyphOrt } from '@/components/visual/glyphen/ort';
import { GlyphHaken } from '@/components/visual/glyphen/haken';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { CodeFundstelleInteraktiv } from '@/components/visual/interaktiv/code-fundstelle-interaktiv';
import { PROFILSCHNITT_GROESSE } from '@/components/visual/generators/profilschnitt';

import { BestellFormular } from './bestell-formular';
import { getSiteUrl } from '@/lib/site-url';
import { istPlatzhalter } from '@/lib/platzhalter';
import { beschreibungFuerAnzeige, codelinienKennung } from '@/lib/codelinie';

/** Telefon-Ausschnitt des Profilschnitts (viewBox 480 × 360): Halm ab der Schulter, die Reide samt Kontur (bis x 125,1) ganz außerhalb; Nummern, Spitze, Fräser und Bemaßung (bis y 282) innen; rechter Rand wie PROFILSCHNITT_AUSSCHNITT (462). Schrift 11,5 px bei 320 px Zeichnungsbreite (360 px Viewport), etwa 10 px bei 280 px (320 px Viewport), darunter die Kern-Mindestgröße (K-008). */
const PROFILSCHNITT_HALM = {
  x: 128,
  y: 98,
  breite: 334,
  hoehe: 190,
  vollBreite: PROFILSCHNITT_GROESSE.breite,
  vollHoehe: PROFILSCHNITT_GROESSE.hoehe,
} as const;

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
  // Platzhalter-Werte (etwa ein noch nicht eingetragener Hersteller) erscheinen nicht.
  const technik = facts.filter((fact) => !istPlatzhalter(fact.value));

  // Pflichtlinks laut Leitfaden, ergänzt um die gepflegten Ziele der Codelinie.
  const baseLinks = [
    { href: '/schluessel-nach-code', label: 'Alle Codelinien' },
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
  // Titel ohne angehängte Serienkennung, wie `titelOf` in shop-liste.tsx. Nur Anzeige.
  const kennung = codelinienKennung(line);
  const titel = line.name.replace(/\s*[—–-]\s*Serie\s+[A-Za-z0-9-]+\s*$/, '');

  return (
    <>
      <JsonLd data={productSchema(line)} />
      <JsonLd data={breadcrumbSchema(crumbs, `${getSiteUrl()}/schluessel-nach-code/${line.slug}`)} />
      <PageHeader
        eyebrow={`${kennung} · ${PROCESS_LABELS.direktkauf.label}`}
        title={titel}
        crumbs={crumbs}
        visual={
          /* Blickfang im Kopf (K-006): die Fräsbahn zum Beispielcode der Codelinie, ohne Kartenrahmen */
          <figure className="m-0">
            <ImagePlaceholder
              frei
              sizes="(min-width: 1024px) 40vw, 100vw"
              ausschnitt={PROFILSCHNITT_HALM}
              className="sm24-ausschnitt-bemasst"
              slot={{
                motif: `Fräsbahn zum Beispielcode ${line.codeExample}`,
                ratio: '4/3',
                visual: { generator: 'profilschnitt', params: { code: line.codeExample } },
              }}
            />
            <figcaption className="mt-2 font-mono text-caption uppercase tracking-label text-foreground-muted">
              Darstellung zum Beispielcode {line.codeExample} –{' '}
              <span className="whitespace-nowrap">keine echte Schließung</span>
            </figcaption>
          </figure>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="outline">
            <GlyphHaken size={14} className="shrink-0" />
            Ohne Einsendung des Originalschlüssels
          </Badge>
          <Badge tone="outline">{line.keyType}</Badge>
          <Badge tone="outline">
            Codeformat: <span className="font-mono font-medium tabular-nums text-foreground">{line.codeFormatLabel}</span>
          </Badge>
        </div>
      </PageHeader>

      <Section tight>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          {/* Bestellung steht im DOM zuerst: mobil oben, ab lg rechts. Lese- und Fokusfolge entsprechen der Sichtfolge. */}
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:col-start-8 lg:row-start-1">
            <BestellFormular line={line} />
          </div>

          {/* Codefundstelle, Angaben, Hinweis und Passende Seiten: ab lg links, füllen die Spalte unter dem Kopf */}
          <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
            {/* Großer Moment (B-16): Fundstelle als Zeichnung, solange kein Foto hinterlegt ist */}
            <div>
              <SectionHeading nummer="01" eyebrow="Codefundstelle" title="Wo steht der Code?" />
              <p className="prose-sm24 mt-4">{line.codeHint}</p>

              {line.codeLocationImage.bild ? (
                <figure className="m-0 mt-6 sm:max-w-md">
                  <ImagePlaceholder slot={line.codeLocationImage} />
                  <figcaption className="mt-2 flex items-start gap-1.5 text-caption leading-snug text-foreground-muted">
                    <GlyphOrt size={16} className="mt-0.5 shrink-0" />
                    <span>So finden Sie den Code an Schloss und Schlüssel.</span>
                  </figcaption>
                </figure>
              ) : (
                <CodeFundstelleInteraktiv className="mt-6" />
              )}

              <p className="prose-sm24 mt-4">
                Sie finden den Code nicht?{' '}
                <Link
                  href="/ratgeber/schluesselcode-finden"
                  className="inline py-1 -my-1 font-semibold text-primary hover:underline"
                >
                  Der Ratgeber zeigt die üblichen Fundstellen.
                </Link>{' '}
                Ohne Code ist{' '}
                <Link
                  href="/schluessel-nach-vorlage"
                  className="inline py-1 -my-1 font-semibold text-primary hover:underline"
                >
                  Schlüssel nach Vorlage
                </Link>{' '}
                der passende Weg.
              </p>
            </div>

            {/* Schriftfeld-Liste: Haarlinien statt Karte, Codeformat und Stückzahl in Mono; der Lieferumfang steht als erster Absatz davor */}
            <div className="mt-12">
              <SectionHeading nummer="02" eyebrow="Angaben" title="Technische Angaben" />
              <p className="prose-sm24 mt-4">{beschreibungFuerAnzeige(line)}</p>
              <dl className="mt-6 border-t border-border">
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

            <Alert tone="legal" title="Anfertigung nach Ihrer Codeangabe" className="mt-10">
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
                  className="inline py-1 -my-1 font-semibold text-primary hover:underline"
                >
                  Widerruf und Rückgabe
                </Link>
                .
              </p>
            </Alert>

            {/* Stückliste mit Haarlinien: die ganze Zeile ist der Link */}
            <div className="mt-12">
              <SectionHeading
                nummer="03"
                eyebrow="Weiter im Bereich"
                title="Passende Seiten zu dieser Codelinie"
              />

              <ol className="mt-6 border-t border-border">
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
          </div>
        </div>
      </Section>
    </>
  );
}
