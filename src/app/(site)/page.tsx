import type { Metadata } from 'next';
import Link from 'next/link';

import { getGuides, getHubRubriken, getPageContent, getSettings } from '@/lib/data';
import { NAV_AREAS } from '@/lib/navigation';
import { kontakt } from '@/lib/rechtliches/firma';
import { telefonLink } from '@/lib/telefon';
import { IntentHub } from '@/components/hub/intent-hub';
import { Eingangsinszenierung } from '@/components/visual/inszenierung/eingangsinszenierung';
import { formatCents } from '@/lib/format';
import { ButtonLink } from '@/components/ui/button';
import { SpaetVorladen } from '@/lib/spaet-vorladen';
import { ImagePlaceholder, ausschnittStil, type GrafikAusschnitt } from '@/components/ui/image-placeholder';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, localBusinessSchema } from '@/components/seo/json-ld';
import { WerkstattZeile, werkstattAngaben } from '@/components/vertrauen/werkstatt-zeile';
import { AreaScope } from '@/components/visual/area-scope';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { PROFILSCHNITT_AUSSCHNITT, PROFILSCHNITT_GROESSE } from '@/components/visual/generators/profilschnitt';
import { SchliessplanGrafik, schliessplanAusschnitt } from '@/components/visual/generators/schliessplan';
import { SchluesselGrafik } from '@/components/visual/generators/schluessel';
import { ZylinderMassGrafik } from '@/components/visual/generators/zylinder-mass';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { FraesbahnBewegung } from '@/components/visual/interaktiv/fraesbahn-bewegung';
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

/**
 * Telefon-Ausschnitt der Kopfgrafik (Profilschnitt, unter 640 px): Fenster x 62 bis 412 und y 98 bis 288
 * in der viewBox 480 × 360. Seit G-07 ist der Schlüssel kurz genug, dass das Fenster ihn ganz fasst:
 * Reide ab x 72, Spitze bei 382, gehobener Fräser bis etwa 381, Einschnitt-Nummern (y 122) und
 * Halm-Bemaßung (Text y 266, Linie 274, Hilfslinien bis 282). Breite 350 ergibt Maßstab 1 bei 390 px,
 * also 12 px Schrift (K-008). Die Bezugswerte hängen an Interna von `generators/profilschnitt.tsx`
 * (REIDE, masslinieY), die nicht exportiert sind: Ändert sich der Generator, hier nachmessen.
 */
const KOPF_AUSSCHNITT_MOBIL: GrafikAusschnitt = {
  ...PROFILSCHNITT_AUSSCHNITT,
  x: 62,
  hoehe: 190,
  vollBreite: PROFILSCHNITT_GROESSE.breite,
  vollHoehe: PROFILSCHNITT_GROESSE.hoehe,
};

/** Vertrauensbasis nach Erg. Leitfaden §1 — nur diese belegte Aussage, ohne Zahlen oder Siegel. */
const VERTRAUENSBASIS =
  'Hinter SCHLÜSSELMACHER24 steht die Schlüssel Schmiede in Wetzlar mit Werkstatt, fachlicher '
  + 'Beratung und eigener Fertigung.';

