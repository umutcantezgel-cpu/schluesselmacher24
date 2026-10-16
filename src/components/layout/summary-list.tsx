import type { SummarySection } from '@/lib/types';
import { cn } from '@/lib/cn';

/**
 * Strukturierte Zusammenfassung — identisch im Kundenformular und im
 * Backend, damit beide Seiten dieselbe Sicht auf den Vorgang haben.
 */
export function SummaryList({
  sections,
  className,
}: {
  sections: SummarySection[];
  className?: string;
}) {
  if (sections.length === 0) return null;

  return (
    <div className={cn('space-y-5', className)}>
      {sections.map((section) => (
        <div key={section.title} className="overflow-hidden rounded-lg border border-border bg-surface">
          <p className="border-b border-border bg-surface-muted px-4 py-2.5 text-caption font-mono uppercase tracking-label text-foreground-muted">
            {section.title}
          </p>
          <dl className="divide-y divide-border">
            {section.rows.map((row, index) => (
              <div key={`${row.label}-${index}`} className="grid gap-1 px-4 py-3 sm:grid-cols-12 sm:gap-4">
                <dt className="text-small font-semibold text-foreground-muted sm:col-span-4">{row.label}</dt>
                <dd className="text-body text-foreground sm:col-span-8">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
