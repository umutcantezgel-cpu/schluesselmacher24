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
import { SecurityBudgetCalculator } from '@/components/calculator/security-budget-calculator';
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


      {/* Fachliche Methodik & Tiefgreifende Expertise */}
      <Section tight>
        <div className="mx-auto max-w-4xl space-y-8">
          <SectionHeading
            eyebrow="Architektonische Methodik"
            title="Sicherheitstechnik als holistisches Ökosystem"
            lead="Die Absicherung eines Objekts ist niemals ein isoliertes Gewerk, sondern eine hochgradig orchestrierte Kombination aus präventiver Mechanik, intelligenter Sensorik und reaktiver Alarmierung."
          />
          <div className="prose prose-lg text-[oklch(0.32_0.02_260)] prose-headings:text-[oklch(0.16_0.02_260)] prose-headings:font-bold">
            <p>
              Moderne Sicherheitstechnik basiert auf dem Prinzip der konzentrischen Verteidigungsringe (Zwiebelschalenprinzip).
              Dieses aus der Hochsicherheitsarchitektur stammende Konzept zielt darauf ab, potenzielle Eindringlinge durch
              mehrere, voneinander unabhängige Barrieren zu verzögern, zu detektieren und letztendlich abzuwehren.
              Die äußere Schale bildet dabei die Perimetersicherung, gefolgt von der Außenhautsicherung des Gebäudes
              und schließlich der inneren Raum- und Objektsicherung.
            </p>
            <h3>Die Rolle der Physischen Verzögerung (Mechanik)</h3>
            <p>
              Der fundamentale Irrtum vieler Sicherheitskonzepte liegt in der Überbewertung der Elektronik bei
              gleichzeitiger Vernachlässigung der Mechanik. Eine Alarmanlage verhindert keinen Einbruch – sie meldet ihn lediglich.
              Die Zeitverzögerung (Widerstandszeit), die ein Täter benötigt, um mechanische Barrieren wie RC3-zertifizierte
              Türen, Pilzkopfverriegelungen an Fenstern oder Hochsicherheitszylinder zu überwinden, ist der entscheidende Faktor.
              Diese mechanische Widerstandszeit muss zwingend größer sein als die Interventionszeit der alarmierten Hilfskräfte
              (Polizei, Wachdienst).
            </p>
            <h3>Detektion und Verifikation (Elektronik & Video)</h3>
            <p>
              Die elektronische Meldetechnik hat die primäre Aufgabe, unbefugte Eindringversuche in dem Moment zu detektieren,
              in dem die mechanische Barriere angegriffen wird (Vorfeldeinbindung). Dies geschieht durch Körperschallmelder,
              Magnetkontakte oder seismische Sensoren. Die nachfolgende Verifikation des Alarms wird zunehmend durch
              intelligente Videosysteme (CCTV) mit KI-gestützter Videoanalytik (VCA) übernommen. Diese Algorithmen
              differenzieren zuverlässig zwischen relevanten Bedrohungen (Menschen, Fahrzeuge) und Störgrößen
              (Tiere, Witterung), wodurch die Falschalarmquote (FAR) drastisch reduziert wird.
            </p>
            <h3>Orchestrierung und Alarmierung (Systemintegration)</h3>
            <p>
              Die Konvergenz der verschiedenen Teilsysteme erfolgt in der Gefahrenmeldeanlage (GMA) bzw. Einbruchmeldeanlage (EMA).
              Hier werden alle Zustandsdaten aggregiert, logisch verknüpft und bewertet. Bei einer verifizierten Alarmbedingung
              initiiert das System eine vordefinierte Alarmorganisation. Dies umfasst die lokale Alarmierung (optisch/akustisch)
              zur Täterabschreckung sowie die Fernalarmierung über redundante Übertragungswege (IP/LTE) zu einer zertifizierten
              Notruf- und Serviceleitstelle (NSL).
            </p>
            <h3>Zusammenfassung der Methodik</h3>
            <p>
              Zusammenfassend lässt sich festhalten, dass ein valides Sicherheitskonzept stets die nahtlose Integration von
              mechanischer Robustheit, präziser elektronischer Detektion und proaktiver Alarmorganisation erfordert.
              Nur durch diese synergetische Verzahnung entsteht ein Resilienzniveau, das heutigen und zukünftigen
              Bedrohungsszenarien adäquat begegnen kann.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Tiefenanalyse"
            title="Systemarchitekturen im direkten Vergleich"
            lead="Eine transparente Gegenüberstellung der etablierten Sicherheitsstandards und deren spezifische Leistungsprofile."
          />
          <div className="mt-8 overflow-hidden rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] shadow-sm">
            <table className="w-full text-left text-sm text-[oklch(0.32_0.02_260)]">
              <thead className="bg-[oklch(0.968_0.004_260)] font-semibold text-[oklch(0.16_0.02_260)]">
                <tr>
                  <th className="border-b border-[oklch(0.89_0.008_260/0.55)] px-6 py-4">Systemklasse</th>
                  <th className="border-b border-[oklch(0.89_0.008_260/0.55)] px-6 py-4">Fokus</th>
                  <th className="border-b border-[oklch(0.89_0.008_260/0.55)] px-6 py-4">Typische Latenz</th>
                  <th className="border-b border-[oklch(0.89_0.008_260/0.55)] px-6 py-4">Widerstandszeit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
                <tr>
                  <td className="px-6 py-4 font-medium text-[oklch(0.16_0.02_260)]">Rein Mechanisch (RC2/RC3)</td>
                  <td className="px-6 py-4">Physische Barriere</td>
                  <td className="px-6 py-4">Keine Detektion</td>
                  <td className="px-6 py-4">3 - 5 Minuten</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-[oklch(0.16_0.02_260)]">Hybrides Basis-System</td>
                  <td className="px-6 py-4">Mechanik + Außenhaut</td>
                  <td className="px-6 py-4">&lt; 2 Sekunden</td>
                  <td className="px-6 py-4">5+ Minuten</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-[oklch(0.16_0.02_260)]">Smart Security (KI-Video)</td>
                  <td className="px-6 py-4">Präventive Detektion</td>
                  <td className="px-6 py-4">Echtzeit (Vorfeld)</td>
                  <td className="px-6 py-4">Systemabhängig</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-4xl space-y-8">
          <SectionHeading
            eyebrow="Kalkulation"
            title="Interaktive Budgetplanung"
            lead="Nutzen Sie unseren Kalkulator, um eine realistische Einschätzung der Investitionssumme für Ihr spezifisches Sicherheitskonzept zu erhalten."
          />
          <div className="mt-8">
            <SecurityBudgetCalculator />
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <div className="mx-auto max-w-4xl space-y-8">
          <SectionHeading
            eyebrow="Wissensdatenbank"
            title="Häufig gestellte Fragen (FAQ)"
            lead="Fachliche Antworten auf die wichtigsten Fragen rund um die Planung und Installation komplexer Sicherheitstechnik."
          />
          <div className="mt-6 space-y-4">
            {[
              { q: 'Welche Zertifizierungen sind für Einbruchmeldeanlagen (EMA) relevant?', a: 'In Deutschland ist die VdS-Anerkennung (Vertrauen durch Sicherheit) der maßgebliche Standard. Anlagen werden je nach Gefährdungsgrad in die Klassen A, B oder C eingeteilt. Auch die europäische Norm EN 50131 (Grade 1-4) ist ein wichtiges Qualitätskriterium. Für die Förderfähigkeit (z.B. durch die KfW) ist mindestens eine Anlage nach EN 50131 Grad 2 erforderlich, die von einem zertifizierten Fachbetrieb installiert wurde.' },
              { q: 'Was ist der Unterschied zwischen Außenhautsicherung und Fallenüberwachung?', a: 'Die Außenhautsicherung (Peripherieschutz) detektiert Eindringversuche bereits an der Gebäudehülle, z.B. durch Öffnungsmelder an Fenstern und Türen oder Glasbruchsensoren. Ein Alarm wird ausgelöst, bevor der Täter im Gebäude ist. Die Fallenüberwachung (Raumschutz) nutzt Bewegungsmelder im Gebäudeinneren. Sie schlägt erst an, wenn sich der Täter bereits im Raum befindet. Ein gutes Konzept kombiniert beide Ansätze.' },
              { q: 'Können bestehende mechanische Schließanlagen in smarte Systeme integriert werden?', a: 'Ja, das ist ein häufiges Szenario in der Migrationstechnik (Retrofitting). Vorhandene mechanische Schließzylinder können oft durch mechatronische Zylinder oder smarte Beschläge ersetzt werden, ohne die Türmechanik grundlegend ändern zu müssen. Diese Systeme lassen sich dann in die übergeordnete Gefahrenmeldeanlage integrieren.' },
              { q: 'Wie ausfallsicher sind moderne IP-basierte Alarmsysteme?', a: 'Professionelle Systeme verfügen über eine redundante Alarmübertragungseinrichtung (AWUG). Fällt die primäre IP-Verbindung (Breitband-Internet) aus, schaltet das System nahtlos auf einen sekundären Übertragungsweg um, typischerweise über das Mobilfunknetz (LTE/4G). Zudem stellen Notstromakkus den Betrieb bei Stromausfall für mindestens 12 bis 60 Stunden sicher (je nach VdS-Klasse).' },
              { q: 'Wie funktioniert die KI-gestützte Videoanalytik?', a: 'Moderne Kameras nutzen Deep-Learning-Algorithmen (wie CNNs), um Pixelveränderungen nicht nur als Bewegung zu registrieren, sondern Objekte zu klassifizieren. Die KI kann unterscheiden, ob eine Bewegung von einem Menschen, einem Fahrzeug oder einem wehenden Baum verursacht wird. Dies ermöglicht das Setzen virtueller Stolperdrähte (Line Crossing) oder Überwachungszonen (Intrusion Detection), bei deren Verletzung gezielt Alarm ausgelöst wird.' }
            ].map((faq, i) => (
              <div key={i} className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5">
                <h4 className="text-[15px] font-bold text-[oklch(0.16_0.02_260)]">{faq.q}</h4>
                <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

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
    </main>
  );
}
