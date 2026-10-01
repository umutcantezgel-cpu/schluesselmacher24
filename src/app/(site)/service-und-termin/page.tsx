import { ServiceBudgetCalculator } from "@/components/calculator/service-budget-calculator";
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

          <h3 className="text-lg font-semibold text-foreground mt-8">5. Detaillierte Vergleichsmatrix: Mechanische vs. Elektronische Schließsysteme</h3>
          <p>
            Um Ihnen die Entscheidung für die richtige Technologie zu erleichtern, haben wir die wesentlichen Merkmale mechanischer und elektronischer Systeme in einer detaillierten Vergleichsmatrix gegenübergestellt. Beide Ansätze haben spezifische Vor- und Nachteile, die je nach Anwendungsfall und Sicherheitsanforderung abgewogen werden müssen.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="border-b border-border px-4 py-3 font-semibold text-foreground">Kriterium</th>
                  <th className="border-b border-border border-l px-4 py-3 font-semibold text-foreground">Mechanische Systeme</th>
                  <th className="border-b border-border border-l px-4 py-3 font-semibold text-foreground">Elektronische Systeme</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Sicherheit bei Schlüsselverlust</td>
                  <td className="border-l border-border px-4 py-3 text-foreground-muted">Zylindertausch oft zwingend erforderlich, hohe Folgekosten.</td>
                  <td className="border-l border-border px-4 py-3 text-foreground-muted">Einfache Deaktivierung des Transponders im System, minimale Kosten.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Zugangskontrolle & Protokollierung</td>
                  <td className="border-l border-border px-4 py-3 text-foreground-muted">Keine Historie oder temporäre Einschränkungen möglich.</td>
                  <td className="border-l border-border px-4 py-3 text-foreground-muted">Detaillierte Protokollierung und zeitgesteuerte Zugangsberechtigungen.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Infrastruktur & Installation</td>
                  <td className="border-l border-border px-4 py-3 text-foreground-muted">Autark, keine Stromversorgung oder Netzwerk erforderlich.</td>
                  <td className="border-l border-border px-4 py-3 text-foreground-muted">Benötigt Batterien oder Verkabelung sowie ggf. Netzwerk-Infrastruktur.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Skalierbarkeit</td>
                  <td className="border-l border-border px-4 py-3 text-foreground-muted">Begrenzt durch mechanische Schließplanhierarchien.</td>
                  <td className="border-l border-border px-4 py-3 text-foreground-muted">Nahezu unbegrenzt erweiterbar und flexibel anpassbar.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Wartungsaufwand</td>
                  <td className="border-l border-border px-4 py-3 text-foreground-muted">Geringer Aufwand (gelegentliches Schmieren).</td>
                  <td className="border-l border-border px-4 py-3 text-foreground-muted">Regelmäßige Batteriewechsel und Software-Updates erforderlich.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-8">6. Kosten-Nutzen-Analyse und Return on Investment (ROI)</h3>
          <p>
            Die initialen Investitionskosten für elektronische Zutrittssysteme liegen naturgemäß über denen rein mechanischer Lösungen. Jedoch verschiebt sich die Wirtschaftlichkeitsbetrachtung erheblich, wenn man die Total Cost of Ownership (TCO) über einen Zeitraum von 5 bis 10 Jahren analysiert. Insbesondere in Objekten mit hoher Fluktuation (wie Bürogebäuden, Krankenhäusern oder Bildungseinrichtungen) amortisiert sich ein elektronisches System oft bereits nach dem ersten Verlust eines Generalschlüssels, da der kostspielige Komplettaustausch der mechanischen Zylinder entfällt.
          </p>
          <p>
            Zusätzliche Einsparpotenziale ergeben sich durch optimierte Verwaltungsprozesse. Die zentrale Verwaltung von Berechtigungen über eine Software-Oberfläche spart signifikant Arbeitszeit im Facility Management. Zudem können durch die Integration in die Gebäudeleittechnik (z.B. automatische Licht- oder Heizungssteuerung bei Zutritt) die Energiekosten gesenkt werden. Unsere Berater erstellen für Ihr Projekt gerne eine individuelle ROI-Kalkulation, die diese Faktoren transparent aufschlüsselt und Ihnen eine fundierte Entscheidungsgrundlage bietet.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">7. Compliance, Datenschutz und Normen</h3>
          <p>
            Besonders im gewerblichen und öffentlichen Bereich müssen bei der Implementierung von Zutrittslösungen komplexe rechtliche und normative Anforderungen erfüllt werden. Die Protokollierung von Zutrittsdaten berührt unweigerlich datenschutzrechtliche Belange (DSGVO). Wir unterstützen Sie bei der datenschutzkonformen Konfiguration der Systeme (z.B. durch Pseudonymisierung von Daten oder die Definition strenger Löschfristen).
          </p>
          <p>
            Darüber hinaus gewährleisten wir, dass alle installierten Komponenten den geltenden DIN- und EN-Normen entsprechen. Dies betrifft insbesondere Flucht- und Rettungswege (DIN EN 179 für Notausgänge, DIN EN 1125 für Paniktüren) sowie Vorgaben des Brandschutzes. Eine unsachgemäße Installation kann im Schadensfall nicht nur zum Verlust des Versicherungsschutzes führen, sondern auch strafrechtliche Konsequenzen nach sich ziehen. Mit unserer zertifizierten Fachexpertise sind Sie rechtlich stets auf der sicheren Seite.
          </p>

      </Section>

      <Section tone="muted" id="orientierung">
        <SectionHeading
          eyebrow="Orientierung"
          title="Womit Sie bei einem Serviceeinsatz rechnen können"
          lead="Für häufige Leistungen vor Ort erhalten Sie hier eine erste Orientierung. Den verbindlichen Preis nennen wir nach der Prüfung Ihrer Anfrage."
        />
        <div className="mt-8 max-w-3xl">
          <ServiceBudgetCalculator />
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
