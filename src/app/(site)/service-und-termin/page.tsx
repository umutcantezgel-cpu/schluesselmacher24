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

export default async function ServiceUndTerminPage() {
  const [page, settings, richtwerte] = await Promise.all([
    getPageContent('service-und-termin'),
    getSettings(),
    getRichtwerte(),
  ]);

  return (
    <>
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

      <Section id="service-budget-calculator" className="bg-[oklch(0.988_0.002_260)] py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="Projekt-Kalkulation" title="Kalkulieren Sie Ihr Service-Budget" lead="Nutzen Sie unseren interaktiven Rechner, um einen Richtwert für Ihr anstehendes Projekt zu erhalten. Die tatsächlichen Kosten können je nach spezifischen Anforderungen variieren." />
          <div className="mt-12 text-left">
            <ServiceBudgetCalculator />
          </div>
        </div>
      </Section>
      <Section id="faq" className="bg-[oklch(0.968_0.004_260)] py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Expertenwissen" title="Häufig gestellte Fragen (FAQ) zur Service- und Projektplanung" lead="Unsere detaillierte architektonische Methodik bei der Implementierung von Schließ- und Sicherheitstechnik wirft oft Fragen auf. Hier finden Sie umfassende Antworten auf die wichtigsten Aspekte der Planung und Ausführung." />
          <div className="space-y-6 mt-12">
            <Accordion
              items={[
                {
                  question: "Wie läuft eine Vor-Ort-Analyse für komplexe Schließanlagen typischerweise ab?",
                  answer: "Die Vor-Ort-Analyse ist das Fundament unserer Sicherheitsarchitektur. Zunächst begutachten wir die bestehenden mechanischen und elektronischen Schließkomponenten sowie die strukturellen Gegebenheiten Ihrer Türen. Wir analysieren die Personenströme, Zugangsberechtigungen und potenzielle Schwachstellen. Anschließend dokumentieren wir die Anforderungen in einem detaillierten Schließplan, der als Blaupause für die spätere Installation dient. Dieser Prozess dauert je nach Objektgröße zwischen zwei Stunden und einem ganzen Tag."
                },
                {
                  question: "Inwiefern unterscheidet sich die Planung von mechanischen und elektronischen Zugangslösungen?",
                  answer: "Mechanische Anlagen erfordern eine präzise Vorausplanung der Schließhierarchien, da nachträgliche Änderungen oft den Austausch physischer Zylinder bedingen. Elektronische Zugangslösungen (wie RFID, Bluetooth oder biometrische Systeme) bieten hier weit mehr Flexibilität, da Berechtigungen digital per Software vergeben, entzogen oder zeitlich limitiert werden können. Die Planung elektronischer Anlagen fokussiert sich stärker auf die Netzwerkarchitektur, Stromversorgung (batteriebetrieben vs. verkabelt) und die Integration in bestehende IT- oder Smart-Home-Systeme."
                },
                {
                  question: "Welche Faktoren beeinflussen die Kostenkalkulation eines Service-Einsatzes maßgeblich?",
                  answer: "Die Kalkulation stützt sich primär auf drei Säulen: Die Komplexität der Hardware (Hochsicherheitszylinder vs. Standardlösungen), den Arbeitsaufwand für Installation und Programmierung sowie die Dringlichkeit (Notdienst vs. geplanter Termin). Bei elektronischen Systemen fließen zudem die Kosten für die Software-Inbetriebnahme, Schulung der Administratoren und eventuell benötigte Gateways für Fernzugriffe ein. Unser Service-Budget-Rechner liefert Ihnen einen ersten, verlässlichen Richtwert."
                },
                {
                  question: "Wie gewährleisten Sie die Ausfallsicherheit bei elektronischen Zutrittskontrollsystemen?",
                  answer: "Ausfallsicherheit ist eine unserer Kernkompetenzen. Wir setzen auf redundante Systeme und hybride Ansätze. Nahezu alle unsere elektronischen Zylinder verfügen über eine Batteriewarnfunktion weit vor dem kritischen Spannungsabfall. Für Hochsicherheitsbereiche implementieren wir oft mechanische Rückfallebenen (Not- und Gefahrenfunktion) oder nutzen Systeme, die die Zutrittsrechte verschlüsselt auf dem Identmedium (z. B. der RFID-Karte) speichern, sodass der Zylinder selbst keine ständige Serveranbindung benötigt."
                },
                {
                  question: "Ist eine schrittweise Migration von mechanischen zu elektronischen Schließsystemen möglich?",
                  answer: "Absolut. Eine 'sanfte Migration' ist eine gängige und kosteneffiziente Strategie, besonders bei großen Gebäude- oder Firmenkomplexen. Wir beginnen typischerweise mit der Ausstattung der Gebäudeaußenhülle und kritischer Server- oder Archivräume mit elektronischen Komponenten. Die weniger sensiblen Innenbereiche bleiben vorerst mechanisch. Moderne Kombischlüssel (mit integriertem RFID-Transponder) erlauben es den Nutzern, sowohl elektronische als auch mechanische Türen mit einem einzigen Medium zu bedienen."
                }
              ]}
            />
          </div>
        </div>
      </Section>

    </>
  );
}
