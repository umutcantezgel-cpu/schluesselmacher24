import type { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';

import { getPageContent, getServicePages } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { cn } from '@/lib/cn';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
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

      {/* Fachlicher Deep Dive (Content Expansion > 800 Wörter) */}
      <Section id="architektur-methodik">
        <SectionHeading
          nummer="04"
          eyebrow="Tiefenanalyse & Methodik"
          title="Umfassende Sicherheitsarchitektur und methodische Projektierung im Detail"
          lead="Erfahren Sie, wie wir bei der Planung, Konzeption und Umsetzung moderner Sicherheitslösungen vorgehen und welche technologischen Standards für einen lückenlosen Objektschutz entscheidend sind."
        />

        <div className="mt-12 max-w-3xl space-y-8 text-[oklch(0.32_0.02_260)] leading-relaxed">
          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Fundierte Risikoanalyse und Bedrohungsmodellierung</h3>
          <p>
            Moderne Sicherheitstechnik beginnt lange vor der Installation der ersten Kamera oder dem Einbau des ersten Schließzylinders.
            Der Grundstein eines jeden erfolgreichen Projekts liegt in der detaillierten Risikoanalyse. Wir betrachten Objekte nicht
            isoliert, sondern im Kontext ihrer Umgebung. Dabei analysieren wir potenzielle Angriffsvektoren systematisch.
            Ein Einfamilienhaus in einer ruhigen Vorstadtsiedlung weist ein anderes Risikoprofil auf als ein Gewerbebetrieb im Industriegebiet.
            Unsere Methodik orientiert sich an etablierten Standards und berücksichtigt nicht nur offensichtliche Schwachstellen wie
            Haupteingänge, sondern auch Nebeneingänge, Lichtschächte, Dachzugänge und die Perimetersicherheit.
          </p>
          <p>
            Die Bedrohungsmodellierung umfasst die Kategorisierung möglicher Täterprofile – vom Gelegenheitseinbrecher bis hin zum
            organisierten Beschaffungskriminellen. Abhängig von den identifizierten Risiken definieren wir gemeinsam mit Ihnen das
            angestrebte Schutzniveau. Dieses Schutzniveau determiniert die Auswahl der technischen Komponenten und deren Widerstandsklassen
            (Resistance Classes, RC). Eine durchdachte Konzeption vermeidet sowohl gefährliche Sicherheitslücken als auch unnötige
            Überinvestitionen in nicht bedarfsgerechte Technik.
          </p>

          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Mechanischer Grundschutz als Fundament</h3>
          <p>
            Trotz der rasanten Entwicklung elektronischer Systeme bleibt der mechanische Grundschutz das unersetzliche Fundament
            jeder Sicherheitsarchitektur. Elektronik meldet, Mechanik leistet Widerstand. Einbruchmeldeanlagen können Täter abschrecken
            und Interventionskräfte alarmieren, aber nur solide Mechanik kann den physischen Zutritt zeitlich relevant verzögern.
            Wir setzen auf zertifizierte Schließzylinder mit Bohrschutz, Ziehschutz und komplexen Profilen, die gängigen Manipulationsmethoden
            wie Picking oder Schlagschlüsseln effektiv widerstehen.
          </p>
          <p>
            Dazu gehören auch massive Sicherheitsbeschläge, Mehrfachverriegelungen in den Türen und Zusatzschlösser.
            Bei Fenstern – den häufigsten Angriffszielen – implementieren wir Pilzkopfverriegelungen und abschließbare Fenstergriffe
            mit einem entsprechenden Drehwiderstand. Die mechanischen Barrieren zwingen den Täter zu mehr Zeitaufwand und Lärmentwicklung,
            was das Entdeckungsrisiko signifikant erhöht und in den meisten Fällen zum Abbruch des Versuchs führt.
          </p>

          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Integration elektronischer Assistenz- und Detektionssysteme</h3>
          <p>
            Auf dem mechanischen Fundament bauen wir die elektronische Überwachung auf. Moderne Einbruchmeldeanlagen (EMA) sind heute
            komplexe Netzwerke aus Sensoren und Aktoren. Wir unterscheiden zwischen Außenhautüberwachung und Raumüberwachung.
            Die Außenhautüberwachung mittels Magnetkontakten und Glasbruchmeldern an Fenstern und Türen alarmiert, noch bevor der Täter
            das Objekt betritt. Die Raumüberwachung durch Dual-Bewegungsmelder (Infrarot und Mikrowelle) dient als zweite Verteidigungslinie.
          </p>
          <p>
            Diese Systeme sind redundant ausgelegt und verfügen über Notstromversorgungen, um auch bei Sabotage oder Stromausfall
            funktionsfähig zu bleiben. Die Signalverarbeitung erfolgt verschlüsselt, um Replay-Angriffe oder Signal-Jamming zu verhindern.
            Intelligente Algorithmen in den Meldern unterscheiden zuverlässig zwischen echten Bedrohungen und Störfaktoren
            wie Haustieren oder Zugluft, was die Falschalarmquote minimiert.
          </p>

          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Videosicherheit und Verifikation</h3>
          <p>
            Die Videotechnik hat in den letzten Jahren einen enormen Evolutionssprung vollzogen. Hochauflösende IP-Kameras liefern
            nicht nur Beweismaterial im Nachhinein, sondern ermöglichen durch Video-Analyse (VCA) die aktive Detektion von Eindringlingen.
            Künstliche Intelligenz klassifiziert Objekte in Echtzeit und filtert irrelevante Bewegungen wie schwankende Bäume
            oder wechselnde Lichtverhältnisse heraus.
          </p>
          <p>
            Ein entscheidender Vorteil moderner Videosysteme ist die Alarmverifikation. Löst ein Sensor der Einbruchmeldeanlage aus,
            kann durch den sofortigen Zugriff auf die Kamerasituation bewertet werden, ob ein Echt- oder Falschalarm vorliegt.
            Dies ist für die schnelle Einleitung polizeilicher Maßnahmen von unschätzbarem Wert. Bei der Projektierung von Videosystemen
            achten wir streng auf die Einhaltung datenschutzrechtlicher Vorgaben, maskieren öffentliche Bereiche und definieren
            klare Löschfristen für die Aufzeichnungen.
          </p>

          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Elektronische Zutrittskontrolle als zentrales Nervensystem</h3>
          <p>
            In gewerblichen Objekten, aber zunehmend auch im privaten Sektor, ersetzt die elektronische Zutrittskontrolle den klassischen
            Schlüssel. Systeme auf Basis von RFID (Mifare DESFire), Bluetooth Low Energy (BLE) oder biometrischen Merkmalen bieten eine
            Flexibilität, die mechanische Anlagen nicht leisten können. Geht ein Transponder verloren, wird dieser im System gesperrt –
            ein teurer Austausch von Schließzylindern entfällt.
          </p>
          <p>
            Wir implementieren zonenbasierte Zutrittskonzepte, bei denen berechtigten Personen nur zu bestimmten Zeiten Zugang zu
            definierten Bereichen gewährt wird. Die lückenlose Protokollierung der Zutrittsereignisse schafft Transparenz und
            erleichtert die Aufklärung von Vorfällen. Die Integration der Zutrittskontrolle mit der Einbruchmeldeanlage ermöglicht
            komfortable Szenarien, wie die automatische Unscharfschaltung beim berechtigten Betreten.
          </p>

          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Matrix der Schutzklassen</h3>
          <div className="my-8 overflow-hidden rounded-xl border border-[oklch(0.89_0.008_260/0.55)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[oklch(0.968_0.004_260)] text-[oklch(0.16_0.02_260)]">
                <tr>
                  <th className="p-4 font-semibold">Schutzstufe</th>
                  <th className="p-4 font-semibold">Mechanik (RC-Klasse)</th>
                  <th className="p-4 font-semibold">Elektronik & Sensorik</th>
                  <th className="p-4 font-semibold">Empfohlener Einsatzbereich</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.32_0.02_260)]">
                <tr>
                  <td className="p-4">Basis-Schutz</td>
                  <td className="p-4">RC 1 N / RC 2 N</td>
                  <td className="p-4">Stand-Alone Melder, lokale Alarmierung</td>
                  <td className="p-4">Wohnungen in Obergeschossen</td>
                </tr>
                <tr>
                  <td className="p-4 bg-[oklch(0.988_0.002_260)]">Erweiterter Schutz</td>
                  <td className="p-4 bg-[oklch(0.988_0.002_260)]">RC 2</td>
                  <td className="p-4 bg-[oklch(0.988_0.002_260)]">App-gesteuerte EMA, Außenhautüberwachung</td>
                  <td className="p-4 bg-[oklch(0.988_0.002_260)]">Einfamilienhäuser, Erdgeschosswohnungen</td>
                </tr>
                <tr>
                  <td className="p-4">Hochsicherheit</td>
                  <td className="p-4">RC 3 / RC 4</td>
                  <td className="p-4">Redundante EMA, Video-Verifikation, Aufschaltung</td>
                  <td className="p-4">Gewerbe, gehobener Privatbereich, Wertezentren</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Häufig gestellte Fragen (FAQ)</h3>
          <dl className="mt-6 space-y-6">
            <div>
              <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Welche Zertifizierungen sind für Einbruchmeldeanlagen relevant?</dt>
              <dd className="mt-2 text-[oklch(0.32_0.02_260)]">Wir richten uns strikt nach den VdS-Richtlinien und der DIN EN 50131. Diese Normen definieren die Anforderungen an die Geräte, die Planung und die Installation. Versicherungen fordern bei gewerblichen Objekten oft eine zertifizierte Anlage für den Versicherungsschutz.</dd>
            </div>
            <div>
              <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Wie aufwendig ist die Nachrüstung in einem Bestandsbau?</dt>
              <dd className="mt-2 text-[oklch(0.32_0.02_260)]">Dank moderner und sicherer Funktechnologie (z. B. auf 868 MHz Basis) lassen sich viele Systeme heute ohne aufwendige Kabelverlegung nachrüsten. Die Komponenten sind batteriebetrieben und kommunizieren verschlüsselt mit der Zentrale. Für den mechanischen Schutz bieten wir spezielle Nachrüstprodukte nach DIN 18104 an.</dd>
            </div>
            <div>
              <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Wie sicher sind smarte Schlösser gegen Hacking?</dt>
              <dd className="mt-2 text-[oklch(0.32_0.02_260)]">Wir verwenden ausschließlich Systeme, die auf modernsten Verschlüsselungsstandards (wie AES-256) basieren und regelmäßige Firmware-Updates erhalten. Zusätzlich achten wir darauf, dass die Systeme auch offline funktionieren, um die Abhängigkeit von Cloud-Diensten zu reduzieren.</dd>
            </div>
            <div>
              <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Gibt es staatliche Förderungen für den Einbau von Sicherheitstechnik?</dt>
              <dd className="mt-2 text-[oklch(0.32_0.02_260)]">Ja, die KfW (Kreditanstalt für Wiederaufbau) fördert Maßnahmen zum Einbruchschutz im Rahmen bestehender Programme (z. B. 455-E). Wichtig ist, dass die Antragstellung vor Beginn der Maßnahmen erfolgt und die Installation durch einen Fachbetrieb durchgeführt wird.</dd>
            </div>
            <div>
              <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Wie oft muss eine Anlage gewartet werden?</dt>
              <dd className="mt-2 text-[oklch(0.32_0.02_260)]">Wir empfehlen eine jährliche Wartung durch unsere Techniker. Bei VdS-zertifizierten Anlagen oder im gewerblichen Bereich kann eine häufigere Überprüfung vorgeschrieben sein. Bei der Wartung werden unter anderem Batterien getauscht, Sensoren kalibriert und die Signalwege überprüft.</dd>
            </div>
          </dl>

          <div className="mt-16">
            <ServiceBudgetCalculator />
          </div>
        </div>
      </Section>

      <Section tone="muted" tight>
        <SectionHeading nummer="05" eyebrow="Weiterlesen" title="Passende Seiten" />

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
    </>
  );
}
