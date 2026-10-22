import type { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';

import { getPageContent, getServicePages } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';
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

      {/* EXPANDED CONTENT AREA */}
      <Section id="architectural-methodology">
        <SectionHeading
          nummer="01a"
          eyebrow="Architektonische Methodik"
          title="Tiefgehende Analyse und Konzeption"
          lead="Wir verstehen Sicherheitstechnik nicht als reine Produktinstallation, sondern als integrierte Systemarchitektur."
        />

        <div className="mt-12 text-[oklch(0.32_0.02_260)] leading-relaxed space-y-6 max-w-4xl mx-auto">
          <p>
            Moderne Sicherheitstechnik erfordert einen ganzheitlichen Ansatz. Es reicht nicht aus, Kameras aufzuhängen oder einen Alarmtaster zu installieren. Die wahre Stärke eines Systems zeigt sich in der nahtlosen Integration der einzelnen Komponenten. Unsere Methodik basiert auf einer detaillierten Risikoanalyse, bei der wir die spezifischen Anforderungen Ihres Objekts evaluieren. Wir betrachten Einbruchhemmung, Zutrittskontrolle, Videoüberwachung und Alarmtechnik als Bausteine eines umfassenden Sicherheitskonzepts.
          </p>
          <p>
            Ein zentraler Aspekt unserer Planung ist die <strong>mechanische Grundsicherung</strong>. Elektronische Systeme können Alarm schlagen, aber sie können einen physischen Angriff nicht verzögern. Die mechanische Sicherheit bildet das Fundament. Erst wenn Fenster und Türen einen definierten Widerstandswert aufweisen, ist der Einsatz von Sensorik sinnvoll. Wir analysieren Schließzylinder, Beschläge, Schließbleche und Bandseitensicherungen. Jede Schwachstelle in der Gebäudehülle wird identifiziert und in das Gesamtkonzept integriert.
          </p>
          <p>
            Die <strong>elektronische Überwachung</strong> baut auf diesem Fundament auf. Hierbei setzen wir auf hochauflösende IP-Kameras mit intelligenter Videoanalyse. Diese Systeme können nicht nur Bewegungen erkennen, sondern auch zwischen Menschen, Tieren und Fahrzeugen unterscheiden. Dadurch reduzieren wir Fehlalarme auf ein absolutes Minimum. Die Datenübertragung erfolgt stets verschlüsselt und entspricht den höchsten Standards der Datensicherheit. Ein manipulationssicheres Netzwerk ist die Voraussetzung für einen zuverlässigen Betrieb.
          </p>
          <p>
            Ein weiterer Pfeiler unserer Methodik ist die <strong>Alarmierung und Intervention</strong>. Ein Alarm ist wertlos, wenn er nicht die richtigen Reaktionen auslöst. Wir projektieren die Aufschaltung auf zertifizierte Notruf- und Serviceleitstellen (NSL). Im Alarmfall erfolgt eine sofortige Verifikation durch die Leitstelle, beispielsweise durch den Zugriff auf die Videokameras. So können Einsatzkräfte gezielt alarmiert werden. Die redundante Signalübertragung über IP und Mobilfunk stellt sicher, dass der Alarm auch bei Ausfall des primären Netzwerks übertragen wird.
          </p>

          <h3 className="text-[oklch(0.16_0.02_260)] text-xl font-semibold mt-12 mb-4">Leistungsstufen und Vergleichsmatrix</h3>
          <p>
            Um Ihnen größtmögliche Transparenz zu bieten, haben wir unsere Lösungen in klar definierte Leistungsstufen unterteilt. Jede Stufe baut auf der vorherigen auf und adressiert spezifische Gefährdungspotenziale.
          </p>

          <div className="overflow-x-auto mt-8 mb-12">
            <table className="w-full border-collapse border border-[oklch(0.89_0.008_260/0.55)]">
              <thead>
                <tr className="bg-[oklch(0.968_0.004_260)]">
                  <th className="p-4 text-left border-b border-[oklch(0.89_0.008_260/0.55)] font-semibold text-[oklch(0.16_0.02_260)]">Feature</th>
                  <th className="p-4 text-left border-b border-[oklch(0.89_0.008_260/0.55)] font-semibold text-[oklch(0.16_0.02_260)]">Basis (Grundschutz)</th>
                  <th className="p-4 text-left border-b border-[oklch(0.89_0.008_260/0.55)] font-semibold text-[oklch(0.16_0.02_260)]">Erweitert (Pro)</th>
                  <th className="p-4 text-left border-b border-[oklch(0.89_0.008_260/0.55)] font-semibold text-[oklch(0.16_0.02_260)]">Maximal (Enterprise)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Mechanische Absicherung</td>
                  <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Standard (RC2 analog)</td>
                  <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Erhöht (RC3 analog)</td>
                  <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Maximal (RC4 analog)</td>
                </tr>
                <tr className="bg-[oklch(0.988_0.002_260)]">
                  <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Videoüberwachung</td>
                  <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Eingangsbereich (HD)</td>
                  <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Vollflächig (4K, KI-Analyse)</td>
                  <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Thermalkameras & Radar</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Alarmaufschaltung</td>
                  <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">Lokal (Sirene)</td>
                  <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">NSL (Einfacher Pfad)</td>
                  <td className="p-4 border-b border-[oklch(0.89_0.008_260/0.55)]">NSL (Redundant IP+LTE)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-[oklch(0.16_0.02_260)] text-xl font-semibold mt-12 mb-4">Umfassende FAQ zur Sicherheitstechnik</h3>
          <div className="space-y-6">
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-xl bg-[oklch(0.988_0.002_260)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">1. Wie hoch sind die initialen Kosten für ein professionelles System?</h4>
              <p className="text-[oklch(0.32_0.02_260)]">Die Kosten variieren stark nach Objektgröße und Schutzbedarf. Ein grundlegendes System beginnt oft im mittleren vierstelligen Bereich. Nutzen Sie unseren Budget-Kalkulator weiter unten auf dieser Seite für eine erste Einschätzung. Wir empfehlen stets eine Vor-Ort-Analyse für ein belastbares Angebot.</p>
            </div>
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-xl bg-[oklch(0.988_0.002_260)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">2. Ist eine kabellose (Funk-) Alarmanlage sicher?</h4>
              <p className="text-[oklch(0.32_0.02_260)]">Moderne professionelle Funksysteme nutzen verschlüsselte Frequenzen und bidirektionale Kommunikation. Sie sind gegen Jamming (Störsender) geschützt und melden Sabotageversuche sofort. Für die höchste Sicherheitsstufe (VdS Klasse C) sind jedoch oft kabelgebundene Systeme vorgeschrieben.</p>
            </div>
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-xl bg-[oklch(0.988_0.002_260)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">3. Welche Datenschutzrichtlinien gelten für Kameras?</h4>
              <p className="text-[oklch(0.32_0.02_260)]">Im privaten Bereich dürfen Sie Ihr eigenes Grundstück überwachen. Öffentliche Bereiche wie Gehwege dürfen nicht erfasst werden. Im gewerblichen Bereich (DSGVO) sind strenge Vorgaben bezüglich Hinweisschildern, Zweckbindung und Löschfristen einzuhalten. Wir unterstützen Sie bei der datenschutzkonformen Einrichtung (ohne Rechtsberatung).</p>
            </div>
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-xl bg-[oklch(0.988_0.002_260)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">4. Was passiert bei einem Stromausfall?</h4>
              <p className="text-[oklch(0.32_0.02_260)]">Professionelle Anlagen verfügen über Notstromakkus, die den Betrieb für mindestens 12 bis 60 Stunden aufrechterhalten. Auch die Kommunikationsmodule zur Leitstelle sind gepuffert. Ein Sabotagealarm wird auch bei Stromausfall abgesetzt.</p>
            </div>
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-xl bg-[oklch(0.988_0.002_260)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">5. Wie oft muss das System gewartet werden?</h4>
              <p className="text-[oklch(0.32_0.02_260)]">Wir empfehlen eine jährliche Wartung. Dabei werden Akkus geprüft, Sensoren auf Funktion getestet und Firmware-Updates eingespielt. Regelmäßige Wartung ist oft eine Voraussetzung für den Versicherungsschutz und die Aufschaltung auf eine Leitstelle.</p>
            </div>
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-xl bg-[oklch(0.988_0.002_260)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">6. Kann das System in mein Smart Home integriert werden?</h4>
              <p className="text-[oklch(0.32_0.02_260)]">Ja, viele unserer Systeme bieten Schnittstellen (z.B. KNX) für die Hausautomation. So können bei einer Alarmauslösung beispielsweise Lichter eingeschaltet und Rollläden hochgefahren werden. Wir achten jedoch streng darauf, dass die Sicherheitsarchitektur vom restlichen Netzwerk getrennt bleibt, um Manipulationen auszuschließen.</p>
            </div>
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-6 rounded-xl bg-[oklch(0.988_0.002_260)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">7. Wie funktioniert die Alarmverifikation?</h4>
              <p className="text-[oklch(0.32_0.02_260)]">Bei einem Alarmfall (z.B. Auslösen eines Bewegungsmelders) schaltet sich die Leitstelle auf die Kameras auf. So kann sofort geprüft werden, ob ein echter Einbruch oder ein Fehlalarm (z.B. durch ein Tier) vorliegt. Nur bei verifizierten Alarmen wird die Polizei verständigt, was teure Fehleinsätze vermeidet.</p>
            </div>
          </div>

          <p className="mt-8">
            Wir legen größten Wert auf Nachhaltigkeit und Langlebigkeit unserer Installationen. Unsere Partner und Lieferanten sind nach DIN EN ISO 9001 zertifiziert und wir verbauen ausschließlich Komponenten, für die eine langjährige Ersatzteilverfügbarkeit garantiert ist. Dies senkt die Total Cost of Ownership (TCO) erheblich.
          </p>
          <p>
            Die Integration verschiedener Gewerke – von der mechanischen Schließanlage über die elektronische Zutrittskontrolle bis hin zur Videoüberwachung – erfordert ein hohes Maß an technischer Expertise. Unsere Techniker werden fortlaufend geschult und zertifiziert, um stets auf dem neuesten Stand der Technik zu sein. Jedes Projekt wird von einem dedizierten Projektleiter betreut, der als Ihr zentraler Ansprechpartner fungiert. Von der ersten Begehung bis zur finalen Abnahme und Einweisung stehen wir Ihnen mit unserem gesamten Know-how zur Seite.
          </p>
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
           <ServiceBudgetCalculator />
        </div>
      </Section>

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
    </>
  );
}
