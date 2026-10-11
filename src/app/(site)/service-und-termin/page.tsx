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
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';
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
    <>
      <div style={{ display: 'none' }} data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)} />
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

      {/*
        ================================================================================
        EXPANSION: > 800 WORDS DEEP DIVE CONTENT
        ================================================================================
      */}
      <Section className="py-16 md:py-24 lg:py-32 bg-[oklch(0.988_0.002_260)]">
        <div className="mx-auto max-w-4xl text-[oklch(0.32_0.02_260)] leading-relaxed">

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-8">
            Fundierte Fachkompetenz in Service und Technik
          </h2>

          <div className="prose prose-lg prose-neutral max-w-none">
            <p className="text-lg md:text-xl font-medium mb-6">
              In einer Welt, die zunehmend von komplexen Sicherheitssystemen und hochintegrierten Schließlösungen geprägt ist, reicht bloßes handwerkliches Geschick oft nicht mehr aus. Moderne Sicherheitstechnik erfordert ein tiefgreifendes Verständnis für elektronische und mechanische Komponenten, vernetzte Systeme und präzise Diagnostik. Unser Service- und Terminangebot ist deshalb weit mehr als nur eine einfache Terminbuchung. Es ist der Einstieg in eine hochprofessionelle, durchdachte Leistungsarchitektur, die auf Präzision, Verlässlichkeit und Schweizer Qualitätsstandards basiert.
            </p>

            <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-12 mb-6">
              Unsere architektonische Methodik
            </h3>

            <p className="mb-6">
              Jeder Auftrag, sei es die Konfiguration eines komplexen gleichschließenden Zylindersystems oder die Nachrüstung einer elektronischen Zutrittslösung, beginnt mit einer detaillierten Analyse. Wir setzen auf eine strukturierte Diagnose-Methodik, die Fehlerquellen systematisch ausschließt. Dabei analysieren wir nicht nur die unmittelbaren Symptome, sondern evaluieren das gesamte sicherheitstechnische Ökosystem Ihrer Immobilie oder Ihres Fahrzeugs.
            </p>

            <p className="mb-6">
              Unsere Techniker sind zertifiziert und durchlaufen kontinuierlich Fortbildungen, um bei der rasanten Entwicklung im Bereich Smart Locks, RFID-Transpondertechnologie und biometrischer Zugangssysteme stets &quot;State of the Art&quot; zu agieren. Diese Expertise spiegelt sich in unserer transparenten Kommunikation wider: Wir erklären Ihnen jeden Schritt, von der ersten Diagnose bis zur finalen Implementierung, detailliert und nachvollziehbar.
            </p>

            <div className="my-12">
              <ServiceBudgetCalculator />
            </div>

            <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-12 mb-6">
              Strukturierte Leistungsstufen & Vergleichsmatrix
            </h3>

            <p className="mb-6">
              Um unseren Kunden die bestmögliche Transparenz zu bieten, haben wir unsere Dienstleistungen in klar definierte Leistungsstufen unterteilt. Diese Architektur erlaubt es Ihnen, genau die Service-Tiefe zu wählen, die Ihr Projekt erfordert – ohne versteckte Kosten oder unklare Leistungsumfänge.
            </p>

            <div className="overflow-x-auto my-8 border border-[oklch(0.89_0.008_260/0.55)] rounded-2xl shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] bg-[oklch(0.968_0.004_260)]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)]">
                    <th className="py-4 px-6 font-semibold text-[oklch(0.16_0.02_260)]">Leistungsmerkmal</th>
                    <th className="py-4 px-6 font-semibold text-[oklch(0.16_0.02_260)]">Standard-Service</th>
                    <th className="py-4 px-6 font-semibold text-[oklch(0.16_0.02_260)]">Premium-Integration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
                  <tr>
                    <td className="py-4 px-6 font-medium text-[oklch(0.32_0.02_260)]">Diagnose & Analyse</td>
                    <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Basis-Fehlersuche</td>
                    <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Tiefen-Diagnostik inkl. System-Audit</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-[oklch(0.32_0.02_260)]">Hardware-Qualität</td>
                    <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Hochwertige OEM-Komponenten</td>
                    <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Zertifizierte High-End Fabrikate (VdS)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-[oklch(0.32_0.02_260)]">Reaktionszeit (SLA)</td>
                    <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Innerhalb von 48 Stunden</td>
                    <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Express-Intervention &lt; 24h</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-[oklch(0.32_0.02_260)]">Dokumentation</td>
                    <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Übergabeprotokoll</td>
                    <td className="py-4 px-6 text-[oklch(0.32_0.02_260)]">Detailliertes Security-Manifest</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mb-6">
              Der Standard-Service richtet sich primär an private Haushalte und kleinere gewerbliche Einheiten, die eine zuverlässige und zügige Lösung für alltägliche sicherheitstechnische Herausforderungen benötigen. Die Premium-Integration hingegen ist maßgeschneidert für komplexe Unternehmensstrukturen, Filialisten oder hochsensible Anlagen, bei denen absolute Ausfallsicherheit und lückenlose Dokumentation (z. B. für Versicherungen) unabdingbar sind.
            </p>

            <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-12 mb-6">
              Detaillierte Fach-FAQ zur Leistungsarchitektur
            </h3>

            <p className="mb-6">
              Die nachfolgenden Fragen und Antworten behandeln tiefgründige Aspekte unserer täglichen Arbeit und geben Ihnen einen Einblick in die fachliche Tiefe, mit der wir uns Ihren Herausforderungen widmen.
            </p>

            <div className="space-y-6 my-8">
              <div className="p-6 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] transition-all hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
                <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-2">1. Wie unterscheiden sich mechanische von mechatronischen Schließanlagen in der Wartung?</h4>
                <p className="text-[oklch(0.32_0.02_260)]">
                  Rein mechanische Anlagen erfordern zyklische Schmierung mit speziellen, nicht-harzenden Grafit- oder Pflegesprays sowie eine Sichtprüfung auf mechanischen Verschleiß (z.B. Abrieb an den Stiftzuhaltungen). Mechatronische Anlagen hingegen bedürfen zusätzlich regelmäßiger Firmware-Updates, Batterie-Management-Prüfungen und der Validierung von kryptografischen Zertifikaten innerhalb des Netzwerks. Unser Audit-Prozess deckt stets beide Dimensionen ab.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] transition-all hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
                <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-2">2. Welche Protokolle werden bei der Integration elektronischer Zutrittssysteme unterstützt?</h4>
                <p className="text-[oklch(0.32_0.02_260)]">
                  Wir arbeiten plattformübergreifend und unterstützen gängige Industriestandards wie MIFARE DESFire EV2/EV3, LEGIC advant sowie Bluetooth Low Energy (BLE) für mobile Credentials. Bei der Integration achten wir strikt auf Ende-zu-Ende-Verschlüsselung (AES-128 oder AES-256) zwischen Transponder, Leser und Controller, um Replay- oder Relay-Angriffe (wie sie bei veralteten RFID-Standards vorkommen) technisch auszuschließen.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] transition-all hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
                <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-2">3. Wie gewährleisten Sie die Reproduzierbarkeit bei Nachbestellungen (Schlüssel nach Code)?</h4>
                <p className="text-[oklch(0.32_0.02_260)]">
                  Bei Systemen mit Sicherungskarte verwalten wir die Codes in einer hochsicheren, offline-gekoppelten Datenbankstruktur. Die physische Fräsung erfolgt auf CNC-gesteuerten Hochpräzisionsmaschinen, die Toleranzen im Bereich von Hundertstel-Millimetern garantieren. Dadurch wird ausgeschlossen, dass ein nachbestellter Schlüssel durch kumulierte Toleranzabweichungen (der sogenannte &quot;Generationen-Drift&quot;) nicht mehr einwandfrei im Zylinder schließt.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] transition-all hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
                <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-2">4. Was umfasst ein ganzheitliches Security-Manifest im Premium-Service?</h4>
                <p className="text-[oklch(0.32_0.02_260)]">
                  Das Manifest dokumentiert nicht nur die installierte Hardware, sondern beinhaltet eine vollständige Schließplan-Topologie, Schwachstellenanalysen von peripheren Gebäudeöffnungen, eine fotografische Dokumentation aller Knotenpunkte sowie einen verbindlichen Lifecycle-Plan für Batterien und kritische mechanische Verschleißteile. Es dient oft als Vorlage für VdS-Zertifizierungen oder als Nachweis für Gewerbeversicherungen.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] transition-all hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
                <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-2">5. Wie geht Ihr Team mit systemischen Störungen bei vernetzten Anlagen um?</h4>
                <p className="text-[oklch(0.32_0.02_260)]">
                  Bei Netzwerkausfällen oder Controller-Störungen nutzen wir ein mehrstufiges Eskalationsmodell. Zunächst erfolgt ein Remote-Diagnoseversuch über gesicherte VPN-Tunnel, sofern die Anlage dies zulässt. Vor Ort isolieren wir den fehlerhaften Bus-Strang, prüfen RS485- oder IP-Verbindungen auf Latenzen oder Paketverluste und ersetzen betroffene Nodes, ohne das Gesamtsystem offline nehmen zu müssen. Redundante Offline-Fallbacks in den Lesern stellen dabei sicher, dass autorisierte Personen auch bei zentralen Serverausfällen jederzeit Zutritt erhalten.
                </p>
              </div>
            </div>

            <p className="mb-6 mt-12">
              Unser Anspruch ist es, Sicherheit nicht nur als Produkt, sondern als kontinuierlichen, intelligenten Prozess zu verstehen. Wenn Sie sich für unseren Service entscheiden, investieren Sie in langlebige, zukunftssichere Infrastruktur. Wir laden Sie ein, unser Fachwissen für Ihr nächstes Projekt zu nutzen. Vereinbaren Sie einen Termin und erleben Sie handwerkliche und technologische Exzellenz in Perfektion.
            </p>

          </div>
        </div>
      </Section>

    </>
  );
}
