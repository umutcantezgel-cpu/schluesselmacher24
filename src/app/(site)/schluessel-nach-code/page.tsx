import type { Metadata } from 'next';
import Link from 'next/link';

import { getCodeLines, getPageContent, getRubrik } from '@/lib/data';
import { herstellerPfad, kategoriePfad, verfuegbarkeitVon } from '@/lib/codelinie';
import { formatCents, formatNumber } from '@/lib/format';
import { PROCESS_LABELS } from '@/lib/navigation';
import type { NavLink } from '@/lib/navigation';
import { ButtonLink } from '@/components/ui/button';
import { ausschnittStil } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { RubrikAblaufAbschnitt } from '@/components/rubrik/rubrik-ablauf';
import { Section, SectionHeading } from '@/components/layout/section';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { IconGleichschliessendeZylinder } from '@/components/visual/icons/gleichschliessende-zylinder';
import { IconSicherungskarte } from '@/components/visual/icons/sicherungskarte';
import { IconSchluesselNachVorlage } from '@/components/visual/icons/schluessel-nach-vorlage';
import { IconVersandPaket } from '@/components/visual/icons/versand-paket';
import {
  CODE_FUNDSTELLE_AUSSCHNITT,
  CodeFundstelleGrafik,
} from '@/components/visual/generators/code-fundstelle';
import { PreisHinweis } from '@/components/recht/preis-hinweis';

import { HerstellerMarke } from './hersteller-marke';
import { ShopListe } from './shop-liste';
import { shopDaten } from './shop-daten';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { SpaetVorladen } from '@/lib/spaet-vorladen';
import { CODE_ANFRAGE_PFAD } from '@/lib/wege/code-anfrage';

const ROUTE = 'schluessel-nach-code';

