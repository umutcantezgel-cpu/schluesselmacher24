import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getSettings, getVehicleMakes, getVehicleModel } from '@/lib/data';
import type { ImageSlot, KeyKind, SummarySection } from '@/lib/types';
import { formatCents } from '@/lib/format';
import { cn } from '@/lib/cn';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { SummaryList } from '@/components/layout/summary-list';
import { ButtonLink } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { InfoTip } from '@/components/ui/info-tip';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { SchluesselGrafik } from '@/components/visual/generators/schluessel';
import { motionStyle } from '@/components/visual/motion/motion-style';
import { SCHLUESSELARTEN_REIHE } from '@/components/autoschluessel/schluesselarten-reihe';
import {
  KeyKindBadges,
  KEY_KIND_HINT,
  ON_SITE_HINT,
  keyKindDescription,
  keyKindLabel,
} from '@/components/autoschluessel/key-kinds';
import {
  OnSiteBadge,
  formatModelYears,
  hatBaujahre,
} from '@/components/autoschluessel/vehicle-facts';

interface PageProps {
  params: Promise<{ make: string; model: string }>;
}

type Typ = (typeof SCHLUESSELARTEN_REIHE)[number]['typ'];

/** Ein Feld der Reihe „Schlüsselarten im Detail“. Ohne `typ`: keine Zeichnung. */
interface DetailFeld {
  art: KeyKind;
  typ?: Typ;
  /** Keyless steht als Zusatzzeile beim Smart Key. */
  keyless?: boolean;
}

/** Rasterspalten je Anzahl der Felder; mit vier Feldern wie in der Bauformen-Reihe. */
const RASTER: Record<number, string> = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

/**
 * Erfasste Schlüsselarten als Felder: zuerst die Bauformen mit Zeichnung in der
 * Reihenfolge der Reihe, danach die übrigen Arten. Keyless ohne Smart Key erhält
 * eine eigene Zeile ohne Zeichnung.
 */
