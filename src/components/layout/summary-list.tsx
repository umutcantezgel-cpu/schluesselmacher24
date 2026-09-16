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
          <p className="border-b border-border bg-surface-muted px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground-muted">
            {section.title}
          </p>
          <dl className="divide-y divide-border">
            {section.rows.map((row, index) => (
              <div key={`${row.label}-${index}`} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4">
                <dt className="text-[13px] font-semibold text-foreground-muted">{row.label}</dt>
                <dd className="text-[15px] text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
