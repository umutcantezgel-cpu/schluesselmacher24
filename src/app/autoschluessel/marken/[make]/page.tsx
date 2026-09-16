import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import { getSettings, getVehicleMake, getVehicleMakes } from '@/lib/data';
import type { KeyKind, VehicleMake } from '@/lib/types';
import { formatCents, formatNumber } from '@/lib/format';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { InfoTip } from '@/components/ui/info-tip';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
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
      `Autoschlüssel für ${make.name}: ${formatNumber(make.models.length)} Modelle mit Baujahren, `
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
          <ButtonLink href={`/autoschluessel/anfrage?marke=${make.slug}`}>
            {make.name} auswählen
            <ArrowRight size={17} aria-hidden />
          </ButtonLink>
        }
      >
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-3">
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Hinterlegte Modelle
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">
              {formatNumber(models.length)}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Anzahlung
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">{deposit}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Vorlauf
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">
              ca. {leadDays} Tage
            </dd>
          </div>
        </dl>
      </PageHeader>

      {/* Einordnung der Marke */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading title={`${make.name} und die verbauten Schlüsselsysteme`} />

            <div className="prose-sm24 mt-5">
              {make.intro ? (
                <p>{make.intro}</p>
              ) : (
                <p>
                  Zu {make.name} sind bei uns {formatNumber(models.length)} Modelle hinterlegt. Welche
                  Schlüsselart Ihr Fahrzeug hat, erkennen wir an Ihren Schlüsselfotos und den
                  Fahrzeugdaten.
                </p>
              )}
              <p>
                Im Datensatz sind zu dieser Marke folgende Schlüsselarten erfasst:{' '}
                {kinds.map((kind) => keyKindLabel(kind)).join(', ')}. Das heißt nicht, dass jedes
                Modell alle diese Varianten hat — die Zuordnung je Modell steht in der Tabelle
                darunter.
              </p>
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
      </Section>

      {/* Modelltabelle */}
      <Section tone="muted" id="modelle">
        <SectionHeading
          eyebrow="Modelle"
          title={`Alle erfassten ${make.name}-Modelle`}
          lead="Baujahre, mögliche Schlüsselarten und die Frage, ob das Fahrzeug zum Anlernen bei uns stehen muss."
        />

        <div className="table-scroll mt-8">
          <table className="w-full min-w-[44rem] border-collapse overflow-hidden rounded-lg border border-border bg-surface text-left">
            <caption className="sr-only">
              Modelle der Marke {make.name} mit Baujahren, Schlüsselarten und der Angabe, ob das
              Fahrzeug vor Ort sein muss
            </caption>
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th scope="col" className="px-4 py-3 text-[13px] font-bold text-foreground">
                  Modell
                </th>
                <th scope="col" className="px-4 py-3 text-[13px] font-bold text-foreground">
                  Baujahre
                </th>
                <th scope="col" className="px-4 py-3 text-[13px] font-bold text-foreground">
                  <span className="inline-flex items-center gap-2">
                    Schlüsselarten
                    <InfoTip hint={KEY_KIND_HINT} />
                  </span>
                </th>
                <th scope="col" className="px-4 py-3 text-[13px] font-bold text-foreground">
                  <span className="inline-flex items-center gap-2">
                    Fahrzeug vor Ort
                    <InfoTip hint={ON_SITE_HINT} />
                  </span>
                </th>
                <th scope="col" className="px-4 py-3 text-[13px] font-bold text-foreground">
                  <span className="sr-only">Detailseite</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {models.map((model) => (
                <tr key={model.id}>
                  <th scope="row" className="px-4 py-3 text-[15px] font-semibold text-foreground">
                    {model.name}
                  </th>
                  <td className="px-4 py-3 text-[14px] text-foreground-muted">
                    {formatModelYears(model)}
                  </td>
                  <td className="px-4 py-3">
                    <KeyKindBadges kinds={model.keyKinds} />
                  </td>
                  <td className="px-4 py-3 text-[14px] text-foreground-muted">
                    {onSiteLabel(model.requiresVehicleOnSite)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/autoschluessel/marken/${make.slug}/${model.slug}`}
                      className="inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                    >
                      Details
                      <ArrowRight size={14} aria-hidden />
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

        <Alert tone="info" title="Modell nicht dabei?" className="mt-6">
          Die Liste bildet nicht jede Baureihe und jede Ausstattung ab. Ist Ihr Modell nicht
          aufgeführt, starten Sie bitte den geführten Ablauf — anhand Ihrer Schlüsselfotos und der
          Fahrzeugdaten klären wir Ihren Fall einzeln.
        </Alert>
      </Section>

      {/* Nächster Schritt */}
      <Section tight>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <SectionHeading
              title="Der nächste Schritt"
              lead={`Wählen Sie Ihr ${make.name}-Modell aus, laden Sie Ihre Schlüsselfotos hoch und sehen Sie Preis oder Preisrahmen — noch vor der Buchung.`}
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`/autoschluessel/anfrage?marke=${make.slug}`} size="lg">
                Ablauf mit {make.name} starten
                <ArrowRight size={17} aria-hidden />
              </ButtonLink>
              <ButtonLink href="/autoschluessel/marken" size="lg" variant="outline">
                Andere Marke wählen
              </ButtonLink>
            </div>
          </div>

          <nav aria-label="Weiterführende Seiten">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
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
                    className="group flex min-h-[44px] items-center justify-between gap-4 py-3 text-[15px] font-semibold text-foreground hover:text-primary"
                  >
                    {link.label}
                    <ArrowRight
                      size={16}
                      aria-hidden
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
