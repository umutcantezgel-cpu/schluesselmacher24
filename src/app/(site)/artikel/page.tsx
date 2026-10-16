import type { Metadata } from 'next';
import Link from 'next/link';

import { sortiereArtikel } from '@/lib/artikel';
import { getCollection, getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import type { NavLink } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { IconGleichschliessendeZylinder } from '@/components/visual/icons/gleichschliessende-zylinder';
import { IconSchluesselNachCode } from '@/components/visual/icons/schluessel-nach-code';
import { IconVersandPaket } from '@/components/visual/icons/versand-paket';
import { IconWarenkorb } from '@/components/visual/icons/warenkorb';

import { ArtikelListe, type ListenArtikel } from './artikel-liste';

const ROUTE = 'artikel';
const TITEL = 'Artikel';
const LEAD =
  'Standardartikel rund um Schlüssel, Schloss und Tür — Stückzahl wählen und direkt in den '
  + 'Warenkorb legen.';
const BESCHREIBUNG =
  'Standardartikel rund um Schlüssel, Schloss und Tür direkt bestellen: Eigenschaften, '
  + 'Lieferumfang und Staffelpreise auf einen Blick.';

/** Interne Verlinkung am Seitenende — feste Ziele plus gepflegte Ziele aus der Datenschicht. */
const BASE_LINKS: NavLink[] = [
  {
    href: '/schluessel-nach-code',
    label: 'Schlüssel nach Code bestellen',
    description: 'Nachschlüssel allein anhand des Codes, ohne Einsendung des Originals.',
  },
  {
    href: '/gleichschliessende-zylinder',
    label: 'Mehrere Türen mit einem Schlüssel',
    description: 'Gleichschließende Zylinder selbst zusammenstellen.',
  },
  {
    href: '/rechtliches/versand-und-zahlung',
    label: 'Zahlung und Versand',
    description: 'Welche Versandarten und Zahlungswege zur Verfügung stehen.',
  },
];

/** Fach-Icon je Ziel der Weiterlesen-Liste; ohne eigenes Motiv der Warenkorb. */
function WeiterIcon({ href }: { href: string }) {
  switch (href) {
    case '/schluessel-nach-code':
      return <IconSchluesselNachCode size={32} />;
    case '/gleichschliessende-zylinder':
      return <IconGleichschliessendeZylinder size={32} />;
    case '/rechtliches/versand-und-zahlung':
      return <IconVersandPaket size={32} />;
    default:
      return <IconWarenkorb size={32} />;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title || TITEL,
    description: page?.seo.description || BESCHREIBUNG,
    alternates: { canonical: `/${ROUTE}` },
    ...(page?.seo.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ArtikelPage() {
  const [page, alle] = await Promise.all([
    getPageContent(ROUTE),
    getCollection('standardArticles'),
  ]);

  const articles = sortiereArtikel(alle);
  const beispiele = articles.filter((a) => a.example).length;
  const nurBeispiele = articles.length > 0 && beispiele === articles.length;

  // Nur die Felder, die die Karten brauchen, gehen an den Browser.
  const liste: ListenArtikel[] = articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    description: a.description,
    manufacturer: a.manufacturer,
    priceCents: a.priceCents,
    bulkPrices: a.bulkPrices,
    maxQty: a.maxQty,
    image: a.image,
    tags: a.tags,
    example: a.example,
  }));

  const extraLinks: NavLink[] = (page?.seo.internalLinks ?? []).filter(
    (link) => link.href !== `/${ROUTE}` && !BASE_LINKS.some((base) => base.href === link.href),
  );
  const links = [...BASE_LINKS, ...extraLinks];
  const titel = page?.headline || TITEL;
  const crumbs = [{ href: `/${ROUTE}`, label: TITEL }];

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: titel,
          description: page?.seo.description || BESCHREIBUNG,
          crumbs,
        })}
      />

      <PageHeader
        eyebrow={PROCESS_LABELS.direktkauf.label}
        title={titel}
        lead={page?.subline || LEAD}
        crumbs={crumbs}
      >
        {beispiele > 0 && (
          <Alert
            tone="info"
            title={nurBeispiele ? 'Derzeit nur Beispielartikel' : 'Beispielartikel sind gekennzeichnet'}
          >
            <p>
              Artikel mit dem Hinweis „Beispiel“ zeigen, wie Artikel hier dargestellt werden. Preise
              und Angaben sind Beispielwerte; diese Artikel können nicht bestellt werden.
            </p>
          </Alert>
        )}
      </PageHeader>

      <Section tight labelledBy="artikel-titel">
        {articles.length > 0 ? (
          <>
            {/* Haarlinie über dem nummerierten Abschnittskopf */}
            <div className="border-t border-border pt-8">
              <SectionHeading
                id="artikel-titel"
                nummer="01"
                eyebrow={`${articles.length} Artikel`}
                title="Artikel auswählen"
                lead={
                  page?.intro
                  || 'Öffnen Sie einen Artikel, um Eigenschaften, Lieferumfang und Staffelpreise zu '
                    + 'sehen und die Stückzahl zu wählen.'
                }
              />
            </div>
            <ArtikelListe articles={liste} className="mt-8" />
          </>
        ) : (
          <Card variant="muted">
            <CardBody className="flex flex-col items-start gap-4 py-8 text-left sm:items-center sm:text-center">
              <div>
                <h2 className="text-body font-bold text-foreground">
                  Derzeit sind hier keine Artikel eingestellt.
                </h2>
                <p className="mt-2 max-w-md text-small leading-relaxed text-foreground-muted">
                  Schauen Sie gern später wieder vorbei. Nachschlüssel nach Code bestellen Sie
                  weiterhin direkt; für alle anderen Anliegen erreichen Sie uns über die Anfrage.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 sm:justify-center">
                <ButtonLink href="/schluessel-nach-code" pfeil>
                  Schlüssel nach Code
                </ButtonLink>
                <ButtonLink href="/service-und-termin/anfrage" variant="outline">
                  Anfrage stellen
                </ButtonLink>
              </div>
            </CardBody>
          </Card>
        )}
      </Section>

      <Section tone="muted" tight labelledBy="weiter-titel">
        <SectionHeading
          id="weiter-titel"
          nummer="02"
          eyebrow="Weiterlesen"
          title="Passende Bereiche und Hinweise"
          lead="Schlüssel nach Code, gleichschließende Zylinder und alles zu Zahlung und Versand."
        />

        {/* Stückliste mit Fach-Icons: die ganze Zeile ist der Link */}
        <ol className="mt-8 border-t border-border">
          {links.map((link, index) => (
            <li key={link.href} className="border-b border-border">
              <Link
                href={link.href}
                className="group flex min-h-touch items-center gap-4 py-6 transition-colors duration-quick ease-standard sm:gap-6"
              >
                <span className="w-6 shrink-0 font-mono text-caption tabular-nums text-foreground-muted sm:w-8">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="shrink-0 text-primary">
                  <WeiterIcon href={link.href} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-title-sm font-semibold text-foreground group-hover:text-primary">
                    {link.label}
                  </span>
                  {link.description && (
                    <span className="mt-1 block max-w-measure text-small text-foreground-muted">
                      {link.description}
                    </span>
                  )}
                </span>
                <GlyphPfeilRechts
                  size={18}
                  className="shrink-0 text-foreground-muted transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-primary"
                />
              </Link>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
