import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BellRing,
  Camera,
  Layers,
  Lock,
  ShieldCheck,
  Siren,
  Smartphone,
} from 'lucide-react';

import { getPageContent, getServicePages } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';

const ROUTE = 'sicherheitstechnik';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Sicherheitstechnik',
    description:
      page?.seo.description
      ?? 'Videoüberwachung, Alarmtechnik, Sicherung der Außenhaut, mechanischer Schutz und kombinierte Konzepte.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/** Symbole je Bereich — rein dekorativ, die Inhalte kommen aus der Datenschicht. */
const SERVICE_ICONS: Record<string, typeof ShieldCheck> = {
  videoueberwachung: Camera,
  alarmtechnik: Siren,
  aussenhautsicherung: ShieldCheck,
  'mechanischer-schutz': Lock,
  'smarte-funktionen': Smartphone,
  'panik-und-alarmtaster': BellRing,
  'kombinierte-konzepte': Layers,
};

/** Der Grundsatz, nach dem wir die Bereiche zusammenstellen. */
const PRINCIPLE = [
  {
    term: 'Mechanik hält auf',
    body:
      'Zylinder, Schlösser, Beschläge und Zusatzsicherungen kosten Zeit und Kraft. Ohne diesen '
      + 'Grundschutz meldet jede Elektronik nur, dass bereits etwas passiert ist.',
    href: '/tuer-und-schliesstechnik',
    linkLabel: 'Zur Tür- und Schließtechnik',
  },
  {
    term: 'Meldetechnik erkennt',
    body:
      'Melder, Kontakte und Kameras erkennen, dass an einer Stelle etwas geschieht — an der Tür, '
      + 'am Fenster, an der Scheibe oder im Raum.',
    href: `/${ROUTE}/alarmtechnik`,
    linkLabel: 'Zur Alarmtechnik',
  },
  {
    term: 'Alarmierung informiert',
    body:
      'Signalgeber und Benachrichtigungen bringen die Information dorthin, wo jemand darauf '
      + 'reagieren kann. Der Weg wird vorab festgelegt.',
    href: `/${ROUTE}/panik-und-alarmtaster`,
    linkLabel: 'Zu Panik- und Alarmtastern',
  },
];

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SicherheitstechnikPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const [page, services] = await Promise.all([
    getPageContent(ROUTE),
    getServicePages(ROUTE),
  ]);

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  return (
    <main data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: page?.headline ?? 'Sicherheitstechnik',
          description: page?.seo.description,
          crumbs: [{ href: `/${ROUTE}`, label: 'Sicherheitstechnik' }],
        })}
      />

      <PageHeader
        eyebrow="Leistungsbereich"
        title={page?.headline ?? 'Sicherheitstechnik'}
        lead={page?.subline}
        crumbs={[{ href: `/${ROUTE}`, label: 'Sicherheitstechnik' }]}
        actions={
          <ButtonLink href={`/${ROUTE}/sicherheitscheck`} size="lg">
            Sicherheitscheck starten
            <ArrowRight size={18} aria-hidden />
          </ButtonLink>
        }
      />

      {/* Grundsatz */}
      <Section tight>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-12">
          <div>
            <SectionHeading
              eyebrow="Einordnung"
              title="Mechanik hält auf, Meldetechnik erkennt, Alarmierung informiert"
              lead={page?.intro}
            />

            <dl className="mt-6 space-y-4">
              {PRINCIPLE.map((item) => (
                <div key={item.term} className="rounded-lg border border-border bg-surface p-5">
                  <dt className="text-[15px] font-bold text-foreground">{item.term}</dt>
                  <dd className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                    {item.body}
                    <Link
                      href={item.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                    >
                      {item.linkLabel}
                      <ArrowRight size={15} aria-hidden />
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-6">
            <ImagePlaceholder
              slot={{
                motif: 'Objektfoto: Hauseingang mit Außenkamera, Türkontakt und Sicherheitsbeschlag',
                ratio: '4/3',
                note: 'Eigene Aufnahme aus einem abgeschlossenen Projekt. Kein Stockfoto.',
              }}
            />

            <div className="rounded-lg border border-border bg-surface-muted p-5">
              <p className="text-[13px] font-bold uppercase tracking-wider text-foreground-subtle">
                Ablauf in diesem Bereich
              </p>
              <p className="mt-2 text-[15px] font-bold text-foreground">{process.label}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">
                {process.hint}
              </p>
              <div className="mt-5">
                <ButtonLink href={`/${ROUTE}/sicherheitscheck`} variant="outline">
                  Bestandsaufnahme starten
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Bereiche */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Bereiche"
          title="Sieben Bereiche, die zusammen gedacht werden"
          lead="Einzeln betrachtet bleibt jeder Bereich Stückwerk. Welche Kombination zu Ihrem Objekt passt, klären wir in der Bestandsaufnahme."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = SERVICE_ICONS[service.slug] ?? ShieldCheck;
            return (
              <li key={service.id}>
                <Link
                  href={`/${ROUTE}/${service.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon size={19} aria-hidden />
                  </span>
                  <span className="mt-4 block text-[15px] font-bold text-foreground group-hover:text-primary">
                    {service.title}
                  </span>
                  <span className="mt-1.5 block flex-1 text-[13px] leading-relaxed text-foreground-muted">
                    {service.summary}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-foreground-subtle">
                    Zum Bereich
                    <ArrowRight
                      size={13}
                      aria-hidden
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Recht und Verantwortung */}
      <Section id="recht-und-verantwortung">
        <SectionHeading
          eyebrow="Recht und Verantwortung"
          title="Was Sie beim Betrieb von Video, Audio und Protokollen beachten müssen"
          lead="Diese Punkte klären wir vor der Planung, damit die Technik so aufgebaut wird, wie Sie sie später auch betreiben dürfen."
        />

        <Alert
          tone="legal"
          title="Verantwortlich für die Nutzung ist die Betreiberin oder der Betreiber der Anlage"
          className="mt-8"
        >
          <ul className="space-y-2">
            <li>
              Wer eine Anlage mit Video-, Audio- oder Protokollfunktion betreibt, verantwortet deren
              rechtmäßige Nutzung — also Zweck, Umfang, Speicherdauer, Zugriff und Kennzeichnung.
              Wir liefern und montieren die Technik und beraten technisch; eine Rechtsberatung ist
              das ausdrücklich nicht.
            </li>
            <li>
              Kameras dürfen öffentliche Flächen wie Gehwege und Straßen sowie Nachbargrundstücke
              nicht erfassen. Wir planen Aufstellort, Blickfeld und Begrenzung des Bildausschnitts
              entsprechend und halten das Ergebnis bei der Übergabe fest.
            </li>
            <li>
              Verdeckte Audioüberwachung bieten wir nicht als Standardprodukt an. Mikrofone und
              Aufzeichnung von Ton sind im Regelfall abgeschaltet.
            </li>
            <li>
              Gegensprech- und Alarmfunktionen richten wir nur für zulässige Einsatzzwecke ein,
              etwa für die Kommunikation an der eigenen Tür oder für eine vereinbarte Alarmierung.
            </li>
            <li>
              Protokollfunktionen — etwa Zutritts-, Ereignis- oder Bedienprotokolle — erfassen
              personenbezogene Daten. Zweck, Speicherdauer und Zugriffsberechtigung legen Sie vorab
              fest; im Beschäftigtenkontext ist zusätzlich die betriebliche Mitbestimmung zu
              beachten.
            </li>
          </ul>

          <p className="mt-3">
            <Link
              href="/rechtliches/datenschutz"
              className="font-semibold text-primary hover:underline"
            >
              Hinweise zum Datenschutz
            </Link>
          </p>
        </Alert>
      </Section>


      {/* Fachliche Methodik & Leistungsarchitektur */}
      <Section id="architektur" tone="muted">
        <SectionHeading
          eyebrow="Methodik & Architektur"
          title="Ganzheitliche Sicherheitskonzepte statt Insellösungen"
          lead="Unsere Herangehensweise an die Sicherheitstechnik basiert auf einem mehrschichtigen Architekturmodell, das präventive, detektierende und reaktive Maßnahmen nahtlos ineinandergreifen lässt."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div className="space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed text-[16px]">
            <p>
              Moderne Sicherheitstechnik ist weitaus komplexer als die bloße Installation einer Kamera oder eines Bewegungsmelders. Ein robustes System erfordert eine <strong>tiefgehende Risikoanalyse</strong> und eine darauf abgestimmte <strong>Sicherheitsarchitektur</strong>. Wir differenzieren dabei systematisch zwischen dem <em>mechanischen Grundschutz</em> (der physischen Barriere), der <em>elektronischen Detektion</em> (der sensorischen Erfassung von Abweichungen) und der <em>vernetzten Alarmierung</em> (der gesteuerten Informationsweitergabe).
            </p>
            <p>
              Besonderes Augenmerk legen wir auf die <strong>Ausfallsicherheit und Redundanz</strong>. Sabotageversuche, Stromausfälle oder Netzwerkstörungen dürfen nicht zum Totalausfall der Überwachung führen. Daher setzen wir auf duale Übertragungswege (z.B. IP und LTE), notstromgepufferte Zentralen und manipulationsgeschützte Bus-Systeme. Jeder Sensor, jede Kamera und jeder Signalgeber wird so platziert und konfiguriert, dass er nicht nur seine primäre Aufgabe erfüllt, sondern auch den Status des Gesamtsystems überwacht.
            </p>
            <p>
              In der Praxis bedeutet dies: Bevor wir eine Lösung empfehlen, analysieren wir die <em>Schwachstellen des Objekts</em>, bewerten die <em>Wahrscheinlichkeit spezifischer Bedrohungsszenarien</em> und definieren gemeinsam mit Ihnen das <em>gewünschte Schutzziel</em>. Erst auf dieser Grundlage entsteht ein maßgeschneidertes, skalierbares Konzept, das mit Ihren Anforderungen wachsen kann.
            </p>
          </div>

          <div className="rounded-2xl bg-[oklch(0.968_0.004_260)] p-8 border border-[oklch(0.89_0.008_260/0.55)] shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-6">Vergleichsmatrix: Sicherheitsstufen</h3>

            <div className="space-y-4">
              <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[oklch(0.16_0.02_260)]">Basis-Schutz (Grad 1)</span>
                  <span className="text-xs bg-[oklch(0.988_0.002_260)] px-2 py-1 rounded border border-[oklch(0.89_0.008_260/0.55)]">Wohnbereich</span>
                </div>
                <p className="text-sm text-[oklch(0.32_0.02_260)]">Mechanische Grundsicherung kombiniert mit autarken Meldern. Fokus auf Abschreckung und lokale Alarmierung.</p>
              </div>

              <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[oklch(0.16_0.02_260)]">Erweiterter Schutz (Grad 2)</span>
                  <span className="text-xs bg-[oklch(0.988_0.002_260)] px-2 py-1 rounded border border-[oklch(0.89_0.008_260/0.55)]">Gewerbe / Hochwertig</span>
                </div>
                <p className="text-sm text-[oklch(0.32_0.02_260)]">Vernetztes System mit Aufschaltung auf eine Leitstelle. Notstromversorgung und redundante Übertragungswege.</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[oklch(0.16_0.02_260)]">Hochsicherheit (Grad 3/4)</span>
                  <span className="text-xs bg-[oklch(0.988_0.002_260)] px-2 py-1 rounded border border-[oklch(0.89_0.008_260/0.55)]">Kritische Infr.</span>
                </div>
                <p className="text-sm text-[oklch(0.32_0.02_260)]">Zertifizierte Anlagen nach strengsten VdS-Richtlinien. Lückenlose Flächenüberwachung und biometrische Zutrittskontrolle.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Interaktiver Rechner */}
      <Section id="kalkulator">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <SectionHeading
              eyebrow="Budgetplanung"
              title="Transparente Investition in Ihre Sicherheit"
              lead="Sicherheit ist eine Investition, keine bloße Ausgabe. Mit unserem interaktiven Kalkulator erhalten Sie eine erste, unverbindliche Indikation über das benötigte Budget."
            />
            <div className="mt-6 space-y-4 text-[oklch(0.32_0.02_260)] leading-relaxed text-[16px]">
              <p>
                Die tatsächlichen Kosten eines Sicherheitssystems hängen von vielen Faktoren ab: Der Größe des Objekts, der Anzahl der Zugänge (Türen, Fenster, Lichtschächte), den gewünschten Funktionalitäten (Video, Alarm, Zutritt) und nicht zuletzt den baulichen Gegebenheiten vor Ort.
              </p>
              <p>
                Unser Tool nutzt Durchschnittswerte aus Hunderten realisierter Projekte, um Ihnen einen realistischen Korridor aufzuzeigen. Bitte beachten Sie, dass dies eine erste Schätzung darstellt und eine detaillierte Vor-Ort-Analyse nicht ersetzt.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[oklch(0.52_0.24_260/0.05)] to-transparent rounded-3xl -z-10 blur-2xl transform scale-105" />
            <ServiceBudgetCalculator />
          </div>
        </div>
      </Section>

      {/* Ausführliche FAQ */}
      <Section id="faq" tone="muted">
        <SectionHeading
          eyebrow="Häufige Fragen"
          title="Fachwissen kompakt erklärt"
          lead="Die wichtigsten Antworten rund um Konzeption, Installation und Betrieb von Sicherheitstechnik."
        />

        <div className="mt-12 grid gap-6 max-w-3xl mx-auto">
          {[
            {
              q: "Warum ist mechanischer Schutz die Voraussetzung für Elektronik?",
              a: "Elektronik (wie eine Alarmanlage) meldet lediglich, dass ein Ereignis stattfindet. Sie verhindert den Einbruch nicht aktiv. Ein mechanisch gut gesichertes Fenster leistet physischen Widerstand und kostet den Täter Zeit. Idealerweise ist der mechanische Widerstand so hoch, dass der Täter aufgibt, bevor er eindringt, während die Elektronik bereits den Alarm ausgelöst hat."
            },
            {
              q: "Was unterscheidet eine Funk-Alarmanlage von einem kabelgebundenen System?",
              a: "Kabelgebundene Systeme sind in der Regel wartungsärmer (keine Batteriewechsel), extrem störsicher und bei Neubauten oder Kernsanierungen die erste Wahl. Funk-Systeme (häufig hybride Systeme) eignen sich hervorragend für die Nachrüstung in bestehenden Objekten, da keine Wände aufgestemmt werden müssen. Moderne Funk-Protokolle arbeiten heute stark verschlüsselt und sind gegen 'Jamming' (Störsender) geschützt."
            },
            {
              q: "Ist eine Aufschaltung auf einen Wachdienst zwingend erforderlich?",
              a: "Technisch nicht zwingend, aber konzeptionell hochgradig empfehlenswert. Ein lokaler Sirenenalarm verschreckt Täter und alarmiert Nachbarn, aber niemand ist verpflichtet, einzugreifen. Eine Aufschaltung an eine zertifizierte Notruf- und Serviceleitstelle (NSL) stellt sicher, dass Alarme 24/7 von Profis bewertet und vereinbarte Maßnahmen (z.B. Polizei rufen, Wachdienst schicken) sofort eingeleitet werden."
            },
            {
              q: "Wie lange werden Videoaufzeichnungen gespeichert?",
              a: "Dies hängt von den datenschutzrechtlichen Vorgaben (DSGVO) und dem konkreten Zweck ab. Im Regelfall ist eine Speicherung von 48 bis 72 Stunden zulässig und ausreichend, um Vorfälle, die über das Wochenende passiert sind, zu dokumentieren. Eine längere Speicherung bedarf einer besonderen Begründung. Wir konfigurieren die Rekorder so, dass ältere Aufnahmen automatisch überschrieben werden (Ringpuffer)."
            },
            {
              q: "Können bestehende Systeme (z.B. Smart Home) integriert werden?",
              a: "Oftmals ja, allerdings raten wir zur Vorsicht. Eine Alarmanlage ist ein zertifiziertes Sicherheitssystem, ein Smart Home in erster Linie ein Komfortsystem. Wir empfehlen, die Gewerke logisch zu trennen: Die Alarmanlage kann den Status ('scharf'/'unscharf') an das Smart Home übermitteln (z.B. um Lichter auszuschalten), aber das Smart Home sollte niemals die Alarmanlage deaktivieren können."
            }
          ].map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">{faq.q}</h4>
              <p className="text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Verbindung zur Mechanik */}
      <Section tone="muted" tight>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="h-full">
            <CardBody className="flex h-full flex-col">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Grundschutz zuerst
              </p>
              <p className="mt-2 text-lg font-bold text-foreground">Tür- und Schließtechnik</p>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                Zylinder, Schlösser, Beschläge und Zusatzsicherungen sind die Grundlage. Erst darauf
                setzen wir Melde- und Alarmtechnik auf.
              </p>
              <Link
                href="/tuer-und-schliesstechnik"
                className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
              >
                Zur Tür- und Schließtechnik
                <ArrowRight size={15} aria-hidden />
              </Link>
            </CardBody>
          </Card>

          <Card className="h-full">
            <CardBody className="flex h-full flex-col">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Bestandsaufnahme
              </p>
              <p className="mt-2 text-lg font-bold text-foreground">Sicherheitscheck</p>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                Zehn Schritte zu Objekt, Zugängen, vorhandener Technik, Schwerpunkten und
                Unterlagen. Ihr Zwischenstand bleibt erhalten.
              </p>
              <Link
                href={`/${ROUTE}/sicherheitscheck`}
                className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
              >
                Sicherheitscheck starten
                <ArrowRight size={15} aria-hidden />
              </Link>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* Weiterführende Seiten */}
      {page && page.seo.internalLinks.length > 0 && (
        <Section tight>
          <SectionHeading eyebrow="Weiterlesen" title="Passende Seiten" />
          <ul className="mt-6 flex flex-wrap gap-3">
            {page.seo.internalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 text-[14px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {link.label}
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </main>
  );
}