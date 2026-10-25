import type { Metadata } from 'next';
import Link from 'next/link';

import { getPageContent, getVehicleMakes } from '@/lib/data';
import type { KeyKind, VehicleMake } from '@/lib/types';
import { formatNumber } from '@/lib/format';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { InfoTip } from '@/components/ui/info-tip';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { KeyKindBadges, KEY_KIND_HINT } from '@/components/autoschluessel/key-kinds';

const ROUTE = 'autoschluessel/marken';

/** Einzahl bei 1, sonst Mehrzahl: „1 Modell“, „3 Modelle“. */
function nomen(n: number, einzahl: string, mehrzahl: string): string {
  return n === 1 ? einzahl : mehrzahl;
}

export async function generateMetadata(): Promise<Metadata> {
  const [page, makes] = await Promise.all([getPageContent(ROUTE), getVehicleMakes()]);
  const modelCount = makes.reduce((sum, make) => sum + make.models.length, 0);

  return {
    title: page?.seo.title ?? 'Autoschlüssel nach Marke und Modell',
    description:
      page?.seo.description
      ?? `Zu ${makes.length} ${nomen(makes.length, 'Fahrzeugmarke', 'Fahrzeugmarken')} und `
        + `${modelCount} ${nomen(modelCount, 'Modell', 'Modellen')} finden Sie hier, welche `
        + 'Schlüsselarten vorkommen und ob das Fahrzeug zum Anlernen in die Werkstatt mitkommen muss.',
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
  const [page, makes] = await Promise.all([getPageContent(ROUTE), getVehicleMakes()]);

  const sorted = [...makes].sort((a, b) => a.name.localeCompare(b.name, 'de'));
  const modelCount = makes.reduce((sum, make) => sum + make.models.length, 0);

  return (
    <>
      <PageHeader
        eyebrow="Fahrzeuge"
        title={page?.headline ?? 'Marken und Modelle'}
        lead={
          page?.subline
          ?? 'Schlagen Sie nach, welche Schlüsselarten bei Ihrem Fahrzeug vorkommen und ob es zum '
            + 'Anlernen bei uns stehen muss.'
        }
        crumbs={[
          { href: '/autoschluessel', label: 'Autoschlüssel' },
          { href: '/autoschluessel/marken', label: 'Marken' },
        ]}
        actions={
          <ButtonLink href="/autoschluessel/anfrage" pfeil>
            Fahrzeug auswählen und Termin starten
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
                    + `mit insgesamt ${formatNumber(modelCount)} ${nomen(modelCount, 'Modell', 'Modellen')} `
                    + 'haben wir hinterlegt, welche Schlüsselarten vorkommen und ob das '
                    + 'Fahrzeug zum Anlernen in die Werkstatt mitkommen muss.'}
              </p>
              <p>
                Diese Angaben sind eine Orientierung für die Planung. Welche Variante Ihr Fahrzeug
                tatsächlich hat, erkennen wir sicher erst an Ihren Schlüsselfotos und den
                Fahrzeugdaten — Ausstattung und Baujahr können innerhalb einer Baureihe abweichen.
              </p>
              <p>
                Ist Ihre Marke oder Ihr Modell nicht aufgeführt, heißt das nicht, dass wir nicht
                helfen können. Nutzen Sie in diesem Fall den geführten Ablauf, damit wir Ihren Fall
                einzeln prüfen.
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
          lead="Alphabetisch sortiert, mit der Anzahl der hinterlegten Modelle."
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

        <Alert tone="info" title="Marke nicht dabei?" className="mt-8">
          Die Liste wächst laufend. Fehlt Ihre Marke, schildern Sie Ihren Fall bitte über die{' '}
          <Link
            href="/service-und-termin/anfrage?thema=autoschluessel"
            className="font-semibold text-primary hover:underline"
          >
            Anfrage
          </Link>{' '}
          — wir prüfen ihn einzeln.
        </Alert>
      </Section>

      <Section tight>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading
              title="Der nächste Schritt"
              lead="Im geführten Ablauf wählen Sie Marke, Modell und Baujahr aus und laden Ihre Fotos hoch."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/autoschluessel/anfrage" size="lg" pfeil>
                Fahrzeug auswählen
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
