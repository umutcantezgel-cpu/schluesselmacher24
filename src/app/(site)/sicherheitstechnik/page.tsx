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
import { SecurityBudgetCalculator } from '@/components/calculator/security-budget-calculator';

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

const SERVICE_ICONS: Record<string, typeof ShieldCheck> = {
  videoueberwachung: Camera,
  alarmtechnik: Siren,
  aussenhautsicherung: ShieldCheck,
  'mechanischer-schutz': Lock,
  'smarte-funktionen': Smartphone,
  'panik-und-alarmtaster': BellRing,
  'kombinierte-konzepte': Layers,
};

const PRINCIPLE = [
  {
    term: 'Mechanik hält auf',
    body:
      'Zylinder, Schlösser, Beschläge und Zusatzsicherungen kosten Zeit und Kraft. Ohne diesen '
      + 'Grundschutz meldet jede Elektronik nur, dass bereits etwas passiert ist. Unsere mechanischen '
      + 'Grundschutzmaßnahmen bilden das Fundament jeder durchdachten Sicherheitsarchitektur. Wir analysieren '
      + 'Schwachstellen an Türen und Fenstern und verstärken diese systematisch. Dies umfasst den Einsatz von '
      + 'Sicherheitszylindern nach DIN EN 1303, Panzerriegeln, Stangenschlössern und Scharnierseitensicherungen.',
    href: '/tuer-und-schliesstechnik',
    linkLabel: 'Zur Tür- und Schließtechnik',
  },
  {
    term: 'Meldetechnik erkennt',
    body:
      'Melder, Kontakte und Kameras erkennen, dass an einer Stelle etwas geschieht — an der Tür, '
      + 'am Fenster, an der Scheibe oder im Raum. Ein hochsensibles Netzwerk aus Sensoren erfasst dabei '
      + 'jede Abweichung vom Normalzustand. Glasbruchmelder, Bewegungsmelder und Magnetkontakte arbeiten '
      + 'zusammen, um frühzeitig Einbruchsversuche zu identifizieren, noch bevor der Täter in das Objekt '
      + 'eindringt.',
    href: `/${ROUTE}/alarmtechnik`,
    linkLabel: 'Zur Alarmtechnik',
  },
  {
    term: 'Alarmierung informiert',
    body:
      'Signalgeber und Benachrichtigungen bringen die Information dorthin, wo jemand darauf '
      + 'reagieren kann. Der Weg wird vorab festgelegt. Optische und akustische Signalgeber im Außenbereich '
      + 'schrecken Täter ab und alarmieren die Nachbarschaft. Gleichzeitig erfolgt eine stille Alarmierung '
      + 'auf mobile Endgeräte oder an eine zertifizierte Notruf- und Serviceleitstelle (NSL).',
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

      <Section tone="muted">
        <SectionHeading
          eyebrow="Architektonische Methodik"
          title="Eine tiefgehende Analyse der Sicherheitsarchitektur"
          lead="Sicherheit ist kein Zustand, sondern ein kontinuierlicher Prozess der Risikoanalyse, Konzeptionierung und technologischen Umsetzung."
        />
        <div className="mt-8 space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed max-w-4xl">
          <p>
            In der modernen Sicherheitsarchitektur reicht es längst nicht mehr aus, einzelne Komponenten isoliert voneinander zu betrachten. Die zunehmende Komplexität von Bedrohungsszenarien erfordert ganzheitliche Lösungsansätze, die mechanischen Einbruchschutz, elektronische Überwachungstechnik und reaktive Alarmierungssysteme nahtlos ineinandergreifen lassen. Wir verfolgen bei der Konzeption von Sicherheitstechnik einen streng methodischen Ansatz, der auf präziser Bestandsaufnahme und Risikoanalyse basiert.
          </p>
          <p>
            Im ersten Schritt erfolgt stets eine detaillierte Schwachstellenanalyse des Objekts. Dabei bewerten wir die vorhandene Bausubstanz, die Lage des Gebäudes sowie spezifische Risikofaktoren. Ein besonderes Augenmerk liegt auf den primären Angriffszielen wie Eingangstüren, ebenerdigen Fenstern, Kellerschächten und Nebeneingängen. Die mechanische Sicherung bildet dabei immer die primäre Barriere. Einbrecher arbeiten unter enormem Zeitdruck; jede Sekunde, die eine physische Barriere standhält, erhöht das Entdeckungsrisiko signifikant und führt in den meisten Fällen zum Abbruch des Vorhabens.
          </p>
          <p>
            Darauf aufbauend konzipieren wir die elektronische Detektions- und Meldetechnik. Moderne Gefahrenmeldeanlagen (GMA) fungieren als das neuronale Netzwerk des Sicherheitssystems. Sensoren an Türen und Fenstern überwachen die Gebäudehülle (Außenhautsicherung), während passive Infrarotmelder (PIR) und Dual-Melder die Innenräume absichern. Die Integration von intelligenter Videoüberwachung ermöglicht zudem eine sofortige Verifikation von Alarmen. Durch den Einsatz von KI-basierter Videoanalytik lassen sich Fehlalarme drastisch reduzieren, da das System zuverlässig zwischen menschlichen Eindringlingen, Tieren und witterungsbedingten Bewegungen unterscheiden kann.
          </p>
          <p>
            Die Alarmierungskette stellt das finale Glied in der Sicherheitsarchitektur dar. Eine laute örtliche Alarmierung durch Außensirenen und Blitzleuchten dient der unmittelbaren Abschreckung. Parallel dazu erfolgt die stille Fernalarmierung. Hierbei werden detaillierte Alarmprotokolle via redundanter Übertragungswege (IP, GSM/LTE) an eine VdS-anerkannte Notruf- und Serviceleitstelle (NSL) übermittelt, welche umgehend die vorher definierten Interventionsmaßnahmen einleitet. Nur durch dieses perfekt orchestrierte Zusammenspiel von Mechanik, Elektronik und personeller Intervention lässt sich ein Höchstmaß an Sicherheit garantieren.
          </p>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Interaktive Bedarfsanalyse"
          title="Kalkulieren Sie Ihr Sicherheitskonzept"
          lead="Nutzen Sie unseren Konfigurator, um eine erste Einschätzung für die Absicherung Ihres Objekts zu erhalten. Die finale Planung erfolgt nach einer detaillierten Vor-Ort-Analyse."
        />
        <div className="mt-8 max-w-2xl">
          <SecurityBudgetCalculator />
        </div>
      </Section>

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
                  className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary motion-reduce:transition-none"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon size={19} aria-hidden />
                  </span>
                  <span className="mt-4 block text-[15px] font-bold text-foreground group-hover:text-primary motion-reduce:transition-none">
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
                      className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Fachspezifische Fragen und Antworten"
          title="Tiefgehende Antworten auf komplexe Sicherheitsfragen"
          lead="Klären Sie technische Details und konzeptionelle Besonderheiten vor der Beauftragung."
        />
        <div className="mt-8 space-y-6 max-w-3xl">
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">Warum ist eine reine elektronische Überwachung ohne mechanischen Grundschutz unzureichend?</h3>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed text-sm">
              Elektronische Alarmsysteme sind essenziell für die Detektion und Meldung eines Einbruchs. Sie bieten jedoch keinen physischen Widerstand. Wenn Türen und Fenster über keinen ausreichenden Einbruchschutz (etwa Widerstandsklasse RC2 oder RC3) verfügen, können Täter in Sekundenschnelle eindringen. Bis die Sicherheitskräfte eintreffen, ist der Einbruch meist bereits vollzogen. Der mechanische Grundschutz ist daher zwingend erforderlich, um den Täter möglichst lange aufzuhalten und den Zeitgewinn für die Intervention zu maximieren.
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">Wie funktioniert die Absicherung der Gebäudeaußenhaut im Detail?</h3>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed text-sm">
              Die Außenhautsicherung überwacht alle Zugänge (Türen, Fenster, Dachluken) auf Öffnung und Durchbruch. Dies geschieht primär durch Magnetkontakte, die registrieren, wenn ein Fensterrahmen vom Flügel getrennt wird, sowie durch aktive Glasbruchmelder. Der große Vorteil dieser Methode liegt darin, dass Sie sich frei im Gebäude bewegen können, während die Außenhülle scharfgeschaltet ist – ein essenzielles Feature für den Schutz während der Anwesenheit (Nachtsicherung).
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">Was versteht man unter einer redundanten Alarmübertragung?</h3>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed text-sm">
              Eine Alarmübertragung darf niemals auf nur einem Kommunikationsweg basieren. Bei einem Strom- oder Internetausfall wäre das System andernfalls isoliert. Professionelle Anlagen verfügen über ein primäres Übertragungsgerät (meist IP-basiert) und einen sekundären, unabhängigen Weg (z. B. GSM/LTE). Sollte die Internetverbindung manipuliert werden, schaltet das System verzögerungsfrei auf das Mobilfunknetz um und stellt so die Erreichbarkeit der Notrufleitstelle sicher.
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">Inwiefern lassen sich Smart-Home-Komponenten in professionelle Sicherheitstechnik integrieren?</h3>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed text-sm">
              Zertifizierte Gefahrenmeldeanlagen (VdS-Klassen) sind geschlossene, hochsichere Systeme, die strengen Prüfkriterien unterliegen. Während Consumer-Smart-Home-Lösungen oft anfällig für Cyberangriffe sind, nutzen professionelle Systeme verschlüsselte, proprietäre Funk- oder Busprotokolle. Es ist jedoch möglich, über definierte und abgesicherte Schnittstellen (z. B. KNX-Gateways) Statusmeldungen an ein Smart-Home-System zu übergeben, etwa um bei einem Alarm automatisch die Beleuchtung im gesamten Gebäude einzuschalten.
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">Welche datenschutzrechtlichen Anforderungen bestehen bei Videoüberwachungsanlagen?</h3>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed text-sm">
              Der Einsatz von Kameras unterliegt den strengen Vorgaben der DSGVO und des BDSG. Im privaten Bereich ist sicherzustellen, dass keine öffentlichen Flächen oder Nachbargrundstücke erfasst werden. Bei gewerblichen Objekten muss der Zweck der Überwachung (z. B. Wahrnehmung des Hausrechts) dokumentiert und durch geeignete Hinweisschilder kenntlich gemacht werden. Zudem sind Löschkonzepte zu definieren, die sicherstellen, dass Aufnahmen (sofern sie nicht zur Beweissicherung eines konkreten Vorfalls dienen) nach einer kurzen Frist (oft 48-72 Stunden) automatisiert überschrieben werden.
            </p>
          </div>
        </div>
      </Section>

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

      {page && page.seo.internalLinks.length > 0 && (
        <Section tight>
          <SectionHeading eyebrow="Weiterlesen" title="Passende Seiten" />
          <ul className="mt-6 flex flex-wrap gap-3">
            {page.seo.internalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 text-[14px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary motion-reduce:transition-none"
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
