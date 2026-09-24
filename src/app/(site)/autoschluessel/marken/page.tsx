import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getPageContent, getVehicleMakes } from '@/lib/data';
import type { KeyKind, VehicleMake } from '@/lib/types';
import { formatNumber } from '@/lib/format';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { InfoTip } from '@/components/ui/info-tip';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { KeyKindBadges, KEY_KIND_HINT } from '@/components/autoschluessel/key-kinds';

const ROUTE = 'autoschluessel/marken';

export async function generateMetadata(): Promise<Metadata> {
  const [page, makes] = await Promise.all([getPageContent(ROUTE), getVehicleMakes()]);
  const modelCount = makes.reduce((sum, make) => sum + make.models.length, 0);

  return {
    title: page?.seo.title ?? 'Autoschlüssel nach Marke und Modell',
    description:
      page?.seo.description
      ?? `Zu ${makes.length} Fahrzeugmarken und ${modelCount} Modellen finden Sie hier, welche `
        + 'Schlüsselarten vorkommen und ob das Fahrzeug zum Anlernen vor Ort sein muss.',
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
          <ButtonLink href="/autoschluessel/anfrage">
            Fahrzeug auswählen und Termin starten
            <ArrowRight size={17} aria-hidden />
          </ButtonLink>
        }
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading title="Was Sie hier finden" />
            <div className="prose-sm24 mt-5">
              <p>
                {page?.intro
                  ?? `Für ${formatNumber(makes.length)} Marken mit insgesamt ${formatNumber(modelCount)} `
                    + 'Modellen haben wir hinterlegt, welche Schlüsselarten vorkommen und ob das '
                    + 'Fahrzeug zum Anlernen vor Ort sein muss.'}
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
              <span className="text-[14px] font-semibold text-foreground">
                Erklärung der Schlüsselarten
              </span>
              <InfoTip hint={KEY_KIND_HINT} />
            </div>
          </div>

          <ImagePlaceholder
            slot={{
              motif: 'Werkstattfoto: Schlüsselrohlinge verschiedener Fahrzeugmarken sortiert im Regal',
              ratio: '4/3',
              note: 'Eigene Aufnahme. Keine Herstellerlogos im Bild.',
            }}
          />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Übersicht"
          title="Alle erfassten Hersteller"
          lead="Alphabetisch sortiert, mit der Anzahl der hinterlegten Modelle."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((make) => {
            const kinds = keyKindsOfMake(make);
            return (
              <li key={make.id}>
                <Link
                  href={`/autoschluessel/marken/${make.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-[17px] font-bold text-foreground group-hover:text-primary">
                      {make.name}
                    </span>
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="mt-1 shrink-0 text-foreground-subtle transition-transform group-hover:translate-x-0.5"
                    />
                  </span>

                  <span className="mt-1 block text-[13px] text-foreground-muted">
                    {make.models.length === 1
                      ? '1 Modell hinterlegt'
                      : `${formatNumber(make.models.length)} Modelle hinterlegt`}
                  </span>

                  <span className="mt-4 block">
                    <KeyKindBadges kinds={kinds} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <Alert tone="info" title="Marke nicht dabei?" className="mt-8">
          Die Liste wächst laufend. Wenn Ihre Marke fehlt, starten Sie bitte den geführten Ablauf —
          wir prüfen Ihren Fall dann einzeln anhand Ihrer Schlüsselfotos und der Fahrzeugdaten.
        </Alert>
      </Section>

      <Section tight>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <SectionHeading
              title="Der nächste Schritt"
              lead="Im geführten Ablauf wählen Sie Marke, Modell und Baujahr aus und laden Ihre Fotos hoch."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/autoschluessel/anfrage" size="lg">
                Fahrzeug auswählen
                <ArrowRight size={17} aria-hidden />
              </ButtonLink>
              <ButtonLink href="/autoschluessel" size="lg" variant="outline">
                Alle Leistungen ansehen
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
                { href: '/autoschluessel/smart-key', label: 'Smart Key und Keyless' },
                { href: '/ratgeber/unterschied-kopie-und-programmierung', label: 'Kopie oder Programmierung?' },
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
