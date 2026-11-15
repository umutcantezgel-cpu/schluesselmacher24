import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';

import { getCodeLines, getKategorien } from '@/lib/data';
import {
  codeKategorieAufloesen,
  codeKategorien,
  codelinieIndexierbar,
  herstellerPfad,
  kategoriePfad,
  nachHerstellerUndSystem,
} from '@/lib/codelinie';
import { gruppeLieferbar, kategorieTexte } from '@/lib/codelinie-texte';
import { PROCESS_LABELS } from '@/lib/navigation';
import { codeAnfragePfad } from '@/lib/wege/code-anfrage';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { PreisHinweis } from '@/components/recht/preis-hinweis';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { ButtonLink } from '@/components/ui/button';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

import { LinienListe } from '../../linien-liste';
import { RATGEBER_FUNDSTELLE, shopDaten } from '../../shop-daten';

interface KategoriePageProps {
  params: Promise<{ kategorie: string }>;
}

/**
 * Unterkategorien der Codeprodukte aus den Daten (Sammlung „Shop-Kategorien“,
 * FA-10, FA-22-04): eine Seite je sichtbarer Unterkategorie von „Schlüssel
 * nach Code“. Eine frühere Adresse leitet dauerhaft auf die aktuelle weiter.
 */
export async function generateStaticParams() {
  const [kategorien, lines] = await Promise.all([getKategorien(), getCodeLines()]);
  return codeKategorien(kategorien, lines).map(({ kategorie }) => ({ kategorie: kategorie.slug }));
}

/** Neue oder umbenannte Kategorien aus dem Backend erscheinen ohne neuen Build; Unbekanntes führt auf die 404-Seite. */
export const dynamicParams = true;

async function laden(adresse: string) {
  const daten = await shopDaten();
  const treffer = codeKategorieAufloesen(daten.kategorienAlle, adresse);
  if (treffer?.weiterleitung) permanentRedirect(treffer.weiterleitung);
  const eintrag = treffer?.kategorie && daten.kategorien.find((k) => k.kategorie.id === treffer.kategorie.id);
  if (!eintrag) return null;
  const texte = eintrag.lines.length > 0 ? kategorieTexte(eintrag.kategorie.name, eintrag.lines, daten.ratgeber) : null;
  return { ...daten, eintrag, texte };
}

