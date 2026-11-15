import type { Metadata } from 'next';
import Link from 'next/link';

import { getCodeLines, getCollection, getKategorien, getShopKategorien } from '@/lib/data';
import { codeKategorien, kategoriePfad } from '@/lib/codelinie';
import { formatNumber } from '@/lib/format';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { SeitenDaten } from '@/components/seo/seiten-daten';
import { ButtonLink } from '@/components/ui/button';
import { GlyphInfo } from '@/components/visual/glyphen/info';

import { SHOP_SEO, kategorieWeg } from './kategorie-weg';

export const metadata: Metadata = {
  title: SHOP_SEO.title,
  description: SHOP_SEO.description,
  alternates: { canonical: '/shop' },
};

const CRUMBS = [{ href: '/shop', label: 'Shop' }];

/**
 * Einstieg in den Shop nach Kategorien (FA-10, FA-SHOP-01B Punkt 1): die
 * sichtbaren Hauptkategorien des Inhabers aus den Daten, in seiner
 * Reihenfolge, jede mit ihrem Weg. Ohne Produkte sagt die Kategorie das
 * ehrlich und führt in die passende Anfrage. Verborgene Kategorien erscheinen
 * nicht. Der Termin für Autoschlüssel bleibt ein eigener Weg.
 */
export default async function ShopSeite() {
  const [sichtbar, alle, lines, artikel] = await Promise.all([
    getShopKategorien(),
    getKategorien(),
    getCodeLines(),
    getCollection('standardArticles'),
  ]);
  const haupt = sichtbar.filter((k) => !k.eltern);
  // Unterkategorien der Codeprodukte mit Linien; ohne Linien hätten sie nichts zu zeigen.
  const unterCode = codeKategorien(alle, lines).filter((k) => k.lines.length > 0);
  const anzahl = (art: string) => (art === 'codeprodukte' ? lines.length : art === 'artikel' ? artikel.length : 0);

  return (
    <>
      <SeitenDaten pfad="/shop" name="Shop" beschreibung={SHOP_SEO.description} crumbs={CRUMBS} />

      <PageHeader
        eyebrow="Shop"
        title="Was möchten Sie bestellen?"
        lead="Hier finden Sie alles, was Sie bei uns direkt bestellen oder anfragen können, nach Kategorie geordnet."
        crumbs={CRUMBS}
        bereich="schluessel-nach-code"
      />

      <Section tight labelledBy="kategorien-titel">
        <SectionHeading id="kategorien-titel" nummer="01" eyebrow="Kategorien" title="Alle Kategorien" />
        <ol className="mt-8 border-t border-border">
          {haupt.map((kategorie, index) => {
            const zahl = anzahl(kategorie.art);
            const weg = kategorieWeg(kategorie, zahl);
            const unter = kategorie.art === 'codeprodukte' ? unterCode.filter((k) => k.kategorie.eltern === kategorie.id) : [];
            return (
              <li key={kategorie.id} id={kategorie.slug} className="scroll-mt-28 border-b border-border py-6">
                <div className="grid gap-4 md:grid-cols-12 md:items-start md:gap-gutter">
                  <span className="font-mono text-caption tabular-nums text-foreground-muted md:col-span-1">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 md:col-span-7">
                    <h2 className="text-title-sm font-semibold text-foreground">{kategorie.name}</h2>
                    <p className="mt-1 max-w-measure text-body text-foreground-muted">{kategorie.beschreibung}</p>
                    {zahl > 0 && (
                      <p className="mt-2 font-mono text-caption tabular-nums text-foreground-muted">
                        {formatNumber(zahl)} {kategorie.art === 'codeprodukte' ? (zahl === 1 ? 'Codelinie' : 'Codelinien') : 'Artikel'}
                      </p>
                    )}
                    {weg.hinweis && (
                      <p className="mt-3 flex max-w-measure items-start gap-2 text-small text-foreground-muted">
                        <GlyphInfo size={16} className="mt-0.5 shrink-0" />
                        <span>{weg.hinweis}</span>
                      </p>
                    )}
                    {unter.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-x-6">
                        {unter.map(({ kategorie: k }) => (
                          <li key={k.id}>
                            <Link
                              href={kategoriePfad(k.slug)}
                              prefetch={false}
                              className="inline-flex min-h-touch items-center text-small font-semibold text-primary hover:underline"
                            >
                              {k.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="md:col-span-4 md:justify-self-end">
                    <ButtonLink href={weg.href} variant={zahl > 0 || kategorie.art === 'konfigurator' ? 'primary' : 'outline'} prefetch={false} pfeil>
                      {weg.label}
                      <span className="sr-only">: {kategorie.name}</span>
                    </ButtonLink>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Vorgabe des Inhabers (Abschnitt 10): Der Terminbereich für Autoschlüssel bleibt getrennt. */}
        <p className="mt-8 flex max-w-measure items-start gap-2 text-small text-foreground-muted">
          <GlyphInfo size={16} className="mt-0.5 shrink-0" />
          <span>
            Einen Termin für Ihren Autoschlüssel in unserer Werkstatt fragen Sie im eigenen Bereich an:{' '}
            <Link href="/autoschluessel" className="font-semibold text-primary hover:underline">
              Autoschlüssel
            </Link>
            .
          </span>
        </p>
      </Section>
    </>
  );
}
