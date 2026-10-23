import type { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';

import { getPageContent, getServicePages } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { cn } from '@/lib/cn';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { TUER_SCHUTZ_AUSSCHNITT } from '@/components/visual/generators/tuer-schutz';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { IconAlarmtechnik } from '@/components/visual/icons/alarmtechnik';
import { IconAussenhautsicherung } from '@/components/visual/icons/aussenhautsicherung';
import { IconKombinierteKonzepte } from '@/components/visual/icons/kombinierte-konzepte';
import { IconMechanischerSchutz } from '@/components/visual/icons/mechanischer-schutz';
import { IconPanikAlarmtaster } from '@/components/visual/icons/panik-alarmtaster';
import { IconSmarteFunktionen } from '@/components/visual/icons/smarte-funktionen';
import { IconVideoueberwachung } from '@/components/visual/icons/videoueberwachung';

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

/** Fach-Icon je Leistung — rein dekorativ, die Inhalte kommen aus der Datenschicht. */
const SERVICE_ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  videoueberwachung: IconVideoueberwachung,
  alarmtechnik: IconAlarmtechnik,
  aussenhautsicherung: IconAussenhautsicherung,
  'mechanischer-schutz': IconMechanischerSchutz,
  'smarte-funktionen': IconSmarteFunktionen,
  'panik-und-alarmtaster': IconPanikAlarmtaster,
  'kombinierte-konzepte': IconKombinierteKonzepte,
};

