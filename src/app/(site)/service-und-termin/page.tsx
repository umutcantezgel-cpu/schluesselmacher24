import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarSearch, MapPin, MessageSquare, Phone } from 'lucide-react';

import { getPageContent, getSettings } from '@/lib/data';
import { getRichtwerte } from '@/lib/data/richtwerte';
import { NAV_AREAS, PROCESS_LABELS } from '@/lib/navigation';
import { formatWeekday } from '@/lib/format';
import { Card, CardBody } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { ServiceEinsatzRechner } from '@/components/calculator/service-einsatz-rechner';
import { Accordion } from '@/components/ui/accordion';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent('service-und-termin');
  return {
    title: page?.seo.title ?? 'Service und Termin',
    description: page?.seo.description,
    alternates: { canonical: '/service-und-termin' },
  };
}

const ENTRIES = [
  {
    href: '/service-und-termin/anfrage',
    label: 'Allgemeine Anfrage',
    description: 'Wenn Ihr Anliegen in keinen der Fachbereiche passt.',
    icon: MessageSquare,
  },
  {
    href: '/service-und-termin/terminstatus',
    label: 'Terminstatus',
    description: 'Stand Ihres Vorgangs mit Vorgangsnummer und E-Mail-Adresse abrufen.',
    icon: CalendarSearch,
  },
  {
    href: '/service-und-termin/vor-ort',
    label: 'Vor-Ort-Leistungen',
    description: 'Was wir direkt bei Ihnen im Objekt erledigen.',
    icon: MapPin,
  },
  {
    href: '/service-und-termin/kontakt',
    label: 'Kontakt',
    description: 'Erreichbarkeit, Anschrift und Anfahrt.',
    icon: Phone,
  },
];

/** Sichtbare FAQ der Seite — auch Grundlage der strukturierten Daten. */
const SERVICE_FAQ = [
            {
              question: 'Wie lange dauert die Implementierung einer komplexen Schließanlage?',
              answer: 'Die Dauer variiert stark nach Umfang und Komplexität. Nach der Bestandsaufnahme und Freigabe des Schließplans hängt die Liefer- und Fertigungszeit vom Hersteller und vom Umfang ab; den verbindlichen Zeitplan nennen wir mit dem Angebot. Die Montage vor Ort stimmen wir so ab, dass Ihr Betriebsablauf möglichst wenig gestört wird. Elektronische Systeme erfordern oft zusätzliche Vorbereitungen in der IT-Infrastruktur.'
            },
            {
              question: 'Sind elektronische Zutrittssysteme sicher vor Hacker-Angriffen?',
              answer: 'Absolute Sicherheit gibt es in der IT nicht, wir empfehlen deshalb Systeme, die aktuelle kryptografische Standards nutzen. Die Kommunikation zwischen Transponder, Leser und Steuergerät erfolgt zumeist verschlüsselt (z.B. AES-128 oder höher). Zudem achten wir auf eine sichere Netzwerkarchitektur und empfehlen regelmäßige Firmware-Updates, um das Sicherheitsniveau kontinuierlich aufrechtzuerhalten.'
            },
            {
              question: 'Was passiert bei einem Stromausfall mit elektronischen Schlössern?',
              answer: 'Viele elektronische Türkomponenten sind batteriebetrieben oder verfügen über Notstromakkus. Bei batteriebetriebenen Zylindern erhalten Sie rechtzeitig Warnungen bei niedrigem Batteriestand. Vernetzte, kabelgebundene Systeme lassen sich über eine unterbrechungsfreie Stromversorgung (USV) gegen Ausfälle absichern. Fluchtwege sind mechanisch so konstruiert, dass sie jederzeit von innen passierbar bleiben.'
            },
            {
              question: 'Können bestehende mechanische Schließanlagen elektronisch aufgerüstet werden?',
              answer: 'Ja, in vielen Fällen ist eine hybride Lösung oder eine schrittweise Migration möglich und wirtschaftlich sinnvoll. Wir können beispielsweise stark frequentierte Außentüren mit elektronischen Zylindern oder Wandlesern ausstatten, während Innentüren weiterhin mechanisch betrieben werden. Dies erfordert jedoch eine sorgfältige Analyse der vorhandenen Türen und Einsteckschlösser, um Kompatibilität und Zertifizierungen (z.B. Brandschutz) nicht zu gefährden.'
            },
            {
              question: 'Welche Informationen benötigen Sie für einen fundierten Kostenvoranschlag?',
              answer: 'Für eine präzise Kalkulation benötigen wir detaillierte Angaben zum Objekt: Anzahl und Art der Türen (Holz, Metall, Glas, Brandschutz), die gewünschte Sicherheitsstufe, eine grobe Vorstellung der Nutzerhierarchie (wer darf wohin?) und idealerweise Grundrisspläne. Je mehr Kontext wir im Vorfeld erhalten, desto genauer und zielgerichteter können wir die Architektur planen und kalkulieren. Der Orientierungsrechner auf dieser Seite nennt für einzelne Serviceleistungen höchstens eine unverbindliche Spanne und ersetzt kein Angebot.'
            }
          ];

