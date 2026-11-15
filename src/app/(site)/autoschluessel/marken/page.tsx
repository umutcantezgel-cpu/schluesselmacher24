import type { Metadata } from 'next';
import Link from 'next/link';

import { getFahrzeugkatalog, getPageContent, getRubrik, getSettings, getVehicleMakes } from '@/lib/data';
import { erreichbarkeit } from '@/lib/erreichbarkeit';
import { kontakt } from '@/lib/rechtliches/firma';
import type { KeyKind, VehicleMake } from '@/lib/types';
import { formatNumber } from '@/lib/format';
import { PageHeader } from '@/components/layout/page-header';
import { RubrikAblauf } from '@/components/rubrik/rubrik-ablauf';
import { Section, SectionHeading } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { InfoTip } from '@/components/ui/info-tip';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { KeyKindBadges, KEY_KIND_HINT } from '@/components/autoschluessel/key-kinds';
import { anfrageHref, KATALOG_QUELLE, katalogIndex, markenAZ, markenZuordnung } from '@/components/autoschluessel/fahrzeug-ziel';
import { FahrzeugNichtGefunden } from '@/components/fahrzeug-anfrage/nicht-gefunden';

const ROUTE = 'autoschluessel/marken';

/** Einzahl bei 1, sonst Mehrzahl: „1 Modell“, „3 Modelle“. */
function nomen(n: number, einzahl: string, mehrzahl: string): string {
  return n === 1 ? einzahl : mehrzahl;
}

export async function generateMetadata(): Promise<Metadata> {
  // Rückfall ohne Zahlen: gleich content/seo.json (FA-SEO-01B).
  const page = await getPageContent(ROUTE);

  return {
    title: page?.seo.title ?? 'Autoschlüssel je Marke und Modell',
    description:
      page?.seo.description
      ?? 'Welche Schlüsselart hat Ihr Fahrzeug, und muss es zum Anlernen vor Ort sein? Das hängt '
        + 'von Marke, Modell und Baujahr ab. Hier finden Sie die gängigen Fahrzeuge.',
    alternates: { canonical: '/autoschluessel/marken' },
  };
}

/** Alle Schlüsselarten, die bei einer Marke im Datensatz vorkommen. */
function keyKindsOfMake(make: VehicleMake): KeyKind[] {
  const kinds = new Set<KeyKind>();
  for (const model of make.models) {
    for (const kind of model.keyKinds) kinds.add(kind);
  }
  return [...kinds];
}

