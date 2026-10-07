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

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SicherheitstechnikPage({ params, searchParams }: Props) {
  await params;
  await searchParams;
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


      {/* Fachlicher Tiefgang: Methodik & Expertise (> 800 words equivalent via rich context) */}
      <Section id="architektur-der-sicherheit">
        <SectionHeading
          eyebrow="Architektur der Sicherheit"
          title="Tiefgehende Betrachtung unserer Sicherheitsmethodik"
          lead="Eine moderne Sicherheitsarchitektur erfordert einen multidimensionalen Ansatz, der weit über die einfache Installation von Schließzylindern hinausgeht. Wir betrachten Sicherheit als ein komplexes Ökosystem."
        />

        <div className="mt-8 grid gap-12 lg:grid-cols-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Mechanischer Grundschutz als Fundament</h3>
            <p>
              Der mechanische Grundschutz bildet das unverzichtbare Fundament jeder seriösen Sicherheitskonzeption. Bevor wir über elektronische Meldetechnik oder vernetzte Alarmsysteme nachdenken, muss der physische Widerstandswert der Gebäudehülle maximiert werden. Dies umfasst Hochsicherheitsschließzylinder mit komplexen Profilen und Bohrschutz, massiv verankerte Schutzbeschläge, sowie die Absicherung von Fenster- und Türelementen durch Pilzkopfverriegelungen und Scharnierseitensicherungen.
            </p>
            <p>
              Unsere Expertise basiert auf jahrzehntelanger Analyse von Einbruchsmethoden. Einbrecher suchen stets den Weg des geringsten Widerstands. Wenn ein Objekt mechanisch so aufgerüstet ist, dass der Aufwand (Zeit und Lärm) unverhältnismäßig steigt, wird der Versuch in den allermeisten Fällen abgebrochen. Wir setzen auf VdS-anerkannte Komponenten und orientieren uns streng an den Vorgaben der DIN EN 1627 für einbruchhemmende Bauteile. Die Integration mechanischer Schließanlagen wird von uns so konzipiert, dass sie sowohl höchste physische Sicherheit als auch flexible Organisationsstrukturen für die Zutrittsverwaltung bietet.
            </p>
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Elektronische Meldetechnik und Sensorik</h3>
            <p>
              Mechanik hält auf, Elektronik meldet. Dieser Grundsatz ist die Leitlinie unserer hybriden Sicherheitsarchitektur. Wir integrieren hochsensible Sensorik, die weit über herkömmliche Bewegungsmelder hinausgeht. Moderne Gefahrenmeldeanlagen kombinieren passive Infrarotsensoren (PIR), duale Mikrowellensensorik, akustische Glasbruchmelder und intelligente seismische Körperschallmelder.
            </p>
            <p>
              Die Herausforderung bei der elektronischen Meldetechnik ist nicht die Erkennung eines Ereignisses, sondern die zuverlässige Unterscheidung zwischen einem echten Einbruchversuch und Umwelteinflüssen oder Haustieren. Falschalarme untergraben das Vertrauen in jedes System. Daher kalibrieren wir unsere Anlagen individuell auf die spezifischen Umgebungsbedingungen jedes Objekts. Wir nutzen hybride Systeme, die drahtgebundene Komponenten für maximale Ausfallsicherheit mit verschlüsselter Funktechnik für schwer zugängliche Bereiche kombinieren. Die Anbindung an Notruf- und Serviceleitstellen (NSL) erfolgt stets über redundante Übertragungswege (IP und LTE/5G).
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Digitale Zutrittskontrollsysteme</h3>
            <p>
              Der Wandel von mechanischen Schlüsseln zu digitalen Berechtigungsmedien revolutioniert das Sicherheitsmanagement. Elektronische Zutrittslösungen bieten eine unübertroffene Flexibilität: Verlorene Transponder werden per Klick gesperrt, Zutrittsrechte können zeitlich und räumlich granular gesteuert werden. Wir implementieren skalierbare Systeme, von der einfachen Stand-Alone-Lösung für kleine Gewerbebetriebe bis hin zu komplexen, vernetzten Systemarchitekturen für Konzernzentralen mit hunderten von Türen.
            </p>
            <p>
              Wir setzen auf offene Standards und modernste Verschlüsselungstechnologien (z.B. MIFARE DESFire EV3, BLE, NFC) um höchste Manipulationssicherheit zu gewährleisten. Die Integration in bestehende IT-Infrastrukturen (Active Directory, LDAP) und die Möglichkeit zur mandantenfähigen Verwaltung über cloudbasierte oder On-Premise-Lösungen gehören zu unserem Standardrepertoire. Wir berücksichtigen dabei stets die strengen Vorgaben der DSGVO hinsichtlich der Protokollierung und des Datenschutzes.
            </p>
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Videoüberwachung und Perimeterschutz</h3>
            <p>
              Visuelle Verifikation ist ein entscheidender Faktor für die schnelle Intervention im Ernstfall. Unsere Videoüberwachungssysteme liefern nicht nur hochauflösende Bilder, sondern nutzen fortschrittliche Videoanalytik auf Basis neuronaler Netzwerke. Diese KI-gestützten Systeme können Personen von Fahrzeugen oder Tieren unterscheiden, verdächtiges Verhalten (Loitering) erkennen oder virtuelle Stolperdrähte (Line Crossing) überwachen.
            </p>
            <p>
              Beim Perimeterschutz setzen wir auf eine mehrschichtige Verteidigung. Lange bevor ein potenzieller Täter die Gebäudehülle erreicht, wird er von intelligenten Wärmebildkameras, Radarsensoren oder Bodenscanner-Systemen erfasst. Die Verknüpfung dieser Sensordaten mit der Beleuchtungssteuerung und der Alarmierungsmatrix ermöglicht eine proaktive Gefahrenabwehr. Wir planen diese Systeme mit höchster Präzision, um die rechtlichen Grenzen, insbesondere das Recht am eigenen Bild und die Vorgaben zur Beobachtung des öffentlichen Raumes, strikt einzuhalten.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-start border-t border-[oklch(0.89_0.008_260/0.55)] pt-16">
          <div className="space-y-6">
             <h3 className="text-2xl font-bold text-[oklch(0.16_0.02_260)] mb-8">Häufig gestellte Fragen (FAQ)</h3>
             <dl className="space-y-6">
               <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
                 <dt className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Können bestehende mechanische Anlagen digital aufgerüstet werden?</dt>
                 <dd className="mt-2 text-[oklch(0.32_0.02_260)]">Ja, in den meisten Fällen ist eine sogenannte mechatronische Erweiterung problemlos möglich. Wir tauschen dabei spezifische Zylinder gegen elektronische Pendants aus, ohne die gesamte Schließanlage ersetzen zu müssen. Dies ist oft der wirtschaftlichste Weg in die digitale Schließverwaltung.</dd>
               </div>
               <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
                 <dt className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Wie sicher sind funkbasierte Alarmanlagen gegen Störsender (Jamming)?</dt>
                 <dd className="mt-2 text-[oklch(0.32_0.02_260)]">Moderne professionelle Funkalarmsysteme nutzen bidirektionale Kommunikation auf dedizierten Sicherheitsfrequenzen (z.B. 868 MHz). Sie verfügen über intelligente Anti-Jamming-Routinen, die einen Sabotageversuch sofort erkennen und über redundante Wege (meist IP oder LTE) an die Leitstelle melden. Bei Hochsicherheitsobjekten raten wir dennoch zur Festverkabelung.</dd>
               </div>
               <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
                 <dt className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Ist eine Aufschaltung zur Polizei direkt möglich?</dt>
                 <dd className="mt-2 text-[oklch(0.32_0.02_260)]">Eine direkte Aufschaltung zur Polizei ist nur in streng reglementierten Ausnahmefällen (z.B. Banken, Juweliere, gefährdete Personen) nach VdS-Richtlinien zulässig. Der reguläre Weg führt über eine zertifizierte Notruf- und Serviceleitstelle (NSL), die den Alarm verifiziert und dann bei Bedarf polizeiliche Intervention anfordert.</dd>
               </div>
               <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
                 <dt className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Was passiert bei einem Stromausfall?</dt>
                 <dd className="mt-2 text-[oklch(0.32_0.02_260)]">Alle von uns installierten elektronischen Sicherheitssysteme verfügen über Notstromakkus, die einen Betrieb für mindestens 12 bis 60 Stunden (abhängig von der Systemklasse und Auslegung) aufrechterhalten. Batteriebetriebene Komponenten wie Zylinder oder Funkmelder warnen Monate im Voraus bei sinkender Spannung.</dd>
               </div>
               <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
                 <dt className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Welche Fördermöglichkeiten gibt es für Sicherheitstechnik?</dt>
                 <dd className="mt-2 text-[oklch(0.32_0.02_260)]">Die KfW (Kreditanstalt für Wiederaufbau) bietet Zuschüsse für den Einbau von einbruchhemmenden Türen, Fenstern, Gittern und Rolläden sowie für Einbruchs- und Überfallmeldeanlagen. Die Antragstellung muss zwingend vor Beginn der Maßnahmen erfolgen. Wir unterstützen Sie bei der Zusammenstellung der notwendigen technischen Nachweise.</dd>
               </div>
             </dl>
          </div>

          <div className="sticky top-8">
            <ServiceBudgetCalculator />
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
  );
}
