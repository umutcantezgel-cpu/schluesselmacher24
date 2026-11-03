import Link from 'next/link';

import { AreaScope } from '@/components/visual/area-scope';
import { FachIcon, fachIconKomponente } from '@/components/visual/fach-icon';
import { rubrikUebergang, Seitenwechsel } from '@/components/visual/motion/seitenwechsel';
import { cn } from '@/lib/cn';
import type { Rubrik } from '@/lib/types';

export { rubrikUebergang };

/**
 * Eine Kachel des Intent-Hubs (K-013): Fach-Icon, Laienname, bei Bedarf die Laienerklärung
 * (`zusatz`, G-09). Die ganze Fläche ist der Link. Leuchten bei Hover und Fokus (B-30), Druck beim
 * Tippen (B-34); beides nur bei „Bewegung an“, die ruhige Fassung zeigt Rahmen und Ring.
 *
 * Zeichensprache (A-025): Das Icon steht in der Tinte der Seite (`data-area="allgemein"`), erst
 * Hover und Fokus holen die Bereichsfarbe der Rubrik hinein (`.hub-tinte` in globals.css). Die
 * Leitkachel (`leit`) ist mobil eine gleich große, getönte Kachel und ab 768 px eine Fläche über
 * zwei Spalten und zwei Reihen mit der Erklärung der Rubrik.
 */
export function HubKachel({ rubrik, leit = false }: { rubrik: Rubrik; leit?: boolean }) {
  const mitIcon = Boolean(fachIconKomponente(rubrik.icon));
  return (
    <li className={cn('flex', leit && 'md:col-span-2 md:row-span-2')}>
      <AreaScope area={rubrik.bereich}>
        <Link
          href={rubrik.ziel}
          prefetch={false}
          data-rubrik={rubrik.id}
          data-leit={leit ? 'ja' : undefined}
          className={cn(
            'group flex min-h-24 w-full flex-col items-center gap-1.5 rounded-lg border px-1.5 pb-2.5 pt-3 text-center transition duration-quick ease-standard hover:border-area-strong focus-visible:border-area-strong bewegt:hover:shadow-leuchten bewegt:focus-visible:shadow-leuchten bewegt:active:scale-kachel bewegt:active:shadow-leuchten-druck md:items-start md:gap-2 md:px-4 md:pb-4 md:pt-4 md:text-left',
            leit ? 'border-area/40 bg-area-soft md:gap-2 md:p-5' : 'border-border bg-surface',
          )}
        >
          {mitIcon && (
            <span data-area="allgemein" className="hub-tinte contents">
              <Seitenwechsel name={rubrikUebergang(rubrik.id)}>
                <FachIcon
                  name={rubrik.icon}
                  size={32}
                  className={cn('shrink-0 text-area-strong transition-colors duration-quick md:size-10', leit && 'md:size-14')}
                />
              </Seitenwechsel>
            </span>
          )}
          <span
            className={cn(
              'trennung-kachel text-small font-semibold leading-snug text-foreground md:text-title-sm',
              leit && 'md:mt-auto md:text-title',
            )}
          >
            {rubrik.laienname}
          </span>
          {rubrik.zusatz && (
            <span className="trennung-kachel text-balance text-caption leading-snug text-foreground-muted md:text-small">{rubrik.zusatz}</span>
          )}
          {leit && rubrik.erklaerung && (
            <span className="hidden max-w-measure text-pretty text-small text-foreground-muted md:block">{rubrik.erklaerung}</span>
          )}
        </Link>
      </AreaScope>
    </li>
  );
}
