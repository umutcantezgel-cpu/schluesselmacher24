import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getSettings, getVehicleMake, getVehicleMakes } from '@/lib/data';
import type { KeyKind, VehicleMake } from '@/lib/types';
import { formatCents, formatNumber } from '@/lib/format';
import { cn } from '@/lib/cn';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { InfoTip } from '@/components/ui/info-tip';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import {
  KeyKindBadges,
  KEY_KIND_HINT,
  ON_SITE_HINT,
  keyKindLabel,
} from '@/components/autoschluessel/key-kinds';
import { formatModelYears, onSiteLabel } from '@/components/autoschluessel/vehicle-facts';

interface PageProps {
  params: Promise<{ make: string }>;
}

/** Einzahl bei 1, sonst Mehrzahl: „1 Modell“, „3 Modelle“. */
function nomen(n: number, einzahl: string, mehrzahl: string): string {
  return n === 1 ? einzahl : mehrzahl;
}

export async function generateStaticParams() {
  const makes = await getVehicleMakes();
  return makes.map((make) => ({ make: make.slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { make: makeSlug } = await props.params;
  const make = await getVehicleMake(makeSlug);

  if (!make) {
    return { title: 'Marke nicht gefunden' };
  }

  return {
    title: `${make.name} Autoschlüssel — Modelle und Schlüsselarten`,
    description:
      `Autoschlüssel für ${make.name}: ${formatNumber(make.models.length)} `
      + `${nomen(make.models.length, 'Modell mit Baujahr', 'Modelle mit Baujahren')}, `
      + 'Schlüsselarten und der Angabe, ob das Fahrzeug zum Anlernen vor Ort sein muss.',
    alternates: { canonical: `/autoschluessel/marken/${make.slug}` },
  };
}

/** Alle Schlüsselarten, die bei dieser Marke im Datensatz vorkommen. */
function keyKindsOfMake(make: VehicleMake): KeyKind[] {
  const kinds = new Set<KeyKind>();
  for (const model of make.models) {
    for (const kind of model.keyKinds) kinds.add(kind);
  }
  return [...kinds];
}

export default async function MakePage(props: PageProps) {
  const { make: makeSlug } = await props.params;
  const [make, settings] = await Promise.all([getVehicleMake(makeSlug), getSettings()]);

  if (!make) notFound();

  const models = [...make.models].sort((a, b) => a.name.localeCompare(b.name, 'de'));
  const kinds = keyKindsOfMake(make);
  const onSiteCount = models.filter((m) => m.requiresVehicleOnSite).length;
  const deposit = formatCents(settings.booking.depositCents);
  const leadDays = settings.booking.leadTimeDays;

  const modellSatz =
    `Zu ${make.name} ${models.length === 1 ? 'ist' : 'sind'} bei uns `
    + `${formatNumber(models.length)} ${nomen(models.length, 'Modell', 'Modelle')} hinterlegt.`;

  const felder = [
    { label: 'Hinterlegte Modelle', wert: formatNumber(models.length) },
    { label: 'Anzahlung', wert: deposit },
    { label: 'Vorlauf', wert: `ca. ${leadDays} Tage` },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Fahrzeugmarke"
        title={`Autoschlüssel für ${make.name}`}
        lead={`Welche Schlüsselarten bei ${make.name} vorkommen und was das für Ihren Auftrag bedeutet.`}
        crumbs={[
          { href: '/autoschluessel', label: 'Autoschlüssel' },
          { href: '/autoschluessel/marken', label: 'Marken' },
          { href: `/autoschluessel/marken/${make.slug}`, label: make.name },
        ]}
        actions={
          <ButtonLink href={`/autoschluessel/anfrage?marke=${make.slug}`} pfeil>
            {make.name} auswählen
          </ButtonLink>
        }
      >
        {/* Schriftfeld: die Eckdaten bemaßt; mobil das erste Feld als eigene Zeile */}
        <dl className="grid grid-cols-2 border-y border-border sm:grid-cols-3">
          {felder.map((feld, index) => (
            <div
              key={feld.label}
              className={cn(
                'py-4 pr-3 sm:pr-4',
                index === 0 && 'col-span-2 border-b border-border sm:col-span-1 sm:border-b-0',
                index === 1 && 'sm:border-l sm:border-border sm:pl-4',
                index === 2 && 'border-l border-border pl-3 sm:pl-4',
              )}
            >
              <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted max-sm:tracking-label-eng">
                {feld.label}
              </dt>
              <dd className="mt-1 font-mono text-title-sm font-semibold tabular-nums text-foreground">
                {feld.wert}
              </dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      {/* Einordnung der Marke */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading title={`${make.name} und die verbauten Schlüsselsysteme`} />

            <div className="prose-sm24 mt-5">
              {make.intro ? (
                <p>{make.intro}</p>
              ) : (
                <p>
                  {modellSatz} Welche Schlüsselart Ihr Fahrzeug hat, erkennen wir an Ihren
                  Schlüsselfotos und den Fahrzeugdaten.
                </p>
              )}
              {kinds.length > 0 && (
                <p>
                  Im Datensatz sind zu dieser Marke folgende Schlüsselarten erfasst:{' '}
                  {kinds.map((kind) => keyKindLabel(kind)).join(', ')}. Das heißt nicht, dass jedes
                  Modell alle diese Varianten hat — die Zuordnung je Modell steht in der Tabelle
                  darunter.
                </p>
              )}
              <p>
                {onSiteCount === models.length
                  ? 'Bei allen hier erfassten Modellen ist zum elektronischen Anlernen Zugriff auf das Fahrzeug nötig.'
                  : `Bei ${formatNumber(onSiteCount)} von ${formatNumber(models.length)} Modellen ist zum elektronischen Anlernen Zugriff auf das Fahrzeug nötig.`}{' '}
                Rein mechanische Arbeiten am Bart sind davon nicht betroffen.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <KeyKindBadges kinds={kinds} />
              <InfoTip hint={KEY_KIND_HINT} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <ImagePlaceholder
              slot={
                make.image ?? {
                  motif: `Werkstattfoto: Schlüsselbearbeitung ${make.name}`,
                  ratio: '4/3',
                  note: 'Eigene Aufnahme, kein Herstellerlogo im Bild.',
                }
              }
            />
          </div>
        </div>
      </Section>

      {/* Modelltabelle: ab md Tabelle, darunter dieselben Daten als Stückliste */}
      <Section tone="muted" id="modelle">
        <SectionHeading
          eyebrow="Modelle"
          title={`Alle erfassten ${make.name}-Modelle`}
          lead="Baujahre, mögliche Schlüsselarten und die Frage, ob das Fahrzeug zum Anlernen bei uns stehen muss."
        />

        <div className="mt-8 hidden md:block">
          <table className="w-full border-collapse overflow-hidden rounded-lg border border-border bg-surface text-left">
            <caption className="sr-only">
              Modelle der Marke {make.name} mit Baujahren, Schlüsselarten und der Angabe, ob das
              Fahrzeug vor Ort sein muss
            </caption>
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th scope="col" className="px-4 py-3 font-mono text-caption uppercase tracking-label text-foreground-muted">
                  Modell
                </th>
                <th scope="col" className="px-4 py-3 font-mono text-caption uppercase tracking-label text-foreground-muted">
                  Baujahre
                </th>
                <th scope="col" className="px-4 py-3 font-mono text-caption uppercase tracking-label text-foreground-muted">
                  <span className="inline-flex items-center gap-2">
                    Schlüsselarten
                    <InfoTip hint={KEY_KIND_HINT} />
                  </span>
                </th>
                <th scope="col" className="px-4 py-3 font-mono text-caption uppercase tracking-label text-foreground-muted">
                  <span className="inline-flex items-center gap-2">
                    Fahrzeug vor Ort
                    <InfoTip hint={ON_SITE_HINT} />
                  </span>
                </th>
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Detailseite</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {models.map((model) => (
                <tr key={model.id}>
                  <th scope="row" className="px-4 py-3 text-body font-semibold text-foreground">
                    {model.name}
                  </th>
                  <td className="px-4 py-3 font-mono text-small tabular-nums text-foreground-muted">
                    {formatModelYears(model)}
                  </td>
                  <td className="px-4 py-3">
                    <KeyKindBadges kinds={model.keyKinds} />
                  </td>
                  <td className="px-4 py-3 text-small text-foreground-muted">
                    {onSiteLabel(model.requiresVehicleOnSite)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/autoschluessel/marken/${make.slug}/${model.slug}`}
                      className="inline-flex min-h-touch items-center gap-1.5 text-small font-semibold text-primary hover:underline"
                    >
                      Details
                      <GlyphPfeilRechts size={16} />
                      <span className="sr-only">
                        zu {make.name} {model.name}
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mt-8 border-t border-border md:hidden">
          {models.map((model) => (
            <li key={model.id} className="border-b border-border py-5">
              <p className="text-title-sm font-semibold text-foreground">{model.name}</p>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4">
                <div>
                  <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                    Baujahre
                  </dt>
                  <dd className="mt-1 font-mono text-small tabular-nums text-foreground-muted">
                    {formatModelYears(model)}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                    <span className="inline-flex items-center gap-2">
                      Fahrzeug vor Ort
                      <InfoTip hint={ON_SITE_HINT} />
                    </span>
                  </dt>
                  <dd className="mt-1 text-small text-foreground-muted">
                    {onSiteLabel(model.requiresVehicleOnSite)}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                    <span className="inline-flex items-center gap-2">
                      Schlüsselarten
                      <InfoTip hint={KEY_KIND_HINT} />
                    </span>
                  </dt>
                  <dd className="mt-2">
                    <KeyKindBadges kinds={model.keyKinds} />
                  </dd>
                </div>
              </dl>
              <Link
                href={`/autoschluessel/marken/${make.slug}/${model.slug}`}
                className="mt-4 inline-flex min-h-touch items-center gap-1.5 text-small font-semibold text-primary hover:underline"
              >
                Details
                <GlyphPfeilRechts size={16} />
                <span className="sr-only">
                  zu {make.name} {model.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Alert tone="info" title="Modell nicht dabei?" className="mt-6">
          Die Liste bildet nicht jede Baureihe und jede Ausstattung ab. Ist Ihr Modell nicht
          aufgeführt, starten Sie bitte den geführten Ablauf — anhand Ihrer Schlüsselfotos und der
          Fahrzeugdaten klären wir Ihren Fall einzeln.
        </Alert>
      </Section>

      {/* Nächster Schritt */}
      <Section tight>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading
              title="Der nächste Schritt"
              lead={`Wählen Sie Ihr ${make.name}-Modell aus, laden Sie Ihre Schlüsselfotos hoch und sehen Sie Preis oder Preisrahmen — noch vor der Buchung.`}
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`/autoschluessel/anfrage?marke=${make.slug}`} size="lg" pfeil>
                Ablauf mit {make.name} starten
              </ButtonLink>
              <ButtonLink href="/autoschluessel/marken" size="lg" variant="outline">
                Andere Marke wählen
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
                { href: '/autoschluessel/funkschluessel', label: 'Funkschlüssel' },
                { href: '/autoschluessel/smart-key', label: 'Smart Key und Keyless' },
                { href: '/autoschluessel', label: 'Alle Autoschlüssel-Leistungen' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex min-h-touch items-center justify-between gap-4 py-3 text-body font-semibold text-foreground hover:text-primary"
                  >
                    {link.label}
                    <GlyphPfeilRechts
                      size={16}
                      className="shrink-0 text-foreground-subtle transition-transform group-hover:translate-x-0.5"
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