/** Interne Verlinkung am Seitenende — feste Ziele plus gepflegte Ziele aus der Datenschicht. */
const BASE_LINKS: NavLink[] = [
  {
    href: '/schluessel-nach-vorlage',
    label: 'Kein Code vorhanden? Schlüssel nach Vorlage',
    description: 'Mit drei Fotos prüfen wir, ob wir den Schlüssel nachfertigen können.',
  },
  {
    href: '/ratgeber/schluesselcode-finden',
    label: 'Wo finde ich den Schlüsselcode?',
    description: 'Typische Fundstellen auf Schloss, Schlüssel und Unterlagen.',
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
  {
    href: '/shop',
    label: 'Alle Shop-Kategorien',
    description: 'Was Sie bei uns direkt bestellen oder anfragen können.',
  },
];

/** Fach-Icon je Ziel der Weiterlesen-Liste; ohne eigenes Motiv der Bereich. */
function WeiterIcon({ href }: { href: string }) {
  switch (href) {
    case '/schluessel-nach-vorlage':
      return <IconSchluesselNachVorlage size={32} />;
    case '/ratgeber/schluesselcode-finden':
      return <IconSicherungskarte size={32} />;
    case '/gleichschliessende-zylinder':
      return <IconGleichschliessendeZylinder size={32} />;
    case '/rechtliches/versand-und-zahlung':
      return <IconVersandPaket size={32} />;
    default:
      return <BereichIcon area="schluessel-nach-code" size={32} />;
  }
}

/** Titel und Beschreibung ohne echte Codeprodukte (A-046): nichts ist bestellbar, kein Sortiment. */
const OHNE_PRODUKTE_SEO = {
  title: 'Schlüssel nach Code anfragen',
  description:
    'Nennen Sie uns den Code auf Ihrem Schloss oder Schlüssel. Wir prüfen, ob wir danach fertigen können, und melden uns. Ihr Originalschlüssel bleibt bei Ihnen.',
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const [page, lines] = await Promise.all([getPageContent(ROUTE), getCodeLines()]);
  // Ohne Produkte versprechen Suchergebnis und Strukturdaten weder Bestellung noch Sortiment (R4, R8).
  if (lines.length === 0) {
    return { ...OHNE_PRODUKTE_SEO, alternates: { canonical: `/${ROUTE}` } };
  }
  return {
    title: page?.seo.title ?? 'Schlüssel nach Code bestellen',
    description:
      page?.seo.description
      ?? 'Code eingeben, Stückzahl wählen, bestellen: Nach dem Code auf Ihrem Schloss fertigen wir den '
        + 'passenden Schlüssel. Ihr Originalschlüssel bleibt bei Ihnen.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

export default async function SchluesselNachCodePage() {
  // Rubrik dieser Seite: Ziel des Übergangs aus der Hub-Kachel (B-35)
  const rubrik = await getRubrik('schluessel-nach-code');
  const [page, { lines, stamm, hersteller, kategorien }] = await Promise.all([getPageContent(ROUTE), shopDaten()]);

  // Gepflegte interne Links ergänzen die festen Ziele, ohne sie zu doppeln.
  const extraLinks: NavLink[] = (page?.seo.internalLinks ?? []).filter(
    (link) => !BASE_LINKS.some((base) => base.href === link.href),
  );
  const links = [...BASE_LINKS, ...extraLinks];
  // Hersteller und Kategorien als feste Links (Erg. Leitfaden §3): jede Linie mit Hersteller ist auch ohne Suche erreichbar.
  const kategorienMitLinien = kategorien.filter((k) => k.lines.length > 0);
  const mitUebersicht = hersteller.length > 0 || kategorienMitLinien.length > 0;
  const ab = (linien: typeof lines) => {
    const preise = linien.filter((line) => verfuegbarkeitVon(line) === 'lieferbar').map((line) => line.priceCents);
    return preise.length ? ` · ab ${formatCents(Math.min(...preise))}` : '';
  };
  // Ohne echte Codeprodukte (A-046): ehrlicher Leerzustand mit Code-Anfrage statt Produktliste.
  const ohneProdukte = lines.length === 0;

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: '/schluessel-nach-code',
          name: page?.headline ?? 'Schlüssel nach Code',
          description: ohneProdukte ? OHNE_PRODUKTE_SEO.description : page?.seo.description,
          crumbs: [{ href: '/schluessel-nach-code', label: 'Schlüssel nach Code' }],
        })}
      />

      {/* Ziele des Kopfs erst nach dem großen Moment vorladen (D-044) */}
      <SpaetVorladen ziele={['/schluessel-nach-vorlage']} />

      <PageHeader
        rubrik={rubrik}
        eyebrow={ohneProdukte ? 'Auf Anfrage' : PROCESS_LABELS.direktkauf.label}
        title={page?.headline ?? 'Schlüssel nach Code'}
        lead={
          ohneProdukte
            ? 'Sie nennen uns den Code Ihres Schlosses, wir prüfen ihn und melden uns. Ihr Originalschlüssel bleibt bei Ihnen.'
            : (page?.subline ?? 'Code eingeben, Stückzahl wählen, bestellen.')
        }
        crumbs={[{ href: '/schluessel-nach-code', label: 'Schlüssel nach Code' }]}
        bereich="schluessel-nach-code"
        actions={
          ohneProdukte ? (
            <ButtonLink href={CODE_ANFRAGE_PFAD} size="lg" pfeil>
              Code anfragen
            </ButtonLink>
          ) : (
            <ButtonLink href="#codelinien" size="lg" pfeil>
              Nach Code bestellen
            </ButtonLink>
          )
        }
        visual={
          /* Blickfang im Kopf (E4-L-23): die Fundstelle allein auf Papier, ohne zweite Kopfzeile;
             der Wortlaut steht im Alternativtext (E6-BEFUND2-H05, U10). */
          <div className="sm24-ausschnitt overflow-hidden" style={ausschnittStil(CODE_FUNDSTELLE_AUSSCHNITT)}>
            <CodeFundstelleGrafik
              params={{ ort: 'schluesselkopf', beschriftung: true }}
              title="Wo steht der Code? Schlüsselnummer auf dem Schlüsselkopf"
            />
          </div>
        }
      >
        {/* Hinweis als Zeile mit Glyphe, ohne Rahmen und Fettung (K-006, E6-BEFUND2-H05, U2) */}
        <div role="note" className="flex max-w-measure items-start gap-3 text-small leading-relaxed text-foreground-muted">
          <GlyphInfo size={18} className="mt-0.5 shrink-0 text-foreground-muted" />
          <div className="min-w-0">
            <p className="text-foreground">Ihr Originalschlüssel bleibt bei Ihnen</p>
            <p className="mt-2">
              Sie müssen Ihren Schlüssel nicht einschicken. Wir fertigen den neuen Schlüssel nur
              nach dem Code, den Sie uns nennen. So können Sie Ihr Schloss weiter benutzen.
            </p>
            <p className="mt-2">
              Kein Code vorhanden?{' '}
              <Link
                href="/schluessel-nach-vorlage"
                prefetch={false}
                className="font-semibold text-primary hover:underline"
              >
                Dann hilft Ihnen Schlüssel nach Vorlage.
              </Link>
            </p>
          </div>
        </div>
      </PageHeader>

      {ohneProdukte ? (
        /* Leerzustand (A-046): Die Codeprodukte werden eingepflegt; bis dahin prüfen wir den Code auf Anfrage. */
        <Section id="codelinien" tight labelledBy="trefferliste-titel">
          <SectionHeading
            id="trefferliste-titel"
            nummer="01"
            eyebrow="Anfrage"
            title="Code anfragen"
            lead={
              page?.intro
              ?? 'Viele Schlösser tragen einen aufgedruckten oder eingeprägten Code. Nach diesem Code fertigen wir den passenden Schlüssel.'
            }
          />
          <div role="note" className="mt-8 flex max-w-measure items-start gap-3 border-t border-border pt-6">
            <GlyphInfo size={18} className="mt-1 shrink-0 text-foreground-muted" />
            <div className="min-w-0">
              <p className="text-body font-semibold text-foreground">Direkt bestellen können Sie hier noch nicht.</p>
              <p className="mt-2 text-body text-foreground-muted">
                Bis dahin prüfen wir Ihren Code auf Anfrage. Nennen Sie uns den Hersteller oder das Schloss,
                den Code genau wie aufgedruckt und die Stückzahl. Ein Foto von Schlüssel oder Schloss hilft
                uns, ist aber freiwillig. Außerdem bestätigen Sie, dass Sie den Schlüssel nachmachen lassen dürfen.
                So schützen wir Ihr Schloss vor Unbefugten. Wir melden uns mit einem Angebot oder einer Rückfrage.
              </p>
              <div className="mt-6">
                <ButtonLink href={CODE_ANFRAGE_PFAD} pfeil>
                  Code anfragen
                </ButtonLink>
              </div>
            </div>
          </div>
        </Section>
      ) : (
        <>
      <Section id="codelinien" tight labelledBy="trefferliste-titel">
        <SectionHeading
          id="trefferliste-titel"
          nummer="01"
          eyebrow="Codelinien"
          title="Passende Codelinie finden"
          lead={
            page?.intro
            ?? 'Suchen Sie nach Anwendung, Schlüsseltyp, Hersteller oder Ihrem Code. Mit den Filtern grenzen Sie '
              + 'die Liste weiter ein.'
          }
        />

        <PreisHinweis alle className="mt-4" />
        <ShopListe lines={lines} hersteller={stamm} className="mt-6" />
        {/* Code passt zu keiner Linie (FA-11-17): die Anfrage steht dauerhaft neben den Produkten. */}
        <p className="mt-6 text-small text-foreground-muted">
          Ihr Code passt zu keiner Linie?{' '}
          <Link href={CODE_ANFRAGE_PFAD} prefetch={false} className="font-semibold text-primary hover:underline">
            Code anfragen
          </Link>
        </p>
      </Section>

      {/* Hersteller und Kategorien als Stückliste: Startseite › Schlüssel nach Code › Hersteller › Produkt */}
      {mitUebersicht && (
      <Section tone="muted" tight labelledBy="kategorien-titel">
        <SectionHeading
          id="kategorien-titel"
          nummer="02"
          eyebrow="Hersteller"
          title="Codelinien nach Hersteller"
          lead="Für jeden Hersteller gibt es eine eigene Seite mit seinen Systemen, Codeformaten und Preisen."
        />
        <ul className="mt-8 border-t border-border md:grid md:grid-cols-2 md:gap-x-gutter">
          {hersteller.map((eintrag) => (
            <li key={eintrag.adresse} className="border-b border-border">
              <Link
                href={herstellerPfad(eintrag.adresse)}
                prefetch={false}
                className="group flex min-h-touch-lg items-center gap-4 py-4 transition-colors duration-quick"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-body font-semibold text-foreground group-hover:text-area-strong">
                    {eintrag.name}
                  </span>
                  <span className="mt-0.5 block font-mono text-caption tabular-nums text-foreground-muted">
                    {formatNumber(eintrag.lines.length)} {eintrag.lines.length === 1 ? 'Linie' : 'Linien'}
                    {eintrag.systeme.some((sys) => sys.name) &&
                      ` · ${eintrag.systeme.filter((sys) => sys.name).length} ${eintrag.systeme.filter((sys) => sys.name).length === 1 ? 'System' : 'Systeme'}`}
                    {ab(eintrag.lines)}
                  </span>
                </span>
                {eintrag.stamm?.logo && (
                  <span aria-hidden className="shrink-0">
                    <HerstellerMarke name={eintrag.name} logo={eintrag.stamm.logo} />
                  </span>
                )}
                <GlyphPfeilRechts
                  size={16}
                  className="shrink-0 text-foreground-subtle transition-transform duration-base ease-standard group-hover:translate-x-1 group-hover:text-area-strong"
                />
              </Link>
            </li>
          ))}
        </ul>

        {kategorienMitLinien.length > 0 && (
          <>
            <p className="mt-10 font-mono text-caption uppercase tracking-label text-foreground-muted">Nach Kategorie</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 border-t border-border pt-2">
              {kategorienMitLinien.map(({ kategorie }) => (
                <li key={kategorie.id}>
                  <Link
                    href={kategoriePfad(kategorie.slug)}
                    prefetch={false}
                    className="inline-flex min-h-touch items-center text-body font-semibold text-primary hover:underline"
                  >
                    {kategorie.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>
      )}

        </>
      )}

      {/* Ablauf aus den Rubrikdaten (G-10, G-11) */}
      <RubrikAblaufAbschnitt
        rubrik={rubrik}
        nummer={ohneProdukte || !mitUebersicht ? '02' : '03'}
        titel="Vom Code zum fertigen Schlüssel"
        lead={
          ohneProdukte
            ? 'So läuft es, sobald Sie hier direkt nach Code bestellen können. Bis dahin beginnt alles mit Ihrer Anfrage.'
            : undefined
        }
        aktion={
          ohneProdukte ? (
            <ButtonLink href={CODE_ANFRAGE_PFAD} variant="outline">
              Code anfragen
            </ButtonLink>
          ) : (
            <ButtonLink href="#codelinien" variant="outline">
              Codelinie finden
            </ButtonLink>
          )
        }
      />

      {/* Ton wechselt zum Ablauf darüber (K-006); die Fundstelle steht im Kopf */}
      <Section tone="muted" tight labelledBy="weiter-titel">
        <SectionHeading
          id="weiter-titel"
          nummer={ohneProdukte || !mitUebersicht ? '03' : '04'}
          eyebrow="Weiterlesen"
          title="Passende Bereiche und Erklärungen"
          lead="Hier geht es weiter, wenn der Code fehlt oder mehrere Türen zusammengehören."
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
                <span className="shrink-0 text-area-strong">
                  <WeiterIcon href={link.href} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-title-sm font-semibold text-foreground group-hover:text-area-strong">
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
                  className="shrink-0 text-foreground-subtle transition-transform duration-base ease-standard group-hover:translate-x-1 group-hover:text-area-strong"
                />
              </Link>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
