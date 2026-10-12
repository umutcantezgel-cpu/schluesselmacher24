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
import { SecurityRiskCalculator } from '@/components/sicherheitstechnik/security-risk-calculator';


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

      {/* Recht und Verantwortung */}

      {/* Interactive Risk Calculator */}
      <Section id="sicherheitsrechner">
        <SectionHeading
          eyebrow="Interaktive Analyse"
          title="Objekt-Sicherheitsrechner"
          lead="Berechnen Sie das individuelle Risikoprofil Ihres Objekts und erhalten Sie erste Empfehlungen für eine optimale Absicherung."
        />
        <div className="mt-8">
          <SecurityRiskCalculator />
        </div>
      </Section>


      <Section id="methodik-und-architektur">
        <SectionHeading
          eyebrow="Architektur & Methodik"
          title="Tiefgehende Sicherheitsarchitektur nach Schweizer Präzision"
          lead="Unsere Methodik basiert auf strengen Normen und einer kompromisslosen Qualitätskontrolle."
        />
        <div className="mt-8 grid gap-8 md:grid-cols-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
          <div>
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mb-4">Ganzheitliche Gefahrenabwehr</h3>
            <p className="mb-4">
              Eine effektive Sicherheitsarchitektur betrachtet nicht nur isolierte Komponenten, sondern das perfekte Zusammenspiel aller Systeme. Mechanik, Elektronik und digitale Protokollierung müssen nahtlos ineinandergreifen, um eine lückenlose Sicherheitskette zu gewährleisten. Jeder Schwachpunkt in der Außenhaut oder im Zutrittskonzept kann fatale Folgen haben. Daher setzen wir auf eine mehrstufige Verteidigungsstrategie.
            </p>
            <p className="mb-4">
              Unsere Expertisen umfassen die detaillierte Risikoanalyse, die Planung von maßgeschneiderten Sicherheitslösungen und die fachgerechte Implementierung. Wir berücksichtigen dabei aktuelle Kriminalitätsstatistiken, spezifische Objektgegebenheiten und individuelle Schutzbedürfnisse. Durch die Kombination von physischen Barrieren und modernster Sensortechnik maximieren wir den Widerstandswert Ihres Objekts erheblich.
            </p>
            <p>
              Die ständige Weiterentwicklung von Einbruchsmethoden erfordert eine proaktive Herangehensweise. Wir evaluieren kontinuierlich neue Technologien und integrieren sie in unsere Konzepte. Von hochauflösenden IP-Kamerasystemen mit intelligenter Videoanalyse bis hin zu vernetzten Alarmanlagen mit Cloud-Anbindung bieten wir Lösungen, die dem neuesten Stand der Technik entsprechen.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mb-4">Zertifizierte Standards</h3>
            <p className="mb-4">
              Qualität und Zuverlässigkeit stehen bei uns an erster Stelle. Alle von uns verbauten Komponenten entsprechen den strengsten europäischen Normen (z.B. EN 50131 für Einbruchmeldeanlagen, DIN EN 1627 für einbruchhemmende Bauteile). Diese Zertifizierungen garantieren nicht nur höchste Sicherheit, sondern sind oft auch Voraussetzung für den Versicherungsschutz.
            </p>
            <p className="mb-4">
              Unsere Techniker werden regelmäßig geschult und sind Experten auf ihrem Gebiet. Die Installation erfolgt unter strenger Einhaltung der Herstellervorgaben und branchenspezifischen Richtlinien. Nach Abschluss der Arbeiten führen wir eine umfassende Funktionsprüfung durch und übergeben Ihnen eine detaillierte Dokumentation des Systems.
            </p>
            <p>
              Ein weiterer wichtiger Aspekt ist die regelmäßige Wartung der Anlagen. Nur so kann die dauerhafte Funktionstüchtigkeit und Sicherheit gewährleistet werden. Wir bieten maßgeschneiderte Wartungsverträge, die Inspektionen, Updates und im Bedarfsfall einen schnellen Reparaturservice umfassen. So haben Sie die Gewissheit, dass Ihr Sicherheitssystem immer einsatzbereit ist.
            </p>
          </div>
        </div>
      </Section>

      <Section id="faq-sicherheitstechnik">
        <SectionHeading
          eyebrow="Häufige Fragen"
          title="Expertenantworten zur Sicherheitstechnik"
          lead="Detaillierte Antworten auf die wichtigsten Fragen rund um den Schutz Ihres Eigentums."
        />
        <dl className="mt-8 space-y-6">
          {[
            {
              q: "Welche Komponenten gehören zur Grundausstattung eines modernen Sicherheitssystems?",
              a: "Die Grundausstattung beginnt immer mit solider mechanischer Sicherung: Zertifizierte Schließzylinder, einbruchhemmende Beschläge und Zusatzschlösser für Türen und Fenster. Darauf aufbauend empfehlen wir eine elektronische Einbruchmeldeanlage (Alarmanlage) mit Öffnungs- und Bewegungsmeldern. Für den Außenbereich kann eine Videoüberwachung sinnvoll sein. Eine Gegensprechanlage, idealerweise mit Videofunktion, rundet das Basis-Paket ab."
            },
            {
              q: "Wie unterscheidet sich die Absicherung eines Gewerbeobjekts von der eines Privathauses?",
              a: "Gewerbeobjekte erfordern oft komplexere Lösungen. Hier stehen neben dem Einbruchschutz auch Zutrittskontrolle, Zeit- und Anwesenheitserfassung sowie die Integration in übergeordnete Gebäudeleitsysteme im Fokus. Die Risikoklassen sind meist höher, was den Einsatz von Systemen nach strengeren Normen (z.B. VdS) erforderlich macht. Zudem müssen oft spezielle Anforderungen wie Fluchtwegsteuerung oder die Absicherung von sensiblen IT-Bereichen berücksichtigt werden."
            },
            {
              q: "Können bestehende mechanische Schließanlagen mit elektronischen Systemen nachgerüstet werden?",
              a: "Ja, in den meisten Fällen ist das problemlos möglich. Wir können vorhandene Türen mit mechatronischen Schließzylindern oder elektronischen Beschlägen ausstatten. Diese lassen sich dann in eine zentrale Zutrittssteuerung integrieren. So erhalten Sie die Vorteile einer elektronischen Anlage (z.B. einfache Verwaltung von Rechten, Protokollierung) ohne die gesamte Mechanik austauschen zu müssen. Dies ist eine kosteneffiziente Methode, um die Sicherheit deutlich zu erhöhen."
            },
            {
              q: "Was passiert bei einem Stromausfall? Ist das Sicherheitssystem dann noch aktiv?",
              a: "Professionelle Sicherheitssysteme verfügen immer über eine Notstromversorgung. Eine integrierte Batterie (Akku) übernimmt bei einem Stromausfall sofort die Energieversorgung, sodass die Anlage weiterhin voll funktionsfähig bleibt. Die Kapazität dieser Notstromversorgung ist so bemessen, dass sie typischerweise mehrere Stunden bis zu einem Tag überbrücken kann. Sobald der Netzstrom wieder verfügbar ist, wird der Akku automatisch wieder aufgeladen."
            },
            {
              q: "Sind Smart-Home-Lösungen aus dem Baumarkt genauso sicher wie professionelle Anlagen?",
              a: "Nein, es gibt fundamentale Unterschiede. Baumarkt-Systeme nutzen oft ungesicherte Funkverbindungen, die manipuliert (Jamming) oder abgehört werden können. Sie verfügen meist nicht über die erforderlichen Zertifizierungen und Zertifikate (wie VdS) für einen echten Versicherungsschutz. Zudem fehlt die Aufschaltung auf eine professionelle Notrufleitstelle. Professionelle Systeme nutzen verschlüsselte Kommunikation, sabotagegeschützte Komponenten und garantieren höchste Ausfallsicherheit."
            }
          ].map((faq, i) => (
            <div key={i} className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
              <dt className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">{faq.q}</dt>
              <dd className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">{faq.a}</dd>
            </div>
          ))}
        </dl>
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
