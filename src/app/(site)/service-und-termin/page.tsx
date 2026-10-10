import { ServiceBudgetCalculator } from '@/components/service-budget-calculator/service-budget-calculator';
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

export default async function ServiceUndTerminPage(props: { params: Promise<{ [key: string]: string | string[] | undefined }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchParams = await props.searchParams;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const params = await props.params;
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
            Die Konzeption und Implementierung moderner Schließ- und Sicherheitstechnik erfordert ein tiefgreifendes Verständnis für mechanische Präzision, elektronische Integration und architektonische Rahmenbedingungen. Unser Service-Ansatz basiert auf einer strikten, methodischen Vorgehensweise, die sicherstellt, dass jede von uns geplante und umgesetzte Lösung exakt auf die spezifischen Anforderungen des jeweiligen Objekts abgestimmt ist. Wir lehnen standardisierte &quot;Out-of-the-box&quot;-Lösungen ab, wo maßgeschneiderte Sicherheit gefordert ist. Jeder Auftrag beginnt mit einer detaillierten Analyse der bestehenden Infrastruktur, der Identifikation potenzieller Schwachstellen und der Definition eines klaren, bedarfsorientierten Schutzziels. Die Präzision, die wir in der Planungsphase anwenden, zahlt sich in der langfristigen Zuverlässigkeit und Sicherheit unserer Systeme aus. Unsere Experten verfügen über jahrzehntelange Erfahrung in der Sicherung kritischer Infrastrukturen, gewerblicher Objekte und anspruchsvoller privater Residenzen.
          </p>
          <p>
            Ein zentraler Aspekt unserer Philosophie ist die ganzheitliche Betrachtung von Sicherheit. Es geht nicht nur darum, den Zutritt zu verwehren, sondern vielmehr darum, berechtigten Personen einen reibungslosen, sicheren und komfortablen Zugang zu ermöglichen. Dies erfordert eine intelligente Kombination aus mechanischen Grundsicherungen und hochmodernen elektronischen Zutrittskontrollsystemen. Durch die Verschmelzung dieser beiden Welten schaffen wir Synergien, die das Sicherheitsniveau signifikant erhöhen, ohne den Nutzungskomfort einzuschränken. Die Architektur eines Sicherheitssystems muss sich nahtlos in die Abläufe des Gebäudes integrieren und flexibel auf zukünftige Veränderungen reagieren können.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">1. Die Phasen unserer Service-Implementierung im Detail</h3>
          <p>
            Unser Prozess ist in streng definierte Phasen unterteilt, die von der initialen Bestandsaufnahme bis zur finalen Abnahme und Dokumentation reichen. Jede Phase ist durch klare Meilensteine und Qualitätskontrollen definiert, um sicherzustellen, dass das Endresultat exakt den vereinbarten Spezifikationen entspricht.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Initiierung und holistische Bedarfsanalyse:</strong> Im ersten Schritt erfassen wir nicht nur die offensichtlichen Anforderungen, sondern analysieren auch die verborgenen Risikofaktoren. Dies beinhaltet die detaillierte Bewertung von Türbeschaffenheiten, Zylindermaßen, elektronischen Schnittstellen und den allgemeinen architektonischen Gegebenheiten vor Ort. Wir berücksichtigen auch organisatorische Aspekte wie Mitarbeiterfluktuation, Besucherströme und spezifische Sicherheitsrichtlinien Ihres Unternehmens.</li>
            <li><strong>Projektierung und intelligentes Lösungsdesign:</strong> Basierend auf der Analyse entwickeln wir ein fundiertes Konzept. Bei Schließanlagen bedeutet dies die Erstellung präziser Schließpläne unter Berücksichtigung komplexer Hierarchien, temporärer Zutrittsberechtigungen und Sonderfunktionen wie Panik- und Fluchtwegsteuerungen. Bei elektronischen Systemen planen wir die Vernetzung, redundante Stromversorgung, Integration in bestehende IT-Infrastrukturen oder Smart-Home-Umgebungen und definieren klare Schnittstellen zu anderen Gewerken (z.B. Brandmeldeanlagen, Einbruchmeldeanlagen).</li>
            <li><strong>Präzise Fertigung, Vorkonfiguration und Stresstests:</strong> Bevor wir vor Ort tätig werden, bereiten wir alle Komponenten in unserer Fachwerkstatt vor. Zylinder werden nach Maß gefertigt, Transponder verschlüsselt codiert und elektronische Komponenten in simulierten Umgebungen intensiv getestet, um die Ausfallzeiten und Installationsdauer vor Ort auf ein absolutes Minimum zu reduzieren. Jeder Baustein durchläuft eine strenge Qualitätskontrolle, bevor er für die Montage freigegeben wird.</li>
            <li><strong>Fachgerechte Montage und nahtlose Integration:</strong> Unsere hochqualifizierten Techniker installieren die Systeme mit höchster handwerklicher Präzision und technischem Know-how. Dies umfasst die fachgerechte Montage massiver mechanischer Sicherungen ebenso wie die sensible Verkabelung und Programmierung komplexer elektronischer Anlagen. Wir arbeiten stets unter strenger Einhaltung geltender Normen und Sicherheitsrichtlinien (z.B. DIN 18252 für Profilzylinder, DIN EN 1303, VdS-Richtlinien) und dokumentieren jeden Arbeitsschritt.</li>
            <li><strong>Dokumentation, Systemübergabe und Schulung:</strong> Jedes Projekt schließt mit einer umfassenden Dokumentation ab. Sie erhalten nicht nur Sicherungskarten und detaillierte Schließpläne, sondern auch umfangreiche Bedienungsanleitungen, Revisionsunterlagen und Abnahmeprotokolle, die eine lückenlose Nachvollziehbarkeit und zukünftige Erweiterbarkeit garantieren. Darüber hinaus schulen wir Ihr Personal in der sicheren und effizienten Bedienung der neuen Systeme.</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-8">2. Technologische Standards, Materialqualität und Kryptografie</h3>
          <p>
            Welche Produkte wir einsetzen, richtet sich nach Türbeschaffenheit, definiertem Schutzziel, regulatorischen Vorgaben und Ihrem Budget. Entscheidend sind mechanische Stabilität, massiver Schutz gegen physische Manipulation (wie Aufbohren, Ziehen, Picking oder Schlagschlüssel-Methoden) und eine lange, wartungsarme Nutzungsdauer — die konkrete Auswahl stimmen wir transparent und detailliert mit Ihnen im Angebot ab.
          </p>
          <p>
            Bei mechanischen Zylindern achten wir kompromisslos auf Merkmale wie integrierten Bohr- und Ziehschutz aus gehärtetem Spezialstahl, patentierte Schlüsselprofile (um illegale Kopien rechtlich und technisch zu verhindern) und modulare Bauweisen, die nachträgliche Längenanpassungen bei Türwechseln ermöglichen. Im Bereich der elektronischen Zutrittskontrolle empfehlen wir ausschließlich Systeme mit hochsicherer, verschlüsselter Kommunikation (z.B. MIFARE DESFire EV2/EV3, Bluetooth Low Energy mit AES-128-Verschlüsselung, OSDP) und ausfallsichere Architekturen, die auch bei Stromausfall oder Netzwerkunterbrechungen eine definierte Grundsicherheit (Fail-Secure) oder einen sicheren Fluchtweg (Fail-Safe) gewährleisten. Die nahtlose Verzahnung von Mechanik und Elektronik (Mechatronik) bildet oft den Kern unserer fortschrittlichsten und flexibelsten Lösungen.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">3. Nachhaltigkeit, Lebenszyklus-Management und Investitionsschutz</h3>
          <p>
            Eine professionelle Sicherheitslösung ist eine strategische, langfristige Investition in den Schutz von Menschen und Werten. Daher legen wir extrem großen Wert auf das proaktive Lebenszyklus-Management der von uns geplanten und betreuten Systeme. Dies beginnt bereits in der Konzeptionsphase durch die bewusste Wahl skalierbarer, modularer Architekturen und offener Standards. Wenn sich Ihre Anforderungen ändern – sei es durch räumliche Erweiterungen, organisatorische Umstrukturierungen, neue regulatorische Anforderungen oder schlichtweg veränderte Bedrohungslagen – lassen sich unsere Systeme effizient, ressourcenschonend und ohne komplette Systemwechsel anpassen und erweitern.
          </p>
          <p>
            Darüber hinaus bieten wir strukturierte, präventive Wartungskonzepte an, die weit über gesetzliche Mindestanforderungen hinausgehen. Regelmäßige fachmännische Inspektionen, zeitnahe Firmware- und Software-Updates für alle elektronischen und mechatronischen Komponenten sowie die präventive Wartung hochbeanspruchter mechanischer Teile (z.B. Schmierung, Justierung) stellen sicher, dass das Sicherheitsniveau über Jahre hinweg konstant hoch bleibt, Ausfallzeiten minimiert und kostspielige Totalausfälle zuverlässig vermieden werden.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">4. Spezialanforderungen für Gewerbeobjekte und öffentliche Einrichtungen</h3>
          <p>
            Neben Privatkunden betreuen wir ein breites Spektrum an Gewerbeobjekten, Industrieanlagen, komplexen Hausverwaltungen und hochfrequentierten öffentlichen Einrichtungen. Dort gelten oft weitreichende zusätzliche Vorgaben, komplexe organisatorische Abläufe und strenge gesetzliche Rahmenbedingungen, die wir vor der detaillierten Planung gemeinsam mit Ihnen, Ihren Sicherheitsbeauftragten und relevanten Behörden klären und dokumentieren.
          </p>
          <p>
            Wir verfügen über tiefgreifende Expertise in den Herausforderungen von Fluchtwegsteuerung (gemäß DIN EN 179 für Notausgänge und DIN EN 1125 für Paniktüren), Brandschutzvorgaben (Feuer- und Rauchschutztüren) und der nahtlosen, zertifizierten Integration von Zutrittskontrollsystemen in übergeordnete Gebäudeleittechnik (GLT), Gefahrenmanagementsysteme oder Zeiterfassungslösungen. Für den gewerblichen Bereich planen wir alle Lösungen konsequent so, dass sie mit weiteren Türen, wachsenden Nutzerzahlen, neuen Standorten und zukünftigen technologischen Entwicklungen sicher und wirtschaftlich mitwachsen können. Skalierbarkeit und Mandantenfähigkeit sind hier oft der Schlüssel zum langfristigen Erfolg.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">5. Kalkulieren Sie Ihr Service-Budget</h3>
          <p>
            Nutzen Sie unseren interaktiven Projekt-Budget Kalkulator, um eine erste Einschätzung der anfallenden Kosten für Ihr Sicherheitsprojekt zu erhalten. Dies dient als Basis für unsere detaillierte Beratung.
          </p>
          <div className="my-8">
            <ServiceBudgetCalculator />
          </div>

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
    </>
  );
}
