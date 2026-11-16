import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getCodeLines, getHersteller } from '@/lib/data';
import { codelinieIndexierbar, gepflegt, herstellerMitSeite, herstellerPfad } from '@/lib/codelinie';
import { gruppeLieferbar, herstellerTexte } from '@/lib/codelinie-texte';
import { PROCESS_LABELS } from '@/lib/navigation';
import { codeAnfragePfad } from '@/lib/wege/code-anfrage';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { PreisHinweis } from '@/components/recht/preis-hinweis';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

import { HerstellerMarke } from '../../hersteller-marke';
import { LinienListe } from '../../linien-liste';
import { shopDaten } from '../../shop-daten';

interface HerstellerPageProps {
  params: Promise<{ hersteller: string }>;
}

/**
 * Herstellerebene (FA-11-05, FA-11-06): eine Seite je Hersteller, der
 * mindestens eine Linie hat; unter ihm stehen nur seine Linien, nach System
 * gruppiert. Ein Hersteller der Stammliste ohne Linien hat keine Seite.
 */
export async function generateStaticParams() {
  const [lines, stamm] = await Promise.all([getCodeLines(), getHersteller()]);
  return herstellerMitSeite(lines, stamm).map((h) => ({ hersteller: h.adresse }));
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
    alternates: { canonical: herstellerPfad(eintrag.adresse) },
    ...(eintrag.lines.some(codelinieIndexierbar) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function HerstellerPage(props: HerstellerPageProps) {
  const { hersteller: adresse } = await props.params;
  const geladen = await laden(adresse);
  if (!geladen) notFound();
  const { eintrag, hersteller, texte } = geladen;

  const pfad = herstellerPfad(eintrag.adresse);
  const crumbs = [
    { href: '/schluessel-nach-code', label: 'Schlüssel nach Code' },
    { href: pfad, label: eintrag.name },
  ];
  const andere = hersteller.filter((h) => h.adresse !== eintrag.adresse);
  const einsatz = gepflegt(eintrag.stamm?.einsatz);

  return (
    <>
      <JsonLd data={pageGraphSchema({ path: pfad, name: eintrag.name, description: texte.metaBeschreibung, crumbs })} />

      <PageHeader
        eyebrow={gruppeLieferbar(eintrag.lines) ? `Hersteller · ${PROCESS_LABELS.direktkauf.label}` : 'Hersteller · Auf Anfrage'}
        title={`Schlüssel nach Code für ${eintrag.name}`}
        lead={texte.einleitung}
        crumbs={crumbs}
        bereich="schluessel-nach-code"
      >
        {/* Logo nur mit Freigabe des Herstellers (R12), sonst der Name als Text. */}
        <HerstellerMarke name={eintrag.name} logo={eintrag.stamm?.logo} />
      </PageHeader>

      <Section tight labelledBy="hersteller-linien">
        <SectionHeading id="hersteller-linien" nummer="01" eyebrow="Produkte" title={`Schlüssel für Schlösser von ${eintrag.name}`} />
        <div className="prose-sm24 mt-4">
          {einsatz && <p>{einsatz}</p>}
          {texte.absaetze.map((absatz) => (
            <p key={absatz}>{absatz}</p>
          ))}
        </div>
        <PreisHinweis alle className="mt-4" />
        {/* Nach System gruppiert (FA-11-04); nur die Linien dieses Herstellers (FA-11-06). */}
        <div className="mt-8 grid gap-10">
          {eintrag.systeme.map((system) => (
            <section key={system.name ?? 'ohne-system'} aria-label={system.name ? `System ${system.name}` : 'Weitere Produkte'}>
              {system.name && <h2 className="eyebrow">System {system.name}</h2>}
              <LinienListe lines={system.lines} className={system.name ? 'mt-4' : undefined} />
            </section>
          ))}
        </div>
        {/* Code passt zu keiner Linie (FA-11-17): die Anfrage steht auf jeder Liste. */}
        <p className="mt-6 text-small text-foreground-muted">
          Passt Ihr Code zu keinem Produkt, prüfen wir ihn gern.{' '}
          <Link
            href={codeAnfragePfad({ schloss: eintrag.name })}
            prefetch={false}
            className="font-semibold text-primary hover:underline"
          >
            Code anfragen
          </Link>
        </p>
      </Section>

      <Section tone="muted" tight>
        <nav aria-label="Weitere Hersteller">
          <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
            {andere.length > 0 ? 'Weitere Hersteller' : 'Weiter im Shop'}
          </p>
          <ul className="mt-3 border-t border-border">
            {[
              ...andere.map((h) => ({ href: herstellerPfad(h.adresse), label: h.name })),
              { href: '/schluessel-nach-code', label: 'Alle Schlüssel nach Code, mit Suche und Filter' },
            ].map((link) => (
              <li key={link.href} className="border-b border-border">
                <Link
                  href={link.href}
                  prefetch={false}
                  className="group flex min-h-touch items-center justify-between gap-4 py-3 text-body font-semibold text-foreground hover:text-primary"
                >
                  {link.label}
                  <GlyphPfeilRechts size={16} className="shrink-0 text-foreground-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>
    </>
  );
}
