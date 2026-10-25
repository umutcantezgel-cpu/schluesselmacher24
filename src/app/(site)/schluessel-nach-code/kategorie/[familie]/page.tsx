import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getCodeLines } from '@/lib/data';
import { codeFamilien, codelinieIndexierbar, herstellerPfad, kategoriePfad } from '@/lib/codelinie';
import { kategorieTexte } from '@/lib/codelinie-texte';
import { PROCESS_LABELS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { PreisHinweis } from '@/components/recht/preis-hinweis';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

import { LinienListe } from '../../linien-liste';
import { RATGEBER_FUNDSTELLE, shopDaten } from '../../shop-daten';

interface KategoriePageProps {
  params: Promise<{ familie: string }>;
}

export async function generateStaticParams() {
  return codeFamilien(await getCodeLines()).map((familie) => ({ familie: familie.adresse }));
}

/** Neue Familien aus dem Backend erscheinen ohne neuen Build; Unbekanntes führt auf die 404-Seite. */
export const dynamicParams = true;

async function laden(adresse: string) {
  const daten = await shopDaten();
  const familie = daten.familien.find((f) => f.adresse === adresse);
  if (!familie) return null;
  return { ...daten, familie, texte: kategorieTexte(familie.name, familie.lines, daten.ratgeber) };
}

export async function generateMetadata(props: KategoriePageProps): Promise<Metadata> {
  const { familie: adresse } = await props.params;
  const geladen = await laden(adresse);
  if (!geladen) return { title: 'Kategorie nicht gefunden', robots: { index: false, follow: true } };
  const { familie, texte } = geladen;
  return {
    title: texte.metaTitel,
    description: texte.metaBeschreibung,
    alternates: { canonical: kategoriePfad(familie.name) },
    // Nur Beispiele oder ausgeblendete Linien: Die Seite hat nichts Eigenes für Suchmaschinen.
    ...(familie.lines.some(codelinieIndexierbar) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function KategoriePage(props: KategoriePageProps) {
  const { familie: adresse } = await props.params;
  const geladen = await laden(adresse);
  if (!geladen) notFound();
  const { familie, familien, hersteller, texte, ratgeber } = geladen;

  const pfad = kategoriePfad(familie.name);
  const crumbs = [
    { href: '/schluessel-nach-code', label: 'Schlüssel nach Code' },
    { href: pfad, label: familie.name },
  ];
  const andere = familien.filter((f) => f.adresse !== familie.adresse);
  const herstellerHier = hersteller.filter((h) => h.lines.some((line) => familie.lines.includes(line)));

  return (
    <>
      <JsonLd
        data={pageGraphSchema({ path: pfad, name: familie.name, description: texte.metaBeschreibung, crumbs })}
      />

      <PageHeader
        eyebrow={`${familie.kuerzel ? `${familie.kuerzel} · ` : ''}${PROCESS_LABELS.direktkauf.label}`}
        title={familie.name}
        lead={texte.einleitung}
        crumbs={crumbs}
        bereich="schluessel-nach-code"
      />

      <Section tight labelledBy="linien-titel">
        <SectionHeading
          id="linien-titel"
          nummer="01"
          eyebrow="Codelinien"
          title={`Alle Codelinien: ${familie.name}`}
          lead="Jede Linie hat eine eigene Seite mit Codeformat, Beispiel, Preis und Bestellformular."
        />
        <PreisHinweis alle className="mt-4" />
        <LinienListe lines={familie.lines} className="mt-6" />
      </Section>

      <Section tone="muted" tight labelledBy="angaben-titel">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading id="angaben-titel" nummer="02" eyebrow="Angaben" title="Was diese Familie ausmacht" />
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
                      <Link
                        href={`/ratgeber/${RATGEBER_FUNDSTELLE}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        Mehr im Ratgeber „{ratgeber.title}“.
                      </Link>
                    </>
                  )}
                </p>
              )}
            </div>
          </div>

          <nav aria-label="Weitere Kategorien" className="lg:col-span-5">
            <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Weitere Kategorien</p>
            <ul className="mt-3 border-t border-border">
              {[
                ...andere.map((f) => ({ href: kategoriePfad(f.name), label: f.name })),
                ...herstellerHier.map((h) => ({ href: herstellerPfad(h.name), label: `Hersteller: ${h.name}` })),
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
    </>
  );
}