function detailFelder(kinds: KeyKind[]): DetailFeld[] {
  const felder: DetailFeld[] = SCHLUESSELARTEN_REIHE.filter(({ art }) => kinds.includes(art)).map(
    ({ art, typ }) => ({ art, typ, keyless: art === 'smart-key' && kinds.includes('keyless') }),
  );
  const hatSmartKey = felder.some((feld) => feld.art === 'smart-key');

  for (const kind of kinds) {
    if (SCHLUESSELARTEN_REIHE.some(({ art }) => art === kind)) continue;
    if (kind === 'keyless' && hatSmartKey) continue;
    felder.push({ art: kind });
  }
  return felder;
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
  const erfasst = hatBaujahre(model);
  const kinds = model.keyKinds.map((kind) => keyKindLabel(kind)).join(', ');
  const kopf = `Autoschlüssel für ${make.name} ${model.name}${erfasst ? `, Baujahre ${years}` : ''}.`;

  return {
    title: `${make.name} ${model.name} Autoschlüssel${erfasst ? ` (${years})` : ''}`,
    description:
      kinds.length > 0
        ? `${kopf} Erfasste Schlüsselarten: ${kinds}. Anfrage mit Schlüsselfotos, Preisangabe und fester Terminbuchung.`
        : `${kopf} Anfrage mit Schlüsselfotos, Preisangabe und fester Terminbuchung.`,
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
  const erfasst = hatBaujahre(model);
  const deposit = formatCents(settings.booking.depositCents);
  const leadDays = settings.booking.leadTimeDays;
  const felder = detailFelder(model.keyKinds);
  // Arten ohne eigene Bauform (etwa Keyless ohne Smart Key) stehen als Zusatz unter den Zeichnungen.
  const gezeichnet = felder.filter((feld) => feld.typ !== undefined);
  const zusaetze = felder.filter((feld) => feld.typ === undefined);
  const hatZeichnung = gezeichnet.length > 0;

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
              : 'nicht erfasst — wir klären das anhand Ihrer Schlüsselfotos',
        },
        {
          label: 'Fahrzeug zum Anlernen vor Ort',
          value: model.requiresVehicleOnSite ? 'Ja' : 'Nein',
        },
        ...(model.notes ? [{ label: 'Hinweis', value: model.notes }] : []),
      ],
    },
  ];

  // Bildstelle: die Bauform der ersten erfassten Art, bis zu drei Exemplare.
  const zeichenbar = model.keyKinds
    .map((art) => SCHLUESSELARTEN_REIHE.find((eintrag) => eintrag.art === art))
    .filter((eintrag): eintrag is (typeof SCHLUESSELARTEN_REIHE)[number] => eintrag !== undefined);

  const bildstelle: ImageSlot = {
    motif: `Produktfoto: typische Schlüsselbauformen für ${make.name} ${model.name} nebeneinander`,
    ratio: '4/3',
    note: 'Eigene Aufnahme. Kein Herstellerlogo im Bild.',
    ...(zeichenbar.length > 0
      ? {
          visual: {
            generator: 'schluessel',
            params: { typ: zeichenbar[0].typ, anzahl: Math.min(3, zeichenbar.length) },
          },
        }
      : {}),
  };

  const baujahrSatz = erfasst
    ? `Für dieses Modell sind die Baujahre ${years} erfasst.`
    : 'Für dieses Modell sind die Baujahre nicht erfasst.';

  const einordnung = [
    {
      titel: model.requiresVehicleOnSite
        ? 'Ihr Fahrzeug muss zum Termin da sein'
        : 'Ohne Fahrzeug möglich',
      text: model.requiresVehicleOnSite
        ? 'Für dieses Modell ist zum elektronischen Anlernen Zugriff auf das Fahrzeug '
          + 'hinterlegt. Ein Versand des Schlüssels löst die Aufgabe daher nicht. '
          + 'Planen Sie einen Termin ein, bei dem das Fahrzeug bei uns steht.'
        : 'Für dieses Modell ist im Datensatz kein Zugriff auf das Fahrzeug vermerkt. '
          + 'Ob das für Ihren konkreten Auftrag gilt, hängt von der Leistung ab — rein '
          + 'mechanische Arbeiten sind ohnehin ohne Fahrzeug möglich.',
      hinweis: <InfoTip hint={ON_SITE_HINT} className="shrink-0" />,
    },
    {
      titel: 'Baujahr entscheidet mit',
      text: `${baujahrSatz} Innerhalb einer Baureihe ändern sich Schlüsselsysteme im Laufe der Zeit. `
        + 'Geben Sie im Ablauf daher bitte das Baujahr Ihres Fahrzeugs an — es beeinflusst '
        + 'Beschaffung und Aufwand.',
    },
    {
      titel: 'Anzahlung und Vorlauf',
      text: `Die Anzahlung beträgt standardmäßig ${deposit} und wird vollständig auf den `
        + `Gesamtpreis angerechnet. Der früheste Termin liegt etwa ${leadDays} Tage in der `
        + 'Zukunft, weil wir den passenden Schlüssel vorher beschaffen. Für einzelne '
        + 'Leistungen können abweichende Werte gelten — diese sehen Sie im Ablauf.',
    },
    {
      titel: 'Ein vorhandener Schlüssel hilft',
      text: 'Solange mindestens ein funktionierender Schlüssel da ist, ist der Ablauf deutlich '
        + 'planbarer. Ist kein Schlüssel mehr vorhanden, prüfen wir Unterlagen und '
        + 'Machbarkeit gesondert, bevor ein Termin bestätigt wird.',
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={`${make.name} · Modell`}
        title={`Autoschlüssel für ${make.name} ${model.name}`}
        lead={`Was für dieses Modell hinterlegt ist und was das für Ihren Auftrag bedeutet.${erfasst ? ` Baujahre: ${years}.` : ''}`}
        crumbs={[
          { href: '/autoschluessel', label: 'Autoschlüssel' },
          { href: '/autoschluessel/marken', label: 'Marken' },
          { href: `/autoschluessel/marken/${make.slug}`, label: make.name },
          { href: `/autoschluessel/marken/${make.slug}/${model.slug}`, label: model.name },
        ]}
        actions={
          <ButtonLink href={assistantHref} pfeil>
            Mit diesem Fahrzeug starten
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
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading
              title="Das ist zu diesem Modell hinterlegt"
              lead="Diese Angaben stammen aus unserem Fahrzeugdatensatz. Was darin nicht steht, erfinden wir nicht — das klären wir anhand Ihrer Schlüsselfotos."
            />
            <SummaryList sections={facts} className="mt-8" />
          </div>

          <div className="lg:col-span-5">
            <ImagePlaceholder slot={bildstelle} />
          </div>
        </div>
      </Section>

      {/* Großer Moment (B-21): je erfasster Schlüsselart eine Zeichnung */}
      {model.keyKinds.length > 0 && (
        <Section id="schluesselarten-detail">
          <SectionHeading
            eyebrow="Schlüsselarten"
            title={`Diese Bauformen kommen beim ${make.name} ${model.name} vor`}
            lead="Welche davon Ihr Fahrzeug hat, erkennen wir an Ihren Schlüsselfotos."
          />

          {hatZeichnung && (
            <ol
              className={cn(
                'mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border',
                RASTER[Math.min(gezeichnet.length, 4)],
              )}
            >
              {gezeichnet.map((feld, index) => (
                <li
                  key={feld.art}
                  className="sm24-reveal flex flex-col bg-surface p-4 sm:p-5"
                  style={motionStyle(index * 0.12)}
                >
                  {feld.typ && (
                    <SchluesselGrafik
                      params={{ typ: feld.typ, code: feld.art }}
                      title={`Zeichnung: ${keyKindLabel(feld.art)}`}
                      className="w-full"
                    />
                  )}
                  <h3 className="mt-3 text-title-sm font-semibold text-foreground">{keyKindLabel(feld.art)}</h3>
                  <p className="mt-1 text-small text-foreground-muted">{keyKindDescription(feld.art)}</p>
                  {feld.keyless && (
                    <p className="mt-2 text-small text-foreground-muted">
                      <span className="font-semibold text-foreground">{keyKindLabel('keyless')}:</span>{' '}
                      {keyKindDescription('keyless')}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          )}
          {hatZeichnung && (
            <p className="mt-3 font-mono text-caption text-foreground-muted">
              Schematische Darstellung, nicht maßstäblich.
            </p>
          )}
          {zusaetze.length > 0 && (
            <dl className={cn('max-w-measure border-t border-border', hatZeichnung ? 'mt-6' : 'mt-8')}>
              {zusaetze.map((feld) => (
                <div key={feld.art} className="border-b border-border py-4">
                  <dt className="text-title-sm font-semibold text-foreground">{keyKindLabel(feld.art)}</dt>
                  <dd className="mt-1 text-small text-foreground-muted">{keyKindDescription(feld.art)}</dd>
                </div>
              ))}
            </dl>
          )}
        </Section>
      )}

      {/* Bedeutung für den Kunden: Stückliste mit Positionsnummern */}
      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <SectionHeading
            className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start"
            eyebrow="Einordnung"
            title="Was das für Ihren Auftrag bedeutet"
            lead="Die technischen Angaben allein helfen wenig. Hier steht, was daraus für Ablauf, Termin und Aufwand folgt."
          />

          <ol className="border-t border-border lg:col-span-7">
            {einordnung.map((punkt, index) => (
              <li key={punkt.titel} className="grid grid-cols-12 gap-x-4 border-b border-border py-6">
                <span className="col-span-2 font-mono text-title font-semibold tabular-nums text-primary sm:col-span-1">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="col-span-10 sm:col-span-11">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-title-sm font-semibold text-foreground">{punkt.titel}</p>
                    {punkt.hinweis}
                  </div>
                  <p className="mt-2 max-w-measure text-small text-foreground-muted">{punkt.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Was wir nicht wissen */}
      <Section tone="muted" tight>
        <SectionHeading title="Was wir ohne Ihre Unterlagen nicht sagen können" />
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
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading
              title="Der nächste Schritt"
              lead="Marke und Modell sind im Ablauf schon vorbelegt. Sie ergänzen Baujahr, Schlüsselart und Ihre Fotos."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={assistantHref} size="lg" pfeil>
                {make.name} {model.name} auswählen
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

          <nav aria-label="Weiterführende Seiten" className="lg:col-span-5">
            <h2 className="font-mono text-caption uppercase tracking-label text-foreground-muted">
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
