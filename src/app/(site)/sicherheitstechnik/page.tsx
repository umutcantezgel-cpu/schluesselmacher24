
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
import { IconAlarmtechnik } from '@/components/visual/icons/alarmtechnik';
import { IconAussenhautsicherung } from '@/components/visual/icons/aussenhautsicherung';
import { IconKombinierteKonzepte } from '@/components/visual/icons/kombinierte-konzepte';
import { IconMechanischerSchutz } from '@/components/visual/icons/mechanischer-schutz';
import { IconPanikAlarmtaster } from '@/components/visual/icons/panik-alarmtaster';
import { IconSmarteFunktionen } from '@/components/visual/icons/smarte-funktionen';
import { IconVideoueberwachung } from '@/components/visual/icons/videoueberwachung';
import { ServiceBudgetCalculator } from '@/components/sicherheitstechnik/service-budget-calculator';

const ROUTE = 'sicherheitstechnik';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Sicherheitstechnik: Moderne Konzepte für maximalen Schutz',
    description:
      page?.seo.description ??
      'Entdecken Sie unsere umfassenden Sicherheitstechnik-Lösungen. Von Videoüberwachung bis zu kombinierten mechanischen und elektronischen Schutzkonzepten für Gewerbe und Privat.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

const SERVICE_ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  videoueberwachung: IconVideoueberwachung,
  alarmtechnik: IconAlarmtechnik,
  aussenhautsicherung: IconAussenhautsicherung,
  'mechanischer-schutz': IconMechanischerSchutz,
  'smarte-funktionen': IconSmarteFunktionen,
  'panik-und-alarmtaster': IconPanikAlarmtaster,
  'kombinierte-konzepte': IconKombinierteKonzepte,
};

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SicherheitstechnikPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const page = await getPageContent(ROUTE);
  const services = await getServicePages(ROUTE);

  const hero = { headline: page?.seo?.title ?? 'Umfassende Sicherheitstechnik für höchste Ansprüche', lead: page?.seo?.description ?? 'Wir konzipieren, installieren und warten modernste Sicherheitssysteme, die sich nahtlos in Ihre Architektur einfügen und kompromisslosen Schutz bieten.' };

  const processLabel = PROCESS_LABELS[ROUTE as keyof typeof PROCESS_LABELS];
  const process = processLabel
    ? {
        label: processLabel.label,
        hint: processLabel.hint,
      }
    : {
        label: 'Beratung & Planung',
        hint: 'Kostenlose Erstberatung zur Ermittlung Ihres Sicherheitsbedarfs.',
      };

  const WEITER = [
    {
      href: '/sicherheitstechnik/sicherheitscheck',
      etikett: 'Bestandsaufnahme',
      titel: 'Der Sicherheitscheck',
      text: 'Wir prüfen Ihr Objekt vor Ort auf Schwachstellen und erarbeiten ein passgenaues Sicherheitskonzept.',
      link: 'Zum Sicherheitscheck',
    },
    {
      href: '/ratgeber/grundschutz',
      etikett: 'Wissen',
      titel: 'Mechanischer Grundschutz',
      text: 'Warum elektronische Systeme immer auf einer soliden mechanischen Basis aufbauen sollten.',
      link: 'Zum Ratgeber',
    },
  ];

  const weitereLinks = [
    { href: '/kontakt', label: 'Termin vereinbaren' },
    { href: '/standorte', label: 'Unsere Standorte' },
  ];

  return (
    <>
      {page && (
        <JsonLd
          data={pageGraphSchema({
            path: ROUTE,
            name: hero.headline,
            description: hero.lead,
          })}
        />
      )}
      <main data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
        <PageHeader title={hero.headline} lead={hero.lead} />

        {/* 00 Einleitung & Architektonische Methodik (Massive Expansion) */}
        <Section tone="muted">
          <SectionHeading
            nummer="00"
            eyebrow="Architektur & Philosophie"
            title="Die Methodik moderner Sicherheit"
            lead="Sicherheit ist kein Zufall, sondern das Resultat präziser Planung und kompromissloser technischer Ausführung."
          />
          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
              <p>
                In der heutigen Zeit reicht es nicht mehr aus, punktuelle Sicherheitsmaßnahmen zu ergreifen. Die architektonische
                Methodik der modernen Sicherheitstechnik erfordert einen ganzheitlichen Ansatz, der mechanische Hürden mit
                intelligenter elektronischer Sensorik verschmilzt. Unsere Philosophie basiert auf dem Prinzip der konzentrischen
                Sicherheitsringe: Wir betrachten Ihr Objekt nicht als isolierte Einheit, sondern analysieren das gesamte Umfeld.
                Jeder Ring – von der Grundstücksgrenze über die Gebäudehülle bis hin zu sensiblen Innenbereichen – wird durch
                spezifische, aufeinander abgestimmte Technologien geschützt.
              </p>
              <p>
                Dabei legen wir größten Wert auf die architektonische Integration. Sichtbare Sicherheitstechnik hat zwar eine
                präventive Abschreckungswirkung, darf aber die Ästhetik eines Gebäudes nicht stören. Moderne Komponenten wie
                flächenbündige Türkontakte, miniaturisierte Hochleistungskameras und smarte Zutrittsleser werden von uns so
                geplant, dass sie sich nahtlos in das Swiss Light Mode Designkonzept Ihres Objekts einfügen. Das bedeutet:
                Klare Linien, unaufdringliche Präsenz und maximale Funktionalität.
              </p>
              <p>
                Ein wesentlicher Bestandteil unserer Methodik ist die Redundanz. Ein Stromausfall oder ein gezielter
                Sabotageversuch darf das System nicht lahmlegen. Deshalb arbeiten wir mit autarken Energieversorgungen,
                verschlüsselten Übertragungswegen (AES-256) und dualer Alarmierung über IP und Mobilfunk. Die
                fortschreitende Digitalisierung ermöglicht zudem predictive Maintenance: Sensoren überwachen nicht nur ihre
                Umgebung, sondern auch ihren eigenen Zustand und melden Wartungsbedarf, bevor ein Ausfall auftritt.
              </p>
              <p>
                Dieses Zusammenspiel aus robuster Mechanik (dem Fundament) und intelligenter Elektronik (den Sinnen) bildet
                ein hochkomplexes, aber für den Nutzer einfach zu bedienendes Sicherheitsökosystem. Vertrauen Sie auf
                zertifizierte Qualität nach DIN EN 50131 und VdS-Richtlinien, gepaart mit meisterhaftem Handwerk und
                zukunftssicherer Systemarchitektur.
              </p>
            </div>
            <div className="lg:col-span-4 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
              <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Kernprinzipien</h3>
              <ul className="mt-4 space-y-3 text-sm text-[oklch(0.32_0.02_260)]">
                <li className="flex items-start gap-2">
                  <GlyphPfeilRechts size={16} className="mt-1 shrink-0 text-primary" />
                  <span>Ganzheitliche Gefahrenabwehr durch mehrschichtige Detektion.</span>
                </li>
                <li className="flex items-start gap-2">
                  <GlyphPfeilRechts size={16} className="mt-1 shrink-0 text-primary" />
                  <span>Nahtlose architektonische Integration statt störender Anbauten.</span>
                </li>
                <li className="flex items-start gap-2">
                  <GlyphPfeilRechts size={16} className="mt-1 shrink-0 text-primary" />
                  <span>Redundante Systemarchitektur gegen Sabotage und Ausfälle.</span>
                </li>
                <li className="flex items-start gap-2">
                  <GlyphPfeilRechts size={16} className="mt-1 shrink-0 text-primary" />
                  <span>Predictive Maintenance durch IoT-Sensorik.</span>
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 01 Ablauf: Bild, Check & Kinetisches Budget-Modul */}
        <Section>
          <SectionHeading
            nummer="01"
            eyebrow="Bestandsaufnahme & Planung"
            title="Sicherheit beginnt mit dem ersten Check"
            lead="Vor der Technik steht das Konzept. Ohne eine fundierte Analyse vor Ort bleibt jede Anlage unter ihren Möglichkeiten."
          />

          <div className="mt-12 grid gap-x-8 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
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

            <div className="flex flex-col justify-center lg:col-span-6">
              <div className="border border-[oklch(0.89_0.008_260/0.55)] rounded-2xl p-8 bg-[oklch(0.988_0.002_260)] shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
                <p className="font-mono text-xs uppercase tracking-widest text-[oklch(0.52_0.015_260)]">
                  Ablauf in diesem Bereich
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-[oklch(0.16_0.02_260)]">{process.label}</h3>
                <p className="mt-4 text-[oklch(0.32_0.02_260)] leading-relaxed">
                  {process.hint} Wir dokumentieren den Ist-Zustand, identifizieren Schwachstellen (z.B. nicht einsehbare Fenster, veraltete Schließzylinder, unzureichende Außenbeleuchtung) und gleichen diese mit Ihrem subjektiven Sicherheitsbedürfnis ab.
                </p>
                <div className="mt-8">
                  <ButtonLink href={`/${ROUTE}/sicherheitscheck`} variant="outline" className="border-[oklch(0.89_0.008_260/0.55)] hover:bg-[oklch(0.968_0.004_260)] text-[oklch(0.16_0.02_260)]">
                    Bestandsaufnahme starten
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Interaktives Budget-Modul */}
        <Section tone="muted">
          <SectionHeading
            nummer="02"
            eyebrow="Investitionsplanung"
            title="Kalkulieren Sie Ihr Sicherheits-Budget"
            lead="Transparenz von Anfang an. Nutzen Sie unseren interaktiven Kalkulator, um eine realistische Einschätzung der Investitionskosten für Ihr Projekt zu erhalten."
          />
          <div className="mt-12 max-w-2xl mx-auto">
             <ServiceBudgetCalculator />
          </div>
        </Section>

        {/* 03 Leistungsvergleich Matrix */}
        <Section>
          <SectionHeading
            nummer="03"
            eyebrow="Systemvergleich"
            title="Leistungsstufen & Schutzklassen"
            lead="Von der Basisabsicherung bis zum Hochsicherheitskonzept: Finden Sie die passende Ausbaustufe für Ihr Risikoprofil."
          />
          <div className="mt-12 overflow-x-auto">
            <table className="w-full text-left border-collapse border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] rounded-xl overflow-hidden shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
              <thead className="bg-[oklch(0.968_0.004_260)] border-b border-[oklch(0.89_0.008_260/0.55)]">
                <tr>
                  <th className="p-4 font-semibold text-[oklch(0.16_0.02_260)] border-r border-[oklch(0.89_0.008_260/0.55)]">Merkmal</th>
                  <th className="p-4 font-semibold text-[oklch(0.16_0.02_260)] border-r border-[oklch(0.89_0.008_260/0.55)]">Basis-Schutz (Privat)</th>
                  <th className="p-4 font-semibold text-[oklch(0.16_0.02_260)] border-r border-[oklch(0.89_0.008_260/0.55)]">Erweitert (Gewerbe)</th>
                  <th className="p-4 font-semibold text-[oklch(0.16_0.02_260)]">Hochsicherheit (KRITIS)</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[oklch(0.32_0.02_260)]">
                <tr className="border-b border-[oklch(0.89_0.008_260/0.55)] hover:bg-[oklch(0.968_0.004_260)] transition-colors">
                  <td className="p-4 border-r border-[oklch(0.89_0.008_260/0.55)] font-medium text-[oklch(0.16_0.02_260)]">Mechanik</td>
                  <td className="p-4 border-r border-[oklch(0.89_0.008_260/0.55)]">VdS-Klasse A, Zylinder RC2</td>
                  <td className="p-4 border-r border-[oklch(0.89_0.008_260/0.55)]">VdS-Klasse B, Zylinder RC3/RC4</td>
                  <td className="p-4">VdS-Klasse C, Zylinder RC5/RC6, Panzerschutz</td>
                </tr>
                <tr className="border-b border-[oklch(0.89_0.008_260/0.55)] hover:bg-[oklch(0.968_0.004_260)] transition-colors">
                  <td className="p-4 border-r border-[oklch(0.89_0.008_260/0.55)] font-medium text-[oklch(0.16_0.02_260)]">Elektronik & Alarm</td>
                  <td className="p-4 border-r border-[oklch(0.89_0.008_260/0.55)]">Lokale Sirene, App-Benachrichtigung</td>
                  <td className="p-4 border-r border-[oklch(0.89_0.008_260/0.55)]">Dual-Path (IP/LTE), Aufschaltung Leitstelle</td>
                  <td className="p-4">Mehrfach redundante Übertragung, Seismische Sensoren</td>
                </tr>
                <tr className="hover:bg-[oklch(0.968_0.004_260)] transition-colors">
                  <td className="p-4 border-r border-[oklch(0.89_0.008_260/0.55)] font-medium text-[oklch(0.16_0.02_260)]">Zutrittskontrolle</td>
                  <td className="p-4 border-r border-[oklch(0.89_0.008_260/0.55)]">Mechanischer Schlüssel (gesichert)</td>
                  <td className="p-4 border-r border-[oklch(0.89_0.008_260/0.55)]">RFID / NFC Leser mit Protokollierung</td>
                  <td className="p-4">Biometrie, 2-Faktor (Karte + PIN + Venen)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* 04 Bereiche: Raster */}
        <Section tone="muted">
          <SectionHeading
            nummer="04"
            eyebrow="Disziplinen"
            title="Die Dimensionen der Sicherheitstechnik"
            lead="Jeder Bereich erfüllt eine spezifische Aufgabe. Die Stärke eines Konzepts liegt in der intelligenten Verknüpfung."
          />

          <ul className="mt-12 grid border-t border-[oklch(0.89_0.008_260/0.55)] sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = SERVICE_ICONS[service.slug];
              const anzahl = services.length;
              const letzte = index === anzahl - 1;
              const breitSm = letzte && anzahl % 2 === 1;
              const breitLg = letzte && anzahl % 3 !== 0;
              return (
                <li
                  key={service.id}
                  className={cn(
                    'border-b border-[oklch(0.89_0.008_260/0.55)]',
                    index % 2 === 1 ? 'sm:border-l' : 'sm:border-l-0',
                    index % 3 === 0 ? 'lg:border-l-0' : 'lg:border-l',
                    breitSm ? 'sm:col-span-2' : 'sm:col-span-1',
                    breitLg ? (anzahl % 3 === 1 ? 'lg:col-span-3' : 'lg:col-span-2') : 'lg:col-span-1',
                  )}
                >
                  <Link
                    href={`/${ROUTE}/${service.slug}`}
                    className={cn(
                      'group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[oklch(0.968_0.004_260)] sm:p-8',
                      breitSm && 'sm:flex-row sm:items-center sm:gap-8',
                      breitLg && 'lg:flex-row lg:items-center lg:gap-8',
                      breitSm && !breitLg && 'lg:flex-col',
                    )}
                  >
                    {Icon ? (
                      <Icon size={40} className="shrink-0 text-[oklch(0.16_0.02_260)] transition-transform group-hover:scale-110 motion-reduce:transition-none" />
                    ) : (
                      <BereichIcon area={ROUTE} size={40} className="shrink-0 text-[oklch(0.16_0.02_260)] transition-transform group-hover:scale-110 motion-reduce:transition-none" />
                    )}
                    <span
                      className={cn(
                        'mt-6 block min-w-0 flex-1',
                        breitSm && 'sm:mt-0',
                        breitLg ? 'lg:mt-0' : breitSm && 'lg:mt-6',
                      )}
                    >
                      <span className="block text-lg font-semibold text-[oklch(0.16_0.02_260)] transition-colors duration-300 group-hover:text-[oklch(0.52_0.24_260)]">
                        {service.title}
                      </span>
                      <span className="mt-2 block text-sm text-[oklch(0.32_0.02_260)]">
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
                      <span className="font-mono text-xs uppercase tracking-widest text-[oklch(0.52_0.015_260)]">
                        Zum Bereich
                      </span>
                      <GlyphPfeilRechts
                        size={18}
                        className="shrink-0 text-[oklch(0.52_0.015_260)] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Section>

        {/* 05 Fach-FAQs (Massive Content Expansion) */}
        <Section>
          <SectionHeading
            nummer="05"
            eyebrow="Expertise & Wissen"
            title="Häufig gestellte Fachfragen"
            lead="Transparente Antworten auf komplexe technische Sachverhalte, basierend auf unserer langjährigen Erfahrung."
          />
          <div className="mt-12 space-y-6">
            <div className="border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] rounded-xl p-6 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.02)]">
              <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Warum ist eine reine Elektronik-Lösung (z.B. nur Kameras) oft unzureichend?</h3>
              <p className="mt-3 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
                Elektronische Systeme wie Videoüberwachung oder Bewegungsmelder dienen primär der Detektion und Verifikation eines Einbruchversuchs.
                Sie schlagen Alarm und liefern Beweismaterial, stellen jedoch dem Täter keinen physischen Widerstand entgegen. Ein erfahrener Einbrecher
                benötigt nur wenige Sekunden, um ein ungesichertes Fenster aufzuhebeln. Wenn der Alarm auslöst, ist er bereits im Gebäude. Daher muss
                jeder wirksame Schutz mit massiver mechanischer Sicherheit (wie Pilzkopfverriegelungen, Sicherheitsschließblechen und hochwertigen
                Profilzylindern) beginnen, die den Täter so lange aufhält, bis die elektronisch alarmierte Hilfe eintrifft. Die Elektronik meldet, die Mechanik wehrt ab.
              </p>
            </div>

            <div className="border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] rounded-xl p-6 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.02)]">
              <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Wie verhält es sich mit dem Datenschutz bei der Videoüberwachung am Eigenheim?</h3>
              <p className="mt-3 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
                Der Einsatz von Videoüberwachungstechnik unterliegt strengen datenschutzrechtlichen Vorgaben (DSGVO). Der wichtigste Grundsatz: Sie
                dürfen ausschließlich Ihr eigenes Privatgrundstück erfassen. Öffentliche Räume wie Gehwege, Straßen, sowie angrenzende Nachbargrundstücke
                und gemeinschaftlich genutzte Zuwege dürfen nicht im Bildausschnitt liegen. Moderne Kamerasysteme verfügen über digitale Maskierungsfunktionen
                (Privacy Zones), mit denen sensible Bildbereiche schwarz ausgeblendet werden können. Zudem besteht eine Kennzeichnungspflicht: Durch
                deutlich sichtbare Schilder muss auf die Videoüberwachung hingewiesen werden, bevor eine Person den Erfassungsbereich betritt. Wir richten
                die Anlagen bei der Installation exakt gesetzeskonform ein und protokollieren die Blickwinkel im Übergabeprotokoll.
              </p>
            </div>

            <div className="border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] rounded-xl p-6 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.02)]">
              <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Was bedeutet VdS-Anerkennung und warum ist sie wichtig?</h3>
              <p className="mt-3 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
                Die VdS Schadenverhütung GmbH ist eine unabhängige Institution, die Sicherheitstechnik nach strengsten Kriterien prüft und zertifiziert.
                Eine VdS-Anerkennung garantiert, dass ein Produkt oder eine gesamte Anlage höchste Qualitätsstandards bezüglich Zuverlässigkeit,
                Sabotageschutz und Fehlalarmsicherheit erfüllt. Versicherungen fordern häufig ab bestimmten Versicherungssummen oder bei gewerblichen
                Risiken zwingend eine VdS-anerkannte Anlage, installiert durch einen VdS-zertifizierten Errichter, als Voraussetzung für den
                Versicherungsschutz oder zur Gewährung von Prämienrabatten. Auch im Privatbereich bietet VdS-zertifizierte Technik die Gewissheit,
                dass das System im Ernstfall kompromisslos funktioniert.
              </p>
            </div>

            <div className="border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] rounded-xl p-6 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.02)]">
              <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Wie sicher sind funkbasierte Alarmsysteme im Vergleich zu kabelgebundenen?</h3>
              <p className="mt-3 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
                Moderne professionelle Funkalarmanlagen stehen kabelgebundenen Systemen heute kaum noch nach. Sie nutzen dedizierte Frequenzbänder
                (z.B. 868 MHz), bidirektionale Kommunikation (Melder und Zentrale tauschen permanent Statusinformationen aus) und hochgradig
                verschlüsselte Protokolle (oft AES-128 oder AES-256). Zudem verfügen sie über ein aktives Anti-Jamming: Wird versucht, das Funksignal
                mutwillig zu stören oder zu überlagern, erkennt die Zentrale dies sofort und löst einen Sabotagealarm aus. Für den privaten Bestand
                sowie kleinere Gewerbebetriebe sind Funkanlagen oft die wirtschaftlichste Lösung, da sie sich ohne aufwendige Kabelverlege- und
                Schlitzarbeiten nachrüsten lassen. Bei Neubauten oder in Hochsicherheitsbereichen raten wir dennoch zur fest verdrahteten Anlage,
                da sie keinerlei Batteriewechsel erfordert und als absolut manipulationsresistent gilt.
              </p>
            </div>

            <div className="border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] rounded-xl p-6 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.02)]">
              <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Welche Rolle spielt die Aufschaltung auf eine Notruf- und Serviceleitstelle (NSL)?</h3>
              <p className="mt-3 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
                Eine lokale Sirene allein reicht heute oft nicht mehr aus, da Passanten in der Regel kaum noch auf akustische Alarme reagieren (Stichwort:
                Fehlalarm-Ignoranz). Die Aufschaltung der Einbruchmeldeanlage auf eine VdS-anerkannte Leitstelle stellt sicher, dass ein Alarmereignis
                binnen Sekunden an professionelles Personal übertragen wird – 24 Stunden am Tag, an 365 Tagen im Jahr. Die Leitstelle verifiziert den Alarm
                (z.B. durch parallele Videoübertragung oder Rückruf) und leitet umgehend den vorab definierten Maßnahmenplan ein (Alarmierung der Polizei,
                Entsendung eines privaten Wachdienstes, Benachrichtigung der Inhaber). Dies ist die einzige Garantie für eine verlässliche und
                zeitnahe Intervention im Ernstfall.
              </p>
            </div>
          </div>
        </Section>

        {/* 06 Recht und Verantwortung */}
        <Section id="recht-und-verantwortung" tone="muted">
          <SectionHeading
            nummer="06"
            eyebrow="Recht und Verantwortung"
            title="Sicherheitstechnik im rechtlichen Rahmen"
            lead="Eine Anlage muss nicht nur technisch einwandfrei sein, sondern auch konform zu geltenden Gesetzen betrieben werden."
          />

          <div
            role="note"
            className="mt-12 flex max-w-3xl gap-4 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5 sm:p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]"
          >
            <GlyphInfo size={22} className="mt-1 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">
                Die Betreiberverantwortung
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[oklch(0.32_0.02_260)] list-disc pl-5">
                <li>
                  Wer eine Anlage mit Video-, Audio- oder Protokollfunktion betreibt, verantwortet deren
                  rechtmäßige Nutzung — also Zweck, Umfang, Speicherdauer, Zugriff und Kennzeichnung.
                  Wir beraten technisch; eine Rechtsberatung ist das ausdrücklich nicht.
                </li>
                <li>
                  Kameras dürfen öffentliche Flächen wie Gehwege und Straßen sowie Nachbargrundstücke
                  nicht erfassen. Wir planen Aufstellort und Blickfeld entsprechend.
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
                  Protokollfunktionen erfassen personenbezogene Daten. Im Beschäftigtenkontext ist
                  zusätzlich die betriebliche Mitbestimmung zu beachten.
                </li>
              </ul>
              <p className="mt-6">
                <Link
                  href="/rechtliches/datenschutz"
                  className="inline-flex min-h-[44px] items-center font-semibold text-[oklch(0.52_0.24_260)] hover:underline"
                >
                  Hinweise zum Datenschutz
                </Link>
              </p>
            </div>
          </div>
        </Section>

        {/* 07 Weiterlesen */}
        <Section tight>
          <SectionHeading nummer="07" eyebrow="Weiterlesen" title="Passende Seiten" />
          <ul className="mt-8 grid border-t border-[oklch(0.89_0.008_260/0.55)] md:grid-cols-2">
            {WEITER.map((eintrag, index) => (
              <li
                key={eintrag.href}
                className={cn('border-b border-[oklch(0.89_0.008_260/0.55)] py-6 md:px-8', index === 0 ? 'md:pl-0' : 'md:border-l md:pr-0')}
              >
                <p className="font-mono text-xs uppercase tracking-widest text-[oklch(0.52_0.015_260)]">
                  {eintrag.etikett}
                </p>
                <p className="mt-3 text-lg font-semibold text-[oklch(0.16_0.02_260)]">{eintrag.titel}</p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[oklch(0.32_0.02_260)]">{eintrag.text}</p>
                <Link
                  href={eintrag.href}
                  className="group mt-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[oklch(0.52_0.24_260)] hover:text-[oklch(0.46_0.24_260)]"
                >
                  {eintrag.link}
                  <GlyphPfeilRechts
                    size={16}
                    className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
          {weitereLinks.length > 0 && (
            <ul className="mt-8 border-t border-[oklch(0.89_0.008_260/0.55)]">
              {weitereLinks.map((link) => (
                <li key={link.href} className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                  <Link
                    href={link.href}
                    className="group flex min-h-[44px] items-center justify-between gap-3 py-4 text-sm font-semibold text-[oklch(0.16_0.02_260)] transition-colors duration-300 hover:text-[oklch(0.52_0.24_260)]"
                  >
                    {link.label}
                    <GlyphPfeilRechts
                      size={16}
                      className="shrink-0 text-[oklch(0.52_0.24_260)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </main>
    </>
  );
}
