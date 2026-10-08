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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resolvedParams = await params;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resolvedSearch = await searchParams;
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


      {/* Fachkompetenz und Methodik */}
      <Section tight>
        <SectionHeading
          eyebrow="Architektur der Sicherheit"
          title="Eine tiefergehende Betrachtung unserer Methodik"
        />

        <div className="mt-8 prose prose-gray max-w-none text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
          <p>
            Moderne Sicherheitstechnik ist weit mehr als die bloße Installation von Kameras und Alarmgebern. Sie ist eine architektonische Meisterleistung, die tiefgreifendes technisches Verständnis, juristische Expertise und ein feines Gespür für die spezifischen Anforderungen eines jeden Objekts erfordert. In einer Welt, in der die Bedrohungsszenarien stetig komplexer werden, reicht ein rudimentärer Schutz schon lange nicht mehr aus. Wir betrachten Sicherheit als ganzheitliches Konzept, bei dem jede Komponente nahtlos in die andere greift.
          </p>
          <p>
            Der Grundpfeiler unserer Philosophie ist die <strong>präventive Risikoarchitektur</strong>. Dies bedeutet, dass wir nicht erst dann reagieren, wenn ein Vorfall bereits eingetreten ist, sondern Schwachstellen proaktiv identifizieren und neutralisieren, bevor sie von potenziellen Angreifern ausgenutzt werden können. Dieser Ansatz erfordert eine detaillierte Analyse der physischen Gegebenheiten Ihres Objekts, von den Zugangswegen über die Gebäudestruktur bis hin zur umliegenden Topografie.
          </p>

          <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8 mb-4">Die Symbiose aus Mechanik und Elektronik</h3>
          <p>
            Ein häufiger Irrtum in der Planung von Sicherheitskonzepten ist die isolierte Betrachtung von mechanischen und elektronischen Systemen. Eine hochmoderne Videoüberwachung nützt wenig, wenn die Eingangstür mit einem simplen Brecheisen innerhalb von Sekunden überwunden werden kann. Umgekehrt bietet selbst der massivste Tresorraum keinen absoluten Schutz, wenn unbefugte Zutritte nicht zuverlässig detektiert und gemeldet werden.
          </p>
          <p>
            Unsere Lösungsansätze basieren auf dem Prinzip der <strong>Zwiebelschalen-Sicherheit</strong> (Defense in Depth). Dies bedeutet, dass wir mehrere voneinander unabhängige Sicherheitsebenen etablieren. Fällt eine Schicht aus oder wird überwunden, greift sofort die nächste. Die äußere Schicht bildet zumeist die Perimeterüberwachung, unterstützt durch robuste mechanische Barrieren. Die nächste Schicht umfasst elektronische Zutrittskontrollsysteme und fortschrittliche Einbruchmeldeanlagen. Die innerste Schicht schließlich konzentriert sich auf den Schutz der sensibelsten Bereiche und Daten.
          </p>

          <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8 mb-4">Technologische Exzellenz in der Praxis</h3>
          <p>
            Wir setzen ausschließlich auf hochqualitative, praxiserprobte Komponenten von führenden Herstellern. Doch die beste Hardware ist nur so gut wie ihre Konfiguration und Integration. Unsere Techniker sind hochspezialisiert und werden kontinuierlich auf die neuesten Systeme und Angriffsmethoden geschult. Wir implementieren komplexe Netzwerke, in denen Kameras, Bewegungsmelder, Zutrittsleser und Alarmsysteme in Echtzeit miteinander kommunizieren.
          </p>
          <p>
            Ein entscheidender Faktor ist dabei die <strong>Datenintegrität und Verschlüsselung</strong>. Die Kommunikation zwischen den einzelnen Komponenten sowie die Übertragung der Daten an Leitstellen oder mobile Endgeräte erfolgt über hochsichere, mehrfach verschlüsselte Kanäle. Wir stellen sicher, dass Ihre Sicherheitssysteme nicht selbst zum Einfallstor für Cyberangriffe werden.
          </p>

          <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8 mb-4">Vergleichsmatrix: Leistungsstufen der Sicherheitstechnik</h3>
          <div className="overflow-x-auto mt-6 mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                  <th className="py-4 font-semibold text-[oklch(0.16_0.02_260)]">Kriterium</th>
                  <th className="py-4 font-semibold text-[oklch(0.16_0.02_260)]">Basis-Schutz</th>
                  <th className="py-4 font-semibold text-[oklch(0.16_0.02_260)]">Premium-Integration</th>
                  <th className="py-4 font-semibold text-[oklch(0.16_0.02_260)]">Enterprise-Architektur</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                  <td className="py-4 font-medium">Reaktionszeit</td>
                  <td className="py-4">Lokal (Sirene)</td>
                  <td className="py-4">Aufschaltung Leitstelle</td>
                  <td className="py-4">Echtzeit-Intervention</td>
                </tr>
                <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                  <td className="py-4 font-medium">Systemintegration</td>
                  <td className="py-4">Isolierte Systeme</td>
                  <td className="py-4">Teilintegriert (Smart Home)</td>
                  <td className="py-4">Vollständige BMS-Integration</td>
                </tr>
                <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                  <td className="py-4 font-medium">Redundanz</td>
                  <td className="py-4">Einfach</td>
                  <td className="py-4">Dual (Strom/Netzwerk)</td>
                  <td className="py-4">Hochverfügbarkeit (N+1)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8 mb-4">Häufig gestellte Fragen (FAQ)</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-[oklch(0.16_0.02_260)]">1. Wie lange dauert die Installation eines umfassenden Systems?</h4>
              <p className="mt-2">Die Dauer hängt stark von der Komplexität und der Größe des Objekts ab. Eine grundlegende Installation kann in 1-2 Tagen abgeschlossen sein, während komplexe Enterprise-Lösungen mit weitreichender Vernetzung mehrere Wochen in Anspruch nehmen können. Die genaue Planung erfolgt im Rahmen des Sicherheitschecks.</p>
            </div>
            <div>
              <h4 className="font-bold text-[oklch(0.16_0.02_260)]">2. Können bestehende mechanische Systeme integriert werden?</h4>
              <p className="mt-2">In den meisten Fällen ja. Wir prüfen Ihre vorhandenen Zylinder, Schlösser und Beschläge auf Kompatibilität und Sicherheitsniveau. Oftmals lassen sich hochwertige mechanische Komponenten nahtlos mit mechatronischen Zylindern und elektronischen Auswerteeinheiten aufrüsten, was eine kosteneffiziente Modernisierung ermöglicht.</p>
            </div>
            <div>
              <h4 className="font-bold text-[oklch(0.16_0.02_260)]">3. Was passiert bei einem Strom- oder Netzwerkausfall?</h4>
              <p className="mt-2">Professionelle Systeme verfügen über Notstromakkus, die den Betrieb über mehrere Stunden, bei Bedarf auch Tage, aufrechterhalten. Die Kommunikation wird über redundante Übertragungswege (z.B. primär LAN, sekundär LTE/5G) sichergestellt. Ein Ausfall der Hauptversorgung führt nicht zu einem Ausfall der Sicherheit.</p>
            </div>
            <div>
              <h4 className="font-bold text-[oklch(0.16_0.02_260)]">4. Wie ist der rechtliche Rahmen bei Videoüberwachung?</h4>
              <p className="mt-2">Der Betrieb von Videoüberwachungsanlagen unterliegt strengen datenschutzrechtlichen Bestimmungen (DSGVO). Öffentliche Bereiche oder Nachbargrundstücke dürfen nicht erfasst werden. Wir beraten Sie hinsichtlich der korrekten Kamerapositionierung, der notwendigen Beschilderung und der rechtskonformen Speicherdauer der Aufzeichnungen.</p>
            </div>
            <div>
              <h4 className="font-bold text-[oklch(0.16_0.02_260)]">5. Welche Wartungsintervalle sind erforderlich?</h4>
              <p className="mt-2">Für einen zuverlässigen Betrieb empfehlen wir eine jährliche Inspektion und Wartung aller Komponenten. Dabei werden Batterien geprüft oder ausgetauscht, Firmware-Updates eingespielt, Kameras gereinigt und die Funktionalität der Sensoren getestet. Für kritische Infrastrukturen können kürzere Intervalle erforderlich sein.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Interactive Module */}
      <Section tight tone="muted">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              eyebrow="Budgetplanung"
              title="Transparenz von Anfang an"
              lead="Nutzen Sie unseren interaktiven Kalkulator, um einen ersten Richtwert für Ihr Sicherheitsprojekt zu erhalten. Die finale Kostenaufstellung erfolgt nach einer detaillierten Vor-Ort-Analyse."
            />
            <ul className="mt-6 space-y-4 text-[15px] text-[oklch(0.32_0.02_260)]">
              <li className="flex gap-3"><ShieldCheck className="text-[oklch(0.52_0.24_260)] shrink-0" size={20} /> Inklusive Hardware-Kalkulation</li>
              <li className="flex gap-3"><ShieldCheck className="text-[oklch(0.52_0.24_260)] shrink-0" size={20} /> Berücksichtigung von Installationsaufwand</li>
              <li className="flex gap-3"><ShieldCheck className="text-[oklch(0.52_0.24_260)] shrink-0" size={20} /> Anpassbar an verschiedene Projektgrößen</li>
            </ul>
          </div>
          <ServiceBudgetCalculator />
        </div>
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
