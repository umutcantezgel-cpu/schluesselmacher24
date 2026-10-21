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
import { ServiceTierCalculator } from '@/components/calculator/service-tier-calculator';
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

export default async function ServiceUndTerminPage(_props: { params: Promise<unknown>; searchParams: Promise<unknown> }) {
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
                      Unser Prozess ist in streng definierte Phasen unterteilt, die von der initialen Bestandsaufnahme bis zur finalen Abnahme und Dokumentation reichen.
                    </p>
                    <p className="mt-4">
                      Die Bestandsaufnahme bildet das Fundament jedes erfolgreichen Sicherheitsprojekts. Unsere Experten führen vor Ort eine detaillierte Schwachstellenanalyse durch, die weit über das Offensichtliche hinausgeht. Wir prüfen nicht nur die physische Beschaffenheit von Türen, Fenstern und Zugangswegen, sondern analysieren auch organisatorische Abläufe, bestehende Sicherheitsrichtlinien und potenzielle Angriffsvektoren.
                    </p>
                    <p className="mt-4">
                      In der anschließenden Planungsphase übersetzen wir diese Erkenntnisse in ein kohärentes Sicherheitskonzept. Dabei berücksichtigen wir:
                    </p>
                    <ul className="mt-4 list-disc space-y-2 pl-6 text-body text-foreground-muted">
                      <li><strong>Mechanische Grundsicherung:</strong> Festlegung der erforderlichen Widerstandsklassen (RC-Klassen) gemäß DIN EN 1627.</li>
                      <li><strong>Zutrittskontrolle:</strong> Definition von Berechtigungskonzepten und Auswahl geeigneter Identifikationsmedien (RFID, Biometrie, Mobile Access).</li>
                      <li><strong>Brandschutz und Fluchtwege:</strong> Integration von Panikschlössern und Fluchttürsteuerungen gemäß DIN EN 179 und DIN EN 1125.</li>
                      <li><strong>Integration:</strong> Nahtlose Einbindung in bestehende Gebäudeleittechnik oder Alarmsysteme.</li>
                    </ul>
                    <p className="mt-4">
                      Das Resultat ist ein detailliertes, modular aufgebautes Konzept, das Ihnen volle Transparenz über die empfohlenen Maßnahmen und die damit verbundenen Investitionen bietet. Wir legen großen Wert darauf, dass Sie jede Entscheidungsebene nachvollziehen können.
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
                    </p>
                    <p>
                      Bei mechanischen Zylindern achten wir auf Merkmale wie Bohr- und Ziehschutz, patentierte Schlüsselprofile (um illegale Kopien zu verhindern) und modulare Bauweisen, die nachträgliche Längenanpassungen ermöglichen. Im Bereich der Elektronik empfehlen wir Systeme mit verschlüsselter Kommunikation (z.B. MIFARE DESFire EV2/EV3, Bluetooth Low Energy mit AES-128-Verschlüsselung) und ausfallsichere Systeme, die auch bei Stromausfall eine definierte Grundsicherheit gewährleisten. Die nahtlose Verzahnung von Mechanik und Elektronik (Mechatronik) bildet oft den Kern unserer fortschrittlichsten Lösungen.
                    </p>
                    <h4 className="mt-6 font-semibold text-foreground">Vergleich: Mechanik vs. Elektronik</h4>
                    <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-surface-muted text-foreground-muted">
                          <tr>
                            <th className="px-4 py-3 font-medium">Eigenschaft</th>
                            <th className="px-4 py-3 font-medium">Reine Mechanik</th>
                            <th className="px-4 py-3 font-medium">Mechatronik / Elektronik</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-foreground">
                          <tr>
                            <td className="px-4 py-3">Initialkosten</td>
                            <td className="px-4 py-3">Gering bis mittel</td>
                            <td className="px-4 py-3">Mittel bis hoch</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3">Schlüsselverlust</td>
                            <td className="px-4 py-3">Zylindertausch notwendig</td>
                            <td className="px-4 py-3">Einfache Sperrung per Software</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3">Wartung</td>
                            <td className="px-4 py-3">Gelegentliches Schmieren</td>
                            <td className="px-4 py-3">Batteriewechsel, Software-Updates</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3">Protokollierung</td>
                            <td className="px-4 py-3">Nicht möglich</td>
                            <td className="px-4 py-3">Wer, wann, wo (DSGVO-konform konfigurierbar)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-4">
                      Unsere Zulieferer und Partner wählen wir nach strengen Qualitätskriterien aus. Wir verbauen ausschließlich Komponenten von Herstellern, die eine langjährige Ersatzteilversorgung garantieren und höchste Standards in der Fertigungspräzision erfüllen.
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
                    <h4 className="mt-6 font-semibold text-foreground">Service-Level-Agreements (SLA)</h4>
                    <p className="mt-2">
                      Um den reibungslosen Betrieb sicherzustellen, bieten wir verschiedene Service-Level an, die auf die Kritikalität Ihrer Infrastruktur abgestimmt sind. Unsere SLAs definieren verbindliche Reaktionszeiten im Störungsfall, Turnusse für präventive Wartungsarbeiten und Modalitäten für Software- und Firmware-Upgrades.
                    </p>
                    <ul className="mt-4 list-disc space-y-2 pl-6 text-body text-foreground-muted">
                      <li><strong>Basis-Wartung:</strong> Jährliche Inspektion und Funktionsprüfung.</li>
                      <li><strong>Proaktive Wartung:</strong> Inklusive Batteriemanagement für elektronische Zylinder und garantierter Ersatzteilverfügbarkeit.</li>
                      <li><strong>Full-Service:</strong> 24/7 Rufbereitschaft, garantierte Reaktionszeiten &lt; 4 Stunden, unlimitierte Vor-Ort-Einsätze bei Hardwaredefekten.</li>
                    </ul>
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
                    <p className="mt-4">
                      Besonderes Augenmerk legen wir auf die Konformität mit gesetzlichen und regulatorischen Vorgaben (Compliance). Bei der Implementierung elektronischer Zutrittssysteme in sensiblen Bereichen unterstützen wir Sie bei der Erstellung von Verfahrensverzeichnissen und der datenschutzkonformen Konfiguration (Privacy by Design).
                    </p>
                    <p className="mt-4">
                      Für Filialisten und dezentrale Organisationen realisieren wir Cloud-basierte Management-Plattformen, die eine zentrale Verwaltung von Berechtigungen über mehrere Standorte hinweg ermöglichen, ohne Kompromisse bei der Sicherheit einzugehen.
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
        <div className="mt-12 max-w-3xl">
          <ServiceTierCalculator />
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
