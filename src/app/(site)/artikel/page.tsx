import type { Metadata } from 'next';
import Link from 'next/link';

import { artikelAnfragePfad, istIndexierbar, sortiereArtikel } from '@/lib/artikel';
import { istBestellbar } from '@/lib/data/shop';
import { getCollection, getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import type { NavLink } from '@/lib/navigation';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { IconGleichschliessendeZylinder } from '@/components/visual/icons/gleichschliessende-zylinder';
import { IconSchluesselNachCode } from '@/components/visual/icons/schluessel-nach-code';
import { IconWarenkorb } from '@/components/visual/icons/warenkorb';
import { IconZahlung } from '@/components/visual/icons/zahlung';
import { PreisHinweis } from '@/components/recht/preis-hinweis';

import { ArtikelListe, type ListenArtikel } from './artikel-liste';

const ROUTE = 'artikel';
const TITEL = 'Artikel';
const LEAD = 'Artikel rund um Schlüssel, Schloss und Tür zum direkten Bestellen.';
/**
 * Ohne bestellbaren Artikel verspricht der Kopf keine Bestellung (R4, R9): gar keine Artikel, nur
 * Beispiele oder nur Artikel „auf Anfrage“ oder „nicht lieferbar“ (FA-INHALT-03I, L-17).
 */
const LEAD_OHNE_ARTIKEL = 'Artikel rund um Schlüssel, Schloss und Tür. Zurzeit fragen Sie Artikel bei uns an.';
const BESCHREIBUNG =
  'Standardartikel rund um Schlüssel, Schloss und Tür direkt bestellen: Eigenschaften, '
  + 'Lieferumfang und Staffelpreise auf einen Blick.';
/** Suchbeschreibung ohne bestellbaren Artikel: wie der Kopf, ohne Bestellung und Staffelpreise (R4, R8). */
const BESCHREIBUNG_ANFRAGE =
  'Artikel rund um Schlüssel, Schloss und Tür. Zurzeit fragen Sie Artikel bei uns an. '
  + 'Wir beraten Sie und sagen Ihnen, was zu Ihrem Schloss passt.';

/** Interne Verlinkung am Seitenende — feste Ziele plus gepflegte Ziele aus der Datenschicht. */
const BASE_LINKS: NavLink[] = [
  {
    href: '/schluessel-nach-code',
    label: 'Schlüssel nach Code',
    description: 'Nachschlüssel nach dem Code, ohne dass Sie das Original einschicken.',
  },
  {
    href: '/gleichschliessende-zylinder',
    label: 'Mehrere Türen mit einem Schlüssel',
    description: 'Gleichschließende Zylinder selbst zusammenstellen. Ein Schlüssel öffnet alle diese Türen.',
  },
  {
    href: '/rechtliches/versand-und-zahlung',
    label: 'Zahlung und Versand',
    description: 'Welche Versandarten und Zahlungswege es gibt.',
  },
  {
    href: '/shop',
    label: 'Alle Shop-Kategorien',
    description: 'Was Sie bei uns direkt bestellen oder anfragen können.',
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
      return <IconZahlung size={32} />;
    default:
      return <IconWarenkorb size={32} />;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const [page, alle] = await Promise.all([getPageContent(ROUTE), getCollection('standardArticles')]);
  // Nur mit mindestens einem echten (indexierbaren) Artikel in Suchmaschinen — Beispielartikel
  // allein ergeben keine eigene Seite (Erg. Leitfaden §4, MENSCHEN M-25). Wie in der Sitemap.
  const indexierbar = !page?.seo.noindex && alle.some(istIndexierbar);
  const direktkauf = alle.some(istBestellbar);
  return {
    title: page?.seo.title || TITEL,
    description: direktkauf ? page?.seo.description || BESCHREIBUNG : BESCHREIBUNG_ANFRAGE,
    alternates: { canonical: `/${ROUTE}` },
    ...(indexierbar ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function ArtikelPage() {
  const [page, alle] = await Promise.all([
    getPageContent(ROUTE),
    getCollection('standardArticles'),
  ]);

  // Beispielartikel kennt die Datenschicht hier nicht (A-046); ohne echte Artikel bleibt der Leerzustand.
  const articles = sortiereArtikel(alle);
  const beispiele = articles.filter((a) => a.example).length;
  const nurBeispiele = articles.length > 0 && beispiele === articles.length;
  // Direktkauf in Kopfzeile, Unterzeile und Abschnitt nur mit mindestens einem bestellbaren Artikel (kein Beispiel, lieferbar).
  const direktkauf = articles.some(istBestellbar);

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
    ...(a.availability ? { availability: a.availability } : {}),
    deliveryTime: a.deliveryTime,
  }));

  const extraLinks: NavLink[] = (page?.seo.internalLinks ?? []).filter(
    (link) => link.href !== `/${ROUTE}` && !BASE_LINKS.some((base) => base.href === link.href),
  );
  const links = [...BASE_LINKS, ...extraLinks];
  const titel = page?.headline || TITEL;
  const crumbs = [{ href: `/${ROUTE}`, label: TITEL }];

  // Beispielhinweis als Zeile mit Glyphe direkt über der Liste (K-006 „Flächen sparsam“), kein Kasten im Kopf.
  const beispielHinweis = beispiele > 0 ? (
    <div role="note" className="flex max-w-measure gap-3 text-small leading-relaxed">
      <GlyphInfo size={18} className="mt-0.5 shrink-0 text-info" />
      <div className="min-w-0">
        <p className="font-semibold text-foreground">
          {nurBeispiele ? 'Derzeit nur Beispielartikel' : 'Beispielartikel sind gekennzeichnet'}
        </p>
        <p className="text-foreground-muted">
          Artikel mit dem Hinweis „Beispiel“ zeigen nur, wie Artikel hier dargestellt werden.
          Preise und Angaben sind Beispielwerte. Diese Artikel können Sie nicht bestellen.
        </p>
      </div>
    </div>
  ) : null;

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: titel,
          description: direktkauf ? page?.seo.description || BESCHREIBUNG : BESCHREIBUNG_ANFRAGE,
          crumbs,
        })}
      />

      <PageHeader
        eyebrow={direktkauf ? PROCESS_LABELS.direktkauf.label : 'Auf Anfrage'}
        title={titel}
        lead={direktkauf ? page?.subline || LEAD : LEAD_OHNE_ARTIKEL}
        crumbs={crumbs}
      />

      <Section tight labelledBy="artikel-titel">
        {articles.length > 0 ? (
          <>
            {/* Haarlinie über dem nummerierten Abschnittskopf */}
            <div className="border-t border-border pt-8">
              <SectionHeading
                id="artikel-titel"
                nummer="01"
                eyebrow="Auswahl"
                title="Artikel auswählen"
                lead={
                  direktkauf
                    ? page?.intro
                      || 'Öffnen Sie einen Artikel. Dort finden Sie Eigenschaften, Lieferumfang und '
                        + 'Staffelpreise und wählen die Stückzahl.'
                    : 'Öffnen Sie einen Artikel. Dort finden Sie Eigenschaften und Lieferumfang.'
                }
              />
            </div>
            {/* Ohne bestellbaren Artikel sagt der Kopf „fragen Sie an“: der Weg dorthin steht hier (keine Sackgasse). */}
            {!direktkauf && (
              <div className="mt-6">
                <ButtonLink href={artikelAnfragePfad('Schließtechnik und Zubehör')} variant="outline">
                  Artikel anfragen
                </ButtonLink>
              </div>
            )}
            <PreisHinweis alle className="mt-4" />
            <ArtikelListe articles={liste} hinweis={beispielHinweis} className="mt-6" />
          </>
        ) : (
          <Card variant="muted">
            <CardBody className="flex flex-col items-start gap-4 py-8 text-left sm:items-center sm:text-center">
              <div>
                <h2 className="text-body font-bold text-foreground">
                  Hier gibt es gerade keine Artikel.
                </h2>
                <p className="mt-2 max-w-md text-small leading-relaxed text-foreground-muted">
                  Suchen Sie Zubehör oder ein Ersatzteil für Schlüssel, Schloss oder Tür, fragen Sie
                  uns. Wir beraten Sie und sagen Ihnen, was passt.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 sm:justify-center">
                <ButtonLink href="/beratung" pfeil>
                  Zur Beratung
                </ButtonLink>
                <ButtonLink href={artikelAnfragePfad('Schließtechnik und Zubehör')} variant="outline">
                  Artikel anfragen
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
          lead="Hier geht es weiter zu Schlüssel nach Code, zu gleichschließenden Zylindern und zu Zahlung und Versand."
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
                  className="shrink-0 text-foreground-muted transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-primary group-focus-visible:text-primary"
                />
              </Link>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
