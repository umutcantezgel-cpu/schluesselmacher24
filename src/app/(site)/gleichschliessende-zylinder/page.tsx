import type { Metadata } from 'next';
import Link from 'next/link';

import { getCollection, getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { formatCents, formatMillimeter } from '@/lib/format';
import { cn } from '@/lib/cn';
import { Accordion } from '@/components/ui/accordion';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { InfoTip } from '@/components/ui/info-tip';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphLineal } from '@/components/visual/glyphen/lineal';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { GlyphSchluessel } from '@/components/visual/glyphen/schluessel';
import { IconHalbzylinder } from '@/components/visual/icons/halbzylinder';
import { IconKnaufzylinder } from '@/components/visual/icons/knaufzylinder';
import { IconProfilzylinder } from '@/components/visual/icons/profilzylinder';

const ROUTE = 'gleichschliessende-zylinder';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Gleichschließende Zylinder konfigurieren und bestellen',
    description:
      page?.seo.description
      ?? 'Mehrere Türen mit einem Schlüssel: Bauform, Maße, Funktion und Anzahl der gemeinsamen '
        + 'Schlüssel selbst zusammenstellen.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/** Wird nur genutzt, solange in der Datenschicht keine Fragen gepflegt sind. */
const FALLBACK_FAQ = [
  {
    question: 'Was bedeutet „gleichschließend“ genau?',
    answer:
      'Alle bestellten Zylinder bekommen dieselbe Schließung. Ein einziger Schlüssel sperrt damit '
      + 'jede dieser Türen. Die Zylinder dürfen dabei unterschiedliche Bauformen und '
      + 'unterschiedliche Maße haben.',
  },
  {
    question: 'Passen die neuen Zylinder in meine vorhandenen Türen?',
    answer:
      'Das hängt allein von den Maßen ab. Messen Sie jeden vorhandenen Zylinder einzeln aus und '
      + 'geben Sie die Maße im Konfigurator je Position an. Türen desselben Hauses haben oft '
      + 'unterschiedliche Maße.',
  },
  {
    question: 'Kann ich Doppelzylinder, Knaufzylinder und Halbzylinder mischen?',
    answer:
      'Ja. Die Bauform wählen Sie je Position getrennt. Entscheidend für die Gleichschließung ist '
      + 'nicht die Bauform, sondern dass alle Zylinder aus derselben Bestellung stammen.',
  },
  {
    question: 'Wie viele Schlüssel bekomme ich?',
    answer:
      'Sie legen die Gesamtzahl der gemeinsamen Schlüssel im zweiten Schritt des Konfigurators '
      + 'fest. Ein Teil ist im Preis enthalten, jeder weitere Schlüssel wird einzeln berechnet. '
      + 'Jeder dieser Schlüssel sperrt alle Zylinder der Bestellung.',
  },
  {
    question: 'Kann ich später weitere Zylinder mit derselben Schließung nachbestellen?',
    answer:
      'Nur, wenn Ihre Schließung bei uns hinterlegt wird. Diese Hinterlegung wählen Sie im '
      + 'Konfigurator als Option aus. Ohne sie ist eine passgenaue Erweiterung später nicht in '
      + 'jedem Fall möglich.',
  },
  {
    question: 'Wann brauche ich statt einer Gleichschließung eine Schließanlage?',
    answer:
      'Sobald nicht mehr alle Personen überall hineinkommen sollen. Eine Gleichschließung kennt '
      + 'nur einen Berechtigungsgrad. Wer Türen und Nutzer getrennt steuern möchte, plant eine '
      + 'Schließanlage.',
  },
];

/** Beispiel aus der Beratungspraxis — keine Preis- oder Produktangabe. */
const ORDER_EXAMPLE = [
  { position: 'Haustür', form: 'Doppelzylinder', measure: '30 / 35' },
  { position: 'Wohnungstür', form: 'Doppelzylinder', measure: '40 / 40' },
  { position: 'Kellertür', form: 'Doppelzylinder', measure: '55 / 30' },
];

/** Fach-Icon je Bauform (Schlüssel: `forms[].id`). Unbekannte Bauformen zeigen das Bereichs-Icon. */
const BAUFORM_ICONS: Partial<Record<string, typeof IconProfilzylinder>> = {
  doppelzylinder: IconProfilzylinder,
  knaufzylinder: IconKnaufzylinder,
  halbzylinder: IconHalbzylinder,
};

