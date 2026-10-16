import type { ReactNode } from 'react';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { Seitenwechsel, bereichsName } from '@/components/visual/motion/seitenwechsel';
import { Profillinie } from '@/components/visual/profillinie';
import type { AreaKey } from '@/lib/types';
import { cn } from '@/lib/cn';
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
  /** Leistungsbereich: zeigt sein Fach-Icon groß als Anker des Kopfes (Bereichsfarbe aus `data-area`). */
  bereich?: AreaKey;
  /**
   * Ansichtsart (KERN K-009): `erzaehl` (Standard) mit großer Überschrift und
   * sich zeichnender Profillinie; `arbeit` ruhig und kompakt für Abläufe,
   * Warenkorb, Kasse und Rechtstexte.
   */
  art?: 'erzaehl' | 'arbeit';
  /** Fachgrafik rechts neben dem Text (ersetzt das Fach-Icon des Bereichs). */
  visual?: ReactNode;
}

/** Einheitlicher Seitenkopf für alle Bereiche – als Kopf einer Werkstattzeichnung. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  crumbs,
  actions,
  children,
  bereich,
  art = 'erzaehl',
  visual,
}: PageHeaderProps) {
  const erzaehl = art === 'erzaehl';
  // Das Fach-Icon ist Ziel des Seitenwechsels aus dem Schnelleinstieg der Startseite (B-13).
  const anker =
    visual ??
    (bereich && erzaehl ? (
      <Seitenwechsel name={bereichsName(bereich)}>
        <BereichIcon area={bereich} size={112} className="text-area-strong" />
      </Seitenwechsel>
    ) : null);

  return (
    <header className="border-b border-border bg-surface">
      <div className={cn('shell', erzaehl ? 'py-section-tight' : 'py-8 md:py-10')}>
        {crumbs && crumbs.length > 0 && <Breadcrumbs crumbs={crumbs} className="mb-6" />}

        <div className={cn('grid gap-8', anker && 'lg:grid-cols-12 lg:items-center lg:gap-gutter')}>
          <div className={cn(anker && 'lg:col-span-8')}>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {erzaehl && <Profillinie text={title} className="mt-3 text-area" />}

            <h1
              className={cn(
                'font-bold text-foreground',
                erzaehl ? 'mt-4 text-display' : 'mt-3 text-headline',
                !eyebrow && 'mt-0',
              )}
            >
              {title}
            </h1>
            {lead && (
              <p className={cn('mt-4 max-w-measure text-foreground-muted', erzaehl ? 'text-lead' : 'text-body')}>{lead}</p>
            )}
            {actions && <div className="mt-7 flex flex-wrap items-center gap-3">{actions}</div>}
          </div>

          {anker && (
            <div className={cn('lg:col-span-4', visual ? '' : 'hidden justify-self-end lg:block')}>{anker}</div>
          )}
        </div>

        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  );
}
