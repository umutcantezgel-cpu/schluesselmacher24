import type { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';

import { getPageContent, getServicePages } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { SicherheitscheckRechner } from '@/components/calculator/sicherheitscheck-rechner';
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



      {/* Expansion: Architektonische Methodik, Leistungsstufen und Rechner */}
      <Section id="architektonische-methodik">
        <SectionHeading
          nummer="05"
          eyebrow="Methodik & Analyse"
          title="Systematische Sicherheitsarchitektur für Ihr Objekt"
          lead="Wir betrachten Sicherheit nicht als Summe von Einzelteilen, sondern als geschlossene Architektur."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Fundamentale Prinzipien der Absicherung</h3>
              <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
                Eine wirksame Sicherheitsstrategie baut auf ineinandergreifenden Ringen auf. Die physische Hülle bildet den ersten Widerstand (mechanische Grundsicherung). Sensoren und Kameras (elektronische Überwachung) bilden den zweiten Ring, der frühzeitig alarmiert und dokumentiert. Die intelligente Vernetzung (Zutrittskontrolle) regelt schließlich, wer wann welche Zonen betreten darf. Diese drei Säulen müssen exakt aufeinander abgestimmt sein, um Schwachstellen an den Schnittstellen zu vermeiden.
              </p>
              <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
                Unsere Methodik beginnt immer mit einer rigorosen Schwachstellenanalyse vor Ort. Wir bewerten Fenster, Türen, Kellerschächte und Dachzugänge nach DIN EN 1627 und empfehlen Maßnahmen, die den realen Angriffsvektoren entsprechen. Oftmals ist ein massiver Querriegel effektiver als eine komplexe Kameraanlage – wir planen objektiv und herstellerunabhängig.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Die drei Leistungsstufen der Sicherheitstechnik</h3>
              <div className="overflow-x-auto rounded-lg border border-[oklch(0.89_0.008_260/0.55)]">
                <table className="w-full text-left text-sm text-[oklch(0.32_0.02_260)]">
                  <thead className="bg-[oklch(0.968_0.004_260)] text-[oklch(0.16_0.02_260)]">
                    <tr>
                      <th className="border-b border-[oklch(0.89_0.008_260/0.55)] p-4 font-semibold">Stufe</th>
                      <th className="border-b border-[oklch(0.89_0.008_260/0.55)] p-4 font-semibold">Fokus</th>
                      <th className="border-b border-[oklch(0.89_0.008_260/0.55)] p-4 font-semibold">Komponenten</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
                    <tr>
                      <td className="p-4 font-medium text-[oklch(0.16_0.02_260)]">BASIS</td>
                      <td className="p-4">Physischer Widerstand, Verzögerung von Einbruchsversuchen.</td>
                      <td className="p-4">Sicherheitszylinder, Schutzbeschläge, Pilzkopfverriegelungen.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-[oklch(0.16_0.02_260)]">ERWEITERT</td>
                      <td className="p-4">Zusätzliche Abschreckung und frühzeitige Alarmierung.</td>
                      <td className="p-4">Basis + Alarmanlage, Bewegungsmelder, einfache Videoüberwachung.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-[oklch(0.16_0.02_260)]">VOLLSCHUTZ</td>
                      <td className="p-4">Umfassende Kontrolle, Aufzeichnung und proaktive Steuerung.</td>
                      <td className="p-4">Erweitert + IP-Kamerasysteme, elektronische Zutrittskontrolle, Smart-Home Integration.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Zertifizierte Komponenten und DIN-Normen</h3>
              <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
                Der Einbau von Sicherheitstechnik ist Vertrauenssache, erfordert aber auch messbare Standards. Wir verwenden ausschließlich Komponenten, die nach DIN 18104 (für einbruchhemmende Nachrüstprodukte) und DIN EN 1627 (für einbruchhemmende Türen und Fenster) geprüft sind. VdS-anerkannte Systeme garantieren zudem höchste Zuverlässigkeit und werden von Versicherungen bei der Beitragsberechnung positiv berücksichtigt.
              </p>
              <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">
                Die fachgerechte Montage ist dabei ebenso wichtig wie das Produkt selbst. Ein RC2-zertifizierter Fenstergriff nützt wenig, wenn er mit zu kurzen Schrauben im weichen Kunststoffprofil befestigt wird. Unsere Techniker sind geschult, die strukturelle Integrität des Untergrunds zu bewerten und die Befestigungsmittel entsprechend der Herstellervorgaben und Prüfzeugnisse auszuwählen.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <SicherheitscheckRechner />
            </div>
          </div>
        </div>
      </Section>

      <Section id="sicherheit-faq" tone="muted">
        <SectionHeading
          nummer="06"
          eyebrow="FAQ & Expertenwissen"
          title="Häufige Fragen zur Objekt- und Gebäudesicherheit"
        />
        <div className="mt-12 max-w-3xl space-y-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">1. Reicht eine elektronische Alarmanlage als alleiniger Schutz aus?</h3>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">Nein. Eine Alarmanlage meldet den Einbruch, verhindert ihn aber nicht. Ohne adäquate mechanische Sicherungen haben Täter oft leichtes Spiel und können innerhalb weniger Minuten flüchten, bevor Sicherheitskräfte eintreffen. Elektronik ist immer als Ergänzung zur soliden Mechanik (Zylinder, Beschläge, Riegel) zu betrachten.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">2. Welche Widerstandsklasse (RC) wird für Privathaushalte empfohlen?</h3>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">Die Polizei rät für private Wohnungen und Häuser generell zu Elementen der Resistance Class 2 (RC 2). Diese bieten einen effektiven Basisschutz gegen Gelegenheitstäter, die versuchen, mit einfachen Werkzeugen wie Schraubendrehern oder Keilen in das Gebäude einzudringen. Für besonders gefährdete Bereiche oder Gewerbeobjekte empfehlen wir RC 3.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">3. Muss Sicherheitstechnik regelmäßig gewartet werden?</h3>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">Ja, absolut. Elektronische Systeme (Kameras, Alarmanlagen) erfordern regelmäßige Software-Updates und Funktionstests der Sensoren und Akkus. Mechanische Bauteile müssen auf Leichtgängigkeit, Verschleiß und festen Sitz geprüft und gegebenenfalls geschmiert oder nachjustiert werden, um ihre Schutzwirkung dauerhaft zu gewährleisten.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">4. Was ist bei der Installation von Videoüberwachung rechtlich zu beachten?</h3>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">Kameras dürfen auf privaten Grundstücken nur den eigenen Bereich erfassen. Öffentliche Gehwege, Straßen oder Nachbargrundstücke sind tabu (Recht auf informationelle Selbstbestimmung). Zudem muss durch deutliche Hinweisschilder auf die Videoüberwachung aufmerksam gemacht werden. Die Speicherdauer der Aufnahmen sollte auf das Nötigste (meist 48 bis 72 Stunden) begrenzt sein.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">5. Gibt es staatliche Förderungen für den Einbau von Sicherheitstechnik?</h3>
            <p className="text-[oklch(0.32_0.02_260)] leading-relaxed">Ja, die KfW (Kreditanstalt für Wiederaufbau) bietet Zuschüsse für einbruchhemmende Maßnahmen in Bestandsgebäuden an. Voraussetzung ist oft, dass die Produkte bestimmte DIN-Normen erfüllen (z. B. RC 2) und der Einbau durch einen Fachbetrieb erfolgt. Der Förderantrag muss zwingend vor Beginn der Maßnahmen gestellt werden.</p>
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