import { EnterpriseRoiCalculator } from '@/components/calculator/enterprise-roi-calculator';

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ServiceUndTerminPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const [page, settings, richtwerte] = await Promise.all([
    getPageContent('service-und-termin'),
    getSettings(),
    getRichtwerte(),
  ]);

  return (
    <main data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
      <JsonLd
        data={pageGraphSchema({
          path: '/service-und-termin',
          name: page?.headline ?? 'Service und Termin',
          description: page?.seo.description,
          crumbs: [{ href: '/service-und-termin', label: 'Service und Termin' }],
          faq: SERVICE_FAQ,
        })}
      />

      <PageHeader
        eyebrow="Service und Termin"
        title={page?.headline ?? 'Service und Termin'}
        lead={page?.subline}
        crumbs={[{ href: '/service-und-termin', label: 'Service und Termin' }]}
      />

      <Section>
        <p className="max-w-2xl text-[15px] leading-relaxed text-foreground-muted">{page?.intro}</p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {ENTRIES.map((entry) => {
            const Icon = entry.icon;
            return (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  className="group flex h-full gap-4 rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon size={19} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-bold text-foreground group-hover:text-primary">
                      {entry.label}
                    </span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-foreground-muted">
                      {entry.description}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Wege zu uns"
          title="Vier Abläufe, ein Erlebnis"
          lead="Je nach Anliegen führt ein anderer Weg schneller zum Ziel. Bedienung, Sprache und Gestaltung sind überall gleich."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(PROCESS_LABELS) as Array<keyof typeof PROCESS_LABELS>).map((key) => {
            const process = PROCESS_LABELS[key];
            const areas = NAV_AREAS.filter((a) => a.process === key);
            return (
              <li key={key}>
                <Card className="h-full">
                  <CardBody className="flex h-full flex-col">
                    <p className="text-[15px] font-bold text-foreground">{process.label}</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
                      {process.hint}
                    </p>
                    <ul className="mt-4 flex-1 space-y-1.5 border-t border-border pt-3">
                      {areas.map((area) => (
                        <li key={area.key}>
                          <Link
                            href={area.href}
                            className="text-[13px] text-foreground-muted hover:text-primary hover:underline"
                          >
                            {area.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ul>
      </Section>


      <Section>
        <SectionHeading
          eyebrow="Architektonische Methodik"
          title="Präzision in jedem Schritt: Unsere Service-Architektur"
          lead="Wir verstehen Schließtechnik und Sicherheitssysteme nicht als isolierte Produkte, sondern als integrierte architektonische Lösungen, die höchste Ansprüche an Präzision, Zuverlässigkeit und Langlebigkeit erfüllen müssen."
        />

        <div className="mt-8 prose-sm24 max-w-none space-y-6">
          <p>
            Die Konzeption und Implementierung moderner Schließ- und Sicherheitstechnik erfordert ein tiefgreifendes Verständnis für mechanische Präzision, elektronische Integration und architektonische Rahmenbedingungen. Unser Service-Ansatz basiert auf einer strikten, methodischen Vorgehensweise, die sicherstellt, dass jede von uns geplante und umgesetzte Lösung exakt auf die spezifischen Anforderungen des jeweiligen Objekts abgestimmt ist. Wir lehnen standardisierte &quot;Out-of-the-box&quot;-Lösungen ab, wo maßgeschneiderte Sicherheit gefordert ist. Jeder Auftrag beginnt mit einer detaillierten Analyse der bestehenden Infrastruktur, der Identifikation potenzieller Schwachstellen und der Definition eines klaren, bedarfsorientierten Schutzziels.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">1. Die Phasen unserer Service-Implementierung</h3>
          <p>
            Unser Prozess ist in streng definierte Phasen unterteilt, die von der initialen Bestandsaufnahme bis zur finalen Abnahme und Dokumentation reichen.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Initiierung und Bedarfsanalyse:</strong> Im ersten Schritt erfassen wir nicht nur die offensichtlichen Anforderungen, sondern analysieren auch die verborgenen Risikofaktoren. Dies beinhaltet die Bewertung von Türbeschaffenheiten, Zylindermaßen, elektronischen Schnittstellen und den allgemeinen architektonischen Gegebenheiten vor Ort.</li>
            <li><strong>Projektierung und Lösungsdesign:</strong> Basierend auf der Analyse entwickeln wir ein fundiertes Konzept. Bei Schließanlagen bedeutet dies die Erstellung präziser Schließpläne unter Berücksichtigung komplexer Hierarchien und Zutrittsberechtigungen. Bei elektronischen Systemen planen wir die Vernetzung, Stromversorgung und Integration in bestehende IT- oder Smart-Home-Umgebungen.</li>
            <li><strong>Präzise Fertigung und Vorkonfiguration:</strong> Bevor wir vor Ort tätig werden, bereiten wir alle Komponenten in unserer Fachwerkstatt vor. Zylinder werden nach Maß gefertigt, Transponder codiert und elektronische Komponenten vorab getestet, um die Ausfallzeiten vor Ort auf ein absolutes Minimum zu reduzieren.</li>
            <li><strong>Fachgerechte Montage und Integration:</strong> Unsere Techniker installieren die Systeme mit höchster handwerklicher Präzision. Dies umfasst die fachgerechte Montage mechanischer Sicherungen ebenso wie die Verkabelung und Inbetriebnahme komplexer elektronischer Anlagen, stets unter Einhaltung geltender Normen und Sicherheitsrichtlinien (z.B. DIN 18252 für Profilzylinder, DIN EN 1303).</li>
            <li><strong>Dokumentation und Systemübergabe:</strong> Jedes Projekt schließt mit einer umfassenden Dokumentation ab. Sie erhalten Sicherungskarten, detaillierte Schließpläne, Bedienungsanleitungen und Protokolle, die eine lückenlose Nachvollziehbarkeit und zukünftige Erweiterbarkeit garantieren.</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-8">2. Technologische Standards und Materialqualität</h3>
          <p>
            Welche Produkte wir einsetzen, richtet sich nach Tür, Schutzziel und Budget. Entscheidend sind mechanische Stabilität, Schutz gegen Manipulation und eine lange Nutzungsdauer — die konkrete Auswahl stimmen wir mit Ihnen im Angebot ab.
          </p>
          <p>
            Bei mechanischen Zylindern achten wir auf Merkmale wie Bohr- und Ziehschutz, patentierte Schlüsselprofile (um illegale Kopien zu verhindern) und modulare Bauweisen, die nachträgliche Längenanpassungen ermöglichen. Im Bereich der Elektronik empfehlen wir Systeme mit verschlüsselter Kommunikation (z.B. MIFARE DESFire EV2/EV3, Bluetooth Low Energy mit AES-128-Verschlüsselung) und ausfallsichere Systeme, die auch bei Stromausfall eine definierte Grundsicherheit gewährleisten. Die nahtlose Verzahnung von Mechanik und Elektronik (Mechatronik) bildet oft den Kern unserer fortschrittlichsten Lösungen.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">3. Nachhaltigkeit und Lebenszyklus-Management</h3>
          <p>
            Eine professionelle Sicherheitslösung ist eine langfristige Investition. Daher legen wir großen Wert auf das Lebenszyklus-Management der von uns betreuten Systeme. Dies beginnt bereits bei der Planung durch die Wahl skalierbarer und modularer Architekturen. Wenn sich Ihre Anforderungen ändern – sei es durch räumliche Erweiterungen, organisatorische Umstrukturierungen oder veränderte Bedrohungslagen – lassen sich unsere Systeme effizient anpassen.
          </p>
          <p>
            Darüber hinaus bieten wir strukturierte Wartungskonzepte an. Regelmäßige Inspektionen, Software-Updates für elektronische Komponenten und die präventive Wartung hochbeanspruchter mechanischer Teile stellen sicher, dass das Sicherheitsniveau über Jahre hinweg konstant hoch bleibt und kostspielige Totalausfälle vermieden werden.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">4. Gewerbeobjekte und öffentliche Einrichtungen</h3>
          <p>
            Neben Privatkunden betreuen wir Gewerbeobjekte, Hausverwaltungen und öffentliche Einrichtungen. Dort gelten oft zusätzliche Vorgaben und abgestimmte organisatorische Abläufe, die wir vor der Planung gemeinsam mit Ihnen klären.
          </p>
          <p>
            Wir verstehen die Herausforderungen von Fluchtwegsteuerung (gemäß DIN EN 179 und DIN EN 1125), Brandschutzvorgaben und die Integration von Zutrittskontrollsystemen in übergeordnete Gebäudeleittechnik. Für den gewerblichen Bereich planen wir Lösungen so, dass sie mit weiteren Türen, Nutzern und Standorten mitwachsen können.
          </p>
        </div>
      </Section>

      <Section tone="muted" id="orientierung">
        <SectionHeading
          eyebrow="Orientierung"
          title="Womit Sie bei einem Serviceeinsatz rechnen können"
          lead="Für häufige Leistungen vor Ort erhalten Sie hier eine erste Orientierung. Den verbindlichen Preis nennen wir nach der Prüfung Ihrer Anfrage."
        />
        <div className="mt-8 max-w-3xl">
          <ServiceEinsatzRechner
            werte={richtwerte.serviceEinsatz}
            anfrageHref="/service-und-termin/anfrage?thema=service-und-termin"
          />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Fachwissen"
          title="Häufig gestellte Fragen (FAQ)"
          lead="Detaillierte Antworten auf die wichtigsten Fragen rund um unsere Services, Abläufe und technischen Standards."
        />
        <Accordion
          items={SERVICE_FAQ}
          className="mt-8 max-w-4xl mx-auto"
        />
      </Section>


      <Section>
        <SectionHeading
          eyebrow="Enterprise ROI"
          title="Return on Investment und Lifecycle-Optimierung"
          lead="Eine Investition in erstklassige Schließtechnik ist eine Investition in die Zukunft. Durch signifikant reduzierte Ausfallzeiten und optimierte Prozesse amortisieren sich Enterprise-Systeme oft in Rekordzeit."
        />

        <div className="mt-8 prose-sm24 max-w-none space-y-6">
          <p>
            Im Enterprise-Segment oder bei größeren Gewerbeobjekten stellt die Wahl der richtigen Schließ- und Sicherheitstechnik weit mehr dar als nur eine Frage des physischen Einbruchschutzes. Vielmehr ist es eine strategische Entscheidung, die direkte Auswirkungen auf die Betriebskosten, die administrativen Aufwände und nicht zuletzt auf den reibungslosen Ablauf von Kernprozessen hat. Unsere Erfahrung zeigt, dass herkömmliche, mechanische Anlagen ab einer gewissen Objektgröße und Fluktuationsrate rasch an ihre ökonomischen und organisatorischen Grenzen stoßen. Genau hier setzen wir mit einer fundierten ROI-Betrachtung (Return on Investment) und einer auf Lifecycle-Kosten fokussierten Planung an, um nicht nur Sicherheit, sondern echte betriebswirtschaftliche Mehrwerte zu schaffen.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">Versteckte Kosten in der Administration</h3>
          <p>
            Ein wesentlicher Kostentreiber in großen Objekten ist die Schlüsselverwaltung. Bei rein mechanischen Systemen bedeutet der Verlust eines General- oder Gruppenschlüssels im Worst Case den Austausch der gesamten Schließanlage, um die Sicherheit wiederherzustellen. Die Kosten hierfür können leicht in die Zehntausende gehen. Doch selbst im regulären Betrieb summiert sich der Aufwand: Das Anfertigen von Kopien, die Dokumentation von Schlüsselausgaben, die Rückforderung bei Mitarbeiterwechseln – all dies bindet wertvolle Ressourcen im Facility Management oder der HR-Abteilung. Wir analysieren diese versteckten &quot;Total Cost of Ownership&quot; (TCO) sehr genau und stellen sie den Investitionskosten eines intelligenten, elektronischen oder mechatronischen Systems gegenüber. In der Regel offenbart sich dabei ein überraschendes Einsparpotenzial.
          </p>
          <p>
            Elektronische Zutrittskontrollsysteme eliminieren das Risiko teurer Anlagenwechsel vollständig. Ein verlorener Transponder wird innerhalb von Sekunden im System gesperrt und durch einen neuen ersetzt. Die Materialkosten für das Medium liegen im niedrigen einstelligen Euro-Bereich. Zudem lassen sich temporäre Berechtigungen (z.B. für Reinigungskräfte oder Handwerker) exakt definieren und automatisch nach Ablauf wieder entziehen. Dieser &quot;Self-Healing&quot;-Aspekt elektronischer Systeme reduziert den administrativen Overhead drastisch und führt oft schon im ersten oder zweiten Betriebsjahr zu einem positiven ROI.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">Reduzierung von Ausfallzeiten und Prozessoptimierung</h3>
          <p>
            Neben den direkten administrativen Kosten spielen Ausfallzeiten eine entscheidende Rolle in der Wirtschaftlichkeitsbetrachtung. Eine blockierte Sicherheitstür in einem Logistikzentrum oder ein defekter Schließzylinder in einer Produktionshalle können Arbeitsabläufe massiv stören und so enorme Folgekosten verursachen. Wir planen Anlagen daher konsequent unter dem Aspekt der Hochverfügbarkeit. Dies beinhaltet die Auswahl von Komponenten, die für höchste Zyklenzahlen (z.B. nach Klasse 6 der EN 1303 für über 100.000 Schließzyklen) zertifiziert sind, sowie die Implementierung redundanter Systeme an kritischen Zugängen.
          </p>
          <p>
            Darüber hinaus ermöglichen moderne vernetzte Systeme eine proaktive Wartung (Predictive Maintenance). Intelligente Beschläge und Zylinder melden beispielsweise einen sinkenden Batteriestand oder schwergängige Mechanik frühzeitig an das zentrale Managementsystem. Unsere Servicetechniker können so rechtzeitig eingreifen, bevor es zu einem tatsächlichen Ausfall kommt. Diese prädiktive Herangehensweise maximiert die Systemverfügbarkeit und verlängert die Lebensdauer der Hardware erheblich.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">Skalierbarkeit und Zukunftssicherheit</h3>
          <p>
            Ein weiterer entscheidender Faktor für die Rentabilität ist die Skalierbarkeit der Lösung. Unternehmen wachsen, Räumlichkeiten werden umstrukturiert, neue Standorte kommen hinzu. Ein statisches Sicherheitssystem wird in solchen Phasen schnell zum Flaschenhals und erfordert kostspielige Neuinvestitionen. Wir setzen daher konsequent auf offene Systemarchitekturen und Standards. Die von uns geplanten Anlagen können nahtlos erweitert werden, ohne dass das Basissystem ausgetauscht werden muss.
          </p>
          <p>
            Besonders vorteilhaft ist die Integration von Mobile Access – also die Nutzung des Smartphones als digitaler Schlüssel (via Bluetooth Low Energy oder NFC). Hier entfallen selbst die Kosten für physische Identmedien komplett. Berechtigungen (Mobile Keys) werden verschlüsselt over-the-air (OTA) an das Smartphone des Nutzers gesendet. Dies ermöglicht eine bisher unerreichte Flexibilität, beispielsweise beim Check-in in Hotels oder bei der Vergabe von Zutrittsrechten für Remote-Standorte, ohne dass ein physischer Schlüsselübergabeprozess stattfinden muss.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">Vergleichsmatrix: Mechanik vs. Mechatronik vs. Elektronik</h3>
          <p>
             Um Ihnen die Entscheidung zu erleichtern, haben wir die wichtigsten Parameter der verschiedenen Systemansätze basierend auf jahrelanger Erfahrung in einer übersichtlichen Matrix gegenübergestellt. Wir weisen jedoch darauf hin, dass die optimale Lösung in der Praxis oft aus einer intelligenten Kombination (Hybrid-Anlage) besteht, bei der beispielsweise Außenhaut und Hochsicherheitsbereiche elektronisch, untergeordnete Innentüren jedoch mechanisch gesichert werden.
          </p>
          <div className="overflow-x-auto mt-6 border border-[oklch(0.89_0.008_260/0.55)] rounded-xl shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] bg-[oklch(0.968_0.004_260)]">
             <table className="w-full text-sm text-left">
                <thead className="bg-[oklch(0.988_0.002_260)] text-[oklch(0.16_0.02_260)] border-b border-[oklch(0.89_0.008_260/0.55)]">
                   <tr>
                      <th className="px-6 py-4 font-semibold">Kriterium</th>
                      <th className="px-6 py-4 font-semibold">Mechanische Systeme</th>
                      <th className="px-6 py-4 font-semibold">Mechatronische Systeme</th>
                      <th className="px-6 py-4 font-semibold">Vollelektronische Systeme</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.32_0.02_260)]">
                   <tr className="hover:bg-[oklch(0.988_0.002_260)] transition-colors">
                      <td className="px-6 py-4 font-medium">Initiale Investitionskosten</td>
                      <td className="px-6 py-4">Niedrig bis Mittel</td>
                      <td className="px-6 py-4">Mittel bis Hoch</td>
                      <td className="px-6 py-4">Hoch (Verkabelung/Infrastruktur)</td>
                   </tr>
                   <tr className="hover:bg-[oklch(0.988_0.002_260)] transition-colors">
                      <td className="px-6 py-4 font-medium">Folgekosten bei Schlüsselverlust</td>
                      <td className="px-6 py-4">Sehr Hoch (Anlagentausch oft nötig)</td>
                      <td className="px-6 py-4">Sehr Niedrig (Sperrung elektronisch)</td>
                      <td className="px-6 py-4">Sehr Niedrig (Sperrung elektronisch)</td>
                   </tr>
                   <tr className="hover:bg-[oklch(0.988_0.002_260)] transition-colors">
                      <td className="px-6 py-4 font-medium">Flexibilität bei Nutzungsänderung</td>
                      <td className="px-6 py-4">Gering (neue Zylinder/Schlüssel erforderlich)</td>
                      <td className="px-6 py-4">Sehr Hoch (Umprogrammierung via Software)</td>
                      <td className="px-6 py-4">Maximal (Real-Time Umprogrammierung)</td>
                   </tr>
                   <tr className="hover:bg-[oklch(0.988_0.002_260)] transition-colors">
                      <td className="px-6 py-4 font-medium">Protokollierung & Nachvollziehbarkeit</td>
                      <td className="px-6 py-4">Nicht möglich</td>
                      <td className="px-6 py-4">Möglich (Auslesen am Zylinder/Schlüssel)</td>
                      <td className="px-6 py-4">Echtzeit (zentrales Dashboard)</td>
                   </tr>
                   <tr className="hover:bg-[oklch(0.988_0.002_260)] transition-colors">
                      <td className="px-6 py-4 font-medium">Installationsaufwand</td>
                      <td className="px-6 py-4">Minimal (Plug & Play)</td>
                      <td className="px-6 py-4">Gering (Batteriebetrieben, kein Kabel)</td>
                      <td className="px-6 py-4">Hoch (Verkabelung an Türen nötig)</td>
                   </tr>
                </tbody>
             </table>
          </div>

          <p className="mt-6">
            In der Praxis evaluieren wir diese Faktoren gemeinsam mit Ihnen im Rahmen eines ausführlichen Workshops. Wir erstellen auf Basis Ihrer Grundrisse, der Nutzerstrukturen und Ihrer Sicherheitsrichtlinien mehrere Szenarien. So können wir Ihnen nicht nur die technischen Spezifikationen, sondern auch belastbare Zahlen zu den erwarteten Lifecycle-Kosten der nächsten 5 bis 10 Jahre präsentieren.
          </p>

          <div className="my-12">
            <EnterpriseRoiCalculator />
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-8">Integration in das Facility Management</h3>
          <p>
             Ein letzter, aber entscheidender Punkt unserer Enterprise-Strategie ist die tiefe Integration der Schließtechnik in übergeordnete Managementsysteme. Insbesondere bei großen Liegenschaften ist es ineffizient, Zutrittsrechte in einem separaten Silo zu verwalten. Wir realisieren Schnittstellen (APIs), die eine direkte Anbindung an HR-Systeme (z.B. SAP, Workday), Active Directory oder Hotel-Property-Management-Systeme (PMS) ermöglichen. Ein neuer Mitarbeiter erhält so automatisch mit der Erstellung seines HR-Profils die passenden Zutrittsrechte für sein Büro. Verlässt der Mitarbeiter das Unternehmen, werden diese Rechte mit dem Offboarding-Prozess synchron und ohne manuelle Zwischenschritte entzogen. Diese nahtlose Automatisierung ist der Schlüssel zur Vermeidung von Sicherheitslücken und zur Maximierung der operativen Effizienz.
          </p>
        </div>
      </Section>

      <Section tight>
        <SectionHeading eyebrow="Erreichbarkeit" title="Öffnungszeiten" />
        <div className="table-scroll mt-6">
          <table className="w-full min-w-[22rem] max-w-lg border-collapse text-[15px]">
            <tbody>
              {settings.openingHours.map((entry) => (
                <tr key={entry.day} className="border-b border-border">
                  <th scope="row" className="py-2.5 pr-6 text-left font-semibold text-foreground">
                    {formatWeekday(entry.day)}
                  </th>
                  <td className="py-2.5 text-foreground-muted">
                    {entry.spans.length === 0
                      ? 'geschlossen'
                      : entry.spans.map((s) => `${s.from}–${s.to} Uhr`).join(' und ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          {page?.seo.internalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
            >
              {link.label}
              <ArrowRight size={14} aria-hidden />
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
