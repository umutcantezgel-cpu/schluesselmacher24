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


      {/* Fachliche Erweiterung zur architektonischen Methodik der Sicherheitstechnik */}
      <Section tight>
        <SectionHeading
          eyebrow="Architektonische Methodik"
          title="Tiefgehende Analyse und Konzeption"
          lead="Unsere Methodik basiert auf einem strengen, mehrstufigen Ansatz, der über einfache Produktinstallationen hinausgeht."
        />
        <div className="mt-8 prose prose-lg prose-gray max-w-none text-[oklch(0.32_0.02_260)] leading-relaxed">
          <p>
            Die Konzeption und Implementierung moderner Schließ- und Sicherheitstechnik erfordert ein tiefgreifendes Verständnis für mechanische Präzision, elektronische Integration und architektonische Rahmenbedingungen. Unser Service-Ansatz basiert auf einer strikten, methodischen Vorgehensweise, die sicherstellt, dass jede von uns geplante und umgesetzte Lösung exakt auf die spezifischen Anforderungen des jeweiligen Objekts abgestimmt ist.
          </p>
          <p>
            Wir lehnen standardisierte &quot;Out-of-the-box&quot;-Lösungen ab, wo maßgeschneiderte Sicherheit gefordert ist. Jeder Auftrag beginnt mit einer detaillierten Analyse der bestehenden Infrastruktur, der Identifikation potenzieller Schwachstellen und der Definition eines klaren, bedarfsorientierten Schutzziels.
          </p>
          <p>
            Dabei betrachten wir das Gebäude ganzheitlich. Die mechanische Absicherung der Gebäudehülle bildet das unerschütterliche Fundament. Darauf aufbauend implementieren wir elektronische Zutrittskontrollsysteme, die Flexibilität mit höchster Sicherheit vereinen. Moderne Melde- und Überwachungstechnik bildet die sensorische Ebene, die Anomalien detektiert und entsprechende Alarmierungsketten auslöst.
          </p>
          <p>
            Ein zentraler Aspekt unserer Methodik ist die Integration dieser verschiedenen Ebenen zu einem kohärenten System. Ein elektronischer Schließzylinder ist nur so sicher wie die Tür, in die er eingebaut ist. Eine Videoüberwachung ist nur dann effektiv, wenn sie im Einklang mit den geltenden Datenschutzrichtlinien betrieben wird und die aufgezeichneten Daten sicher und manipulationsgeschützt gespeichert werden.
          </p>
          <p>
            Unsere Planungsprozesse sind transparent und nachvollziehbar. Wir dokumentieren jeden Schritt, von der initialen Bestandsaufnahme bis zur finalen Abnahme, und stellen sicher, dass Sie jederzeit den vollen Überblick über den Projektfortschritt und die getroffenen architektonischen Entscheidungen haben.
          </p>
        </div>
      </Section>

      {/* Interaktives Modul */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Investitionsplanung"
          title="Interaktiver Budget-Kalkulator"
          lead="Planen Sie Ihr Budget für die Implementierung maßgeschneiderter Sicherheitstechnik transparent und verlässlich."
        />
        <div className="mt-8 max-w-2xl mx-auto">
          <ServiceBudgetCalculator />
        </div>
      </Section>

      {/* Leistungsstufen & Vergleichsmatrix */}
      <Section>
        <SectionHeading
          eyebrow="Leistungsstufen"
          title="Strukturierte Performance-Tiers"
          lead="Wählen Sie die Leistungsstufe, die exakt zu Ihren Sicherheitsanforderungen und architektonischen Gegebenheiten passt."
        />
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left border-collapse border border-[oklch(0.89_0.008_260/0.55)]">
            <thead>
              <tr className="bg-[oklch(0.968_0.004_260)]">
                <th className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)] font-semibold text-[oklch(0.16_0.02_260)]">Feature</th>
                <th className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)] font-semibold text-[oklch(0.16_0.02_260)]">Tier 1 (Basis)</th>
                <th className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)] font-semibold text-[oklch(0.16_0.02_260)]">Tier 2 (Erweitert)</th>
                <th className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)] font-semibold text-[oklch(0.16_0.02_260)]">Tier 3 (Enterprise)</th>
              </tr>
            </thead>
            <tbody className="text-[oklch(0.32_0.02_260)]">
              <tr>
                <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)] font-medium">Mechanischer Grundschutz</td>
                <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Standard (VdS Klasse A)</td>
                <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Erhöht (VdS Klasse B)</td>
                <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Maximum (VdS Klasse C)</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)] font-medium">Zutrittskontrolle</td>
                <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Mechanische Schließanlage</td>
                <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Elektronische Offline-Zylinder</td>
                <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Online-Vernetzte Terminals</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)] font-medium">Alarmierung</td>
                <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Lokal (Sirene)</td>
                <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Aufschaltung (App/SMS)</td>
                <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Wachdienst-Aufschaltung (NSL)</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)] font-medium">Videoüberwachung</td>
                <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Nicht inklusive</td>
                <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Eingangsbereich (Lokal)</td>
                <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Vollflächig (Cloud-Backup)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Domain-Specific FAQ Block */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Häufige Fragen"
          title="Experten-Antworten zur Sicherheitstechnik"
          lead="Klären Sie offene Punkte rund um Planung, Installation und Betrieb moderner Sicherheitssysteme."
        />
        <div className="mt-8 space-y-6 max-w-3xl">
          <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">1. Wie unterscheidet sich eine VdS-zertifizierte Anlage von herkömmlichen Systemen?</h4>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
              VdS-zertifizierte Anlagen entsprechen strengen Richtlinien hinsichtlich Komponentenqualität, Ausfallsicherheit und Sabotageschutz. Sie werden von Versicherern anerkannt und gewährleisten eine hohe Verlässlichkeit in kritischen Szenarien. Der Zertifizierungsprozess stellt sicher, dass sowohl die Hardware als auch die fachgerechte Installation höchsten Standards genügen. Dies minimiert das Risiko von Falschalarmen und Systemausfällen erheblich.
            </p>
          </div>
          <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">2. Ist die Nachrüstung elektronischer Zylinder in Bestandstüren problemlos möglich?</h4>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
              In den meisten Fällen ja. Moderne elektronische Zylinder nutzen das Standard-Europrofilmaß und können ohne aufwändige Verkabelung oder strukturelle Änderungen an der Tür eingesetzt werden. Wir prüfen jedoch vorab die Beschaffenheit des Einsteckschlosses, das Dornmaß und die Fluchtwegeigenschaften der Tür, um eine normgerechte und funktionssichere Installation zu gewährleisten.
            </p>
          </div>
          <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">3. Welche datenschutzrechtlichen Aspekte sind bei Videoüberwachung zu beachten?</h4>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
              Beim Betrieb von Videotechnik müssen die Grundsätze der DSGVO beachtet werden. Dazu gehören die Zweckbindung (z.B. Eigentumsschutz), die Datenminimierung (Beschränkung auf das Nötigste) und die Transparenz (Hinweisschilder). Öffentlicher Raum oder Nachbargrundstücke dürfen nicht erfasst werden. Wir beraten Sie bei der datenschutzkonformen Planung und Einrichtung von Privacy-Masken (Bildverpixelung sensibler Bereiche).
            </p>
          </div>
          <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">4. Was passiert mit meiner elektronischen Zutrittskontrolle bei einem Stromausfall?</h4>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
              Offline-Komponenten (wie batteriebetriebene Zylinder oder Beschläge) arbeiten autark und sind von einem Netzstromausfall nicht betroffen. Bei online-vernetzten Systemen sorgen wir durch unterbrechungsfreie Stromversorgungen (USV) und gepufferte Netzteile dafür, dass die Funktion für einen definierten Zeitraum aufrechterhalten bleibt. Flucht- und Rettungswege müssen zudem mechanisch (z.B. durch Panikschlösser) jederzeit passierbar sein.
            </p>
          </div>
          <div className="rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">5. Wie oft muss eine Einbruchmeldeanlage (EMA) gewartet werden?</h4>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
              Für gewerblich genutzte oder VdS-anerkannte Anlagen ist eine jährliche Wartung durch einen zertifizierten Fachbetrieb zwingend vorgeschrieben, um den Versicherungsschutz aufrechtzuerhalten. Bei privaten Anlagen empfehlen wir ebenfalls einen jährlichen Turnus. Dabei werden Batterien geprüft, Sensoren justiert, die Alarmübertragung getestet und die Firmware aktualisiert, um dauerhafte Zuverlässigkeit zu garantieren.
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
    </>
    </main>
  );
}
