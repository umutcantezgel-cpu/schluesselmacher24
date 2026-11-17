import type { Metadata } from 'next';
import Link from 'next/link';

import { cn } from '@/lib/cn';
import { getTutorials } from '@/lib/data';
import { NAV_AREAS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { SeitenDaten } from '@/components/seo/seiten-daten';
import { AreaScope } from '@/components/visual/area-scope';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

export async function generateMetadata(): Promise<Metadata> {
  const tutorials = await getTutorials();
  return {
    title: 'Tutorials',
    description:
      'Schritt für Schritt erklärt: Schlüssel richtig fotografieren, Profilzylinder messen, Schlüssel einschicken '
      + 'und weitere Fragen aus unseren Anfragewegen.',
    alternates: { canonical: '/tutorials' },
    // Ohne veröffentlichtes Tutorial hat die Übersicht keinen eigenen Inhalt (R3).
    ...(tutorials.length === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

/**
 * Übersicht der Tutorials (FA-INHALT-01, FA-21-01): nur veröffentlichte, nach Thema gruppiert wie der Ratgeber.
 * Jede Zeile ist ein Link auf die Seite des Tutorials.
 */
export default async function TutorialsPage() {
  const tutorials = await getTutorials();

  const gruppen = NAV_AREAS.map((area) => ({
    area,
    tutorials: tutorials.filter((tutorial) => tutorial.topic === area.key),
  })).filter((gruppe) => gruppe.tutorials.length > 0);

  // Sichtbare Brotkrumen, zugleich Grundlage der Strukturdaten (FA-SEO-01C).
  const crumbs = [{ href: '/tutorials', label: 'Tutorials' }];

  return (
    <>
      <SeitenDaten pfad="/tutorials" name="Schritt für Schritt erklärt" crumbs={crumbs} />
      <PageHeader
        eyebrow="Tutorials"
        title="Schritt für Schritt erklärt"
        lead="Kurze Anleitungen zu den Fragen, die bei Fotos, Maßen und Einsendung am häufigsten kommen. Jede beginnt mit der Antwort."
        crumbs={crumbs}
      />

      <Section labelledBy="tutorials-register">
        <h2 id="tutorials-register" className="sr-only">
          Tutorials nach Thema
        </h2>
        {gruppen.length === 0 ? (
          <p className="max-w-measure text-body text-foreground-muted">
            Zurzeit ist kein Tutorial veröffentlicht. Antworten auf häufige Fragen finden Sie im{' '}
            <Link href="/ratgeber" className="font-semibold text-primary underline-offset-4 hover:underline">
              Ratgeber
            </Link>
            .
          </p>
        ) : (
          <ol className="border-t border-border">
            {gruppen.map((gruppe, index) => (
              <li key={gruppe.area.key} className="border-b border-border">
                <AreaScope area={gruppe.area.key}>
                  <div className="grid gap-x-gutter gap-y-4 py-8 lg:grid-cols-12">
                    <div className="flex items-start gap-4 lg:col-span-4">
                      <span className="w-6 pt-1 font-mono text-caption tabular-nums text-foreground-muted">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <BereichIcon area={gruppe.area.key} size={40} className="shrink-0 text-area-strong" />
                      <h3 className="min-w-0 pt-1.5 text-title font-semibold text-foreground [overflow-wrap:anywhere]">{gruppe.area.label}</h3>
                    </div>

                    <ul className="lg:col-span-8">
                      {gruppe.tutorials.map((tutorial, tutorialIndex) => (
                        <li key={tutorial.id} className={cn(tutorialIndex > 0 && 'border-t border-border')}>
                          <Link
                            href={`/tutorials/${tutorial.slug}`}
                            className={cn('group flex flex-col gap-2', tutorialIndex > 0 ? 'py-5' : 'pb-5 lg:pt-1')}
                          >
                            <span className="flex items-start justify-between gap-3">
                              <span className="min-w-0 text-title-sm font-semibold text-foreground [overflow-wrap:anywhere] group-hover:text-primary">
                                {tutorial.title}
                              </span>
                              <GlyphPfeilRechts
                                size={18}
                                className="mt-1 shrink-0 text-primary transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1"
                              />
                            </span>
                            <span className="max-w-measure text-small text-foreground-muted">{tutorial.answer}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AreaScope>
              </li>
            ))}
          </ol>
        )}
      </Section>
    </>
  );
}