/** Der Grundsatz, nach dem wir die Bereiche zusammenstellen. */
/** Abschnitt 04: Grundlage und Einstieg, mit denselben Texten wie bisher in den Karten. */
const WEITER = [
  {
    etikett: 'Grundschutz zuerst',
    titel: 'Tür- und Schließtechnik',
    text: 'Zylinder, Schlösser, Beschläge und Zusatzsicherungen sind die Grundlage. Erst darauf setzen wir Melde- und Alarmtechnik auf.',
    href: '/tuer-und-schliesstechnik',
    link: 'Zur Tür- und Schließtechnik',
  },
  {
    etikett: 'Bestandsaufnahme',
    titel: 'Sicherheitscheck',
    text: 'Zehn Schritte zu Objekt, Zugängen, vorhandener Technik, Schwerpunkten und Unterlagen. Ihr Zwischenstand bleibt erhalten.',
    href: `/${ROUTE}/sicherheitscheck`,
    link: 'Sicherheitscheck starten',
  },
] as const;

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
  /* Verweise der Redaktion ohne die Ziele, die Abschnitt 04 schon zeigt. */
  const weitereLinks = (page?.seo.internalLinks ?? []).filter(
    (link) => !WEITER.some((eintrag) => eintrag.href === link.href),
  );

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

      {/* Kopf: Fach-Icon als Anker und Ziel des Seitenwechsels (B-13) */}
      <PageHeader
        bereich="sicherheitstechnik"
        eyebrow="Leistungsbereich"
        title={page?.headline ?? 'Sicherheitstechnik'}
        lead={page?.subline}
        crumbs={[{ href: `/${ROUTE}`, label: 'Sicherheitstechnik' }]}
        actions={
          <ButtonLink href={`/${ROUTE}/sicherheitscheck`} size="lg" pfeil>
            Sicherheitscheck starten
          </ButtonLink>
        }
      />

      {/* 01 Grundsatz: Kopf links, nummerierte Stückliste rechts */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <SectionHeading
            className="lg:col-span-5"
            nummer="01"
            eyebrow="Einordnung"
            title="Mechanik hält auf, Meldetechnik erkennt, Alarmierung informiert"
            lead={page?.intro}
          />

          <ol className="border-t border-border lg:col-span-7">
            {PRINCIPLE.map((item, index) => (
              <li key={item.term} className="group relative border-b border-border">
                {/* Die ganze Zeile ist der Link: ein Link deckt die Zeile ab, sein Name ist nur das Linkziel. */}
                <Link
                  href={item.href}
                  className="absolute inset-0 rounded-lg"
                >
                  <span className="sr-only">{item.linkLabel}</span>
                </Link>
                <div className="pointer-events-none grid grid-cols-12 gap-x-4 py-6">
                  <span className="col-span-2 font-mono text-title font-semibold tabular-nums text-area-strong sm:col-span-1">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="col-span-10 sm:col-span-11">
                    <p className="text-title-sm font-semibold text-foreground transition-colors duration-quick group-hover:text-area-strong">
                      {item.term}
                    </p>
                    <p className="mt-2 max-w-measure text-body text-foreground-muted">
                      {item.body}
                    </p>
                    <span className="mt-4 inline-flex min-h-touch items-center gap-1.5 text-small font-semibold text-primary">
                      {item.linkLabel}
                      <GlyphPfeilRechts
                        size={16}
                        className="transition-transform duration-quick group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Hauseingang als Blickfang, daneben der Ablauf als Schriftfeld */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <div className="lg:col-span-7">
            <ImagePlaceholder
              slot={{
                motif: 'Objektfoto: Hauseingang mit Außenkamera, Türkontakt und Sicherheitsbeschlag',
                ratio: '4/3',
                note: 'Eigene Aufnahme aus einem abgeschlossenen Projekt. Kein Stockfoto.',
                visual: { generator: 'tuer-schutz', params: {} },
              }}
              ausschnitt={TUER_SCHUTZ_AUSSCHNITT}
            />
          </div>

          <div className="border-y border-border py-6 lg:col-span-5">
            <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
              Ablauf in diesem Bereich
            </p>
            <p className="mt-2 text-title-sm font-semibold text-foreground">{process.label}</p>
            <p className="mt-2 max-w-measure text-small text-foreground-muted">{process.hint}</p>
            <div className="mt-5">
              <ButtonLink href={`/${ROUTE}/sicherheitscheck`} variant="outline">
                Bestandsaufnahme starten
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* 02 Bereiche: Raster mit Haarlinien wie die Tür- und Schließtechnik */}
      <Section tone="muted">
        <SectionHeading
          nummer="02"
          eyebrow="Bereiche"
          title="Sieben Bereiche, die zusammen gedacht werden"
          lead="Einzeln betrachtet bleibt jeder Bereich Stückwerk. Welche Kombination zu Ihrem Objekt passt, klären wir in der Bestandsaufnahme."
        />

        <ul className="mt-12 grid border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = SERVICE_ICONS[service.slug];
            const anzahl = services.length;
            const letzte = index === anzahl - 1;
            /* Die letzte Zelle füllt die Restzeile: bei 2 Spalten (sm) und 3 Spalten (lg)
               bleibt keine Zelle allein stehen. Ist sie breiter, liegt Icon neben Text. */
            const breitSm = letzte && anzahl % 2 === 1;
            const breitLg = letzte && anzahl % 3 !== 0;
            return (
              <li
                key={service.id}
                className={cn(
                  'border-b border-border',
                  index % 2 === 1 ? 'sm:border-l' : 'sm:border-l-0',
                  index % 3 === 0 ? 'lg:border-l-0' : 'lg:border-l',
                  breitSm ? 'sm:col-span-2' : 'sm:col-span-1',
                  breitLg ? (anzahl % 3 === 1 ? 'lg:col-span-3' : 'lg:col-span-2') : 'lg:col-span-1',
                )}
              >
                <Link
                  href={`/${ROUTE}/${service.slug}`}
                  className={cn(
                    'group flex h-full flex-col p-6 transition-colors duration-quick hover:bg-area-soft sm:p-8',
                    breitSm && 'sm:flex-row sm:items-center sm:gap-8',
                    breitLg && 'lg:flex-row lg:items-center lg:gap-8',
                    breitSm && !breitLg && 'lg:flex-col',
                  )}
                >
                  {Icon ? (
                    <Icon size={40} className="shrink-0 text-area-strong" />
                  ) : (
                    <BereichIcon area={ROUTE} size={40} className="shrink-0 text-area-strong" />
                  )}
                  <span
                    className={cn(
                      'mt-6 block min-w-0 flex-1',
                      breitSm && 'sm:mt-0',
                      breitLg ? 'lg:mt-0' : breitSm && 'lg:mt-6',
                    )}
                  >
                    <span className="block text-title-sm font-semibold text-foreground transition-colors duration-quick group-hover:text-area-strong">
                      {service.title}
                    </span>
                    <span className="mt-2 block text-small text-foreground-muted">
                      {service.summary}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'mt-6 flex shrink-0 items-center justify-between gap-3',
                      breitSm && 'sm:mt-0',
                      breitLg ? 'lg:mt-0' : breitSm && 'lg:mt-6',
                    )}
                  >
                    <span className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                      Zum Bereich
                    </span>
                    <GlyphPfeilRechts
                      size={18}
                      className="shrink-0 text-foreground-muted transition-transform duration-quick group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* 03 Recht und Verantwortung: Kasten mit Haarlinien */}
      <Section id="recht-und-verantwortung">
        <SectionHeading
          nummer="03"
          eyebrow="Recht und Verantwortung"
          title="Was Sie beim Betrieb von Video, Audio und Protokollen beachten müssen"
          lead="Diese Punkte klären wir vor der Planung, damit die Technik so aufgebaut wird, wie Sie sie später auch betreiben dürfen."
        />

        <div
          role="note"
          className="mt-12 flex max-w-3xl gap-4 rounded-lg border border-border bg-surface p-5 sm:p-6"
        >
          <GlyphInfo size={22} className="mt-1 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-title-sm font-semibold text-foreground">
              Verantwortlich für die Nutzung ist die Betreiberin oder der Betreiber der Anlage
            </p>
            <ul className="mt-4 space-y-3 text-small leading-relaxed text-foreground-muted">
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

            <p className="mt-4">
              <Link
                href="/rechtliches/datenschutz"
                className="inline-flex min-h-touch items-center font-semibold text-primary hover:underline"
              >
                Hinweise zum Datenschutz
              </Link>
            </p>
          </div>
        </div>
      </Section>

      {/* 04 · Weiterlesen: Grundschutz und Bestandsaufnahme als Stückliste, darunter die
          Seitenverweise aus der Redaktion als Haarlinienzeilen */}
      <Section tone="muted" tight>
        <SectionHeading nummer="04" eyebrow="Weiterlesen" title="Passende Seiten" />

        <ul className="mt-8 grid border-t border-border md:grid-cols-2">
          {WEITER.map((eintrag, index) => (
            <li
              key={eintrag.href}
              className={cn('border-b border-border py-6 md:px-8', index === 0 ? 'md:pl-0' : 'md:border-l md:pr-0')}
            >
              <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                {eintrag.etikett}
              </p>
              <p className="mt-2 text-title-sm font-semibold text-foreground">{eintrag.titel}</p>
              <p className="mt-2 max-w-measure text-small leading-relaxed text-foreground-muted">{eintrag.text}</p>
              <Link
                href={eintrag.href}
                className="group mt-4 inline-flex min-h-touch items-center gap-1.5 text-small font-semibold text-primary"
              >
                {eintrag.link}
                <GlyphPfeilRechts
                  size={16}
                  className="transition-transform duration-quick ease-standard motion-reduce:transition-none zeiger:group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>

        {weitereLinks.length > 0 && (
          <ul className="mt-8 border-t border-border">
            {weitereLinks.map((link) => (
              <li key={link.href} className="border-b border-border">
                <Link
                  href={link.href}
                  className="group flex min-h-touch items-center justify-between gap-3 py-3 text-small font-semibold text-foreground transition-colors duration-quick hover:text-primary"
                >
                  {link.label}
                  <GlyphPfeilRechts
                    size={16}
                    className="shrink-0 text-primary transition-transform duration-quick ease-standard motion-reduce:transition-none zeiger:group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
      <Section className="py-16 md:py-24 bg-[oklch(0.988_0.002_260)]">
        <div className="max-w-3xl mx-auto">
          <ServiceBudgetCalculator />
        </div>
      </Section>

      <Section className="py-16 md:py-24 lg:py-32 bg-[oklch(0.988_0.002_260)]">
        <SectionHeading title="Architektonische Methodik & Tiefe Fachkompetenz" />
        <div className="mt-8 space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed text-lg max-w-4xl mx-auto">
          <p>
            Moderne Sicherheitstechnik basiert auf einer präzisen architektonischen Methodik, die mechanischen Schutz mit
            elektronischen Kontrollsystemen vereint. Unser ganzheitlicher Ansatz beginnt mit einer detaillierten
            Risikoanalyse der Gebäudeinfrastruktur. Wir bewerten potenzielle Schwachstellen nicht isoliert, sondern als
            Teil eines komplexen Systems, in dem Türen, Fenster, Zutrittspunkte und Überwachungsbereiche nahtlos ineinandergreifen müssen.
            Dabei berücksichtigen wir sowohl die physische Beschaffenheit der Bausubstanz als auch die dynamischen Anforderungen
            des täglichen Betriebs.
          </p>
          <p>
            Die Leistungsarchitektur unserer Systeme ist modular aufgebaut. Die Basisstufe (Tier 1) umfasst grundlegende
            mechanische Sicherungen wie hochsichere Schließzylinder, Pilzkopfverriegelungen und verstärkte Türblätter.
            Darauf aufbauend integriert die erweiterte Stufe (Tier 2) elektronische Zutrittskontrollen und lokale Alarmsysteme,
            die unbefugte Zutrittsversuche sofort detektieren. In der höchsten Stufe (Tier 3) implementieren wir vernetzte
            Gefahrenmeldeanlagen, smarte Videoüberwachung mit KI-basierter Objekterkennung und eine direkte Aufschaltung
            auf zertifizierte Notruf- und Serviceleitstellen. Diese mehrschichtige Struktur garantiert maximale Resilienz.
          </p>
          <p>
            Ein entscheidender Faktor bei der Planung ist die Einhaltung strenger normativer Vorgaben. Unsere Konzepte
            richten sich konsequent nach den Richtlinien des VdS (Vertrauen durch Sicherheit) und der DIN EN-Normen für
            Einbruchhemmung (z. B. DIN EN 1627). Wir stellen sicher, dass alle verbauten Komponenten nicht nur isoliert
            geprüft sind, sondern auch im Verbund zertifiziert bleiben. Dies ist besonders relevant für versicherungstechnische
            Anforderungen und die langfristige Rechtssicherheit für unsere Kunden im gewerblichen wie privaten Sektor.
          </p>
          <p>
            Um Ihnen eine fundierte Entscheidungsgrundlage zu bieten, setzen wir auf transparente Vergleichsmatrizen.
            Diese stellen die verschiedenen Lösungskonzepte hinsichtlich ihres Schutzniveaus, der Installationskomplexität,
            der Wartungsintensität und des finanziellen Investitionsrahmens gegenüber. So können Sie genau evaluieren,
            welches System die optimale Balance zwischen Sicherheit, Komfort und Wirtschaftlichkeit für Ihr spezifisches
            Objekt bietet. Die Matrix berücksichtigt dabei auch die Skalierbarkeit für zukünftige Erweiterungen.
          </p>
          <p>
            Darüber hinaus legen wir großen Wert auf die nahtlose Integration in bestehende Gebäudeautomatisierungssysteme
            (Smart Home / Smart Building). Die Verschmelzung von Sicherheitstechnik und Gebäudesteuerung ermöglicht nicht nur
            einen höheren Bedienkomfort, sondern auch intelligente Synergien – beispielsweise das automatische Verriegeln von
            Türen und Schließen von Rollläden bei Aktivierung der Alarmanlage, oder die bedarfsgesteuerte Ausleuchtung
            potenzieller Gefahrenzonen im Außenbereich bei Bewegungserkennung.
          </p>
          <h3 className="text-2xl font-bold mt-12 mb-6 text-[oklch(0.16_0.02_260)]">Häufig gestellte Fragen (FAQ)</h3>
          <div className="space-y-6">
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-2xl bg-[oklch(0.968_0.004_260)] shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] text-xl">1. Wie lange dauert die Installation eines umfassenden Sicherheitssystems?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">
                Die Dauer hängt stark von der Objektgröße und dem gewählten Schutzniveau ab. Eine Basisabsicherung für ein
                Einfamilienhaus ist oft in 1-2 Tagen abgeschlossen. Komplexe gewerbliche Anlagen mit vernetzter Zutrittskontrolle
                und Videoüberwachung erfordern hingegen eine detaillierte Projektplanung und können mehrere Wochen in Anspruch nehmen.
              </p>
            </div>
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-2xl bg-[oklch(0.968_0.004_260)] shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] text-xl">2. Sind kabellose (Funk-) Alarmanlagen genauso sicher wie kabelgebundene?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">
                Moderne Funk-Alarmanlagen nutzen verschlüsselte Mehrfrequenz-Technologien und bieten ein sehr hohes Sicherheitsniveau,
                das für die meisten privaten und kleingewerblichen Anwendungen absolut ausreichend ist (oft VdS Home oder Klasse A zertifiziert).
                Für höchste Sicherheitsanforderungen (z.B. Banken, Juweliere) sind kabelgebundene Systeme nach VdS Klasse B/C jedoch weiterhin zwingend erforderlich.
              </p>
            </div>
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-2xl bg-[oklch(0.968_0.004_260)] shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] text-xl">3. Welche Wartungsintervalle sind für Sicherheitstechnik vorgeschrieben?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">
                Um die Zuverlässigkeit und gegebenenfalls den Versicherungsschutz aufrechtzuerhalten, empfehlen wir und die
                einschlägigen Normen eine jährliche Wartung durch einen zertifizierten Fachbetrieb. Bei bestimmten Anlagen
                (z.B. Brandmeldeanlagen oder sicherheitskritischen Zutrittskontrollen) können auch vierteljährliche oder
                halbjährliche Prüfungen gesetzlich vorgeschrieben sein.
              </p>
            </div>
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-2xl bg-[oklch(0.968_0.004_260)] shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] text-xl">4. Lässt sich bestehende Mechanik mit neuen elektronischen Systemen kombinieren?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">
                Ja, das ist ein zentraler Bestandteil unseres hybriden Ansatzes. Mechatronische Schließzylinder oder
                elektronische Beschläge lassen sich oft problemlos in bestehende Türen nachrüsten. So können Sie die
                Vorteile elektronischer Zutrittskontrolle (z.B. schnelles Sperren verlorener Schlüssel) nutzen, ohne
                die komplette mechanische Infrastruktur austauschen zu müssen.
              </p>
            </div>
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-2xl bg-[oklch(0.968_0.004_260)] shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] text-xl">5. Was passiert bei einem Stromausfall?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">
                Professionelle Sicherheitssysteme verfügen immer über integrierte Notstromakkus. Diese überbrücken
                Netzausfälle je nach Systemgröße und Konfiguration für mehrere Stunden bis hin zu mehreren Tagen.
                Gleichzeitig wird ein Stromausfall als Störung an die verbundene Leitstelle oder Ihre App gemeldet.
                Mechanische Komponenten wie Schließzylinder funktionieren ohnehin stromlos.
              </p>
            </div>
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-2xl bg-[oklch(0.968_0.004_260)] shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] text-xl">6. Ist mein System gegen Cyberangriffe geschützt?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)]">
                Sicherheit endet heute nicht mehr an der Haustür, sondern schließt das Netzwerk ein. Wir setzen
                ausschließlich auf Systeme mit starker End-to-End-Verschlüsselung (z.B. AES-256), sicheren Authentifizierungsverfahren
                und regelmäßigen Firmware-Updates. Eine Segmentierung des Netzwerks trennt zudem die Sicherheitstechnik
                vom regulären Gast- oder Büronetzwerk, um Angriffsvektoren zu minimieren.
              </p>
            </div>
          </div>
        </div>
      </Section>

    </>
  );
}
