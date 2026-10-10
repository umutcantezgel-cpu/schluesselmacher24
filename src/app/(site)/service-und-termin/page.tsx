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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resolvedParams = await params;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resolvedSearch = await searchParams;
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
            Die Konzeption, Planung und Implementierung moderner Schließ- und Sicherheitstechnik erfordert heute weit mehr als nur handwerkliches Geschick. Es verlangt ein tiefgreifendes, interdisziplinäres Verständnis für mechanische Präzision, elektronische Integration, softwarebasierte Verwaltung und komplexe architektonische Rahmenbedingungen. Unser Service-Ansatz bei Schlüsselmacher24 basiert auf einer strikten, methodischen Vorgehensweise, die sicherstellt, dass jede von uns geplante und umgesetzte Lösung exakt auf die spezifischen Anforderungen des jeweiligen Objekts und Nutzers abgestimmt ist. Wir lehnen standardisierte &quot;Out-of-the-box&quot;-Lösungen kategorisch ab, wo maßgeschneiderte Sicherheit gefordert ist. Jeder Auftrag, sei es für ein privates Eigenheim, einen gewerblichen Bürokomplex oder eine öffentliche Einrichtung, beginnt mit einer detaillierten, risikobasierten Analyse der bestehenden Infrastruktur. Wir identifizieren potenzielle Schwachstellen, bewerten Angriffsvektoren und definieren in enger Abstimmung mit unseren Kunden ein klares, bedarfsorientiertes Schutzziel. Dieser ganzheitliche Ansatz garantiert höchste Ansprüche an Präzision, Zuverlässigkeit, Langlebigkeit und Benutzerfreundlichkeit in jedem Projekt.
          </p>

          <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-10">1. Die fünf Phasen unserer Service-Implementierung</h3>
          <p>
            Um eine gleichbleibend hohe Qualität und absolute Planungssicherheit für unsere Kunden zu gewährleisten, ist unser Implementierungsprozess in fünf streng definierte Phasen unterteilt. Diese reichen von der ersten unverbindlichen Bestandsaufnahme bis zur finalen Abnahme und der fortlaufenden Systembetreuung.
          </p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-[oklch(0.32_0.02_260)]">
            <li><strong className="text-[oklch(0.16_0.02_260)]">Initiierung und Bedarfsanalyse (Phase I):</strong> Im ersten Schritt erfassen wir nicht nur die offensichtlichen Anforderungen, sondern analysieren tiefgreifend auch die verborgenen Risikofaktoren. Dies beinhaltet die physische Bewertung von Türbeschaffenheiten, Zylindermaßen, Einbausituationen und Fluchtwegen. Gleichzeitig evaluieren wir elektronische Schnittstellen, Netzwerkverfügbarkeiten und die allgemeinen architektonischen Gegebenheiten vor Ort. Das Ergebnis ist ein umfassendes Risikoprofil, das als Fundament für alle weiteren Planungen dient.</li>
            <li><strong className="text-[oklch(0.16_0.02_260)]">Projektierung und Lösungsdesign (Phase II):</strong> Basierend auf der Risikoanalyse entwickeln wir ein fundiertes, maßgeschneidertes Sicherheitskonzept. Bei komplexen mechanischen Schließanlagen bedeutet dies die Erstellung präziser, logisch fehlerfreier Schließpläne unter Berücksichtigung vielschichtiger Hierarchien und zukünftiger Erweiterbarkeiten. Bei elektronischen und mechatronischen Systemen planen wir die Vernetzung, die redundante Stromversorgung und die sichere Integration in bestehende IT-Infrastrukturen oder Smart-Home-Umgebungen. Jeder Plan durchläuft interne Qualitätsprüfungen (Peer-Reviews) durch unsere Lead-Techniker.</li>
            <li><strong className="text-[oklch(0.16_0.02_260)]">Präzise Fertigung und Vorkonfiguration (Phase III):</strong> Bevor wir vor Ort bei Ihnen tätig werden, bereiten wir alle Systemkomponenten in unserer hochmodernen Fachwerkstatt vor. Zylinder werden exakt nach Maß gefertigt und verstiftet, Schlüsselrohlinge millimetergenau gefräst. Elektronische Komponenten wie Wandleser, Digitalzylinder und Smart Handles werden vorab programmiert, Transponder codiert und die Netzwerkkonnektivität in einer Staging-Umgebung getestet. Dieser &quot;Plug-and-Play&quot;-Ansatz reduziert die Ausfallzeiten und Störungen vor Ort auf ein absolutes Minimum.</li>
            <li><strong className="text-[oklch(0.16_0.02_260)]">Fachgerechte Montage und Integration (Phase IV):</strong> Unsere zertifizierten Techniker installieren die konfektionierten Systeme mit höchster handwerklicher Präzision in Ihrem Objekt. Dies umfasst die fachgerechte, zerstörungsfreie Montage mechanischer Hochsicherheitskomponenten ebenso wie die saubere Verkabelung und fehlerfreie Inbetriebnahme komplexer elektronischer Anlagen. Wir arbeiten dabei ausnahmslos unter strikter Einhaltung aller geltenden Normen, Brandschutzvorschriften und Sicherheitsrichtlinien (z.B. DIN 18252 für Profilzylinder, DIN EN 1303, VdS-Richtlinien).</li>
            <li><strong className="text-[oklch(0.16_0.02_260)]">Dokumentation und Systemübergabe (Phase V):</strong> Jedes Projekt, unabhängig von seiner Größe, schließt mit einer umfassenden, revisionssicheren Dokumentation ab. Sie erhalten bei der formellen Übergabe alle relevanten Sicherungskarten, detaillierte und aktualisierte Schließpläne, verständliche Bedienungsanleitungen sowie Abnahmeprotokolle. Diese lückenlose Nachvollziehbarkeit garantiert nicht nur die Einhaltung rechtlicher Vorgaben, sondern ermöglicht auch eine unkomplizierte, fehlerfreie zukünftige Erweiterung Ihres Systems.</li>
          </ul>

          <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-10">2. Kompromisslose Technologische Standards und Materialqualität</h3>
          <p>
            Welche Produkte und Technologien wir einsetzen, richtet sich exakt nach der spezifischen Türsituation, dem definierten Schutzziel und dem vorgegebenen Budgetrahmen. Entscheidend für unsere Auswahl sind jedoch immer höchste mechanische Stabilität, massiver Schutz gegen physische und digitale Manipulation sowie eine garantierte, überdurchschnittliche Nutzungsdauer unter realen Bedingungen. Die konkrete Material- und Produktauswahl stimmen wir transparent und detailliert mit Ihnen im Angebot ab.
          </p>
          <p className="mt-4">
            Bei <strong>mechanischen Zylindersystemen</strong> achten wir zwingend auf essenzielle Sicherheitsmerkmale wie integrierten Bohr- und Ziehschutz (VdS-anerkannt), komplexe, patentierte Schlüsselprofile (um illegale 3D-Kopien technisch unmöglich zu machen) und modulare Bauweisen. Die Modularität erlaubt es uns, die Zylinderlänge bei einem Umzug oder Türwechsel flexibel anzupassen, was Ihre Investition nachhaltig schützt. Wir setzen auf Legierungen und Materialien, die extremen Belastungen und Witterungseinflüssen standhalten.
          </p>
          <p className="mt-4">
            Im Bereich der <strong>elektronischen und mechatronischen Zutrittskontrolle</strong> empfehlen und implementieren wir ausschließlich Systeme mit Ende-zu-Ende-verschlüsselter Kommunikation. Wir nutzen modernste Kryptografie-Standards (z.B. MIFARE DESFire EV2/EV3, Bluetooth Low Energy mit AES-128 Bit Verschlüsselung, OSDP V2 für Leser-Kommunikation) und ausfallsichere, redundante Systemarchitekturen. Diese garantieren, dass auch bei einem totalen Stromausfall oder Netzwerkverlust eine definierte, physikalische Grundsicherheit und die Bedienbarkeit durch autorisiertes Personal erhalten bleiben. Die nahtlose Verzahnung von robuster Mechanik und intelligenter Elektronik bildet oft den Kern unserer fortschrittlichsten und sichersten Lösungen.
          </p>

           <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-10">3. Matrix: Mechanik vs. Elektronik – Ein objektiver Vergleich</h3>
           <p className="mb-4">Um Ihnen die Entscheidung für die optimale Technologie zu erleichtern, haben wir die wichtigsten Parameter objektiv gegenübergestellt:</p>
           <div className="overflow-x-auto rounded-xl border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
            <table className="min-w-full divide-y divide-[oklch(0.89_0.008_260/0.55)] text-sm">
              <thead className="bg-[oklch(0.968_0.004_260)]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left font-semibold text-[oklch(0.16_0.02_260)]">Kriterium</th>
                  <th scope="col" className="px-6 py-3 text-left font-semibold text-[oklch(0.16_0.02_260)]">Mechanische Anlagen</th>
                  <th scope="col" className="px-6 py-3 text-left font-semibold text-[oklch(0.16_0.02_260)]">Elektronische / Mechatronische Anlagen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)] bg-white">
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-[oklch(0.32_0.02_260)]">Schlüsselverlust</td>
                  <td className="px-6 py-4 text-[oklch(0.32_0.02_260)]">Kritisch. Oft teurer Zylindertausch zwingend erforderlich, um Sicherheit wiederherzustellen.</td>
                  <td className="px-6 py-4 text-[oklch(0.32_0.02_260)]">Unproblematisch. Verlorener Transponder/Smartphone wird in Sekunden im System gesperrt.</td>
                </tr>
                 <tr>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-[oklch(0.32_0.02_260)]">Flexibilität & Rechte</td>
                  <td className="px-6 py-4 text-[oklch(0.32_0.02_260)]">Starr. Rechte sind physisch im Schlüssel (Fräsung) kodiert und nicht nachträglich änderbar.</td>
                  <td className="px-6 py-4 text-[oklch(0.32_0.02_260)]">Maximal flexibel. Zutrittsrechte können zeitlich, räumlich und personalisiert dynamisch vergeben werden.</td>
                </tr>
                 <tr>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-[oklch(0.32_0.02_260)]">Protokollierung</td>
                  <td className="px-6 py-4 text-[oklch(0.32_0.02_260)]">Nicht möglich. Es lässt sich nicht nachvollziehen, wer wann eine Tür geöffnet hat.</td>
                  <td className="px-6 py-4 text-[oklch(0.32_0.02_260)]">Detailliert möglich. Lückenlose Audit-Trails (wer, wann, wo) für sicherheitskritische Bereiche.</td>
                </tr>
                 <tr>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-[oklch(0.32_0.02_260)]">Initiale Investitionskosten</td>
                  <td className="px-6 py-4 text-[oklch(0.32_0.02_260)]">Niedriger bis moderat (je nach Sicherheitsstufe und Patentlaufzeit).</td>
                  <td className="px-6 py-4 text-[oklch(0.32_0.02_260)]">Höher (Komponenten, Software, Netzwerkinfrastruktur). Amortisiert sich über TCO.</td>
                </tr>
                 <tr>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-[oklch(0.32_0.02_260)]">Wartungsaufwand</td>
                  <td className="px-6 py-4 text-[oklch(0.32_0.02_260)]">Sehr gering. Gelegentliche Schmierung mit Spezial-Pflegespray (graphitfrei).</td>
                  <td className="px-6 py-4 text-[oklch(0.32_0.02_260)]">Mittel. Regelmäßiger Batteriewechsel, Firmware-Updates und Software-Pflege erforderlich.</td>
                </tr>
              </tbody>
            </table>
          </div>


          <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-10">4. Nachhaltigkeit und vorausschauendes Lebenszyklus-Management</h3>
          <p>
            Eine professionelle, normgerechte Sicherheitslösung ist eine substanzielle, langfristige Investition in den Wert und den Schutz Ihrer Immobilie. Daher legen wir bereits in der Konzeptionsphase allergrößten Wert auf das Lebenszyklus-Management (Lifecycle Management) der von uns implementierten und betreuten Systeme. Dies beginnt bei der weitsichtigen Planung durch die präferierte Wahl hochgradig skalierbarer, abwärtskompatibler und modularer Systemarchitekturen.
          </p>
          <p className="mt-4">
            Die Realität zeigt: Sicherheitsanforderungen sind nicht statisch. Wenn sich Ihre Bedürfnisse ändern – sei es durch räumliche Erweiterungen, den Anbau neuer Gebäudeteile, organisatorische Umstrukturierungen in Ihrem Unternehmen, die Integration neuer Abteilungen oder signifikant veränderte, externe Bedrohungslagen – lassen sich unsere modular konzipierten Systeme effizient, kostengünstig und ohne radikale Systemwechsel (Rip-and-Replace) anpassen und erweitern.
          </p>
           <p className="mt-4">
            Darüber hinaus bieten wir unseren Kunden proaktive, strukturierte Service Level Agreements (SLAs) und Wartungskonzepte an. Regelmäßige, turnusmäßige Inspektionen, zeitnahe und sichere Firmware-Updates für elektronische Komponenten zur Schließung von Sicherheitslücken sowie die präventive Wartung hochbeanspruchter mechanischer Verschleißteile stellen sicher, dass das definierte Sicherheitsniveau über Jahre hinweg konstant hoch bleibt. Dieser proaktive Ansatz minimiert das Risiko für kostspielige, ungeplante Totalausfälle und maximiert den Return on Investment (ROI) Ihrer Sicherheitsinfrastruktur.
          </p>

          <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-10">5. Spezifische Herausforderungen bei Gewerbeobjekten und öffentlichen Einrichtungen</h3>
          <p>
            Neben anspruchsvollen Privatkunden betreuen wir schwerpunktmäßig komplexe Gewerbeobjekte, industrielle Anlagen, professionelle Hausverwaltungen und sensible öffentliche Einrichtungen (wie Schulen oder Behörden). In diesen Segmenten gelten fast immer drastisch verschärfte, zusätzliche normative Vorgaben und streng abgestimmte organisatorische Abläufe, die wir lange vor der eigentlichen Planung gemeinsam mit den Sicherheitsbeauftragten, Architekten und dem Facility Management klären.
          </p>
          <p className="mt-4">
            Wir besitzen tiefgreifende Expertise in den hochkomplexen Anforderungen der normgerechten Fluchtwegsteuerung (gemäß den strengen Vorgaben der DIN EN 179 für Notausgänge und DIN EN 1125 für Paniktüren). Wir verstehen die kompromisslosen Brandschutzvorgaben (Feuerschutzabschlüsse nach DIN 4102) und beherrschen die nahtlose, protokollbasierte Integration unserer Zutrittskontrollsysteme in übergeordnete, IP-basierte Gebäudeleittechnik (GLT), Alarm- und Einbruchmeldeanlagen (EMA) sowie Zeiterfassungssysteme. Für den dynamischen gewerblichen Bereich planen wir unsere Lösungen prinzipiell so vorausschauend, dass sie technologisch und architektonisch mühelos mit weiteren Türen, hunderten von neuen Nutzern und sogar dezentralen, global verteilten Standorten mitwachsen können, ohne an Performance oder Sicherheit einzubüßen.
          </p>
        </div>
      <div className="mt-12 max-w-3xl border-t border-[oklch(0.89_0.008_260/0.55)] pt-12">
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
