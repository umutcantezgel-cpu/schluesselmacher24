import type { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';

import { getPageContent, getSettings } from '@/lib/data';
import { getRichtwerte } from '@/lib/data/richtwerte';
import { NAV_AREAS, PROCESS_LABELS } from '@/lib/navigation';
import { formatWeekday } from '@/lib/format';
import { enthaeltPlatzhalter, istPlatzhalter } from '@/lib/platzhalter';
import { cn } from '@/lib/cn';
import { Accordion } from '@/components/ui/accordion';
import { PageHeader } from '@/components/layout/page-header';
import { ServiceEinsatzRechner } from '@/components/calculator/service-einsatz-rechner';
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { AblaufGrafik } from '@/components/visual/generators/ablauf';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { GlyphWinkelUnten } from '@/components/visual/glyphen/winkel-unten';
import { IconBeratungTelefon } from '@/components/visual/icons/beratung-telefon';
import type { IconProps } from '@/components/visual/icons/icon-base';
import { IconServiceUndTermin } from '@/components/visual/icons/service-und-termin';
import { IconStandort } from '@/components/visual/icons/standort';
import { IconTermin } from '@/components/visual/icons/termin';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent('service-und-termin');
  return {
    title: page?.seo.title ?? 'Service und Termin',
    description: page?.seo.description,
    alternates: { canonical: '/service-und-termin' },
  };
}

/** Fach-Icon je Weg (ab 24 px, ohne farbigen Kasten, KERN K-008a). */
const ENTRIES: Array<{ href: string; label: string; description: string; icon: ComponentType<IconProps> }> = [
  {
    href: '/service-und-termin/anfrage',
    label: 'Allgemeine Anfrage',
    description: 'Wenn Ihr Anliegen in keinen der Fachbereiche passt.',
    icon: IconServiceUndTermin,
  },
  {
    href: '/service-und-termin/terminstatus',
    label: 'Terminstatus',
    description: 'Stand Ihres Vorgangs mit Vorgangsnummer und E-Mail-Adresse abrufen.',
    icon: IconTermin,
  },
  {
    href: '/service-und-termin/vor-ort',
    label: 'Vor-Ort-Leistungen',
    description: 'Was wir direkt bei Ihnen im Objekt erledigen.',
    icon: IconStandort,
  },
  {
    href: '/service-und-termin/kontakt',
    label: 'Kontakt',
    description: 'Erreichbarkeit, Anschrift und Anfahrt.',
    icon: IconBeratungTelefon,
  },
];

/** Die fünf Phasen eines Auftrags: Kopfzeichnung (Abschnitt 03) und Definitionsliste (03.1). */
const PHASEN: Array<{ kurz: string; name: string; text: string }> = [
  {
    kurz: 'Bedarfsanalyse',
    name: 'Initiierung und Bedarfsanalyse',
    text: 'Im ersten Schritt erfassen wir nicht nur die offensichtlichen Anforderungen, sondern analysieren auch die verborgenen Risikofaktoren. Dies beinhaltet die Bewertung von Türbeschaffenheiten, Zylindermaßen, elektronischen Schnittstellen und den allgemeinen architektonischen Gegebenheiten vor Ort.',
  },
  {
    kurz: 'Projektierung',
    name: 'Projektierung und Lösungsdesign',
    text: 'Basierend auf der Analyse entwickeln wir ein fundiertes Konzept. Bei Schließanlagen bedeutet dies die Erstellung präziser Schließpläne unter Berücksichtigung komplexer Hierarchien und Zutrittsberechtigungen. Bei elektronischen Systemen planen wir die Vernetzung, Stromversorgung und Integration in bestehende IT- oder Smart-Home-Umgebungen.',
  },
  {
    kurz: 'Fertigung',
    name: 'Präzise Fertigung und Vorkonfiguration',
    text: 'Bevor wir vor Ort tätig werden, bereiten wir alle Komponenten in unserer Fachwerkstatt vor. Zylinder werden nach Maß gefertigt, Transponder codiert und elektronische Komponenten vorab getestet, um die Ausfallzeiten vor Ort auf ein absolutes Minimum zu reduzieren.',
  },
  {
    kurz: 'Montage',
    name: 'Fachgerechte Montage und Integration',
    text: 'Unsere Techniker installieren die Systeme mit höchster handwerklicher Präzision. Dies umfasst die fachgerechte Montage mechanischer Sicherungen ebenso wie die Verkabelung und Inbetriebnahme komplexer elektronischer Anlagen, stets unter Einhaltung geltender Normen und Sicherheitsrichtlinien (z.B. DIN 18252 für Profilzylinder, DIN EN 1303).',
  },
  {
    kurz: 'Dokumentation',
    name: 'Dokumentation und Systemübergabe',
    text: 'Jedes Projekt schließt mit einer umfassenden Dokumentation ab. Sie erhalten Sicherungskarten, detaillierte Schließpläne, Bedienungsanleitungen und Protokolle, die eine lückenlose Nachvollziehbarkeit und zukünftige Erweiterbarkeit garantieren.',
  },
];
const PHASEN_SCHRITTE = PHASEN.map((p) => p.kurz).join('|');
const PHASEN_TITEL = `Phasen eines Auftrags: ${PHASEN.map((p) => p.kurz).join(', ')}`;

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

