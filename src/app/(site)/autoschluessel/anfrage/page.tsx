import type { Metadata } from 'next';
import Link from 'next/link';
import { getCollection, getPageContent, getSettings, getVehicleMakes } from '@/lib/data';
import { paymentStatus } from '@/lib/integrations';
import { PROCESS_LABELS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { Assistent } from './assistent';

const ROUTE = 'autoschluessel/anfrage';

const FALLBACK_TITLE = 'Autoschlüssel-Anfrage mit Termin und Anzahlung';
const FALLBACK_DESCRIPTION =
  'Fahrzeug, Schlüsselart und Leistung in 13 Schritten angeben, Fotos und Fahrzeugschein '
  + 'hochladen, Preis oder Preisrahmen sehen und einen festen Termin buchen.';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? FALLBACK_TITLE,
    description: page?.seo.description ?? FALLBACK_DESCRIPTION,
    alternates: { canonical: '/autoschluessel/anfrage' },
  };
}

/** Ein Suchparameter kann mehrfach vorkommen — dann zählt der erste Wert. */
function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

/** Verwandte Seiten — ein Ablauf soll nie in einer Sackgasse enden. */
const RELATED_LINKS = [
  {
    href: '/autoschluessel',
    label: 'Bereich Autoschlüssel',
    description: 'Alle Leistungen rund um Fahrzeugschlüssel im Überblick.',
  },
  {
    href: '/autoschluessel/marken',
    label: 'Marken und Modelle',
    description: 'Was bei Ihrem Fahrzeug technisch möglich ist.',
  },
  {
    href: '/ratgeber/autoschluessel-verloren-was-tun',
    label: 'Schlüssel verloren — was tun?',
    description: 'Die sinnvolle Reihenfolge, wenn kein Schlüssel mehr da ist.',
  },
  {
    href: '/service-und-termin/terminstatus',
    label: 'Terminstatus abrufen',
    description: 'Stand eines bestehenden Vorgangs mit Nummer und E-Mail-Adresse.',
  },
  {
    href: '/rechtliches/datenschutz',
    label: 'Datenschutz',
    description: 'Was mit Ihren Fotos, Unterlagen und Kontaktdaten geschieht.',
  },
];

export default async function AutoschluesselAnfragePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [searchParams, page, makes, services, settings] = await Promise.all([
    props.searchParams,
    getPageContent(ROUTE),
    getVehicleMakes(),
    getCollection('carKeyServices'),
    getSettings(),
  ]);

  // Vorbelegung aus ?marke= und ?modell= nur übernehmen, wenn sie zu den
  // gepflegten Fahrzeugdaten passt.
  const wantedMake = first(searchParams.marke);
  const wantedModel = first(searchParams.modell);
  const make = makes.find((entry) => entry.slug === wantedMake) ?? null;
  const model = make?.models.find((entry) => entry.slug === wantedModel) ?? null;

  const payment = paymentStatus();

  return (
    <>
      <PageHeader
        eyebrow={PROCESS_LABELS['termin-mit-anzahlung'].label}
        art="arbeit"
        title={page?.headline ?? FALLBACK_TITLE}
        lead={
          page?.subline
          ?? 'Sie geben Schritt für Schritt an, welches Fahrzeug und welchen Schlüssel Sie haben. '
            + 'Am Ende sehen Sie den Preis oder den Preisrahmen, leisten eine Anzahlung und buchen '
            + 'einen festen Termin. Ihre Eingaben werden im Browser zwischengespeichert.'
        }
        crumbs={[
          { href: '/autoschluessel', label: 'Autoschlüssel' },
          { href: '/autoschluessel/anfrage', label: 'Anfrage mit Termin' },
        ]}
      />

      <div className="shell py-8 md:py-12">
        <Assistent
          makes={makes}
          services={services.filter((entry) => entry.active)}
          paymentConfigured={payment.configured}
          retentionDays={{
            vehicleRegistration: settings.retentionDays.vehicleRegistration,
            keyPhotos: settings.retentionDays.keyPhotos,
          }}
          currentYear={new Date().getFullYear()}
          preselect={{ makeSlug: make?.slug ?? '', modelSlug: model?.slug ?? '' }}
        />
      </div>

      <Section tone="muted" tight>
        <SectionHeading
          eyebrow="Weiterführend"
          title="Passende Seiten zu diesem Ablauf"
          lead="Falls Sie vor dem Absenden noch etwas nachlesen möchten."
        />
        <ul className="mt-8 border-t border-border">
          {RELATED_LINKS.map((link) => (
            <li key={link.href} className="border-b border-border">
              <Link
                href={link.href}
                className="group flex min-h-touch items-center justify-between gap-6 py-6"
              >
                <span className="min-w-0">
                  <span className="block text-title-sm font-semibold text-foreground group-hover:text-primary">
                    {link.label}
                  </span>
                  <span className="mt-1.5 block max-w-measure text-small leading-relaxed text-foreground-muted">
                    {link.description}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-small font-semibold text-primary">
                  Ansehen
                  <GlyphPfeilRechts
                    size={18}
                    className="transition-transform duration-quick ease-standard motion-reduce:transition-none zeiger:group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