export default async function MarkenPage() {
  const [page, makes, rubrik, katalog, settings] = await Promise.all([
    getPageContent(ROUTE),
    getVehicleMakes(),
    getRubrik('schluesselfinder'),
    getFahrzeugkatalog(),
    getSettings(),
  ]);
  // Alle Automarken des Katalogs von A bis Z (A-047): mit Markenseite dorthin, sonst in die Anfrage.
  // Es entstehen keine neuen Seiten (R2).
  const azMarken = markenAZ(katalog, 'pkw');
  const markenSeite = markenZuordnung(katalogIndex(katalog, 'pkw'), makes);

  const sorted = [...makes].sort((a, b) => a.name.localeCompare(b.name, 'de'));
  const modelCount = makes.reduce((sum, make) => sum + make.models.length, 0);

  return (
    <>
      <PageHeader
        eyebrow="Fahrzeuge"
        title={page?.headline ?? 'Marken und Modelle'}
        lead={
          page?.subline
          ?? 'Sehen Sie nach, welche Schlüsselarten es für Ihr Fahrzeug gibt und ob es zum Anlernen '
            + 'zu uns muss.'
        }
        crumbs={[
          { href: '/autoschluessel', label: 'Autoschlüssel' },
          { href: '/autoschluessel/marken', label: 'Marken' },
        ]}
        actions={
          /* Ein Knopftext je Ziel (A-031) */
          <ButtonLink href="/autoschluessel/anfrage" pfeil>
            Termin anfragen
          </ButtonLink>
        }
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading title="Was Sie hier finden" />
            <div className="prose-sm24 mt-5">
              <p>
                {page?.intro
                  ?? `Für ${formatNumber(makes.length)} ${nomen(makes.length, 'Marke', 'Marken')} `
                    + `mit ${formatNumber(modelCount)} ${nomen(modelCount, 'Modell', 'Modellen')} `
                    + 'zeigen wir, welche Schlüsselarten es gibt. Sie sehen auch, ob das '
                    + 'Fahrzeug zum Anlernen in die Werkstatt muss.'}
              </p>
              <p>
                Die Angaben helfen bei der Planung. Welche Variante Ihr Fahrzeug wirklich hat, sehen
                wir erst an Ihren Schlüsselfotos und den Fahrzeugdaten. Denn Ausstattung und Baujahr
                können innerhalb einer Baureihe abweichen.
              </p>
              <p>
                Fehlt Ihre Marke oder Ihr Modell, können wir vielleicht trotzdem helfen. Senden Sie
                uns eine Anfrage. Wir prüfen Ihr Fahrzeug einzeln.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-small font-semibold text-foreground">
                Erklärung der Schlüsselarten
              </span>
              <InfoTip hint={KEY_KIND_HINT} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <ImagePlaceholder
              slot={{
                motif: 'Werkstattfoto: Schlüsselrohlinge verschiedener Fahrzeugmarken sortiert im Regal',
                ratio: '4/3',
                note: 'Eigene Aufnahme. Keine Herstellerlogos im Bild.',
                visual: { generator: 'schluessel', params: { typ: 'transponder', anzahl: 3 } },
              }}
            />
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Übersicht"
          title="Alle erfassten Hersteller"
          lead="Nach dem Alphabet sortiert. Bei jeder Marke steht, wie viele Modelle wir hinterlegt haben."
        />

        {/* Stückliste: je Marke eine ganze Zeile als Link, ab lg zwei Spalten */}
        <ul className="mt-8 border-t border-border lg:grid lg:grid-cols-2 lg:gap-x-gutter">
          {sorted.map((make) => {
            const kinds = keyKindsOfMake(make);
            return (
              <li key={make.id} className="border-b border-border">
                <Link
                  href={`/autoschluessel/marken/${make.slug}`}
                  className="group flex items-start justify-between gap-4 py-6"
                >
                  <span className="min-w-0">
                    <span className="block text-title-sm font-semibold text-foreground group-hover:text-primary">
                      {make.name}
                    </span>
                    <span className="mt-1 block font-mono text-small tabular-nums text-foreground-muted">
                      {`${formatNumber(make.models.length)} ${nomen(make.models.length, 'Modell', 'Modelle')} hinterlegt`}
                    </span>
                    <span className="mt-3 block">
                      <KeyKindBadges kinds={kinds} />
                    </span>
                  </span>
                  <GlyphPfeilRechts
                    size={18}
                    className="mt-1 shrink-0 text-foreground-muted transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1"
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Fester Block „Fahrzeug nicht gefunden?“ mit Telefon (FA-KERN-02B) */}
        <FahrzeugNichtGefunden telefon={kontakt(settings.company).telefon} erreichbarkeit={erreichbarkeit(settings)} className="mt-8" />
      </Section>

      {azMarken.length > 0 && (
        <Section>
          <SectionHeading
            eyebrow="Von A bis Z"
            title="Alle Automarken im Fahrzeugkatalog"
            lead={`Hier stehen ${formatNumber(azMarken.length)} Automarken aus der Statistik des Kraftfahrt-Bundesamts. Hat eine Marke eine eigene Seite, kommen Sie dorthin. Sonst kommen Sie zur Anfrage, und wir prüfen Ihr Fahrzeug einzeln.`}
          />
          <ul className="mt-8 grid grid-cols-2 gap-x-gutter border-t border-border sm:grid-cols-3 lg:grid-cols-4">
            {azMarken.map(({ marke, reihen }) => {
              const slug = markenSeite.get(marke);
              return (
                <li key={marke} className="border-b border-border">
                  <Link
                    href={slug ? `/autoschluessel/marken/${slug}` : anfrageHref({ marke })}
                    className="group flex min-h-touch items-center justify-between gap-3 py-3"
                  >
                    <span className="min-w-0">
                      <span className="block text-body font-semibold text-foreground group-hover:text-primary">{marke}</span>
                      <span className="block font-mono text-caption tabular-nums text-foreground-muted">
                        {`${formatNumber(reihen)} ${nomen(reihen, 'Modellreihe', 'Modellreihen')}`}
                      </span>
                      {!slug && <span className="block text-caption text-foreground-muted">Wir prüfen Ihr Fahrzeug auf Anfrage.</span>}
                    </span>
                    <GlyphPfeilRechts size={16} className="shrink-0 text-foreground-subtle" />
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* Quellenvermerk am Ende des Abschnitts (Datenlizenz, MA-17); der Ausweg steht im Block oben. */}
          <p className="mt-6 text-caption text-foreground-muted">{KATALOG_QUELLE}</p>
        </Section>
      )}

      <Section tight>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading
              title="Der nächste Schritt"
              lead="Bei der Terminanfrage wählen Sie Marke, Modell und Baujahr. Dann laden Sie den Fahrzeugschein und drei Fotos Ihres Schlüssels hoch. Sind alle Schlüssel verloren, entfallen die Fotos."
            />
            {/* Ablauf aus den Rubrikdaten (G-10, G-11) */}
            {rubrik && (
              <>
                <p className="mt-8 font-mono text-caption uppercase tracking-label text-foreground-muted">So läuft Ihr Auftrag ab</p>
                <RubrikAblauf rubrik={rubrik} className="mt-5" />
              </>
            )}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/autoschluessel/anfrage" size="lg" pfeil>
                Termin anfragen
              </ButtonLink>
              <ButtonLink href="/autoschluessel" size="lg" variant="outline">
                Alle Leistungen ansehen
              </ButtonLink>
            </div>
          </div>

          <nav aria-label="Weiterführende Seiten" className="lg:col-span-5">
            <h2 className="font-mono text-caption uppercase tracking-label text-foreground-muted">
              Passend dazu
            </h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {[
                { href: '/autoschluessel/nachmachen', label: 'Autoschlüssel nachmachen' },
                { href: '/autoschluessel/programmieren', label: 'Programmieren und anlernen' },
                { href: '/autoschluessel/smart-key', label: 'Smart Key und Keyless' },
                { href: '/ratgeber/unterschied-kopie-und-programmierung', label: 'Kopie oder Programmierung?' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex min-h-touch items-center justify-between gap-4 py-3 text-body font-semibold text-foreground hover:text-primary"
                  >
                    {link.label}
                    <GlyphPfeilRechts
                      size={16}
                      className="shrink-0 text-foreground-subtle transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1"
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
