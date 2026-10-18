import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';
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


      {/* Fachliche Methodik & Erweiterter Inhalt */}
      <Section tight>
        <div className="space-y-6">
          <h2 className="text-[oklch(0.16_0.02_260)] font-semibold tracking-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            Architektonische Methodik und ganzheitliche Sicherheitstechnik
          </h2>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
            Die Konzeption zeitgemäßer Sicherheitstechnik erfordert einen integralen Ansatz, der weit über die bloße Installation isolierter Komponenten hinausgeht. Es handelt sich um ein fein abgestimmtes Zusammenspiel aus physischer Barriere, sensorischer Erfassung und reaktiver Alarmierung. Jedes Objekt – ob privater Wohnraum, gewerbliche Immobilie oder hochsensible Infrastruktur – weist ein individuelles Risikoprofil auf, das durch eine maßgeschneiderte Sicherheitsarchitektur adressiert werden muss.
          </p>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
            Unsere Methodik basiert auf dem Prinzip der konzentrischen Sicherheitsringe. Dies beginnt an der Peripherie des Grundstücks, wo erste Detektionsmaßnahmen Eindringlinge frühzeitig erfassen. Der zweite Ring bildet die Gebäudehülle, die durch massive mechanische Sicherungen und mechatronische Schließsysteme gegen Überwindung gehärtet wird. Der dritte und innerste Ring umfasst die Raumüberwachung und Zugriffskontrolle auf sensible Bereiche im Gebäudeinneren. Nur durch die lückenlose Verzahnung dieser Zonen entsteht ein resilientes Gesamtsystem.
          </p>
          <h3 className="text-[oklch(0.16_0.02_260)] font-semibold mt-8 mb-4" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }}>
            Die drei Säulen der Gebäudesicherheit
          </h3>
          <ul className="list-disc list-inside space-y-2 text-[oklch(0.32_0.02_260)] leading-relaxed ml-4">
            <li><strong>Prävention (Mechanik):</strong> Der fundamentale Grundschutz. Erhöhung des Zeitaufwands und Werkzeugeinsatzes für Täter durch einbruchhemmende Türen, Fenster, Nachrüstsicherungen und Hochsicherheitszylinder. Mechanik kauft Zeit.</li>
            <li><strong>Detektion (Meldetechnik):</strong> Die sensorische Erfassung von Anomalien. Einsatz von Magnetkontakten, passiven Infrarotmeldern (PIR), Glasbruchsensoren und videobasierter Analytik zur sofortigen Erkennung unbefugten Eindringens.</li>
            <li><strong>Intervention (Alarmierung):</strong> Die strukturierte Reaktion auf verifizierte Alarme. Weiterleitung an hilfeleistende Stellen (Wachdienst, Polizei), lokale akustisch-optische Signalgebung zur Täterabschreckung und Alarmierung der Betreiber.</li>
          </ul>
        </div>
      </Section>

      {/* Leistungsstufen / Vergleichsmatrix */}
      <Section tone="muted">
         <SectionHeading
          eyebrow="Systemarchitektur"
          title="Leistungsstufen moderner Sicherheitssysteme"
          lead="Von der soliden Grundsicherung bis zur vernetzten Enterprise-Lösung."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3" style={{ gridTemplateRows: 'subgrid' }}>
          {[
            {
              tier: 'Grundschutz',
              target: 'Private Wohnobjekte',
              features: ['Mechanische Basissicherung', 'Geprüfte Profilzylinder', 'Einfache Alarmierung', 'Lokale Steuerung'],
            },
            {
              tier: 'Erweiterter Schutz',
              target: 'Gewerbe & anspruchsvolle Privathaushalte',
              features: ['Mechatronische Schließanlagen', 'Zertifizierte Einbruchmeldeanlage', 'App-Integration & Fernzugriff', 'Video-Verifikation'],
            },
            {
              tier: 'Enterprise',
              target: 'Kritische Infrastrukturen',
              features: ['Ganzheitliches Gefahrenmanagement', 'Vernetzte Zutrittskontrolle', 'KI-gestützte Videoanalytik', '24/7 Leitstellenaufschaltung'],
            }
          ].map((item) => (
            <div key={item.tier} className="flex flex-col rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
              <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">{item.tier}</h4>
              <p className="text-sm text-[oklch(0.52_0.015_260)] mt-1">{item.target}</p>
              <ul className="mt-4 flex-1 space-y-2">
                {item.features.map(f => (
                  <li key={f} className="flex items-start text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
                    <span className="mr-2 text-[oklch(0.52_0.24_260)]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Interaktiver Kalkulator */}
      <Section>
         <SectionHeading
          eyebrow="Kalkulation"
          title="Transparente Budgetplanung"
          lead="Nutzen Sie unseren interaktiven Rechner für eine erste Kosteneinschätzung Ihres Sicherheitsprojekts."
        />
        <div className="mt-8 max-w-2xl mx-auto">
          <ServiceBudgetCalculator />
        </div>
      </Section>

      {/* FAQ Sektion */}
      <Section tone="muted" tight>
        <SectionHeading
          eyebrow="Wissen"
          title="Häufige Fragen zur Sicherheitstechnik"
          lead="Kompakte Antworten auf komplexe sicherheitstechnische Fragestellungen."
        />
        <dl className="mt-8 space-y-6 max-w-3xl mx-auto">
          {[
            { q: 'Ist eine Einbruchmeldeanlage ohne mechanische Grundsicherung sinnvoll?', a: 'Nein. Eine Alarmanlage verhindert keinen Einbruch, sie meldet ihn nur. Ohne adäquate mechanische Sicherungen (wie Zusatzschlösser oder einbruchhemmende Fenster) haben Täter das Objekt betreten, bevor Hilfe eintrifft. Die Kombination aus Mechanik (Zeitgewinn) und Elektronik (Meldung) ist zwingend.' },
            { q: 'Welche Zertifizierungen sind bei Sicherheitstechnik relevant?', a: 'Wir achten strikt auf VdS-Anerkennung sowie DIN EN 50131-Konformität bei elektronischen Systemen und DIN 18104/DIN 18252 bei mechanischen Komponenten. Diese Normen garantieren nicht nur die Funktionstüchtigkeit unter Belastung, sondern sind oft auch Voraussetzung für Versicherungsrabatte oder KfW-Förderungen.' },
            { q: 'Lassen sich bestehende Systeme nachträglich smart aufrüsten?', a: 'In vielen Fällen ja. Moderne Gefahrenmanagementsysteme und mechatronische Schließzylinder können oft in bestehende Infrastrukturen integriert werden, um App-Steuerung und Remote-Monitoring zu ermöglichen. Die Machbarkeit prüfen wir im Rahmen unseres Sicherheitschecks vor Ort.' },
            { q: 'Wie hoch ist der Wartungsaufwand für ein elektronisches Sicherheitssystem?', a: 'Eine jährliche Wartung nach DIN VDE 0833 ist für die Aufrechterhaltung der Systemintegrität und im Gewerbebereich oft aus versicherungsrechtlichen Gründen obligatorisch. Dabei werden Batterien geprüft, Sensoren kalibriert und Firmware-Updates eingespielt, um höchste Zuverlässigkeit zu gewährleisten.' },
            { q: 'Sind Funk-Alarmanlagen so sicher wie verkabelte Systeme?', a: 'Moderne, professionelle Funk-Alarmsysteme nutzen proprietäre, verschlüsselte Frequenzbänder (oft 868 MHz) mit Rolling-Code-Verfahren und Anti-Jamming-Erkennung. Für den privaten und kleingewerblichen Bereich bieten sie ein exzellentes Sicherheitsniveau bei geringerem Installationsaufwand. Für Hochrisikoobjekte bleibt die Festverdrahtung jedoch der Goldstandard.' }
          ].map((faq, i) => (
            <div key={i} className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
              <dt className="text-[15px] font-bold text-[oklch(0.16_0.02_260)]">{faq.q}</dt>
              <dd className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">{faq.a}</dd>
            </div>
          ))}
        </dl>
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
