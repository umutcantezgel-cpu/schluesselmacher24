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
import { SecurityBudgetCalculator } from '@/components/calculator/security-budget-calculator';

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


      {/* Architektonische Methodik & Erweiterte Inhalte */}
      <Section id="architektur-und-methodik">
        <SectionHeading
          eyebrow="Architektonische Methodik"
          title="Präzision in jedem Schritt: Unsere Sicherheits-Architektur"
          lead="Wir verstehen Sicherheitstechnik nicht als isolierte Produkte, sondern als integrierte architektonische Lösungen, die höchste Ansprüche an Präzision, Zuverlässigkeit und Langlebigkeit erfüllen."
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-12">
            <div className="prose-sm24 max-w-none text-[oklch(0.32_0.02_260)] space-y-6">
            <p>
                Die Konzeption und Implementierung moderner Sicherheitstechnik erfordert ein tiefgreifendes Verständnis für mechanische Präzision, elektronische Integration und architektonische Rahmenbedingungen. Unser Ansatz basiert auf einer strikten, methodischen Vorgehensweise, die sicherstellt, dass jede von uns geplante und umgesetzte Lösung exakt auf die spezifischen Anforderungen des jeweiligen Objekts abgestimmt ist.
            </p>
            <p>
                Wir lehnen standardisierte &quot;Out-of-the-box&quot;-Lösungen ab, wo maßgeschneiderte Sicherheit gefordert ist. Jeder Auftrag beginnt mit einer detaillierten Analyse der bestehenden Infrastruktur, der Identifikation potenzieller Schwachstellen und der Definition eines klaren, bedarfsorientierten Schutzziels.
            </p>

            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8">1. Mechanik vs. Elektronik: Die Kernphilosophie</h3>
            <p>
                Eine der wichtigsten Erkenntnisse in der modernen Sicherheitstechnik ist das Zusammenspiel aus physischer Barriere und elektronischer Überwachung. Elektronische Meldesysteme, so fortschrittlich sie auch sein mögen, verhindern keinen Einbruch physisch. Sie registrieren den Vorfall, zeichnen ihn auf und leiten Alarme weiter. Ohne ausreichenden mechanischen Grundschutz haben Täter oft genug Zeit, ihr Vorhaben abzuschließen, bevor Hilfe eintrifft.
            </p>
            <p>
                Daher gilt in unserer Architekturplanung der Grundsatz: <strong>Mechanik hält auf, Elektronik meldet.</strong> Wir beginnen stets mit der Härtung der Gebäudehülle. Hochwertige Schließzylinder, einbruchhemmende Beschläge, massive Schließbleche und zertifizierte Zusatzschlösser bilden das Fundament. Erst auf diesem robusten mechanischen Grundgerüst setzen wir elektronische Systeme auf.
            </p>

            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8">2. Die Phasen unserer Service-Implementierung</h3>
            <p>
                Unser Prozess ist in streng definierte Phasen unterteilt, die von der initialen Bestandsaufnahme bis zur finalen Abnahme und Dokumentation reichen.
            </p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Initiierung und Bedarfsanalyse:</strong> Wir bewerten Türbeschaffenheiten, Zylindermaßen, bestehende elektronische Anlagen und architektonische Gegebenheiten.</li>
                <li><strong>Projektierung und Lösungsdesign:</strong> Entwicklung eines fundierten Konzepts unter Berücksichtigung von Schließplänen, Netzwerkinfrastruktur und Brandschutzvorgaben.</li>
                <li><strong>Präzise Fertigung und Vorkonfiguration:</strong> Vorbereitung aller Komponenten in unserer Fachwerkstatt zur Reduzierung der Ausfallzeiten vor Ort.</li>
                <li><strong>Fachgerechte Montage und Integration:</strong> Installation durch zertifizierte Techniker gemäß DIN 18252 und VdS-Richtlinien.</li>
                <li><strong>Dokumentation und Systemübergabe:</strong> Übergabe von Sicherungskarten, Schließplänen, IP-Konfigurationen und Bedienungsprotokollen.</li>
            </ul>

            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8">3. Technologische Standards und Materialqualität</h3>
            <p>
                Welche Produkte wir einsetzen, richtet sich nach Tür, Schutzziel und Budget. Entscheidend sind mechanische Stabilität, Schutz gegen Manipulation und eine lange Nutzungsdauer. Bei mechanischen Zylindern achten wir auf Merkmale wie Bohr- und Ziehschutz sowie patentierte Schlüsselprofile.
            </p>
            <p>
                Im Bereich der Elektronik empfehlen wir Systeme mit verschlüsselter Kommunikation (z.B. AES-128) und ausfallsichere Systeme, die auch bei Stromausfall über Notstromakkus eine definierte Grundsicherheit gewährleisten. Die nahtlose Verzahnung von Mechanik und Elektronik (Mechatronik) bildet oft den Kern unserer fortschrittlichsten Lösungen.
            </p>

            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8">4. Nachhaltigkeit und Lebenszyklus-Management</h3>
            <p>
                Sicherheitstechnik ist eine langfristige Investition. Daher legen wir großen Wert auf das Lebenszyklus-Management. Dies beginnt bei der Planung durch die Wahl skalierbarer Architekturen. Wenn sich Ihre Anforderungen ändern, lassen sich unsere Systeme effizient anpassen. Wir bieten zudem strukturierte Wartungskonzepte an, um Software-Updates und präventive mechanische Wartungen regelmäßig durchzuführen.
            </p>


            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8">5. Vergleichsmatrix: System-Architekturen</h3>
            <div className="mt-4 overflow-x-auto rounded-xl border border-[oklch(0.89_0.008_260/0.55)]">
                <table className="w-full text-left text-sm text-[oklch(0.32_0.02_260)]">
                    <thead className="bg-[oklch(0.968_0.004_260)] text-[oklch(0.16_0.02_260)]">
                        <tr>
                            <th className="px-4 py-3 border-b border-[oklch(0.89_0.008_260/0.55)]">System-Typ</th>
                            <th className="px-4 py-3 border-b border-[oklch(0.89_0.008_260/0.55)]">Vorteile</th>
                            <th className="px-4 py-3 border-b border-[oklch(0.89_0.008_260/0.55)]">Einsatzbereich</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                            <td className="px-4 py-3 font-semibold">Autarkes Einzelsystem</td>
                            <td className="px-4 py-3">Unabhängig, keine Netzwerkstruktur nötig, hohe Ausfallsicherheit</td>
                            <td className="px-4 py-3">Kleine Gewerbeobjekte, isolierte Räume</td>
                        </tr>
                        <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                            <td className="px-4 py-3 font-semibold">Vernetzte Funk-Systeme</td>
                            <td className="px-4 py-3">Schnelle Installation, keine Kabelverlegung, flexibel erweiterbar</td>
                            <td className="px-4 py-3">Bestehende Wohnimmobilien, temporäre Sicherung</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold">Vollintegrierte Bus-Systeme</td>
                            <td className="px-4 py-3">Zentrale Steuerung, höchste Manipulationssicherheit, VdS-konform</td>
                            <td className="px-4 py-3">Neubauten, KRITIS, Banken, Industrie</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8">6. Häufig gestellte Fragen (FAQ)</h3>
            <dl className="mt-4 space-y-4">
                <div className="rounded-lg bg-[oklch(0.968_0.004_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
                    <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Können bestehende Fenster elektronisch gesichert werden?</dt>
                    <dd className="mt-2">Ja, über nachrüstbare Funk- oder Magnetkontakte können bestehende Elemente überwacht werden, ohne dass Kabel verlegt werden müssen.</dd>
                </div>
                <div className="rounded-lg bg-[oklch(0.968_0.004_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
                    <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Was passiert bei einem Stromausfall?</dt>
                    <dd className="mt-2">Professionelle Alarmanlagen verfügen über integrierte Notstromakkus, die den Betrieb je nach Dimensionierung für 12 bis 48 Stunden sicherstellen.</dd>
                </div>
                <div className="rounded-lg bg-[oklch(0.968_0.004_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
                    <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Sind Ihre Anlagen VdS-zertifiziert?</dt>
                    <dd className="mt-2">Wir verbauen Komponenten mit VdS-Anerkennung. Die Zertifizierung der gesamten Anlage bieten wir nach Anforderung für den gewerblichen Bereich an.</dd>
                </div>
                <div className="rounded-lg bg-[oklch(0.968_0.004_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
                    <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Darf ich eine Außenkamera zur Straße hin ausrichten?</dt>
                    <dd className="mt-2">Nein. Öffentlicher Grund und Nachbargrundstücke dürfen nicht erfasst werden. Wir planen den Bildausschnitt durch Maskierung oder physische Begrenzung entsprechend.</dd>
                </div>
                <div className="rounded-lg bg-[oklch(0.968_0.004_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
                    <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Wie oft muss eine Alarmanlage gewartet werden?</dt>
                    <dd className="mt-2">Wir empfehlen eine jährliche Inspektion, bei der Sensoren geprüft und Pufferbatterien turnusmäßig gewechselt werden.</dd>
                </div>
            </dl>

            </div>

            <div className="sticky top-24">
                <SecurityBudgetCalculator />
            </div>
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
