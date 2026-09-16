import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getGuides } from '@/lib/data';
import { NAV_AREAS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';

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

      <Section>
        <div className="space-y-12">
          {grouped.map((group) => (
            <div key={group.area.key}>
              <h2 className="text-lg font-bold text-foreground">{group.area.label}</h2>
              <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {group.guides.map((guide) => (
                  <li key={guide.id}>
                    <Link
                      href={`/ratgeber/${guide.slug}`}
                      className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
                    >
                      <span className="text-[15px] font-bold text-foreground group-hover:text-primary">
                        {guide.title}
                      </span>
                      <span className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                        {guide.excerpt}
                      </span>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                        Lesen
                        <ArrowRight size={14} aria-hidden />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
