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
import { SecurityBudgetCalculator } from '@/components/sicherheitstechnik/security-budget-calculator';

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


      <Section id="architektur-und-methodik" tone="sunken">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              nummer="01a"
              eyebrow="Architektur & Methodik"
              title="Fundierte Sicherheitskonzepte für komplexe Anforderungen"
              lead="Eine moderne Sicherheitsarchitektur erfordert eine ganzheitliche Betrachtung von Mechanik, Elektronik und Netzwerktechnik. Wir planen und realisieren Systeme, die präventiv wirken und im Ernstfall zuverlässig reagieren."
            />
          </div>
          <div className="lg:col-span-7 prose prose-slate text-[oklch(0.32_0.02_260)] leading-relaxed space-y-6">
            <p>
              Die Planung einer robusten Sicherheitsarchitektur beginnt stets mit einer detaillierten Schwachstellenanalyse des Objekts.
              Hierbei bewerten wir nicht nur die physischen Zugangspunkte wie Türen, Fenster und Lichtschächte, sondern auch die
              Umgebungsbedingungen und das spezifische Bedrohungspotenzial. Unsere Methodik basiert auf dem Prinzip der
              <strong>Zwiebelschalen-Architektur (Defense in Depth)</strong>, bei der mehrere unabhängige Sicherheitsbarrieren
              kombiniert werden, um einen unüberwindbaren Schutzschild zu bilden.
            </p>
            <p>
              Im ersten Schritt konzentrieren wir uns auf die <strong>Außenhautsicherung</strong>. Durch den Einsatz von hochfesten
              mechanischen Verriegelungen in Kombination mit intelligenten mechatronischen Zylindern erschweren wir das physische
              Eindringen massiv. Diese erste Linie der Verteidigung wird ergänzt durch elektronische Überwachungssysteme.
              Moderne <strong>Perimeterschutz-Systeme</strong> erkennen Annäherungen bereits, bevor es zu einem physischen Kontakt
              kommt.
            </p>
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-8 mb-4">Integrierte Netzwerk-Sicherheitssysteme</h3>
            <p>
              Die zweite Schicht bildet das Herzstück der Anlage: ein vernetztes Alarmsystem, das nahtlos mit der Videoüberwachung
              kommuniziert. Wir setzen ausschließlich auf VdS-anerkannte Komponenten, die höchste Ausfallsicherheit garantieren.
              Diese Systeme verfügen über redundante Kommunikationswege (LTE/IP) und eine Notstromversorgung, um auch bei
              manipulierten Versorgungsleitungen voll funktionsfähig zu bleiben.
            </p>
            <p>
              Die Videoüberwachung dient nicht nur der reaktiven Aufklärung, sondern vor allem der präventiven Abschreckung und der
              Live-Verifikation von Alarmen. Durch den Einsatz von KI-gestützter Videoanalytik können wir Fehlalarme (z.B. durch Tiere
              oder Witterungseinflüsse) drastisch reduzieren und nur verifizierte Bedrohungen an die aufgeschaltete Notruf- und
              Serviceleitstelle (NSL) weiterleiten. Dies gewährleistet eine schnelle und zielgerichtete Intervention durch die Polizei
              oder private Sicherheitsdienste.
            </p>
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-8 mb-4">Das Prinzip der ausfallsicheren Redundanz</h3>
            <p>
              Die dritte und letzte Schicht bildet die innere Überwachung, auch Fallenüberwachung genannt. Mittels Dual-Meldern
              (Infrarot und Mikrowelle) sichern wir sensible Bereiche innerhalb des Objekts ab. Diese Sensoren sind extrem
              zuverlässig und detektieren auch professionelle Eindringlinge, die versuchen, die Außenhautsicherung zu überwinden.
              Zudem integrieren wir Panikschalter und Überfalltaster, um Personen in Notfällen eine schnelle und diskrete
              Alarmierung zu ermöglichen.
            </p>
          </div>
        </div>
      </Section>

      <Section id="leistungsstufen">
        <SectionHeading
          nummer="01b"
          eyebrow="Vergleichsmatrix"
          title="Unsere Leistungsstufen im Detail"
          lead="Abhängig von Ihrem spezifischen Schutzbedarf bieten wir verschiedene Ausbaustufen an, die alle auf der gleichen hochwertigen Systemarchitektur basieren."
        />
        <div className="mt-12 overflow-x-auto">
          <table className="w-full text-left text-small text-[oklch(0.32_0.02_260)] border-collapse">
            <thead>
              <tr className="border-b-2 border-[oklch(0.89_0.008_260/0.55)]">
                <th className="py-4 px-6 font-semibold text-[oklch(0.16_0.02_260)] w-1/4">Funktion / Merkmal</th>
                <th className="py-4 px-6 font-semibold text-[oklch(0.16_0.02_260)] w-1/4 bg-[oklch(0.988_0.002_260)]">Basis-Schutz (Standard)</th>
                <th className="py-4 px-6 font-semibold text-[oklch(0.16_0.02_260)] w-1/4 bg-[oklch(0.968_0.004_260)]">Erweitert (Premium)</th>
                <th className="py-4 px-6 font-semibold text-[oklch(0.16_0.02_260)] w-1/4 bg-[oklch(0.92_0.01_260)]">Höchstschutz (Enterprise)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
              <tr className="hover:bg-area-soft transition-colors duration-quick">
                <td className="py-4 px-6 font-medium">Mechanische Grundsicherung</td>
                <td className="py-4 px-6 bg-[oklch(0.988_0.002_260)]">Zertifizierte Profilzylinder, Basis-Türbeschläge</td>
                <td className="py-4 px-6 bg-[oklch(0.968_0.004_260)]">Mechatronische Zylinder, Panzerriegel</td>
                <td className="py-4 px-6 bg-[oklch(0.92_0.01_260)]">VdS-Klasse B/C Mechanik, Sperrelemente</td>
              </tr>
              <tr className="hover:bg-area-soft transition-colors duration-quick">
                <td className="py-4 px-6 font-medium">Elektronische Überwachung</td>
                <td className="py-4 px-6 bg-[oklch(0.988_0.002_260)]">Lokale Alarmzentrale, Basis-Türkontakte</td>
                <td className="py-4 px-6 bg-[oklch(0.968_0.004_260)]">IP/LTE angebundene Zentrale, Bewegungsmelder</td>
                <td className="py-4 px-6 bg-[oklch(0.92_0.01_260)]">Vollintegrierte Gefahrenmeldeanlage (VdS)</td>
              </tr>
              <tr className="hover:bg-area-soft transition-colors duration-quick">
                <td className="py-4 px-6 font-medium">Video-Verifikation</td>
                <td className="py-4 px-6 bg-[oklch(0.988_0.002_260)]">Optional (lokale Speicherung)</td>
                <td className="py-4 px-6 bg-[oklch(0.968_0.004_260)]">Cloud-Recording (EU-DSGVO), Live-Ansicht</td>
                <td className="py-4 px-6 bg-[oklch(0.92_0.01_260)]">KI-Videoanalytik, Perimeter-Tracking</td>
              </tr>
              <tr className="hover:bg-area-soft transition-colors duration-quick">
                <td className="py-4 px-6 font-medium">Notruf-Aufschaltung (NSL)</td>
                <td className="py-4 px-6 bg-[oklch(0.988_0.002_260)]">Nicht enthalten</td>
                <td className="py-4 px-6 bg-[oklch(0.968_0.004_260)]">Aufschaltung optional</td>
                <td className="py-4 px-6 bg-[oklch(0.92_0.01_260)]">Redundante 24/7 Aufschaltung inklusive</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="kalkulator" tone="muted">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter items-start">
          <div className="lg:col-span-5">
            <SectionHeading
              nummer="01c"
              eyebrow="Investitions-Schätzung"
              title="Interaktiver Budget-Kalkulator"
              lead="Erhalten Sie einen ersten Richtwert für die Installation einer professionellen Sicherheitstechnik, basierend auf der zu schützenden Fläche."
            />
            <p className="mt-6 text-[oklch(0.32_0.02_260)]">
              Bitte beachten Sie, dass dies eine grobe Schätzung ist. Der tatsächliche Aufwand hängt von vielen Faktoren ab, wie z.B.
              der vorhandenen Verkabelung, der Wandbeschaffenheit und Ihren spezifischen Sicherheitsanforderungen. Für ein
              verbindliches Angebot führen wir stets eine Vor-Ort-Begehung durch.
            </p>
          </div>
          <div className="lg:col-span-7">
            <SecurityBudgetCalculator />
          </div>
        </div>
      </Section>

      <Section id="faq">
        <SectionHeading
          nummer="01d"
          eyebrow="Häufige Fragen"
          title="Experten-Antworten zur Sicherheitstechnik"
          className="max-w-2xl"
        />
        <div className="mt-12 max-w-3xl space-y-8 text-[oklch(0.32_0.02_260)]">
          <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
            <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">Wie sicher sind funkbasierte Alarmanlagen im Vergleich zu kabelgebundenen Systemen?</h4>
            <p>
              Moderne professionelle Funk-Alarmanlagen (z.B. mit bidirektionaler Kommunikation auf 868 MHz) bieten ein extrem hohes
              Sicherheitsniveau. Sie nutzen proprietäre, verschlüsselte Protokolle und erkennen Jamming-Versuche (Störsender)
              sofort. Für den Einsatz in hochsensiblen Bereichen (z.B. Banken, Juweliere) oder bei VdS-Klasse B/C Vorgaben
              empfehlen wir dennoch hybride oder rein kabelgebundene Systeme, da diese resistent gegen jegliche Art von
              Funkstörungen sind und keinen Batteriewechsel an den Meldern erfordern.
            </p>
          </div>
          <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
            <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">Was passiert bei einem Stromausfall oder wenn das Internet ausfällt?</h4>
            <p>
              Jede professionelle Einbruchmeldeanlage ist mit einem Notstrom-Akku ausgestattet, der den Betrieb je nach Auslegung
              für 12 bis 60 Stunden aufrechterhält. Auch die Sirenen verfügen über eigene Akkus. Zur Kommunikation mit der
              Leitstelle oder Ihrem Smartphone nutzen unsere Systeme redundante Wege: Fällt die primäre IP-Verbindung (DSL/Glasfaser)
              aus, übernimmt automatisch das integrierte LTE/4G-Modul die Übertragung. So bleibt die Alarmierungskette stets
              geschlossen.
            </p>
          </div>
          <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
            <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">Darf ich den öffentlichen Gehweg vor meinem Haus mit Kameras überwachen?</h4>
            <p>
              Nein. Nach geltendem Datenschutzrecht (DSGVO und BDSG) dürfen private Kameras ausschließlich das eigene Grundstück
              erfassen. Öffentliche Bereiche, Gehwege oder Nachbargrundstücke müssen zwingend ausgeblendet werden (z.B. durch
              Privacy-Masking in der Kamera-Software oder physische Blenden). Wir konfigurieren Ihre Kamerasysteme rechtssicher
              und dokumentieren die zulässigen Erfassungsbereiche bei der Übergabe.
            </p>
          </div>
          <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
            <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">Sind mechanische Sicherungen wirklich notwendig, wenn ich eine Alarmanlage habe?</h4>
            <p>
              Absolut. Eine Alarmanlage verhindert keinen Einbruch, sie meldet ihn nur. Ohne adäquate mechanische Sicherung
              (z.B. Pilzkopfzapfen an Fenstern, Sicherheitsschließbleche, Kernziehschutz) kann ein Einbrecher innerhalb von
              Sekunden im Objekt sein. Der &quot;Blitz-Einbruch&quot; ist vollendet, bevor die Polizei oder der Sicherheitsdienst
              eintreffen kann. Die Mechanik sorgt für den entscheidenden Zeitwiderstand, während die Elektronik sofort alarmiert.
            </p>
          </div>
          <div className="pb-6">
            <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">Wie oft muss eine sicherheitstechnische Anlage gewartet werden?</h4>
            <p>
              Für private Anlagen empfehlen wir eine jährliche Inspektion. Bei gewerblichen Anlagen oder solchen mit
              Polizeiaufschaltung ist eine jährliche bis halbjährliche Wartung nach VDE 0833 bzw. VdS-Richtlinien oft
              vorgeschrieben. Bei der Wartung prüfen wir die Akkus, reinigen Melder, testen die Signalübertragung und
              spielen wichtige Firmware-Updates ein, um die Anlage gegen neue Cyber-Bedrohungen abzusichern.
            </p>
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
    </>
  );
}
