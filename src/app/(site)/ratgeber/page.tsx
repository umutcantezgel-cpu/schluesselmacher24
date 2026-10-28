import type { Metadata } from 'next';
import Link from 'next/link';

import { cn } from '@/lib/cn';
import { getGuides } from '@/lib/data';
import { NAV_AREAS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { AreaScope } from '@/components/visual/area-scope';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { GuideFinder } from '@/components/calculator/guide-finder';

export const metadata: Metadata = {
  title: 'Ratgeber',
  description:
    'Antworten auf die häufigsten Fragen rund um Autoschlüssel, Schlüssel, Schließtechnik und '
    + 'Einbruchschutz — jeweils mit einem klaren nächsten Schritt.',
  alternates: { canonical: '/ratgeber' },
};

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RatgeberPage({ params, searchParams }: Props) {
  await params;
  await searchParams;
  const guides = await getGuides();

  // Nach Themenbereich gruppieren, damit die Übersicht der Navigation folgt.
  const grouped = NAV_AREAS.map((area) => ({
    area,
    guides: guides.filter((g) => g.topic === area.key),
  })).filter((group) => group.guides.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Ratgeber"
        title="Antworten auf die häufigsten Fragen"
        lead="Jeder Beitrag beantwortet eine konkrete Frage und sagt Ihnen, was Sie danach tun können."
        crumbs={[{ href: '/ratgeber', label: 'Ratgeber' }]}
      />

      {/* Register: je Bereich eine Zeile – links Nummer, Fach-Icon und Bereich, rechts seine Beiträge.
          Ruhig und dicht wie ein Inhaltsverzeichnis; ganze Beitragszeilen sind Links. */}

      {/* 01 Fachwissen & Ratgeber-Strategie */}
      <Section tone="sunken" id="strategie">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
            Fachwissen strukturiert: Unsere Ratgeber-Strategie
          </h2>
          <div className="mt-8 space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
            <p>
              In einer zunehmend komplexen Welt der Sicherheitstechnik und Schließanlagen ist fundiertes
              Fachwissen unerlässlich. Unser Ratgeber ist nicht einfach nur eine Sammlung von Artikeln;
              er repräsentiert unsere gebündelte, jahrzehntelange Erfahrung aus der Praxis. Jeder Beitrag
              ist so strukturiert, dass er nicht nur theoretisches Wissen vermittelt, sondern Ihnen
              stets einen konkreten, handlungsorientierten nächsten Schritt aufzeigt.
            </p>
            <p>
              Wir verstehen, dass die Anforderungen an Sicherheit und Zutrittskontrolle höchst
              individuell sind. Ob es um die Absicherung privater Wohnräume, die komplexe Strukturierung
              gewerblicher Schließanlagen oder die neuesten Entwicklungen in der Mechatronik geht –
              unser Ziel ist es, Ihnen die technologischen Zusammenhänge transparent und verständlich
              aufzubereiten.
            </p>
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-8">
              Systematische Herangehensweise an Sicherheit
            </h3>
            <p>
              Ein effektives Sicherheitskonzept beginnt immer mit einer gründlichen Bestandsaufnahme und
              Risikoanalyse. Unsere Ratgeber-Beiträge begleiten Sie durch diesen Prozess. Sie erfahren,
              wie mechanische und elektronische Komponenten optimal ineinandergreifen, um ein
              maßgeschneidertes Sicherheitsnetz zu weben. Wir beleuchten Themen wie Manipulationsschutz,
              Not- und Gefahrenfunktionen bei Zylindern sowie die Vorteile modularer
              Systemarchitekturen.
            </p>
            <p>
              Darüber hinaus legen wir großen Wert auf das Lebenszyklus-Management Ihrer Systeme.
              Sicherheit ist kein statischer Zustand, sondern ein kontinuierlicher Prozess. Wir zeigen
              Ihnen, wie Sie durch regelmäßige Wartung, vorausschauende Planung und rechtzeitige Upgrades
              die Integrität Ihrer Schließanlagen und Sicherheitstechnik über viele Jahre hinweg
              gewährleisten.
            </p>
          </div>
        </div>
      </Section>

      {/* 02 Interaktiver Guide-Finder */}
      <Section id="guide-finder">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-8">
            Interaktiver Ratgeber-Finder
          </h2>
          <p className="text-[oklch(0.32_0.02_260)] mb-8 max-w-2xl leading-relaxed">
            Nutzen Sie unseren interaktiven Finder, um zielgenau die für Ihre aktuelle Situation
            relevantesten Fachbeiträge und Lösungsansätze zu identifizieren.
          </p>
          <GuideFinder />
        </div>
      </Section>

      {/* 03 Methodik & Qualitätsanspruch */}
      <Section tone="muted">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)]">
            Methodik und redaktioneller Qualitätsanspruch
          </h2>
          <div className="mt-6 space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
            <p>
              Alle in diesem Ratgeber veröffentlichten Inhalte unterliegen einem strengen, mehrstufigen
              Prüfprozess. Unsere Experten aus den Bereichen Mechanik, Elektronik und physischer
              Sicherheit stellen sicher, dass jede Information den aktuellen DIN-Normen und anerkannten
              Regeln der Technik entspricht.
            </p>
            <p>
              Wir verzichten bewusst auf oberflächliche Trend-Analysen und fokussieren uns stattdessen
              auf bewährte, zertifizierte Systeme und zukunftssichere Technologien, die sich im harten
              Praxiseinsatz bewährt haben. Ihre Sicherheit duldet keine Kompromisse, und genau diesen
              Anspruch spiegelt die Tiefe und Präzision unserer Fachbeiträge wider.
            </p>
          </div>
        </div>
      </Section>

      {/* 04 Häufig gestellte Fragen (FAQ) */}
      <Section id="faq">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
            Häufig gestellte Fragen (FAQ)
          </h2>
          <div className="mt-8 space-y-8">
            <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
              <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">
                Wie oft werden die Ratgeber-Inhalte aktualisiert?
              </h3>
              <p className="mt-3 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Unsere Redaktion und unsere Fachexperten überprüfen die Inhalte fortlaufend. Sobald sich
                relevante DIN-Normen ändern, neue technologische Standards (wie bei Bluetooth-Verschlüsselung
                oder Mifare DESFire) etablieren oder neue gesetzliche Vorgaben zum Datenschutz in Kraft
                treten, passen wir die entsprechenden Beiträge umgehend an. So garantieren wir stets
                höchste Aktualität und Verlässlichkeit.
              </p>
            </div>

            <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
              <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">
                Ersetzen die Artikel eine professionelle Beratung vor Ort?
              </h3>
              <p className="mt-3 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Nein. Der Ratgeber dient der fundierten Erstinformation und der Vorbereitung. Die
                Sicherheitsanforderungen jedes Objekts sind einzigartig. Faktoren wie Wandbeschaffenheit,
                Umgebungsbedingungen und spezifische Nutzerstrukturen können nur durch eine
                Sicherheitsanalyse vor Ort seriös beurteilt werden. Der Ratgeber hilft Ihnen jedoch, die
                richtigen Fragen zu stellen und Lösungsansätze besser zu bewerten.
              </p>
            </div>

            <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
              <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">
                Wie verlässlich sind die genannten Kostenrichtwerte in den Beiträgen?
              </h3>
              <p className="mt-3 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Sofern in den Ratgeber-Beiträgen Kostenrichtwerte genannt werden, basieren diese auf
                unseren Erfahrungswerten aus hunderten abgeschlossenen Projekten. Es handelt sich um
                realistische, marktübliche Spannen für hochwertige Markenprodukte inklusive
                fachgerechter Montage. Sie dienen als solide Budgetierungs-Grundlage, ein verbindliches
                Angebot erfordert jedoch immer eine detaillierte Objektbegehung.
              </p>
            </div>

            <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
              <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">
                Welche Vorkenntnisse benötige ich, um die Artikel zu verstehen?
              </h3>
              <p className="mt-3 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Wir bereiten selbst hochkomplexe Themen wie Verschlüsselungs-Algorithmen oder die
                Struktur von mechatronischen Generalhauptschlüssel-Anlagen so auf, dass sie auch für
                technische Laien verständlich sind. Fachbegriffe werden stets im Kontext erklärt. Sollten
                trotzdem Fragen offen bleiben, steht Ihnen unser Experten-Team jederzeit für Rückfragen
                zur Verfügung.
              </p>
            </div>

            <div className="pb-6">
              <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">
                Kann ich spezifische Themen für zukünftige Beiträge vorschlagen?
              </h3>
              <p className="mt-3 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Absolut. Ein Großteil unserer Beiträge entsteht aus den konkreten Fragen unserer Kunden
                im Beratungsalltag. Wenn Sie ein spezifisches Sicherheitsthema vermissen oder eine
                vertiefende Analyse zu einer bestimmten Technologie (z.B. Integration von Smart-Home-Systemen)
                wünschen, freuen wir uns über Ihre Anregungen via E-Mail oder Kontaktformular.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="ratgeber-register">
        <h2 id="ratgeber-register" className="sr-only">
          Beiträge nach Bereich
        </h2>
        <ol className="border-t border-border">
          {grouped.map((group, index) => (
            <li key={group.area.key} className="border-b border-border">
              <AreaScope area={group.area.key}>
                <div className="grid gap-x-gutter gap-y-4 py-8 lg:grid-cols-12">
                  <div className="flex items-start gap-4 lg:col-span-4">
                    <span className="w-6 pt-1 font-mono text-caption tabular-nums text-foreground-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <BereichIcon area={group.area.key} size={40} className="shrink-0 text-area-strong" />
                    <h3 className="pt-1.5 text-title font-semibold text-foreground">{group.area.label}</h3>
                  </div>

                  <ul className="lg:col-span-8">
                    {group.guides.map((guide, guideIndex) => (
                      <li key={guide.id} className={cn(guideIndex > 0 && 'border-t border-border')}>
                        <Link
                          href={`/ratgeber/${guide.slug}`}
                          className={cn('group flex flex-col gap-2', guideIndex > 0 ? 'py-5' : 'pb-5 lg:pt-1')}
                        >
                          <span className="flex items-start justify-between gap-3">
                            <span className="text-title-sm font-semibold text-foreground group-hover:text-primary">
                              {guide.title}
                            </span>
                            <GlyphPfeilRechts
                              size={18}
                              className="mt-1 shrink-0 text-primary transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1"
                            />
                          </span>
                          <span className="max-w-measure text-small text-foreground-muted">{guide.excerpt}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </AreaScope>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
