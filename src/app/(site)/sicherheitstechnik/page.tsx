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
  params: Promise<{ slug?: string }>;
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



      {/* Fachlicher Tiefen-Content */}
      <Section tight>
        <SectionHeading
          eyebrow="Architektur & Methodik"
          title="Ganzheitliche Sicherheitskonzepte für höchste Ansprüche"
          lead="Unsere Methodik beruht auf einem mehrschichtigen Sicherheitsmodell, das präventive Mechanik mit reaktiver Sensorik und intelligenter Steuerung verbindet."
        />
        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12 text-[oklch(0.32_0.02_260)] leading-relaxed text-[15px]">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Prävention durch Mechanik</h3>
            <p>
              Der Kern eines jeden effektiven Sicherheitskonzepts ist die mechanische Grundsicherung. Ohne widerstandsfähige
              Türen, Fenster und Schließsysteme ist selbst die modernste Überwachungstechnik wirkungslos. Hochwertige Zylinder,
              stabile Schutzbeschläge und massive Schließbleche bilden die physische Barriere, die potenzielle Eindringlinge
              aufhält. Wir setzen auf VdS-anerkannte Komponenten, die nicht nur durch ihre Materialgüte überzeugen, sondern
              auch durch präzise Verarbeitung und Manipulationsschutz.
            </p>
            <p>
              Unsere Experten analysieren die Schwachstellen Ihrer Gebäudehülle und entwickeln maßgeschneiderte Lösungen.
              Dabei berücksichtigen wir sowohl den Widerstandszeitwert (Resistance Time) als auch die architektonischen
              Gegebenheiten. Ein durchdachtes mechanisches Konzept zwingt Täter zu mehr Zeitaufwand und verursacht Lärm,
              was das Risiko der Entdeckung signifikant erhöht und somit eine starke abschreckende Wirkung entfaltet.
            </p>
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] pt-4">Reaktion durch elektronische Sensorik</h3>
            <p>
              Ergänzend zur mechanischen Absicherung implementieren wir fortschrittliche elektronische Meldesysteme.
              Diese Systeme fungieren als das Nervensystem Ihres Sicherheitskonzepts. Sie detektieren unbefugte
              Eindringversuche frühzeitig, oft bevor die mechanische Barriere überwunden ist. Glasbruchmelder,
              Magnetkontakte und Infrarot-Bewegungsmelder bilden ein lückenloses Netz, das jede Anomalie registriert
              und an die zentrale Steuerungseinheit meldet.
            </p>
          </div>
          <div className="space-y-4">
            <p>
              Die Sensibilität dieser Systeme passen wir präzise an Ihr Nutzungsprofil an, um Falschalarme zu minimieren
              und gleichzeitig höchste Detektionssicherheit zu gewährleisten. Durch die Integration moderner Bus-Systeme
              und verschlüsselter Funktechnologien lassen sich die Sensoren unauffällig in die bestehende Infrastruktur
              integrieren, ohne die Ästhetik der Räumlichkeiten zu beeinträchtigen.
            </p>
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] pt-4">Intelligente Steuerung und Alarmierung</h3>
            <p>
              Die gesammelten Informationen der Sensoren laufen in einer intelligenten Alarmzentrale zusammen. Diese
              analysiert die Daten in Echtzeit und leitet bei Bedarf die vordefinierten Maßnahmen ein. Ob lokale
              optisch-akustische Alarmierung, stille Benachrichtigung an einen Wachdienst oder Push-Nachrichten auf
              Ihr Smartphone – die Reaktionskette wird individuell auf Ihre Bedürfnisse abgestimmt.
            </p>
            <p>
              Wir integrieren die Sicherheitstechnik nahtlos in bestehende Gebäudeautomationssysteme. So lassen sich
              Synergien nutzen, beispielsweise durch die Kopplung von Zutrittskontrollsystemen mit der Beleuchtungssteuerung
              oder der Videoüberwachung. Das Ergebnis ist ein kohärentes, hochverfügbares Sicherheitssystem, das sich intuitiv
              bedienen lässt und Ihnen zu jeder Zeit die volle Kontrolle und Transparenz über den Sicherheitsstatus Ihres
              Objekts bietet.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <SectionHeading
              eyebrow="Kalkulation"
              title="Transparente Kostenplanung für Ihr Sicherheitsprojekt"
              lead="Nutzen Sie unseren interaktiven Kalkulator, um einen ersten Richtwert für Ihr Projekt zu erhalten. Die genaue Konfiguration erfolgt nach einem Vor-Ort-Termin."
            />
            <div className="mt-8 prose prose-sm text-foreground-muted">
              <p>
                Die Investition in Sicherheitstechnik ist eine Investition in den Schutz von Werten und Menschenleben.
                Die Kostenstruktur setzt sich dabei aus verschiedenen Komponenten zusammen: der Hardware, der fachgerechten
                Installation sowie der sorgfältigen Konfiguration und Einweisung.
              </p>
              <p>
                Unser Ansatz basiert auf absoluter Transparenz. Wir vermeiden versteckte Kosten und setzen auf
                qualitativ hochwertige, langlebige Systeme, die sich durch geringe Wartungskosten und hohe
                Zuverlässigkeit auszeichnen. Der Kalkulator auf der rechten Seite bietet Ihnen eine schnelle
                Einschätzung basierend auf dem Umfang Ihres Projekts.
              </p>
              <ul className="mt-4 space-y-2 list-disc pl-5">
                <li><strong className="text-foreground">Hardware:</strong> VdS-zertifizierte Komponenten namhafter Hersteller.</li>
                <li><strong className="text-foreground">Installation:</strong> Fachgerechte Montage nach DIN-Normen durch zertifizierte Techniker.</li>
                <li><strong className="text-foreground">Konfiguration:</strong> Individuelle Anpassung der Software und detaillierte Einweisung.</li>
              </ul>
            </div>
          </div>
          <div>
            <ServiceBudgetCalculator />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="FAQ"
          title="Häufig gestellte Fragen zur Sicherheitstechnik"
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h4 className="text-lg font-bold text-foreground mb-2">Wie oft muss eine Alarmanlage gewartet werden?</h4>
            <p className="text-[14px] leading-relaxed text-foreground-muted">
              Wir empfehlen eine jährliche Wartung durch unsere zertifizierten Techniker. Bei gewerblich genutzten oder VdS-zertifizierten Anlagen ist dies oft sogar vorgeschrieben. Die Wartung umfasst die Prüfung aller Sensoren, den Austausch von Batterien und die Überprüfung der Signalübertragung, um eine 100%ige Funktionsbereitschaft sicherzustellen.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h4 className="text-lg font-bold text-foreground mb-2">Können bestehende Systeme nachgerüstet werden?</h4>
            <p className="text-[14px] leading-relaxed text-foreground-muted">
              Ja, in den meisten Fällen ist eine Nachrüstung problemlos möglich. Wir analysieren Ihr bestehendes System und erarbeiten ein Konzept, wie wir moderne Komponenten wie Videoüberwachung oder smarte Zutrittskontrollen integrieren können, ohne dass eine komplette Neuinstallation erforderlich ist.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h4 className="text-lg font-bold text-foreground mb-2">Was passiert bei einem Stromausfall?</h4>
            <p className="text-[14px] leading-relaxed text-foreground-muted">
              Unsere professionellen Sicherheitssysteme sind mit leistungsstarken Notstromakkus ausgestattet. Diese gewährleisten den reibungslosen Betrieb der Anlage für mindestens 12 bis 24 Stunden, abhängig von der Anlagengröße. Sobald der Strom ausfällt, erhalten Sie zudem sofort eine Benachrichtigung.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h4 className="text-lg font-bold text-foreground mb-2">Sind drahtlose Funksysteme sicher?</h4>
            <p className="text-[14px] leading-relaxed text-foreground-muted">
              Moderne Funk-Sicherheitssysteme nutzen verschlüsselte Mehrfrequenzverfahren, die extrem resistent gegen Störungen und Manipulationsversuche (sog. Jamming) sind. Sie bieten eine sehr hohe Sicherheit und eignen sich besonders für die Nachrüstung, da keine aufwendigen Kabelverlegungen nötig sind.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h4 className="text-lg font-bold text-foreground mb-2">Werden Kameras bei Dunkelheit noch scharfe Bilder liefern?</h4>
            <p className="text-[14px] leading-relaxed text-foreground-muted">
              Wir verbauen modernste Überwachungskameras mit leistungsstarken Infrarot-Strahlern und Restlichtverstärkern. Diese Technologien garantieren selbst bei völliger Dunkelheit hochauflösende, detailreiche Bilder. Intelligente Algorithmen sorgen zudem dafür, dass Fehlalarme durch Tiere oder Witterungseinflüsse minimiert werden.
            </p>
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
