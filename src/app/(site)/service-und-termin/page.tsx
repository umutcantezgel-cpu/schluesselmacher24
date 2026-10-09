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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            Die Konzeption und Implementierung moderner Schließ- und Sicherheitstechnik erfordert ein tiefgreifendes Verständnis für mechanische Präzision, elektronische Integration und architektonische Rahmenbedingungen. Unser Service-Ansatz basiert auf einer strikten, methodischen Vorgehensweise, die sicherstellt, dass jede von uns geplante und umgesetzte Lösung exakt auf die spezifischen Anforderungen des jeweiligen Objekts abgestimmt ist. Wir lehnen standardisierte &quot;Out-of-the-box&quot;-Lösungen ab, wo maßgeschneiderte Sicherheit gefordert ist. Jeder Auftrag beginnt mit einer detaillierten Analyse der bestehenden Infrastruktur, der Identifikation potenzieller Schwachstellen und der Definition eines klaren, bedarfsorientierten Schutzziels. Dies ist ein entscheidender Schritt, um eine robuste Sicherheitsarchitektur zu gewährleisten.
          </p>
          <p>
            Die ganzheitliche Betrachtung von Zugangspunkten, mechanischen Widerstandsklassen und elektronischen Berechtigungskonzepten bildet das Fundament unserer Arbeit. Wir evaluieren nicht nur den Status Quo, sondern antizipieren zukünftige Nutzungsänderungen und technologische Entwicklungen, um Investitionssicherheit und nachhaltigen Schutz zu garantieren. Unsere Methodik integriert dabei bewährte Prinzipien der physischen Sicherheit mit modernsten kryptographischen Standards. Die Symbiose aus gehärtetem Material und intelligenter Steuerungslokik ermöglicht es uns, Sicherheitskonzepte zu realisieren, die sowohl Angriffen mit roher Gewalt als auch manipulativen Methoden auf digitaler Ebene widerstehen.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">1. Die Phasen unserer Service-Implementierung im Detail</h3>
          <p>
            Unser Prozess ist in streng definierte Phasen unterteilt, die von der initialen Bestandsaufnahme bis zur finalen Abnahme und Dokumentation reichen. Jede Phase unterliegt strengen Qualitätskontrollen und wird transparent mit unseren Kunden kommuniziert. Dieser strukturierte Ablauf stellt sicher, dass komplexe Projekte termingerecht und innerhalb des definierten Budgets realisiert werden.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Initiierung und Bedarfsanalyse:</strong> Im ersten Schritt erfassen wir nicht nur die offensichtlichen Anforderungen, sondern analysieren auch die verborgenen Risikofaktoren. Dies beinhaltet die detaillierte Bewertung von Türbeschaffenheiten (Material, Falzluft, Bänder), Zylindermaßen (inklusive Berücksichtigung von Kernziehschutzrosetten), elektronischen Schnittstellen (PoE, Wiegand, OSDP) und den allgemeinen architektonischen Gegebenheiten vor Ort. Wir führen eine umfassende Gefährdungsbeurteilung durch, um das spezifische Risikoprofil des Objekts zu erstellen.</li>
            <li><strong>Projektierung und Lösungsdesign:</strong> Basierend auf der Analyse entwickeln wir ein fundiertes Konzept. Bei Schließanlagen bedeutet dies die Erstellung präziser Schließpläne unter Berücksichtigung komplexer Hierarchien, organisatorischer Strukturen und funktionaler Zutrittsberechtigungen. Bei elektronischen Systemen planen wir die Vernetzungstopologie, Stromversorgungskonzepte (inkl. USV) und die nahtlose Integration in bestehende IT- oder Smart-Home-Umgebungen. Das Design berücksichtigt zwingend Normen wie die DIN EN 15684 für mechatronische Schließzylinder.</li>
            <li><strong>Präzise Fertigung und Vorkonfiguration:</strong> Bevor wir vor Ort tätig werden, bereiten wir alle Komponenten in unserer ISO-zertifizierten Fachwerkstatt vor. Mechanische Zylinder werden nach Maß gefertigt und gestiftet, elektronische Transponder (z.B. Mifare DESFire EV2/EV3) kryptographisch sicher codiert und alle elektronischen Komponenten vorab in einer Staging-Umgebung getestet. Dieses Pre-Provisioning reduziert die Ausfallzeiten vor Ort auf ein absolutes Minimum und minimiert Fehlerquellen während der Installation.</li>
            <li><strong>Fachgerechte Montage und Integration:</strong> Unsere zertifizierten Techniker installieren die Systeme mit höchster handwerklicher Präzision. Dies umfasst die fachgerechte Montage mechanischer Sicherungen (z.B. Panzerriegel nach DIN 18104) ebenso wie die Verkabelung und Inbetriebnahme komplexer elektronischer Anlagen, stets unter strikter Einhaltung geltender Normen und Sicherheitsrichtlinien (z.B. DIN 18252 für Profilzylinder, VdS-Richtlinien).</li>
            <li><strong>Dokumentation und Systemübergabe:</strong> Jedes Projekt schließt mit einer umfassenden, revisionssicheren Dokumentation ab. Sie erhalten personalisierte Sicherungskarten, detaillierte Schließpläne im standardisierten Format, ausführliche Bedienungsanleitungen und formalisierte Abnahmeprotokolle, die eine lückenlose Nachvollziehbarkeit und zukünftige Erweiterbarkeit garantieren.</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-8">2. Technologische Standards und Materialqualität</h3>
          <p>
            Welche Produkte wir einsetzen, richtet sich nach Tür, Schutzziel und Budget. Entscheidend sind mechanische Stabilität, Schutz gegen Manipulation und eine lange Nutzungsdauer — die konkrete Auswahl stimmen wir mit Ihnen im Angebot ab. Wir arbeiten ausschließlich mit Herstellern zusammen, die unsere extrem hohen Qualitätsstandards teilen und nachweislich langlebige Komponenten produzieren.
          </p>
          <p>
            Bei mechanischen Zylindern achten wir auf Merkmale wie zertifizierten Bohr- und Ziehschutz (z.B. durch integrierte Hartmetallstifte), patentierte Schlüsselprofile mit rechtlichem und technischem Kopierschutz (um illegale Kopien effektiv zu verhindern) und modulare Bauweisen, die nachträgliche Längenanpassungen ermöglichen. Im Bereich der Elektronik empfehlen wir Systeme mit verschlüsselter Kommunikation (z.B. MIFARE DESFire EV2/EV3, Bluetooth Low Energy mit AES-128-Verschlüsselung) und ausfallsichere Systemarchitekturen, die auch bei Stromausfall eine definierte Grundsicherheit gewährleisten. Die nahtlose Verzahnung von Mechanik und Elektronik (Mechatronik) bildet oft den Kern unserer fortschrittlichsten Lösungen.
          </p>
          <p>
            Darüber hinaus evaluieren wir kontinuierlich neue Technologien auf ihre Praxistauglichkeit und Sicherheit. Biometrische Zugangssysteme, Smartphone-basierte Credentials und Cloud-verwaltete Zutrittskontrollsysteme werden strengen Penetrationstests unterzogen, bevor wir sie unseren Kunden empfehlen. Die physische Härtung der Hardwarekomponenten ist dabei ebenso wichtig wie die kryptographische Absicherung der digitalen Kommunikationswege.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">3. Nachhaltigkeit und Lebenszyklus-Management</h3>
          <p>
            Eine professionelle Sicherheitslösung ist eine langfristige Investition. Daher legen wir großen Wert auf das Lebenszyklus-Management der von uns betreuten Systeme. Dies beginnt bereits bei der Planung durch die Wahl skalierbarer und modularer Architekturen. Wenn sich Ihre Anforderungen ändern – sei es durch räumliche Erweiterungen, organisatorische Umstrukturierungen oder veränderte Bedrohungslagen – lassen sich unsere Systeme effizient anpassen, ohne dass ein kompletter Austausch erforderlich wird (Investitionsschutz).
          </p>
          <p>
            Darüber hinaus bieten wir strukturierte Wartungskonzepte an (SLA-basiert). Regelmäßige Inspektionen, zeitkritische Software-Updates für elektronische Komponenten und die präventive Wartung hochbeanspruchter mechanischer Teile stellen sicher, dass das Sicherheitsniveau über Jahre hinweg konstant hoch bleibt und kostspielige Totalausfälle vermieden werden. Unsere Service-Level-Agreements garantieren zudem definierte Reaktionszeiten bei Störungen.
          </p>
          <p>
            Nachhaltigkeit bedeutet für uns auch, ressourcenschonend zu agieren. Wir bevorzugen Systeme mit geringem Energieverbrauch, langlebigen Batterien in elektronischen Zylindern und recyclebaren Materialien. Wo möglich, reparieren wir mechanische Komponenten, anstatt sie sofort zu ersetsetzen.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">4. Gewerbeobjekte und öffentliche Einrichtungen: Besondere Anforderungen</h3>
          <p>
            Neben Privatkunden betreuen wir Gewerbeobjekte, komplexe Hausverwaltungen und öffentliche Einrichtungen. Dort gelten oft zusätzliche, gesetzlich bindende Vorgaben und eng abgestimmte organisatorische Abläufe, die wir vor der Planung gemeinsam mit Ihnen im Detail klären. Die Koordination mit anderen Gewerken (z.B. Brandschutz, Elektrotechnik) ist hierbei von zentraler Bedeutung.
          </p>
          <p>
            Wir verstehen die Herausforderungen von Fluchtwegsteuerung (gemäß DIN EN 179 für Notausgänge und DIN EN 1125 für Paniktüren), strengen Brandschutzvorgaben (Zulassungen für Feuer- und Rauchschutztüren) und die Integration von Zutrittskontrollsystemen in übergeordnete Gebäudeleittechnik (GLT) oder Gefahrenmanagementsysteme (GMS). Für den gewerblichen Bereich planen wir Lösungen von vornherein so, dass sie problemlos mit weiteren Türen, Nutzern, komplexen Zeitprofilen und verteilten Standorten mitwachsen können (Mandantenfähigkeit).
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">5. Detaillierte Fach-FAQ zur Methodik</h3>
          <p>Häufig gestellte Fragen zu unseren technischen Ansätzen und Qualitätsstandards.</p>
          <ul className="list-disc pl-5 space-y-4 mt-4">
             <li><strong>Frage 1: Wie wird die Sicherheit von elektronischen Zutrittssystemen gegen Hacking gewährleistet?</strong><br/>
             Antwort: Wir verwenden ausschließlich Systeme mit Ende-zu-Ende-Verschlüsselung (z.B. AES-128 oder höher). Die Kommunikation zwischen Identmedium (Transponder/Smartphone) und dem Leser ist kryptographisch abgesichert, um Replay- oder Relay-Angriffe zu verhindern. Zudem empfehlen wir Offline-Systeme für hochsensible Bereiche, die nicht von einer permanenten Netzwerkverbindung abhängig sind.</li>
             <li><strong>Frage 2: Was ist der Unterschied zwischen einem technischen und einem rechtlichen Kopierschutz bei Schlüsseln?</strong><br/>
             Antwort: Ein rechtlicher Schutz (Patentschutz) verbietet es anderen Herstellern, Rohlinge für dieses Profil herzustellen. Ein technischer Schutz (z.B. bewegliche Elemente im Schlüssel, komplexe Profilfräsungen) macht es physisch extrem schwer bis unmöglich, den Schlüssel mit handelsüblichen Maschinen (wie 3D-Druckern oder einfachen Fräsen) funktionsfähig zu kopieren. Wir kombinieren stets beide Ansätze.</li>
             <li><strong>Frage 3: Wie stellen Sie sicher, dass Brandschutzanforderungen beim Einbau elektronischer Zylinder eingehalten werden?</strong><br/>
             Antwort: Wir verwenden ausschließlich Zylinder und Beschläge, die über entsprechende Zulassungen für Feuer- und Rauchschutztüren verfügen. Der Einbau erfolgt streng nach den Herstellervorgaben, um die Zulassung der Tür (z.B. T30) nicht zu gefährden. Dies dokumentieren wir entsprechend im Abnahmeprotokoll.</li>
             <li><strong>Frage 4: Können bestehende mechanische Schließanlagen schrittweise digitalisiert werden?</strong><br/>
             Antwort: Ja, dies ist ein häufiger Anwendungsfall (Mechatronik). Wir können z.B. die Außenhaut und hochsensible Bereiche elektronisch absichern, während Innentüren mechanisch bleiben. Das Identmedium (z.B. ein Schlüssel mit integriertem Transponder-Chip) kann dann sowohl die mechanischen als auch die elektronischen Zylinder bedienen.</li>
             <li><strong>Frage 5: Was passiert bei einem Stromausfall mit elektronischen Zutrittssystemen?</strong><br/>
             Antwort: Das hängt von der Systemarchitektur ab. Batteriebetriebene elektronische Zylinder und Beschläge funktionieren autark weiter. Bei verkabelten Systemen planen wir in der Regel eine unterbrechungsfreie Stromversorgung (USV) ein, die das System für einen definierten Zeitraum aufrechterhält. Die Fail-Safe- oder Fail-Secure-Eigenschaften werden vorab objektspezifisch definiert.</li>
          </ul>
        </div>

      </Section>

      <Section tone="muted" id="orientierung">
        <SectionHeading
          eyebrow="Orientierung"
          title="Womit Sie bei einem Serviceeinsatz rechnen können"
          lead="Für häufige Leistungen vor Ort erhalten Sie hier eine erste Orientierung. Den verbindlichen Preis nennen wir nach der Prüfung Ihrer Anfrage."
        />
        <div className="mt-8 max-w-3xl">
          <ServiceBudgetCalculator />
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
