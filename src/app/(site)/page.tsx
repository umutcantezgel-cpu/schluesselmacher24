import type { Metadata } from 'next';
import Link from 'next/link';

import { getGuides, getPageContent, getSettings } from '@/lib/data';
import { NAV_AREAS, PROCESS_LABELS, QUICK_ENTRIES } from '@/lib/navigation';
import { formatCents } from '@/lib/format';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder, ausschnittStil, type GrafikAusschnitt } from '@/components/ui/image-placeholder';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, localBusinessSchema } from '@/components/seo/json-ld';
import { AreaScope } from '@/components/visual/area-scope';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { PROFILSCHNITT_AUSSCHNITT, PROFILSCHNITT_GROESSE } from '@/components/visual/generators/profilschnitt';
import { SchliessplanGrafik, schliessplanAusschnitt } from '@/components/visual/generators/schliessplan';
import { SchluesselGrafik } from '@/components/visual/generators/schluessel';
import { ZylinderMassGrafik } from '@/components/visual/generators/zylinder-mass';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { FraesbahnBewegung } from '@/components/visual/interaktiv/fraesbahn-bewegung';
import { Seitenwechsel, bereichsName } from '@/components/visual/motion/seitenwechsel';
import { cn } from '@/lib/cn';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent('');
  return {
    // Der Titel der Startseite trägt den Markennamen bereits selbst,
    // deshalb greift die Vorlage aus dem Wurzel-Layout hier nicht.
    title: { absolute: page?.seo.title ?? 'SCHLÜSSELMACHER24' },
    description: page?.seo.description,
    alternates: { canonical: '/' },
  };
}

/** Telefon-Ausschnitt des Hauptschlüsselplans (vier Türen): nur Schlüssel und Türen, ohne leeren Rand. */
const PLAN_MOBIL = { system: 'haupt', tueren: 4 } as const;
const PLAN_AUSSCHNITT_MOBIL: GrafikAusschnitt = schliessplanAusschnitt(PLAN_MOBIL);

const TRUST_POINTS = [
  {
    title: 'Fachbetrieb mit eigener Werkstatt',
    body: 'Die Arbeiten erfolgen im eigenen Betrieb mit den dafür vorgesehenen Maschinen — nicht unterwegs im Fahrzeug.',
  },
  {
    title: 'Erst prüfen, dann buchen',
    body: 'Wir sagen Ihnen vor der Terminbestätigung, was machbar ist und was es kostet. Keine Überraschung vor Ort.',
  },
  {
    title: 'Nachvollziehbare Abläufe',
    body: 'Jeder Vorgang bekommt eine Nummer. Den Stand können Sie jederzeit selbst abrufen.',
  },
  {
    title: 'Sichere Zahlung',
    body: 'Die Anzahlung wird vollständig auf den Gesamtpreis angerechnet. Beleg und Vorgang gehören zusammen.',
  },
];

/** Pfeil, der bei feinem Zeiger auf Hover der Gruppe nach rechts rückt (B-06). */
function Weiter({ className }: { className?: string }) {
  return (
    <GlyphPfeilRechts
      size={18}
      className={cn('shrink-0 transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1', className)}
    />
  );
}

