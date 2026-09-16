import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, KeyRound, Layers, Ruler } from 'lucide-react';

import { getCollection, getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { formatCents, formatMillimeter } from '@/lib/format';
import { Accordion } from '@/components/ui/accordion';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { InfoTip } from '@/components/ui/info-tip';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';

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
  { position: 'Haustür', form: 'Doppelzylinder', measure: '30/35' },
  { position: 'Wohnungstür', form: 'Doppelzylinder', measure: '40/40' },
  { position: 'Kellertür', form: 'Doppelzylinder', measure: '55/30' },
];

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
      <PageHeader
        eyebrow={PROCESS_LABELS.direktkauf.label}
        title={page?.headline ?? 'Gleichschließende Zylinder'}
        lead={page?.subline ?? 'Mehrere Türen, ein Schlüssel. Direkt konfigurierbar.'}
        crumbs={[{ href: `/${ROUTE}`, label: 'Gleichschließende Zylinder' }]}
        actions={
          <ButtonLink href={`/${ROUTE}/konfigurator`} size="lg">
            Zylinder zusammenstellen
            <ArrowRight size={18} aria-hidden />
          </ButtonLink>
        }
      >
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                {fact.label}
              </dt>
              <dd className="mt-1 font-display text-lg font-bold text-foreground">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      {/* Grundprinzip */}
      <Section tight>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading
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

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                'Haus- und Wohnungstür mit demselben Schlüssel',
                'Keller, Dachboden und Nebeneingang einbinden',
                'Garage, Technikraum oder Gartenhaus ergänzen',
                'Mehrere Zylinder in einem Vorgang austauschen',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-[14px] leading-relaxed text-foreground-muted"
                >
                  <KeyRound size={16} aria-hidden className="mt-0.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <ImagePlaceholder
            slot={{
              motif: 'Schemazeichnung: drei Türen mit Zylindern, ein gemeinsamer Schlüssel',
              ratio: '4/3',
              note: 'Einfache technische Zeichnung, beschriftet. Kein Stockfoto.',
            }}
          />
        </div>
      </Section>

      {/* Bauformen */}
      <Section id="bauformen" tone="muted">
        <SectionHeading
          eyebrow="Bauformen"
          title="Welche Bauform passt an welche Tür?"
          lead="Die Bauform bestimmt, wie der Zylinder bedient wird. Sie wählen sie im Konfigurator für jede Tür einzeln."
        />

        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {forms.map((form) => (
            <li key={form.id}>
              <Card className="flex h-full flex-col">
                <CardBody className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[17px] font-bold text-foreground">{form.label}</h3>
                    <InfoTip hint={form.info} />
                  </div>

                  <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                    {form.description}
                  </p>

                  <div className="mt-4">
                    <ImagePlaceholder slot={form.figure} />
                  </div>

                  <dl className="mt-4 space-y-2 border-t border-border pt-4 text-[13px]">
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
                      <dd className="text-right text-foreground">
                        {formatMillimeter(form.minMm)} bis {formatMillimeter(form.maxMm)}
                      </dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                      <dt className="font-semibold text-foreground-muted">Grundpreis</dt>
                      <dd className="text-right text-foreground">
                        {formatCents(form.basePriceCents)}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-3 text-[12px] leading-relaxed text-foreground-subtle">
                    Der Grundpreis gilt bis {formatMillimeter(form.baseLengthMm)} Gesamtlänge.
                    Darüber kommen {formatCents(form.lengthSurchargeCents)} je angefangene 5 mm
                    hinzu.
                  </p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>

        {/* Funktionen */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-foreground">Funktion des Zylinders</h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
            Zusätzlich zur Bauform legen Sie je Tür fest, wie sich der Zylinder verhält, wenn innen
            ein Schlüssel steckt. Nicht jede Funktion ist für jede Bauform verfügbar.
          </p>

          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {functions.map((fn) => (
              <li key={fn.id}>
                <Card className="h-full">
                  <CardBody>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[15px] font-bold text-foreground">{fn.label}</p>
                      <InfoTip hint={fn.info} />
                    </div>
                    <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
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
                      <p className="mt-3 text-[13px] text-foreground-muted">
                        Aufpreis je Zylinder: {formatCents(fn.surchargeCents)}
                      </p>
                    )}
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Messhilfe */}
      <Section id="messen">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Messhilfe"
              title={catalog.measuringInfo.title}
              lead={catalog.measuringInfo.body}
            />

            <ol className="mt-7 space-y-4 border-l border-border pl-7">
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
                <li key={step.title} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-[38px] flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface font-display text-xs font-bold text-primary"
                  >
                    {index + 1}
                  </span>
                  <p className="text-[15px] font-bold text-foreground">{step.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>

            <Alert tone="warning" title="Maß vor Bestellung prüfen" className="mt-7">
              Ein zu kurzer Zylinder lässt sich nicht sicher schließen, ein zu langer steht vor und
              lässt sich leichter angreifen. Die Zylinder werden nach Ihren Angaben gefertigt —
              prüfen Sie die Maße deshalb vor dem Absenden noch einmal.
            </Alert>

            <p className="mt-5 text-[14px]">
              <Link
                href="/ratgeber/zylinder-richtig-ausmessen"
                className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
              >
                <Ruler size={15} aria-hidden />
                Ausführliche Anleitung zum Ausmessen
              </Link>
            </p>
          </div>

          <div>
            <ImagePlaceholder slot={catalog.measuringFigure} />
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-border bg-surface-muted p-4">
              <Layers size={18} aria-hidden className="mt-0.5 shrink-0 text-primary" />
              <p className="text-[13px] leading-relaxed text-foreground-muted">
                Im Konfigurator wählen Sie Maß A und Maß B in Fünf-Millimeter-Schritten aus. Die
                Zeichnung und der Messhinweis stehen dort direkt neben der Auswahl.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Bestellbeispiel */}
      <Section id="bestellbeispiel" tone="muted" tight>
        <SectionHeading
          eyebrow="Beispiel"
          title="So sieht eine typische Bestellung aus"
          lead="Drei Türen, drei verschiedene Maße, eine gemeinsame Schließung. Die Anzahl der gemeinsamen Schlüssel legen Sie selbst fest."
        />

        <div className="table-scroll mt-8">
          <table className="w-full min-w-[34rem] border-collapse overflow-hidden rounded-lg border border-border bg-surface text-left">
            <caption className="sr-only">
              Beispiel für eine Bestellung mit drei gleichschließenden Zylindern
            </caption>
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                  Tür
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                  Bauform
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                  Maß A / Maß B
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground-muted">
                  Schließung
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ORDER_EXAMPLE.map((row) => (
                <tr key={row.position}>
                  <td className="px-4 py-3 text-[15px] font-semibold text-foreground">
                    {row.position}
                  </td>
                  <td className="px-4 py-3 text-[15px] text-foreground-muted">{row.form}</td>
                  <td className="px-4 py-3 font-mono text-[15px] text-foreground">
                    {row.measure} mm
                  </td>
                  <td className="px-4 py-3 text-[15px] text-foreground-muted">gleichschließend</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-foreground-muted">
          Alle drei Zylinder erhalten dieselbe Schließung. Dazu kommt die von Ihnen gewählte Anzahl
          gemeinsamer Schlüssel — {catalog.includedKeys} Schlüssel sind im Grundpreis enthalten,
          jeder weitere kostet {formatCents(catalog.keyPriceCents)}. Insgesamt sind bis zu{' '}
          {catalog.maxKeys} gemeinsame Schlüssel und {catalog.maxCylinders} Zylinder je Bestellung
          möglich.
        </p>

        <div className="mt-7">
          <ButtonLink href={`/${ROUTE}/konfigurator`} size="lg">
            Eigene Zusammenstellung starten
            <ArrowRight size={18} aria-hidden />
          </ButtonLink>
        </div>
      </Section>

      {/* Schutz und Optionen */}
      <Section tight>
        <SectionHeading
          eyebrow="Schutz und Optionen"
          title="Was Sie zusätzlich festlegen können"
          lead="Diese Optionen wählen Sie im dritten Schritt des Konfigurators aus. Jede Option ist einzeln abwählbar."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {extras.map((extra) => (
            <li key={extra.id}>
              <Card className="h-full">
                <CardBody>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[15px] font-bold text-foreground">{extra.label}</p>
                    <InfoTip hint={extra.info} />
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                    {extra.description}
                  </p>
                  <p className="mt-3 text-[13px] font-semibold text-foreground-muted">
                    {formatCents(extra.priceCents)}{' '}
                    {extra.unit === 'stueck' ? 'je Zylinder' : 'einmalig je Bestellung'}
                  </p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* Abgrenzung zur Schließanlage */}
      <Section id="abgrenzung" tone="muted">
        <SectionHeading
          eyebrow="Abgrenzung"
          title="Gleichschließung oder Schließanlage?"
          lead="Beide Wege führen zu weniger Schlüsseln. Der Unterschied liegt darin, ob zwischen Personen unterschieden werden muss."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <CardBody>
              <h3 className="text-[17px] font-bold text-foreground">Gleichschließung</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                Alle Zylinder haben dieselbe Schließung, alle Schlüssel öffnen alles. Passend für
                Einfamilienhäuser, Wohnungen mit Nebenräumen, Garagen und kleine Betriebe, in denen
                jede Person überall hinein darf.
              </p>
              <ul className="prose-sm24 mt-4">
                <li>Ein Berechtigungsgrad für alle</li>
                <li>Direkt im Konfigurator bestellbar</li>
                <li>Erweiterbar nur, wenn die Schließung hinterlegt wird</li>
              </ul>
              <p className="mt-5">
                <Link
                  href={`/${ROUTE}/konfigurator`}
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                >
                  Zum Konfigurator
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-[17px] font-bold text-foreground">Schließanlage</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                Türen und Personen werden getrennt geplant: Wer darf welche Tür öffnen? Passend für
                Mehrfamilienhäuser, Verwaltungen, Praxen und Betriebe mit mehreren Bereichen.
              </p>
              <ul className="prose-sm24 mt-4">
                <li>Mehrere Berechtigungsgrade, zum Beispiel mit Hauptschlüssel</li>
                <li>Erfassung über den Projektkonfigurator statt Direktkauf</li>
                <li>Planung mit Schließplan und Angebot</li>
              </ul>
              <p className="mt-5">
                <Link
                  href="/schliessanlagen"
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                >
                  Zu den Schließanlagen
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </p>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* Fragen */}
      <Section tight>
        <SectionHeading eyebrow="Fragen und Antworten" title="Häufige Fragen zur Gleichschließung" />
        <Accordion items={faq} className="mt-8" />
      </Section>

      {/* Interne Verlinkung */}
      <Section tone="muted" tight>
        <SectionHeading
          eyebrow="Weiterlesen"
          title="Passende Bereiche"
          lead="Wenn eine Gleichschließung nicht das Richtige ist, führen diese Wege weiter."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {relatedLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full items-center justify-between gap-3 rounded-lg border border-border bg-surface px-5 py-4 transition-colors hover:border-primary"
              >
                <span className="text-[14px] font-semibold text-foreground group-hover:text-primary">
                  {link.label}
                </span>
                <ArrowRight
                  size={15}
                  aria-hidden
                  className="shrink-0 text-foreground-subtle transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
