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

export default async function SicherheitstechnikPage() {
  const [page, services] = await Promise.all([
    getPageContent(ROUTE),
    getServicePages(ROUTE),
  ]);

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  return (
    <>
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

            {/* Added Deep Content Expansion */}
            <div className="mt-8 text-[oklch(0.32_0.02_260)] leading-relaxed space-y-6">
              <p>
                Die professionelle Absicherung von Privat- und Gewerbeobjekten erfordert ein ganzheitliches Verständnis von potenziellen Bedrohungsszenarien und den entsprechenden Gegenmaßnahmen. Stückwerk oder isolierte Einzellösungen bieten oft ein falsches Gefühl der Sicherheit, während die eigentlichen Schwachstellen des Objekts unbeachtet bleiben. Unser Ansatz basiert auf der präzisen Abstimmung von mechanischen Widerständen und elektronischer Überwachung.
              </p>
              <p>
                <strong>Die Architektur der Sicherheit</strong> beginnt immer an der Außenhaut des Gebäudes. Fenster, Türen und Lichtschächte sind die primären Angriffsziele. Hier greift das Prinzip des mechanischen Grundschutzes. Jede Minute, die ein potenzieller Täter länger benötigt, um eine physische Barriere zu überwinden, erhöht das Risiko seiner Entdeckung drastisch. Daher setzen wir konsequent auf zertifizierte Schließzylinder, einbruchhemmende Beschläge und massive Zusatzsicherungen, die den Täter zwingen, schweres Werkzeug einzusetzen und Lärm zu verursachen.
              </p>
              <p>
                Doch Mechanik allein ist blind. Sie hält auf, aber sie alarmiert nicht. Hier integriert sich die elektronische Meldetechnik nahtlos in das Konzept. Bevor der mechanische Widerstand nachgibt, registrieren sensible Sensoren — von Magnetkontakten an den Fensterrahmen bis hin zu seismischen Meldern — den Angriffsversuch. Diese intelligente Vernetzung sorgt dafür, dass Interventionen eingeleitet werden können, während die physische Barriere noch standhält.
              </p>
            </div>

            <dl className="mt-8 space-y-4">
              {PRINCIPLE.map((item) => (
                <div key={item.term} className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5 transition-shadow hover:shadow-md">
                  <dt className="text-[15px] font-bold text-[oklch(0.16_0.02_260)]">{item.term}</dt>
                  <dd className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                    {item.body}
                    <Link
                      href={item.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[oklch(0.52_0.24_260)] hover:text-[oklch(0.46_0.24_260)] hover:underline"
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

            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
              <p className="text-[13px] font-bold uppercase tracking-wider text-[oklch(0.52_0.24_260)]">
                Ablauf in diesem Bereich
              </p>
              <p className="mt-2 text-[18px] font-bold text-[oklch(0.16_0.02_260)]">{process.label}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                {process.hint}
                <br /><br />
                Eine gründliche Bestandsaufnahme ist der wichtigste Schritt. Wir analysieren Schwachstellen, bewerten bestehende Systeme und erstellen ein maßgeschneidertes Sicherheitskonzept, das genau auf Ihre Anforderungen und Ihr Budget abgestimmt ist.
              </p>
              <div className="mt-6">
                <ButtonLink href={`/${ROUTE}/sicherheitscheck`} variant="outline" className="w-full justify-center border-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.16_0.02_260)] hover:bg-[oklch(0.94_0.004_260)]">
                  Bestandsaufnahme starten
                </ButtonLink>
              </div>
            </div>

            {/* INTERACTIVE MODULE INTEGRATION */}
            <ServiceBudgetCalculator />
          </div>
        </div>
      </Section>

      {/* Detail-Architektur & FAQ (New Deep Content) */}
      <Section>
        <SectionHeading
          eyebrow="Tiefeneinblick"
          title="Technologische Methodik und Qualitätsstandards"
          lead="Wir verbauen keine Standardlösungen von der Stange, sondern maßschneidern die Sicherheitsarchitektur präzise auf Ihre Bedürfnisse."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div className="prose prose-sm max-w-none text-[oklch(0.32_0.02_260)]">
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mb-4">Integrierte Sicherheitskonzepte (ISK)</h3>
            <p className="mb-4">
              Unsere Planungen folgen den strengen Richtlinien moderner integrierter Sicherheitskonzepte. Dies bedeutet, dass wir nicht nur die technischen Komponenten betrachten, sondern auch organisatorische und personelle Faktoren in die Risikoanalyse einbeziehen. Eine Alarmanlage ist nur so effektiv wie das Interventionsprotokoll, das bei einer Auslösung abläuft.
            </p>
            <p className="mb-4">
              <strong>Zertifizierte Komponenten:</strong> Wir setzen ausschließlich auf VdS-anerkannte oder nach DIN EN normierte Produkte. Dies garantiert nicht nur eine verlässliche Funktion unter extremen Bedingungen, sondern wird auch von Versicherern zur Risikominimierung anerkannt und oft vorausgesetzt.
            </p>
            <p>
              <strong>Redundanz und Ausfallsicherheit:</strong> Moderne Systeme müssen auch bei Stromausfall, Sabotageversuchen der Kommunikationswege oder extremen Witterungsbedingungen zuverlässig funktionieren. Notstromakkus, redundante Übertragungswege (z.B. IP und LTE) sowie ständige Selbsttests der Sensorik (Polling) sind fester Bestandteil unserer Anlagenarchitektur.
            </p>
          </div>

          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-8">
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mb-6">Häufig gestellte Fragen (FAQ)</h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[oklch(0.16_0.02_260)]">1. Macht eine Alarmanlage ohne Wachdienst-Aufschaltung Sinn?</h4>
                <p className="mt-1 text-sm text-[oklch(0.32_0.02_260)]">Ein lokaler Alarm hat zwar eine abschreckende Wirkung, jedoch bleibt bei Abwesenheit eine professionelle Intervention aus. Wir empfehlen dringend die Aufschaltung auf eine VdS-zertifizierte Notruf- und Serviceleitstelle (NSL), um im Ernstfall garantierte, protokollierte Maßnahmen (Polizei, Wachdienst) einzuleiten.</p>
              </div>

              <div>
                <h4 className="font-bold text-[oklch(0.16_0.02_260)]">2. Wie aufwendig ist die Nachrüstung in einem Bestandsbau?</h4>
                <p className="mt-1 text-sm text-[oklch(0.32_0.02_260)]">Dank modernster, hochverschlüsselter Funk-Technologie (z.B. 868 MHz Band mit Rolling-Code) lassen sich bestehende Objekte heute meist ohne aufwendige Kabelverlegung und Schmutz nachrüsten. Die Komponenten fügen sich dezent in das Raumbild ein.</p>
              </div>

              <div>
                <h4 className="font-bold text-[oklch(0.16_0.02_260)]">3. Sind smarte Alarmanlagen über das Handy hackbar?</h4>
                <p className="mt-1 text-sm text-[oklch(0.32_0.02_260)]">Systeme aus dem Fachhandel nutzen dedizierte, hochsichere Protokolle und getrennte Netzwerke. Sie sind nicht vergleichbar mit einfachen Smart-Home-Gadgets. App-Zugriffe erfolgen verschlüsselt und können detailliert in ihren Rechten beschnitten werden.</p>
              </div>

              <div>
                <h4 className="font-bold text-[oklch(0.16_0.02_260)]">4. Was passiert bei einem Stromausfall?</h4>
                <p className="mt-1 text-sm text-[oklch(0.32_0.02_260)]">Professionelle Anlagen verfügen über Notstromakkus, die das System für mindestens 12 bis 24 Stunden vollständig funktionsfähig halten. Ein Netzausfall wird zudem sofort an die Leitstelle oder Ihr Smartphone gemeldet.</p>
              </div>

              <div>
                <h4 className="font-bold text-[oklch(0.16_0.02_260)]">5. Werden meine Haustiere Fehlalarme auslösen?</h4>
                <p className="mt-1 text-sm text-[oklch(0.32_0.02_260)]">Nein. Durch den Einsatz von speziellen, tierimmunen Bewegungsmeldern, die auf Volumen und Bewegungsmuster kalibriert sind, können sich Hunde oder Katzen bis zu einem gewissen Gewicht frei im Objekt bewegen, ohne den Alarm zu triggern.</p>
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
          className="mt-8 border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)]"
        >
          <ul className="space-y-2 text-[oklch(0.32_0.02_260)]">
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

          <p className="mt-4">
            <Link
              href="/rechtliches/datenschutz"
              className="font-semibold text-[oklch(0.52_0.24_260)] hover:underline"
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
    </>
  );
}