export default async function HomePage() {
  const [page, settings, guides] = await Promise.all([
    getPageContent(''),
    getSettings(),
    getGuides(),
  ]);

  const deposit = formatCents(settings.booking.depositCents);
  const leadDays = settings.booking.leadTimeDays;

  const carKeySteps = [
    { title: 'Fahrzeug wählen', body: 'Marke, Modell, Baujahr und Schlüsselart.' },
    { title: 'Fotos hochladen', body: 'Schlüssel aus drei Richtungen und den Fahrzeugschein.' },
    { title: 'Preis oder Prüfung', body: 'Fester Preis, Preisrahmen oder Hinweis auf manuelle Prüfung.' },
    { title: 'Anzahlung', body: `Standard ${deposit}, wird voll angerechnet.` },
    { title: 'Termin buchen', body: `Frühester Termin nach etwa ${leadDays} Tagen Vorlauf.` },
  ];

  const projekte = NAV_AREAS.filter((a) =>
    ['schliessanlagen', 'elektronische-zutrittsloesungen', 'sicherheitstechnik'].includes(a.key),
  );

  return (
    <>
      <JsonLd data={localBusinessSchema(settings)} />

      {/*
        Einstieg in drei Teilen: Kopf, Fräsbahn (großer Moment B-01), Handlung. Mobil steht
        der Halm direkt unter der Überschrift, damit der Moment im ersten Bildschirm spielt;
        ab 1024 px stehen die Textteile links, die Zeichnung rechts über beide Zeilen.
      */}
      <section aria-labelledby="start-titel" className="overflow-hidden border-b border-border bg-surface">
        <div className="shell grid gap-8 py-section-tight lg:grid-cols-12 lg:grid-rows-kopf lg:gap-x-gutter lg:gap-y-0">
          <div className="lg:col-span-6">
            <p className="eyebrow">Schlüssel- und Schließtechnik</p>
            <h1 id="start-titel" className="mt-5 text-display font-bold text-foreground">
              {page?.headline ?? 'Autoschlüssel nachmachen und programmieren'}
            </h1>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-xl lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:-mr-8 lg:max-w-none lg:self-end xl:-mr-12">
            <FraesbahnBewegung>
              <ImagePlaceholder
                frei
                sizes="(min-width: 1024px) 50vw, 100vw"
                ausschnitt={{
                  ...PROFILSCHNITT_AUSSCHNITT,
                  vollBreite: PROFILSCHNITT_GROESSE.breite,
                  vollHoehe: PROFILSCHNITT_GROESSE.hoehe,
                }}
                slot={{
                  motif: 'Werkstattfoto: Schlüsselfräse mit Autoschlüssel in Bearbeitung',
                  ratio: '4/3',
                  note: 'Echtes Foto aus der eigenen Werkstatt. Kein Stockfoto.',
                  visual: { generator: 'profilschnitt', params: {} },
                }}
              />
            </FraesbahnBewegung>
            {/* Im Telefon-Ausschnitt fehlt die Legende der Zeichnung; sie steht darunter */}
            <p aria-hidden className="mt-2 flex items-center gap-5 font-mono text-caption text-foreground-muted sm:hidden">
              <span className="inline-flex items-center gap-2">
                <span className="w-5 border-t-2 border-dashed border-foreground-muted" />
                Rohling
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-0.5 w-5 bg-area-strong" />
                gefrästes Profil
              </span>
            </p>
          </div>

          <div className="flex flex-col lg:col-span-6">
            <div className="flex flex-col items-start gap-x-6 gap-y-3 sm:flex-row sm:flex-wrap sm:items-center lg:mt-8">
              <ButtonLink href="/autoschluessel/anfrage" size="lg" pfeil className="w-full sm:w-auto">
                Autoschlüssel-Termin starten
              </ButtonLink>
              <Link
                href="/schluessel-nach-code"
                className="group inline-flex min-h-touch items-center gap-1.5 text-body font-semibold text-primary"
              >
                Schlüssel nach Code bestellen
                <Weiter />
              </Link>
            </div>

            {page?.subline && (
              <p className="mt-6 max-w-measure text-lead text-foreground-muted lg:order-first lg:mt-5">{page.subline}</p>
            )}

            {/* Schriftfeld: die Eckdaten wie auf einer Zeichnung bemaßt; mobil die Anzahlung als eigene Zeile */}
            <dl className="mt-8 grid grid-cols-2 border-y border-border sm:grid-cols-3 lg:mt-10">
              {[
                { label: 'Anzahlung', wert: deposit },
                { label: 'Vorlauf', wert: `ca. ${leadDays} Tage` },
                { label: 'Versand', wert: 'bundesweit' },
              ].map((feld, index) => (
                <div
                  key={feld.label}
                  className={cn(
                    'py-4 pr-3 sm:pr-4',
                    index === 0 && 'col-span-2 border-b border-border sm:col-span-1 sm:border-b-0',
                    index === 1 && 'sm:border-l sm:border-border sm:pl-4',
                    index === 2 && 'border-l border-border pl-3 sm:pl-4',
                  )}
                >
                  <dt className="font-mono text-caption uppercase tracking-label text-foreground-subtle max-sm:tracking-label-eng">
                    {feld.label}
                  </dt>
                  <dd className="mt-1 font-mono text-title-sm font-semibold tabular-nums text-foreground">
                    {feld.wert}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Schnelleinstieg als Stückliste: Position, Bereich, Ablauf */}
      <Section labelledBy="einstieg-titel">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <SectionHeading
            id="einstieg-titel"
            className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start"
            nummer="01"
            eyebrow="Schnelleinstieg"
            title="Wobei können wir helfen?"
            lead="Jeder Bereich hat einen klaren Ablauf — vom direkten Kauf bis zur Projektplanung."
          />

          {/* Mobil eine Leiste mit Anschnitt (Icon über dem Titel), ab 640 px die volle Stückliste */}
          <ol className="-mx-5 flex snap-x snap-mandatory overflow-x-auto scroll-px-5 border-y border-border px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:border-t sm:border-b-0 sm:px-0 sm:scroll-px-0 lg:col-span-8">
            {QUICK_ENTRIES.map((area, index) => (
              <li
                key={area.key}
                className={cn(
                  'flex shrink-0 basis-2/5 snap-start border-r border-border sm:basis-auto sm:border-b sm:border-r-0',
                  index % 2 === 0 && 'sm:border-r',
                )}
              >
                <AreaScope area={area.key}>
                  <Link
                    href={area.href}
                    className="group relative flex h-full min-h-touch flex-1 flex-col gap-2 p-3 transition-colors duration-quick hover:bg-area-soft sm:flex-row sm:gap-4 sm:py-5 sm:pl-4 sm:pr-4"
                  >
                    {/* Bereichsfarbe als Kante, wächst beim Hover (nur feiner Zeiger) */}
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-area transition-transform duration-base ease-standard zeiger:group-hover:scale-y-100"
                    />
                    <span className="hidden w-6 shrink-0 pt-1 font-mono text-caption tabular-nums text-foreground-subtle sm:block">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {/* Geht beim Seitenwechsel in das Fach-Icon des Bereichskopfs über (B-13) */}
                    <Seitenwechsel name={bereichsName(area.key)}>
                      <BereichIcon area={area.key} size={40} className="shrink-0 text-area-strong" />
                    </Seitenwechsel>
                    {/* Ab 640 px füllt die Spalte die Kachel: die Kennung sitzt an der Unterkante, alle auf einer Grundlinie */}
                    <span className="min-w-0 flex-1 sm:flex sm:flex-col">
                      <span className="block text-small font-semibold text-foreground group-hover:text-area-strong sm:text-title-sm">
                        {area.label}
                      </span>
                      <span className="mt-1 hidden text-small text-foreground-muted sm:block">{area.summary}</span>
                      <span className="mt-3 hidden font-mono text-caption uppercase tracking-label text-foreground-muted sm:mt-auto sm:block sm:pt-3">
                        {PROCESS_LABELS[area.process].label}
                      </span>
                    </span>
                    <Weiter className="mt-1 hidden text-foreground-subtle group-hover:text-area-strong sm:block" />
                  </Link>
                </AreaScope>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Autoschlüssel-Ablauf: Fortschritt läuft mit dem Scrollen (B-03) */}
      <Section tone="sunken" labelledBy="ablauf-titel">
        <AreaScope area="autoschluessel">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter">
            {/* Linke Spalte als Einheit (ohne Klebung): Kopf, Knöpfe, darunter der Funkschlüssel; die Schritte rechts teilen ihre Höhe */}
            <div className="flex flex-col lg:col-span-5">
              <div>
                <SectionHeading
                  id="ablauf-titel"
                  nummer="02"
                  eyebrow="Schwerpunkt Autoschlüssel"
                  title="So läuft Ihr Autoschlüssel-Auftrag ab"
                  lead="Fünf Schritte, mobil bedienbar. Sie geben nur die Daten an, die für Ihr Fahrzeug gebraucht werden."
                  profillinie
                />
                {/* Telefon: Knöpfe untereinander, der sekundäre Weg als Textlink; ab 640 px nebeneinander */}
                <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
                  <ButtonLink href="/autoschluessel/anfrage" pfeil className="w-full sm:w-auto">
                    Ablauf starten
                  </ButtonLink>
                  <Link
                    href="/autoschluessel"
                    className="group inline-flex min-h-touch items-center gap-1.5 text-body font-semibold text-primary sm:hidden"
                  >
                    Alle Leistungen
                    <Weiter />
                  </Link>
                  <ButtonLink href="/autoschluessel" variant="outline" className="hidden sm:inline-flex">
                    Alle Leistungen
                  </ButtonLink>
                </div>
              </div>
              {/* Funkschlüssel direkt auf der Fläche, bis an den Rand ragend; Unterkante bündig mit dem letzten Schritt */}
              <div className="-ml-8 hidden pt-10 lg:block">
                <SchluesselGrafik params={{ typ: 'funk' }} title="Funkschlüssel in Seitenansicht" />
              </div>
            </div>

            {/* Ab lg verteilen sich die Schritte über die volle Höhe der Zeile: der letzte Schritt steht mit der Unterkante der Funkschlüssel-Grafik bündig */}
            <ol className="relative lg:col-span-7 lg:flex lg:flex-col lg:justify-between">
              {/* Schiene und Fortschritt: der Strich füllt sich, während die Schritte vorbeiziehen */}
              {/* Die Schiene endet unter dem letzten Schritt im Kreis, nicht darunter */}
              <span aria-hidden className="absolute bottom-11 left-5 top-6 w-px bg-border-strong" />
              <span aria-hidden className="sm24-scrub-y absolute bottom-11 left-5 top-6 w-px bg-area" />
              {carKeySteps.map((step, index) => (
                <li key={step.title} className="relative flex gap-6 pb-10 last:pb-0">
                  <span className="sm24-scrub-marke relative z-raised flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-area bg-surface font-mono text-small font-semibold tabular-nums text-area-strong">
                    {index + 1}
                  </span>
                  <div className="pt-1.5">
                    <p className="text-title-sm font-semibold text-foreground">{step.title}</p>
                    <p className="mt-1.5 max-w-measure text-body text-foreground-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </AreaScope>
      </Section>

      {/* Vertrauen als Prüfprotokoll: Kopf links läuft mit, rechts die nummerierten Prüfpunkte */}
      <Section labelledBy="vertrauen-titel">
        <SectionHeading
          id="vertrauen-titel"
          nummer="03"
          eyebrow="Warum wir"
          title="Sachlich, nachvollziehbar, ohne Überraschungen"
          lead="Wir arbeiten wie ein Fachbetrieb, nicht wie ein Vermittler."
        />

        {/* Schriftfeld mit Haarlinien: mobil zwei Spalten, ab 1024 px vier Felder nebeneinander */}
        <ol className="mt-10 grid grid-cols-2 border-y border-border lg:grid-cols-4">
          {TRUST_POINTS.map((point, index) => (
            <li
              key={point.title}
              className={cn(
                'py-6 pr-3 sm:pr-4',
                index % 2 === 1 && 'border-l border-border pl-3 sm:pl-4',
                index === 2 && 'lg:border-l lg:border-border lg:pl-4',
                index >= 2 && 'border-t border-border lg:border-t-0',
              )}
            >
              <span className="block font-mono text-title font-semibold tabular-nums text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="mt-3 text-title-sm font-semibold text-foreground">{point.title}</p>
              <p className="mt-2 max-w-measure text-body text-foreground-muted">{point.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Direkt kaufen: zwei Zeichnungsblätter */}
      <Section tone="muted" labelledBy="direktkauf-titel">
        <SectionHeading id="direktkauf-titel" nummer="04" eyebrow="Direkt kaufen" title="Bestellen ohne Termin" />
        {/* Mobil eine Leiste mit sichtbarem Anschnitt, ab 768 px zwei Spalten */}
        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-gutter md:overflow-visible md:px-0 md:pb-0 scroll-px-5 sm:scroll-px-6 md:scroll-px-0">
          {[
            {
              area: 'schluessel-nach-code' as const,
              href: '/schluessel-nach-code',
              titel: 'Schlüssel nach Code',
              text: 'Code eingeben, Stückzahl wählen, bestellen. Ihr Originalschlüssel bleibt bei Ihnen.',
              link: 'Codelinien',
              grafik: <SchluesselGrafik params={{ typ: 'zylinder', code: 'SM24' }} title="Schlüssel mit Profil nach Code" />,
            },
            {
              area: 'gleichschliessende-zylinder' as const,
              href: '/gleichschliessende-zylinder/konfigurator',
              titel: 'Gleichschließende Zylinder',
              text: 'Mehrere Türen mit einem Schlüssel. Bauform, Maße und Schlüsselanzahl selbst zusammenstellen.',
              link: 'Zum Konfigurator',
              /* Bis lg ist die Kartenfläche schmal (230–300 px): dort das schmale Format mit größerer Schrift. */
              grafik: (
                <>
                  <ZylinderMassGrafik params={{ bauform: 'profil-doppel', aussen: 30, innen: 40, format: 'schmal' }} title="Maßzeichnung eines Profilzylinders" className="lg:hidden" />
                  <ZylinderMassGrafik params={{ bauform: 'profil-doppel', aussen: 30, innen: 40 }} title="Maßzeichnung eines Profilzylinders" className="hidden lg:block" />
                </>
              ),
            },
          ].map((angebot) => (
            <AreaScope key={angebot.href} area={angebot.area}>
              <Link
                href={angebot.href}
                className="group flex shrink-0 basis-4/5 snap-start flex-col overflow-hidden rounded-lg border border-border bg-surface transition duration-quick ease-standard focus-visible:border-primary md:basis-auto zeiger:hover:border-border-strong zeiger:hover:shadow-raised"
              >
                <div className="border-b border-border bg-area-soft/40 px-6 pt-6">{angebot.grafik}</div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Direkt kaufen</p>
                  <p className="mt-2 text-title font-bold text-foreground">{angebot.titel}</p>
                  <p className="mt-2 max-w-measure flex-1 text-body text-foreground-muted">{angebot.text}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-body font-semibold text-primary">
                    {angebot.link}
                    <Weiter />
                  </span>
                </div>
              </Link>
            </AreaScope>
          ))}
        </div>
      </Section>

      {/* Projekte: ein Plan, drei Wege */}
      <Section labelledBy="projekte-titel">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <AreaScope area="schliessanlagen">
            {/* Telefon: kleinerer Plan in voller Breite, lesbar groß; sonst die ganze Anlage */}
            <div className="order-2 rounded-lg border border-border bg-surface p-4 sm:p-6 lg:sticky lg:top-28 lg:order-1 lg:col-span-7 lg:-mt-12">
              <div className="sm24-ausschnitt overflow-hidden sm:hidden" style={ausschnittStil(PLAN_AUSSCHNITT_MOBIL)}>
                <SchliessplanGrafik
                  params={PLAN_MOBIL}
                  title="Schließplan einer Hauptschlüsselanlage mit vier Türen"
                />
              </div>
              <div className="hidden sm:block">
                <SchliessplanGrafik
                  params={{ system: 'generalhaupt', gruppen: 2, tueren: 6 }}
                  title="Schließplan einer Generalhauptschlüsselanlage mit zwei Gruppen und sechs Türen"
                />
              </div>
            </div>
          </AreaScope>

          <div className="order-1 lg:order-2 lg:col-span-5">
            <SectionHeading
              id="projekte-titel"
              nummer="05"
              eyebrow="Projekte"
              title="Größere Vorhaben planen wir strukturiert"
              lead="Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik erfassen wir über geführte Konfiguratoren. Am Ende steht eine Zusammenfassung, aus der ein belastbares Angebot wird."
            />
            <ul className="mt-8 border-t border-border">
              {projekte.map((area) => (
                <li key={area.key} className="border-b border-border">
                  <AreaScope area={area.key}>
                    <Link href={area.highlight?.href ?? area.href} className="group flex items-start gap-4 py-5">
                      <BereichIcon area={area.key} size={36} className="shrink-0 text-area-strong" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-title-sm font-semibold text-foreground">{area.label}</span>
                        <span className="mt-1 block text-small text-foreground-muted">{area.summary}</span>
                        <span className="mt-2 inline-flex items-center gap-1.5 text-small font-semibold text-primary">
                          {area.highlight?.label ?? `Zum Bereich ${area.label}`}
                          <Weiter />
                        </span>
                      </span>
                    </Link>
                  </AreaScope>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Ratgeber: Kopf oben, drei Spalten wie eine Zeitungsseite */}
      <Section tone="muted" tight labelledBy="ratgeber-titel">
        <div className="flex flex-wrap items-end justify-between gap-x-gutter gap-y-4">
          <SectionHeading id="ratgeber-titel" nummer="06" eyebrow="Ratgeber" title="Antworten auf die häufigsten Fragen" />
          <Link href="/ratgeber" className="group inline-flex min-h-touch items-center gap-1.5 text-body font-semibold text-primary">
            Alle Ratgeber
            <Weiter />
          </Link>
        </div>

        <ol className="mt-8 grid border-t border-border md:grid-cols-3">
          {guides.slice(0, 3).map((guide, index) => (
            <li
              key={guide.id}
              className={cn('border-b border-border md:border-b-0', index > 0 && 'md:border-l md:pl-6', index < 2 && 'md:pr-6')}
            >
              <Link href={`/ratgeber/${guide.slug}`} className="group flex h-full flex-col gap-3 py-6">
                <span className="flex items-baseline gap-3 font-mono text-caption uppercase tracking-label text-foreground-muted">
                  <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                  {NAV_AREAS.find((a) => a.key === guide.topic)?.label}
                </span>
                <span className="flex items-start justify-between gap-3">
                  <span className="text-title-sm font-semibold text-foreground group-hover:text-primary">{guide.title}</span>
                  <Weiter className="mt-1 text-primary" />
                </span>
                <span className="max-w-measure text-small text-foreground-muted">{guide.excerpt}</span>
              </Link>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
