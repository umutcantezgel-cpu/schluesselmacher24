import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarSearch, MapPin, MessageSquare, Phone } from 'lucide-react';

import { getPageContent, getSettings } from '@/lib/data';
import { getRichtwerte } from '@/lib/data/richtwerte';
import { NAV_AREAS, PROCESS_LABELS } from '@/lib/navigation';
import { formatWeekday } from '@/lib/format';
import { Card, CardBody } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';
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


        <div className="mt-8 prose-sm24 max-w-none space-y-6 text-[oklch(0.32_0.02_260)]">
          <p>
            Die Konzeption und Implementierung moderner Schließ- und Sicherheitstechnik erfordert ein tiefgreifendes Verständnis für mechanische Präzision, elektronische Integration und architektonische Rahmenbedingungen. Unser Service-Ansatz basiert auf einer strikten, methodischen Vorgehensweise, die sicherstellt, dass jede von uns geplante und umgesetzte Lösung exakt auf die spezifischen Anforderungen des jeweiligen Objekts abgestimmt ist. Wir lehnen standardisierte &quot;Out-of-the-box&quot;-Lösungen ab, wo maßgeschneiderte Sicherheit gefordert ist. Jeder Auftrag beginnt mit einer detaillierten Analyse der bestehenden Infrastruktur, der Identifikation potenzieller Schwachstellen und der Definition eines klaren, bedarfsorientierten Schutzziels.
            Ein fundiertes Verständnis der physikalischen Widerstandsklassen (RC-Klassen gemäß DIN EN 1627) sowie der elektronischen Manipulationssicherheit (z.B. Verschlüsselungsstandards wie AES-128 für Bluetooth Low Energy und MIFARE DESFire EV2/EV3 für RFID-Technologien) ist unerlässlich. Dies garantiert, dass die von uns implementierten Systeme nicht nur den aktuellen Bedrohungsszenarien standhalten, sondern auch zukunftssicher konzipiert sind. Wir betrachten Gebäude als komplexe Organismen, deren Zugänge und Sicherheitszonen harmonisch und reibungslos interagieren müssen.
            Dabei spielt auch die Usability eine entscheidende Rolle. Ein Sicherheitssystem darf den operativen Betriebsablauf nicht behindern. Durch den gezielten Einsatz von Mechatronik und intelligenten Zutrittskontrollsystemen schaffen wir Lösungen, die maximale Sicherheit mit hohem Bedienkomfort verbinden. So können Zutrittsrechte dynamisch verwaltet, temporäre Berechtigungen erteilt und verlorene Medien ohne kostspieligen Austausch der mechanischen Schließzylinder sofort gesperrt werden. Unser ganzheitlicher Ansatz stellt sicher, dass Technologie, Architektur und menschliche Interaktion perfekt aufeinander abgestimmt sind.
          </p>

          <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8 tracking-tight">1. Die Phasen unserer Service-Implementierung</h3>
          <p>
            Unser Prozess ist in streng definierte Phasen unterteilt, die von der initialen Bestandsaufnahme bis zur finalen Abnahme und Dokumentation reichen. Jeder Schritt wird mit höchster Sorgfalt und unter Einhaltung unserer strengen Qualitätsstandards ausgeführt.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Initiierung und Bedarfsanalyse:</strong> Im ersten Schritt erfassen wir nicht nur die offensichtlichen Anforderungen, sondern analysieren auch die verborgenen Risikofaktoren. Dies beinhaltet die Bewertung von Türbeschaffenheiten, Zylindermaßen, elektronischen Schnittstellen und den allgemeinen architektonischen Gegebenheiten vor Ort. Eine detaillierte Schwachstellenanalyse deckt potenzielle Einbruchsvektoren auf, sei es durch physische Gewalteinwirkung (Aufbohren, Kernziehen) oder manipulative Techniken (Lockpicking, Schlagschlüssel). Wir prüfen die Beschaffenheit von Zargen, Türblättern und bestehenden Schließblechen, um eine solide Basis für die neue Sicherheitsarchitektur zu gewährleisten.</li>
            <li><strong>Projektierung und Lösungsdesign:</strong> Basierend auf der Analyse entwickeln wir ein fundiertes Konzept. Bei Schließanlagen bedeutet dies die Erstellung präziser Schließpläne unter Berücksichtigung komplexer Hierarchien, temporärer Zutrittsberechtigungen und organisatorischer Abläufe. Bei elektronischen Systemen planen wir die Vernetzung, Notstromversorgung und Integration in bestehende IT- oder Smart-Home-Umgebungen. Das Lösungsdesign umfasst auch die Auswahl der geeigneten Technologien, von hochkomplexen mechatronischen Zylindern bis hin zu cloudbasierten Zutrittskontrollsystemen, die eine zentrale Verwaltung über mehrere Standorte hinweg ermöglichen. Wir berücksichtigen dabei stets Skalierbarkeit und Zukunftssicherheit, um Ihre Investition langfristig zu schützen.</li>
            <li><strong>Präzise Fertigung und Vorkonfiguration:</strong> Bevor wir vor Ort tätig werden, bereiten wir alle Komponenten in unserer modernen Fachwerkstatt vor. Zylinder werden nach exaktem Maß gefertigt, Transponder und Smartcards werden mit den entsprechenden kryptografischen Schlüsseln codiert und elektronische Komponenten werden vorab auf Herz und Nieren getestet. Diese rigorose Vorbereitungsphase ermöglicht es uns, die Ausfallzeiten vor Ort auf ein absolutes Minimum zu reduzieren und eine reibungslose &quot;Plug-and-Play&quot;-Installation zu gewährleisten. So minimieren wir Störungen in Ihrem Betriebsablauf und stellen sicher, dass die Systeme ab der ersten Minute fehlerfrei funktionieren.</li>
            <li><strong>Fachgerechte Montage und Integration:</strong> Unsere zertifizierten Techniker installieren die Systeme mit höchster handwerklicher Präzision. Dies umfasst die fachgerechte Montage mechanischer Sicherungen ebenso wie die Verkabelung, Einmessung und Inbetriebnahme komplexer elektronischer Anlagen, stets unter strikter Einhaltung geltender Normen und Sicherheitsrichtlinien (z.B. DIN 18252 für Profilzylinder, DIN EN 1303 für Schließzylinder, VdS-Richtlinien). Die Integration in bestehende Netzwerke erfolgt unter Berücksichtigung aktueller Cybersecurity-Standards, um das System gegen digitale Angriffe abzusichern. Jede Komponente wird kalibriert und einem umfassenden Funktionstest unterzogen.</li>
            <li><strong>Dokumentation, Systemübergabe und Schulung:</strong> Jedes Projekt schließt mit einer umfassenden Dokumentation und einer detaillierten Systemübergabe ab. Sie erhalten nicht nur physische Sicherungskarten und detaillierte Schließpläne, sondern auch digitale Zugangsprofile, umfassende Bedienungsanleitungen und Abnahmeprotokolle. Diese lückenlose Dokumentation garantiert die Nachvollziehbarkeit aller Installationen und erleichtert zukünftige Erweiterungen oder Wartungsarbeiten. Darüber hinaus führen wir intensive Schulungen für Ihre Administratoren und Mitarbeiter durch, um einen sicheren und effizienten Umgang mit den neuen Systemen zu gewährleisten. Wir lassen Sie mit der neuen Technologie nicht allein, sondern befähigen Sie, ihr volles Potenzial auszuschöpfen.</li>
          </ul>

          <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8 tracking-tight">2. Technologische Standards und kompromisslose Materialqualität</h3>
          <p>
            Welche Produkte wir einsetzen, richtet sich nach Tür, Schutzziel und Budget. Entscheidend sind mechanische Stabilität, Schutz gegen Manipulation und eine lange Nutzungsdauer — die konkrete Auswahl stimmen wir transparent und nachvollziehbar mit Ihnen im Angebot ab. Wir arbeiten ausschließlich mit renommierten Herstellern zusammen, deren Produkte unseren strengen internen Qualitätskriterien entsprechen.
          </p>
          <p>
            Bei mechanischen Zylindern achten wir auf essenzielle Sicherheitsmerkmale wie gehärtete Stahlstifte für den Bohr- und Ziehschutz, komplexe patentierte Schlüsselprofile mit multidimensionalen Abfrageebenen (um illegale Kopien im 3D-Druck oder durch Fräsen effektiv zu verhindern) und modulare Bauweisen, die nachträgliche Längenanpassungen bei Türwechseln ermöglichen. Im Bereich der Elektronik empfehlen wir zukunftsweisende Systeme mit hochsicherer, verschlüsselter Kommunikation (z.B. MIFARE DESFire EV2/EV3, Bluetooth Low Energy mit AES-128-Verschlüsselung) und redundante, ausfallsichere Systemarchitekturen, die auch bei Stromausfall oder Netzwerkunterbrechungen eine definierte Grundsicherheit (Fail-Secure oder Fail-Safe) gewährleisten. Die nahtlose Verzahnung von Mechanik und Elektronik (Mechatronik) bildet oft den Kern unserer fortschrittlichsten Lösungen, da sie die physische Robustheit der Mechanik mit der Flexibilität und Protokollierbarkeit der Elektronik vereint. So entsteht ein Hybridsystem, das das Beste aus beiden Welten bietet.
          </p>

          <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8 tracking-tight">3. Nachhaltigkeit und vorausschauendes Lebenszyklus-Management</h3>
          <p>
            Eine professionelle Sicherheitslösung ist eine langfristige Investition in den Schutz von Werten und Menschen. Daher legen wir extrem großen Wert auf das Lebenszyklus-Management der von uns betreuten Systeme. Dies beginnt bereits in der Konzeptionsphase durch die bewusste Wahl von hoch skalierbaren, modularen Architekturen und offenen Schnittstellen (wie z.B. OSS Standard Offline). Wenn sich Ihre Anforderungen im Laufe der Jahre ändern – sei es durch räumliche Erweiterungen, Umzüge, organisatorische Umstrukturierungen oder veränderte Bedrohungslagen – lassen sich unsere Systeme effizient, kostengünstig und ohne Systembruch anpassen.
          </p>
          <p>
            Darüber hinaus bieten wir präventive und strukturierte Wartungskonzepte an, die weit über den klassischen Reparaturservice hinausgehen. Regelmäßige Inspektionen, zeitkritische Firmware-Updates für elektronische Komponenten zur Schließung von Sicherheitslücken und die präventive Wartung hochbeanspruchter mechanischer Teile (z.B. Reinigung und Schmierung von Zylindern mit Spezialpflege) stellen sicher, dass das Sicherheitsniveau über Jahre hinweg konstant hoch bleibt. Dieser proaktive Ansatz minimiert Ausfallzeiten, verlängert die Lebensdauer der Investition signifikant und vermeidet kostspielige Totalausfälle im laufenden Betrieb. Wir verstehen uns als langfristiger Partner für Ihre Sicherheit.
          </p>

          <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8 tracking-tight">4. Gewerbeobjekte, öffentliche Einrichtungen und Kritische Infrastruktur (KRITIS)</h3>
          <p>
            Neben Privatkunden betreuen wir komplexe Gewerbeobjekte, filialbasierte Handelsunternehmen, Hausverwaltungen und öffentliche Einrichtungen sowie Betreiber kritischer Infrastrukturen (KRITIS). In diesen Umgebungen gelten oft extrem strenge, gesetzliche Vorgaben und komplexe, abgestimmte organisatorische Abläufe, die wir vor der Planung akribisch gemeinsam mit Ihnen und den zuständigen Behörden klären.
          </p>
          <p>
            Wir verfügen über tiefgreifende Expertise in den Herausforderungen von Fluchtwegsteuerung (gemäß DIN EN 179 für Notausgänge und DIN EN 1125 für Paniktüren), strengen Brandschutzvorgaben (Zulassungen für Feuer- und Rauchschutztüren) und der nahtlosen Integration von Zutrittskontrollsystemen in übergeordnete Gebäudeleittechnik (GLT), Gefahrenmanagementsysteme (GMS) oder Zeiterfassungssysteme. Für den gewerblichen Bereich planen wir Lösungen so, dass sie problemlos mit weiteren Türen, Tausenden von Nutzern und mehreren, global verteilten Standorten mitwachsen können, ohne an Performance oder Sicherheit einzubüßen. Wir bieten Mandantenfähigkeit, detailliertes Reporting und Audit-Trails, um Compliance-Anforderungen (z.B. DSGVO, ISO 27001) vollumfänglich zu erfüllen. Unser Ansatz für Gewerbeobjekte ist ganzheitlich, skalierbar und hochverfügbar.
          </p>
        </div>

      </Section>

      <Section tone="muted" id="budget-kalkulator">
        <SectionHeading
          eyebrow="Projekt-Planung"
          title="Interaktiver Budget-Kalkulator"
          lead="Berechnen Sie den groben Kostenrahmen für Ihr Sicherheitsprojekt basierend auf dem geschätzten Projektumfang in Tagen."
        />
        <div className="mt-8 max-w-3xl mx-auto">
          <ServiceBudgetCalculator />
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
