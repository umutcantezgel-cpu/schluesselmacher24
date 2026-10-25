import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getCodeLines } from '@/lib/data';
import { codeFamilien, codeHersteller, codelinieIndexierbar, herstellerPfad, kategoriePfad } from '@/lib/codelinie';
import { herstellerTexte } from '@/lib/codelinie-texte';
import { PROCESS_LABELS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { PreisHinweis } from '@/components/recht/preis-hinweis';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

import { LinienListe } from '../../linien-liste';
import { shopDaten } from '../../shop-daten';

interface HerstellerPageProps {
  params: Promise<{ hersteller: string }>;
}

/**
 * Herstellerebene (Erg. Leitfaden §3): Es gibt eine Seite je Hersteller,
 * sobald mindestens eine Linie einen gepflegten Hersteller trägt. Solange
 * überall der Platzhalter steht, ist die Liste leer und jede Adresse 404.
 */
export async function generateStaticParams() {
  return codeHersteller(await getCodeLines()).map((h) => ({ hersteller: h.adresse }));
}

/** Im Backend neu eingetragene Hersteller erscheinen ohne neuen Build. */
export const dynamicParams = true;

async function laden(adresse: string) {
  const daten = await shopDaten();
  const eintrag = daten.hersteller.find((h) => h.adresse === adresse);
  if (!eintrag) return null;
  return { ...daten, eintrag, texte: herstellerTexte(eintrag.name, eintrag.lines) };
}

export async function generateMetadata(props: HerstellerPageProps): Promise<Metadata> {
  const { hersteller: adresse } = await props.params;
  const geladen = await laden(adresse);
  if (!geladen) return { title: 'Hersteller nicht gefunden', robots: { index: false, follow: true } };
  const { eintrag, texte } = geladen;
  return {
    title: texte.metaTitel,
    description: texte.metaBeschreibung,
    alternates: { canonical: herstellerPfad(eintrag.name) },
    ...(eintrag.lines.some(codelinieIndexierbar) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function HerstellerPage(props: HerstellerPageProps) {
  const { hersteller: adresse } = await props.params;
  const geladen = await laden(adresse);
  if (!geladen) notFound();
  const { eintrag, hersteller, texte } = geladen;

  const pfad = herstellerPfad(eintrag.name);
  const crumbs = [
    { href: '/schluessel-nach-code', label: 'Schlüssel nach Code' },
    { href: pfad, label: eintrag.name },
  ];
  // Die Linien des Herstellers nach Anwendungsfamilie, jede Familie mit Link auf ihre Kategorie.
  const gruppen = codeFamilien(eintrag.lines);
  const andere = hersteller.filter((h) => h.adresse !== eintrag.adresse);

  return (
    <>
      <JsonLd data={pageGraphSchema({ path: pfad, name: eintrag.name, description: texte.metaBeschreibung, crumbs })} />

      <PageHeader
        eyebrow={`Hersteller · ${PROCESS_LABELS.direktkauf.label}`}
        title={`Schlüssel nach Code für ${eintrag.name}`}
        lead={texte.einleitung}
        crumbs={crumbs}
        bereich="schluessel-nach-code"
      />

      <Section tight labelledBy="hersteller-linien">
        <SectionHeading id="hersteller-linien" nummer="01" eyebrow="Codelinien" title={`Codelinien von ${eintrag.name}`} />
        <div className="prose-sm24 mt-4">
          {texte.absaetze.map((absatz) => (
            <p key={absatz}>{absatz}</p>
          ))}
        </div>
        <PreisHinweis alle className="mt-4" />
        <div className="mt-8 grid gap-10">
          {gruppen.map((gruppe) => (
            <section key={gruppe.adresse} aria-label={gruppe.name}>
              <h2 className="eyebrow">
                <Link href={kategoriePfad(gruppe.name)} prefetch={false} className="hover:text-primary">
                  {gruppe.name}
                </Link>
              </h2>
              <LinienListe lines={gruppe.lines} className="mt-4" />
            </section>
          ))}
        </div>
      </Section>

      {andere.length > 0 && (
        <Section tone="muted" tight>
          <nav aria-label="Weitere Hersteller">
            <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Weitere Hersteller</p>
            <ul className="mt-3 border-t border-border">
              {andere.map((h) => (
                <li key={h.adresse} className="border-b border-border">
                  <Link
                    href={herstellerPfad(h.name)}
                    prefetch={false}
                    className="group flex min-h-touch items-center justify-between gap-4 py-3 text-body font-semibold text-foreground hover:text-primary"
                  >
                    {h.name}
                    <GlyphPfeilRechts size={16} className="shrink-0 text-foreground-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Section>
      )}
    </>
  );
}