const TRUST_POINTS = [
  {
    title: 'Fachbetrieb mit eigener Werkstatt',
    body: 'Wir fertigen im eigenen Betrieb an unseren Maschinen, nicht unterwegs im Fahrzeug.',
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
    body: 'Die Anzahlung wird vollständig auf den Gesamtpreis angerechnet.',
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

/** Ziele der Knöpfe im Autoschlüssel-Abschnitt, spät vorgeladen (D-044). */
const HERO_ZIELE = ['/autoschluessel/anfrage', '/schluessel-nach-code'] as const;

export default async function HomePage() {
  const [page, settings, guides, hubRubriken] = await Promise.all([
    getPageContent(''),
    getSettings(),
    getGuides(),
    getHubRubriken(),
  ]);

  const nummer = kontakt(settings.company).telefon;
  const telefon = nummer ? { anzeige: nummer, href: telefonLink(nummer) } : null;

  const deposit = formatCents(settings.booking.depositCents);
  const leadDays = settings.booking.leadTimeDays;

  const carKeySteps = [
    { title: 'Fahrzeug wählen', body: 'Marke, Modell, Baujahr und Schlüsselart.' },
    { title: 'Fotos hochladen', body: 'Schlüssel aus drei Richtungen und den Fahrzeugschein.' },
    { title: 'Preis oder Prüfung', body: 'Fester Preis, Preisrahmen oder Hinweis auf manuelle Prüfung.' },
    { title: 'Anzahlung', body: `Standard ${deposit}, wird voll angerechnet.` },
    { title: 'Termin buchen', body: `Frühester Termin nach etwa ${leadDays}\u00a0Tagen Vorlauf. Zum Termin bringen Sie Ausweisdokument und Fahrzeugschein mit.` },
  ];

  const projekte = NAV_AREAS.filter((a) =>
    ['schliessanlagen', 'elektronische-zutrittsloesungen', 'sicherheitstechnik'].includes(a.key),
  );

  return (
    <>
      <JsonLd data={localBusinessSchema(settings)} />

      {/* Erster Bildschirm: Frage, Satz, Kacheln aus den Rubriken, Anrufen (G-01 bis G-05, K-013) */}
      <IntentHub rubriken={hubRubriken} satz={page?.subline} telefon={telefon} buehne={<Eingangsinszenierung />} />

      {/*
        Autoschlüssel direkt nach dem Hub (L-004: Schwerpunkt der Werkstatt): Kopf, Fräsbahn (B-01),
        Handlung und Eckdaten. Mobil steht der Halm unter der Überschrift, ab 1024 px die Zeichnung
        rechts über beide Zeilen.
      */}
      <section aria-labelledby="autoschluessel-titel" className="overflow-hidden border-b border-border">
        <div className="shell grid gap-8 py-section-tight lg:grid-cols-12 lg:grid-rows-kopf lg:gap-x-gutter lg:gap-y-0">
          <div className="lg:col-span-6">
            <p className="eyebrow">Autoschlüssel</p>
            <h2 id="autoschluessel-titel" className="mt-5 text-headline font-bold text-foreground">
              {page?.headline ?? 'Autoschlüssel nachmachen und programmieren'}
            </h2>
            <p className="mt-4 max-w-measure text-lead text-foreground-muted">
              Termin in der Werkstatt in Wetzlar, für Mittelhessen und alle, die anreisen.
            </p>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-xl lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:-mr-8 lg:max-w-none lg:self-end xl:-mr-12">
            <FraesbahnBewegung>
              <ImagePlaceholder
                frei
                className="sm24-ausschnitt-bemasst"
                sizes="(min-width: 1024px) 50vw, 100vw"
                ausschnitt={KOPF_AUSSCHNITT_MOBIL}
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
              {/* Ziele des ersten Bildschirms erst nach der Fräsbahn vorladen (D-044) */}
              <SpaetVorladen ziele={HERO_ZIELE} />
              <ButtonLink href="/autoschluessel/anfrage" prefetch={false} size="lg" pfeil className="w-full sm:w-auto">
                Autoschlüssel-Termin anfragen
              </ButtonLink>
              <Link
                href="/schluessel-nach-code"
                prefetch={false}
                className="group inline-flex min-h-touch items-center gap-1.5 text-body font-semibold text-primary"
              >
                Schlüssel nach Code bestellen
                <Weiter />
              </Link>
            </div>

            {/* Schriftfeld: die Eckdaten wie auf einer Zeichnung bemaßt; mobil die Anzahlung als eigene Zeile */}
            <dl className="mt-8 grid grid-cols-2 border-y border-border sm:grid-cols-3 lg:mt-10">
              {[
                { label: 'Anzahlung', wert: deposit },
                { label: 'Vorlauf', wert: `ca.\u00a0${leadDays}\u00a0Tage` },
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
            {/* Die echte Werkstatt unter den Eckdaten — entfällt, solange kein Standort gepflegt ist */}
            <WerkstattZeile {...werkstattAngaben(settings.company)} className="mt-4" />
          </div>
        </div>
      </section>

      {/* Vertrauen vor dem Ablauf (Leitfaden Kap. 03) als Prüfprotokoll: ab 1024 px die nummerierten Prüfpunkte links (7), der Kopf rechts (5); mobil Zeilen Nummer | Text */}
      <Section tone="muted" labelledBy="vertrauen-titel">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:-mt-1.5 lg:self-start">
            <SectionHeading
              id="vertrauen-titel"
              nummer="01"
              eyebrow="Warum wir"
              title="Eigene Werkstatt, Preis vor dem Termin"
              lead={VERTRAUENSBASIS}
            />
            {/* Die echte Werkstatt — entfällt, solange kein Standort gepflegt ist */}
            <WerkstattZeile {...werkstattAngaben(settings.company)} className="mt-5" />
          </div>

          {/* Prüfpunkte mit Haarlinien: mobil Zeilen Nummer | Text, ab 640 px ein 2×2 unter dem Kopf, ab 1024 px ein 2×2 in 7 Spalten links */}
          <ol className="border-y border-border sm:grid sm:grid-cols-2 lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:self-start">
            {TRUST_POINTS.map((point, index) => (
              <li
                key={point.title}
                className={cn(
                  'grid grid-cols-12 gap-x-4 py-6 sm:block sm:pr-4',
                  index > 0 && 'border-t border-border',
                  index === 1 && 'sm:border-t-0',
                  index % 2 === 1 && 'sm:border-l sm:border-border sm:pl-4',
                )}
              >
                <span className="block col-span-2 font-mono text-title font-semibold tabular-nums text-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="col-span-10 sm:mt-3">
                  <p className="text-title-sm font-semibold text-foreground">{point.title}</p>
                  <p className="mt-2 max-w-measure text-body text-foreground-muted">{point.body}</p>
                </div>
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
                  lead="Vom Fahrzeug bis zum Termin. Sie geben nur an, was für Ihr Fahrzeug zählt."
                  profillinie
                />
                {/* Telefon: Knöpfe untereinander, der sekundäre Weg als Textlink; ab 640 px nebeneinander */}
                <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
                  <ButtonLink href="/autoschluessel/anfrage" pfeil className="w-full sm:w-auto">
                    Termin anfragen
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
                  <span className="sm24-scrub-marke relative z-raised flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-area bg-surface font-mono text-small font-semibold tabular-nums text-foreground">
                    {index + 1}
                  </span>
                  <div className="pt-1.5">
                    <p className="text-title-sm font-semibold text-foreground">{step.title}</p>
                    <p className="mt-1.5 max-w-measure text-pretty text-body text-foreground-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </AreaScope>
      </Section>

      {/* Direkt kaufen: zwei Zeichnungsblätter */}
      <Section tone="muted" labelledBy="direktkauf-titel">
        <SectionHeading id="direktkauf-titel" nummer="03" eyebrow="Direkt kaufen" title="Bestellen ohne Termin" />
        {/* Mobil eine Leiste mit sichtbarem Anschnitt, ab 768 px zwei Spalten */}
        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-gutter md:overflow-visible md:px-0 md:pb-0 scroll-px-5 sm:scroll-px-6 md:scroll-px-0">
          {[
            {
              area: 'schluessel-nach-code' as const,
              href: '/schluessel-nach-code',
              titel: 'Schlüssel nach Code',
              text: 'Code eingeben, Stückzahl wählen, bestellen. Ihr Originalschlüssel bleibt bei Ihnen.',
              grafik: <SchluesselGrafik params={{ typ: 'zylinder', code: 'SM24' }} title="Schlüssel mit Profil nach Code" />,
            },
            {
              area: 'gleichschliessende-zylinder' as const,
              href: '/gleichschliessende-zylinder/konfigurator',
              titel: 'Gleichschließende Zylinder',
              text: 'Mehrere Türen mit einem Schlüssel. Bauform, Maße und Schlüsselanzahl selbst zusammenstellen.',
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
                  <p className="mt-2 flex items-start justify-between gap-3">
                    <span className="text-title font-bold text-foreground">{angebot.titel}</span>
                    <Weiter className="mt-1 text-foreground-muted group-hover:text-area-strong group-focus-visible:text-area-strong" />
                  </p>
                  <p className="mt-2 max-w-measure text-body text-foreground-muted">{angebot.text}</p>
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
              nummer="04"
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
          <SectionHeading id="ratgeber-titel" nummer="05" eyebrow="Ratgeber" title="Antworten auf die häufigsten Fragen" />
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
                  <Weiter className="mt-1 text-foreground-muted group-hover:text-primary group-focus-visible:text-primary" />
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
