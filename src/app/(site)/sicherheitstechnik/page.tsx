import type { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';
import { SicherheitsAuditSimulator } from '@/components/sicherheitstechnik/sicherheits-audit-simulator';

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


      <Section id="methodik-und-architektur">
        <SectionHeading
          nummer="01b"
          eyebrow="Architektur & Methodik"
          title="Tiefgehende Analyse: Wie wir Sicherheitstechnik denken"
          lead="Moderne Sicherheitstechnik ist kein Produkt von der Stange. Es ist eine Architektur aus ineinandergreifenden Systemen, die auf die spezifischen Schwachstellen und Anforderungen Ihres Objekts zugeschnitten sein muss."
        />
        <div className="mt-8 space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed max-w-4xl">
          <p>
            Sicherheit beginnt weit vor der Installation der ersten Kamera oder des ersten Sensors. Sie beginnt mit einer schonungslosen Analyse der Ist-Situation. Wir betrachten Gebäude nicht als isolierte Hüllen, sondern als komplexe Systeme mit spezifischen Risikoprofilen. Jeder Zugangspunkt, jede Fensterfront, jeder Lichtschacht und sogar die umgebende Topographie spielen eine entscheidende Rolle bei der Konzeption einer effektiven Sicherheitsarchitektur.
          </p>
          <p>
            Unsere Methodik basiert auf dem Prinzip der <strong>mehrstufigen Perimeterverteidigung</strong> (Defense in Depth). Dies bedeutet, dass wir nicht auf eine einzige, möglicherweise überwindbare Barriere vertrauen. Stattdessen konzipieren wir ein System aus konzentrischen Sicherheitsringen, die von der Grundstücksgrenze bis in das Allerheiligste des Gebäudes reichen. Die äußere Hülle &ndash; die Freifläche &ndash; wird durch intelligente Videoanalyse und Infrarot-Lichtschranken gesichert, die bereits Alarm schlagen, bevor ein Täter das Gebäude überhaupt berührt.
          </p>
          <p>
            Der zweite Ring ist die Gebäudeaußenhaut. Hier kombinieren wir <em>mechanischen Hochsicherheitsschutz</em> (etwa durch Pilzkopfverriegelungen, Sicherheitsbeschläge und durchwurfhemmende Verglasung) mit <em>elektronischer Überwachung</em> (Glasbruchsensoren, Öffnungskontakte und Erschütterungssensoren). Der mechanische Schutz zwingt den Täter zum Einsatz von schwerem Werkzeug und kostet ihn wertvolle Zeit. Die elektronische Sensorik registriert diesen Versuch sofort und löst einen Voralarm aus, noch bevor die mechanische Barriere überwunden ist.
          </p>
          <p>
            Der innere Ring schließlich umfasst die volumetrische Raumüberwachung (z. B. durch Dual-Melder, die Infrarot- und Mikrowellentechnologie kombinieren, um Fehlalarme durch Haustiere oder Zugluft zu minimieren), gezielte Fallenüberwachung an kritischen Durchgängen und den Schutz von Wertbehältnissen. Diese drei Ringe müssen nicht nur physisch existieren, sondern auch logisch und signaltechnisch über eine redundante, nach EN 50131 zertifizierte Gefahrenmeldezentrale miteinander verschmolzen werden.
          </p>

          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-12 mb-4">Vergleichsmatrix: Sicherheitsstufen im Überblick</h3>
          <div className="overflow-x-auto rounded-xl border border-[oklch(0.89_0.008_260/0.55)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[oklch(0.968_0.004_260)] text-[oklch(0.16_0.02_260)]">
                <tr>
                  <th className="p-4 font-semibold border-b border-[oklch(0.89_0.008_260/0.55)]">Kriterium</th>
                  <th className="p-4 font-semibold border-b border-l border-[oklch(0.89_0.008_260/0.55)]">Basis-Schutz (Privat)</th>
                  <th className="p-4 font-semibold border-b border-l border-[oklch(0.89_0.008_260/0.55)]">Erweiterter Schutz (Gewerbe)</th>
                  <th className="p-4 font-semibold border-b border-l border-[oklch(0.89_0.008_260/0.55)]">Maximal-Schutz (Hochrisiko)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
                <tr>
                  <td className="p-4 font-medium text-[oklch(0.16_0.02_260)]">Perimeterschutz</td>
                  <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)]">Außenbeleuchtung, einfache Zäune</td>
                  <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)]">Lichtschranken, Videoüberwachung</td>
                  <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)]">Thermal-Kameras mit KI-Analyse, Radarsysteme</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[oklch(0.16_0.02_260)]">Außenhautsicherung</td>
                  <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)]">RC2-Beschläge an Fenstern/Türen im EG</td>
                  <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)]">RC3, aktive Glasbruchmelder, Magnetkontakte an allen Zugängen</td>
                  <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)]">RC4+, Körperschallmelder, biometrische Zutrittskontrolle</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[oklch(0.16_0.02_260)]">Alarmaufschaltung</td>
                  <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)]">Lokaler Alarm (Sirene) &amp; App-Benachrichtigung</td>
                  <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)]">VdS-anerkannte Notruf- und Serviceleitstelle (NSL)</td>
                  <td className="p-4 border-l border-[oklch(0.89_0.008_260/0.55)]">Redundante NSL-Aufschaltung mit Live-Täteransprache</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-12 mb-4">Häufig gestellte Fragen (FAQ) zur Sicherheitstechnik</h3>
          <div className="space-y-6">
            <div className="border-l-2 border-[oklch(0.52_0.24_260)] pl-4">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">1. Wie unterscheidet sich eine zertifizierte Alarmanlage von Smart-Home-Lösungen aus dem Baumarkt?</h4>
              <p className="mt-2">Smart-Home-Systeme nutzen oft offene Funkprotokolle (wie WLAN oder Zigbee), die extrem störanfällig sind und sich leicht mit sogenannten Jammern blockieren lassen. Zudem fehlt ihnen die Notstromversorgung für längere Stromausfälle und die Sabotageüberwachung der einzelnen Komponenten. Zertifizierte Anlagen (nach EN 50131 oder VdS) arbeiten mit verschlüsselten, dedizierten Frequenzen, verfügen über redundante Übertragungswege (GSM/IP) und erkennen jeden Versuch der Manipulation sofort, selbst wenn sie unscharf geschaltet sind.</p>
            </div>
            <div className="border-l-2 border-[oklch(0.52_0.24_260)] pl-4">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">2. Ist eine Videoüberwachung bei Dunkelheit überhaupt nützlich?</h4>
              <p className="mt-2">Absolut, sofern die richtige Technologie eingesetzt wird. Herkömmliche Infrarot-Kameras liefern nachts oft nur ein verrauschtes Schwarz-Weiß-Bild, auf dem Personen schwer zu identifizieren sind. Wir setzen auf Kameras mit ColorVu-Technologie für farbige Nachtsicht bei minimalem Restlicht, oder auf Thermalkameras, die ausschließlich Wärmesignaturen erfassen und somit selbst bei absolutem Null-Licht, Nebel oder dichtem Regen zuverlässig Bewegungen detektieren, ohne von Autoscheinwerfern geblendet zu werden.</p>
            </div>
            <div className="border-l-2 border-[oklch(0.52_0.24_260)] pl-4">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">3. Was passiert, wenn die Internetverbindung unterbrochen wird?</h4>
              <p className="mt-2">Professionelle Systeme sind genau für diesen Fall ausgelegt. Sie verfügen über ein redundantes Übertragungskonzept (Dual-Path-Übertragung). Fällt das stationäre IP-Netzwerk aus, schaltet die Anlage ohne Verzögerung auf das integrierte LTE-Modul um (mit Roaming-SIM für höchste Netzverfügbarkeit). Die Leitstelle überwacht zudem die regelmäßigen Routine-Meldungen (Polling) der Anlage. Bleibt ein solches Lebenszeichen aus, wird sofort eine Störungsmeldung generiert.</p>
            </div>
            <div className="border-l-2 border-[oklch(0.52_0.24_260)] pl-4">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">4. Lassen sich Haustiere mit einer Alarmanlage vereinbaren?</h4>
              <p className="mt-2">Ja, problemlos. Wir nutzen sogenannte &quot;tierimmune&quot; Bewegungsmelder. Diese arbeiten oft mit Dual-Technologie (Passiv-Infrarot gekoppelt mit Mikrowelle) und intelligenter Signalverarbeitung. Der Sensor ist in der Lage, die Masse und das Bewegungsmuster eines Hundes oder einer Katze (bis ca. 30 kg) von einem aufrecht gehenden Menschen zu unterscheiden. Alternativ können wir die Überwachung in Räumen mit Haustieren auf die Außenhaut (Fenster- und Türkontakte) beschränken, sodass das Tier sich im Raum frei bewegen kann.</p>
            </div>
            <div className="border-l-2 border-[oklch(0.52_0.24_260)] pl-4">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">5. Wie hoch ist der Wartungsaufwand für eine komplexe Sicherheitsanlage?</h4>
              <p className="mt-2">Die Anlage selbst ist äußerst wartungsarm, da sie permanente Eigendiagnosen durchführt (Batteriestand, Funkstreckenqualität, Sabotagekontakte). Für den Erhalt des Versicherungsschutzes und der VdS-Anerkennung ist jedoch eine jährliche Inspektion durch den Errichter vorgeschrieben. Dabei reinigen wir optische Sensoren, prüfen die Akkus der Zentrale (die alle 3-4 Jahre getauscht werden müssen), messen die Widerstandswerte der Melderlinien und simulieren einen Echt-Alarm, um die Kette bis zur Leitstelle zu verifizieren.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-4xl">
          <SicherheitsAuditSimulator />
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
    </>
  );
}
