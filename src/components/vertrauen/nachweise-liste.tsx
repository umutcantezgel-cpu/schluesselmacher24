import type { Nachweis } from '@/lib/data/nachweise';
import { formatDateShort } from '@/lib/format';
import { cn } from '@/lib/cn';
import { GlyphPruefsiegel } from '@/components/visual/glyphen/pruefsiegel';

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
 * Haarlinien statt Kästen; die Angaben stehen wie Maße im Fließtext.
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
      <Ueberschrift className="text-title-sm font-semibold text-foreground">{titel}</Ueberschrift>

      <ul className="mt-4 divide-y divide-border border-y border-border">
        {nachweise.map((nachweis) => (
          <li key={nachweis.id} className="flex items-start gap-3 py-3.5">
            <GlyphPruefsiegel size={18} className="mt-0.5 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-body font-semibold leading-snug text-foreground">{nachweis.titel}</p>
              <dl className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-small leading-relaxed text-foreground-muted">
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
                    <dd className="font-mono tabular-nums">
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