export default async function CylinderOverviewPage() {
  const [page, catalog] = await Promise.all([
    getPageContent(ROUTE),
    getCollection('cylinderCatalog'),
  ]);

  const forms = catalog.forms.filter((form) => form.active);
  const functions = catalog.functions.filter((fn) => fn.active);
  const extras = catalog.extras.filter((extra) => extra.active);
  const faq = page?.faq.length ? page.faq : FALLBACK_FAQ;

  // Gepflegte Verweise zuerst, ergänzende danach — doppelte Ziele entfallen.
  const relatedLinks = [
    ...(page?.seo.internalLinks ?? []),
    { href: '/ratgeber/zylinder-richtig-ausmessen', label: 'Zylinder richtig ausmessen' },
    { href: '/schliessanlagen', label: 'Schließanlagen planen' },
    { href: '/schluessel-nach-code', label: 'Schlüssel nach Code bestellen' },
    { href: '/tuer-und-schliesstechnik', label: 'Tür- und Schließtechnik' },
    { href: '/service-und-termin/kontakt', label: 'Frage zur Zusammenstellung stellen' },
  ].filter(
    (link, index, all) => all.findIndex((other) => other.href === link.href) === index,
  );

  const facts = [
    { label: 'Bauformen', value: `${forms.length} zur Auswahl` },
    { label: 'Zylinder je Bestellung', value: `bis ${catalog.maxCylinders}` },
    { label: 'Gemeinsame Schlüssel', value: `bis ${catalog.maxKeys}` },
    { label: 'Im Grundpreis enthalten', value: `${catalog.includedKeys} Schlüssel` },
  ];

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: page?.headline ?? 'Gleichschließende Zylinder',
          description: page?.seo.description,
          crumbs: [{ href: `/${ROUTE}`, label: 'Gleichschließende Zylinder' }],
          faq: faq,
        })}
      />

      <PageHeader
        eyebrow={PROCESS_LABELS.direktkauf.label}
        title={page?.headline ?? 'Gleichschließende Zylinder'}
        lead={page?.subline ?? 'Mehrere Türen, ein Schlüssel. Direkt konfigurierbar.'}
        crumbs={[{ href: `/${ROUTE}`, label: 'Gleichschließende Zylinder' }]}
        bereich={ROUTE}
        /* Blickfang im Kopf (E4-L-23): die bemaßte Zeichnung des Profilzylinders, auf Papier ohne Rahmen. */
        visual={
          <ImagePlaceholder
            slot={{
              motif: 'Messzeichnung Profilzylinder mit Maß A und Maß B',
              ratio: '16/9',
              visual: { generator: 'zylinder-mass', params: { bauform: 'profil-doppel', aussen: 30, innen: 40 } },
            }}
            frei
          />
        }
        actions={
          <ButtonLink href={`/${ROUTE}/konfigurator`} size="lg" pfeil>
            Zylinder zusammenstellen
          </ButtonLink>
        }
      >
        {/* Schriftfeld: die Eckdaten wie auf einer Zeichnung bemaßt; mobil zweispaltig */}
        <dl className="grid grid-cols-2 border-y border-border sm:grid-cols-4">
          {facts.map((fact, index) => (
            <div
              key={fact.label}
              className={cn(
                'py-4 pr-3 sm:pr-4',
                index % 2 === 1 && 'border-l border-border pl-3 sm:pl-4',
                index >= 2 && 'border-t border-border sm:border-t-0',
                index === 2 && 'sm:border-l sm:border-border sm:pl-4',
              )}
            >
              <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                {fact.label}
              </dt>
              <dd className="mt-1 font-mono text-title-sm font-semibold tabular-nums text-foreground">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      {/* 01 Grundprinzip: Text links, Schließplan rechts */}
      <Section tight>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              nummer="01"
              eyebrow="Einfach erklärt"
              title="Mehrere Zylinder, ein Schlüssel"
              lead={page?.intro}
            />

            <div className="prose-sm24 mt-6">
              <p>
                Bei einer Gleichschließung erhalten alle Zylinder einer Bestellung dieselbe
                Schließung. Jeder mitgelieferte Schlüssel sperrt damit jede dieser Türen. Sie
                tragen nur noch einen Schlüssel statt eines Bundes.
              </p>
              <p>
                Die Zylinder dürfen dabei völlig unterschiedlich sein: eine Haustür braucht andere
                Maße als eine Kellertür, ein Garagentor eine andere Bauform als eine Wohnungstür.
                Entscheidend ist allein, dass alle Zylinder gemeinsam gefertigt werden.
              </p>
              <p>
                Was eine Gleichschließung nicht leistet: Sie unterscheidet nicht zwischen Personen.
                Alle Schlüssel können alles. Sobald einzelne Personen nur bestimmte Türen öffnen
                sollen, ist eine Schließanlage der richtige Weg.
              </p>
            </div>

            <ul className="mt-6 border-t border-border">
              {[
                'Haus- und Wohnungstür mit demselben Schlüssel',
                'Keller, Dachboden und Nebeneingang einbinden',
                'Garage, Technikraum oder Gartenhaus ergänzen',
                'Mehrere Zylinder in einem Vorgang austauschen',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-border py-4 text-small text-foreground-muted"
                >
                  <GlyphSchluessel size={18} className="mt-0.5 shrink-0 text-area-strong" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <ImagePlaceholder
              slot={{
                motif: 'Schemazeichnung: drei Türen mit Zylindern, ein gemeinsamer Schlüssel',
                ratio: '3/2',
                note: 'Einfache technische Zeichnung, beschriftet. Kein Stockfoto.',
                visual: { generator: 'schliessplan', params: { system: 'gleichschliessung', tueren: 3 } },
              }}
            />
          </div>
        </div>
      </Section>

      {/* 02 Bauformen: Stückliste mit Fach-Icons */}
      <Section id="bauformen" tone="muted">
        <SectionHeading
          nummer="02"
          eyebrow="Bauformen"
          title="Welche Bauform passt an welche Tür?"
          lead="Die Bauform bestimmt, wie der Zylinder bedient wird. Sie wählen sie im Konfigurator für jede Tür einzeln."
        />

        <ul className="mt-10 border-t border-border">
          {forms.map((form) => {
            const Icon = BAUFORM_ICONS[form.id];
            return (
              <li
                key={form.id}
                className="grid gap-5 border-b border-border py-6 md:grid-cols-12 md:gap-gutter"
              >
                <div className="flex items-start gap-4 md:col-span-5">
                  {Icon ? (
                    <Icon size={40} className="mt-0.5 shrink-0 text-area-strong" />
                  ) : (
                    <BereichIcon area={ROUTE} size={40} className="mt-0.5 shrink-0 text-area-strong" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-title-sm font-semibold text-foreground">{form.label}</h3>
                      <InfoTip hint={form.info} />
                    </div>
                    <p className="mt-2 max-w-measure text-small text-foreground-muted">
                      {form.description}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-7">
                  <dl className="space-y-2 text-small">
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                      <dt className="font-semibold text-foreground-muted">Abgefragte Maße</dt>
                      <dd className="text-right text-foreground">
                        {form.measures === 'beide'
                          ? `${form.measureLabels.a} und ${form.measureLabels.b ?? ''}`
                          : form.measureLabels.a}
                      </dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                      <dt className="font-semibold text-foreground-muted">Möglicher Bereich</dt>
                      <dd className="text-right font-mono tabular-nums text-foreground">
                        {formatMillimeter(form.minMm)} bis {formatMillimeter(form.maxMm)}
                      </dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                      <dt className="font-semibold text-foreground-muted">Grundpreis</dt>
                      <dd className="text-right font-mono tabular-nums text-foreground">
                        {formatCents(form.basePriceCents)}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-4 max-w-measure text-caption text-foreground-muted">
                    Der Grundpreis gilt bis {formatMillimeter(form.baseLengthMm)} Gesamtlänge.
                    Darüber kommen {formatCents(form.lengthSurchargeCents)} je angefangene 5 mm
                    hinzu.
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* 03 Funktion: zwei Spalten durch eine Haarlinie ab md */}
      <Section>
        <SectionHeading
          nummer="03"
          eyebrow="Funktion"
          title="Funktion des Zylinders"
          lead="Zusätzlich zur Bauform legen Sie je Tür fest, wie sich der Zylinder verhält, wenn innen ein Schlüssel steckt. Nicht jede Funktion ist für jede Bauform verfügbar."
        />

        <ul className="mt-10 grid border-t border-border md:grid-cols-2">
          {functions.map((fn, index) => (
            <li
              key={fn.id}
              className={cn(
                'border-b border-border py-6 md:py-8',
                index % 2 === 0 ? 'md:pr-gutter' : 'md:border-l md:border-border md:pl-gutter',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-title-sm font-semibold text-foreground">{fn.label}</p>
                <InfoTip hint={fn.info} />
              </div>
              <p className="mt-2 max-w-measure text-small text-foreground-muted">
                {fn.description}
              </p>
              <p className="mt-3 flex flex-wrap gap-2">
                {fn.forms.map((formId) => {
                  const match = catalog.forms.find((f) => f.id === formId);
                  return match ? (
                    <Badge key={formId} tone="outline">
                      {match.label}
                    </Badge>
                  ) : null;
                })}
              </p>
              {fn.surchargeCents > 0 && (
                <p className="mt-3 text-small text-foreground-muted">
                  Aufpreis je Zylinder:{' '}
                  <span className="font-mono tabular-nums text-foreground">
                    {formatCents(fn.surchargeCents)}
                  </span>
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>

      {/* 04 Messhilfe: nummerierte Schritte links, Messzeichnung rechts */}
      <Section id="messen" tone="muted">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              nummer="04"
              eyebrow="Messhilfe"
              title={catalog.measuringInfo.title}
              lead={catalog.measuringInfo.body}
            />

            <ol className="mt-7 border-t border-border">
              {[
                {
                  title: 'Stulpschraube suchen',
                  body: 'Das ist die Schraube in der Türkante, die den Zylinder hält. Ihre Mitte ist der Nullpunkt für beide Maße.',
                },
                {
                  title: 'Maß A nach außen messen',
                  body: 'Von der Mitte der Stulpschraube bis zum äußeren Ende des Zylinders auf der Außenseite der Tür.',
                },
                {
                  title: 'Maß B nach innen messen',
                  body: 'Von der Mitte der Stulpschraube bis zum Ende auf der Innenseite. Beim Halbzylinder entfällt dieses Maß.',
                },
                {
                  title: 'Jede Tür einzeln notieren',
                  body: 'Türen desselben Gebäudes haben oft verschiedene Maße. Notieren Sie sie getrennt, bevor Sie den Konfigurator öffnen.',
                },
              ].map((step, index) => (
                <li key={step.title} className="flex items-baseline gap-4 border-b border-border py-5">
                  <span
                    aria-hidden
                    className="w-8 shrink-0 font-mono text-small font-semibold tabular-nums text-area-strong"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-title-sm font-semibold text-foreground">{step.title}</p>
                    <p className="mt-1 text-small text-foreground-muted">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Alert tone="warning" title="Maß vor Bestellung prüfen" className="mt-7">
              Ein zu kurzer Zylinder lässt sich nicht sicher schließen, ein zu langer steht vor und
              lässt sich leichter angreifen. Die Zylinder werden nach Ihren Angaben gefertigt —
              prüfen Sie die Maße deshalb vor dem Absenden noch einmal.
            </Alert>

            <p className="mt-5 flex items-start gap-3 text-small text-foreground-muted">
              <GlyphInfo size={18} className="mt-0.5 shrink-0 text-foreground-muted" />
              <span>
                Im Konfigurator wählen Sie Maß A und Maß B in Fünf-Millimeter-Schritten aus. Die
                Zeichnung und der Messhinweis stehen dort direkt neben der Auswahl.
              </span>
            </p>

            <Link
              href="/ratgeber/zylinder-richtig-ausmessen"
              className="mt-4 inline-flex min-h-touch items-center gap-2 text-small font-semibold text-primary hover:underline"
            >
              <GlyphLineal size={16} />
              Ausführliche Anleitung zum Ausmessen
            </Link>
          </div>

          <div className="lg:col-span-7">
            <ImagePlaceholder slot={catalog.measuringFigure} />
          </div>
        </div>
      </Section>

      {/* 05 Bestellbeispiel: ab md Tabelle, darunter dieselben Daten als gestapelte Zeilen */}
      <Section id="bestellbeispiel" tight>
        <SectionHeading
          nummer="05"
          eyebrow="Beispiel"
          title="So sieht eine typische Bestellung aus"
          lead="Drei Türen, drei verschiedene Maße, eine gemeinsame Schließung. Die Anzahl der gemeinsamen Schlüssel legen Sie selbst fest."
        />

        <table className="mt-8 hidden w-full border-collapse overflow-hidden rounded-lg border border-border bg-surface text-left md:table">
          <caption className="sr-only">
            Beispiel für eine Bestellung mit drei gleichschließenden Zylindern
          </caption>
          <thead>
            <tr className="border-b border-border bg-surface-muted">
              <th scope="col" className="px-4 py-3 font-mono text-caption uppercase tracking-label text-foreground-muted">
                Tür
              </th>
              <th scope="col" className="px-4 py-3 font-mono text-caption uppercase tracking-label text-foreground-muted">
                Bauform
              </th>
              <th scope="col" className="px-4 py-3 font-mono text-caption uppercase tracking-label text-foreground-muted">
                Maß A / Maß B
              </th>
              <th scope="col" className="px-4 py-3 font-mono text-caption uppercase tracking-label text-foreground-muted">
                Schließung
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ORDER_EXAMPLE.map((row) => (
              <tr key={row.position}>
                <td className="px-4 py-3 text-body font-semibold text-foreground">
                  {row.position}
                </td>
                <td className="px-4 py-3 text-body text-foreground-muted">{row.form}</td>
                <td className="px-4 py-3 font-mono text-body tabular-nums text-foreground">
                  {row.measure} mm
                </td>
                <td className="px-4 py-3 text-body text-foreground-muted">gleichschließend</td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="mt-8 border-t border-border md:hidden">
          {ORDER_EXAMPLE.map((row) => (
            <div key={row.position} className="border-b border-border py-5">
              <dt className="text-title-sm font-semibold text-foreground">{row.position}</dt>
              <dd className="mt-3 text-small text-foreground-muted">
                <span className="block font-mono text-caption uppercase tracking-label text-foreground-muted">
                  Bauform
                </span>
                {row.form}
              </dd>
              <dd className="mt-2 font-mono text-small tabular-nums text-foreground">
                <span className="block font-mono text-caption uppercase tracking-label text-foreground-muted">
                  Maß A / Maß B
                </span>
                {row.measure} mm
              </dd>
              <dd className="mt-2 text-small text-foreground-muted">
                <span className="block font-mono text-caption uppercase tracking-label text-foreground-muted">
                  Schließung
                </span>
                gleichschließend
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 max-w-measure text-small text-foreground-muted">
          Alle drei Zylinder erhalten dieselbe Schließung. Dazu kommt die von Ihnen gewählte Anzahl
          gemeinsamer Schlüssel — {catalog.includedKeys} Schlüssel sind im Grundpreis enthalten,
          jeder weitere kostet {formatCents(catalog.keyPriceCents)}. Insgesamt sind bis zu{' '}
          {catalog.maxKeys} gemeinsame Schlüssel und {catalog.maxCylinders} Zylinder je Bestellung
          möglich.
        </p>

        <div className="mt-7">
          <ButtonLink
            href={`/${ROUTE}/konfigurator`}
            size="lg"
            pfeil
            className="w-full justify-between text-left sm:w-auto"
          >
            Eigene Zusammenstellung starten
          </ButtonLink>
        </div>
      </Section>

      {/* 06 Schutz und Optionen: Stückliste mit Preisen */}
      <Section tone="muted" tight>
        <SectionHeading
          nummer="06"
          eyebrow="Schutz und Optionen"
          title="Was Sie zusätzlich festlegen können"
          lead="Diese Optionen wählen Sie im dritten Schritt des Konfigurators aus. Jede Option ist einzeln abwählbar."
        />

        <ul className="mt-10 border-t border-border">
          {extras.map((extra) => (
            <li
              key={extra.id}
              className="grid gap-3 border-b border-border py-6 md:grid-cols-12 md:gap-gutter"
            >
              <div className="flex items-start justify-between gap-3 md:col-span-5">
                <p className="text-title-sm font-semibold text-foreground">{extra.label}</p>
                <InfoTip hint={extra.info} />
              </div>
              <p className="max-w-measure text-small text-foreground-muted md:col-span-4">
                {extra.description}
              </p>
              <p className="text-small font-semibold text-foreground-muted md:col-span-3 md:text-right">
                <span className="font-mono tabular-nums text-foreground">
                  {formatCents(extra.priceCents)}
                </span>{' '}
                {extra.unit === 'stueck' ? 'je Zylinder' : 'einmalig je Bestellung'}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 07 Abgrenzung: zwei Spalten durch eine Haarlinie */}
      <Section id="abgrenzung">
        <SectionHeading
          nummer="07"
          eyebrow="Abgrenzung"
          title="Gleichschließung oder Schließanlage?"
          lead="Beide Wege führen zu weniger Schlüsseln. Der Unterschied liegt darin, ob zwischen Personen unterschieden werden muss."
        />

        <div className="mt-10 grid border-t border-border md:grid-cols-2">
          <div className="border-b border-border py-8 md:border-b-0 md:pr-gutter">
            <h3 className="text-title-sm font-semibold text-foreground">Gleichschließung</h3>
            <p className="mt-2 max-w-measure text-small text-foreground-muted">
              Alle Zylinder haben dieselbe Schließung, alle Schlüssel öffnen alles. Passend für
              Einfamilienhäuser, Wohnungen mit Nebenräumen, Garagen und kleine Betriebe, in denen
              jede Person überall hinein darf.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-small text-foreground-muted marker:text-area">
              <li>Ein Berechtigungsgrad für alle</li>
              <li>Direkt im Konfigurator bestellbar</li>
              <li>Erweiterbar nur, wenn die Schließung hinterlegt wird</li>
            </ul>
            <Link
              href={`/${ROUTE}/konfigurator`}
              className="group mt-5 inline-flex min-h-touch items-center gap-2 text-small font-semibold text-primary hover:underline"
            >
              Zum Konfigurator
              <GlyphPfeilRechts
                size={16}
                className="transition-transform duration-quick zeiger:group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="py-8 md:border-l md:border-border md:pl-gutter">
            <h3 className="text-title-sm font-semibold text-foreground">Schließanlage</h3>
            <p className="mt-2 max-w-measure text-small text-foreground-muted">
              Türen und Personen werden getrennt geplant: Wer darf welche Tür öffnen? Passend für
              Mehrfamilienhäuser, Verwaltungen, Praxen und Betriebe mit mehreren Bereichen.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-small text-foreground-muted marker:text-area">
              <li>Mehrere Berechtigungsgrade, zum Beispiel mit Hauptschlüssel</li>
              <li>Erfassung über den Projektkonfigurator statt Direktkauf</li>
              <li>Planung mit Schließplan und Angebot</li>
            </ul>
            <Link
              href="/schliessanlagen"
              className="group mt-5 inline-flex min-h-touch items-center gap-2 text-small font-semibold text-primary hover:underline"
            >
              Zu den Schließanlagen
              <GlyphPfeilRechts
                size={16}
                className="transition-transform duration-quick zeiger:group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </Section>

      {/* 08 Fragen */}
      <Section tone="muted" tight>
        <SectionHeading
          nummer="08"
          eyebrow="Fragen und Antworten"
          title="Häufige Fragen zur Gleichschließung"
        />
        <Accordion items={faq} className="mt-8" />
      </Section>

      {/* 09 Weiterlesen: Stückliste, die ganze Zeile ist der Link */}
      <Section tight>
        <SectionHeading
          nummer="09"
          eyebrow="Weiterlesen"
          title="Passende Bereiche"
          lead="Wenn eine Gleichschließung nicht das Richtige ist, führen diese Wege weiter."
        />

        <ul className="mt-8 border-t border-border">
          {relatedLinks.map((link) => (
            <li key={link.href} className="border-b border-border">
              <Link
                href={link.href}
                className="group flex min-h-touch-lg items-center justify-between gap-4 py-5"
              >
                <span className="text-title-sm font-semibold text-foreground group-hover:text-primary">
                  {link.label}
                </span>
                <GlyphPfeilRechts
                  size={18}
                  className="shrink-0 text-foreground-muted transition-transform duration-quick zeiger:group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
