import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getCities, getCollection, getSettings, getVehicleMakes, getVehicleModel } from '@/lib/data';
import type { ImageSlot, KeyKind } from '@/lib/types';
import { formatCents, formatDuration, formatWeekday } from '@/lib/format';
import { cn } from '@/lib/cn';
import {
  aufzaehlung,
  eckdaten,
  erstNachPruefung,
  leistungsPreise,
  modellIndexierbar,
  modellTexte,
  preisAngabe,
  preisAb,
} from '@/lib/fahrzeug-texte';
import { standort } from '@/lib/rechtliches/firma';
import { stadtIndexierbar } from '@/lib/rechtliches/indexierung';
import { Accordion } from '@/components/ui/accordion';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InfoTip } from '@/components/ui/info-tip';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { GlyphWarnung } from '@/components/visual/glyphen/warnung';
import { SchluesselGrafik } from '@/components/visual/generators/schluessel';
import { motionStyle } from '@/components/visual/motion/motion-style';
import { SCHLUESSELARTEN_REIHE } from '@/components/autoschluessel/schluesselarten-reihe';
import {
  KEY_KIND_HINT,
  ON_SITE_HINT,
  keyKindDescription,
  keyKindLabel,
  keyKindShortLabel,
} from '@/components/autoschluessel/key-kinds';
import { formatModelYears, hatBaujahre } from '@/components/autoschluessel/vehicle-facts';

interface PageProps {
  params: Promise<{ make: string; model: string }>;
}

type Typ = (typeof SCHLUESSELARTEN_REIHE)[number]['typ'];

/** Ein Feld der Reihe „Schlüsselarten im Detail“. Ohne `typ`: keine Zeichnung. */
interface DetailFeld {
  art: KeyKind;
  typ?: Typ;
  /** Keyless steht als eigene Zelle ohne Zeichnung in der Reihe (D-047). */
  keyless?: boolean;
}

/**
 * Spalten der Reihe „Schlüsselarten im Detail“ nach Zahl der Zellen (KERN K-006): mobil ein Stapel,
 * ab `md` die Reihe, bei vier Zellen zwei Spalten auf dem Tablet und vier ab `lg`.
 */
const SPALTEN: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
  5: 'md:grid-cols-3 lg:grid-cols-5',
};

/**
 * Mobil eine Leiste mit Anschnitt (KERN K-006), ab `md` ein Raster ohne Anschnitt.
 */
const LEISTE =
  '-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 ' +
  'sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:overflow-visible md:scroll-px-0 md:px-0 md:pb-0';