/** Platzhalter aus Inhalten erscheinen nie als Fakt (MENSCHEN M-03). */
function ohnePlatzhalter(text: string | undefined): string | undefined {
  return istPlatzhalter(text) || enthaeltPlatzhalter(text) ? undefined : text;
}

export default async function ServiceUndTerminPage() {
  const [page, settings, richtwerte] = await Promise.all([
    getPageContent('service-und-termin'),
    getSettings(),
    getRichtwerte(),
  ]);

  const ablauf = PROCESS_LABELS['gefuehrte-anfrage'];
  const prozesse = Object.keys(PROCESS_LABELS) as Array<keyof typeof PROCESS_LABELS>;
  const weitereLinks = (page?.seo.internalLinks ?? []).filter((link) => !enthaeltPlatzhalter(link.label));

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

      {/* Kopf: Phasenzeichnung als Blickfang, Fach-Icon klein neben der Augenbraue (B-13) */}
      <PageHeader
        bereich="service-und-termin"
        eyebrow="Service und Termin"
        title={page?.headline ?? 'Service und Termin'}
        lead={ohnePlatzhalter(page?.subline)}
        crumbs={[{ href: '/service-und-termin', label: 'Service und Termin' }]}
        visual={
          <div className="rounded-lg bg-area-soft/40 p-4 sm:p-6">
            <AblaufGrafik params={{ schritte: PHASEN_SCHRITTE, format: 'schmal' }} title={PHASEN_TITEL} className="sm:hidden" />
            <AblaufGrafik params={{ schritte: PHASEN_SCHRITTE }} title={PHASEN_TITEL} className="hidden sm:block" />
          </div>
        }
      >
        <dl className="grid grid-cols-2 border-y border-border">
          <div className="py-4">
            <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">Wege</dt>
            <dd className="mt-1 font-mono text-title-sm font-semibold tabular-nums text-foreground">
              {ENTRIES.length}
            </dd>
          </div>
          <div className="border-l border-border py-4 pl-3 sm:pl-4">
            <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">Ablauf</dt>
            <dd className="mt-1 text-title-sm font-semibold text-foreground">{ablauf.label}</dd>
          </div>
        </dl>
      </PageHeader>

      {/* 01 Wege: Stückliste mit Fach-Icons, die ganze Zeile ist der Link */}
      <Section>
        <SectionHeading
          nummer="01"
          eyebrow="Anliegen"
          title="Wählen Sie Ihr Anliegen"
          lead={ohnePlatzhalter(page?.intro)}
        />

        <ul className="mt-12 border-t border-border">
          {ENTRIES.map((entry) => {
            const Icon = entry.icon;
            return (
              <li key={entry.href} className="group relative border-b border-border">
                {/* Ein Link deckt die Zeile ab; sein Name ist das Linkziel. */}
                <Link href={entry.href} className="absolute inset-0 rounded-lg">
                  <span className="sr-only">{entry.label}</span>
                </Link>
                <div className="pointer-events-none flex items-center gap-5 py-6 sm:gap-8">
                  <Icon size={40} className="shrink-0 text-area-strong" />
                  <div className="min-w-0 flex-1">
                    <p className="text-title-sm font-semibold text-foreground transition-colors duration-quick group-hover:text-area-strong">
                      {entry.label}
                    </p>
                    <p className="mt-2 max-w-measure text-small text-foreground-muted">{entry.description}</p>
                  </div>
                  <GlyphPfeilRechts
                    size={18}
                    className="shrink-0 text-foreground-muted transition-transform duration-quick zeiger:group-hover:translate-x-1"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* 02 Bereiche: Haarlinienraster, keine Karten */}
      <Section tone="muted">
        <SectionHeading
          nummer="02"
          eyebrow="Wege zu uns"
          title="Vier Abläufe, ein Erlebnis"
          lead="Je nach Anliegen führt ein anderer Weg schneller zum Ziel. Bedienung, Sprache und Gestaltung sind überall gleich."
        />

        <ul className="mt-12 -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-0 md:overflow-visible md:scroll-px-0 md:border-t md:border-border md:px-0 md:pb-0 lg:grid-cols-4">
          {prozesse.map((key, index) => {
            const areas = NAV_AREAS.filter((a) => a.process === key);
            return (
              <li
                key={key}
                className={cn(
                  'shrink-0 basis-3/4 snap-start rounded-lg border border-border bg-surface p-5 md:basis-auto md:rounded-none md:border-0 md:border-b md:bg-transparent md:p-8',
                  index % 2 === 1 && 'md:border-l',
                  index % 4 === 0 ? 'lg:border-l-0' : 'lg:border-l',
                )}
              >
                <p className="text-title-sm font-semibold text-foreground">{PROCESS_LABELS[key].label}</p>
                <p className="mt-2 max-w-measure text-small text-foreground-muted">{PROCESS_LABELS[key].hint}</p>
                {areas.length > 0 && (
                  <ul className="mt-6 border-t border-border">
                    {areas.map((area) => (
                      <li key={area.key} className="border-b border-border">
                        {area.key === 'service-und-termin' ? (
                          <span aria-current="page" className="flex min-h-touch items-center text-small text-foreground-muted">
                            {area.label}
                          </span>
                        ) : (
                          <Link
                            href={area.href}
                            className="group flex min-h-touch items-center justify-between gap-3 text-small text-foreground transition-colors duration-quick hover:text-primary"
                          >
                            <span>{area.label}</span>
                            <GlyphPfeilRechts
                              size={16}
                              className="shrink-0 text-foreground-muted transition duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-primary group-focus-visible:text-primary"
                            />
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </Section>

      {/* 03 Vorgehen: Kopf läuft mit (5/7), Teile 03.1–03.4 einklappbar (B-09), Phasen als Definitionsliste */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              nummer="03"
              eyebrow="Vorgehen"
              title="Präzision in jedem Schritt: Unsere Service-Architektur"
              lead="Wir verstehen Schließtechnik und Sicherheitssysteme nicht als isolierte Produkte, sondern als integrierte architektonische Lösungen, die höchste Ansprüche an Präzision, Zuverlässigkeit und Langlebigkeit erfüllen müssen."
            />
          </div>

          <div className="lg:col-span-7">
            <div className="prose-sm24">
              <p>
                Die Konzeption und Implementierung moderner Schließ- und Sicherheitstechnik erfordert ein tiefgreifendes Verständnis für mechanische Präzision, elektronische Integration und architektonische Rahmenbedingungen. Unser Service-Ansatz basiert auf einer strikten, methodischen Vorgehensweise, die sicherstellt, dass jede von uns geplante und umgesetzte Lösung exakt auf die spezifischen Anforderungen des jeweiligen Objekts abgestimmt ist. Wir lehnen standardisierte &quot;Out-of-the-box&quot;-Lösungen ab, wo maßgeschneiderte Sicherheit gefordert ist. Jeder Auftrag beginnt mit einer detaillierten Analyse der bestehenden Infrastruktur, der Identifikation potenzieller Schwachstellen und der Definition eines klaren, bedarfsorientierten Schutzziels.
              </p>
            </div>

            <div className="mt-10 border-t border-border">
              <details className="group border-b border-border" open>
                <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between gap-4 py-5 text-foreground transition-colors duration-quick hover:text-primary [&::-webkit-details-marker]:hidden">
                  <h3 className="min-w-0 text-title-sm font-semibold">
                    <span className="block font-mono text-caption font-normal tabular-nums text-foreground-muted">03.1</span>
                    Die Phasen unserer Service-Implementierung
                  </h3>
                  <GlyphWinkelUnten size={18} className="shrink-0 text-foreground-muted transition-transform duration-base ease-standard group-open:rotate-180" />
                </summary>
                <div className="sm24-fade pb-8 [--sm24-duration:var(--dauer-quick)]">
                  <div className="prose-sm24">
                    <p>
                      Unser Prozess ist in streng definierte Phasen unterteilt, die von der initialen Bestandsaufnahme bis zur finalen Abnahme und Dokumentation reichen. Wir setzen bei jeder Phase auf höchste Transparenz und technische Präzision.
                      Die architektonische Ausrichtung unserer Service-Implementierung basiert auf bewährten Methodiken, die eine nahtlose Integration in Ihre bestehende Infrastruktur gewährleisten.
                      Jeder Schritt wird minutiös geplant und protokolliert, um Ausfallzeiten zu minimieren und maximale Sicherheit zu garantieren.
                      Darüber hinaus fließen kontinuierlich Erkenntnisse aus aktuellen Bedrohungsszenarien in unsere Vorgehensweise ein, sodass Sie stets von einer state-of-the-art Lösung profitieren.
                    </p>
                    <p>
                      Die Implementierung komplexer Sicherheitstechnik erfordert ein tiefes Verständnis sowohl der mechanischen als auch der elektronischen Komponenten. Unsere Techniker sind nicht nur handwerklich versiert, sondern auch in der Konfiguration und Vernetzung digitaler Schließsysteme ausgebildet. Dies ermöglicht uns, hybride Systeme zu realisieren, die physische Robustheit mit digitaler Intelligenz vereinen.
                      Die Integration in übergeordnete Managementsysteme (z.B. Gebäudeleittechnik) wird dabei von Beginn an mitgedacht, um eine zentrale Verwaltung und Überwachung zu ermöglichen.
                      Wir verwenden ausschließlich zertifizierte Komponenten führender Hersteller, die unsere strengen Qualitätsprüfungen bestanden haben.
                    </p>
                  </div>
                  <dl className="mt-6 max-w-measure border-t border-border">
                    {PHASEN.map((phase, i) => (
                      <div key={phase.kurz} className="border-b border-border py-5 last:border-b-0">
                        <dt className="flex items-baseline gap-3 text-title-sm font-semibold text-foreground">
                          <span className="font-mono text-caption font-normal tabular-nums text-foreground-muted">{String(i + 1).padStart(2, '0')}</span>
                          <span>{phase.name}</span>
                        </dt>
                        <dd className="mt-2 hyphens-auto text-body text-foreground-muted">{phase.text}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </details>
              <details className="group border-b border-border">
                <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between gap-4 py-5 text-foreground transition-colors duration-quick hover:text-primary [&::-webkit-details-marker]:hidden">
                  <h3 className="min-w-0 text-title-sm font-semibold">
                    <span className="block font-mono text-caption font-normal tabular-nums text-foreground-muted">03.2</span>
                    Technologische Standards und Materialqualität
                  </h3>
                  <GlyphWinkelUnten size={18} className="shrink-0 text-foreground-muted transition-transform duration-base ease-standard group-open:rotate-180" />
                </summary>
                <div className="sm24-fade pb-8 [--sm24-duration:var(--dauer-quick)]">
                  <div className="prose-sm24">
                    <p>
                      Welche Produkte wir einsetzen, richtet sich nach Tür, Schutzziel und Budget. Entscheidend sind mechanische Stabilität, Schutz gegen Manipulation und eine lange Nutzungsdauer — die konkrete Auswahl stimmen wir mit Ihnen im Angebot ab.
                      Unsere Materialphilosophie folgt dem Grundsatz der maximalen Widerstandsfähigkeit bei gleichzeitig eleganter Formensprache.
                      Wir verbauen ausschließlich Zylinder und Beschläge, die den höchsten europäischen Normen (z.B. EN 1303, DIN 18252) entsprechen und unabhängigen Prüfungen standgehalten haben.
                      Die Oberflächenveredelungen unserer Beschläge sind nicht nur ästhetisch ansprechend, sondern auch extrem widerstandsfähig gegen Korrosion und mechanische Abnutzung, was besonders bei stark frequentierten Eingangstüren von entscheidender Bedeutung ist.
                    </p>
                    <p>
                      Ein besonderes Augenmerk legen wir auf die Integration elektronischer Zugangskontrollen in historische oder architektonisch anspruchsvolle Türen. Hier bedarf es spezieller Beschläge, die die moderne Technik unauffällig integrieren, ohne das historische Erscheinungsbild zu stören.
                      Für diese Anwendungsfälle bieten wir maßgeschneiderte Lösungen, die Funktionalität und Ästhetik in perfekter Harmonie vereinen.
                      Zusätzlich sichern wir die Datenübertragung zwischen den Leseeinheiten und der Steuerung durch modernste kryptographische Verfahren ab, um Man-in-the-Middle-Angriffe effektiv zu verhindern.
                    </p>
                    <p>
                      Bei mechanischen Zylindern achten wir auf Merkmale wie Bohr- und Ziehschutz, patentierte Schlüsselprofile (um illegale Kopien zu verhindern) und modulare Bauweisen, die nachträgliche Längenanpassungen ermöglichen. Im Bereich der Elektronik empfehlen wir Systeme mit verschlüsselter Kommunikation (z.B. MIFARE DESFire EV2/EV3, Bluetooth Low Energy mit AES-128-Verschlüsselung) und ausfallsichere Systeme, die auch bei Stromausfall eine definierte Grundsicherheit gewährleisten. Die nahtlose Verzahnung von Mechanik und Elektronik (Mechatronik) bildet oft den Kern unserer fortschrittlichsten Lösungen.
                    </p>
                  </div>
                </div>
              </details>
              <details className="group border-b border-border">
                <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between gap-4 py-5 text-foreground transition-colors duration-quick hover:text-primary [&::-webkit-details-marker]:hidden">
                  <h3 className="min-w-0 text-title-sm font-semibold">
                    <span className="block font-mono text-caption font-normal tabular-nums text-foreground-muted">03.3</span>
                    Nachhaltigkeit und Lebenszyklus-Management
                  </h3>
                  <GlyphWinkelUnten size={18} className="shrink-0 text-foreground-muted transition-transform duration-base ease-standard group-open:rotate-180" />
                </summary>
                <div className="sm24-fade pb-8 [--sm24-duration:var(--dauer-quick)]">
                  <div className="prose-sm24">
                    <p>
                      Eine professionelle Sicherheitslösung ist eine langfristige Investition. Daher legen wir großen Wert auf das Lebenszyklus-Management der von uns betreuten Systeme. Dies beginnt bereits bei der Planung durch die Wahl skalierbarer und modularer Architekturen. Wenn sich Ihre Anforderungen ändern – sei es durch räumliche Erweiterungen, organisatorische Umstrukturierungen oder veränderte Bedrohungslagen – lassen sich unsere Systeme effizient anpassen.
                    </p>
                    <p>
                      Darüber hinaus bieten wir strukturierte Wartungskonzepte an. Regelmäßige Inspektionen, Software-Updates für elektronische Komponenten und die präventive Wartung hochbeanspruchter mechanischer Teile stellen sicher, dass das Sicherheitsniveau über Jahre hinweg konstant hoch bleibt und kostspielige Totalausfälle vermieden werden.
                    </p>
                  </div>
                </div>
              </details>
              <details className="group border-b border-border">
                <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between gap-4 py-5 text-foreground transition-colors duration-quick hover:text-primary [&::-webkit-details-marker]:hidden">
                  <h3 className="min-w-0 text-title-sm font-semibold">
                    <span className="block font-mono text-caption font-normal tabular-nums text-foreground-muted">03.4</span>
                    Gewerbeobjekte und öffentliche Einrichtungen
                  </h3>
                  <GlyphWinkelUnten size={18} className="shrink-0 text-foreground-muted transition-transform duration-base ease-standard group-open:rotate-180" />
                </summary>
                <div className="sm24-fade pb-8 [--sm24-duration:var(--dauer-quick)]">
                  <div className="prose-sm24">
                    <p>
                      Neben Privatkunden betreuen wir Gewerbeobjekte, Hausverwaltungen und öffentliche Einrichtungen. Dort gelten oft zusätzliche Vorgaben und abgestimmte organisatorische Abläufe, die wir vor der Planung gemeinsam mit Ihnen klären.
                    </p>
                    <p>
                      Wir verstehen die Herausforderungen von Fluchtwegsteuerung (gemäß DIN EN 179 und DIN EN 1125), Brandschutzvorgaben und die Integration von Zutrittskontrollsystemen in übergeordnete Gebäudeleittechnik. Für den gewerblichen Bereich planen wir Lösungen so, dass sie mit weiteren Türen, Nutzern und Standorten mitwachsen können.
                    </p>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </Section>

      {/* 04 Rechenhilfe */}
      <Section tone="sunken" id="orientierung">
        <SectionHeading
          nummer="04"
          eyebrow="Orientierung"
          title="Womit Sie bei einem Serviceeinsatz rechnen können"
          lead="Für häufige Leistungen vor Ort erhalten Sie hier eine erste Orientierung. Den verbindlichen Preis nennen wir nach der Prüfung Ihrer Anfrage."
        />
        <div className="mt-12 max-w-3xl">
          <ServiceEinsatzRechner
            werte={richtwerte.serviceEinsatz}
            anfrageHref="/service-und-termin/anfrage?thema=service-und-termin"
          />
        </div>
        <div className="mt-16 max-w-3xl">
          <ServiceBudgetCalculator />
        </div>
      </Section>

      {/* 05 Fragen */}
      <Section>
        <SectionHeading
          nummer="05"
          eyebrow="Fachwissen"
          title="Häufig gestellte Fragen (FAQ)"
          lead="Detaillierte Antworten auf die wichtigsten Fragen rund um unsere Services, Abläufe und technischen Standards."
        />
        <Accordion items={SERVICE_FAQ} className="mt-12 max-w-4xl" />

        <div className="mt-16 max-w-4xl prose-sm24">
          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Erweiterte technische FAQs zur Systemintegration</h3>
          <dl className="mt-8 space-y-6">
            <div>
              <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Wie gewährleisten Sie die Ausfallsicherheit elektronischer Schließanlagen bei Stromausfall?</dt>
              <dd className="mt-2 text-[oklch(0.32_0.02_260)]">
                Unsere elektronischen Systeme sind nach dem &quot;Fail-Secure&quot; oder &quot;Fail-Safe&quot; Prinzip konfiguriert, abhängig von den brandschutztechnischen Vorgaben der jeweiligen Tür. Flucht- und Rettungswege öffnen bei Stromausfall automatisch (Fail-Safe), während sicherheitsrelevante Außentüren verriegelt bleiben (Fail-Secure). Alle zentralen Steuereinheiten sind mit USV-Anlagen (Unterbrechungsfreie Stromversorgung) gepuffert, und batteriebetriebene Offline-Zylinder warnen rechtzeitig vor einem Spannungsabfall, um einen rechtzeitigen Batteriewechsel zu ermöglichen.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Können bestehende mechanische Schließanlagen in neue elektronische Systeme integriert werden?</dt>
              <dd className="mt-2 text-[oklch(0.32_0.02_260)]">
                Ja, die Realisierung hybrider Anlagen ist eine unserer Kernkompetenzen. Wir nutzen sogenannte Mechatronik-Zylinder, die sowohl einen mechanischen Schlüsselbart als auch einen integrierten RFID-Chip abfragen. Dies ermöglicht es, bestehende mechanische Schlüsselgruppen beizubehalten und schrittweise oder bereichsweise um elektronische Zutrittskontrollen zu erweitern, ohne die gesamte Infrastruktur austauschen zu müssen.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Welche Verschlüsselungsstandards nutzen Ihre elektronischen Zugangssysteme?</dt>
              <dd className="mt-2 text-[oklch(0.32_0.02_260)]">
                Wir implementieren ausschließlich Systeme, die auf modernsten kryptographischen Standards basieren. Die Kommunikation zwischen Transponder und Leser erfolgt bei unseren bevorzugten Systemen (z.B. MIFARE DESFire EV2/EV3) über AES-128 oder AES-256 Verschlüsselung. Auch die Datenübertragung zwischen den Controllern und der Management-Software ist durchgehend TLS-verschlüsselt (Transport Layer Security), um eine Abhör- und Manipulationssicherheit auf Banken-Niveau zu gewährleisten.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Wie wird der Datenschutz bei der Erfassung von Zutrittsereignissen sichergestellt?</dt>
              <dd className="mt-2 text-[oklch(0.32_0.02_260)]">
                Unsere Systeme sind DSGVO-konform konfigurierbar. Die Protokollierung von Zutrittsereignissen kann vollständig anonymisiert oder zeitlich streng limitiert erfolgen. Wir unterstützen Sie bei der Erstellung des notwendigen Löschkonzepts. Zudem können die Datenbanken lokal on-premise gehostet werden, sodass keine sensiblen Bewegungsdaten Ihr Unternehmensnetzwerk verlassen. Bei Cloud-Lösungen arbeiten wir ausschließlich mit ISO 27001 zertifizierten Rechenzentren mit Standort in Deutschland.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[oklch(0.16_0.02_260)]">Welche Wartungsintervalle empfehlen Sie für hochfrequentierte Sicherheitstechnik?</dt>
              <dd className="mt-2 text-[oklch(0.32_0.02_260)]">
                Für hochfrequentierte Anlagen in Gewerbe- oder öffentlichen Objekten empfehlen wir eine halbjährliche präventive Wartung. Diese umfasst die Überprüfung der mechanischen Leichtgängigkeit, die Reinigung der optischen und elektronischen Sensoren, die Prüfung der Batteriestände sowie das Einspielen sicherheitsrelevanter Firmware-Updates. Für besonders kritische Infrastrukturen (KRITIS) bieten wir angepasste SLAs mit vierteljährlichen Intervallen und garantierten Reaktionszeiten von unter 4 Stunden an.
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      {/* 06 Öffnungszeiten als Schriftfeld, darunter die Verweise als Stückliste */}
      <Section tight tone="muted">
        <SectionHeading nummer="06" eyebrow="Erreichbarkeit" title="Öffnungszeiten" />

        <dl className="mt-12 max-w-md border-t border-border">
          {settings.openingHours.map((entry) => (
            <div
              key={entry.day}
              className="grid gap-1 border-b border-border py-3 sm:grid-cols-3 sm:gap-x-4"
            >
              <dt className="text-foreground-muted">{formatWeekday(entry.day)}</dt>
              <dd className="font-mono tabular-nums text-foreground sm:col-span-2">
                {entry.spans.length === 0
                  ? 'geschlossen'
                  : entry.spans.map((s) => `${s.from}–${s.to}`).join(' · ')}
              </dd>
            </div>
          ))}
        </dl>

        {weitereLinks.length > 0 && (
          <ul className="mt-12 border-t border-border">
            {weitereLinks.map((link) => (
              <li key={link.href} className="border-b border-border">
                <Link
                  href={link.href}
                  className="group flex min-h-touch items-center justify-between gap-4 py-4 text-body font-semibold text-primary"
                >
                  <span>{link.label}</span>
                  <GlyphPfeilRechts
                    size={18}
                    className="shrink-0 transition-transform duration-quick zeiger:group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
