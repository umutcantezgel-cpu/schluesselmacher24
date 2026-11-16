import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';

import { artikelAnfragePfad, artikelKategorieBeschreibung, artikelKategorieTitel, istIndexierbar, sortiereArtikel } from '@/lib/artikel';
import { getCollection, getKategorien } from '@/lib/data';
import { HINWEIS_PRODUKTE_FOLGEN } from '@/lib/data/defaults/kategorien';
import {
  ARTIKEL_PFAD,
  artikelDerKategorie,
  artikelListePfad,
  artikelListenKategorien,
  artikelUnterkategorien,
  ersteArtikelKategorie,
  istBestellbar,
  kategorieAufloesen,
  kategorieKette,
} from '@/lib/data/shop';
import { PROCESS_LABELS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { PreisHinweis } from '@/components/recht/preis-hinweis';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { ButtonLink } from '@/components/ui/button';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

import { BeispielHinweis, UnterkategorienListe, zuListenArtikel } from '../../artikel-ansicht';
import { ArtikelListe } from '../../artikel-liste';

interface ArtikelKategorieProps {
  /** In Next.js 16 sind Routenparameter ein Promise. */
  params: Promise<{ slug: string }>;
}

/**
 * Artikelliste je Kategorie (FA-10-10, FA-10-11): jede weitere sichtbare Hauptkategorie mit der Art
 * „artikel“ und jede Unterkategorie einer Artikel-Kategorie. Die erste Artikel-Kategorie hat ihre Liste
 * unter `/artikel`. Vorab erzeugt werden nur Kategorien mit Artikeln.
 */
export async function generateStaticParams() {
  const [kategorien, artikel] = await Promise.all([getKategorien(), getCollection('standardArticles')]);
  return artikelListenKategorien(kategorien)
    .filter((k) => artikelDerKategorie(kategorien, artikel, k.id, false).length > 0)
    .map((k) => ({ slug: k.slug }));
}

/** Neue oder umbenannte Kategorien aus dem Backend erscheinen ohne neuen Build; Unbekanntes führt auf die 404-Seite. */
export const dynamicParams = true;

async function laden(slug: string) {
  const [kategorien, alle] = await Promise.all([getKategorien(), getCollection('standardArticles')]);
  const erste = ersteArtikelKategorie(kategorien);
  const treffer = kategorieAufloesen(kategorien, slug);
  const gefunden = treffer?.kategorie ?? treffer?.weiterleitung;
  if (!gefunden) return null;
  // Die erste Artikel-Kategorie hat ihre Liste unter /artikel; keine zweite Adresse für dieselbe Liste.
  if (gefunden.id === erste?.id) permanentRedirect(ARTIKEL_PFAD);
  if (!artikelListenKategorien(kategorien).some((k) => k.id === gefunden.id)) return null;
  if (treffer?.weiterleitung) permanentRedirect(artikelListePfad(gefunden, erste?.id));
  const kategorie = gefunden;
  const artikel = sortiereArtikel(artikelDerKategorie(kategorien, alle, kategorie.id, false));
  const unter = artikelUnterkategorien(kategorien, kategorie.id, alle);
  const kette = kategorieKette(kategorien, kategorie.id);
  return { kategorie, artikel, unter, kette, ersteId: erste?.id };
}

export async function generateMetadata(props: ArtikelKategorieProps): Promise<Metadata> {
  const { slug } = await props.params;
  const geladen = await laden(slug);
  if (!geladen) return { title: 'Kategorie nicht gefunden', robots: { index: false, follow: true } };
  const { kategorie, artikel, ersteId } = geladen;
  // Ohne indexierbaren Artikel (leer, nur Beispiele oder ausgeschlossen) nicht in Suchmaschinen (R2, R3).
  const indexierbar = artikel.some(istIndexierbar) && !kategorie.seo?.noindex;
  return {
    title: kategorie.seo?.title || artikelKategorieTitel(kategorie.name),
    description: kategorie.seo?.description || artikelKategorieBeschreibung(kategorie.name, artikel.some(istBestellbar)),
    alternates: { canonical: artikelListePfad(kategorie, ersteId) },
    ...(indexierbar ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function ArtikelKategorieSeite(props: ArtikelKategorieProps) {
  const { slug } = await props.params;
  const geladen = await laden(slug);
  if (!geladen) notFound();
  const { kategorie, artikel, unter, kette, ersteId } = geladen;

  const pfad = artikelListePfad(kategorie, ersteId);
  const crumbs = [
    { href: '/shop', label: 'Shop' },
    ...kette.map((glied) => ({ href: artikelListePfad(glied, ersteId), label: glied.name })),
  ];
  const direktkauf = artikel.some(istBestellbar);
  const beispiele = artikel.filter((a) => a.example).length;
  const anfrage = artikelAnfragePfad(kategorie.name);
  const beschreibung = kategorie.seo?.description || artikelKategorieBeschreibung(kategorie.name, direktkauf);
  // Übergeordnete Liste für den Rückweg, wenn es eine gibt; sonst die Übersicht des Shops.
  const eltern = kette.length > 1 ? kette[kette.length - 2] : undefined;
  const weiter = [
    ...(eltern ? [{ href: artikelListePfad(eltern, ersteId), label: `Zurück zu ${eltern.name}` }] : []),
    { href: '/shop', label: 'Alle Shop-Kategorien' },
  ];

  return (
    <>
      <JsonLd data={pageGraphSchema({ path: pfad, name: kategorie.name, description: beschreibung, crumbs })} />

      <PageHeader
        eyebrow={direktkauf ? PROCESS_LABELS.direktkauf.label : 'Auf Anfrage'}
        title={kategorie.name}
        lead={kategorie.beschreibung}
        crumbs={crumbs}
      />

      <Section tight labelledBy="artikel-titel">
        {artikel.length > 0 ? (
          <>
            <div className="border-t border-border pt-8">
              <SectionHeading
                id="artikel-titel"
                nummer="01"
                eyebrow="Auswahl"
                title="Artikel auswählen"
                lead={
                  direktkauf
                    ? 'Öffnen Sie einen Artikel. Dort finden Sie Eigenschaften, Lieferumfang und Staffelpreise und wählen die Stückzahl.'
                    : 'Öffnen Sie einen Artikel. Dort finden Sie Eigenschaften und Lieferumfang.'
                }
              />
            </div>
            {!direktkauf && (
              <div className="mt-6">
                <ButtonLink href={anfrage} variant="outline">
                  Artikel anfragen
                </ButtonLink>
              </div>
            )}
            <UnterkategorienListe eintraege={unter} />
            <PreisHinweis alle className="mt-4" />
            <ArtikelListe
              articles={artikel.map(zuListenArtikel)}
              hinweis={beispiele > 0 ? <BeispielHinweis beispiele={beispiele} gesamt={artikel.length} /> : null}
              className="mt-6"
            />
          </>
        ) : (
          /* Noch keine Artikel: ehrlicher Zustand mit der Anfrage, wie der Weg im Shop (FA-SHOP-01B, Punkt 1). */
          <div role="note" className="flex max-w-measure items-start gap-3">
            <GlyphInfo size={18} className="mt-1 shrink-0 text-foreground-muted" />
            <div className="min-w-0">
              <h2 id="artikel-titel" className="text-body font-semibold text-foreground">
                {kategorie.hinweis?.trim() || HINWEIS_PRODUKTE_FOLGEN}
              </h2>
              <div className="mt-6">
                <ButtonLink href={anfrage} pfeil>
                  Artikel anfragen
                </ButtonLink>
              </div>
            </div>
          </div>
        )}
      </Section>

      <Section tone="muted" tight labelledBy="weiter-titel">
        <nav aria-labelledby="weiter-titel">
          <p id="weiter-titel" className="font-mono text-caption uppercase tracking-label text-foreground-muted">
            Weiter im Shop
          </p>
          <ul className="mt-3 border-t border-border">
            {weiter.map((link) => (
              <li key={link.href} className="border-b border-border">
                <Link
                  href={link.href}
                  prefetch={false}
                  className="group flex min-h-touch items-center justify-between gap-4 py-3 text-body font-semibold text-foreground transition-colors duration-quick hover:text-primary"
                >
                  {link.label}
                  <GlyphPfeilRechts
                    size={16}
                    className="shrink-0 text-foreground-muted transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-primary"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>
    </>
  );
}
