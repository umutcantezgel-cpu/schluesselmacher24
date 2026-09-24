import { BadgeCheck } from 'lucide-react';

import type { Nachweis } from '@/lib/data/nachweise';
import { formatDateShort } from '@/lib/format';
import { cn } from '@/lib/cn';

export interface NachweiseListeProps {
  /** Aus `getNachweise()` — nur öffentliche, gültige Nachweise. */
  nachweise: Nachweis[];
  /** Überschrift über der Liste. */
  titel?: string;
  /** Überschriftenebene passend zur umgebenden Seite. */
  ebene?: 'h2' | 'h3';
  className?: string;
}

/**
 * Ruhige Liste der Nachweise: Bezeichnung, Art, Aussteller, Gültigkeit.
 *
 * Ohne Nachweise erscheint nichts — auch keine Überschrift, damit keine
 * leere Vertrauensaussage auf der Seite steht.
 */
export function NachweiseListe({
  nachweise,
  titel = 'Nachweise',
  ebene: Ueberschrift = 'h2',
  className,
}: NachweiseListeProps) {
  if (nachweise.length === 0) return null;

  return (
    <section className={cn('min-w-0', className)}>
      <Ueberschrift className="text-lg font-bold text-foreground">{titel}</Ueberschrift>

      <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-surface">
        {nachweise.map((nachweis) => (
          <li key={nachweis.id} className="flex items-start gap-3 px-4 py-3.5">
            <BadgeCheck size={18} aria-hidden className="mt-0.5 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold leading-snug text-foreground">{nachweis.titel}</p>
              <dl className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[13px] leading-relaxed text-foreground-muted">
                <div className="flex gap-1">
                  <dt>Art:</dt>
                  <dd>{nachweis.artLabel}</dd>
                </div>
                {nachweis.aussteller && (
                  <div className="flex gap-1">
                    <dt>Ausgestellt von:</dt>
                    <dd>{nachweis.aussteller}</dd>
                  </div>
                )}
                {nachweis.gueltigBis && (
                  <div className="flex gap-1">
                    <dt>Gültig bis:</dt>
                    <dd>
                      <time dateTime={nachweis.gueltigBis}>{formatDateShort(nachweis.gueltigBis)}</time>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
