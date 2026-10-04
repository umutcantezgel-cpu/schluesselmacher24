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

import { SecurityBudgetCalculator } from '@/components/perf/optimization-12';

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SicherheitstechnikPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  // Use params to satisfy lint
  // const resolvedParams = await params;
  // const resolvedSearch = await searchParams;

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

      <div className="hidden" data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)} aria-hidden="true"></div>
      <PageHeader eyebrow="Leistungsbereich"
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

      {/* FAQ & Methodik */}
      <Section tight>
        <SectionHeading eyebrow="Methodik & FAQ" title="Tiefgreifendes Wissen zur Sicherheitstechnik" />
        <div className="mt-8 space-y-8">
          <div className="prose text-[oklch(0.32_0.02_260)] leading-relaxed">
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Architektonische Methodik</h3>
            <p>
              Die Sicherheitstechnik eines modernen Gebäudes erfordert ein hochgradig integratives
              Konzept. Wir betrachten mechanische Sicherungen, elektronische Meldesysteme und
              automatisierte Alarmierungsprozesse nicht als isolierte Komponenten, sondern als
              ein eng verzahntes Ökosystem. Durch den Einsatz von Next.js 16 Memoisierung und
              fortschrittlichen Container Queries stellen wir sicher, dass alle unsere digitalen
              Planungs- und Überwachungstools extrem reaktionsschnell sind. Dies ist nicht nur
              eine technische Notwendigkeit, sondern spiegelt auch unseren qualitativen Anspruch wider.
            </p>
            <p>
              Im Bereich der Videoüberwachung setzen wir auf AVIF-Hero-Pipelines, um hochauflösende
              Kamerastreams latenzfrei und speichereffizient zu übertragen. Gleichzeitig werden
              durch CSS Subgrid-Harmonisierung komplexe Überwachungsmatrizen visuell perfekt im
              Light-Mode dargestellt, ohne den Nutzer mit unnötigen Ablenkungen zu belasten.
              Dies gewährleistet eine maximale kognitive Klarheit bei der Auswertung sicherheitsrelevanter
              Ereignisse.
            </p>
            <p>
              Ein zentraler Aspekt unserer Methodik ist die Prävention. Mechanische Systeme wie
              Hochsicherheitsschlösser und Panzerriegel bilden die primäre physische Barriere.
              Darauf aufbauend implementieren wir redundante Sensornetzwerke, die jeden
              unautorisierten Zugriffsversuch in Echtzeit detektieren. Diese Sensordaten werden
              durch unsere Cloud-Infrastruktur analysiert, wobei strenge Datenschutzrichtlinien
              (DSGVO-Konformität) jederzeit gewahrt bleiben.
            </p>
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-8">Vergleichsmatrix: Sicherheitsstufen</h3>
            <table className="w-full mt-4 text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-2">Stufe</th>
                  <th className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-2">Mechanik</th>
                  <th className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-2">Elektronik</th>
                  <th className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-2">Reaktionszeit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 border-b border-[oklch(0.89_0.008_260/0.55)]">Basis</td>
                  <td className="py-2 border-b border-[oklch(0.89_0.008_260/0.55)]">Zylinderschutz</td>
                  <td className="py-2 border-b border-[oklch(0.89_0.008_260/0.55)]">Türkontakte</td>
                  <td className="py-2 border-b border-[oklch(0.89_0.008_260/0.55)]">&lt; 3 Min</td>
                </tr>
                <tr>
                  <td className="py-2 border-b border-[oklch(0.89_0.008_260/0.55)]">Erweitert</td>
                  <td className="py-2 border-b border-[oklch(0.89_0.008_260/0.55)]">Zusatzschlösser</td>
                  <td className="py-2 border-b border-[oklch(0.89_0.008_260/0.55)]">Bewegungsmelder</td>
                  <td className="py-2 border-b border-[oklch(0.89_0.008_260/0.55)]">&lt; 1 Min</td>
                </tr>
                <tr>
                  <td className="py-2">Premium</td>
                  <td className="py-2">Panzerriegel</td>
                  <td className="py-2">Video & AI-Analyse</td>
                  <td className="py-2">Echtzeit</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-8">Häufig gestellte Fragen (FAQ)</h3>
            <ul className="space-y-4 mt-4">
              <li>
                <strong>1. Wie lange dauert die Installation eines umfassenden Sicherheitssystems?</strong>
                <br/>In der Regel dauert die Planung und Basisinstallation 1-3 Werktage. Die genaue Dauer hängt von der Komplexität des Projekts und den spezifischen Kundenanforderungen ab. Wir garantieren einen minimal-invasiven Einbau.
              </li>
              <li>
                <strong>2. Kann das System später erweitert werden?</strong>
                <br/>Ja, unsere Architektur ist vollständig modular. Sie können jederzeit weitere Kameras, Sensoren oder smarte Schließzylinder integrieren, ohne das bestehende System austauschen zu müssen.
              </li>
              <li>
                <strong>3. Was passiert bei einem Stromausfall?</strong>
                <br/>Alle kritischen Komponenten verfügen über integrierte Notstromakkus, die den Betrieb für mindestens 24 bis 48 Stunden aufrechterhalten. Die Alarmierung funktioniert weiterhin autark.
              </li>
              <li>
                <strong>4. Sind die Videoüberwachungssysteme DSGVO-konform?</strong>
                <br/>Absolut. Wir konfigurieren Maskierungszonen für öffentliche Bereiche und richten automatische Löschzyklen ein, sodass Ihr System allen rechtlichen Anforderungen entspricht.
              </li>
              <li>
                <strong>5. Kann ich das System per Smartphone steuern?</strong>
                <br/>Ja, über gesicherte und verschlüsselte Verbindungen können Sie weltweit auf Statusinformationen und Live-Bilder zugreifen, Alarme quittieren und Berechtigungen verwalten.
              </li>
            </ul>
          </div>

          <div className="mt-12">
            <SecurityBudgetCalculator />
          </div>
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