/**
 * Erfasste Schlüsselarten als Felder: zuerst die Bauformen mit Zeichnung in der
 * Reihenfolge der Reihe, danach die übrigen Arten. Keyless ohne Smart Key erhält
 * eine eigene Zelle ohne Zeichnung.
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

/** Modell samt Preisen wie im Assistenten und den Texten der Seite. */
async function laden(makeSlug: string, modelSlug: string) {
  const [found, settings, services, rules, cities] = await Promise.all([
    getVehicleModel(makeSlug, modelSlug),
    getSettings(),
    getCollection('carKeyServices'),
    getCollection('pricingRules'),
    getCities(),
  ]);
  if (!found) return null;
  const { make, model } = found;
  const preise = leistungsPreise(make, model, { services, rules, booking: settings.booking });
  const werkstatt = standort(settings.company);
  const texte = modellTexte(make, model, preise, werkstatt);
  // Eine Standortseite der Werkstattstadt, wenn sie gepflegt und indexierbar ist.
  const werkstattSeite = werkstatt
    ? cities.find((city) => city.city === werkstatt.city && stadtIndexierbar(city))
    : undefined;
  return { make, model, settings, preise, werkstatt, werkstattSeite, texte };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { make: makeSlug, model: modelSlug } = await props.params;
  const geladen = await laden(makeSlug, modelSlug);

  if (!geladen) {
    return { title: 'Modell nicht gefunden' };
  }

  const { make, model, texte } = geladen;
  return {
    title: texte.metaTitel,
    description: texte.metaBeschreibung,
    alternates: { canonical: `/autoschluessel/marken/${make.slug}/${model.slug}` },
    // `noindex` aus dem Backend gilt für Seite und Sitemap.
    ...(modellIndexierbar(model) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function ModelPage(props: PageProps) {
  const { make: makeSlug, model: modelSlug } = await props.params;
  const geladen = await laden(makeSlug, modelSlug);

  if (!geladen) notFound();

  const { make, model, settings, preise, werkstatt, werkstattSeite, texte } = geladen;
  const years = formatModelYears(model);
  const erfasst = hatBaujahre(model);
  const daten = eckdaten(preise);
  const ab = preisAb(preise);
  const felder = detailFelder(model.keyKinds);
  // Keyless steht immer als eigene Zelle hinter den Zeichnungen, auch wenn es am Smart Key hängt (D-047).
  const gezeichnet = felder.filter((feld) => feld.typ !== undefined);
  const hinweise: DetailFeld[] = [
    ...felder.filter((feld) => feld.typ === undefined),
    ...felder.filter((feld) => feld.keyless).map(() => ({ art: 'keyless' as const })),
  ];
  const zellen = [...gezeichnet, ...hinweise];
  const hatZeichnung = gezeichnet.length > 0;
  const leiste = gezeichnet.length > 3;
  const pfad = `/autoschluessel/marken/${make.slug}/${model.slug}`;
  const crumbs = [
    { href: '/autoschluessel', label: 'Autoschlüssel' },
    { href: '/autoschluessel/marken', label: 'Marken' },
    { href: `/autoschluessel/marken/${make.slug}`, label: make.name },
    { href: pfad, label: model.name },
  ];
  const geschwister = [...make.models]
    .filter((m) => m.slug !== model.slug)
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));
  const oeffnungszeiten = settings.openingHours.filter((eintrag) => eintrag.spans.length > 0);

  // Vorbelegung des Assistenten über Suchparameter.
  const assistantHref = `/autoschluessel/anfrage?marke=${make.slug}&modell=${model.slug}`;

  // Nur Angaben, die tatsächlich im Datensatz stehen. Die Wertespalte steht durchgehend in Mono;
  // `prosa`: freier Redaktionstext bleibt in Fließschrift.
  const angaben: { label: string; value: string | string[]; prosa?: boolean }[] = [
    { label: 'Marke', value: make.name },
    { label: 'Modell', value: model.name },
    { label: 'Baujahre', value: years },
    {
      label: 'Erfasste Schlüsselarten',
      value:
        model.keyKinds.length > 0
          ? model.keyKinds.map((kind) => keyKindLabel(kind))
          : 'nicht erfasst — wir klären das anhand Ihrer Schlüsselfotos',
    },
    {
      label: 'Fahrzeug zum Anlernen vor Ort',
      value: model.requiresVehicleOnSite ? 'Ja' : 'Nein',
    },
    ...(ab !== undefined ? [{ label: 'Leistungen ab', value: formatCents(ab) }] : []),
    ...(daten.vorlauf ? [{ label: 'Vorlauf bis zum Termin', value: daten.vorlauf }] : []),
    ...(model.notes ? [{ label: 'Hinweis', value: model.notes, prosa: true }] : []),
  ];

  // Bildstelle: die Bauform der ersten erfassten Art, bis zu drei Exemplare.
  const zeichenbar = model.keyKinds
    .map((art) => SCHLUESSELARTEN_REIHE.find((eintrag) => eintrag.art === art))
    .filter((eintrag): eintrag is (typeof SCHLUESSELARTEN_REIHE)[number] => eintrag !== undefined);

  const bildstelle: ImageSlot = {
    motif: `Produktfoto: typische Schlüsselbauformen für ${make.name} ${model.name} nebeneinander`,
    ratio: '16/9',
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
    ? `Für ${make.name} ${model.name} sind die Baujahre ${years} erfasst.`
    : `Für ${make.name} ${model.name} sind die Baujahre nicht erfasst.`;

  const einordnung = [
    {
      titel: daten.mitFahrzeug.length
        ? 'Ihr Fahrzeug muss zum Termin da sein'
        : 'Ohne Fahrzeug möglich',
      text: [
        daten.mitFahrzeug.length
          ? `${daten.ohneFahrzeug.length ? `Für ${aufzaehlung(daten.mitFahrzeug.map((l) => `„${l}“`))}` : 'Für alle angebotenen Leistungen'} braucht es Zugriff auf Ihren ${make.name} ${model.name}; ein Versand des Schlüssels löst die Aufgabe dann nicht.`
          : undefined,
        daten.ohneFahrzeug.length
          ? `${aufzaehlung(daten.ohneFahrzeug.map((l) => `„${l}“`))} ${daten.ohneFahrzeug.length === 1 ? 'geht' : 'gehen'} ohne Fahrzeug.`
          : undefined,
      ]
        .filter(Boolean)
        .join(' ') || 'Ob das Fahrzeug nötig ist, hängt von der Leistung ab — das zeigt der Ablauf.',
    },
    {
      titel: 'Baujahr entscheidet mit',
      text: `${baujahrSatz} Innerhalb einer Baureihe ändern sich Schlüsselsysteme im Laufe der Zeit. `
        + 'Geben Sie im Ablauf daher bitte das Baujahr Ihres Fahrzeugs an — es beeinflusst '
        + 'Beschaffung und Aufwand.',
    },
    {
      titel: 'Anzahlung und Vorlauf',
      text: [
        daten.anzahlung ? `Die Anzahlung beträgt bei ${make.name} ${model.name} ${daten.anzahlung} und wird vollständig auf den Gesamtpreis angerechnet.` : undefined,
        daten.vorlauf ? `Der früheste Termin liegt etwa ${daten.vorlauf} in der Zukunft, weil wir den passenden Schlüssel vorher beschaffen.` : undefined,
      ]
        .filter(Boolean)
        .join(' ') || 'Anzahlung und Vorlauf sehen Sie im Ablauf, sobald die Leistung gewählt ist.',
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
      <JsonLd
        data={pageGraphSchema({
          path: pfad,
          name: `Autoschlüssel für ${make.name} ${model.name}`,
          description: texte.metaBeschreibung,
          faq: texte.faq,
          crumbs,
        })}
      />
      <PageHeader
        eyebrow={`${make.name} · Modell`}
        title={`Autoschlüssel für ${make.name} ${model.name}`}
        lead={texte.einleitung}
        crumbs={crumbs}
        actions={
          <ButtonLink href={assistantHref} pfeil>
            Mit diesem Fahrzeug starten
          </ButtonLink>
        }
        visual={
          <div className="sm:mx-auto sm:max-w-xl lg:-mr-8 lg:max-w-none xl:-mr-12">
            <ImagePlaceholder slot={bildstelle} frei />
          </div>
        }
      >
        {/* Schriftfeld wie auf der Themenseite Autoschlüssel: Kennzahlen als Felder, Werte in Mono nur für Zahlen. */}
        <dl className="grid grid-cols-2 border-y border-border sm:grid-cols-4">
          <div className="col-span-2 py-4 max-sm:border-b max-sm:border-border sm:pr-4">
            <dt className="flex min-h-6 items-center gap-1.5 font-mono text-caption uppercase tracking-label text-foreground-muted max-sm:tracking-label-eng">
              Schlüsselarten
              {model.keyKinds.length > 0 && <InfoTip hint={KEY_KIND_HINT} />}
            </dt>
            <dd className="mt-1">
              {model.keyKinds.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5">
                  {model.keyKinds.map((kind) => (
                    <li key={kind}>
                      <Badge tone="outline">{keyKindShortLabel(kind)}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-small text-foreground-muted">noch nicht hinterlegt</p>
              )}
            </dd>
          </div>
          {erfasst && (
            <div className="py-4 pr-3 sm:border-l sm:border-border sm:px-4">
              <dt className="flex min-h-6 items-center gap-1.5 font-mono text-caption uppercase tracking-label text-foreground-muted max-sm:tracking-label-eng">
                Baujahre
              </dt>
              <dd className="mt-1 font-mono text-title-sm font-semibold tabular-nums text-foreground">
                {years}
              </dd>
            </div>
          )}
          <div
            className={cn(
              'py-4 sm:border-l sm:border-border sm:pl-4',
              erfasst && 'border-l border-border pl-3',
            )}
          >
            <dt className="flex min-h-6 items-center gap-1.5 font-mono text-caption uppercase tracking-label text-foreground-muted max-sm:tracking-label-eng">
              Anlernen
              {model.requiresVehicleOnSite && <InfoTip hint={ON_SITE_HINT} />}
            </dt>
            <dd className="mt-1 text-title-sm font-semibold text-foreground">
              {model.requiresVehicleOnSite ? 'vor Ort' : 'ohne Fahrzeug'}
            </dd>
          </div>
        </dl>
      </PageHeader>

      {/* Hinterlegte Angaben: 5/7 (Kopf links, Tabelle rechts). Ohne Abstand nach unten: der Abstand
          zu „02“ kommt vom Abschnittsmaß des folgenden Abschnitts (D01). */}
      <Section className="pb-0">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-gutter">
          <SectionHeading
            className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start"
            nummer="01"
            eyebrow="Datensatz"
            title="Das ist zu diesem Modell hinterlegt"
            lead="Diese Angaben stammen aus unserem Fahrzeugdatensatz. Was darin nicht steht, erfinden wir nicht — das klären wir anhand Ihrer Schlüsselfotos."
          />
          <div className="lg:col-span-7">
            <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
              Hinterlegte Fahrzeugangaben
            </p>
            <dl className="mt-2 border-t border-border">
              {angaben.map((zeile) => (
                <div
                  key={zeile.label}
                  className="grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4"
                >
                  <dt className="text-small font-semibold text-foreground-muted sm:col-span-5">
                    {zeile.label}
                  </dt>
                  <dd
                    className={cn(
                      'text-body text-foreground sm:col-span-7',
                      !zeile.prosa && 'font-mono tabular-nums sm:text-right',
                    )}
                  >
                    {Array.isArray(zeile.value) ? (
                      <ul className="leading-relaxed">
                        {zeile.value.map((art) => (
                          <li key={art}>{art}</li>
                        ))}
                      </ul>
                    ) : (
                      zeile.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      {/* Leistungen mit Preis: dieselbe Berechnung wie im Termin-Assistenten (quoteCarKeyService) */}
      <Section id="preise">
        <SectionHeading
          nummer="02"
          eyebrow="Leistungen und Preise"
          title={`Leistungen für ${make.name} ${model.name}`}
          lead="Berechnet wie im Termin-Assistenten für dieses Modell, wenn mindestens ein funktionierender Schlüssel vorhanden ist."
        />
        {preise.length > 0 ? (
          <ul className="mt-8 border-t border-border">
            {preise.map((eintrag) => (
              <li key={eintrag.service.id} className="grid gap-3 border-b border-border py-5 md:grid-cols-12 md:gap-6">
                <div className="md:col-span-5">
                  <p className="text-body font-semibold text-foreground">{eintrag.service.label}</p>
                  <p className="mt-1 max-w-measure text-small text-foreground-muted">{eintrag.service.description}</p>
                </div>
                <div className="grid gap-4 md:col-span-7">
                  {eintrag.mitSchluessel.map((zeile) => (
                    <div key={zeile.arten.join('-')}>
                      {eintrag.mitSchluessel.length > 1 && (
                        <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                          {zeile.arten.map((art) => keyKindShortLabel(art)).join(' · ')}
                        </p>
                      )}
                      <p className="font-mono text-title-sm font-semibold tabular-nums text-foreground">
                        {preisAngabe(zeile.quote)}
                      </p>
                      <p className="mt-1 text-caption text-foreground-muted">
                        Anzahlung {formatCents(zeile.quote.depositCents)} · Termin {formatDuration(zeile.quote.slotMinutes)} ·
                        Vorlauf ca. {zeile.quote.leadTimeDays} Tage ·{' '}
                        {zeile.quote.requiresVehicleOnSite ? 'Fahrzeug muss da sein' : 'ohne Fahrzeug'}
                      </p>
                      {erstNachPruefung(zeile.quote) && (
                        <p className="mt-1 text-caption font-semibold text-foreground">
                          Verbindlich nach Prüfung der Unterlagen.
                        </p>
                      )}
                      {zeile.quote.note && <p className="mt-1 text-caption text-foreground-muted">{zeile.quote.note}</p>}
                    </div>
                  ))}
                  {eintrag.ohneSchluessel.length > 0 && (
                    <p className="text-caption text-foreground-muted">
                      Ohne funktionierenden Schlüssel:{' '}
                      <span className="font-mono tabular-nums text-foreground">
                        {[...new Set(eintrag.ohneSchluessel.map((zeile) => preisAngabe(zeile.quote)))].join(' / ')}
                      </span>
                      {eintrag.ohneSchluessel.some((zeile) => erstNachPruefung(zeile.quote))
                        && ' — verbindlich nach Prüfung der Unterlagen'}
                      .
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="prose-sm24 mt-6">
            Für die erfassten Schlüsselarten ist noch keine Leistung hinterlegt. Wir prüfen Ihren Fall
            einzeln und nennen den Preis vor der Terminbestätigung.
          </p>
        )}
      </Section>

      {/* Großer Moment (B-21): je erfasster Schlüsselart eine Zeichnung */}
      {model.keyKinds.length > 0 && (
        <Section id="schluesselarten-detail">
          <SectionHeading
            nummer="03"
            eyebrow="Schlüsselarten"
            title={`Diese Bauformen kommen beim ${make.name} ${model.name} vor`}
            lead="Welche davon Ihr Fahrzeug hat, erkennen wir an Ihren Schlüsselfotos."
          />

          {zellen.length > 0 && (
            <ol
              className={cn(
                'mt-8',
                leiste
                  ? cn(LEISTE, 'md:gap-6', SPALTEN[zellen.length])
                  : cn('grid gap-6', SPALTEN[zellen.length]),
              )}
              tabIndex={leiste ? 0 : undefined}
              aria-label={leiste ? 'Schlüsselarten' : undefined}
            >
              {zellen.map((feld, index) => (
                <li
                  key={feld.art}
                  className={cn(
                    'sm24-reveal flex flex-col border-t border-border pt-4',
                    leiste && 'shrink-0 basis-3/4 snap-start md:basis-auto',
                  )}
                  style={motionStyle(index * 0.12)}
                >
                  {feld.typ ? (
                    <SchluesselGrafik
                      params={{ typ: feld.typ, code: feld.art }}
                      title={`Zeichnung: ${keyKindLabel(feld.art)}`}
                      className="w-full max-w-md"
                    />
                  ) : (
                    <GlyphInfo size={20} className="text-foreground-muted" />
                  )}
                  <h3 className="mt-3 text-title-sm font-semibold text-foreground">{keyKindLabel(feld.art)}</h3>
                  <p className="mt-1 text-small text-foreground-muted">{keyKindDescription(feld.art)}</p>
                </li>
              ))}
            </ol>
          )}
          {hatZeichnung && (
            <p className="mt-4 font-mono text-caption text-foreground-muted">
              Schematische Darstellung, nicht maßstäblich.
            </p>
          )}
        </Section>
      )}

      {/* Bedeutung für den Kunden: Stückliste mit Positionsnummern */}
      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <SectionHeading
            className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start"
            nummer="04"
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
                  <p className="text-title-sm font-semibold text-foreground">{punkt.titel}</p>
                  <p className="mt-2 max-w-measure text-small text-foreground-muted">{punkt.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Termin in der Werkstatt: Anschrift und Öffnungszeiten aus den Einstellungen, Mitbringliste */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              nummer="05"
              eyebrow="Termin"
              title={werkstatt ? `Termin in der Werkstatt in ${werkstatt.city}` : 'Den Termin vorbereiten'}
              lead="Kunden aus Mittelhessen und darüber hinaus können für ihren Termin anreisen; Einsätze vor Ort nur nach Prüfung."
            />
            {werkstatt && (
              <address className="mt-6 text-body not-italic text-foreground">
                {werkstatt.label}
                <br />
                {werkstatt.street}, {werkstatt.postalCode} {werkstatt.city}
              </address>
            )}
            {werkstatt && oeffnungszeiten.length > 0 && (
              <dl className="mt-4 grid max-w-sm grid-cols-3 gap-y-1 text-small">
                {oeffnungszeiten.map((eintrag) => (
                  <div key={eintrag.day} className="contents">
                    <dt className="text-foreground-muted">{formatWeekday(eintrag.day)}</dt>
                    <dd className="col-span-2 font-mono tabular-nums text-foreground">
                      {eintrag.spans.map((span) => `${span.from}–${span.to}`).join(' · ')}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {werkstattSeite && (
              <Link
                href={`/standorte/${werkstattSeite.slug}`}
                className="mt-4 inline-flex min-h-touch items-center gap-1.5 text-small font-semibold text-primary hover:underline"
              >
                Standort {werkstattSeite.city}
                <GlyphPfeilRechts size={16} />
              </Link>
            )}
          </div>
          <div className="lg:col-span-7">
            <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Bitte mitbringen</p>
            <ol className="mt-3 border-t border-border">
              {texte.mitbringen.map((punkt, index) => (
                <li key={punkt.titel} className="grid grid-cols-12 gap-x-4 border-b border-border py-4">
                  <span className="col-span-2 font-mono text-title-sm font-semibold tabular-nums text-primary sm:col-span-1">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="col-span-10 sm:col-span-11">
                    <p className="text-body font-semibold text-foreground">{punkt.titel}</p>
                    <p className="mt-1 max-w-measure text-small text-foreground-muted">{punkt.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* Häufige Fragen: Antworten aus Fahrzeugdaten und Preisregeln dieses Modells */}
      {texte.faq.length > 0 && (
        <Section tone="muted" tight>
          <SectionHeading nummer="06" eyebrow="Fragen" title={`Häufige Fragen zu ${make.name} ${model.name}`} />
          <Accordion items={texte.faq} className="mt-8 max-w-4xl" />
        </Section>
      )}

      {/* Was wir nicht wissen */}
      <Section tone="sunken" tight>
        <div className="lg:grid lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-8">
            <SectionHeading
              nummer="07"
              eyebrow="Vorbehalt"
              title="Was wir ohne Ihre Unterlagen nicht sagen können"
            />
            <div
              role="note"
              className="relative mt-6 flex gap-3 overflow-hidden rounded-lg border border-border bg-surface p-4 pl-5"
            >
              <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-warning" />
              <GlyphWarnung size={18} className="mt-0.5 shrink-0 text-warning" />
              <div className="min-w-0 text-small leading-relaxed">
                <p className="mb-1 font-bold">Angaben ohne Gewähr für Ihr konkretes Fahrzeug</p>
                Der Datensatz beschreibt die Baureihe, nicht Ihr einzelnes Fahrzeug. Ausstattung,
                Sonderausstattung, Umbauten und das genaue Baujahr können abweichen. Wir legen uns erst
                fest, wenn uns Ihre Schlüsselfotos und der Fahrzeugschein vorliegen. Angaben, die hier
                nicht stehen — etwa Rohlingstyp oder Elektronikvariante —, klären wir in der Prüfung und
                nennen sie Ihnen vor der Terminbestätigung.
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Nächster Schritt */}
      <Section tight>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading
              nummer="08"
              eyebrow="Anfrage"
              title="Der nächste Schritt"
              lead="Marke und Modell sind im Ablauf schon vorbelegt. Sie ergänzen Baujahr, Schlüsselart und Ihre Fotos."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={assistantHref} size="lg" pfeil>
                Mit diesem Fahrzeug starten
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
            <p className="eyebrow">
              <span className="text-foreground-muted tabular-nums">09</span>
              Weiterlesen
            </p>
            {geschwister.length > 0 && (
              <>
                <h2 className="mt-3 text-title-sm font-semibold text-foreground">Weitere {make.name}-Modelle</h2>
                <ul className="mt-4 divide-y divide-border border-y border-border">
                  {geschwister.map((anderes) => (
                    <li key={anderes.id}>
                      <Link
                        href={`/autoschluessel/marken/${make.slug}/${anderes.slug}`}
                        className="group flex min-h-touch items-center justify-between gap-4 py-3 hover:text-primary"
                      >
                        <span className="min-w-0">
                          <span className="block text-body font-semibold text-foreground group-hover:text-primary">
                            {anderes.name}
                          </span>
                          <span className="block font-mono text-caption text-foreground-muted">
                            {formatModelYears(anderes)} · {anderes.keyKinds.map((art) => keyKindShortLabel(art)).join(', ')}
                          </span>
                        </span>
                        <GlyphPfeilRechts size={16} className="shrink-0 text-foreground-muted" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <h2 className="mt-8 text-title-sm font-semibold text-foreground">Passend dazu</h2>
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
                      className="shrink-0 text-foreground-muted transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-primary group-focus-visible:text-primary"
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
