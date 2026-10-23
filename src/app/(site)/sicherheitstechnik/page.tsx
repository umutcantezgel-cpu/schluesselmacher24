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

import { SecurityScoreCalculator } from '@/components/calculator/security-score-calculator';

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
        <div className="mt-16 max-w-4xl mx-auto">
        <SecurityScoreCalculator />
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

      <Section id="expertenwissen" tone="muted">
        <SectionHeading
          nummer="EX"
          eyebrow="Tiefgang"
          title="Sicherheitstechnik: Ein ganzheitlicher Ansatz"
          lead="Wie mechanische und elektronische Systeme ineinandergreifen, um echten Schutz zu bieten."
        />

        <div className="mt-12 text-[oklch(0.32_0.02_260)] text-base leading-relaxed space-y-6 max-w-4xl mx-auto">
          <p>
            Sicherheitstechnik ist mehr als die Summe ihrer Einzelteile. In unserer modernen, vernetzten Welt reicht es nicht mehr aus, lediglich eine Alarmanlage an die Wand zu schrauben oder eine Kamera auf den Eingangsbereich zu richten. Ein fundiertes Sicherheitskonzept basiert auf einer ganzheitlichen Risikoanalyse, die sowohl physische als auch digitale Angriffsvektoren berücksichtigt. Die Verzahnung von mechanischem Grundschutz und intelligenter Elektronik bildet das Rückgrat einer widerstandsfähigen Sicherheitsarchitektur. Jeder Gebäudetyp, sei es ein privates Wohnhaus, eine Gewerbeimmobilie oder ein kritischer Infrastrukturknoten, erfordert eine maßgeschneiderte Lösung, die sich nahtlos in den Alltag der Nutzer integriert und gleichzeitig maximale Abschreckung und Detektion bietet.
          </p>

          <p>
            Die erste Verteidigungslinie bildet stets die Mechanik. Hochwertige Schließzylinder, massive Riegelwerke und zertifizierte Sicherheitsbeschläge an Türen und Fenstern zwingen potenzielle Täter zu einem zeitaufwändigen und lärmintensiven Vorgehen. Statistiken zeigen deutlich, dass die meisten Einbruchsversuche abgebrochen werden, wenn der Widerstand des Materials eine schnelle Überwindung verhindert. Doch Mechanik allein ist blind und stumm. Hier setzt die elektronische Sicherheitstechnik an, um die passive Abwehr durch aktive Überwachung und Alarmierung zu ergänzen. Sensoren an der Außenhaut des Gebäudes registrieren Erschütterungen oder das Öffnen von Fenstern und Türen, noch bevor der Täter in das Innere eindringen kann.
          </p>

          <p>
            Diese sogenannten Außenhautsicherungen sind besonders effektiv, da sie eine Alarmierung auslösen, während die mechanischen Barrieren noch intakt sind. Die Bewohner oder das Sicherheitspersonal gewinnen dadurch wertvolle Reaktionszeit. Moderne Gefahrenmeldeanlagen gehen jedoch weit über den klassischen Einbruchschutz hinaus. Sie integrieren Brand-, Gas- und Wassermelder und kommunizieren über verschlüsselte Kanäle mit Leitstellen und den Smartphones der Nutzer. Die Parametrierung solcher Systeme erfordert ein tiefes Verständnis für die jeweiligen Normen und Richtlinien (wie etwa die VdS-Klassen), um Falschalarme zu minimieren und eine hohe Zuverlässigkeit zu gewährleisten.
          </p>

          <p>
            Videomanagementsysteme (VMS) bilden eine weitere wichtige Säule. Sie dienen nicht nur der retrospektiven Aufklärung von Vorfällen, sondern auch der Echtzeit-Verifikation von Alarmen. Intelligente Videoanalyse-Algorithmen, basierend auf künstlicher Intelligenz (KI), können heute zwischen Tieren, witterungsbedingten Bewegungen und tatsächlichen Bedrohungen unterscheiden. Sie ermöglichen das Setzen virtueller Stolperdrähte und das Erkennen von zurückgelassenen Gegenständen. Die Planung einer Videoanlage erfordert jedoch ein Höchstmaß an Sensibilität bezüglich des Datenschutzes und der Persönlichkeitsrechte. Die DSGVO setzt enge Grenzen für die Erfassung öffentlicher Bereiche und die Speicherdauer der Aufnahmen, weshalb Verpixelungsfunktionen (Privacy Masking) zwingend erforderlich sind.
          </p>

          <p>
            Zutrittskontrollsysteme (ZKS) regulieren, wer, wann und wo Zutritt hat. Der Übergang vom mechanischen Schlüssel zum elektronischen Identifikationsmedium (RFID-Transponder, Smartphone via BLE/NFC, Biometrie) ermöglicht eine dynamische Rechteverwaltung. Verlorene Schlüssel stellen kein Sicherheitsrisiko mehr dar, da das entsprechende Medium sofort gesperrt werden kann. Die Architektur moderner ZKS ist zunehmend dezentral und cloudbasiert, was eine standortübergreifende Verwaltung vereinfacht, gleichzeitig aber hohe Anforderungen an die Cybersicherheit stellt. Die Kommunikation zwischen den Komponenten (Leser, Controller, Server) muss zwingend nach aktuellen Standards (z.B. OSDP) verschlüsselt sein.
          </p>

          <p>
            Ein oft unterschätzter Aspekt ist die Systemintegration. Erst wenn Einbruchmeldetechnik, Videoüberwachung, Zutrittskontrolle und Gebäudeautomation (Smart Home/Smart Building) intelligent miteinander vernetzt sind, entfaltet sich das volle Potenzial. Ein Alarm der Gefahrenmeldeanlage kann beispielsweise automatisch die Beleuchtung einschalten, die Rollläden hochfahren und die relevanten Kamerabilder auf dem Monitor des Wachpersonals priorisieren. Diese Automatisierung reduziert die kognitive Belastung in Stresssituationen und beschleunigt die Einleitung von Interventionsmaßnahmen.
          </p>

          <p>
            Die Nachhaltigkeit einer Sicherheitslösung zeigt sich nicht zuletzt im laufenden Betrieb. Regelmäßige Wartung, Software-Updates und Funktionstests sind unerlässlich, um die Leistungsfähigkeit der Anlagen über Jahre hinweg zu erhalten. Auch die Schulung der Nutzer spielt eine zentrale Rolle. Ein System, das aufgrund mangelnder Bedienbarkeit oder ständiger Fehlalarme deaktiviert wird, bietet keinen Schutz. Die Konzeption einer Benutzeroberfläche (UX-Design), die komplexe Zustände einfach und intuitiv darstellt, ist daher ein entscheidender Faktor für die Akzeptanz und Effektivität der Gesamtlösung.
          </p>

          <p>
            Zusammenfassend lässt sich sagen, dass professionelle Sicherheitstechnik eine interdisziplinäre Ingenieursleistung ist. Sie verbindet klassische Handwerkskunst im mechanischen Bereich mit hochspezialisiertem IT-Wissen in der Netzwerktechnik und Softwarekonfiguration. Unser Ansatz basiert auf der Überzeugung, dass nur eine detaillierte Risikoanalyse, eine herstellerneutrale Beratung und eine fachgerechte Installation zu einem Sicherheitskonzept führen, das seinen Namen verdient und reale Bedrohungen effektiv minimiert.
          </p>
        </div>
      </Section>

      <Section id="faq">
        <SectionHeading
          nummer="FAQ"
          eyebrow="Häufige Fragen"
          title="Wissen kompakt: Antworten auf Ihre wichtigsten Fragen"
          lead="Klartext statt Fachjargon."
        />

        <div className="mt-12 space-y-8 max-w-4xl mx-auto">
            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 bg-white">
                <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">1. Welche Rolle spielt die VdS-Zertifizierung bei Alarmanlagen?</h4>
                <p className="mt-3 text-sm leading-relaxed text-[oklch(0.32_0.02_260)]">
                Die Zertifizierung durch die VdS Schadenverhütung GmbH ist ein wichtiges Qualitätsmerkmal. Sie garantiert, dass Komponenten und Systeme strenge Prüfkriterien hinsichtlich Zuverlässigkeit, Sabotagesicherheit und Fehlalarmsicherheit erfüllen. Für den privaten Bereich ist die VdS-Klasse A oder B üblich, während im gewerblichen Bereich mit höherem Risiko oft Klasse C gefordert wird. Versicherungen knüpfen ihre Prämiennachlässe oder den Versicherungsschutz selbst oft an den Einsatz VdS-anerkannter Systeme.
                </p>
            </div>

            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 bg-white">
                <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">2. Wie unterscheiden sich kabelgebundene von funkbasierten Alarmsystemen?</h4>
                <p className="mt-3 text-sm leading-relaxed text-[oklch(0.32_0.02_260)]">
                Kabelgebundene Systeme gelten traditionell als die robusteste und sabotagesicherste Lösung, da sie nicht durch Funkinterferenzen gestört werden können. Sie eignen sich besonders für Neubauten oder Kernsanierungen, da die Kabelverlegung mit Aufwand verbunden ist. Moderne Funksysteme (z.B. auf 868 MHz Basis) haben in den letzten Jahren enorm aufgeholt. Sie nutzen Mehrfrequenzverfahren und bidirektionale Kommunikation, um Störversuche (Jamming) zu erkennen. Der große Vorteil liegt in der flexiblen und zerstörungsfreien Nachrüstung in Bestandsgebäuden.
                </p>
            </div>

            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 bg-white">
                <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">3. Ist eine Aufschaltung auf einen Wachdienst sinnvoll?</h4>
                <p className="mt-3 text-sm leading-relaxed text-[oklch(0.32_0.02_260)]">
                Eine Aufschaltung auf eine zertifizierte Notruf- und Serviceleitstelle (NSL) ist in den meisten Fällen sehr zu empfehlen. Ein lokaler Alarm (Sirene/Blitzlicht) schreckt zwar ab, garantiert aber nicht, dass Nachbarn oder Passanten adäquat reagieren. Eine NSL empfängt den Alarm in Sekundenschnelle, kann ihn (z.B. per Videoverifikation) überprüfen und bei Bedarf sofort die Polizei oder einen Interventionsdienst alarmieren – auch wenn Sie selbst im Urlaub oder nicht erreichbar sind.
                </p>
            </div>

            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 bg-white">
                <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">4. Wie sicher sind biometrische Zutrittskontrollen (z.B. Fingerabdruck)?</h4>
                <p className="mt-3 text-sm leading-relaxed text-[oklch(0.32_0.02_260)]">
                Biometrische Systeme bieten einen hohen Komfort, da das Identifikationsmerkmal nicht vergessen oder verloren werden kann. Moderne Fingerabdruckscanner arbeiten mit kapazitiven Sensoren oder Lebenderkennung (z.B. multispektrale Bildgebung), die ein Überlisten mit einfachen Silikonkopien nahezu unmöglich machen. Dennoch ist Biometrie nicht das alleinige Allheilmittel. In Hochsicherheitsbereichen wird sie oft als Faktor in einer Zwei-Faktor-Authentifizierung (z.B. Fingerabdruck + PIN oder RFID-Karte) eingesetzt.
                </p>
            </div>

            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 bg-white">
                <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">5. Wie kann ich mein Smart Home vor Hackerangriffen schützen?</h4>
                <p className="mt-3 text-sm leading-relaxed text-[oklch(0.32_0.02_260)]">
                Mit der Integration von Sicherheitstechnik in das Smart Home (IoT) steigt die Angriffsfläche. Der wichtigste Schritt ist die strikte Trennung von Netzwerken: Sicherheitssysteme sollten in einem separaten VLAN (Virtual Local Area Network) operieren, isoliert von Smart-TVs und anderen Consumer-Geräten. Standardpasswörter müssen bei Inbetriebnahme sofort geändert werden. Zudem sind regelmäßige Firmware-Updates aller vernetzten Komponenten essenziell, um neu entdeckte Sicherheitslücken zu schließen. Fernzugriffe sollten ausschließlich über verschlüsselte VPN-Verbindungen erfolgen.
                </p>
            </div>
        </div>
      </Section>

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
