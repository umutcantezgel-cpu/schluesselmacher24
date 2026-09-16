import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import { getSettings, getVehicleMakes, getVehicleModel } from '@/lib/data';
import type { SummarySection } from '@/lib/types';
import { formatCents } from '@/lib/format';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { SummaryList } from '@/components/layout/summary-list';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { InfoTip } from '@/components/ui/info-tip';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import {
  KeyKindBadges,
  KEY_KIND_HINT,
  ON_SITE_HINT,
  keyKindDescription,
  keyKindLabel,
} from '@/components/autoschluessel/key-kinds';
import { OnSiteBadge, formatModelYears } from '@/components/autoschluessel/vehicle-facts';

interface PageProps {
  params: Promise<{ make: string; model: string }>;
}

export async function generateStaticParams() {
  const makes = await getVehicleMakes();
  return makes.flatMap((make) =>
    make.models.map((model) => ({ make: make.slug, model: model.slug })),
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { make: makeSlug, model: modelSlug } = await props.params;
  const found = await getVehicleModel(makeSlug, modelSlug);

  if (!found) {
    return { title: 'Modell nicht gefunden' };
  }

  const { make, model } = found;
  const years = formatModelYears(model);
  const kinds = model.keyKinds.map((kind) => keyKindLabel(kind)).join(', ');

  return {
    title: `${make.name} ${model.name} Autoschlüssel (${years})`,
    description:
      kinds.length > 0
        ? `Autoschlüssel für ${make.name} ${model.name}, Baujahre ${years}. Erfasste Schlüsselarten: `
          + `${kinds}. Anfrage mit Schlüsselfotos, Preisangabe und fester Terminbuchung.`
        : `Autoschlüssel für ${make.name} ${model.name}, Baujahre ${years}. Anfrage mit `
          + 'Schlüsselfotos, Preisangabe und fester Terminbuchung.',
    alternates: { canonical: `/autoschluessel/marken/${make.slug}/${model.slug}` },
  };
}

export default async function ModelPage(props: PageProps) {
  const { make: makeSlug, model: modelSlug } = await props.params;
  const [found, settings] = await Promise.all([
    getVehicleModel(makeSlug, modelSlug),
    getSettings(),
  ]);

  if (!found) notFound();

  const { make, model } = found;
  const years = formatModelYears(model);
  const deposit = formatCents(settings.booking.depositCents);
  const leadDays = settings.booking.leadTimeDays;

  // Vorbelegung des Assistenten über Suchparameter.
  const assistantHref = `/autoschluessel/anfrage?marke=${make.slug}&modell=${model.slug}`;

  // Nur Angaben, die tatsächlich im Datensatz stehen.
  const facts: SummarySection[] = [
    {
      title: 'Hinterlegte Fahrzeugangaben',
      rows: [
        { label: 'Marke', value: make.name },
        { label: 'Modell', value: model.name },
        { label: 'Baujahre', value: years },
        {
          label: 'Erfasste Schlüsselarten',
          value:
            model.keyKinds.length > 0
              ? model.keyKinds.map((kind) => keyKindLabel(kind)).join(', ')
              : '[Platzhalter: noch nicht erfasst — wir klären das anhand Ihrer Schlüsselfotos]',
        },
        {
          label: 'Fahrzeug zum Anlernen vor Ort',
          value: model.requiresVehicleOnSite ? 'Ja' : 'Nein',
        },
        ...(model.notes ? [{ label: 'Hinweis', value: model.notes }] : []),
      ],
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={`${make.name} · Modell`}
        title={`Autoschlüssel für ${make.name} ${model.name}`}
        lead={`Was für dieses Modell hinterlegt ist und was das für Ihren Auftrag bedeutet. Baujahre: ${years}.`}
        crumbs={[
          { href: '/autoschluessel', label: 'Autoschlüssel' },
          { href: '/autoschluessel/marken', label: 'Marken' },
          { href: `/autoschluessel/marken/${make.slug}`, label: make.name },
          { href: `/autoschluessel/marken/${make.slug}/${model.slug}`, label: model.name },
        ]}
        actions={
          <ButtonLink href={assistantHref}>
            Mit diesem Fahrzeug starten
            <ArrowRight size={17} aria-hidden />
          </ButtonLink>
        }
      >
        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <KeyKindBadges kinds={model.keyKinds} />
          <OnSiteBadge required={model.requiresVehicleOnSite} />
          <InfoTip hint={KEY_KIND_HINT} />
        </div>
      </PageHeader>

      {/* Hinterlegte Angaben */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading
              title="Das ist zu diesem Modell hinterlegt"
              lead="Diese Angaben stammen aus unserem Fahrzeugdatensatz. Was darin nicht steht, erfinden wir nicht — das klären wir anhand Ihrer Schlüsselfotos."
            />
            <SummaryList sections={facts} className="mt-8" />
          </div>

          <ImagePlaceholder
            slot={{
              motif: `Produktfoto: typische Schlüsselbauformen für ${make.name} ${model.name} nebeneinander`,
              ratio: '4/3',
              note: 'Eigene Aufnahme. Kein Herstellerlogo im Bild.',
            }}
          />
        </div>
      </Section>

      {/* Bedeutung für den Kunden */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Einordnung"
          title="Was das für Ihren Auftrag bedeutet"
          lead="Die technischen Angaben allein helfen wenig. Hier steht, was daraus für Ablauf, Termin und Aufwand folgt."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          <li>
            <Card className="h-full">
              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[15px] font-bold text-foreground">
                    {model.requiresVehicleOnSite
                      ? 'Ihr Fahrzeug muss zum Termin da sein'
                      : 'Ohne Fahrzeug möglich'}
                  </h3>
                  <InfoTip hint={ON_SITE_HINT} className="shrink-0" />
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                  {model.requiresVehicleOnSite
                    ? 'Für dieses Modell ist zum elektronischen Anlernen Zugriff auf das Fahrzeug '
                      + 'hinterlegt. Ein Versand des Schlüssels löst die Aufgabe daher nicht. '
                      + 'Planen Sie einen Termin ein, bei dem das Fahrzeug bei uns steht.'
                    : 'Für dieses Modell ist im Datensatz kein Zugriff auf das Fahrzeug vermerkt. '
                      + 'Ob das für Ihren konkreten Auftrag gilt, hängt von der Leistung ab — rein '
                      + 'mechanische Arbeiten sind ohnehin ohne Fahrzeug möglich.'}
                </p>
              </CardBody>
            </Card>
          </li>

          <li>
            <Card className="h-full">
              <CardBody>
                <h3 className="text-[15px] font-bold text-foreground">Baujahr entscheidet mit</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                  Für dieses Modell sind die Baujahre {years} erfasst. Innerhalb einer Baureihe
                  ändern sich Schlüsselsysteme im Laufe der Zeit. Geben Sie im Ablauf daher bitte
                  das Baujahr Ihres Fahrzeugs an — es beeinflusst Beschaffung und Aufwand.
                </p>
              </CardBody>
            </Card>
          </li>

          <li>
            <Card className="h-full">
              <CardBody>
                <h3 className="text-[15px] font-bold text-foreground">Anzahlung und Vorlauf</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                  Die Anzahlung beträgt standardmäßig {deposit} und wird vollständig auf den
                  Gesamtpreis angerechnet. Der früheste Termin liegt etwa {leadDays} Tage in der
                  Zukunft, weil wir den passenden Schlüssel vorher beschaffen. Für einzelne
                  Leistungen können abweichende Werte gelten — diese sehen Sie im Ablauf.
                </p>
              </CardBody>
            </Card>
          </li>

          <li>
            <Card className="h-full">
              <CardBody>
                <h3 className="text-[15px] font-bold text-foreground">
                  Ein vorhandener Schlüssel hilft
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                  Solange mindestens ein funktionierender Schlüssel da ist, ist der Ablauf deutlich
                  planbarer. Ist kein Schlüssel mehr vorhanden, prüfen wir Unterlagen und
                  Machbarkeit gesondert, bevor ein Termin bestätigt wird.
                </p>
              </CardBody>
            </Card>
          </li>
        </ul>
      </Section>

      {/* Schlüsselarten im Detail */}
      {model.keyKinds.length > 0 && (
        <Section>
          <SectionHeading
            eyebrow="Schlüsselarten"
            title={`Diese Bauformen kommen beim ${make.name} ${model.name} vor`}
            lead="Welche davon Ihr Fahrzeug hat, erkennen wir an Ihren Schlüsselfotos."
          />

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {model.keyKinds.map((kind) => {
              const description = keyKindDescription(kind);
              return (
                <li key={kind}>
                  <Card className="h-full" variant="outline">
                    <CardBody>
                      <h3 className="text-[15px] font-bold text-foreground">
                        {keyKindLabel(kind)}
                      </h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                        {description
                          ?? '[Platzhalter: Beschreibung dieser Schlüsselart ergänzen]'}
                      </p>
                    </CardBody>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {/* Was wir nicht wissen */}
      <Section tone="muted" tight>
        <SectionHeading
          title="Was wir ohne Ihre Unterlagen nicht sagen können"
          className="max-w-2xl"
        />
        <Alert tone="warning" title="Angaben ohne Gewähr für Ihr konkretes Fahrzeug" className="mt-6">
          Der Datensatz beschreibt die Baureihe, nicht Ihr einzelnes Fahrzeug. Ausstattung,
          Sonderausstattung, Umbauten und das genaue Baujahr können abweichen. Wir legen uns erst
          fest, wenn uns Ihre Schlüsselfotos und der Fahrzeugschein vorliegen. Angaben, die hier
          nicht stehen — etwa Rohlingstyp oder Elektronikvariante —, klären wir in der Prüfung und
          nennen sie Ihnen vor der Terminbestätigung.
        </Alert>
      </Section>

      {/* Nächster Schritt */}
      <Section tight>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <SectionHeading
              title="Der nächste Schritt"
              lead="Marke und Modell sind im Ablauf schon vorbelegt. Sie ergänzen Baujahr, Schlüsselart und Ihre Fotos."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={assistantHref} size="lg">
                {make.name} {model.name} auswählen
                <ArrowRight size={17} aria-hidden />
              </ButtonLink>
              <ButtonLink
                href={`/autoschluessel/marken/${make.slug}`}
                size="lg"
                variant="outline"
              >
                Andere {make.name}-Modelle
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
                ...(model.keyKinds.includes('smart-key') || model.keyKinds.includes('keyless')
                  ? [{ href: '/autoschluessel/smart-key', label: 'Smart Key und Keyless' }]
                  : []),
                ...(model.keyKinds.includes('funk') || model.keyKinds.includes('klappschluessel')
                  ? [{ href: '/autoschluessel/funkschluessel', label: 'Funkschlüssel' }]
                  : []),
                ...(model.keyKinds.includes('mechanisch')
                  ? [{ href: '/autoschluessel/schluesselbart-fraesen', label: 'Schlüsselbart fräsen' }]
                  : []),
                { href: `/autoschluessel/marken/${make.slug}`, label: `Alle ${make.name}-Modelle` },
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