export async function generateMetadata(props: KategoriePageProps): Promise<Metadata> {
  const { kategorie: adresse } = await props.params;
  const geladen = await laden(adresse);
  if (!geladen) return { title: 'Kategorie nicht gefunden', robots: { index: false, follow: true } };
  const { eintrag, texte } = geladen;
  const { kategorie } = eintrag;
  return {
    title: kategorie.seo?.title || texte?.metaTitel || kategorie.name,
    description: kategorie.seo?.description || texte?.metaBeschreibung || kategorie.beschreibung,
    alternates: { canonical: kategoriePfad(kategorie.slug) },
    // Ohne indexierbare Linie (leer, nur Beispiele oder ausgeblendet) hat die Seite nichts Eigenes für Suchmaschinen.
    ...(eintrag.lines.some(codelinieIndexierbar) && !kategorie.seo?.noindex ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function KategoriePage(props: KategoriePageProps) {
  const { kategorie: adresse } = await props.params;
  const geladen = await laden(adresse);
  if (!geladen) notFound();
  const { eintrag, kategorien, stamm, texte, ratgeber } = geladen;
  const { kategorie, lines } = eintrag;

  const pfad = kategoriePfad(kategorie.slug);
  const crumbs = [
    { href: '/schluessel-nach-code', label: 'Schlüssel nach Code' },
    { href: pfad, label: kategorie.name },
  ];
  const andere = kategorien.filter((k) => k.kategorie.id !== kategorie.id && k.lines.length > 0);
  const gruppen = nachHerstellerUndSystem(lines, stamm);
  const herstellerHier = gruppen.filter((g) => g.name && g.adresse);

  return (
    <>
      <JsonLd
        data={pageGraphSchema({ path: pfad, name: kategorie.name, description: texte?.metaBeschreibung ?? kategorie.beschreibung, crumbs })}
      />

      <PageHeader
        eyebrow={gruppeLieferbar(lines) ? `Kategorie · ${PROCESS_LABELS.direktkauf.label}` : 'Kategorie · Auf Anfrage'}
        title={kategorie.name}
        lead={texte?.einleitung ?? kategorie.beschreibung}
        crumbs={crumbs}
        bereich="schluessel-nach-code"
      />

      <Section tight labelledBy="linien-titel">
        {lines.length > 0 ? (
          <>
            <SectionHeading
              id="linien-titel"
              nummer="01"
              eyebrow="Codelinien"
              title={`Alle Codelinien: ${kategorie.name}`}
              lead="Nach Hersteller und System geordnet. Jede Linie hat eine eigene Seite mit Codeformat, Beispiel und Bestellung."
            />
            <PreisHinweis alle className="mt-4" />
            <div className="mt-8 grid gap-10">
              {gruppen.map((gruppe) => (
                <section key={gruppe.adresse ?? 'ohne'} aria-label={gruppe.name ?? 'Ohne Herstellerangabe'}>
                  {gruppe.name && gruppe.adresse && (
                    <h2 className="text-title-sm font-semibold text-foreground">
                      <Link href={herstellerPfad(gruppe.adresse)} prefetch={false} className="hover:text-primary hover:underline">
                        {gruppe.name}
                      </Link>
                    </h2>
                  )}
                  {gruppe.systeme.map((system) => (
                    <div key={system.name ?? 'ohne-system'} className="mt-4">
                      {system.name && <p className="eyebrow">System {system.name}</p>}
                      <LinienListe lines={system.lines} className={system.name ? 'mt-3' : undefined} />
                    </div>
                  ))}
                </section>
              ))}
            </div>
            <p className="mt-6 text-small text-foreground-muted">
              Ihr Code passt zu keiner Linie?{' '}
              <Link
                href={codeAnfragePfad({ schloss: kategorie.name })}
                prefetch={false}
                className="font-semibold text-primary hover:underline"
              >
                Code anfragen
              </Link>
            </p>
          </>
        ) : (
          /* Noch keine Produkte: ehrlicher Zustand mit dem passenden Anfrageweg (FA-SHOP-01B, Punkt 1). */
          <div role="note" className="flex max-w-measure items-start gap-3">
            <GlyphInfo size={18} className="mt-1 shrink-0 text-foreground-muted" />
            <div className="min-w-0">
              <h2 id="linien-titel" className="text-body font-semibold text-foreground">
                {kategorie.hinweis || 'Hier gibt es noch keine Produkte. Bis dahin prüfen wir Ihren Code auf Anfrage.'}
              </h2>
              <div className="mt-6">
                <ButtonLink href={codeAnfragePfad({ schloss: kategorie.name })} pfeil>
                  Code anfragen
                </ButtonLink>
              </div>
            </div>
          </div>
        )}
      </Section>

      {(texte || andere.length > 0 || herstellerHier.length > 0) && (
        <Section tone="muted" tight labelledBy="angaben-titel">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
            {texte && (
              <div className="lg:col-span-7">
                <SectionHeading id="angaben-titel" nummer="02" eyebrow="Angaben" title="Was diese Kategorie ausmacht" />
                <div className="prose-sm24 mt-5">
                  {texte.absaetze.map((absatz) => (
                    <p key={absatz}>{absatz}</p>
                  ))}
                  {texte.fundstelle && (
                    <p>
                      {texte.fundstelle}
                      {ratgeber && (
                        <>
                          {' '}
                          <Link href={`/ratgeber/${RATGEBER_FUNDSTELLE}`} className="font-semibold text-primary hover:underline">
                            Mehr im Ratgeber „{ratgeber.title}“.
                          </Link>
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>
            )}

            <nav aria-label="Weitere Kategorien" className={texte ? 'lg:col-span-5' : 'lg:col-span-7'}>
              <p id={texte ? undefined : 'angaben-titel'} className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                Weiter im Shop
              </p>
              <ul className="mt-3 border-t border-border">
                {[
                  ...andere.map((k) => ({ href: kategoriePfad(k.kategorie.slug), label: k.kategorie.name })),
                  ...herstellerHier.map((h) => ({ href: herstellerPfad(h.adresse!), label: `Hersteller: ${h.name}` })),
                  { href: '/schluessel-nach-code', label: 'Alle Codelinien mit Suche und Filter' },
                ].map((link) => (
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
          </div>
        </Section>
      )}
    </>
  );
}
