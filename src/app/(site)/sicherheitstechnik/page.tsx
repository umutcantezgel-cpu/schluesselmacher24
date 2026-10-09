import { ServiceBudgetCalculator } from '@/components/sicherheitstechnik/service-budget-calculator';
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


      {/* Architektonische Methodik (Substantiell > 800 Wörter) */}
      <Section id="architektur-methodik">
        <SectionHeading
          eyebrow="Architektonische Methodik"
          title="Präzision in jedem Schritt: Unsere Sicherheitstechnik-Architektur"
          lead="Wir verstehen Schließtechnik und Sicherheitssysteme nicht als isolierte Produkte, sondern als integrierte architektonische Lösungen, die höchste Ansprüche an Präzision, Zuverlässigkeit und Langlebigkeit erfüllen müssen."
        />

        <div className="mt-8 prose-sm24 max-w-none space-y-6">
          <p className="text-[oklch(0.32_0.02_260)]">
            Die Konzeption und Implementierung moderner Sicherheitstechnik erfordert ein tiefgreifendes Verständnis für mechanische Präzision, elektronische Integration und architektonische Rahmenbedingungen. Unser Architektur-Ansatz basiert auf einer strikten, methodischen Vorgehensweise, die sicherstellt, dass jede von uns geplante und umgesetzte Lösung exakt auf die spezifischen Anforderungen des jeweiligen Objekts abgestimmt ist. Wir lehnen standardisierte &quot;Out-of-the-box&quot;-Lösungen ab, wo maßgeschneiderte Sicherheit gefordert ist. Jeder Auftrag beginnt mit einer detaillierten Analyse der bestehenden Infrastruktur, der Identifikation potenzieller Schwachstellen und der Definition eines klaren, bedarfsorientierten Schutzziels. Die physische und digitale Sicherheit eines Gebäudes verschmelzen zunehmend, was eine ganzheitliche Betrachtungsweise unabdingbar macht. Mechanische Grundsicherungen wie Sicherheitszylinder, Schutzbeschläge und Zusatzschlösser bilden das fundamentale Gerüst, das Einbruchsversuche physikalisch erschwert. Elektronische Systeme, darunter Videoüberwachung, Zutrittskontrolle und Gefahrenmeldeanlagen, ergänzen diesen Schutz durch Detektion, Alarmierung und Protokollierung. Die optimale Symbiose beider Welten ist das Kernstück unserer Sicherheitsphilosophie. Nur durch das präzise Ineinandergreifen von Mechanik und Elektronik entsteht ein lückenloses Sicherheitskonzept, das potenziellen Angreifern keine Schwachstellen bietet.
          </p>

          <h3 className="text-[oklch(0.16_0.02_260)] text-xl font-semibold mt-8">1. Die Phasen unserer Service-Implementierung</h3>
          <p className="text-[oklch(0.32_0.02_260)]">
            Unser Prozess ist in streng definierte Phasen unterteilt, die von der initialen Bestandsaufnahme bis zur finalen Abnahme und Dokumentation reichen. Jede Phase unterliegt strengen Qualitätskontrollen und wird von zertifizierten Fachkräften durchgeführt, um ein Höchstmaß an Sicherheit und Zuverlässigkeit zu gewährleisten.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[oklch(0.32_0.02_260)]">
            <li><strong>Initiierung und Bedarfsanalyse:</strong> Im ersten Schritt erfassen wir nicht nur die offensichtlichen Anforderungen, sondern analysieren auch die verborgenen Risikofaktoren. Dies beinhaltet die Bewertung von Türbeschaffenheiten, Zylindermaßen, elektronischen Schnittstellen und den allgemeinen architektonischen Gegebenheiten vor Ort. Eine detaillierte Schwachstellenanalyse deckt potenzielle Einfallstore auf und bildet die Grundlage für die weiteren Planungsschritte. Wir prüfen Umgebungsfaktoren, Zugangswege und die bestehende Sicherheitsinfrastruktur, um ein umfassendes Risikoprofil zu erstellen.</li>
            <li><strong>Projektierung und Lösungsdesign:</strong> Basierend auf der Analyse entwickeln wir ein fundiertes Konzept. Bei Schließanlagen bedeutet dies die Erstellung präziser Schließpläne unter Berücksichtigung komplexer Hierarchien und Zutrittsberechtigungen. Bei elektronischen Systemen planen wir die Vernetzung, Stromversorgung und Integration in bestehende IT- oder Smart-Home-Umgebungen. Die Auswahl der geeigneten Komponenten erfolgt unter Berücksichtigung von Sicherheitsklassen, Zertifizierungen und den spezifischen Anforderungen des Kunden. Ein detailliertes Pflichtenheft definiert die zu erbringenden Leistungen und dient als verbindliche Grundlage für die Umsetzung.</li>
            <li><strong>Präzise Fertigung und Vorkonfiguration:</strong> Bevor wir vor Ort tätig werden, bereiten wir alle Komponenten in unserer Fachwerkstatt vor. Zylinder werden nach Maß gefertigt, Transponder codiert und elektronische Komponenten vorab getestet, um die Ausfallzeiten vor Ort auf ein absolutes Minimum zu reduzieren. Durch die Vorkonfiguration und intensive Qualitätskontrolle in unserer Werkstatt minimieren wir das Risiko von Fehlfunktionen während der Installation und gewährleisten eine reibungslose Inbetriebnahme.</li>
            <li><strong>Fachgerechte Montage und Integration:</strong> Unsere Techniker installieren die Systeme mit höchster handwerklicher Präzision. Dies umfasst die fachgerechte Montage mechanischer Sicherungen ebenso wie die Verkabelung und Inbetriebnahme komplexer elektronischer Anlagen, stets unter Einhaltung geltender Normen und Sicherheitsrichtlinien (z.B. DIN 18252 für Profilzylinder, DIN EN 1303). Die Integration elektronischer Komponenten in bestehende Netzwerke erfolgt unter Berücksichtigung strengster IT-Sicherheitsstandards, um Cyberangriffe und Manipulationen auszuschließen.</li>
            <li><strong>Dokumentation und Systemübergabe:</strong> Jedes Projekt schließt mit einer umfassenden Dokumentation ab. Sie erhalten Sicherungskarten, detaillierte Schließpläne, Bedienungsanleitungen und Protokolle, die eine lückenlose Nachvollziehbarkeit und zukünftige Erweiterbarkeit garantieren. Eine ausführliche Einweisung in die Bedienung der Systeme stellt sicher, dass Sie und Ihre Mitarbeiter die Sicherheitstechnik effektiv und fehlerfrei nutzen können.</li>
          </ul>

          <h3 className="text-[oklch(0.16_0.02_260)] text-xl font-semibold mt-8">2. Technologische Standards und Materialqualität</h3>
          <p className="text-[oklch(0.32_0.02_260)]">
            Welche Produkte wir einsetzen, richtet sich nach Tür, Schutzziel und Budget. Entscheidend sind mechanische Stabilität, Schutz gegen Manipulation und eine lange Nutzungsdauer — die konkrete Auswahl stimmen wir mit Ihnen im Angebot ab. Die Langlebigkeit und Zuverlässigkeit eines Sicherheitssystems hängen maßgeblich von der Qualität der verwendeten Materialien und Komponenten ab. Daher setzen wir ausschließlich auf Produkte renommierter Hersteller, die strengen Qualitätskontrollen unterliegen und aktuelle Zertifizierungen aufweisen.
          </p>
          <p className="text-[oklch(0.32_0.02_260)]">
            Bei mechanischen Zylindern achten wir auf Merkmale wie Bohr- und Ziehschutz, patentierte Schlüsselprofile (um illegale Kopien zu verhindern) und modulare Bauweisen, die nachträgliche Längenanpassungen ermöglichen. Hochwertige Materialien wie gehärteter Stahl und verschleißfeste Legierungen gewährleisten eine hohe Widerstandsfähigkeit gegen mechanische Angriffe wie Aufbohren, Ziehen oder Schlagen. Im Bereich der Elektronik empfehlen wir Systeme mit verschlüsselter Kommunikation (z.B. MIFARE DESFire EV2/EV3, Bluetooth Low Energy mit AES-128-Verschlüsselung) und ausfallsichere Systeme, die auch bei Stromausfall eine definierte Grundsicherheit gewährleisten. Die nahtlose Verzahnung von Mechanik und Elektronik (Mechatronik) bildet oft den Kern unserer fortschrittlichsten Lösungen. Mechatronische Zylinder kombinieren die hohe mechanische Sicherheit eines Profilzylinders mit der Flexibilität und Kontrolle eines elektronischen Zutrittskontrollsystems.
          </p>

          <h3 className="text-[oklch(0.16_0.02_260)] text-xl font-semibold mt-8">3. Nachhaltigkeit und Lebenszyklus-Management</h3>
          <p className="text-[oklch(0.32_0.02_260)]">
            Eine professionelle Sicherheitslösung ist eine langfristige Investition. Daher legen wir großen Wert auf das Lebenszyklus-Management der von uns betreuten Systeme. Dies beginnt bereits bei der Planung durch die Wahl skalierbarer und modularer Architekturen. Wenn sich Ihre Anforderungen ändern – sei es durch räumliche Erweiterungen, organisatorische Umstrukturierungen oder veränderte Bedrohungslagen – lassen sich unsere Systeme effizient anpassen. Ein modulares Design ermöglicht den Austausch einzelner Komponenten, ohne das gesamte System erneuern zu müssen, was Ressourcen schont und Kosten senkt.
          </p>
          <p className="text-[oklch(0.32_0.02_260)]">
            Darüber hinaus bieten wir strukturierte Wartungskonzepte an. Regelmäßige Inspektionen, Software-Updates für elektronische Komponenten und die präventive Wartung hochbeanspruchter mechanischer Teile stellen sicher, dass das Sicherheitsniveau über Jahre hinweg konstant hoch bleibt und kostspielige Totalausfälle vermieden werden. Eine kontinuierliche Überwachung und Wartung verlängert die Lebensdauer der Sicherheitstechnik und gewährleistet eine optimale Funktion im Ernstfall.
          </p>

          <h3 className="text-[oklch(0.16_0.02_260)] text-xl font-semibold mt-8">4. Gewerbeobjekte und öffentliche Einrichtungen</h3>
          <p className="text-[oklch(0.32_0.02_260)]">
            Neben Privatkunden betreuen wir Gewerbeobjekte, Hausverwaltungen und öffentliche Einrichtungen. Dort gelten oft zusätzliche Vorgaben und abgestimmte organisatorische Abläufe, die wir vor der Planung gemeinsam mit Ihnen klären. Die Komplexität sicherheitstechnischer Anforderungen in gewerblichen und öffentlichen Objekten erfordert ein hohes Maß an Fachwissen und Erfahrung. Wir berücksichtigen spezifische Anforderungen wie Fluchtwegsicherung, Brandschutz, Zutrittskontrolle für unterschiedliche Nutzergruppen und die Integration in übergeordnete Gebäudeleitsysteme.
          </p>
          <p className="text-[oklch(0.32_0.02_260)]">
            Wir verstehen die Herausforderungen von Fluchtwegsteuerung (gemäß DIN EN 179 und DIN EN 1125), Brandschutzvorgaben und die Integration von Zutrittskontrollsystemen in übergeordnete Gebäudeleittechnik. Für den gewerblichen Bereich planen wir Lösungen so, dass sie mit weiteren Türen, Nutzern und Standorten mitwachsen können. Ein durchdachtes Sicherheitskonzept für Unternehmen berücksichtigt nicht nur den Schutz von Werten und Informationen, sondern auch die Sicherheit und den reibungslosen Ablauf für Mitarbeiter und Besucher. Die Integration verschiedener Gewerke, wie Zutrittskontrolle, Videoüberwachung und Einbruchmeldetechnik, zu einem zentral steuerbaren Gesamtsystem ermöglicht ein effizientes Sicherheitsmanagement.
          </p>
          <h3 className="text-[oklch(0.16_0.02_260)] text-xl font-semibold mt-8">5. Detaillierter FAQ-Bereich zur Sicherheitstechnik</h3>
          <div className="space-y-4">
            <details className="group border-b border-border pb-4">
              <summary className="cursor-pointer font-bold text-[oklch(0.16_0.02_260)]">Welche Vorteile bietet ein elektronisches Zutrittskontrollsystem gegenüber einer mechanischen Schließanlage?</summary>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">Elektronische Systeme bieten eine wesentlich höhere Flexibilität. Berechtigungen können zentral verwaltet, bei Schlüsselverlust (Transponder) sofort gesperrt und zeitlich befristet werden. Zudem ermöglichen sie eine lückenlose Protokollierung von Zutrittsereignissen und lassen sich oft in andere Systeme wie Zeiterfassung oder Gefahrenmeldetechnik integrieren.</p>
            </details>
            <details className="group border-b border-border pb-4">
              <summary className="cursor-pointer font-bold text-[oklch(0.16_0.02_260)]">Wie oft sollte eine Sicherheitstechnikanlage gewartet werden?</summary>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">Die Wartungsintervalle hängen von der Art der Anlage und der Intensität der Nutzung ab. Generell empfehlen wir eine jährliche Inspektion, bei hochfrequentierten Zugängen oder komplexen elektronischen Systemen können auch halbjährliche Wartungen sinnvoll sein, um Ausfälle präventiv zu vermeiden und die Funktionstüchtigkeit sicherzustellen.</p>
            </details>
            <details className="group border-b border-border pb-4">
              <summary className="cursor-pointer font-bold text-[oklch(0.16_0.02_260)]">Sind Ihre elektronischen Systeme gegen Hacking und Manipulation geschützt?</summary>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">Ja, wir setzen auf modernste Verschlüsselungstechnologien (wie AES-128 oder höher) für die Datenübertragung und Speicherung. Regelmäßige Firmware-Updates schließen potenzielle Sicherheitslücken. Zudem achten wir auf physische Manipulationssicherheit der Komponenten, um Sabotageversuche zu verhindern.</p>
            </details>
            <details className="group border-b border-border pb-4">
              <summary className="cursor-pointer font-bold text-[oklch(0.16_0.02_260)]">Können bestehende mechanische Schließanlagen mit elektronischen Komponenten nachgerüstet werden?</summary>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">In vielen Fällen ist eine Nachrüstung möglich (Mechatronik). Mechatronische Zylinder lassen sich oft in bestehende Einsteckschlösser integrieren, wodurch der Installationsaufwand minimiert wird. Wir prüfen die Gegebenheiten vor Ort und beraten Sie zu den optimalen Nachrüstmöglichkeiten für Ihr spezifisches System.</p>
            </details>
            <details className="group border-b border-border pb-4">
              <summary className="cursor-pointer font-bold text-[oklch(0.16_0.02_260)]">Was passiert bei einem Stromausfall mit meiner elektronischen Zutrittskontrolle?</summary>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">Elektronische Zutrittskontrollsysteme sind in der Regel mit Notstromakkus ausgestattet, die eine Funktion für eine definierte Zeitdauer (oft mehrere Stunden) aufrechterhalten. Zudem lassen sich Fail-Safe oder Fail-Secure Szenarien programmieren, die festlegen, ob Türen bei absolutem Energieverlust automatisch entriegeln (Fluchtweg) oder verriegelt bleiben (Hochsicherheit).</p>
            </details>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Budgetplanung"
          title="Kalkulieren Sie Ihr Sicherheitstechnik-Budget"
          lead="Nutzen Sie unseren interaktiven Rechner, um einen Richtwert für Ihr Projekt zu erhalten."
        />
        <div className="mt-8 max-w-3xl">
          <ServiceBudgetCalculator />
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
