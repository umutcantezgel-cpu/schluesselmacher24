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
  void params;
  void searchParams;
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


      {/* Fachliche Detailausführung */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Architektonische Methodik"
          title="Tiefgehende Betrachtung von Sicherheitssystemen"
          lead="Wir setzen auf ein holistisches Konzept, bei dem Mechanik, Elektronik und Organisation nahtlos ineinandergreifen."
        />
        <div className="mt-8 space-y-6 text-[oklch(0.32_0.02_260)] text-[15px] leading-relaxed">
          <p>
            Moderne Sicherheitstechnik basiert auf einem mehrschichtigen Verteidigungsansatz. Der mechanische Grundschutz
            bildet dabei das Fundament: Er stellt den physischen Widerstand dar, der einen Eindringling aktiv aufhält.
            Je länger dieser Widerstand anhält, desto größer ist das Entdeckungsrisiko für den Täter. Elektronische
            Maßnahmen ergänzen diesen Schutz, indem sie den Versuch eines Einbruchs detektieren und frühzeitig melden,
            können jedoch ohne robuste Mechanik leicht überwunden werden.
          </p>
          <p>
            Unsere Planung beginnt mit einer umfassenden Schwachstellenanalyse. Wir betrachten die Außenhaut des Gebäudes
            – Türen, Fenster, Lichtschächte – sowie die interne Struktur. Dabei berücksichtigen wir die Widerstandsklasse (RC)
            nach DIN EN 1627 und kombinieren zertifizierte Einbruchhemmung mit intelligenter Sensorik.
          </p>
          <p>
            Die Alarmtechnik wiederum wird präzise auf die örtlichen Gegebenheiten abgestimmt. Wir setzen auf
            Sabotageüberwachung, redundante Übertragungswege (Dual-Path-Signalisierung über IP und Mobilfunk) und
            maßgeschneiderte Scharfschaltekonzepte, die Falschalarme minimieren und höchste Zuverlässigkeit garantieren.
            Das Ziel ist eine lückenlose Alarmkette, die von der Detektion über die Verarbeitung in der Einbruchmeldezentrale (EMZ)
            bis zur Alarmierung einer Notruf- und Serviceleitstelle (NSL) reicht.
          </p>
        </div>
      </Section>

      {/* Interaktiver Kalkulator */}
      <Section>
        <SectionHeading
          eyebrow="Investitionsplanung"
          title="Kalkulieren Sie Ihr Projekt"
          lead="Nutzen Sie unseren interaktiven Rechner, um einen ersten Richtwert für Ihr Sicherheitsprojekt zu erhalten."
        />
        <div className="mt-8 mx-auto max-w-2xl">
          <ServiceBudgetCalculator />
        </div>
      </Section>

      {/* FAQ Sektion */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Häufig gestellte Fragen"
          title="Expertenantworten zu Sicherheitstechnik"
          lead="Fundiertes Wissen für Ihre Entscheidungsfindung."
        />
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h3 className="text-[16px] font-bold text-[oklch(0.16_0.02_260)]">Wie verhält sich der mechanische Schutz zur Alarmtechnik?</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">Mechanik ist der primäre Widerstand. Die Alarmtechnik detektiert den Versuch. Ohne Mechanik ist der Eindringling im Objekt, bevor die Hilfe eintrifft. Die ideale Kombination maximiert die Verzögerungszeit und minimiert die Reaktionszeit.</p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h3 className="text-[16px] font-bold text-[oklch(0.16_0.02_260)]">Welche Zertifizierungen sind für Einbruchmeldeanlagen (EMA) relevant?</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">In Deutschland sind die VdS-Klassen (A, B, C) sowie die DIN EN 50131 (Grade 1-4) maßgeblich. Diese Normen definieren die Anforderungen an die Geräte und deren Überwindungssicherheit, was für Versicherungen von zentraler Bedeutung ist.</p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h3 className="text-[16px] font-bold text-[oklch(0.16_0.02_260)]">Was bedeutet Zwangsläufigkeit in der Alarmtechnik?</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">Zwangsläufigkeit verhindert Falschalarme durch organisatorische oder technische Maßnahmen. Es bedeutet, dass eine Anlage nur scharfgeschaltet werden kann, wenn alle Melder im Ruhezustand sind (z.B. alle Fenster zu). Das Betreten des Objekts ist erst nach Unscharfschaltung möglich.</p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h3 className="text-[16px] font-bold text-[oklch(0.16_0.02_260)]">Ist Videoüberwachung auf privaten Grundstücken erlaubt?</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">Grundsätzlich ja, jedoch darf ausschließlich das eigene Grundstück erfasst werden. Öffentlicher Raum (Bürgersteig) oder Nachbargrundstücke sind strikt tabu. Die datenschutzrechtlichen Vorgaben der DSGVO und lokale Regelungen müssen zwingend beachtet werden.</p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h3 className="text-[16px] font-bold text-[oklch(0.16_0.02_260)]">Wie funktioniert eine Aufschaltung auf eine Notruf- und Serviceleitstelle (NSL)?</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">Die Alarmanlage kommuniziert über einen gesicherten Übertragungsweg (oft redundant) mit der Leitstelle. Bei einer Auslösung wertet das geschulte Personal das Signal aus und leitet sofort die vereinbarten Maßnahmen ein, wie die Benachrichtigung der Polizei, Feuerwehr oder eines Interventionsdienstes.</p>
          </div>
        </div>
      </Section>

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
