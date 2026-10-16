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

export const metadata: Metadata = {
  title: 'Ratgeber',
  description:
    'Antworten auf die häufigsten Fragen rund um Autoschlüssel, Schlüssel, Schließtechnik und '
    + 'Einbruchschutz — jeweils mit einem klaren nächsten Schritt.',
  alternates: { canonical: '/ratgeber' },
};

export default async function RatgeberPage() {
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
