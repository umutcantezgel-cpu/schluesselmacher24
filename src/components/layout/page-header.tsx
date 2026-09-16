import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from './breadcrumbs';

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  /** Aktionen, z. B. Schaltflächen. */
  actions?: ReactNode;
  /** Zusatzinhalt unter dem Text, z. B. Kennzahlen. */
  children?: ReactNode;
}

/** Einheitlicher Seitenkopf für alle Bereiche. */
export function PageHeader({ eyebrow, title, lead, crumbs, actions, children }: PageHeaderProps) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="shell py-8 md:py-12">
        {crumbs && crumbs.length > 0 && <Breadcrumbs crumbs={crumbs} className="mb-5" />}

        {eyebrow && (
          <p className="eyebrow">
            <span className="h-px w-6 bg-current" aria-hidden />
            {eyebrow}
          </p>
        )}

        <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-[1.75rem] font-bold leading-tight md:text-4xl">{title}</h1>
            {lead && (
              <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted md:text-lg">
                {lead}
              </p>
            )}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
        </div>

        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  );
}
