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
import { BereichIcon } from '@/components/visual/bereich-icon';
import { TUER_SCHUTZ_AUSSCHNITT } from '@/components/visual/generators/tuer-schutz';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { GlyphWinkelUnten } from '@/components/visual/glyphen/winkel-unten';
import { IconAlarmtechnik } from '@/components/visual/icons/alarmtechnik';
import { IconAussenhautsicherung } from '@/components/visual/icons/aussenhautsicherung';
import { IconKombinierteKonzepte } from '@/components/visual/icons/kombinierte-konzepte';
import { IconMechanischerSchutz } from '@/components/visual/icons/mechanischer-schutz';
import { IconPanikAlarmtaster } from '@/components/visual/icons/panik-alarmtaster';
import { IconSmarteFunktionen } from '@/components/visual/icons/smarte-funktionen';
import { IconVideoueberwachung } from '@/components/visual/icons/videoueberwachung';

import { SecurityScoreCalculator } from '@/components/calculator/security-score-calculator';


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
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  void resolvedParams;
  void resolvedSearch;




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


      {/* 01B Deep Content: Architektonische Methodik und Matrix */}
      <Section tone="muted">
        <SectionHeading
          nummer="01.5"
          eyebrow="Architektonische Methodik"
          title="Unsere Philosophie der integralen Sicherheitstechnik"
          lead="Ein tiefgreifender Blick auf unsere Planungsprinzipien und die technische Umsetzung moderner Sicherheitskonzepte."
        />
        <div className="mt-12 prose prose-lg max-w-4xl text-[oklch(0.32_0.02_260)] leading-relaxed">
          <p>
            Moderne Sicherheitstechnik ist weit mehr als die bloße Aneinanderreihung von Kameras und Alarmmeldern.
            Sie ist eine hochkomplexe, integrale Architektur, die physische Barrieren, elektronische Sensorik und
            intelligente Steuerungslogik nahtlos miteinander verwebt. Unser Ansatz beruht auf dem Prinzip der
            &quot;Defense in Depth&quot; (Tiefenverteidigung), bei der mehrere unabhängige Schutzschichten kombiniert werden,
            um Single Points of Failure zu eliminieren und eine robuste Gesamtsicherheit zu gewährleisten.
          </p>

          <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-10 mb-4">Die Fundamente: Mechanik trifft auf Mechatronik</h3>
          <p>
            Die Basis jeder effektiven Sicherheitsarchitektur ist die mechanische Widerstandskraft. Zylinder,
            Einsteckschlösser, Schutzbeschläge und massive Schließbleche bilden die physische Hürde, die Zeit
            und erheblichen Kraftaufwand erfordert, um überwunden zu werden. Ohne diesen mechanischen Grundschutz
            degradiert jede elektronische Anlage zu einem reinen Meldesystem, das den Täter nicht aufhalten kann,
            sondern lediglich seinen erfolgreichen Eindringversuch dokumentiert.
          </p>
          <p className="mt-4">
            Wir setzen auf Hochsicherheitszylinder mit komplexen Profilen, die gegen Picking, Bumping und
            Bohrangriffe zertifiziert sind. Die Evolution dieser Systeme führt uns zur Mechatronik: Hier wird die
            robuste Mechanik mit mikroelektronischen Sperrelementen ergänzt. Ein Schlüssel muss nicht nur mechanisch
            passen, sondern auch ein kryptographisch gesichertes Challenge-Response-Protokoll erfolgreich absolvieren,
            bevor der Zylinderkern freigegeben wird. Dies ermöglicht ein hochgranulares Zutrittsmanagement, bei dem
            Rechte zeitlich befristet und bei Schlüsselverlust sofort entzogen werden können.
          </p>

          <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-10 mb-4">Sensorik und Perimeterüberwachung</h3>
          <p>
            Die zweite Schicht unserer Architektur ist die elektronische Überwachung der Gebäudeaußenhaut
            (Perimeterschutz). Moderne Gefahrenmeldeanlagen (GMA) nutzen ein Netzwerk aus heterogenen Sensoren,
            um Anomalien frühzeitig zu detektieren. Dazu gehören magnetische Öffnungskontakte, die den Zustand von
            Türen und Fenstern überwachen, Körperschallmelder zur Erkennung von Aufbruchversuchen und aktive
            Infrarot-Lichtschranken zur Absicherung von Freiflächen.
          </p>
          <p className="mt-4">
            Die Signalverarbeitung erfolgt heute durch intelligente Zentralen, die mithilfe heuristischer Algorithmen
            zwischen echten Bedrohungen und Umweltfaktoren (wie Wetter oder Tieren) unterscheiden, um Fehlalarme
            drastisch zu minimieren. Bei der Vernetzung setzen wir auf busbasierte Systeme oder stark verschlüsselte
            Funkprotokolle (AES-128/256) mit bidirektionaler Kommunikation und Anti-Jamming-Funktionen, um die
            Integrität der Signalwege jederzeit sicherzustellen.
          </p>

          <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-10 mb-4">Videoüberwachung und algorithmische Analyse</h3>
          <p>
            Videoüberwachungssysteme (CCTV) haben sich von passiven Aufzeichnungsgeräten zu aktiven Analysewerkzeugen
            entwickelt. Moderne IP-Kameras liefern nicht nur hochauflösende Bilder (4K und darüber) selbst bei
            extremen Lichtverhältnissen, sondern verfügen über integrierte Edge-Analytics.
          </p>
          <p className="mt-4">
            Diese kamerabasierten Algorithmen können Line-Crossing-Detection, Loitering (Herumlungern) oder
            Objektklassifizierungen autonom durchführen und bei definierten Ereignissen die Alarmanlage triggern
            oder direkte Push-Benachrichtigungen versenden. Die Datenhaltung erfolgt DSGVO-konform auf verschlüsselten
            NVRs (Network Video Recorders) oder hybriden Cloud-Lösungen, wobei wir streng auf die Einhaltung
            von Löschfristen und Privacy-Masking achten.
          </p>

          <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-10 mb-4">Vergleichsmatrix: Sicherheitsstufen (EN 50131 / VdS)</h3>
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-[oklch(0.968_0.004_260)] border-b border-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.16_0.02_260)]">
                <tr>
                  <th className="p-4 font-semibold">Stufe</th>
                  <th className="p-4 font-semibold">Täterprofil</th>
                  <th className="p-4 font-semibold">Technischer Standard</th>
                  <th className="p-4 font-semibold">Anwendungsbereich</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
                <tr>
                  <td className="p-4 font-medium">Grad 1 (VdS Home)</td>
                  <td className="p-4 text-[oklch(0.32_0.02_260)]">Gelegenheitstäter, wenig Vorwissen, einfache Werkzeuge.</td>
                  <td className="p-4 text-[oklch(0.32_0.02_260)]">Einfache Funk-Alarmsysteme, grundlegender mechanischer Schutz.</td>
                  <td className="p-4 text-[oklch(0.32_0.02_260)]">Wohnungen, kleine Einfamilienhäuser ohne besondere Werte.</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Grad 2 (VdS A/B)</td>
                  <td className="p-4 text-[oklch(0.32_0.02_260)]">Erfahrene Täter, spezielles Werkzeug, gewisse Planung.</td>
                  <td className="p-4 text-[oklch(0.32_0.02_260)]">Überwachte Funk-/Bus-Systeme, zertifizierte Zylinder (Bohr-/Ziehschutz), Aufschaltung.</td>
                  <td className="p-4 text-[oklch(0.32_0.02_260)]">Gewerbebetriebe, gehobene Privatobjekte.</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Grad 3 (VdS C)</td>
                  <td className="p-4 text-[oklch(0.32_0.02_260)]">Professionelle Banden, hohes Vorwissen, schweres Werkzeug.</td>
                  <td className="p-4 text-[oklch(0.32_0.02_260)]">Kabelgebundene Bus-Systeme, redundante Übertragungswege, höchste Sabotagesicherheit.</td>
                  <td className="p-4 text-[oklch(0.32_0.02_260)]">Juweliere, Banken, Hochrisikoobjekte.</td>
                </tr>
              </tbody>
            </table>
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


      {/* Interaktiver Kalkulator */}
      <Section id="score">
        <div className="mx-auto max-w-4xl">
          <SecurityScoreCalculator />
        </div>
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


      {/* Umfassendes Fach-FAQ */}
      <Section tone="muted">
        <SectionHeading
          nummer="05"
          eyebrow="Expertenwissen"
          title="Tiefgreifende Fragen & Antworten zur Sicherheitstechnik"
          lead="Detaillierte technische Einblicke und Antworten auf komplexe Fragestellungen aus unserer täglichen Praxis."
        />
        <div className="mt-12 max-w-4xl space-y-6">
          <details className="group border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] rounded-xl">
            <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-[oklch(0.16_0.02_260)] font-semibold [&::-webkit-details-marker]:hidden">
              Was ist der Unterschied zwischen einer IP-basierten und einer analogen Videoüberwachung?
              <GlyphWinkelUnten size={20} className="transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="p-6 pt-0 text-[oklch(0.32_0.02_260)] leading-relaxed border-t border-[oklch(0.89_0.008_260/0.55)] mt-4">
              Analoge Systeme (AHD, HD-TVI) übertragen ein unkomprimiertes Videosignal über Koaxialkabel an einen zentralen DVR (Digital Video Recorder), wo es digitalisiert wird. Sie sind robust, haben aber Einschränkungen in der Auflösung und Skalierbarkeit. IP-Kameras digitalisieren und komprimieren das Bild direkt in der Kamera und senden es als Netzwerkdatenstrom (meist H.265) über Ethernet (CAT5e/6/7) an einen NVR oder Server. IP-Systeme bieten deutlich höhere Auflösungen, ermöglichen Power over Ethernet (PoE) und unterstützen fortschrittliche On-Edge-Videoanalyse. Wir empfehlen bei Neuinstallationen nahezu ausschließlich IP-basierte Architekturen.
            </div>
          </details>

          <details className="group border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] rounded-xl">
            <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-[oklch(0.16_0.02_260)] font-semibold [&::-webkit-details-marker]:hidden">
              Wie funktioniert die Sabotageüberwachung bei einer VdS-zertifizierten Einbruchmeldeanlage?
              <GlyphWinkelUnten size={20} className="transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="p-6 pt-0 text-[oklch(0.32_0.02_260)] leading-relaxed border-t border-[oklch(0.89_0.008_260/0.55)] mt-4">
              Zertifizierte Anlagen überwachen permanent alle Komponenten und Übertragungswege auf Manipulation. Bei busbasierten Systemen erfolgt dies durch eine ständige, kryptografisch gesicherte Polling-Kommunikation zwischen Zentrale und Meldern. Öffnet jemand das Gehäuse eines Melders, der Zentrale oder des Signalgebers, löst ein Sabotagekontakt sofort einen Alarm aus – unabhängig davon, ob die Anlage scharf oder unscharf geschaltet ist. Zudem werden Kabelwege auf Kurzschluss und Unterbrechung überwacht (Zwangsläufigkeit).
            </div>
          </details>

          <details className="group border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] rounded-xl">
            <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-[oklch(0.16_0.02_260)] font-semibold [&::-webkit-details-marker]:hidden">
              Welche Redundanzen sind bei der Alarmübertragung zur Leitstelle erforderlich?
              <GlyphWinkelUnten size={20} className="transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="p-6 pt-0 text-[oklch(0.32_0.02_260)] leading-relaxed border-t border-[oklch(0.89_0.008_260/0.55)] mt-4">
              Ein einzelner Übertragungsweg (z.B. reines IP über den lokalen Router) reicht für professionelle Sicherheitskonzepte nicht aus. Fällt der Router aus oder wird die Leitung durchtrennt, ist die Anlage blind. Daher verbauen wir standardmäßig redundante Übertragungsgeräte (AWUG), die das Signal primär über IP/Ethernet und sekundär über ein Mobilfunknetz (LTE/4G mit Roaming-SIM) an die Notruf- und Serviceleitstelle (NSL) übertragen. Die Verbindung wird zudem zyklisch durch sogenannte Polling-Routinen überprüft.
            </div>
          </details>

          <details className="group border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] rounded-xl">
            <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-[oklch(0.16_0.02_260)] font-semibold [&::-webkit-details-marker]:hidden">
              Was bedeutet Zwangsläufigkeit bei Schließanlagen und Alarmsystemen?
              <GlyphWinkelUnten size={20} className="transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="p-6 pt-0 text-[oklch(0.32_0.02_260)] leading-relaxed border-t border-[oklch(0.89_0.008_260/0.55)] mt-4">
              Zwangsläufigkeit ist ein zentrales Sicherheitsprinzip, das menschliche Fehler ausschließt. Es besagt im Wesentlichen: Eine Alarmanlage lässt sich nur dann scharfschalten (extern aktivieren), wenn alle überwachten Fenster und Türen nachweislich verschlossen sind. Umgekehrt stellt die Zwangsläufigkeit beim Unscharfschalten sicher, dass man den gesicherten Bereich erst betreten kann, nachdem die Anlage erfolgreich deaktiviert wurde. Dies wird technisch oft durch ein Sperrelement im Türrahmen realisiert, das die Tür mechanisch blockiert, solange die Anlage scharf ist – so werden teure Falschalarme durch versehentliches Betreten verhindert.
            </div>
          </details>

          <details className="group border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] rounded-xl">
            <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-[oklch(0.16_0.02_260)] font-semibold [&::-webkit-details-marker]:hidden">
              Können mechatronische Zylinder in bestehende Schließanlagen integriert werden?
              <GlyphWinkelUnten size={20} className="transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="p-6 pt-0 text-[oklch(0.32_0.02_260)] leading-relaxed border-t border-[oklch(0.89_0.008_260/0.55)] mt-4">
              Ja, die Migration zu hybriden Systemen ist eine unserer Kernkompetenzen. Viele Hersteller bieten mechatronische Schlüssel an, die sowohl eine mechanische Codierung (für bestehende, unkritische Zylinder) als auch einen RFID-Chip oder eine Kontaktfläche (für elektronische Zylinder an Außentüren oder sensiblen Bereichen) besitzen. Dies ermöglicht einen kosteneffizienten, schrittweisen Ausbau der Sicherheitsarchitektur. Der elektronische Teil kommuniziert dabei verschlüsselt und ermöglicht es, bei Verlust eines Schlüssels diesen sofort aus den elektronischen Zylindern zu löschen, ohne die gesamte Mechanik austauschen zu müssen.
            </div>
          </details>
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
