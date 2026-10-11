import type { Metadata } from 'next';
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';
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

      <section className="mx-auto max-w-4xl py-16 md:py-24 lg:py-32">
        <h2 className="text-3xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] md:text-4xl mb-8">
          Unsere Methodik: Präzision, Sicherheit und Schweizer Licht-Doktrin
        </h2>

        <div className="prose prose-lg text-[oklch(0.32_0.02_260)] leading-relaxed space-y-6">
          <p>
            Ein Schüsseldienst ist längst nicht mehr nur das Aufsperren von Türen. In der heutigen, vernetzten und sicherheitssensiblen Welt erfordert professionelle Schließtechnik ein tiefes Verständnis für Mechanik, Elektronik und intelligente Zutrittskontrollsysteme. Unsere Herangehensweise bei Schluesselmacher24 basiert auf absoluter Präzision, fundiertem Fachwissen und der kompromisslosen Anwendung modernster Sicherheitsstandards. Jede Beratung, jede Installation und jede Notöffnung wird mit der gleichen methodischen Strenge durchgeführt, um Ihnen nicht nur kurzfristig zu helfen, sondern langfristige Sicherheit zu garantieren.
          </p>

          <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-12 mb-4">
            Stufe 1: Die detaillierte Sicherheitsanalyse
          </h3>
          <p>
            Bevor wir eine Schließanlage konzipieren oder eine Tür absichern, führen wir eine tiefgehende Schwachstellenanalyse durch. Wir betrachten Ihr Objekt aus der Perspektive potenzieller Angreifer. Wo sind die kritischen Punkte? Entsprechen die aktuellen Zylinder den neuesten DIN-Normen und VdS-Klassen? Wie verhält es sich mit dem Bohr- und Ziehschutz? Diese Analysephase ist entscheidend, um maßgeschneiderte Sicherheitsarchitekturen zu entwickeln, die genau dort ansetzen, wo das Risiko am höchsten ist. Wir setzen dabei auf hochpräzise Messinstrumente und digitale Planungstools, um jeden Winkel Ihrer Immobilie zu erfassen.
          </p>

          <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-12 mb-4">
            Stufe 2: Hochsicherheits-Schließsysteme und ihre Architektur
          </h3>
          <p>
            Die Wahl des richtigen Schließsystems ist eine komplexe Entscheidung. Wir implementieren ausschließlich Systeme renommierter Hersteller, die höchste Sicherheitsstufen garantieren. Dabei unterscheiden wir zwischen rein mechanischen Anlagen, mechatronischen Zylindern und vollständig elektronischen Zutrittskontrollsystemen. Eine moderne Schließanlage zeichnet sich durch komplexe Profilstrukturen, patentrechtlich geschützte Schlüsselprofile und hochsichere Magnetcodierungen aus. Die Architektur dieser Anlagen wird so geplant, dass sie flexibel erweiterbar bleibt. Das bedeutet, dass Sie bei Personalwechseln oder strukturellen Veränderungen im Gebäude nicht die gesamte Anlage austauschen müssen, sondern Zugriffsrechte dynamisch über Software-Schnittstellen anpassen können.
          </p>

          <div className="my-12 p-8 rounded-2xl bg-[oklch(0.988_0.002_260)] border border-[oklch(0.89_0.008_260/0.55)]">
            <h4 className="font-semibold text-lg text-[oklch(0.16_0.02_260)] mb-4">Technologischer Vergleich: Mechanik vs. Elektronik</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                    <th className="pb-3 font-semibold text-[oklch(0.16_0.02_260)]">Kriterium</th>
                    <th className="pb-3 font-semibold text-[oklch(0.16_0.02_260)]">Mechanische Anlagen</th>
                    <th className="pb-3 font-semibold text-[oklch(0.16_0.02_260)]">Elektronische Systeme</th>
                  </tr>
                </thead>
                <tbody className="text-[oklch(0.32_0.02_260)]">
                  <tr className="border-b border-[oklch(0.89_0.008_260/0.3)]">
                    <td className="py-3 font-medium">Schlüsselverlust</td>
                    <td className="py-3">Zylindertausch oft zwingend</td>
                    <td className="py-3">Transponder sofort sperrbar</td>
                  </tr>
                  <tr className="border-b border-[oklch(0.89_0.008_260/0.3)]">
                    <td className="py-3 font-medium">Flexibilität</td>
                    <td className="py-3">Starr, Änderungen aufwendig</td>
                    <td className="py-3">Hochflexibel, Echtzeit-Updates</td>
                  </tr>
                  <tr className="border-b border-[oklch(0.89_0.008_260/0.3)]">
                    <td className="py-3 font-medium">Protokollierung</td>
                    <td className="py-3">Nicht möglich</td>
                    <td className="py-3">Lückenlose Zutrittshistorie</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Initialkosten</td>
                    <td className="py-3">Niedriger bis moderat</td>
                    <td className="py-3">Höheres Investment</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-12 mb-4">
            Stufe 3: Die Installation – Zerstörungsfrei und Normgerecht
          </h3>
          <p>
            Die beste Sicherheitstechnik ist wertlos, wenn sie fehlerhaft installiert wird. Unsere Techniker sind speziell geschult, um Montagen strikt nach den geltenden DIN-EN-Normen durchzuführen. Besonderes Augenmerk liegt dabei auf dem bündigen Abschluss des Zylinders mit dem Schutzbeschlag, um Angriffsflächen für Zangen oder Brechwerkzeuge zu minimieren. Bei Notöffnungen wenden wir ausnahmslos zerstörungsfreie Techniken an, wann immer dies physikalisch möglich ist. Mittels Lockpicking, Schlagschlüsseltechniken oder hochspezialisierten Fräsern manipulieren wir die Stifte im Zylinder so, dass die Tür ohne Beschädigung von Schloss, Beschlag oder Türblatt geöffnet wird. Diese handwerkliche Exzellenz unterscheidet den professionellen Dienstleister vom Amateur.
          </p>

          <ServiceBudgetCalculator />

          <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-16 mb-6">
            Umfassende FAQ: Expertenwissen zur Sicherheitstechnik
          </h3>
          <div className="space-y-6">
            <div className="p-6 bg-[oklch(0.968_0.004_260)] rounded-xl border border-[oklch(0.89_0.008_260/0.55)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">1. Was bedeutet der VdS-Standard bei Schließzylindern?</h4>
              <p className="text-sm">VdS (Vertrauen durch Sicherheit) ist ein unabhängiges Prüfinstitut. VdS-zertifizierte Zylinder bieten nachweislich einen hohen Widerstand gegen Einbruchsversuche wie Aufbohren, Kernziehen oder Nachschließen. Für private Haushalte empfehlen wir mindestens VdS-Klasse A, für Gewerbe Klasse B oder höher.</p>
            </div>

            <div className="p-6 bg-[oklch(0.968_0.004_260)] rounded-xl border border-[oklch(0.89_0.008_260/0.55)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">2. Kann eine zugefallene Tür immer zerstörungsfrei geöffnet werden?</h4>
              <p className="text-sm">In über 95% der Fälle ja. Wenn die Tür nur ins Schloss gefallen (nicht abgeschlossen) ist, verwenden wir spezielle Öffnungsnadeln, Türfallengleiter oder Spachtel. Ausnahmen bilden Türen mit extrem engen Spaltmaßen oder speziellen Doppelfallen-Schlössern, bei denen unter Umständen der Zylinder gefräst werden muss.</p>
            </div>

            <div className="p-6 bg-[oklch(0.968_0.004_260)] rounded-xl border border-[oklch(0.89_0.008_260/0.55)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">3. Ab wann rechnet sich ein elektronisches Schließsystem?</h4>
              <p className="text-sm">Elektronische Systeme amortisieren sich oft schneller als gedacht, besonders in Unternehmen mit Fluktuation. Der Verlust eines mechanischen Hauptschlüssels kann den Austausch der gesamten Anlage im fünfstelligen Bereich erfordern. Bei Elektronik wird lediglich der verlorene Transponder im System gesperrt – Kostenpunkt oft unter 20 Euro.</p>
            </div>

            <div className="p-6 bg-[oklch(0.968_0.004_260)] rounded-xl border border-[oklch(0.89_0.008_260/0.55)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">4. Was ist ein Schutzbeschlag mit Zylinderabdeckung?</h4>
              <p className="text-sm">Ein Schutzbeschlag schützt den Schließzylinder und das Einsteckschloss vor gewaltsamen Angriffen. Eine Zylinderabdeckung (auch Kernziehschutz genannt) verhindert das Herausziehen des Zylinderkerns mit Spezialschrauben. Dieser Schutz ist heute für Haus- und Wohnungseingangstüren absolut essenziell.</p>
            </div>

            <div className="p-6 bg-[oklch(0.968_0.004_260)] rounded-xl border border-[oklch(0.89_0.008_260/0.55)]">
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">5. Wie oft sollte eine mechanische Schließanlage gewartet werden?</h4>
              <p className="text-sm">Mechanische Zylinder sollten einmal jährlich mit einem speziellen, nicht harzenden Pflegespray (kein Öl oder Graphit!) behandelt werden. Bei stark beanspruchten Anlagen im gewerblichen Bereich empfehlen wir eine professionelle Wartung alle 12 Monate, um Verschleiß frühzeitig zu erkennen und Ausfälle zu vermeiden.</p>
            </div>
          </div>
        </div>
      </section>
</Section>
    </>
  );
}
