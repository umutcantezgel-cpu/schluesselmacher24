import type { Metadata } from 'next';
import Link from 'next/link';

import { getGuides, getPageContent, getSettings } from '@/lib/data';
import { NAV_AREAS, PROCESS_LABELS, QUICK_ENTRIES } from '@/lib/navigation';
import { formatCents } from '@/lib/format';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, localBusinessSchema } from '@/components/seo/json-ld';
import { AreaScope } from '@/components/visual/area-scope';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { SchliessplanGrafik } from '@/components/visual/generators/schliessplan';
import { SchluesselGrafik } from '@/components/visual/generators/schluessel';
import { ZylinderMassGrafik } from '@/components/visual/generators/zylinder-mass';
import { GlyphHakenKreis } from '@/components/visual/glyphen/haken-kreis';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { FraesbahnBewegung } from '@/components/visual/interaktiv/fraesbahn-bewegung';
import { motionStyle } from '@/components/visual/motion/motion-style';
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

      {/* Einstieg: Text links, die Fräsbahn rechts (großer Moment B-01) */}
      <section aria-labelledby="start-titel" className="overflow-hidden border-b border-border bg-surface">
        <div className="shell grid gap-10 py-section-tight lg:grid-cols-12 lg:items-center lg:gap-gutter">
          <div className="lg:col-span-6">
            <p className="eyebrow">Fachbetrieb für Schlüssel- und Schließtechnik</p>

            <h1 id="start-titel" className="mt-5 text-display font-bold text-foreground">
              {page?.headline ?? 'Autoschlüssel nachmachen und programmieren'}
            </h1>

            {page?.subline && <p className="mt-5 max-w-measure text-lead text-foreground-muted">{page.subline}</p>}

            <div className="mt-8 flex flex-col items-start gap-x-6 gap-y-3 sm:flex-row sm:flex-wrap sm:items-center">
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

            {/* Schriftfeld: die Eckdaten wie auf einer Zeichnung bemaßt */}
            <dl className="mt-10 grid grid-cols-2 border-y border-border sm:grid-cols-3">
              {[
                { label: 'Anzahlung', wert: deposit },
                { label: 'Vorlauf', wert: `ca. ${leadDays} Tage` },
                { label: 'Versand', wert: 'deutschlandweit' },
              ].map((feld, index) => (
                <div
                  key={feld.label}
                  className={cn(
                    'py-4 pr-4',
                    index > 0 && 'border-l border-border pl-4',
                    index === 2 && 'col-span-2 border-l-0 border-t pl-0 sm:col-span-1 sm:border-l sm:border-t-0 sm:pl-4',
                  )}
                >
                  <dt className="font-mono text-caption uppercase tracking-label text-foreground-subtle">{feld.label}</dt>
                  <dd className="mt-1 font-mono text-title-sm font-semibold tabular-nums text-foreground">{feld.wert}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-6 lg:-mr-8 xl:-mr-12">
            <FraesbahnBewegung>
              <ImagePlaceholder
                frei
                sizes="(min-width: 1024px) 50vw, 100vw"
                slot={{
                  motif: 'Werkstattfoto: Schlüsselfräse mit Autoschlüssel in Bearbeitung',
                  ratio: '4/3',
                  note: 'Echtes Foto aus der eigenen Werkstatt. Kein Stockfoto.',
                  visual: { generator: 'profilschnitt', params: {} },
                }}
              />
            </FraesbahnBewegung>
          </div>
        </div>
      </section>

      {/* Schnelleinstieg als Stückliste: Position, Bereich, Ablauf */}
      <Section labelledBy="einstieg-titel">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <SectionHeading
            id="einstieg-titel"
            className="lg:col-span-4"
            nummer="01"
            eyebrow="Schnelleinstieg"
            title="Wobei können wir helfen?"
            lead="Jeder Bereich hat einen klaren Ablauf — vom direkten Kauf bis zur Projektplanung."
          />

          <ol className="grid border-t border-border sm:grid-cols-2 lg:col-span-8">
            {QUICK_ENTRIES.map((area, index) => (
              <li key={area.key} className={cn('border-b border-border', index % 2 === 0 && 'sm:border-r')}>
                <AreaScope area={area.key}>
                  <Link
                    href={area.href}
                    className="group relative flex h-full gap-4 py-5 pr-4 transition-colors duration-quick hover:bg-area-soft sm:pl-4"
                  >
                    {/* Bereichsfarbe als Kante, wächst beim Hover (nur feiner Zeiger) */}
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-area transition-transform duration-base ease-standard zeiger:group-hover:scale-y-100"
                    />
                    <span className="w-6 shrink-0 pt-1 font-mono text-caption tabular-nums text-foreground-subtle">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <BereichIcon area={area.key} size={40} className="shrink-0 text-area-strong" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-title-sm font-semibold text-foreground group-hover:text-area-strong">
                        {area.label}
                      </span>
                      <span className="mt-1 block text-small text-foreground-muted">{area.summary}</span>
                      <span className="mt-3 block font-mono text-caption uppercase tracking-label text-area-strong">
                        {PROCESS_LABELS[area.process].label}
                      </span>
                    </span>
                    <Weiter className="mt-1 text-foreground-subtle group-hover:text-area-strong" />
                  </Link>
                </AreaScope>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Autoschlüssel-Ablauf: Fortschritt läuft mit dem Scrollen (B-03) */}
      <Section tone="muted" labelledBy="ablauf-titel">
        <AreaScope area="autoschluessel">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter">
            <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
              <SectionHeading
                id="ablauf-titel"
                nummer="02"
                eyebrow="Schwerpunkt Autoschlüssel"
                title="So läuft Ihr Autoschlüssel-Auftrag ab"
                lead="Fünf Schritte, mobil bedienbar. Sie geben nur die Daten an, die für Ihr Fahrzeug gebraucht werden."
                profillinie
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/autoschluessel/anfrage" pfeil>
                  Ablauf starten
                </ButtonLink>
                <ButtonLink href="/autoschluessel" variant="outline">
                  Alle Leistungen ansehen
                </ButtonLink>
              </div>
              <div className="mt-10 hidden max-w-sm lg:block">
                <SchluesselGrafik params={{ typ: 'funk' }} title="Funkschlüssel in Seitenansicht" />
              </div>
            </div>

            <ol className="relative lg:col-span-7">
              {/* Schiene und Fortschritt: der Strich füllt sich, während die Schritte vorbeiziehen */}
              <span aria-hidden className="absolute bottom-6 left-5 top-6 w-px bg-border-strong" />
              <span aria-hidden className="sm24-scrub-y absolute bottom-6 left-5 top-6 w-px bg-area" />
              {carKeySteps.map((step, index) => (
                <li key={step.title} className="relative flex gap-6 pb-10 last:pb-0">
                  <span className="sm24-scrub-marke relative z-raised flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-area bg-surface font-mono text-small font-semibold tabular-nums text-area-strong">
                    {index + 1}
                  </span>
                  <div className="pt-1.5">
                    <p className="text-title font-semibold text-foreground">{step.title}</p>
                    <p className="mt-1.5 max-w-measure text-body text-foreground-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </AreaScope>
      </Section>

      {/* Vertrauen als Prüfprotokoll */}
      <Section labelledBy="vertrauen-titel">
        <SectionHeading
          id="vertrauen-titel"
          nummer="03"
          eyebrow="Warum wir"
          title="Sachlich, nachvollziehbar, ohne Überraschungen"
          lead="Wir arbeiten wie ein Fachbetrieb, nicht wie ein Vermittler."
        />

        <ul className="mt-10 grid border-t border-border md:grid-cols-2">
          {TRUST_POINTS.map((point, index) => (
            <li
              key={point.title}
              className={cn(
                'flex gap-4 border-b border-border py-6 md:py-8',
                index % 2 === 0 ? 'md:border-r md:pr-8' : 'md:pl-8',
              )}
            >
              <GlyphHakenKreis size={28} className="sm24-pop shrink-0 text-success" style={motionStyle(0.1 + index * 0.12)} />
              <div>
                <p className="font-mono text-caption uppercase tracking-label text-foreground-subtle">
                  Prüfpunkt {index + 1}
                </p>
                <p className="mt-1 text-title-sm font-semibold text-foreground">{point.title}</p>
                <p className="mt-2 max-w-measure text-body text-foreground-muted">{point.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Direkt kaufen: zwei Zeichnungsblätter */}
      <Section tone="muted" labelledBy="direktkauf-titel">
        <SectionHeading id="direktkauf-titel" nummer="04" eyebrow="Direkt kaufen" title="Bestellen ohne Termin" />
        <div className="mt-10 grid gap-gutter md:grid-cols-2">
          {[
            {
              area: 'schluessel-nach-code' as const,
              href: '/schluessel-nach-code',
              titel: 'Schlüssel nach Code',
              text: 'Code eingeben, Stückzahl wählen, bestellen. Ihr Originalschlüssel bleibt bei Ihnen.',
              link: 'Codelinien ansehen',
              grafik: <SchluesselGrafik params={{ typ: 'zylinder', code: 'SM24' }} title="Schlüssel mit Profil nach Code" />,
            },
            {
              area: 'gleichschliessende-zylinder' as const,
              href: '/gleichschliessende-zylinder/konfigurator',
              titel: 'Gleichschließende Zylinder',
              text: 'Mehrere Türen mit einem Schlüssel. Bauform, Maße und Schlüsselanzahl selbst zusammenstellen.',
              link: 'Zum Konfigurator',
              grafik: <ZylinderMassGrafik params={{ bauform: 'profil-doppel', aussen: 30, innen: 40 }} title="Maßzeichnung eines Profilzylinders" />,
            },
          ].map((angebot) => (
            <AreaScope key={angebot.href} area={angebot.area}>
              <Link
                href={angebot.href}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition duration-quick ease-standard focus-visible:border-primary zeiger:hover:border-border-strong zeiger:hover:shadow-raised"
              >
                <div className="border-b border-border bg-area-soft/40 px-6 pt-6">{angebot.grafik}</div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-mono text-caption uppercase tracking-label text-area-strong">Direkt kaufen</p>
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
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-gutter">
          <AreaScope area="schliessanlagen">
            <div className="order-2 rounded-lg border border-border bg-surface p-4 sm:p-6 lg:order-1 lg:col-span-7">
              <SchliessplanGrafik
                params={{ system: 'generalhaupt', gruppen: 2, tueren: 6 }}
                title="Schließplan einer Generalhauptschlüsselanlage mit zwei Gruppen und sechs Türen"
              />
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

      {/* Ratgeber als redaktionelle Liste */}
      <Section tone="muted" labelledBy="ratgeber-titel">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-4">
            <SectionHeading
              id="ratgeber-titel"
              nummer="06"
              eyebrow="Ratgeber"
              title="Antworten auf die häufigsten Fragen"
            />
            <Link
              href="/ratgeber"
              className="group mt-6 inline-flex min-h-touch items-center gap-1.5 text-body font-semibold text-primary"
            >
              Alle Ratgeber
              <Weiter />
            </Link>
          </div>

          <ol className="border-t border-border lg:col-span-8">
            {guides.slice(0, 3).map((guide, index) => (
              <li key={guide.id} className="border-b border-border">
                <Link href={`/ratgeber/${guide.slug}`} className="group grid gap-x-6 gap-y-2 py-6 sm:grid-cols-12">
                  <span className="font-mono text-caption tabular-nums text-foreground-subtle sm:col-span-1 sm:pt-1">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="sm:col-span-10">
                    <span className="block text-title font-semibold text-foreground group-hover:text-primary">
                      {guide.title}
                    </span>
                    <span className="mt-2 block max-w-measure text-body text-foreground-muted">{guide.excerpt}</span>
                  </span>
                  <Weiter className="hidden text-primary sm:col-span-1 sm:mt-1.5 sm:block sm:justify-self-end" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </>
  );
}
