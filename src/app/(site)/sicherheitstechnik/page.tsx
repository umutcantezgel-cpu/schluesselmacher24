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
import { SecurityCheckCalculator } from '@/components/calculator/security-check-calculator';

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

      {/* Interactive Module & Deep Expertise Section */}
      <Section id="architektur-und-methodik" tone="muted">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-12">

          <div className="space-y-8">
            <div>
              <SectionHeading
                eyebrow="Architektur & Methodik"
                title="Sicherheit als ganzheitliches System"
                lead="Ein sicheres Gebäude entsteht nicht durch das wahllose Aneinanderreihen von Technik. Es erfordert eine methodische Herangehensweise, bei der Mechanik, Elektronik und organisatorische Maßnahmen ineinandergreifen."
              />

              <div className="mt-8 space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
                <p>
                  Die Basis jedes fundierten Sicherheitskonzepts ist die physische Hülle eines Objekts.
                  Mechanische Sicherungen wie Hochsicherheitszylinder, Panzerriegel und einbruchhemmende
                  Türen bilden den primären Widerstand. Ihre Aufgabe ist es, einen Eindringling physisch
                  aufzuhalten und den Zeitaufwand für einen Einbruch so drastisch zu erhöhen, dass der
                  Versuch abgebrochen wird. Die Täterpsychologie zeigt deutlich: Je länger ein Einbruchsversuch
                  dauert, desto höher ist das Risiko der Entdeckung und desto wahrscheinlicher der Abbruch.
                </p>
                <p>
                  Auf diesem soliden mechanischen Fundament baut die elektronische Sicherheitstechnik auf.
                  Hierbei unterscheiden wir streng zwischen Meldetechnik und Überwachungstechnik.
                  Meldetechnik – wie VdS-zertifizierte Einbruchmeldeanlagen – detektiert den Versuch der
                  Überwindung der mechanischen Barrieren. Sie alarmiert interne oder externe Stellen (wie
                  einen Wachschutz oder die Polizei), bevor der Täter überhaupt in das Objekt eingedrungen ist.
                </p>
                <p>
                  Die Überwachungstechnik, insbesondere die hochauflösende IP-Videoüberwachung, dient der
                  Verifikation von Alarmen und der späteren Beweissicherung. Moderne Systeme nutzen
                  Künstliche Intelligenz, um zwischen relevanten Bewegungen (Personen, Fahrzeuge) und
                  Fehlalarmen (Tiere, Witterungseinflüsse) zu unterscheiden. Dies reduziert die Belastung
                  für Betreiber und Interventionskräfte massiv.
                </p>
                <h3 className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] mt-8 mb-4">Das Zwiebelschalen-Prinzip</h3>
                <p>
                  Wir projektieren Sicherheitssysteme nach dem bewährten Zwiebelschalen-Prinzip.
                  Die äußerste Schale bildet die Perimetersicherung – also die Einfriedung des Grundstücks
                  und die Überwachung der Grundstücksgrenzen. Die nächste Schale ist die Außenhaut des
                  Gebäudes: Fenster, Türen, Lichtschächte. Die innerste Schale konzentriert sich auf die
                  Fallenüberwachung im Gebäudeinneren, oft fokussiert auf Bereiche mit besonders wertvollen
                  Gütern oder sensiblen Daten.
                </p>
                <p>
                  Jede Schale muss unabhängig voneinander funktionieren, aber im Ereignisfall synergetisch
                  zusammenwirken. Ein ausgelöster Bewegungsmelder an der Außenhaut sollte beispielsweise
                  nicht nur einen Voralarm generieren, sondern auch sofort die nächstgelegene PTZ-Kamera
                  (Pan-Tilt-Zoom) auf den Sektor ausrichten.
                </p>
                <h3 className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] mt-8 mb-4">Die Rolle der Zutrittskontrolle</h3>
                <p>
                  Elektronische Zutrittskontrollsysteme (ZKS) bilden das Bindeglied zwischen Organisation und Technik.
                  Sie ersetzen starre, mechanische Schließanlagen durch flexible, zeitlich und räumlich
                  steuerbare Berechtigungskonzepte. Der Verlust eines Transponders führt nicht mehr zum
                  kostspieligen Austausch von Zylindern, sondern lediglich zum sofortigen Sperren des
                  Identmediums im System.
                </p>
                <p>
                  Darüber hinaus ermöglichen moderne ZKS die lückenlose Protokollierung von Zutrittsereignissen
                  und die Integration in übergeordnete Gebäudeleittechnik. So kann beispielsweise beim Betreten
                  des letzten Mitarbeiters automatisch die Einbruchmeldeanlage scharfgeschaltet und die
                  Beleuchtung reduziert werden. Dies erhöht nicht nur die Sicherheit, sondern senkt auch die
                  Betriebskosten des Objekts spürbar.
                </p>
                <h3 className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] mt-8 mb-4">Zertifizierung und Normen</h3>
                <p>
                  Wir arbeiten konsequent nach den Richtlinien des VdS (Verband der Sachversicherer) und
                  entsprechend der geltenden DIN-Normen (z.B. DIN EN 50131 für Einbruchmeldeanlagen).
                  Dies ist nicht nur ein Qualitätsversprechen an unsere Kunden, sondern oftmals auch eine
                  zwingende Voraussetzung für den Versicherungsschutz gewerblicher Risiken. Anlagen, die nicht
                  nach diesen strengen Vorgaben errichtet werden, können im Schadensfall zum Verlust des
                  Versicherungsschutzes führen.
                </p>
              </div>
            </div>

            <div className="pt-12 border-t border-[oklch(0.89_0.008_260/0.55)]">
              <h2 className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] mb-8">Häufig gestellte Fragen (FAQ)</h2>
              <dl className="space-y-6">

                <div className="bg-[oklch(0.988_0.002_260)] p-6 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
                  <dt className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">Warum reicht eine mechanische Sicherung allein oft nicht aus?</dt>
                  <dd className="text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                    Mechanik leistet exzellenten Widerstand, ist aber stumm. Ein professioneller Täter mit ausreichend
                    Zeit und schwerem Werkzeug kann nahezu jede mechanische Barriere überwinden. Eine Kombination mit
                    Meldetechnik sorgt dafür, dass dieser Versuch detektiert und gemeldet wird, bevor der Durchbruch
                    gelingt.
                  </dd>
                </div>

                <div className="bg-[oklch(0.988_0.002_260)] p-6 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
                  <dt className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">Wie fehlalarmsicher sind moderne Alarmanlagen?</dt>
                  <dd className="text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                    Bei fachgerechter Projektierung, Installation und regelmäßiger Wartung geht die Fehlalarmquote
                    gegen Null. Moderne Dual-Melder nutzen beispielsweise eine Kombination aus Passiv-Infrarot
                    und Mikrowelle. Nur wenn beide physikalischen Prinzipien gleichzeitig eine Auslösung
                    registrieren, wird ein Alarm generiert. Haustiere können durch spezielle Algorithmen
                    zuverlässig ausgeblendet werden.
                  </dd>
                </div>

                <div className="bg-[oklch(0.988_0.002_260)] p-6 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
                  <dt className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">Sind Funkanlagen genauso sicher wie verkabelte Systeme?</dt>
                  <dd className="text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                    Professionelle Funk-Alarmanlagen nutzen bidirektionale, verschlüsselte Kommunikation und
                    wechseln bei Störungen (Jamming) automatisch die Frequenz. Für den privaten und
                    kleingewerblichen Bereich sind sie oft die beste Wahl, da sie ohne aufwendige
                    Kabelverlegung nachgerüstet werden können. Im Hochsicherheitsbereich oder bei sehr großen
                    Objekten bleibt das verdrahtete System jedoch der Goldstandard.
                  </dd>
                </div>

                <div className="bg-[oklch(0.988_0.002_260)] p-6 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
                  <dt className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">Was passiert bei einem Stromausfall?</dt>
                  <dd className="text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                    Jede fachgerecht errichtete Gefahrenmeldeanlage verfügt über eine Notstromversorgung mittels
                    leistungsstarker Akkumulatoren. Diese überbrücken Netzausfälle je nach Auslegung für
                    mindestens 12 bis über 60 Stunden. Auch die Übertragungswege (GSM/LTE-Module) bleiben
                    in dieser Zeit vollständig funktionsfähig, sodass Alarme weiterhin abgesetzt werden können.
                  </dd>
                </div>

                <div className="bg-[oklch(0.988_0.002_260)] p-6 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
                  <dt className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">Kann ich eine Anlage später erweitern?</dt>
                  <dd className="text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                    Ja. Moderne Sicherheitsarchitekturen sind hochgradig modular aufgebaut. Eine als
                    reine Einbruchmeldeanlage gestartete Installation kann später problemlos um
                    Brandmelder, Wassersensoren, Videoüberwachungskomponenten oder eine elektronische
                    Zutrittskontrolle erweitert werden. Wichtig ist lediglich die initial richtige
                    Dimensionierung der Zentraleinheit.
                  </dd>
                </div>

              </dl>
            </div>

          </div>

          <div className="lg:sticky lg:top-8">
             <SecurityCheckCalculator />
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
