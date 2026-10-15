import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarSearch, MapPin, MessageSquare, Phone } from 'lucide-react';

import { getPageContent, getSettings } from '@/lib/data';
import { NAV_AREAS, PROCESS_LABELS } from '@/lib/navigation';
import { formatWeekday } from '@/lib/format';
import { Card, CardBody } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
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
    question: 'Welche Zertifizierungen haben Ihre Techniker?',
    answer:
      'Unsere Techniker durchlaufen regelmäßige Schulungen bei führenden Herstellern (wie ABUS, BKS, DOM, KESO) und besitzen tiefgehende Expertise in mechanischer und elektronischer Schließtechnik. Zudem sind wir als Fachbetrieb bei den lokalen Polizeibehörden im Bereich Einbruchschutz gelistet.'
  },
  {
    question: 'Wie schnell können Sie bei einem Notfall vor Ort sein?',
    answer:
      'Für Vertragskunden mit Service-Level-Agreement (SLA) garantieren wir je nach Vertragsstufe Reaktionszeiten von bis zu zwei Stunden (24/7). Bei regulären Anfragen bemühen wir uns stets um einen zeitnahen Termin, im Akutfall oft noch am selben Tag.'
  },
  {
    question: 'Bieten Sie auch regelmäßige Wartungsverträge an?',
    answer:
      'Ja, wir bieten maßgeschneiderte Wartungsverträge für Schließanlagen und elektronische Zutrittssysteme. Eine regelmäßige Inspektion verlängert die Lebensdauer erheblich und ist bei gewerblichen Objekten oft durch Versicherungen oder Brandschutzvorgaben verpflichtend.'
  },
  {
    question: 'Wie läuft die Projektierung einer neuen Schließanlage ab?',
    answer:
      'Nach einer kostenfreien Erstberatung folgt die Begehung vor Ort. Wir erfassen alle Türen, Fluchtwege und die gewünschten Zutrittsberechtigungen. Darauf basierend erstellen wir einen Schließplan und ein verbindliches Angebot. Nach Freigabe bestellen/fertigen wir die Anlage und übernehmen die fachgerechte Montage.'
  },
  {
    question: 'Können elektronische Schließzylinder nachträglich in bestehende Türen eingebaut werden?',
    answer:
      'In den allermeisten Fällen ist das problemlos möglich. Elektronische Knaufzylinder ersetzen einfach den bestehenden mechanischen Profilzylinder. Weder an der Tür noch am Einsteckschloss müssen in der Regel bauliche Veränderungen vorgenommen werden. Auch eine aufwendige Verkabelung entfällt, da die Zylinder batteriebetrieben sind.'
  }
];

export default async function ServiceUndTerminPage(props: {
  params: Promise<{ [key: string]: string | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await props.params;
  const resolvedSearch = await props.searchParams;
  const [page, settings] = await Promise.all([
    getPageContent('service-und-termin'),
    getSettings(),

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
          eyebrow="Projekt-Budget & Aufwand"
          title="Transparente Kalkulation für komplexe Projekte"
          lead="Erhalten Sie sofortige Einblicke in zu erwartende Budgets. Unser Rechner liefert Ihnen einen ersten Richtwert basierend auf den Erfahrungswerten hunderter erfolgreich umgesetzter Sicherheitsprojekte."
        />
        <div className="mt-8 max-w-3xl">
          <ServiceBudgetCalculator />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Leistungsumfang & Zertifizierungen"
          title="Geprüfte Qualität in jeder Projektphase"
          lead="Sicherheit ist keine Option, sondern das Fundament. Unsere Zertifizierungen und unser umfassender Leistungskatalog spiegeln unseren kompromisslosen Anspruch an Qualität wider."
        />
        <div className="mt-8 prose-sm24 max-w-none space-y-6">
          <p>
            Die Wahl des richtigen Partners für Schließ- und Sicherheitstechnik ist eine Vertrauensfrage. Wir begegnen diesem Vertrauen mit höchster Transparenz, kontinuierlicher Weiterbildung unserer Techniker und der konsequenten Einhaltung strengster Branchenstandards. Unser Leistungsumfang deckt den gesamten Lebenszyklus Ihrer Sicherheitsinfrastruktur ab.
          </p>

          <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8">5. Zertifizierte Sicherheitsstandards</h3>
          <p>
            Unsere Arbeit basiert auf den aktuellen Normen und Richtlinien des Deutschen Instituts für Normung (DIN) und den Vorgaben der VdS Schadenverhütung GmbH. Dies garantiert nicht nur den physischen Schutz Ihrer Objekte, sondern stellt auch sicher, dass im Schadensfall der volle Versicherungsschutz erhalten bleibt. Wir verbauen ausschließlich Komponenten namhafter Hersteller, die nachweislich strengen Prüfverfahren standhalten (z.B. VdS-Klasse B oder C).
          </p>

          <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8">6. Smart Home & Enterprise Integration</h3>
          <p>
            Moderne Gebäude erfordern intelligente Sicherheitskonzepte. Wir integrieren elektronische Zutrittssysteme nahtlos in bestehende Gebäudeleitsysteme (GLT) und Smart Home Umgebungen. Von der Anbindung an KNX-Bus-Systeme bis hin zur API-gestützten Integration in moderne HR-Software zur automatisierten Rechtevergabe bei Mitarbeiterwechseln – wir realisieren die perfekte Synthese aus Sicherheit und Komfort.
          </p>

          <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8">7. Notdienst und 24/7 Support-Verträge</h3>
          <p>
            Sicherheit kennt keine Bürozeiten. Für hochsensible Bereiche wie Serverräume, medizinische Einrichtungen oder Produktionsanlagen bieten wir maßgeschneiderte Service-Level-Agreements (SLAs) an. Diese garantieren im Notfall garantierte Reaktionszeiten von wenigen Stunden, rund um die Uhr, 365 Tage im Jahr.
          </p>
          <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mt-8">8. System-Vergleichsmatrix</h3>
          <p>Zur besseren Orientierung bei der Wahl des passenden Schließsystems, haben wir eine übersichtliche Matrix der gängigsten Lösungen zusammengestellt.</p>
          <div className="table-scroll mt-4">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left font-semibold text-foreground">Systemtyp</th>
                  <th className="py-3 text-left font-semibold text-foreground">Sicherheit</th>
                  <th className="py-3 text-left font-semibold text-foreground">Flexibilität</th>
                  <th className="py-3 text-left font-semibold text-foreground">Einsatzbereich</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 text-foreground font-medium">Mechanische Schließanlage</td>
                  <td className="py-3 text-foreground-muted">Hoch (VdS zertifiziert)</td>
                  <td className="py-3 text-foreground-muted">Gering</td>
                  <td className="py-3 text-foreground-muted">Wohngebäude, kleine Gewerbe</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 text-foreground font-medium">Mechatronische Anlage</td>
                  <td className="py-3 text-foreground-muted">Sehr Hoch</td>
                  <td className="py-3 text-foreground-muted">Mittel</td>
                  <td className="py-3 text-foreground-muted">Büros, Kanzleien, Praxen</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 text-foreground font-medium">Voll-Elektronisches System</td>
                  <td className="py-3 text-foreground-muted">Sehr Hoch (AES 128)</td>
                  <td className="py-3 text-foreground-muted">Sehr Hoch</td>
                  <td className="py-3 text-foreground-muted">Großgewerbe, Industrie, Smart Home</td>
                </tr>
              </tbody>
            </table>
          </div>
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
