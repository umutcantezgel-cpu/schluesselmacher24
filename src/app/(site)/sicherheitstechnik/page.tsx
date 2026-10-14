import type { Metadata } from 'next';
import Link from 'next/link';
import { SicherheitstechnikBudgetCalculator } from '@/components/calculator/sicherheitstechnik-budget-calculator';
import { Accordion } from '@/components/ui/accordion';
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
    <>
      <div style={{ display: 'none' }} data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)} />
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


      {/* 800 Word Content Expansion: Deep Dive in Sicherheitstechnik */}
      <Section>
        <SectionHeading
          eyebrow="Architektonische Methodik"
          title="Mechanische vs. Elektronische Sicherheitssysteme: Eine fundamentale Gegenüberstellung"
          lead="Der Schlüssel zu einer wirksamen Gebäudeabsicherung liegt in der synergetischen Verschmelzung von Mechanik und Elektronik. Doch was unterscheidet diese beiden Disziplinen und wie ergänzen sie sich in der Praxis?"
        />

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <div className="space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
            <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">Die unerschütterliche Basis: Mechanische Sicherheit</h3>
            <p>
              Mechanische Sicherheitssysteme bilden das physische Fundament jedes Sicherheitskonzepts. Sie sind die erste und wichtigste Barriere gegen unbefugtes Eindringen. Ein hochwertiger Schließzylinder, massive Sicherheitsbeschläge und robuste Zusatzschlösser leisten aktiven Widerstand gegen Aufbruchsversuche. Die physikalische Kraft, die ein Täter aufwenden muss, gepaart mit dem benötigten Werkzeug und der Zeit, wirkt hochgradig abschreckend.
            </p>
            <p>
              Die primäre Funktion der Mechanik ist es, den Zeitaufwand für einen Einbruch signifikant zu erhöhen. Statistiken belegen, dass die meisten Täter aufgeben, wenn sie nicht innerhalb von wenigen Minuten in ein Gebäude eindringen können. Daher investieren wir bei SCHLÜSSELMACHER24 vorrangig in erstklassige mechanische Komponenten, bevor wir elektronische Systeme implementieren. Zertifizierte Sicherheitstüren, Querriegel und Fensterzusatzsicherungen nach DIN-Normen sind das Rückgrat Ihrer Sicherheit. Sie funktionieren stromunabhängig, wartungsarm und absolut zuverlässig unter allen Bedingungen.
            </p>
          </div>
          <div className="space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
            <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">Die intelligente Erweiterung: Elektronische Systeme</h3>
            <p>
              Während die Mechanik den Einbruchsversuch physisch aufhält, übernimmt die Elektronik die Erkennung, Dokumentation und Alarmierung. Elektronische Sicherheitstechnik – wie Alarmanlagen, Videoüberwachung und elektronische Zutrittskontrollen – bietet eine aktive Rückmeldung über den Sicherheitsstatus Ihres Objekts. Sie detektiert Bewegungen, Glasbruch oder unbefugte Öffnungen sofort und kann in Echtzeit Sicherheitsdienste oder Sie persönlich informieren.
            </p>
            <p>
              Der wahre Wert elektronischer Systeme liegt in ihrer präventiven und reaktiven Fähigkeit. Sichtbare Kameras und Sirenen schrecken potenzielle Täter bereits im Vorfeld ab. Im Ernstfall ermöglichen vernetzte Systeme eine schnelle Intervention und liefern gerichtsverwertbare Beweismittel. Elektronische Zutrittslösungen erlauben zudem ein flexibles Rechtemanagement: Schlüsselverluste bedeuten keinen teuren Zylindertausch mehr, sondern lediglich das Sperren eines Transponders per Software. Die Kombination aus mechanischem Widerstand und elektronischer Intelligenz schafft ein lückenloses Sicherheitsnetz.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Innovation"
              title="Moderne Alarmanlagen und Videoüberwachung"
              lead="Technologischer Fortschritt für maximale Transparenz und Kontrolle über Ihr Eigentum."
            />
            <div className="mt-6 space-y-4 text-[oklch(0.32_0.02_260)] leading-relaxed">
              <p>
                Heutige Gefahrenmeldeanlagen sind hochkomplexe Netzwerke aus Sensoren, die kontinuierlich den Zustand Ihres Gebäudes überwachen. Die klassische &quot;Alarmanlage&quot; hat sich zu einem intelligenten Gebäude-Monitoring-System entwickelt. Hochauflösende IP-Kameras mit Infrarot-Nachtsicht und KI-gestützter Objekterkennung können heute zwischen Menschen, Tieren und Fahrzeugen unterscheiden. Dies minimiert Fehlalarme drastisch und stellt sicher, dass Sie nur bei echten Bedrohungen benachrichtigt werden.
              </p>
              <p>
                Videoüberwachungssysteme dienen nicht nur der Nachverfolgung von Vorfällen, sondern auch der Prozessoptimierung in gewerblichen Umfeldern. Die DSGVO-konforme Implementierung, bei der Datenschutzbereiche geschwärzt und Speicherdauern automatisiert geregelt werden, ist dabei für uns von höchster Priorität. Unsere Systeme lassen sich nahtlos in bestehende IT-Infrastrukturen integrieren und bieten verschlüsselte Remote-Zugriffe für berechtigte Personen.
              </p>
            </div>
          </div>
          <div>
             <SicherheitstechnikBudgetCalculator />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Zukunftssicherheit"
          title="Nahtlose Integration in Smart Home und Building Management Systeme"
          lead="Sicherheit als integraler Bestandteil moderner Gebäudeautomation."
        />
        <div className="mt-8 max-w-4xl space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
          <p>
            In der Ära der Digitalisierung darf Sicherheitstechnik keine Insellösung mehr sein. Die Integration in Smart Home-Systeme (für den privaten Bereich) oder Building Management Systeme (BMS, für gewerbliche Immobilien) bietet signifikante Komfort- und Sicherheitsgewinne. Ein vernetztes System ermöglicht komplexe Wenn-Dann-Szenarien: Im Falle eines Brandalarms fahren beispielsweise automatisch die Rollläden hoch, die Fluchtwege werden beleuchtet und die Schließanlagen entriegeln alle relevanten Türen.
          </p>
          <p>
            Umgekehrt führt die Aktivierung der Alarmanlage beim Verlassen des Hauses zur automatischen Abschaltung unnötiger Verbraucher und zur Absenkung der Heiztemperatur. Diese Symbiose aus Sicherheit und Gebäudeautomation erfordert offene Schnittstellen und sichere Protokolle. Wir setzen auf etablierte Standards (wie KNX, IP-basierte REST-APIs), um sicherzustellen, dass Ihre Investition in Sicherheitstechnik zukunftssicher ist und mit den wachsenden Anforderungen Ihres Gebäudes skalieren kann. Cybersicherheit ist dabei ein elementarer Bestandteil unserer Planung – denn ein vernetztes System ist nur so sicher wie sein schwächstes Glied im Netzwerk.
          </p>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Fachkompetenz"
          title="Häufig gestellte Fragen zur Sicherheitstechnik"
          lead="Detaillierte Antworten auf die wichtigsten Fragen bei der Planung von Sicherheitskonzepten."
        />
        <div className="mt-8 mx-auto max-w-3xl">
          <Accordion
            items={[
              {
                question: 'Reicht eine elektronische Alarmanlage als alleiniger Schutz aus?',
                answer: 'Nein, eine Alarmanlage kann den Einbruch nicht physisch verhindern, sondern nur melden. Sie ersetzt niemals einen soliden mechanischen Grundschutz. Erst wenn Fenster und Türen durch einbruchhemmende Beschläge, Zusatzschlösser und Pilzkopfverriegelungen mechanisch gesichert sind, entfaltet die elektronische Meldetechnik ihre volle Wirkung, indem sie den Täter meldet, während dieser noch an der Mechanik scheitert.'
              },
              {
                question: 'Wie verhält sich elektronische Sicherheitstechnik bei einem Stromausfall?',
                answer: 'Professionelle Gefahrenmeldeanlagen verfügen über eine Notstromversorgung mittels Akkumulatoren. Diese überbrücken Stromausfälle je nach Dimensionierung für 12 bis 48 Stunden. Auch die Alarmübertragung via Mobilfunk (GSM/LTE-Modul) funktioniert in dieser Zeit autonom weiter. Ihre Sicherheit bleibt somit auch bei einem totalen Netzausfall vollumfänglich gewährleistet.'
              },
              {
                question: 'Sind Smart-Home-Sicherheitslösungen aus dem Baumarkt ausreichend?',
                answer: 'Für grundlegende Komfortfunktionen mögen Do-it-yourself-Lösungen genügen. Für einen verlässlichen Einbruchschutz sind sie jedoch oft ungeeignet. Sie verwenden häufig unverschlüsselte Funkprotokolle (Sabotagerisiko durch Jamming), sind nicht nach VdS oder DIN EN 50131 zertifiziert und können im Schadensfall von Versicherungen abgelehnt werden. Eine fachgerechte Projektierung und Installation durch einen zertifizierten Errichter ist unabdingbar.'
              },
              {
                question: 'Was bedeutet die Aufschaltung auf eine Notruf- und Serviceleitstelle (NSL)?',
                answer: 'Bei einer Aufschaltung wird Ihre Alarmanlage direkt mit einer 24/7 besetzten Sicherheitszentrale verbunden. Löst der Alarm aus, verifizieren die Mitarbeiter den Alarm (z. B. durch Videoüberprüfung oder Rückruf) und leiten gemäß einem vereinbarten Maßnahmenplan sofort Interventionen ein – sei es die Entsendung eines privaten Wachdienstes oder die Alarmierung der Polizei. Dies garantiert eine professionelle Reaktion auch dann, wenn Sie selbst nicht erreichbar sind.'
              },
              {
                question: 'Wie oft muss eine Alarmanlage gewartet werden?',
                answer: 'Gemäß der DIN VDE 0833 ist eine jährliche Wartung durch eine Elektrofachkraft vorgeschrieben. Bei Anlagen mit Aufschaltung auf die Polizei oder bei VdS-anerkannten Anlagen können die Intervalle kürzer sein. Bei der Wartung werden die Notstromakkus geprüft, Sensoren auf Funktion getestet und Software-Updates aufgespielt, um die Anlage vor Cyberangriffen zu schützen und Fehlalarme zu minimieren.'
              }
            ]}
          />
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
